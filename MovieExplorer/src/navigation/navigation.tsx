import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import signUp from '../screen/signUp';
import login from '../screen/login';

const Stack = createNativeStackNavigator();
const navigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator
        initialRouteName='SignUp'
        screenOptions={{headerShown : false}}
        >
            <Stack.Screen name ="SignUp" component={signUp}/>
            <Stack.Screen name ="Login" component={login}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default navigation

const styles = StyleSheet.create({})