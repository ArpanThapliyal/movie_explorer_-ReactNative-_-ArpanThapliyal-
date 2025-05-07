import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

// Request permission for notifications
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    await getFcmToken();
  }
}

// Get the device token
async function getFcmToken() {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    await AsyncStorage.setItem('fcmToken', token);
    await sendTokenToBackend(token); // Send token immediately after retrieval
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
}

// Handle token refresh
function setupTokenRefresh() {
  messaging().onTokenRefresh(async (token) => {
    console.log('FCM Token Refreshed:', token);
    await AsyncStorage.setItem('fcmToken', token);
    await sendTokenToBackend(token);
  });
}

// Handle foreground notifications
function setupForegroundNotifications() {
  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground Notification:', remoteMessage);
    // Add custom UI for notifications (e.g., using react-native-notifications)
  });
}

// Handle background/quit notifications
function setupBackgroundNotifications() {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background Notification:', remoteMessage);
  });
}

// Send token to backend using Axios
async function sendTokenToBackend(token) {
  try {
    const response = await axios.patch(
      'http://localhost:3000/api/v1/user/update_device_token', // Update with your backend URL
      { device_token: token },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: Bearer ${await AsyncStorage.getItem('jwtToken')}, // Retrieve JWT from AsyncStorage
        },
      }
    );
    console.log('Token sent to backend:', response.data);
  } catch (error) {
    console.error('Error sending token to backend:', error.response?.data || error.message);
  }
}

// Initialize FCM
export async function initializeFCM() {
  await requestUserPermission();
  setupTokenRefresh();
  setupForegroundNotifications();
  setupBackgroundNotifications();
}