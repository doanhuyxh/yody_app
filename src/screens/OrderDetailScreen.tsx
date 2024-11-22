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
import {ProductByVariantInDetail} from '../components/Product';
import {formatCurrency} from '../utils/format';

function OrderDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const {order_id} = route.params || {};

  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any[]>([]);

  useEffect(() => {
    axiosInstance.get('/order/' + order_id).then(res => {
      let data = res.data;
      setOrder(data);
    });

    axiosInstance.get(`order/tracking?order_id=${order_id}`).then(res => {
      let data = res.data;
      setTracking(data)
    });
  }, [order_id]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f9f9f9'}}>
  <ScrollView style={styles.containerScroll} horizontal={true}>
    {order &&
      order.order_detail &&
      order.order_detail.map((item: any, index: number) => {
        return (
          <ProductByVariantInDetail
            key={index}
            product_id={item.product_id}
            product_variant_id={item.product_variant_id}
          />
        );
      })}
  </ScrollView>

  <ScrollView style={styles.containerScroll}>
    {tracking &&
      tracking.map((item: any, index: number) => (
        <View key={index} style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          {index < tracking.length - 1 && (
            <View style={styles.timelineLine} />
          )}
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTime}>{item.create_time}</Text>
            <Text style={styles.timelineLocation}>{item.location}</Text>
          </View>
        </View>
      ))}
  </ScrollView>

  {order && (
    <View style={styles.containerDetail}>
      <View style={styles.detailSection}>
        <Text style={styles.orderCode}>
          Mã đơn hàng: <Text style={styles.boldText}>{order.order_code}</Text>
        </Text>
        <Text style={styles.orderDate}>
          Ngày đặt hàng:{' '}
          <Text>{order.order_date.replace('T00:00:00Z', '')}</Text>
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.detailSection}>
        <Text style={styles.totalAmount}>
          Tổng tiền: {formatCurrency(order.total_amount)} VNĐ
        </Text>
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
    height: 150,
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
  containerDetail: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'absolute',
    bottom: 0,
  },
  detailSection: {
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
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
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4caf50',
    marginTop: 5,
    marginRight: 10,
  },
  timelineLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#ccc',
    left: 4,
    top: 15,
    zIndex: -1,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 10,
  },
  timelineTime: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timelineLocation: {
    fontSize: 14,
    color: '#666',
  },
});

export default OrderDetailScreen;
