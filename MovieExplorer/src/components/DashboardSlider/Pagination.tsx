import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ImageSliderType } from '../../data/SliderData';

type props ={
    items: ImageSliderType[];
    paginationIndex: number;
    scrollX:SharedValue<number>
}
const { width, height } = Dimensions.get('window');

const Pagination = ({items, scrollX, paginationIndex}:props) => {
  return (
    <View style = {styles.container}>
      {items.map((_,index) => {

        const pgAnimationStyle = useAnimatedStyle(() => {
          const dotWidth = interpolate(
            scrollX.value,
            [(index-1)*width, index*width, (index+1)*width ],
            [8, 20, 8],
            Extrapolation.CLAMP
          );

          return{
            width: dotWidth,
          }
        })
        return(
          <Animated.View
           key={index}
           style={[styles.dot,
             {backgroundColor: paginationIndex === index ? 'skyblue' : 'white'}]} 
          />
        );
      })}
    </View>
  )
}

export default Pagination;

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems:'center'
  },
  dot:{
    backgroundColor: '#aaa',
    height: 8,
    width: 8,
    marginHorizontal: 2,
    borderRadius: 8
  }
})