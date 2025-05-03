import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import { ImageSliderType } from '../../data/SliderData';
import SliderItem from './SliderItem';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import Pagination from './Pagination';

type Props = {
  itemList: ImageSliderType[];
};
const { width } = Dimensions.get('screen');

const Slider = ({ itemList }: Props) => {
  const scrollX = useSharedValue(0);
  const offset = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [data, setData] = useState(itemList);
  const ref = useAnimatedRef<Animated.FlatList<ImageSliderType>>();
  const isAutoPlay = useRef(true);
  const interval = useRef<NodeJS.Timeout>();

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
    onMomentumEnd: e => {
      offset.value = e.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setPaginationIndex(viewableItems[0].index % itemList.length);
      }
    },
    [itemList.length]
  );

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  useEffect(() => {
    if (isAutoPlay.current) {
      interval.current = setInterval(() => {
        offset.value += width;
      }, 5000);
    } else {
      clearInterval(interval.current);
    }
    return () => clearInterval(interval.current);
  }, [offset, width]);

  useDerivedValue(() => {
    scrollTo(ref, offset.value, 0, true);
  }, [offset, ref]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={ref}
        data={data}
        renderItem={({ item, index }) => (
          <SliderItem item={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onEndReached={() => setData(d => [...d, ...itemList])}
        onEndReachedThreshold={0.5}
        onScrollBeginDrag={() => {
          isAutoPlay.current = false;
        }}
        onScrollEndDrag={() => {
          isAutoPlay.current = true;
        }}
      />

      <Pagination
        items={itemList}
        scrollX={scrollX}
        paginationIndex={paginationIndex}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
