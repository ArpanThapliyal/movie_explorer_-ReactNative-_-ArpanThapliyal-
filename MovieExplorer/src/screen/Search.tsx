import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import debounce from 'lodash.debounce';
import { GetAllMoviesByTitle } from '../axiosRequest/axiosRequest';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setId } from '../redux/slice/MovieSlice';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('screen');

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Get user role from Redux store
  const userRole = useSelector(state => state.user.role);
  const plan_type = useSelector(state => state.subscription.plan_type);
  const isSupervisor = userRole === 'supervisor';

  // Debounced filter function to fetch movies by title
  const doFilter = useCallback(
    debounce(async (text) => {
      if (text.trim() === '') {
        setFiltered([]);
        setHasSearched(false);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const data = await GetAllMoviesByTitle(text);
        if (data) {
          const filteredData = data
            .filter(item => item.title.toLowerCase().startsWith(text.toLowerCase()))
            .slice(0, 5); 
          setFiltered(filteredData);
        } else {
          setFiltered([]);
        }
        setHasSearched(true);
      } catch (e) {
        console.error('Search error:', e);
        setFiltered([]);
      } finally {
        setIsSearching(false);
      }
    }, 600),
    []
  );

  const handleSearch = (text) => {
    setQuery(text);
    doFilter(text);
  };

  const handleMoviePress = (movieId, prem) => {
    if (!prem || plan_type === 'premium') {
      dispatch(setId(movieId));
      navigation.navigate('MovieDetail');
    } else {
      Alert.alert(
        "Please buy a subscription",
        "to Access this Premium Movie",
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => navigation.navigate('Plans') }
        ],
        { cancelable: false }
      );
    }
  };

  const handleEditClick = (movieId) => {
    dispatch(setId(movieId));
    navigation.navigate('Supervisor', { movieId, isEditing: true });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8}
        onPress={() => handleMoviePress(item.id, item.premium)}
      >
        <Image source={{ uri: item.poster_url }} style={styles.poster} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{`${item.release_year} • ${item.genre}`}</Text>
        </View>
      </TouchableOpacity>
      
      {isSupervisor && (
        <TouchableOpacity
          style={styles.editIconContainer}
          onPress={() => handleEditClick(item.id)}
        >
          <View style={styles.editIconCircle}>
            <Image
              source={require('../assets/search/pencil.png')}
              style={styles.editIconImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyComponent = () => {
    if (isSearching) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      );
    } else if (hasSearched && filtered.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No movies found</Text>
        </View>
      );
    } else if (!hasSearched) {
      return (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../assets/search/search.png')}
            style={styles.emptyIcon}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>Search for movies</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Search Movies</Text>
      </View>
      <View style={styles.searchWrapper}>
        <Image
          source={require('../assets/search/search.png')}
          style={styles.icon}
          resizeMode="contain"
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title..."
          placeholderTextColor="#777"
          value={query}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? height * 0.03 : 0,
  },
  header: {
    paddingVertical: height * 0.025,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  headerText: {
    fontSize: RFValue(29),
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchWrapper: {
    flexDirection: 'row',
    backgroundColor: '#282828',
    margin: width * 0.04,
    borderRadius: width * 0.08,
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
  },
  icon: {
    width: width * 0.06,
    height: width * 0.06,
    tintColor: '#007BFF',
    marginRight: width * 0.03,
  },
  searchInput: {
    flex: 1,
    height: height * 0.06,
    fontSize: RFValue(18),
    color: '#FFF',
  },
  list: {
    paddingHorizontal: width * 0.04,
    paddingBottom: width * 0.04,
    flexGrow: 1,
  },
  cardWrapper: {
    position: 'relative',
    marginBottom: height * 0.015,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: width * 0.03,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: width * 0.17,
    height: height * 0.13,
  },
  info: {
    flex: 1,
    padding: width * 0.03,
    justifyContent: 'center',
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: '600',
    color: '#FFF',
  },
  subtitle: {
    fontSize: RFValue(14),
    color: '#AAA',
    marginTop: height * 0.005,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.12,
  },
  emptyText: {
    fontSize: RFValue(18),
    color: '#777',
    marginTop: height * 0.02,
  },
  emptyIcon: {
    width: width * 0.2,
    height: width * 0.2,
    tintColor: '#555',
  },
  editIconContainer: {
    position: 'absolute',
    top: height * 0.012,
    right: width * 0.025,
    zIndex: 1,
  },
  editIconCircle: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: width * 0.045,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editIconImage: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: '#FFF',
  },
});