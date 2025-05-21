import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux'; 
import { clearUser } from '../redux/slice/UserSlice';
import { CurrentUser, LogoutRequest } from '../axiosRequest/axiosRequest';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('screen');
const AVATAR_SIZE = width * 0.3;

export default function Profile() {
  // Redux
  const details = useSelector(state => state.user);
  const dispatch = useDispatch(); 
  const navigation = useNavigation();
  
  // Check if user is a supervisor
  const isSupervisor = details.role === 'supervisor';

  // Check if user is subscribed to a plan or not
  const plan_type = useSelector(state => state.subscription.plan_type);

  // State to manage user's name
  const [userName, setUserName] = useState(''); 

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (details.token) {
          // console.log("user token", details.token);
          const res = await CurrentUser(details.token);
          const { name } = res; 
          setUserName(name); 
        } 
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserName(); 
  }, [details.token]);

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      // Optional API logout call
      await LogoutRequest(details.token);
    } catch (err) {
      console.error('Logout error:', err);
    }
    // Remove stored data
    await AsyncStorage.multiRemove(['userToken', 'userRole']);

    // Clear Redux
    dispatch(clearUser());
    // Navigate to login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cinematic backdrop */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB特fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80' }}
        style={styles.backdropImage}
      />
      
      {/* Overlay gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(18,18,18,0.9)', '#121212']}
        style={styles.backdropOverlay}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top navbar with back button */}
        <View style={styles.navbar}>
          <Text style={styles.navbarTitle}>Profile</Text>
        </View>
        
        {/* Profile info section with improved avatar */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#00BFFF', '#1E90FF', '#4169E1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarFrame}
            >
              {/* Dummy image */}
              <Image
                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEggpHVqWDedhGqOyqh60ah1VdTpdtVAzlRw&s' }}
                style={styles.avatar}
              />
            </LinearGradient>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.name}>{userName||'loading..'}</Text> 
            <View style={styles.roleContainer}>
              <Text style={styles.role}>{details.role || 'user'}</Text>
            </View>
            <Text style={styles.email}>{details.email || 'dummy@gmail.com'}</Text>
            
            {/* Premium badge - only show if user is Premium but not Supervisor */}
            {!isSupervisor && plan_type === 'premium' && (
              <View style={styles.premiumBadge}>
                <LinearGradient
                  colors={['#00BFFF', '#1E90FF']} 
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.premiumGradient}
                >
                  <Text style={styles.premiumText}>PREMIUM</Text>
                </LinearGradient>
              </View>
            )}
          </View>
          
          {/* Movie stats section */}
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['rgba(40,40,40,0.8)', 'rgba(25,25,25,0.9)']}
              style={styles.statsGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>87</Text>
                <Text style={styles.statLabel}>Watchlist</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>142</Text>
                <Text style={styles.statLabel}>Watched</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>35</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
            </LinearGradient>
          </View>
          
          {/* Action buttons section - Conditionally render based on role */}
          <View style={styles.actions}>
            {/* Show different button based on user role */}
            {isSupervisor ? (
              <TouchableOpacity 
                style={styles.subscribeButton} 
                onPress={() => navigation.navigate('Supervisor')}
                accessibilityLabel='open the supervisor page'
                accessibilityRole='button'
              >
                <LinearGradient
                  colors={['#007BFF', '#0056b3']} 
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.subscribeText}>Add New Movie</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.subscribeButton} 
                onPress={() => {
                  if (plan_type === 'premium') {
                    Alert.alert('Premium Status', 'You are already a premium user!');
                  } else {
                    navigation.navigate('Plans');
                  }
                }}
              >
                <LinearGradient
                  colors={['#007BFF', '#0056b3']} 
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.subscribeText}>Get Premium</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.logoutButton}   
              onPress={handleSignOut}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
          
          {/* Movie features section */}
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresContainer}>
            <TouchableOpacity style={styles.featureItem}>
              <LinearGradient
                colors={['rgba(40,40,40,0.6)', 'rgba(20,20,20,0.8)']}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featureIconCircle}>
                  <Text style={styles.featureIconText}>🎬</Text>
                </View>
                <Text style={styles.featureText}>My Watchlist</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureItem}>
              <LinearGradient
                colors={['rgba(40,40,40,0.6)', 'rgba(20,20,20,0.8)']}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featureIconCircle}>
                  <Text style={styles.featureIconText}>⭐</Text>
                </View>
                <Text style={styles.featureText}>My Reviews</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureItem}>
              <LinearGradient
                colors={['rgba(40,40,40,0.6)', 'rgba(20,20,20,0.8)']}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featureIconCircle}>
                  <Text style={styles.featureIconText}>🍿</Text>
                </View>
                <View style={styles.featureTextContainer}>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featureText}>Recommendations</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureItem}>
              <LinearGradient
                colors={['rgba(40,40,40,0.6)', 'rgba(20,20,20,0.8)']}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featureIconCircle}>
                  <Text style={styles.featureIconText}>⚙️</Text>
                </View>
                <Text style={styles.featureText}>Settings</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backdropImage: {
    position: 'absolute',
    width: '100%',
    height: height * 0.4,
    top: 0,
  },
  backdropOverlay: {
    position: 'absolute',
    width: '100%',
    height: height * 0.4,
    top: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: height * 0.05,
  },
  navbar: {
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.025,
    paddingBottom: height * 0.012,
    width: '100%',
  },
  navbarTitle: {
    color: '#fff',
    fontSize: RFValue(18),
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.05,
  },
  avatarContainer: {
    marginTop: height * 0.025,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.01 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  avatarFrame: {
    padding: width * 0.01,
    borderRadius: AVATAR_SIZE / 2 + width * 0.01,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: '#1f1f1f',
  },
  card: {
    position: 'relative',
    marginTop: height * 0.025,
    width: width - width * 0.08,
    backgroundColor: 'rgba(25, 25, 25, 0.85)',
    borderRadius: width * 0.05,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.007 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  name: {
    fontSize: RFValue(28),
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  roleContainer: {
    backgroundColor: 'rgba(0, 123, 255, 0.15)',
    paddingVertical: height * 0.006,
    paddingHorizontal: width * 0.038,
    borderRadius: width * 0.05,
    marginTop: height * 0.01,
  },
  role: {
    fontSize: RFValue(15),
    fontWeight: '600',
    color: '#007BFF',
  },
  email: {
    fontSize: RFValue(15),
    color: '#b3b3b3',
    marginTop: height * 0.01,
  },
  premiumBadge: {
    position: 'absolute',
    top: -height * 0.015,
    right: width * 0.035,
    borderRadius: width * 0.03,
    overflow: 'hidden',
    elevation: 5,
  },
  premiumGradient: {
    paddingVertical: height * 0.007,
    paddingHorizontal: width * 0.03,
  },
  premiumText: {
    color: '#ffffff',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  statsContainer: {
    width: width - width * 0.08,
    borderRadius: width * 0.05,
    marginTop: height * 0.025,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.004 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  statsGradient: {
    flexDirection: 'row',
    paddingVertical: height * 0.02,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: RFValue(23),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: RFValue(14),
    color: '#b3b3b3',
    marginTop: height * 0.005,
  },
  statDivider: {
    height: height * 0.037,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: RFValue(20),
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: height * 0.037,
    marginBottom: height * 0.019,
    marginLeft: width * 0.04,
    letterSpacing: 0.5,
  },
  actions: {
    marginTop: height * 0.025,
    width: width - width * 0.08,
    alignItems: 'center',
  },
  subscribeButton: {
    width: '100%',
    borderRadius: width * 0.04,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: height * 0.005 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradientButton: {
    paddingVertical: height * 0.02,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#ffffff',
    fontSize: RFValue(16),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoutButton: {
    marginTop: height * 0.019,
    width: '80%',
    paddingVertical: height * 0.017,
    backgroundColor: 'rgba(25, 25, 25, 0.8)',
    borderRadius: width * 0.04,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  logoutText: {
    color: '#007BFF',
    fontSize: RFValue(15),
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: width - width * 0.08,
  },
  featureItem: {
    width: '48%',
    borderRadius: width * 0.04,
    marginBottom: height * 0.02,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.004 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  featureGradient: {
    padding: width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconCircle: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: 'rgba(0, 123, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
  },
  featureIconText: {
    fontSize: RFValue(18),
  },
  featureTextContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  featureText: {
    fontSize: RFValue(15),
    fontWeight: '500',
    color: '#ffffff',
  },
});