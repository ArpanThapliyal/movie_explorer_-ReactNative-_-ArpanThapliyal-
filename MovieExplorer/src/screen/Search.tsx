import React, { useEffect, useState, useCallback } from 'react';
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
} from 'react-native';
import debounce from 'lodash.debounce';
import { GetAllMovies } from '../axiosRequest/axiosRequest';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setId } from '../redux/slice/MovieSlice';

const { width, height } = Dimensions.get('window');

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [allMovies, setAllMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Get user role from Redux store
  const userRole = useSelector(state => state.user.role);
  const isSupervisor = userRole === 'supervisor';

  // fetching all movies
  const fetchMovies = async () => {
    try {
      const data = await GetAllMovies();
      setAllMovies(data);
      // No longer setting filtered to data initially
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // debounced filter
  const doFilter = useCallback(
    debounce(text => {
      if (text.trim() === '') {
        // If search is empty, don't show any results
        setFiltered([]);
        setHasSearched(false);
        return;
      }
      
      const lower = text.toLowerCase();
      const results = allMovies.filter(item =>
        item.title.toLowerCase().includes(lower)
      );
      setFiltered(results);
      setHasSearched(true);
    }, 400),
    [allMovies]
  );

  const handleSearch = text => {
    setQuery(text);
    doFilter(text);
  };

  const handleMoviePress = (movieId) => {
    // Update Redux store with selected movie ID
    dispatch(setId(movieId));
    // Navigate to movie detail screen
    navigation.navigate('MovieDetail');
  };

  // Function to handle edit click
  const handleEditClick = (movieId) => {
    dispatch(setId(movieId));
    navigation.navigate('EditMovie');
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardWrapper}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8}
        onPress={() => handleMoviePress(item.id)}
      >
        <Image source={{ uri: item.poster_url }} style={styles.poster} />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{`${item.release_year} • ${item.genre}`}</Text>
        </View>
      </TouchableOpacity>
      
      {/* Edit Icon - Only visible for supervisors */}
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
    if (hasSearched && filtered.length === 0) {
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

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
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
  },
  searchWrapper: {
    flexDirection: 'row',
    backgroundColor: '#282828',
    margin: 16,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#E50914',
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#FFF',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  cardWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: 70,
    height: 105,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#AAA',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    marginTop: 16,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    tintColor: '#555',
  },
  editIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  editIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editIconImage: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
  },
});