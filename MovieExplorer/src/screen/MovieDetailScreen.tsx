import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';

// PNG icons
import backIcon from '../assets/MovieDetailScreen/back.png';
import playIcon from '../assets/MovieDetailScreen/play.png';

import {useSelector} from 'react-redux';
import {GetMovieById} from '../axiosRequest/axiosRequest';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('screen');

export default function MovieDetailScreen() {
  const [singleMovie, setSingleMovie] = useState({});
  const [showFullDescription, setShowFullDescription] = useState(false);
  const movieId = useSelector(state => state.movie.id);
  const user_token = useSelector(state => state.user.token)

  useEffect(() => {
    if (!movieId) return;

    GetMovieById(movieId,user_token)
    .then(data => setSingleMovie(data || {}));

  }, [movieId]);

  const navigation = useNavigation();

  const defaultTitle = 'Title';
  const defaultRating = '★★★★★';
  const defaultReleaseDate = 'Date';
  const defaultDuration = 'Time';
  const defaultGenre = 'Genre';
  const defaultDescription =
    'please buy the premium subscription';

  return (
    <SafeAreaView style={styles.container}>

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
          
          </View>

          <View style={styles.contentAreaContainer}>
            {/* Gradient component for faded effect */}
            <LinearGradient
              colors={['transparent', 'rgba(13, 11, 36, 0.9)']}
              style={styles.fadeGradient}
            />
            
            <View style={styles.contentArea}>
              <View style={styles.infoContainer}>
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{uri: singleMovie.poster_url}}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  {/* <TouchableOpacity style={styles.playButton}>
                    <Image source={playIcon} style={styles.playIcon} />
                  </TouchableOpacity> */}
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
                <View style={styles.overviewContentContainer}>
                  
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <Text style={styles.overviewContent}>
                        {singleMovie.description || defaultDescription}
                      </Text>
                    </ScrollView>
                  
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 40, 0.8)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: RFValue(16),
    paddingHorizontal: RFValue(14),
  },
  backButton: {
    padding: RFValue(8),
  },
  backIcon: {
    width: RFValue(28),
    height: RFValue(28),
    tintColor: '#fff',
  },
  contentAreaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '48%',
  },
  fadeGradient: {
    position: 'absolute',
    top: -50, 
    left: 0,
    right: 0,
    height: 50, 
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'rgba(13, 11, 36, 0.9)',
    paddingTop: RFValue(24),
    paddingBottom: RFValue(16),
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: RFValue(20),
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: RFValue(16),
  },
  thumbnail: {
    width: width * 0.4,
    height: width * 0.52,
    borderRadius: RFValue(10),
    marginTop: RFValue(-90),
    borderWidth: 1,
    borderColor: 'white',
  },
  // playButton: {
  //   bottom: RFValue(28),
  //   left: (width * 0.32) / 2 - RFValue(20),
  //   width: RFValue(54),
  //   height: RFValue(54),
  //   borderRadius: RFValue(30),
  //   backgroundColor: '#FF3E7A',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {width: 0, height: 2},
  //   shadowOpacity: 0.3,
  //   shadowRadius: RFValue(4),
  //   elevation: 5,
  // },
  // playIcon: {
  //   width: RFValue(22),
  //   height: RFValue(22),
  //   tintColor: '#fff',
  // },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontSize: RFValue(22),
    fontWeight: 'bold',
    marginBottom: RFValue(6),
  },
  ratingStars: {
    color: '#FFDA00',
    fontSize: RFValue(14),
    marginBottom: RFValue(6),
    fontWeight: 'bold',
  },
  releaseDate: {
    color: '#9DA0B8',
    fontSize: RFValue(14),
    marginBottom: RFValue(6),
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: RFValue(20),
  },
  duration: {
    color: '#9DA0B8',
    fontSize: RFValue(14),
  },
  genreTag: {
    backgroundColor: 'rgba(70, 70, 120, 0.4)',
    paddingVertical: RFValue(2),
    paddingHorizontal: RFValue(8),
    borderRadius: RFValue(4),
    marginLeft: RFValue(5),
  },
  genreText: {
    color: '#FFFFFF',
    fontSize: RFValue(10),
  },
  overviewSection: {
    paddingHorizontal: RFValue(20),
    marginTop: RFValue(8),
  },
  overviewTitle: {
    color: '#FFFFFF',
    fontSize: RFValue(18),
    fontWeight: 'bold',
    marginBottom: RFValue(12),
  },
  overviewContentContainer: {
    height: RFValue(130), 
    
  },
  overviewContent: {
    color: '#9DA0B8',
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
    
  },
});