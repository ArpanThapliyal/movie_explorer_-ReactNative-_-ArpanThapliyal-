import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {ImageSliderType} from '../../data/SliderData';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

type props = {
  item: ImageSliderType;
  index: number;
  scrollX: SharedValue<number>;
};

const {height, width} = Dimensions.get('screen');

const SliderItem = ({item, index, scrollX}: props) => {
  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.25, 0, width * 0.25],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.8, 1, 0.7],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.container, rnAnimatedStyle]}>
      <Image source={item.image} style={styles.img} />
    </Animated.View>
  );
};

export default SliderItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: width,
    elevation: 10,
  },
  img: {
    height: height*0.185, 
    width: width*0.75, 
    borderRadius: 22,
    borderWidth:0.5,
    borderColor:'white',
  },
  textColor: {
    color: 'skyblue',
  },
});
