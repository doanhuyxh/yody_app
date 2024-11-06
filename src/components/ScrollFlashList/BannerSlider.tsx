import React, { useEffect, useRef, useState } from 'react';
import { View, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
interface BannerSliderProps {
  banner: any[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banner }) => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [indexBanner, setIndexBanner] = useState<number>(0);

  const scrollToNext = () => {
    const nextIndex = (indexBanner + 1) % banner.length;
    setIndexBanner(nextIndex);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
    }
  };

  useEffect(() => {
    const interval = setInterval(scrollToNext, 3000);
    return () => clearInterval(interval);
  }, [indexBanner]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={event => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const index = Math.floor(contentOffsetX / width);
          setIndexBanner(index);
        }}
      >
        {banner.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={image} style={styles.image} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageWrapper: {
    width: width,
    height: height / 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding:4
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode:'cover',
    borderRadius:20,
  },
});

export default BannerSlider;
