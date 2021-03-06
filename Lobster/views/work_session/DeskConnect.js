import { Form, Item, Input, Label, Button } from 'native-base';
import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  WORK_SESSION,
} from '../../navigation/routes';
import {connect} from 'react-redux';
import {updateDeskConnection} from '../../redux/actions';
import BluetoothManager, {ActionStatus} from '../../bluetooth/BluetoothManager';

class DeskConnect extends React.Component {
  state = {
    scanStatus: ActionStatus.INACTIVE,
  }
  
  componentDidMount() {
    this.startScan();
  }

  startScan() {
    BluetoothManager.readValuePromise().then(() => {
      this.setState({scanStatus: ActionStatus.SUCCESS});
    })
    .catch(() => {
      this.setState({scanStatus: ActionStatus.IN_PROGRESS});
      BluetoothManager.scanForDevicePromise()
      .then(() => {
        this.setState({scanStatus: ActionStatus.SUCCESS});
        this.props.updateDeskConnection(true);
      })
      .catch(() => this.setState({scanStatus: ActionStatus.FAIL}));
    });
  }

  stopScan() {
    BluetoothManager.stopScan();
    this.setState({scanStatus: ActionStatus.FAIL});
  }

  render() {
    const {scanStatus} = this.state;
    const {navigation} = this.props;

    let statusTitle = 'Desk Connection';
    let statusSymbol = '🦞';
    let statusText = '';

    switch(scanStatus) {
      case ActionStatus.IN_PROGRESS:
        statusTitle = 'Looking for Desk...';
        statusText = 'Scanning...';
        break;
      case ActionStatus.SUCCESS:
        statusTitle = 'Success';
        statusSymbol = '🙏';
        statusText = 'Found Desk';
        break;
      case ActionStatus.FAIL:
        statusSymbol = '😞';
        statusText = 'Desk not found';
        break;
      default:
        break;
    }

    return (
      <View style={styles.view}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{statusTitle}</Text>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '45%'}}>
            <Text style={{fontWeight: 'bold', fontSize: 36}}>{statusSymbol}</Text>
            <Text style={{fontWeight: 'bold', fontSize: 14, marginLeft: 6, marginTop: 12}}>{statusText}</Text>
          </View>
          {scanStatus === ActionStatus.IN_PROGRESS ? (
            <TouchableOpacity style={{marginTop: '60%'}} onPress={() => this.stopScan()}>
              <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Cancel?</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={{...styles.button, marginTop: '60%'}} onPress={() => navigation.navigate(WORK_SESSION)}>
              <Text style={styles.buttonText}>{scanStatus === ActionStatus.SUCCESS ? 'Next' : 'Continue without Desk'}</Text>
            </TouchableOpacity>
          )}
          {scanStatus === ActionStatus.FAIL && (
            <TouchableOpacity style={{marginTop: -24}} onPress={() => this.startScan()}>
              <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>Try Again?</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '80%',
    position: 'absolute',
    top: '25%',
  },
  form: {
    width: '100%',
    marginTop: 25
  },
  item: {
    marginLeft: 0
  },
  itemLabel: {
    fontSize: 12
  },
  input: {
    paddingLeft: 0
  },
  title: {
    textAlign: 'left',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B088E',
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
  deskConnected: state.deskConnected,
});

const mapDispatchToProps = (dispatch) => ({
	updateDeskConnection: (deskConnect) => dispatch(updateDeskConnection(deskConnect)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(DeskConnect);