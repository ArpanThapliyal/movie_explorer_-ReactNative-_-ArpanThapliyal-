// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login   from '../screen/Login';
import SignUp  from '../screen/SignUp';
import Tabs    from './TabNavigation';   

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="MainTabs"
      >
        <Stack.Screen name="Login"   component={Login} />
        <Stack.Screen name="SignUp"  component={SignUp} />
        <Stack.Screen name="MainTabs" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
