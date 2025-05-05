import React, { useMemo } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, TouchableHighlight, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setId } from '../../redux/slice/MovieSlice';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('screen');

const MovieCards = ({ movies, condition }: any) => {

  // verticalDirection determined from `condition`
  const verticalDirection = condition !== 'year' && condition !== 'rating';

  //genre wise filtering
  const genreWiseMovies = () =>{
    if(condition =='All'){
      return movies;
    }
    else{
      return movies.filter(m => m.genre.includes(condition));
    }
  }

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


  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <FlatList
      data={filtered}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <TouchableHighlight onPress={()=>{
            dispatch(setId(item.id));
            navigation.navigate('MovieDetail');
          }}>
            <Image source={{ uri: item.poster_url }} style={styles.img} />
          </TouchableHighlight>
        </View>
      )}
      keyExtractor={item => item.id.toString()}

      horizontal={!verticalDirection}
      numColumns={verticalDirection ? 2 : 1}

      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}

      scrollEnabled={!verticalDirection}
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
  img: {
    height: height * 0.25,
    width: width * 0.4,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: 'white',
  },
});
