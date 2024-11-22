import {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import axiosInstance from '../../configs/axios';
import {formatCurrency} from '../../utils/format';

function ProductByVariantInDetail({product_id, product_variant_id}) {
  const color = useSelector((state: any) => state.color.Colors);
  const size = useSelector((state: any) => state.size.sizes);

  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [productVariant, setProductVariant] = useState<any>();

  useEffect(() => {
    axiosInstance.get('/product/' + product_id).then(res => {
      let data = res.data;
      setProduct(data);
      setImages(data.Images);
      setProductVariant(
        data.Variants.find((i: any) => i.id == product_variant_id),
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Image Carousel */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
        {images &&
          images.map((item: any, index: number) => {
            if (item.color_id == productVariant?.color_id) {
              return (
                <Image
                  key={index}
                  style={styles.productImage}
                  source={{uri: `https://api.yody.lokid.xyz${item.link}`}}
                />
              );
            }
          })}

        {!images && <Text style={{color: '#000'}}>Không thể lấy sản phẩm</Text>}
      </ScrollView>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product?.Product?.name}</Text>
        <Text style={styles.productPrice}>
          Giá: {formatCurrency(product?.Product?.price)} VNĐ
        </Text>
        <Text style={styles.productDetails}>
          Màu: {color.find((i: any) => i.id == productVariant?.color_id)?.name}{' '}
          Size: {size.find((i: any) => i.id == productVariant?.size_id)?.name}
        </Text>
      </View>
    </View>
  );
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: 300, // Chiều cao tĩnh
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    alignSelf: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 200, // Chiều cao tĩnh của khung hình ảnh
    flexDirection: 'row',
  },
  productImage: {
    width: 180,
    height: 200,
    marginRight: 10,
    borderRadius: 4,
    resizeMode: 'cover',
  },
  infoContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e53935',
    marginTop: 4,
    textAlign: 'center',
  },
  productDetails: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default ProductByVariantInDetail;
