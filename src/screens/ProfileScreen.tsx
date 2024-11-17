import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faWallet, faStrikethrough, faTruckFast, faStar } from '@fortawesome/free-solid-svg-icons';
import {clearData, getData} from '../configs/asyncStrong';
import axiosInstance from '../configs/axios';

function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
  });

  const [order_number, setOrder_number] = useState<any>({});

  const GetUser = async () => {
    const userJson = await getData('customer');
    const userData = JSON.parse(userJson || '{}');

    setUser({
      fullName: userData.full_name || '',
      phoneNumber: userData.phone_number || '',
      email: userData.email || '',
      address: userData.address || '',
    });

    if (userData != null && userData != '') {
      let pending_order = axiosInstance.get(
        '/order/order_count_by_status?status=pending',
      );
      let shipping_order = axiosInstance.get(
        '/order/order_count_by_status?status=shipping',
      );
      let success_order = axiosInstance.get(
        '/order/order_count_by_status?status=success',
      );
      let cancel_order = axiosInstance.get(
        '/order/order_count_by_status?status=cancel',
      );

      const [pendingResponse, shippingResponse, successResponse] =
        await Promise.all([pending_order, shipping_order, success_order]);
      const pendingCount = pendingResponse.data || 0;
      const shippingCount = shippingResponse.data || 0;
      const successCount = successResponse.data || 0;
      setOrder_number({
        pending: pendingCount,
        shipping: shippingCount,
        success: successCount,
      });
    }
  };

  const Logout = async () => {
    await clearData();
    navigation.navigate('Home' as never);
  };

  const HandleChangeScreenHistory = (status: string, navigation: any) => {
    navigation.navigate('OrderHistory', { status });
  };
  

  useEffect(() => {
    GetUser();
  }, []);

  const handleChange = (field: keyof typeof user, value: string) => {
    setUser({...user, [field]: value});
  };

  return (
    <SafeAreaView style={styles.container}>
    
      <View
        style={[
          styles.form,
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: 5,
            paddingVertical: 5,
            marginBottom: 20,
          },
        ]}>
        <TouchableOpacity
          style={[styles.orderButton]}
          onPress={() => HandleChangeScreenHistory('pending', navigation)}>
            <FontAwesomeIcon icon={faWallet} color='#FFC107' style={styles.icon} size={30}/>
          <Text style={styles.orderCount}>{order_number.pending}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => HandleChangeScreenHistory('shipping', navigation)}>
         <FontAwesomeIcon icon={faTruckFast} color='#17A2B8' style={styles.icon} size={30}/>
          <Text style={styles.orderCount}>{order_number.shipping}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => HandleChangeScreenHistory('cancel', navigation)}>
          <FontAwesomeIcon icon={faStrikethrough} color='#DC3545' style={styles.icon} size={30}/>
          <Text style={styles.orderCount}>{order_number.shipping}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => HandleChangeScreenHistory('success', navigation)}>
          <FontAwesomeIcon icon={faStar} color='#28A745' style={styles.icon} size={30}/>
          <Text style={styles.orderCount}>{order_number.success}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {Object.entries(user).map(([key, value]) => (
          <View key={key} style={styles.inputContainer}>
            <Text>
              {key === 'fullName'
                ? 'Họ và tên'
                : key === 'phoneNumber'
                ? 'Số điện thoại'
                : key === 'email'
                ? 'Email'
                : 'Địa chỉ'}
            </Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={text =>
                handleChange(key as keyof typeof user, text)
              }
              placeholder={`Nhập ${
                key === 'fullName'
                  ? 'họ và tên'
                  : key === 'phoneNumber'
                  ? 'số điện thoại'
                  : key === 'email'
                  ? 'email'
                  : 'địa chỉ'
              }`}
              keyboardType={
                key === 'phoneNumber'
                  ? 'phone-pad'
                  : key === 'email'
                  ? 'email-address'
                  : 'default'
              }
            />
          </View>
        ))}
        <View style={{paddingBottom: 50}}>
          <TouchableOpacity
            onPress={Logout}
            style={{backgroundColor: '#10b9b0', padding: 20, borderRadius: 20}}>
            <Text style={{color: '#fff', textAlign: 'center'}}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 5,
    alignItems: 'center',
    alignContent: 'center',
  },
  form: {
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 10,
    paddingTop: 20,
    paddingBottom: 10,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  btn: {
    fontSize: 18,
  },
  orderButton: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: 60,
    position: 'relative',
  },
  btnText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },
  orderCount: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
    position: 'absolute',
    top: 0,
    right: 10,
  },
  icon: {
    padding: 10,
  },
});

export default ProfileScreen;
