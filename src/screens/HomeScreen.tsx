import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';

import Header from '../components/Header';
import axiosInstance from '../configs/axios';
import { ProductByCategory } from '../components/Product';
import BannerSlider from '../components/ScrollFlashList/BannerSlider';
import { LoadingText } from '../components/Loading';

function HomeScreen() {
  const [loading, setLoading] = useState(true); // Bắt đầu với trạng thái loading
  const [refreshing, setRefreshing] = useState(false);
  
  const banner = [
    require('../assets/hero_img1.png'),
    require('../assets/hero_img2.png'),
    require('../assets/hero_img3.png'),
    require('../assets/hero_img4.png'),
  ];

  const [category, setCategory] = useState([]);

  const CallData = async () => {
    try {
      setRefreshing(true); // Bắt đầu refresh
      const res = await axiosInstance.get('/category');
      setCategory(res.data);
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setRefreshing(false); // Kết thúc refresh
      setLoading(false);    // Kết thúc trạng thái loading
    }
  };

  useEffect(() => {
    CallData();
  }, []);

  return (
    <SafeAreaView style={style.container}>
      <ScrollView
        style={style.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={CallData} />
        }>
        <Header />
        <View style={style.bannerContainer}>
          <BannerSlider banner={banner} />
        </View>
        <View style={style.categoryContainer}>
          {loading ? (
            <LoadingText message="Đang tải dữ liệu" />
          ) : (
            category.map((item) => (
              <View key={item.Id} style={style.categoryItemsContainer}>
                <View style={style.categoryItems}>
                  <View style={style.line}></View>
                  <View style={style.wff}>
                    <Text style={style.text}>{item.Name}</Text>
                  </View>
                </View>
                <View style={style.categoryItemProducts}>
                  <ProductByCategory cateId={item.Id} />
                </View>
              </View>
            ))
          )}
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
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  categoryItemsContainer: {
    flex: 1,
    marginTop: 20,
    paddingVertical: 30,
    paddingHorizontal: 10,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f8f8f8',
    borderRadius: 10,
    backgroundColor: '#f5ebe9',
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
  wff: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default HomeScreen;
