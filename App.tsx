import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import RNFS from 'react-native-fs';

import { Camera, useCameraDevice, CameraPermissionStatus } from 'react-native-vision-camera';
import axios from 'axios';

function App(): JSX.Element {
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [imageSource, setImageSource] = useState('');


  const capturePhoto = async () => {
    if (camera.current !== null) {
      try {
        const photo = await camera.current.takePhoto({});
        setImageSource(photo.path);

        // Sending the captured photo to the server
        try {
          const formData = new FormData();
          formData.append('photo', {
            uri: photo.path,
            name: 'photo.jpg',
            type: 'image/jpeg',
          });

          const response = await axios.post(serverUrl, formData);
          console.log('Photo uploaded successfully:', response.data);
          // Handle success response from the server
        } catch (error) {
          console.error('Error uploading photo:', error);
          // Handle error case
        }
      } catch (error) {
        console.error('Error capturing the photo:', error);
      }
    }
  };
  const serverUrl = 'http://172.16.0.51:8081'; // Replace with your server URL
  if (device == null) return <ActivityIndicator />;

  return (
    <View style={styles.camera}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        zoom={1}
      />
      <TouchableOpacity onPress={capturePhoto} style={styles.captureButton}>
        <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Capture Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});

export default App;