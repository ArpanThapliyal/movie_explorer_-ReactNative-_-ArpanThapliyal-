import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Slider from '../DashboardSlider/Slider';
import { ImageSlider } from '../../data/SliderData';
import { RFValue } from 'react-native-responsive-fontsize';
import { GetAllMovies } from '../../axiosRequest/axiosRequest';
import Genre from '../DashboardBody/Genre';
import MovieCards from '../DashboardSlider/MovieCards';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('screen');
const DashboardBody = () => {
  const [movies,setMovies] = useState([]);

// getting all movies
  const AllMovies = async ()=>{
    const data = await GetAllMovies();
    setMovies(data); 
  }

  useEffect(()=>{
    AllMovies();
  },[])

  //getting by genre
  const singleGenre = useSelector(state => state.genre.selectedGenre);

  return (
    <View style={styles.container}>
    {/* genere header */}
      <Genre movies = {movies}/>
      
    
    {/* all movies */}
      <Text style={[styles.primaryText, { fontSize: RFValue(21) }]}>
        Popular Movies
      </Text>
      {/* carousal */}
      <Slider itemList={ImageSlider}/>
      

      {singleGenre === 'All'?(
        <>
      <Text style={[styles.primaryText, { fontSize: RFValue(20) }]}>
        Continue Watching..
      </Text>
      {/* images from backend  */}
      <MovieCards movies={movies} condition= {'year'}/>
      <Text style={[styles.primaryText, { fontSize: RFValue(20) }]}>
        Most Watched
      </Text>
      {/* images from backend */}
      <MovieCards movies={movies} condition= {'rating'}/>
      </>
      ):
      (<></>)
      }

      {/* all movies */}
      <Text style={[styles.primaryText, { fontSize: RFValue(20) }]}>
        {`${singleGenre} Movies`}
      </Text>
        {/* images from backend */}
      <MovieCards movies={movies} condition= {singleGenre}/>

         
    </View>
  )
}

export default DashboardBody;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: height * 0.015,
    marginBottom:60
    
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',  
    paddingHorizontal: width * 0.035,
    paddingBottom: height * 0.015,
    paddingTop: height * 0.005,

  },    
})