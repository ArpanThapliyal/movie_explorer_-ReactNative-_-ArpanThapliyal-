import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/slice/UserSlice';
import { LogoutRequest } from '../axiosRequest/axiosRequest';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = 120;

export default function Profile() {
  // Redux
  const details = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Navigation
  const navigation = useNavigation();
  
  // Check if user is a supervisor
  const isSupervisor = details.role === 'supervisor';

  // handle sign-out
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
    navigation.replace('Login');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      
      {/* Cinematic backdrop */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80' }}
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navbarTitle}>Profile</Text>
          <View style={styles.emptySpace} />
        </View>
        
        {/* Profile info section with improved avatar */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#e50914', '#b20710', '#2c0608']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.avatarFrame}
            >
              {/* dummy image */}
              <Image
                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEggpHVqWDedhGqOyqh60ah1VdTpdtVAzlRw&s' }}
                style={styles.avatar}
              />
            </LinearGradient>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.name}>Arpan</Text>
            <View style={styles.roleContainer}>
              <Text style={styles.role}>{details.role || 'user'}</Text>
            </View>
            <Text style={styles.email}>{details.email || 'dummy@gmail.com'}</Text>
            
            {/* Premium badge - only show if user is Premium but not Supervisor */}
            {!isSupervisor && details.role === 'Premium Member' && (
              <View style={styles.premiumBadge}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
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
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
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
              >
                <LinearGradient
                  colors={['#e50914', '#b20710']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.gradientButton}
                >
                  <Text style={styles.subscribeText}>Supervisor Dashboard</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.subscribeButton} 
                onPress={() => navigation.navigate('Plans')}
              >
                <LinearGradient
                  colors={['#e50914', '#b20710']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.gradientButton}
                >
                  <Text style={styles.subscribeText}>Get Premium</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.logoutButton}   
              onPress={ handleSignOut }
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
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
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
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
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
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
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
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
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
    height: 340,
    top: 0,
  },
  backdropOverlay: {
    position: 'absolute',
    width: '100%',
    height: 340,
    top: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  navbarTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySpace: {
    width: 40,
  },
  profileSection: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  avatarContainer: {
    marginTop: 20,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  avatarFrame: {
    padding: 4,
    borderRadius: AVATAR_SIZE / 2 + 4,
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
    marginTop: 20,
    width: width - 32,
    backgroundColor: 'rgba(25, 25, 25, 0.85)',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  roleContainer: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 8,
  },
  role: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e50914',
  },
  email: {
    fontSize: 15,
    color: '#b3b3b3',
    marginTop: 8,
  },
  premiumBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  premiumGradient: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  premiumText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    width: width - 32,
    borderRadius: 20,
    marginTop: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  statsGradient: {
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 14,
    color: '#b3b3b3',
    marginTop: 4,
  },
  statDivider: {
    height: 30,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 30,
    marginBottom: 15,
    marginLeft: 16,
    letterSpacing: 0.5,
  },
  actions: {
    marginTop: 20,
    width: width - 32,
    alignItems: 'center',
  },
  subscribeButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#e50914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoutButton: {
    marginTop: 15,
    width: '80%',
    paddingVertical: 14,
    backgroundColor: 'rgba(25, 25, 25, 0.8)',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e50914',
  },
  logoutText: {
    color: '#e50914',
    fontSize: 15,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: width - 32,
  },
  featureItem: {
    width: '48%',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  featureGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIconText: {
    fontSize: 18,
  },
  featureTextContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
});