import {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import axiosInstance from '../configs/axios';
import {formatCurrency} from '../utils/format';
import {useNavigation} from '@react-navigation/native';

function ShoppingCardScreen() {
  const navigation = useNavigation();
  const color = useSelector((state: any) => state.color.Colors);
  const size = useSelector((state: any) => state.size.sizes);

  const [shopping_card, setShopping_card] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  async function CallData() {
    let res = await axiosInstance.get('/shopping_card');
    let data = res.data;
    let temp_price = 0;
    if (data && data.length != 0) {
      const tempData = await Promise.all(
        data.map(async (item: any) => {
          let res_temp_product = await axiosInstance.get(
            '/product/' + item.product_id,
          );
          let temp_product_data = res_temp_product.data;
          item.product_data = temp_product_data;
          temp_price += item.price * item.quantity;
          return item;
        }),
      );
      setTotalPrice(temp_price);
      setShopping_card(tempData);
    }
  }

  useEffect(() => {
    CallData();
  }, []);

  const handleIncreaseQuantity = (index: number) => {
    const updatedCard = [...shopping_card];
    updatedCard[index].quantity += 1;
    setShopping_card(updatedCard);
  };

  const handleDecreaseQuantity = (index: number) => {
    const updatedCard = [...shopping_card];
    if (updatedCard[index].quantity > 1) {
      updatedCard[index].quantity -= 1;
      setShopping_card(updatedCard);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {shopping_card && shopping_card.length == 0 && (
        <View style={styles.centerContent}>
          <Text style={styles.text}>Không có sản phẩm nào</Text>
        </View>
      )}
      <ScrollView>
        {shopping_card &&
          shopping_card.map((item: any, index: number) => (
            <View key={index} style={styles.card}>
              <Image
                style={styles.image}
                source={{
                  uri:
                    'https://api.yody.lokid.xyz' +
                    item.product_data.Images.find(
                      (it: any) => it.color_id === item.color_id,
                    )?.link,
                }}
              />
              <View style={styles.textContainer}>
                <Text style={styles.productName}>
                  {item.product_data.Product.name}
                </Text>
                <Text style={styles.productDetails}>
                  Màu: {color.find((it: any) => item.color_id === it.id)?.name}
                  {'  '}
                  Size: {size.find((it: any) => item.size_id === it.id)?.name}
                </Text>
                <View style={styles.priceQuantityContainer}>
                  <Text style={styles.priceText}>
                    {formatCurrency(item.price)}
                  </Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleDecreaseQuantity(index)}>
                      <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      Số lượng: {item.quantity}
                    </Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleIncreaseQuantity(index)}>
                      <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
      <View style={styles.containerBottom}>
        <View style={styles.additionalInfo}>
          <Text></Text>
        </View>
        <View style={styles.paymentContainer}>
          <Text>
            Tổng thanh toán:{' '}
            <Text style={styles.totalText}>
              {formatCurrency(totalPrice)} VNĐ
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => {
              if (shopping_card.length) {
                navigation.navigate('CheckOut' as never);
              }
            }}>
            <Text style={styles.buyButtonText}>
              Đặt mua ({shopping_card.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
  },
  image: {
    width: 90,
    height: 130,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    color: '#000',
    marginHorizontal: 8,
  },
  quantityButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  containerBottom: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  additionalInfo: {
    flex: 2,
    justifyContent: 'center',
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    height: 40,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'red',
  },
  buyButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'nowrap',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
});

export default ShoppingCardScreen;
