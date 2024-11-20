import {
  View,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import axiosInstance from '../configs/axios';
import {ProductByVariant} from '../components/Product';
import {formatCurrency} from '../utils/format';

function OrderDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {order_id} = route.params || {};

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    axiosInstance.get('/order/' + order_id).then(res => {
      let data = res.data;
      setOrder(data);
    });
  }, [order_id]);

  return (
    <SafeAreaView style={{flex:1, margin: 10, padding: 10}}>
      <ScrollView style={styles.containerScroll} horizontal={true}>
        {order &&
          order.order_detail &&
          order.order_detail.map((item: any, index: number) => {
            return (
              <ProductByVariant
                product_id={item.product_id}
                product_variant_id={item.product_variant_id}
                typeImage="column"
              />
            );
          })}
      </ScrollView>

      <ScrollView>
        <Text>Hiển thị tracking đơn hàng</Text>
      </ScrollView>

      {order && (
        <View style={styles.containerDetail}>
          <View style={styles.section}>
            <Text style={styles.orderCode}>
              Mã đơn hàng:{' '}
              <Text style={styles.boldText}>{order.order_code}</Text>
            </Text>
            <Text style={styles.orderDate}>
              Ngày đặt hàng:{' '}
              <Text>{order.order_date.replace('T00:00:00Z', '')}</Text>
            </Text>
            <View style={styles.separator} />
            <Text style={styles.totalAmount}>
              Tổng tiền: {formatCurrency(order.total_amount)} VNĐ
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.paymentMethod}>
              Phương thức thanh toán: <Text style={styles.boldText}>VNPAY</Text>
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerScroll: {
    width: '100%',
    height:0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  containerDetail:{
    position:"absolute",
    bottom:0,
    width:"100%"
  },
  orderCode: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    marginBottom: 5,
  },
  paymentMethod: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  totalAmount: {
    fontSize: 18,
    color: '#e12d2d', // Màu đỏ nổi bật cho giá tiền
    fontWeight: 'bold',
    marginTop: 10,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
});

export default OrderDetailScreen;
