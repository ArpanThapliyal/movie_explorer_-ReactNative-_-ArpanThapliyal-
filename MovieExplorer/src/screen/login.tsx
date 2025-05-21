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
  Image,
  ActivityIndicator, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { LoginRequest } from '../axiosRequest/axiosRequest';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slice/UserSlice';

import eye from '../assets/Auth/eye_open.png'; 
import eyeOff from '../assets/Auth/eye_close.png'; 

const { width, height } = Dimensions.get('screen');

// Regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = ({ navigation }) => {
  const [UserEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false); 

  const dispatch = useDispatch();

  // Function to validate inputs
  const validateInputs = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Trim inputs to remove leading/trailing spaces
    const trimmedEmail = UserEmail.trim();
    const trimmedPassword = password.trim();

    // Email validation
    if (!trimmedEmail) {
      newErrors.email = '*Email is required';
      isValid = false;
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = '*Invalid email format';
      isValid = false;
    }

    // Password validation
    if (!trimmedPassword) {
      newErrors.password = '*Password is required';
      isValid = false;
    } else if (trimmedPassword.length < 8) {
      newErrors.password = '*Password must be at least 8 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const accountValidation = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true); 

    try {
      const payload = {
        user: {
          email: UserEmail.trim(),
          password: password.trim(),
        },
      };
      const res = await LoginRequest(payload);
      const { id, role, email, token } = res.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', role);
      dispatch(setUser({ role, email, token }));

      if (id >= 0) {
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Sign-in failed');
      }
    } catch (err) {
      const data = err.response?.data;
      Alert.alert('Sign-in failed', data?.error || 'An error occurred');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View>
        <Text style={[styles.primaryText, { fontSize: RFValue(36) }]}>
          Welcome back
        </Text>
        <Text
          style={[
            styles.secondaryText,
            { fontSize: RFValue(16), marginTop: height * 0.01 },
          ]}>
          SignIn to continue watching
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={UserEmail}
          onChangeText={(text) => {
            setUserEmail(text);
            setErrors({ ...errors, email: '' });
          }}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password Section with Eye Icon */}
        <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword} 
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: '' });
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? eye : eyeOff}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      {/* Sign-in Button with Loader */}
      <TouchableOpacity
        style={styles.button}
        onPress={accountValidation}
        disabled={isLoading} 
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" /> 
        ) : (
          <Text style={styles.buttonLabel}>Sign in</Text> 
        )}
      </TouchableOpacity>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: height * 0.03,
        }}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
          <Text style={styles.footerLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Login;

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
  form: {
    marginTop: height * 0.03,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#323539',
    borderRadius: 8,
    height: height * 0.065,
    marginVertical: height * 0.012,
    borderColor: '#9CA3AF',
    borderWidth: 0.4,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    color: '#FFFFFF',
    fontSize: RFValue(14),
  },
  eyeIcon: {
    width: 24,
    height: 24,
    marginRight: width * 0.04,
    tintColor: '#9CA3AF',
  },
  inputError: {
    borderColor: '#007BFF',
  },
  errorText: {
    color: '#007BFF',
    fontSize: RFValue(12),
    marginBottom: height * 0.01,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: height * 0.018,
    alignItems: 'center',
    marginTop: height * 0.035,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: RFValue(14),
  },
  footerLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});