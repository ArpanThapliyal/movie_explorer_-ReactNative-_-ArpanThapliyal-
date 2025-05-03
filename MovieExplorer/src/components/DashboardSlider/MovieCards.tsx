import React, { useMemo } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

const { height, width } = Dimensions.get('screen');

const MovieCards = ({ movies, condition }: any) => {
  // verticalDirection determined from `condition`
  const verticalDirection = condition !== 'year' && condition !== 'rating';

  const genereWiseMovies = () =>{
    if(condition =='All'){
      return movies;
    }
    else{
      return movies.filter(m => m.genre == condition);
    }
  }

  const filtered = useMemo(() => {
    switch (condition) {
      case 'year':
        return movies.filter(m => m.release_year > 2020);
      case 'rating':
        return movies.filter(m => m.rating >= 8.0);
      default:
        return genereWiseMovies();
    }
  }, [movies, condition]);

  return (
    <FlatList
      data={filtered}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <Image source={{ uri: item.poster_url }} style={styles.img} />
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
