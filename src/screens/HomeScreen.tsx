import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import axiosInstance from '../configs/axios';
import {ProductByCategory} from '../components/Product';
import BannerSlider, {} from '../components/ScrollFlashList/BannerSlider.tsx'

function HomeScreen() {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const banner = [
    require('../assets/hero_img1.png'),
    require('../assets/hero_img2.png'),
    require('../assets/hero_img3.png'),
    require('../assets/hero_img4.png'),
  ];

  let navigation = useNavigation();
  const [category, setCategory] = useState<any>([]);

  const CallData = () => {
    axiosInstance.get('/category').then(res => {
      setCategory(res.data);
      setRefreshing(false);
    });
  };

  useEffect(() => {
    setRefreshing(true);
    CallData();
  }, [refreshing]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        style={style.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={CallData} />
        }>
        <Header />
        <View style={style.bannerContainer}>
         <BannerSlider banner={banner}/>
        </View>
        <View style={style.categoryContainer}>
          {category &&
            category.map((item: any) => (
              <View key={item.Id} style={style.categoryItemsContainer}>
                <View style={style.categoryItems}>
                  <View style={style.line}></View>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={style.text}>{item.Name}</Text>
                  </View>
                </View>
                <View style={style.categoryItemProducts}>
                  <ProductByCategory cateId={item.Id} />
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 0,
  },
  bannerContainer: {
    height: Dimensions.get('window').height / 4,
    marginTop: 0,
  },
  categoryContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  categoryItemsContainer: {
    flex: 1,
    marginTop: 10,
  },
  categoryItems: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  categoryItemProducts: {},
  line: {
    width: 5,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#07bc0c',
  },
  text: {
    color: 'black',
    fontSize: 20,
    lineHeight: 24,
  },
});

export default HomeScreen;
