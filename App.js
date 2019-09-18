/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  NativeEventEmitter,
  NativeModules,
  Alert,
  Button,
  Platform,
  FlatList,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import BleManager from 'react-native-ble-manager'; // for talking to BLE peripherals
const BleManagerModule = NativeModules.BleManager;

const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

BleManager.enableBluetooth()
  .then(() => {
    Alert.alert('Bluetooth is already enabled');
  })
  .catch(error => {
    Alert.alert('You need to enable bluetooth to use this app.');
  });

BleManager.start({showAlert: false}).then(() => {
  Alert.alert('Module initialized');
});

const App = () => {
  const [is_scanning, setScanState] = useState(false);
  const [peripherals, setPheripherals] = useState([]);
  const [newDevice, setNewDevice] = useState();
  const addPeripheralsHandler = () => {
    if (newDevice != undefined) {
     
      setPheripherals([...peripherals, newDevice]);
    }
  };

  if (Platform.OS === 'android' && Platform.Version >= 23) {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ).then(result => {
      if (!result) {
        PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ).then(result => {
          if (!result) {
            Alert.alert(
              'You need to give access to coarse location to use this app.',
            );
          }
        });
      }
    });
  }
  bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', peripheral => {
    setNewDevice(peripheral);
    addPeripheralsHandler();
    // var peripherals = [];

    // peripherals.push(peripheral)
    console.log('total', peripherals);
  });

  bleManagerEmitter.addListener('BleManagerStopScan', () => {
    if (peripherals.length == 0) {
      console.log('Nothing found', 'Sorry, no peripherals were found');
    } else {
      console.log('Scan result is', peripherals);
    }
    setScanState(false);
    setPheripherals(peripherals);
    console.log('is_scanning', is_scanning);
  });

  const startScan = () => {
    setScanState(true);
    setPheripherals([]);
    BleManager.scan([], 5, false)
      .then(() => {
        Alert.alert('start scan2');
      })
      .catch(err => {
        Alert.alert(err);
      });
  };

  const Item = ({name})=>{
    return(
      <View >
      <Text >The id is {name}</Text>
    </View>
    )
  }

  let DeviceOutput = (
    <View>
      <Text>Devices</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Button title="Start Scan" onPress={startScan} />
      {DeviceOutput}
      <FlatList
        data={peripherals}
        renderItem={({item}) => (
          // <View><Text>{item.id}</Text></View>
         <Item name={item.id} />
         

        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default App;
