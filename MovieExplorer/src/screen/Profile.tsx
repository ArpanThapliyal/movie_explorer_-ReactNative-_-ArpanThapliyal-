import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/slice/UserSlice';

const { width } = Dimensions.get('window');
const AVATAR_SIZE = 150;


export default function Profile() {
  //redux
  const details = useSelector(state => state.user);
  const dispatch = useDispatch();

  //navigation
  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cinema-inspired gradient header */}
        <LinearGradient
          colors={['#000000', '#0f0f0f', '#151515']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.headerGradient}
        />
        
        {/* Profile info section with improved avatar */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#e50914', '#b20710', '#2c0608']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.avatarFrame}
            >
              <Image
                source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEggpHVqWDedhGqOyqh60ah1VdTpdtVAzlRw&s' }}
                style={styles.avatar}
              />
            </LinearGradient>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.name}>Arpan</Text>
            <View style={styles.roleContainer}>
              <Text style={styles.role}>{details.role}</Text>
            </View>
            <Text style={styles.email}>{details.email}</Text>
          </View>
          
          {/* Movie stats section */}
          <View style={styles.statsContainer}>
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
          </View>
          
          {/* Action buttons section */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.subscribeButton} onPress={()=>navigation.navigate('Plans')}>
              <LinearGradient
                colors={['#e50914', '#b20710', '#2c0608']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientButton}
              >
                <Text style={styles.subscribeText}>Get Premium (Ad-Free)</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.logoutButton}   
                onPress={() => {
                  dispatch(clearUser());
                  navigation.replace('Login');
                }}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
          
          {/* Movie features section */}
          <View style={styles.featuresContainer}>
            <TouchableOpacity style={styles.featureItem}>
              <View style={styles.featureIconCircle}>
                <Text style={styles.featureIconText}>🎬</Text>
              </View>
              <Text style={styles.featureText}>My Watchlist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureItem}>
              <View style={styles.featureIconCircle}>
                <Text style={styles.featureIconText}>⭐</Text>
              </View>
              <Text style={styles.featureText}>My Reviews</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureItem}>
              <View style={styles.featureIconCircle}>
                <Text style={styles.featureIconText}>🍿</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.featureText}>Recommendations</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureItem}>
              <View style={styles.featureIconCircle}>
                <Text style={styles.featureIconText}>⚙️</Text>
              </View>
              <Text style={styles.featureText}>Settings</Text>
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 220,
    zIndex: 1,
  },
  profileSection: {
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  avatarContainer: {
    marginTop: 70,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  avatarFrame: {
    padding: 6,
    borderRadius: AVATAR_SIZE / 2 + 6,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: '#1f1f1f',
  },
  card: {
    marginTop: 20,
    width: width * 0.9,
    backgroundColor: '#1f1f1f',
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  roleContainer: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 8,
  },
  role: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e50914',
  },
  email: {
    fontSize: 16,
    color: '#b3b3b3',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    backgroundColor: '#1f1f1f',
    borderRadius: 25,
    marginTop: 15,
    paddingVertical: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
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
    backgroundColor: '#333333',
  },
  actions: {
    marginTop: 20,
    width: width * 0.9,
    alignItems: 'center',
  },
  subscribeButton: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#e50914',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoutButton: {
    marginTop: 15,
    width: '80%',
    paddingVertical: 14,
    backgroundColor: 'transparent',
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e50914',
  },
  logoutText: {
    color: '#e50914',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: width * 0.9,
    marginTop: 20,
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
    width: '100%',
  },
});