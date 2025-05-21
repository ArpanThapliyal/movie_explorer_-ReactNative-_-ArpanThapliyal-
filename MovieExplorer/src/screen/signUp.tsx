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
import { signUpRequest } from '../axiosRequest/axiosRequest';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slice/UserSlice';

// Import eye icons
import eye from '../assets/Auth/eye_open.png';
import eyeOff from '../assets/Auth/eye_close.png';

const { width, height } = Dimensions.get('screen');

// Regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // Function to validate all inputs
  const validateInputs = () => {
    const trimmedName = name.trim();
    const trimmedEmail = userEmail.trim();
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // Validate Full Name
    if (!trimmedName) {
      newErrors.name = '*Full Name is required';
    } else if (trimmedName.length < 2) {
      newErrors.name = '*Full Name must be at least 2 characters';
    }

    // Validate Phone Number
    if (!phone) {
      newErrors.phone = '*Phone number is required';
    } else if (phone.length < 10) {
      newErrors.phone = '*Phone number must be at least 10 digits';
    }

    // Validate Email
    if (!trimmedEmail) {
      newErrors.email = '*Email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = '*Invalid email format';
    }

    // Validate Password
    if (!password) {
      newErrors.password = '*Password is required';
    } else if (password.length < 8) {
      newErrors.password = '*Password must be at least 8 characters';
    }

    // Validate Confirm Password
    if (!password_confirmation) {
      newErrors.confirmPassword = '*Confirm Password is required';
    } else if (password_confirmation !== password) {
      newErrors.confirmPassword = '*Passwords do not match';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const accountCreation = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        user: {
          name: name.trim(),
          email: userEmail.trim(),
          password,
          password_confirmation,
          mobile_number: phone,
        },
      };

      const res = await signUpRequest(payload);
      const { id, role, email, token } = res.data;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userRole', role);
      dispatch(setUser({ role, email, token }));

      if (id >= 0) {
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Signup failed');
      }
    } catch (err) {
      console.log('Sign-up error:', err);
      const errors = err.response?.data?.errors;
      Alert.alert('Sign-up failed', `* ${errors.join('\n\n * ')}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View>
        <Text style={[styles.primaryText, { fontSize: RFValue(36) }]}>
          Create Account
        </Text>
        <Text
          style={[
            styles.secondaryText,
            { fontSize: RFValue(16), marginTop: height * 0.01 },
          ]}>
          Join MovieExplorer today
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="Full Name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors((prev) => ({ ...prev, name: '' }));
          }}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={[styles.input, errors.phone && styles.inputError]}
          placeholder="Phone no."
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text) => {
            const filtered = text.replace(/[^0-9]/g, '');
            setPhone(filtered);
            setErrors((prev) => ({ ...prev, phone: '' }));
          }}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={userEmail}
          onChangeText={(text) => {
            setUserEmail(text);
            setErrors((prev) => ({ ...prev, email: '' }));
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
              setErrors((prev) => ({ ...prev, password: '' }));
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? eye : eyeOff}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Confirm Password Section with Eye Icon */}
        <View style={[styles.passwordContainer, errors.confirmPassword && styles.inputError]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showConfirmPassword}
            value={password_confirmation}
            onChangeText={(text) => {
              setPassword_confirmation(text);
              setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Image
              source={showConfirmPassword ? eye : eyeOff}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={accountCreation}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonLabel}>Create Account</Text>
        )}
      </TouchableOpacity>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: height * 0.03,
        }}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.footerLink}>Sign In</Text>
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
    fontSize: RFValue(14),
  },
});