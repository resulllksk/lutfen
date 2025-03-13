import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import BluetoothClassic from 'react-native-bluetooth-classic';
import { request, PERMISSIONS } from 'react-native-permissions';

const App = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

  useEffect(() => {
    const checkBluetoothPermission = async () => {
      const result = await request(PERMISSIONS.ANDROID.BLUETOOTH);
      if (result === 'granted') {
        fetchDevices();
      } else {
        Alert.alert('Bluetooth Permission', 'Bluetooth permission is required to use this feature.');
      }
    };

    checkBluetoothPermission();
  }, []);

  const fetchDevices = async () => {
    const pairedDevices = await BluetoothClassic.list();
    setDevices(pairedDevices);
  };

  const connectToDevice = async (device) => {
    await BluetoothClassic.connect(device.id);
    setConnectedDevice(device);
  };

  const sendPrintData = async () => {
    if (connectedDevice) {
      const data = "Hello, Bluetooth Printer!";
      await BluetoothClassic.write(data);
      console.log('Data sent to printer');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Bluetooth Devices:</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.name}</Text>
            <Button title="Connect" onPress={() => connectToDevice(item)} />
          </View>
        )}
      />
      {connectedDevice && (
        <Button title="Send  Data" onPress={sendPrintData} />
      )}
    </View>
  );
};

export default App;
