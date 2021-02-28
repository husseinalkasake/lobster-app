import {PermissionsAndroid} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {Buffer} from 'buffer';

const DEVICE_NAME = "DSD TECH";
const DEVICE_ID = "64:69:4E:3E:04:4D";
const DEVICE_SERVICE_ID = "0000ffe0-0000-1000-8000-00805f9b34fb";
const DEVICE_CHARACTERISTIC_ID = "0000ffe1-0000-1000-8000-00805f9b34fb";

const requestLocationPermission = async () => {
    let isGranted = false;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'The App needs location access for Bluetooth to work',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location Permission Given');
        isGranted = true;
      } else {
        console.log('Location Permission Denied');
      }
    } catch (err) {
      console.warn(err);
    }
    return isGranted;
  };

export default class BluetoothManager {
    static _bleManager = null;

    static initializeManager() {
        if (this._bleManager !== null) this._bleManager.destroy();
        this._bleManager = new BleManager();
    }

    static writeMessage(message) {
        this._bleManager
          .writeCharacteristicWithResponseForDevice(
            DEVICE_ID,
            DEVICE_SERVICE_ID,
            DEVICE_CHARACTERISTIC_ID,
            Buffer.from(message).toString('base64'),
          )
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.log(error);
          });
    }

    static readValue() {
      return this._bleManager.readCharacteristicForDevice(
        DEVICE_ID,
        DEVICE_SERVICE_ID,
        DEVICE_CHARACTERISTIC_ID
      )
      .catch((error) => {
        debugger;
      });
    }

    static async scanForDevice() {
        const locationAccessGranted = await requestLocationPermission();
        if (!locationAccessGranted) return;
        const subscription = this._bleManager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            this._bleManager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                console.log(error);
                return;
                }

                if (device.id === DEVICE_ID) {
                this._bleManager.stopDeviceScan();
        
                device
                    .connect()
                    .then((device) => {
                        console.log('successfully connected to DSD TECH');
                        return device.discoverAllServicesAndCharacteristics();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                }
            });
            subscription.remove();
        }
        }, true);
    }
}