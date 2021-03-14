import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, BackHandler } from 'react-native';
import { Button, Label } from 'native-base';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import {updateSessionId} from '../../redux/actions';
import lobsterController from '../../controller/LobsterController';
import BluetoothManager, {ActionStatus} from '../../bluetooth/BluetoothManager';
import { MAIN_TABS_ROUTE } from '../../navigation/routes';

// Load Sound Player
const Sound = require('react-native-sound');
Sound.setCategory('Alarm');
const successSound = new Sound('success_sound_3.mp3', Sound.MAIN_BUNDLE);
const failSound = new Sound('fail_sound_2.mp3', Sound.MAIN_BUNDLE);
successSound.setVolume(0.1);
failSound.setVolume(0.1);
successSound.setPan(1);
failSound.setPan(1);

// Desk Position
const DESK_POSITION_SITTING = "0";
const DESK_POSITION_STANDING = "1";

class Timer extends React.Component {
  state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
  }

  componentDidUpdate(prevProps) {
    if (this.props.active && this.props.active !== prevProps.active) {
      this.timerTick = setInterval(() => {
        const { hours, seconds, minutes } = this.state;

        if (seconds < 59) {
            this.setState({seconds: seconds + 1});
        } else {
            if (minutes < 59)                
              this.setState({minutes: minutes + 1, seconds: 0});
            else
              this.setState({hours: hours + 1, minutes: 0, seconds: 0});
        }
      }, 1000);

      if (this.props.onHalfMinuteMark) this.halfMinuteMark = setInterval(() => this.props.onHalfMinuteMark(), 30000);
    }
  }

  componentWillUnmount() {
    this.timerTick && clearInterval(this.timerTick);
    this.halfMinuteMark && clearInterval(this.halfMinuteMark);
  }

  render() {
    const {hours, minutes, seconds} = this.state;
    const format = new Intl.NumberFormat("en-IN", {minimumIntegerDigits: 2});

    return(
      <Text style={{...this.props.style, color: 'gray', fontSize: 16, fontWeight: 'bold'}}>{`${hours > 0 ? format.format(hours) + ':' : ''}${format.format(minutes)}:${format.format(seconds)}`}</Text>
    )
  }
}

class WorkSession extends React.Component {
    state = {
      imgCount: 0,
      imgFailCount: 0,
      startingWorkSession: false,
      confirmEndSession: false,
      confirmMoveDesk: false,
      confirmDeskPosition: false,
      workSessionSetupFailed: false,
      moveDeskStatus: ActionStatus.INACTIVE,
    }

