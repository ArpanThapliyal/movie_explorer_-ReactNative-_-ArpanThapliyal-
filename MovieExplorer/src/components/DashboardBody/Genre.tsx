import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import { setSelectedGenre } from '../../redux/slice/GenreSlice';
const { width, height } = Dimensions.get('screen');

const Genre = ({movies}:any) => {
  const [uniqueGenere, setUniqueGenere] = useState([]);
  const [selectedText,setSelectedText] = useState('All');

  const dispatch = useDispatch();

  // filtering out individual genre
  useEffect(()=>{
    const genreSet = new Set();
    movies.forEach((movie)=>{
      const genres = movie.genre.split(" ");
      genres.forEach((g)=>genreSet.add(g))
    })
    setUniqueGenere(['All',...genreSet]);
  },[movies])
  return (
    // genere 
    <ScrollView style={[styles.rowDirection, styles.bottomHeaderSpacing]} horizontal showsHorizontalScrollIndicator={false}>
        {uniqueGenere.sort().map(item => (
          <TouchableOpacity
            key={item}
            onPress={()=>{
              setSelectedText(item);  // here item is unique single genre
              dispatch(setSelectedGenre(item),);
            }}
          >
              <Text style={selectedText === item ?styles.selectedColorText:styles.secondaryText}>
                {item}
              </Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  )
}

export default Genre;

const styles = StyleSheet.create({
    rowDirection: {
        flexDirection: 'row',
      },
      bottomHeaderSpacing: {
        columnGap: width * 0.015,
        paddingBottom: height * 0.02,
        paddingHorizontal:width * 0.02,
        marginRight:width * 0.02,
        
      },
      selectedColorText:{
        color: '#007BFF',
        fontWeight: 'bold',
        fontSize:RFValue(17),
        paddingHorizontal: width * 0.022,
        textAlignVertical:'center',
        paddingTop:-8
      },
      secondaryText: {
        color: '#9CA3AF',
        fontWeight: 'bold',
        paddingHorizontal: width * 0.020,
        fontSize: RFValue(16),
        textAlignVertical:'bottom'
      },
})