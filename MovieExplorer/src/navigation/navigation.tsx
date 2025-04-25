import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import signUp from '../screen/signUp';
import login from '../screen/login';
import dashboard from '../screen/dashboard';

const Stack = createNativeStackNavigator();
const navigation = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator
        initialRouteName='Dashboard'
        screenOptions={{headerShown : false}}
        >
            <Stack.Screen name ="SignUp" component={signUp}/>
            <Stack.Screen name ="Login" component={login}/>
            <Stack.Screen name ="Dashboard" component={dashboard}/>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default navigation;