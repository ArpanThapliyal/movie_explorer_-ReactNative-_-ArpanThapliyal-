import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login   from '../screen/Login';
import SignUp  from '../screen/SignUp';
import MovieDetailScreen from '../screen/MovieDetailScreen';
import Superviser from '../screen/Supervisor';
import Tabs    from './TabNavigation';   

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login"   component={Login} />
        <Stack.Screen name="SignUp"  component={SignUp} />
        <Stack.Screen name="MovieDetail"  component={MovieDetailScreen} />
        <Stack.Screen name="Supervisor"  component={Superviser} />
        <Stack.Screen name="MainTabs" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
