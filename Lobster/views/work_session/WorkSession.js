import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, BackHandler } from 'react-native';
import { Button, Label } from 'native-base';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import {updateSessionId} from '../../redux/actions';
import lobsterController from '../../controller/LobsterController';
import BluetoothManager, {ActionStatus} from '../../bluetooth/BluetoothManager';
import { Buffer } from 'buffer';
import { MAIN_TABS_ROUTE } from '../../navigation/routes';

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
      if (this.props.onFiveMinuteMark) this.fiveMinuteMark = setInterval(() => this.props.onFiveMinuteMark(), 5*60000);
    }
  }

  componentWillUnmount() {
    debugger;
    this.timerTick && clearInterval(this.timerTick);
    this.halfMinuteMark && clearInterval(this.halfMinuteMark);
    this.fiveMinuteMark && clearInterval(this.fiveMinuteMark);
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
      startingWorkSession: false,
      confirmEndSession: false,
      confirmMoveDesk: false,
      showCurrentProgressSummary: false,
      moveDeskStatus: ActionStatus.INACTIVE,
    }

    componentDidMount() {
      this.setState({startingWorkSession: true});
      lobsterController.startSession(this.props.userId).then(result => {
          this.setState({startingWorkSession: false});
          debugger;
          this.props.updateSessionId(result.data.session.id);
          this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.setState({confirmEndSession: true});
            return true;
          });
      })
      .catch((error) => console.log(error));
    }

    componentWillUnmount() {
      this.backHandler && this.backHandler.remove();
    }

    takePicture = async () => {
        if (this.camera) {
          const data = await this.camera.takePictureAsync({ quality: 0.5, base64: true });
          debugger;
          lobsterController.sendImage(this.props.userId, this.props.sessionId, data.base64)
          .then(() => {
            this.setState({imgCount: this.state.imgCount + 1});
          })
          .catch(error => {
              console.log(error);
          });
        }
    }

    getSummary = () => {
      lobsterController.getLastFiveMinSummary(this.props.userId, this.props.sessionId)
      .then(response => {
        this.setState({showCurrentProgressSummary: true});
      })
      .catch(error => {
          console.log(error);
      });
    }

    moveDesk = () => {
      this.setState({moveDeskStatus: ActionStatus.IN_PROGRESS});
      BluetoothManager.writeMessagePromise("1")
      .then(() => this.setState({moveDeskStatus: ActionStatus.SUCCESS}))
      .catch(() => this.setState({moveDeskStatus: ActionStatus.FAIL}));
    };

    render() {
        const { imgCount, startingWorkSession, showCurrentProgressSummary } = this.state;
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Dimensions.get('window').height;

        return (
          <View style={styles.container}>
                <View style={{justifyContent: 'center'}}>
                  <Text style={{marginLeft: 4, fontSize: 24, fontWeight: 'bold', color: '#2B088E'}}>Work Session</Text>
                  <View>
                    <Text style={{marginLeft: 8, fontSize: 16, fontWeight: 'bold', color: '#A30020'}}>In Progress</Text>
                    <View style={{position: 'absolute', right: 4}}>
                      <Timer style={{textAlign: 'right'}} active={!startingWorkSession} onHalfMinuteMark={this.takePicture} onFiveMinuteMark={this.getSummary} />
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
                  <TouchableOpacity style={{position: 'absolute', width: '100%', bottom: 20}} onPress={() => this.setState({confirmMoveDesk: true})}>
                    <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Move Desk?</Text>
                  </TouchableOpacity>
                </View>
                {this.state.startingWorkSession && (
                  <View style={{...styles.popUpBackground, width: windowWidth, height: windowHeight}}>
                      <View style={styles.settingUpPopUpContainer}>
                        <Text style={{color: 'black', fontWeight: 'bold'}}>Setting up Work Session...</Text>
                      </View>
                  </View>
                )}
                {this.state.confirmEndSession && (
                  <View style={{...styles.popUpBackground, width: windowWidth, height: windowHeight}}>
                      <View style={{
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: 'white',
                        height: '15%',
                        width: '100%',
                        paddingHorizontal: 24,
                        paddingTop: 24,
                      }}>
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
                      <View style={{
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: 'white',
                        height: '15%',
                        width: '100%',
                        paddingHorizontal: 24,
                        paddingTop: 24,
                      }}>
                        <Text style={{color: 'black', fontWeight: 'bold'}}>Are you sure you want to move desk?</Text>
                        <View style={{position: 'relative', flex: 1, flexDirection: 'column', marginTop: 24}}>
                          <TouchableOpacity onPress={() => this.setState({confirmMoveDesk: false})} style={{position: 'absolute', left: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '48%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>No</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.moveDesk()} style={{position: 'absolute', right: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '48%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>Yes</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                  </View>
                )}
                {/* {showCurrentProgressSummary && (
                  <View style={{...styles.popUpBackground, width: windowWidth, height: windowHeight}}>
                      <View style={{
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: 'white',
                        height: '20%',
                        width: '100%',
                        paddingHorizontal: 24,
                        paddingTop: 24,
                      }}>
                        <Text style={{color: 'black', fontWeight: 'bold'}}>Performance So Far</Text>
                        <Text style={{color: 'black', fontWeight: 'bold'}}>Temp</Text>
                        <View style={{position: 'relative', flex: 1, flexDirection: 'column', marginTop: 24}}>
                          <TouchableOpacity onPress={() => this.setState({showCurrentProgressSummary: false})} style={{position: 'absolute', left: 0, right: 0, borderColor: 'black', borderWidth: 1, borderRadius: 5, width: '100%', height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold'}}>OK</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                  </View>
                )} */}
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
});

const mapStateToProps = (state) => ({
  userId: state.userId,
  sessionId: state.sessionId,
});

const mapDispatchToProps = (dispatch) => ({
	updateSessionId: (sessionId) => dispatch(updateSessionId(sessionId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkSession);
