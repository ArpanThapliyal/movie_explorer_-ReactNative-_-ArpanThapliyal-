import React, {useState} from 'react';
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
import {RFValue} from 'react-native-responsive-fontsize';
import {LoginRequest} from '../axiosRequest/axiosRequest';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slice/UserSlice';

const {width, height} = Dimensions.get('screen');

const Login = ({navigation}:any) => {
  const [UserEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');

  //redux
  const dispatch = useDispatch();

  const accountValidation = async () => {
    try {
      const payload = {user: {email:UserEmail, password}};
      const res = await LoginRequest(payload);
      const {id,role,email,token} = res.data; 

      //storing user detail in store
      dispatch(setUser({role,email,token}));

      if (id >= 0) {
        navigation.replace('MainTabs');
      }else {
        Alert.alert('Sign-in failed');
      }
    } catch (err:any) {
      console.error('Login error:', err);
      const data = err.response?.data;
      Alert.alert('Sign-in failed',data.error );
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View>
        <Text style={[styles.primaryText, {fontSize: RFValue(36)}]}>
          Welcome back
        </Text>
        <Text
          style={[
            styles.secondaryText,
            {fontSize: RFValue(16), marginTop: height * 0.01},
          ]}>
          SignIn to continue watching
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={UserEmail}
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
      </View>

      <TouchableOpacity style={styles.button} onPress={accountValidation}>
        <Text style={styles.buttonLabel}>Sign in</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={{flexDirection:'row',justifyContent: 'center',marginTop: height * 0.03,}}>
        <Text style={styles.footerText}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
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
  },
});
