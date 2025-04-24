import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('screen');

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View>
        <Text style={[styles.primaryText, { fontSize: RFValue(36) }]}>
          Welcome back
        </Text>
        <Text style={[styles.secondaryText, { fontSize: RFValue(16), marginTop: height * 0.01 }]}>
          Signin to continue watching
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
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
      </View>  

      <TouchableOpacity
        style={styles.button}
        onPress={() => {}}
      >
        <Text style={styles.buttonLabel}>Sign in</Text>
      </TouchableOpacity>
      
      {/* Footer */}
      <Text style={styles.footerText}>
        Don't have an account? <Text style={styles.footerLink}>Sign Up</Text>
      </Text>
    </ScrollView>
  );
};

export default login;

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
