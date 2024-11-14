import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import axiosInstance from '../../configs/axios';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

type ProductByCategoryProps = {
  cateId: number;
};

const ProductByCategory: React.FC<ProductByCategoryProps> = ({cateId}) => {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cateId) {
      setLoading(true);

      axiosInstance
        .get(`/category/product/${cateId}?page=1&pageSize=10`)
        .then(res => {
          let productData = res.data;
          let fetchImagePromises = productData.map(async (product: any) => {
            try {
              const imageResponse = await axiosInstance.get(
                `/product/image/${product.id}`,
              );
              return {...product, imageUrl: imageResponse.data};
            } catch {
              return {...product, imageUrl: null};
            }
          });

          Promise.all(fetchImagePromises).then(productsWithImages => {
            setProducts(productsWithImages);
            setLoading(false);
          });
        })
        .catch(() => {
          setError('Failed to load products');
          setLoading(false);
        });
    }
  }, [cateId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScrollView
      horizontal={true}
      style={style.container}
      showsHorizontalScrollIndicator={false}>
      {products.map(item => (
        <TouchableOpacity
          key={item.id}
          style={style.productItem}
          onPress={() => {
            navigation.navigate('DetailProduct' as never, {productId: item.id});
          }}>
          <View style={style.imageContainer}>
            {item.imageUrl && item.imageUrl[0]?.image_link ? (
              <Image
                source={{
                  uri: `https://api.yody.lokid.xyz${item.imageUrl[0].image_link}`,
                }}
                style={style.productImage}
              />
            ) : (
              <Text style={style.noImageText}>No Image Available</Text>
            )}
          </View>
          <View>
            <View style={style.productTitle}>
              <Text style={style.productName}>{item.name}</Text>
              <Text style={style.productPrice}>Giá: {item.price} VNĐ</Text>
            </View>
            <View style={style.btnContainer}>
              <TouchableOpacity
                style={style.buyNowBtn}
                onPress={() => {
                  navigation.navigate('DetailProduct' as never, {
                    productId: item.id,
                  });
                }}>
                <Text style={style.btnText}>Mua ngay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.cartBtn}
                onPress={() => {
                  navigation.navigate('DetailProduct' as never, {
                    productId: item.id,
                  });
                }}>
                <Text style={style.btnText}>🛒</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    padding: 10,
    margin: 'auto',
    width: '100%',
    height: 'auto',
  },
  productItem: {
    flexDirection: 'column',
    padding: 10,
    marginRight: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    flex: 1,
  },
  productImage: {
    width: 200,
    height: 250,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 10,
  },
  noImageText: {
    fontSize: 12,
    color: '#888',
  },
  productTitle: {
    flexDirection: 'column',
    gap: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    writingDirection: 'auto',
    flexWrap: 'wrap',
    width: 180,
  },
  productPrice: {
    fontSize: 20,
    color: '#333',
    textAlign: 'left',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 10,
    height: 40,
  },
  buyNowBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: 'red',
  },
  cartBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: '#10b9b0',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductByCategory;
