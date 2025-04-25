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
import { RFValue } from 'react-native-responsive-fontsize';
import { signUpRequest } from '../axiosRequest/axiosRequest';

const { width, height } = Dimensions.get('screen');

const signUp = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [Cpassword, setCpassword] = useState('');

  const accountCreation = async () => {
    try {
      const payload = {
        user: {
          name,
          email,
          password,
          mobile_number: phone,
        },
      };

      const res = await signUpRequest(payload);
      const {message} = res.data
      // Navigate to Login or Home on success
      if (message === 'User signed up successfully') {
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Login Failed', message);
      }
    } catch (err) {
      console.log('Sign-up error:', err);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View>
        <Text style={[styles.primaryText, { fontSize: RFValue(36) }]}>Create Account</Text>
        <Text style={[styles.secondaryText, { fontSize: RFValue(16), marginTop: height * 0.01 }]}>Join MovieExplorer+ today</Text>
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
          value={email}
          onChangeText={setEmail}
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
          value={Cpassword}
          onChangeText={setCpassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={accountCreation}>
        <Text style={styles.buttonLabel}>Create Account</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </Text>
    </ScrollView>
  );
};


export default signUp;

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
    textAlign: 'center',
    fontSize: RFValue(14),
    marginTop: height * 0.02,
  },
  footerLink: {
    color: '#FBBF24',
    fontWeight: 'bold',
  },
});
