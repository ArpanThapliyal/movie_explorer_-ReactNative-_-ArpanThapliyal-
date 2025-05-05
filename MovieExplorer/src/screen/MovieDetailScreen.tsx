import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';

// PNG icons
import backIcon from '../assets/MovieDetailScreen/back.png';
import favoriteIcon from '../assets/MovieDetailScreen/heart.png';
import playIcon from '../assets/MovieDetailScreen/play.png';

import {useSelector} from 'react-redux';
import {GetMovieById} from '../axiosRequest/axiosRequest';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('screen');

export default function MovieDetailScreen() {
  const [singleMovie, setSingleMovie] = useState({});
  const movieId = useSelector(state => state.movie.id);

  useEffect(() => {
    if (!movieId) return;
    GetMovieById(movieId).then(data => setSingleMovie(data || {}));
  }, [movieId]);

  const navigation = useNavigation();

  const defaultTitle = 'Title';
  const defaultRating = '★★★★★';
  const defaultReleaseDate = 'Date';
  const defaultDuration = 'Time';
  const defaultGenre = 'Genre';
  const defaultDescription =
    'please be patient movie will load shortly...';

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={{uri: singleMovie.poster_url}}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Image source={backIcon} style={styles.backIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heartButton}>
              <Image source={favoriteIcon} style={styles.heartIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.contentArea}>
            <View style={styles.infoContainer}>
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{uri: singleMovie.poster_url}}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <TouchableOpacity style={styles.playButton}>
                  <Image source={playIcon} style={styles.playIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.movieTitle} numberOfLines={2}>
                  {singleMovie.title || defaultTitle}
                </Text>
                <Text style={styles.ratingStars}>
                  {singleMovie.rating || defaultRating} ⭐
                </Text>
                <Text style={styles.releaseDate}>
                  {singleMovie.release_year || defaultReleaseDate}
                </Text>
                <View style={styles.durationRow}>
                  <Text style={styles.duration}>
                    {singleMovie.duration || defaultDuration} min
                  </Text>
                  <View style={styles.genreTag}>
                    <Text style={styles.genreText}>
                      {singleMovie.genre || defaultGenre}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.overviewSection}>
              <Text style={styles.overviewTitle}>Overview</Text>
              <Text
                style={styles.overviewContent}
                numberOfLines={4}
                ellipsizeMode="tail">
                {singleMovie.description || defaultDescription}
              </Text>
              <TouchableOpacity>
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 40, 0.8)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  backButton: {padding: 8},
  heartButton: {padding: 8},
  backIcon: {width: 22, height: 22, tintColor: '#fff'},
  heartIcon: {width: 22, height: 22, tintColor: '#FF5E94'},
  contentArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(13, 11, 36, 0.9)',
    paddingTop: 24,
    paddingBottom: 16,
    height: height * 0.45,
  },
  infoContainer: {flexDirection: 'row', paddingHorizontal: 20},
  thumbnailContainer: {position: 'relative', marginRight: 16},
  thumbnail: {
    width: width * 0.4,
    height: width * 0.52,
    borderRadius: 10,
    marginTop: -90,
    borderWidth: 1,
    borderColor: 'white',
  },
  playButton: {
    position: 'absolute',
    bottom: -18,
    left: (width * 0.32) / 2 - 20,
    width: 54,
    height: 54,
    borderRadius: 30,
    backgroundColor: '#FF3E7A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  playIcon: {width: 22, height: 22, tintColor: '#fff'},
  detailsContainer: {flex: 1, justifyContent: 'center'},
  movieTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  ratingStars: {
    color: '#FFDA00',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  releaseDate: {color: '#9DA0B8', fontSize: 14, marginBottom: 6},
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  duration: {color: '#9DA0B8', fontSize: 14},
  genreTag: {
    backgroundColor: 'rgba(70, 70, 120, 0.4)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginLeft:5
  },
  genreText: {color: '#FFFFFF', fontSize: 10},
  overviewSection: {paddingHorizontal: 20, marginTop: 30},
  overviewTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  overviewContent: {color: '#9DA0B8', fontSize: 14, lineHeight: 20},
  readMoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});
