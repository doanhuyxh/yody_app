import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {useSelector} from 'react-redux';
import axiosInstance from '../configs/axios';

function DetailProductScreen() {
  const navigation = useNavigation();
  const router = useRoute<any>();

  const {width, height} = Dimensions.get('window');
  const {productId} = router.params;

  const color = useSelector((state: any) => state.color.Colors);
  const size = useSelector((state: any) => state.size.sizes);
  const category = useSelector((state: any) => state.category.Category);

  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProduct] = useState<any>();
  const [images, setImages] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [categoryProduct, setCategoryProduct] = useState<any[]>([]);

  const [imagesFilter, setImageFilter] = useState<any[]>([]);
  const [indexSelectImage, setIndexSelectImage] = useState<number>(0);
  const [colorSelected, setColorSelected] = useState<number>(0);
  const [sizeSelected, setSizeSelected] = useState<number>(0);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await axiosInstance.get(`/product/${productId}`);
        setProduct(res.data.Product || {});
        setCategoryProduct(res.data.Category || []);
        setImages(res.data.Images || []);
        setImageFilter(res.data.Images || []);
        setVariants(res.data.Variants || []);
      } catch (error) {
        Alert.alert('Error', 'Không thể tải dữ liệu sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  useEffect(() => {
    if (colorSelected == 0) {
      setImageFilter(images);
    } else {
      setImageFilter(images.filter(i => i.color_id == colorSelected));
    }
    setIndexSelectImage(0);
  }, [colorSelected]);

  if (loading) {
    return (
      <View>
        <Text style={styles.loadingText}>Loading</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.containerImagePreview}>
          <View style={styles.imagePreviewWrapper}>
            <Image
              width={width * 0.8}
              height={height * 0.45}
              style={styles.mainImage}
              source={{
                uri:
                  `https://api.yody.lokid.xyz` +
                  imagesFilter[indexSelectImage]?.link,
              }}
            />
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {imagesFilter &&
              imagesFilter.map((item: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageThumbnailWrapper}
                  onPress={() => {
                    setIndexSelectImage(index);
                  }}>
                  <Image
                    width={60}
                    height={70}
                    style={{}}
                    source={{uri: `https://api.yody.lokid.xyz` + item.link}}
                  />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
        <View style={styles.containerDetail}>
          <View style={styles.productNameWrapper}>
            <Text style={styles.productName}>{product.name}</Text>
          </View>
          <View style={styles.categoryWrapper}>
            {categoryProduct &&
              categoryProduct.map((item: any, index: number) => (
                <Text key={index} style={styles.categoryText}>
                  {category.find((i: any) => i.Id == item.category_id)?.Name ||
                    'Không có danh mục'}
                </Text>
              ))}
          </View>
          <View style={styles.sizeSelectionWrapper}>
            <Text style={styles.sizeSelectionText}>
              Chọn kích thước:{' '}
              {size.find((i: any) => i.id == sizeSelected)?.name || ''}
            </Text>
            <View style={styles.sizeButtonsWrapper}>
              {size.map((item: any, index: number) => {
                let check = variants.some(i => i.size_id == item.id);
                return (
                  <TouchableOpacity
                    disabled={!check}
                    key={index}
                    onPress={() => {
                      setSizeSelected(item.id);
                    }}
                    style={[
                      styles.sizeButton,
                      !check && styles.sizeButtonDisabled,
                      (sizeSelected == item.id) && styles.active
                    ]}>
                    <Text
                      style={[
                        styles.sizeButtonText,
                        !check && styles.sizeTextDisabled,
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.colorSelectionWrapper}>
            <Text style={styles.colorSelectionText}>
              Màu sắc:{' '}
              {color.find((i: any) => i.id == colorSelected)?.name ||
                'Chưa chọn màu'}
            </Text>
            <View style={styles.colorButtonsWrapper}>
              {color.map((item: any, index: number) => {
                let check = variants.some(i => i.color_id == item.id);
                if (!check) {
                  return null;
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setColorSelected(item.id);
                    }}
                    key={index}
                    style={styles.colorButton}>
                    <View
                      style={[
                        styles.colorIndicator,
                        {backgroundColor: item.hex_code},
                      ]}></View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.productInfoWrapper}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIndicator}></View>
              <Text style={styles.infoTitle}>Thông tin sản phẩm</Text>
            </View>
            <View style={styles.infoContent}>
              <RenderHTML
                contentWidth={width}
                source={{html: product.description || '<p>Không có mô tả</p>'}}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.containerBtn}>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Mua ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartButtonText}>🛒</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
  },
  scrollContainer: {
    backgroundColor: '#fff',
    padding: 10,
  },
  containerImagePreview: {
    flex: 1,
    marginBottom: 30,
  },
  imagePreviewWrapper: {
    flex: 1,
    marginBottom: 30,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  mainImage: {
    resizeMode: 'stretch',
  },
  imageThumbnailWrapper: {
    borderRadius: 80,
    overflow: 'hidden',
    marginRight: 20,
    padding: 5,
  },
  containerDetail: {
    flex: 1,
  },
  productNameWrapper: {
    marginBottom: 20,
  },
  productName: {
    color: 'black',
    fontSize: 30,
    fontWeight: '700',
  },
  categoryWrapper: {
    flexDirection: 'row',
    gap: 10,
    margin: 10,
  },
  categoryText: {
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 10,
    color: 'white',
    opacity: 0.6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  sizeSelectionWrapper: {
    margin: 10,
    marginBottom: 20,
    flexDirection: 'column',
    gap: 10,
  },
  sizeSelectionText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
  },
  sizeButtonsWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  sizeButton: {
    padding: 15,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sizeButtonDisabled: {
    opacity: 0.5,
  },
  sizeButtonText: {
    color: 'black',
    padding: 0,
    width:"auto"
  },
  sizeTextDisabled: {
    textDecorationLine: 'line-through',
  },
  colorSelectionWrapper: {
    margin: 10,
    marginBottom: 20,
    flexDirection: 'column',
    gap: 5,
  },
  colorSelectionText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
  },
  colorButtonsWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  colorButton: {
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 5,
  },
  colorIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  productInfoWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
    marginRight: 10,
    marginTop: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  infoContent: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: 'gray',
  },
  containerBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  buyButton: {
    backgroundColor: '#10b9b0',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  cartButton: {
    borderWidth: 2,
    borderColor: '#10b9b0',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartButtonText: {
    fontSize: 24,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  active: {
    borderColor: 'red',
    borderWidth:3
  },
});

export default DetailProductScreen;
