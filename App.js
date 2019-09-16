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
  FlatList,
  Alert,
  Button,
  Platform

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
.catch((error) => {
  Alert.alert('You need to enable bluetooth to use this app.');
});

BleManager.start({showAlert: false})
.then(() => {
  Alert.alert('Module initialized');
});




const App = () => {
const [is_scanning, setScanState] = useState(false)
const [peripherals, setPheripherals] = useState([])

if(Platform.OS === 'android' && Platform.Version >= 23){
  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
    if(!result){
      PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
        if(!result){
          Alert.alert('You need to give access to coarse location to use this app.');
        }
      });
    }
});
}
bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', (peripheral) => {
  console.log('peripheral',peripheral)
  // var peripherals = [];

  peripherals.push(peripheral)
  console.log('total',peripherals)
  
  //  setPheripherals(peripherals)
//   var peripherals = []; // get the peripherals
//   // check if the peripheral already exists 
//  console.log('pheriphals',JSON.stringify(peripheral))
//   peripherals.push({
//       id: peripheral.id, // mac address of the peripheral
//       name: peripheral.name // descriptive name given to the peripheral
//     });
//     peripherals = peripherals; 
  // var el = peripherals.filter((el) => {
  //   return el.id === peripheral.id;
  // });

  // if(!el.length){
  //   peripherals.push({
  //     id: peripheral.id, // mac address of the peripheral
  //     name: peripheral.name // descriptive name given to the peripheral
  //   });
  //   peripherals = peripherals; // update the array of peripherals
  // }
});

bleManagerEmitter.addListener(
  'BleManagerStopScan',
  () => {
   
    if(peripherals.length == 0){
      console.log('Nothing found', "Sorry, no peripherals were found");
    }else{
      console.log('Scan result is',peripherals)
    }
    setScanState(false)
    setPheripherals(peripherals)
    console.log('is_scanning',is_scanning)
   
  }
);

const startScan = () =>{
 
  setScanState(true)
  setPheripherals([])
    BleManager.scan([], 5, false)
      .then(() => { 
        Alert.alert('start scan2')
      }).catch((err)=>{
        Alert.alert(err)
      });

}
let DeviceOutput;
// if (peripherals>) {
//   DeviceOutput = (
//     <Text>{peripherals}</Text>
//   )
// }else{
//   DeviceOutput = (
//     <Text>No devices detected</Text>
//   )
// }
DeviceOutput = (<View><Text>{is_scanning}</Text></View>)
  return (
    <View style={styles.container}>
      <Button title='Start Scan' onPress={startScan}/>
   {DeviceOutput}
    </View>
  );
};

const styles = StyleSheet.create({
 container:{
  padding:10
 }
});

export default App;
