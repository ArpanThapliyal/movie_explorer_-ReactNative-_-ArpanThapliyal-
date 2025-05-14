import React, { useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import SliderItem from './SliderItem';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
  runOnUI,
} from 'react-native-reanimated';
import Pagination from './Pagination';
import { GetAllMovies } from '../../axiosRequest/axiosRequest';

const { width } = Dimensions.get('screen');

type Props = {
  page?: number;
};

const Slider = ({ page = 1 }: Props) => {
  const scrollX = useSharedValue(0);
  const offset = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [data, setData] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useAnimatedRef<Animated.FlatList>();
  const isAutoPlay = useRef(true);
  const interval = useRef<NodeJS.Timeout>();

  // Fetch dynamic banners
  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      const movies = await GetAllMovies(page, 10);
      if (movies) {
        const topFive = movies.slice(0, 5).map((m: any) => ({
          image: { uri: m.banner_url },
        }));
        setOrigData(topFive);
        // triple for seamless loop
        setData([...topFive, ...topFive, ...topFive]);
      }
      setLoading(false);
    };
    fetchBanners();
  }, [page]);

  // initial scroll to middle copy
  useEffect(() => {
    if (!loading && origData.length && data.length) {
      const startOffset = origData.length * width;
      offset.value = startOffset;
      // scroll on UI thread
      runOnUI(() => scrollTo(ref, startOffset, 0, false))();
    }
  }, [loading, origData.length, data.length]);

  // Autoplay
  useEffect(() => {
    if (data.length && isAutoPlay.current) {
      interval.current = setInterval(() => {
        offset.value = offset.value + width;
      }, 5000);
    }
    return () => clearInterval(interval.current!);
  }, [data.length]);

  // Scroll to offset with animation
  useDerivedValue(() => {
    if (data.length) scrollTo(ref, offset.value, 0, true);
  }, [offset, ref, data.length]);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const handleMomentumEnd = (e: any) => {
    let idx = Math.round(e.nativeEvent.contentOffset.x / width);
    const count = origData.length;
    // if at either end, reset to middle copy
    if (idx < count) {
      idx = idx + count;
      runOnUI(() => scrollTo(ref, idx * width, 0, false))();
    } else if (idx >= count * 2) {
      idx = idx - count;
      runOnUI(() => scrollTo(ref, idx * width, 0, false))();
    }
    setPaginationIndex(idx % count);
    offset.value = idx * width;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="skyblue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={ref}
        data={data}
        renderItem={({ item, index }) => (
          <SliderItem item={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollBeginDrag={() => (isAutoPlay.current = false)}
        onScrollEndDrag={() => (isAutoPlay.current = true)}
      />
      <Pagination
        items={origData}
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
    height: width * 0.6,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
