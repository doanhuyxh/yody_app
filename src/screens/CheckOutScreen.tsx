import {
  Text,
  View,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import axios from 'axios';
import {useSelector} from 'react-redux';
import queryString from 'query-string';
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosInstance from '../configs/axios';
import {formatCurrency} from '../utils/format';
import {clearData, getData} from '../configs/asyncStrong';
import {LoadingText} from '../components/Loading';

function CheckOutScreen() {
  const navigation = useNavigation();
  const router = useRoute();
  const [loading, setLoading] = useState<string>('loading');
  const color = useSelector((state: any) => state.color.Colors);
  const size = useSelector((state: any) => state.size.sizes);
  const [user, setUser] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
  });
  const [shopping_card, setShopping_card] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [paymentUrl, setPaymentUrl] = useState<string | ''>('');

  const initiatePayment = async (totalPrice: number) => {
    
    try {
      const response = await axios.post(
        'https://vnpay.lokid.xyz/api/vnpay-payment',
        {total_price: totalPrice},
      );
      const paymentUrl = response.data.data;
      if (paymentUrl) {
        setPaymentUrl(paymentUrl);
        setLoading('payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  async function CallData() {
    const userJson = await getData('customer');
    const userData = JSON.parse(userJson || '{}');

    setUser({
      fullName: userData.full_name || '',
      phoneNumber: userData.phone_number || '',
      email: userData.email || '',
      address: userData.address || '',
    });

    let res = await axiosInstance.get('/shopping_card');
    let data = res.data;
    console.log('shopping_card:: ', data);
    let temp_price = 0;
    if (data && data.length !== 0) {
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
      setLoading('showOrder');
    }
  }

  useEffect(() => {
    CallData();
  }, []);

  useEffect(() => {
    if (loading == 'payment_success') {
      let product_var_order: any[] = [];
      let shopping_card_ids: number[] = [];

      shopping_card.forEach(item => {
        shopping_card_ids.push(item.id);
        product_var_order.push({
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
          price: item.price,
        });
      });

      const parsedQuery = queryString.parse(paymentUrl);

      let post_data = {
        shipping_address: user.address,
        total_amount: totalPrice,
        order_code: parsedQuery.vnp_TxnRef,
        order_detail: product_var_order,
      };

      axiosInstance.post('/order/add_order', post_data).then(res => {
        shopping_card_ids.forEach(item => {
          axiosInstance.get(`shopping_card/delete?id=${item}`);
        });
      });

      setTimeout((navigation) => {
        navigation.navigate('OrderHistory' as any, { status: 'pending' });
      }, 3000);      

    }
  }, [loading]);

  if (loading == 'loading') {
    return <LoadingText message="Đảng tải trang" />;
  }

  if (loading == 'showOrder') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.cartSection}>
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
                    Màu:{' '}
                    {color.find((it: any) => item.color_id === it.id)?.name}
                    {'  '}
                    Size: {size.find((it: any) => item.size_id === it.id)?.name}
                  </Text>
                  <View style={styles.priceQuantityContainer}>
                    <Text style={styles.priceText}>
                      {formatCurrency(item.price)} VNĐ
                    </Text>
                    <Text style={styles.quantityText}>
                      Số lượng: {item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Họ Tên</Text>
            <TextInput
              style={styles.input}
              value={user.fullName}
              onChangeText={text => setUser({...user, fullName: text})}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={user.email}
              onChangeText={text => setUser({...user, email: text})}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={user.phoneNumber}
              onChangeText={text => setUser({...user, phoneNumber: text})}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={user.address}
              onChangeText={text => setUser({...user, address: text})}
            />
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Tổng cộng: {shopping_card.length} sản phẩm
            </Text>
            <Text style={styles.totalText}>
              Tổng thanh toán: {formatCurrency(totalPrice)} VNĐ
            </Text>
          </View>
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => initiatePayment(totalPrice)}>
            <Text style={styles.paymentButtonText}>Thanh toán ngay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading == 'payment') {
    return (
      <WebView
        source={{uri: paymentUrl}}
        onNavigationStateChange={state => {
          if (state.url.includes('yody.lokid.xyz/payment')) {
            setPaymentUrl(state.url);
            setLoading('payment_success');
          }
        }}
      />
    );
  }

  if (loading == 'payment_success') {
    return <LoadingText message="Đặt hàng thành công, đang chuyển hướng sang đơn hàng" />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cartSection: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productDetails: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f57c00',
  },
  quantityText: {
    fontSize: 14,
    color: '#555',
  },
  paymentSection: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  totalContainer: {
    marginVertical: 16,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'right',
  },
  paymentButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckOutScreen;