    componentDidMount() {
      this.setState({startingWorkSession: true});
      lobsterController.startSession(this.props.userId).then(result => {
          this.setState({startingWorkSession: false});
          this.props.updateSessionId(result.data.session.id);
          successSound.play();
          this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.setState({confirmEndSession: true});
            return true;
          });
      })
      .catch(() => this.setState({workSessionSetupFailed: true}));
    }

    componentWillUnmount() {
      this.backHandler && this.backHandler.remove();
      BluetoothManager.disconnect();
    }

    takePicture = async () => {
        if (this.camera) {
          const data = await this.camera.takePictureAsync({ quality: 0.5, base64: true, fixOrientation: true });
          lobsterController.sendImage(this.props.userId, this.props.sessionId, data.base64)
          .then(() => this.setState({imgCaptureFailed: false, imgCount: this.state.imgCount + 1}))
          .catch(() => {
            const imgFailCount = this.state.imgFailCount + 1;
            if(imgFailCount === 3) {
              this.setState({imgCaptureFailed: true, imgFailCount: 0});
              failSound.play();
            } else
              this.setState({imgFailCount});
          });
        }
    }

    moveDesk = (deskPosition) => {
      this.setState({moveDeskStatus: ActionStatus.IN_PROGRESS});
      BluetoothManager.writeMessagePromise(deskPosition)
      .then(() => this.setState({moveDeskStatus: ActionStatus.SUCCESS, confirmDeskPosition: false}))
      .catch(() => this.setState({moveDeskStatus: ActionStatus.FAIL}));
    }

    render() {
        const { imgCount, startingWorkSession, imgCaptureFailed, moveDeskStatus, confirmDeskPosition, workSessionSetupFailed } = this.state;
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Dimensions.get('window').height;

        return (
          <View style={styles.container}>
                <View style={{justifyContent: 'center'}}>
                  <Text style={{marginLeft: 4, fontSize: 24, fontWeight: 'bold', color: '#2B088E'}}>Work Session</Text>
                  {imgCaptureFailed && (<Text style={{position: 'absolute', right: 4, paddingBottom: 14, fontSize: 12, fontWeight: 'bold', color: '#A30020'}}>Please Ensure Full Body is in Frame</Text>)}
                  <View>
                    <Text style={{marginLeft: 8, fontSize: 16, fontWeight: 'bold', color: '#A30020'}}>In Progress</Text>
                    <View style={{position: 'absolute', right: 4}}>
                      <Timer style={{textAlign: 'right'}} active={!startingWorkSession} onHalfMinuteMark={this.takePicture} />
                      <Text style={{textAlign: 'right', color: 'gray', fontSize: 12, fontWeight: 'bold'}}>{imgCount > 0 ? `${imgCount} Image${imgCount > 1 ? 's' : ''} Captured` : 'No Images Yet'}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cameraContainer}>
                    <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={{...styles.preview, top: windowWidth / 5, width: windowWidth - 48, height: windowHeight / 1.4}}
                    type={RNCamera.Constants.Type.front}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    />
                </View>
                <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
                  <TouchableOpacity style={styles.button} onPress={() => this.setState({confirmEndSession: true})}>
                    <Text style={styles.buttonText}>End Work Session</Text>
                  </TouchableOpacity>
                  {this.props.deskConnected ? (
                    <TouchableOpacity style={{position: 'absolute', width: '100%', bottom: 20}} onPress={() => this.setState({confirmMoveDesk: true})}>
                      <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Move Desk?</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{position: 'absolute', width: '100%', bottom: 20}}>
                      <Text style={{fontWeight: 'bold', alignSelf: 'center', fontSize: 12}}>No Desk in Session 😞</Text>
                    </View>
                  )}
                </View>
                {startingWorkSession && (
                  <View style={{...styles.popUpBackground, width: windowWidth, height: windowHeight}}>
                      {!workSessionSetupFailed ? (
                        <View style={styles.settingUpPopUpContainer}>
                          <Text style={{color: 'black', fontWeight: 'bold', position: 'absolute', left: 24,}}>Setting up Work Session...</Text>
                        </View>
                      ) : (
                        <View style={styles.smallPopUpContainer}>
                          <Text style={{color: '#A30020', fontWeight: 'bold'}}>Failed to Setup Work Session. Please try again later.</Text>
                          <View style={{position: 'relative', flex: 1, flexDirection: 'column', marginTop: 24}}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate(MAIN_TABS_ROUTE)} style={{position: 'absolute', left: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '100%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                              <Text style={{fontWeight: 'bold'}}>OK</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                  </View>
                )}
                {this.state.confirmEndSession && (
                  <View style={{...styles.popUpBackground, width: windowWidth, height: windowHeight}}>
                      <View style={styles.smallPopUpContainer}>
                        <Text style={{color: 'black', fontWeight: 'bold'}}>Are you sure you want to end work session?</Text>
                        <View style={{position: 'relative', flex: 1, flexDirection: 'column', marginTop: 24}}>
                          <TouchableOpacity onPress={() => this.setState({confirmEndSession: false})} style={{position: 'absolute', left: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '48%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>No</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate(MAIN_TABS_ROUTE)} style={{position: 'absolute', right: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '48%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>Yes</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                  </View>
                )}
                {this.state.confirmMoveDesk && (
                  <View style={{...styles.popUpBackground, width: windowWidth, height: windowHeight}}>
                      <View style={styles.smallPopUpContainer}>
                        <Text style={{color: 'black', fontWeight: 'bold'}}>Are you sure you want to move desk?</Text>
                        <View style={{position: 'relative', flex: 1, flexDirection: 'column', marginTop: 24}}>
                          <TouchableOpacity onPress={() => this.setState({confirmMoveDesk: false})} style={{position: 'absolute', left: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '48%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>No</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.setState({confirmMoveDesk: false, confirmDeskPosition: true})} style={{position: 'absolute', right: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '48%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>Yes</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                  </View>
                )}
                {confirmDeskPosition && (
                  <View style={{...styles.popUpBackground, width: windowWidth, height: windowHeight}}>
                    {moveDeskStatus === ActionStatus.IN_PROGRESS ? (
                      <View style={styles.settingUpPopUpContainer}>
                        <Text style={{color: 'black', fontWeight: 'bold'}}>Moving Desk...</Text>
                      </View>
                    ) : moveDeskStatus === ActionStatus.FAIL ? (
                      <View style={styles.smallPopUpContainer}>
                        <Text style={{color: '#A30020', fontWeight: 'bold'}}>Failed to Move Desk. Please try again later.</Text>
                        <View style={{position: 'relative', flex: 1, flexDirection: 'column', marginTop: 24}}>
                          <TouchableOpacity onPress={() => this.setState({confirmDeskPosition: false})} style={{position: 'absolute', left: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '100%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>OK</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.smallPopUpContainer}>
                        <Text style={{color: 'black', fontWeight: 'bold'}}>Which position to move desk to?</Text>
                        <View style={{position: 'relative', flex: 1, flexDirection: 'column', marginTop: 24}}>
                          <TouchableOpacity onPress={() => this.moveDesk(DESK_POSITION_SITTING)} style={{position: 'absolute', left: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '48%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>Sitting</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.moveDesk(DESK_POSITION_STANDING)} style={{position: 'absolute', right: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '48%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>Standing</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                )}
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    marginHorizontal: 24,
    flexDirection: 'column',
    position: 'relative',
  },
  cameraContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    flexDirection: 'column',
  },
  preview: {
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {
    width: '100%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    bottom: 60,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 12,
    alignSelf: 'center',
    textAlignVertical: 'center',
    height: 60,
  },
  popUpBackground: {
    position: 'absolute',
    top: 0,
    marginLeft: -24,
    marginTop: -24,
    elevation: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  settingUpPopUpContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    height: '15%',
    width: '100%',
    padding: 12,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallPopUpContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    height: '15%',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
});

const mapStateToProps = (state) => ({
  userId: state.userId,
  sessionId: state.sessionId,
  deskConnected: state.deskConnected,
});

const mapDispatchToProps = (dispatch) => ({
	updateSessionId: (sessionId) => dispatch(updateSessionId(sessionId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkSession);
