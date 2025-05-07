import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';
import { addDeviceNotification, enableNotification } from '../../axiosRequest/axiosRequest';

const { width, height } = Dimensions.get('screen');

const Header = () => {
  const navigation = useNavigation();
  const userToken = useSelector((state) => state.user.token);
  const fcmToken = useSelector((state) => state.token.device_token);

  const [notiEnabled, setNotiEnabled] = useState(false);

  // Register device for push notifications once on mount
  useEffect(() => {
    if (!userToken || !fcmToken) return;

    (async () => {
      try {
        const res = await addDeviceNotification(fcmToken, userToken);
        console.log('Device registered for notifications:', res.data);
      } catch (err) {
        console.error('Failed to register device:', err);
      }
    })();
  }, [userToken, fcmToken]);

  const toggleNotifications = async () => {
    if (!userToken) return;

    try {
      const res = await enableNotification(userToken);
      // Backend returns the new enabled state:
      const enabled = res.data.notifications_enabled;
      setNotiEnabled(enabled);
      console.log('Notifications enabled?', enabled);
    } catch (err) {
      console.error('Error toggling notifications:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top header */}
      <View style={[styles.rowDirection, styles.topHeaderSpacing]}>
        <Text style={[styles.primaryText, { fontSize: RFValue(36) }]}>
          Home
        </Text>

        <View style={styles.rowDirection}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Image
              source={require('../../assets/header/search.png')}
              style={styles.img}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleNotifications}>
            <Image
              source={
                notiEnabled
                  ? require('../../assets/header/notification.png')
                  : require('../../assets/header/notification-off.png')
              }
              style={styles.img}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={require('../../assets/header/profile.png')}
              style={styles.img}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.04,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  img: {
    width: width * 0.06,
    height: width * 0.06,
    tintColor: '#FFFFFF',
    marginLeft: width * 0.05,
    marginTop: height * 0.02,
  },
  rowDirection: {
    flexDirection: 'row',
  },
  topHeaderSpacing: {
    justifyContent: 'space-between',
  },
});
