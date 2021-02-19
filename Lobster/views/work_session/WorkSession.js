import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { Button, Label } from 'native-base';
import { RNCamera } from 'react-native-camera';
import { connect } from 'react-redux';
import {updateSessionId} from '../../redux/actions';
import lobsterController from '../../controller/LobsterController';

class Timer extends React.Component {
  state = {
      hours: 0,
      minutes: 59,
      seconds: 50,
      startingWorkSession: false,
  }
  
  componentDidMount() {
    this.setState({startingWorkSession: true});
    lobsterController.startSession(this.props.userId).then(() => {
        this.setState({startingWorkSession: false});
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
      this.halfMinuteMark = setInterval(() => this.props.onHalfMinuteMark && this.props.onHalfMinuteMark(), 30000);
    })
    .catch((error) => console.log(error));
}

  componentWillUnmount() {
      clearInterval(this.timerTick);
      clearInterval(this.halfMinuteMark);
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
    }

    takePicture = async () => {
        if (this.camera) {
          const options = { quality: 0.5, base64: true };
          const data = await this.camera.takePictureAsync(options);
          lobsterController.sendImage(this.props.userId, this.props.sessionId, data.base64)
          .then(response => {
            debugger;
            const temp = response;
            debugger;
          })
          .catch(error => {
              debugger;
              console.log(error);
          }).finally(() => this.setState({imgCount: this.state.imgCount + 1}));
        }
    }

    render() {
        const { imgCount } = this.state;
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Dimensions.get('window').height;

        return (
          <View style={styles.container}>
                <View style={{justifyContent: 'center'}}>
                  <Text style={{marginLeft: 4, fontSize: 24, fontWeight: 'bold', color: '#2B088E'}}>Work Session</Text>
                  <View>
                    <Text style={{marginLeft: 8, fontSize: 16, fontWeight: 'bold', color: '#A30020'}}>In Progress</Text>
                    <View style={{position: 'absolute', right: 4}}>
                      <Timer style={{textAlign: 'right'}} onHalfMinuteMark={this.takePicture} />
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
                    onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        console.log(barcodes);
                    }}
                    />
                </View>
                <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>End Work Session</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{position: 'absolute', width: '100%', bottom: 20}}>
                    <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Move Desk?</Text>
                  </TouchableOpacity>
                </View>
                {this.state.startingWorkSession && (
                  <View style={{position: 'absolute', top: 0, marginLeft: -24, marginTop: -24, height: windowHeight, width: windowWidth, elevation: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{position: 'relative',flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{backgroundColor: 'white', height: '25%', width: '80%', padding: 12}}>
                        <Text style={{color: 'black'}}>Setting up Work Session...</Text>
                      </View>
                    </View>
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
});

const mapStateToProps = (state) => ({
  userId: state.userId,
  sessionId: state.sessionId,
});

const mapDispatchToProps = (dispatch) => ({
	updateSessionId: (sessionId) => dispatch(updateSessionId(sessionId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkSession);
