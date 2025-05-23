import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import Navigation from './src/navigation/Navigation';
import { Provider, useDispatch, useSelector } from 'react-redux';
import myStore from './src/redux/store/MyStore';
import { setDeviceToken } from './src/redux/slice/DeviceTokenSlice';

import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';


const InnerApp = () => {
  const userToken = useSelector((state: any) => state.user.token);

  useEffect(() => {
    requestPermissionAndroid();
  }, []);

  const requestPermissionAndroid = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        registerToken();
        Alert.alert('Permission granted');
      } else {
        Alert.alert('Permission Denied');
      }
    } else {
      // Android ≤12: auto-granted
      Alert.alert('Notifications already allowed on your device!');
      registerToken();
    }
  };

  const dispatch = useDispatch();
  // Get FCM token and send it to your backend
  const registerToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.log(`device token : ${fcmToken}`);

      dispatch(setDeviceToken(fcmToken));
      
    } catch (err) {
      console.error('Failed to register device notification:', err);
    }
  };

  // Foreground message handler
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const res = await onDisplayNotification(remoteMessage);
      // console.log("device token status: ",res);
    });
    return unsubscribe;
  }, []);

  const onDisplayNotification = async (remoteMessage: any) => {
    const channelId = await notifee.createChannel({
      id: 'movies',
      name: 'Movies Notifications',
    });

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher_round', 
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <Navigation />
    </View>
  );
};

const App = () => (
     <Provider store={myStore}>
       <InnerApp />
     </Provider>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
