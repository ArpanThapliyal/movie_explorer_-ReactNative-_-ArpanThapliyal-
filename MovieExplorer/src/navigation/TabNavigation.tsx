import React from 'react';
import { Image, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screen/Dashboard';
import Search from '../screen/Search';
import PaymentPlans from '../screen/PaymentPlans';
import Profile from '../screen/Profile';

const { width } = Dimensions.get('screen');
const ICON_SIZE = width * 0.06;

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#181819',
          borderRadius: 16,
          height: 60,
          marginHorizontal: 14,
          position: 'absolute',
          borderWidth:0.6,
          borderColor:'skyblue',
        },
        tabBarActiveTintColor: 'skyblue',
        tabBarInactiveTintColor: '#FFFFFF',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/footer/home.png')}
              style={{ width: ICON_SIZE, height: ICON_SIZE, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/footer/search.png')}
              style={{ width: ICON_SIZE, height: ICON_SIZE, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Plans"
        component={PaymentPlans}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/footer/downloads.png')}
              style={{ width: ICON_SIZE, height: ICON_SIZE, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/footer/profile.png')}
              style={{ width: ICON_SIZE, height: ICON_SIZE, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
