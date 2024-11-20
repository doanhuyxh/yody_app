import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import axiosInstance from '../configs/axios';
import {ProductByVariant} from '../components/Product';
import {formatCurrency} from '../utils/format';
import { LoadingText } from '../components/Loading';

function OrderHistoryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {status} = route.params || {status:''};

  const [title, setTitle] = useState<string>('');
  const [dataOrder, setDataOrder] = useState<any[]>([]);

  const HandleChangeScreen = (order_id: number, navigation: any) => {
    navigation.navigate('OrderDetail', {order_id});
  };

  useEffect(() => {
    if (status) {
      switch (status) {
        case 'cancel':
          setTitle('Đơn hàng bị huỷ');
          break;
        case 'pending':
          setTitle('Đơn hàng đang chờ xử lý');
          break;
        case 'success':
          setTitle('Đơn hàng thành công');
          break;
        case 'shipping':
          setTitle('Đơn hàng đang vận chuyển');
          break;
        default:
          setTitle('Trạng thái không xác định');
      }
    }

    axiosInstance.get('/order?page=1&pageSize=100000').then(res => {
      let data: any[] = res.data;
      console.log(data)
      setDataOrder(data.filter(i => i.status == status));
    });
  }, [status]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title,
    });
  }, [title]);

  if (!dataOrder){
    return <LoadingText message='Đang tải nội dung'/>
  }

  return (
    <ScrollView style={styles.scrollView}>
      {dataOrder &&
        dataOrder.map((item: any, index: number) => {
          return (
            <View key={index} style={styles.orderContainer}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.productContainer}>
                {item.order_detail &&
                  item.order_detail.map((ite: any, ind: number) => {
                    return (
                      <View key={ind} style={styles.productImageContainer}>
                        <ProductByVariant
                          product_id={ite.product_id}
                          product_variant_id={ite.product_variant_id}
                        />
                      </View>
                    );
                  })}
              </ScrollView>
              {!item.order_detail && (
                <Text
                  style={{
                    textAlign: 'center',
                    opacity: 0.2,
                    margin:"auto"
                  }}>
                  Không lấy đc sản phẩm
                </Text>
              )}
              <TouchableOpacity
                style={styles.orderDetails}
                onPress={() => {
                  HandleChangeScreen(item.id, navigation);
                }}>
                <Text style={styles.orderCode}>
                  Mã đơn hàng:{' '}
                  <Text style={styles.boldText}>{item.order_code}</Text>
                </Text>
                <Text style={styles.orderDate}>
                  Ngày đặt hàng:{' '}
                  <Text style={styles.boldText}>
                    {item.order_date.replace('T00:00:00Z', '')}
                  </Text>
                </Text>
                <Text style={styles.orderDate}>
                  Tổng tiền:{' '}
                  <Text style={styles.boldText}>
                    {formatCurrency(item.total_amount)} VNĐ
                  </Text>
                </Text>

                <Text style={styles.paymentMethod}>
                  Phương thức thanh toán:{' '}
                  <Text style={styles.boldText}>VNPAY</Text>
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  orderContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productContainer: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
    height:100
  },
  productImageContainer: {
    width: 'auto',
    height: 100,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  orderDetails: {
    marginTop: 10,
  },
  orderCode: {
    fontSize: 14,
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  paymentMethod: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default OrderHistoryScreen;
