import React, { useMemo } from 'react';
import { 
  Dimensions, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableHighlight, 
  View, 
  TouchableOpacity, 
  ActivityIndicator,
  Text
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setId } from '../../redux/slice/MovieSlice';
import { useNavigation } from '@react-navigation/native';
import { DeleteMovieRequest } from '../../axiosRequest/axiosRequest';

const { height, width } = Dimensions.get('screen');

const MovieCards = ({ movies, condition, onEndReached, isLoading }) => {
  const userRole = useSelector(state => state.user.role);
  const user_token = useSelector(state => state.user.token);

  const isSupervisor = userRole === 'supervisor';
  const verticalDirection = condition !== 'year' && condition !== 'rating';
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const genreWiseMovies = () => {
    if (condition === 'All') {
      return movies;
    } else {
      return movies.filter(m => m.genre.includes(condition));
    }
  };

  const filtered = useMemo(() => {
    switch (condition) {
      case 'year':
        return movies.filter(m => m.release_year > 2020);
      case 'rating':
        return movies.filter(m => m.rating >= 8.0);
      default:
        return genreWiseMovies();
    }
  }, [movies, condition]);

  const handleEditClick = (movieId) => {
    navigation.navigate('Supervisor', { movieId, isEditing: true });
  };

  const handleDeleteClick = (movieId) => {
    DeleteMovieRequest(movieId, user_token);
    console.log(`Delete movie with ID: ${movieId}`);
  };

  const handleEndReached = () => {
    if (onEndReached && !isLoading) onEndReached();
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  };

  return (
    <FlatList
      data={filtered}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <View style={styles.movieCardContainer}>
            {/* Premium label */}
            {item.premium && (
              <Text style={styles.premiumLabel}>PREMIUM</Text>
            )}
            <TouchableHighlight
              onPress={() => {
                dispatch(setId(item.id));
                navigation.navigate('MovieDetail');
              }}
            >
              <Image
                source={{ uri: item.poster_url }}
                style={[
                  styles.img,
                  { borderColor: item.premium ? 'gold' : 'white' }
                ]}
              />
            </TouchableHighlight>
            {isSupervisor && (
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleEditClick(item.id)}>
                  <View style={styles.iconCircle}>
                    <Image
                      source={require('../../assets/movieCards/pencil.png')}
                      style={styles.iconImage}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteClick(item.id)}>
                  <View style={styles.iconCircle}>
                    <Image
                      source={require('../../assets/movieCards/trashcan.png')}
                      style={styles.iconImage}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
      keyExtractor={item => item.id.toString()}
      horizontal={!verticalDirection}
      numColumns={verticalDirection ? 2 : 1}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scrollEnabled={!verticalDirection}
      onEndReached={handleEndReached}
      onEndReachedThreshold={verticalDirection ? 0.2 : 0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

export default MovieCards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    elevation: 10,
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.005,
    marginBottom: 14,
  },
  movieCardContainer: {
    position: 'relative',
  },
  premiumLabel: {
    position: 'absolute',
    top: 1,
    left: 1,
    backgroundColor: 'gold',
    color: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderTopLeftRadius:16,
    fontWeight: 'bold',
    zIndex: 1,
  },
  img: {
    height: height * 0.25,
    width: width * 0.4,
    borderRadius: 22,
    borderWidth: 1.6,
  },
  iconContainer: {
    position: 'absolute',
    top: 8,
    left: 76,
    flexDirection: 'row',
    gap: 5,
    zIndex: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconImage: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.035,
  },
});
