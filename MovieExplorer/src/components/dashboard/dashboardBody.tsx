import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Slider from '../DashboardSlider/Slider';
import { ImageSlider } from '../../data/SliderData';
import { RFValue } from 'react-native-responsive-fontsize';
import { checkSubscriptionStatus, GetAllMovies } from '../../axiosRequest/axiosRequest';
import Genre from '../DashboardBody/Genre';
import MovieCards from '../DashboardSlider/MovieCards';
import { useDispatch, useSelector } from 'react-redux';
import { clearSubscription, setSubscription } from '../../redux/slice/SubscriptionSlice';

const { width, height } = Dimensions.get('screen');

const DashboardBody = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);

  //redux
  const dispatch = useDispatch();
  const user_token = useSelector(state=>state.user.token);
  
  //check subscription
  useEffect(() => {
    async function fetchSubscription() {
      const res = await checkSubscriptionStatus(user_token);
      if (res && res.plan_type) {
        dispatch(setSubscription({ plan_type: res.plan_type }));
      } else {
        dispatch(clearSubscription());
      }
    }
    fetchSubscription();
  }, [dispatch, user_token]);


  const fetchMovies = async (page = 1, shouldAppend = false) => {
    if (isLoading || (!hasMoreMovies && page > 1)) return;
    
    setIsLoading(true);
    const data = await GetAllMovies(page);
    
    if (data && data.length > 0) {
      if (shouldAppend) {
        setMovies(prevMovies => {
          const existingIds = new Set(prevMovies.map(movie => movie.id));
          const newMovies = data.filter(movie => !existingIds.has(movie.id));
          return [...prevMovies, ...newMovies];
        });
      } else {
        setMovies(data);
      }
      setCurrentPage(page);
      setHasMoreMovies(data.length > 0);
    } else {
      setHasMoreMovies(false);
    }
    setIsLoading(false);
  };

  const loadMoreMovies = () => {
    if (!isLoading && hasMoreMovies) {
      fetchMovies(currentPage + 1, true);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const singleGenre = useSelector(state => state.genre.selectedGenre);

  return (
    <View style={styles.container}>
      <Genre movies={movies}/>
      <Text style={[styles.primaryText, { fontSize: RFValue(21) }]}>
        Popular Movies
      </Text>
      <Slider itemList={ImageSlider}/>
      
      {singleGenre === 'All' ? (
        <>
          <Text style={[styles.primaryText, { fontSize: RFValue(20) }]}>
            Continue Watching..
          </Text>
          <MovieCards 
            movies={movies} 
            condition={'year'} 
            onEndReached={loadMoreMovies}
            isLoading={isLoading}
          />
          <Text style={[styles.primaryText, { fontSize: RFValue(20) }]}>
            Most Watched
          </Text>
          <MovieCards 
            movies={movies} 
            condition={'rating'} 
            onEndReached={loadMoreMovies}
            isLoading={isLoading}
          />
        </>
      ) : (
        <></>
      )}

      <Text style={[styles.primaryText, { fontSize: RFValue(20) }]}>
        {`${singleGenre} Movies`}
      </Text>
      <MovieCards 
        movies={movies} 
        condition={singleGenre} 
        onEndReached={loadMoreMovies}
        isLoading={isLoading}
      />
    </View>
  );
};

export default DashboardBody;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: height * 0.015,
    marginBottom: 60
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',  
    paddingHorizontal: width * 0.035,
    paddingBottom: height * 0.015,
    paddingTop: height * 0.005,
  }
});