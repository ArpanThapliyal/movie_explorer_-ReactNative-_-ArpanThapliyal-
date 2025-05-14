import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { signUpRequest } from '../axiosRequest/axiosRequest';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slice/UserSlice';

const { width, height } = Dimensions.get('screen');

const SignUp = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');

  const dispatch = useDispatch();

  const accountCreation = async () => {
    try {
      const payload = {
        user: {
          name,
          email:userEmail,
          password,
          password_confirmation,
          mobile_number: phone,
        },
      };

      const res = await signUpRequest(payload);
      const {id,role,email,token} = res.data

      // Store token in AsyncStorage
      await AsyncStorage.setItem('userToken', token);
      // Optionally store full user object
      await AsyncStorage.setItem('userRole', role);

      //redux user
      dispatch(setUser({role,email,token}));
      // Navigate dashboard
      if (id >= 0) {
        navigation.replace('MainTabs');
      }else {
        Alert.alert('Signup failed');
      }
    } catch (err:any) {
      console.log('Sign-up error:', err);
      // error while signing up
      const errors = err.response?.data?.errors;
      Alert.alert('Sign-up failed',`* ${errors.join('\n\n *'+" ")}` );
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View>
        <Text style={[styles.primaryText, { fontSize: RFValue(36) }]}>Create Account</Text>
        <Text style={[styles.secondaryText, { fontSize: RFValue(16), marginTop: height * 0.01 }]}>Join MovieExplorer today</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone no."
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={userEmail}
          onChangeText={setUserEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password_confirmation}
          onChangeText={setPassword_confirmation}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={accountCreation}>
        <Text style={styles.buttonLabel}>Create Account</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={{flexDirection:'row',justifyContent: 'center',marginTop: height * 0.03,}}>
      <Text style={styles.footerText}>
        Already have an account?{' '}
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.footerLink]}> Sign In</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.06,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#9CA3AF',
  },
  form:{
    marginTop: height*0.03
  },
  input: {
    backgroundColor: '#323539',
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    height: height * 0.065,
    marginVertical: height * 0.012,
    borderColor: '#9CA3AF',
    borderWidth: 0.4,
    color: '#FFFFFF',
    fontSize: RFValue(14),
  },
  button: {
    backgroundColor: '#FBBF24',
    borderRadius: 8,
    paddingVertical: height * 0.018,
    alignItems: 'center',
    marginTop: height * 0.035,
  },
  buttonLabel: {
    color: '#000000',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: RFValue(14), 
  },
  footerLink: {
    color: '#FBBF24',
    fontWeight: 'bold',
    fontSize: RFValue(14),
  },
});
