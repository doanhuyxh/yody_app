import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getData } from '../../configs/asyncStrong';
import axiosInstance from '../../configs/axios';

function Header() {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [numberCard, setNumberCard] = useState<number>(0);
  const dispatch = useDispatch();

  const GetUser = useCallback(async () => {
    let userJson = await getData('customer');
    if (!userJson) {
      setUser(null); // Đảm bảo rằng user được đặt là null nếu không tìm thấy
      return;
    }
    
    let userData = JSON.parse(userJson);
    setUser(userData); // Cập nhật thông tin user

    // Gọi API để lấy số lượng thẻ trong giỏ hàng
    try {
      const res = await axiosInstance.get('/shopping_card');
      //setNumberCard(res.data.cardCount); // Cập nhật số lượng thẻ
    } catch (error) {
      console.error('Error fetching shopping card:', error);
      setNumberCard(0); // Đặt lại số lượng thẻ nếu có lỗi
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      GetUser(); // Gọi GetUser mỗi khi màn hình được focus
    }, [GetUser])
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>
      {user != null ? (
        <View style={styles.userContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Profile' as never);
            }}>
            <Image
              style={{ width: 35, height: 35, padding: 4, borderRadius: 10 }}
              source={require('../../assets/user.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ShoppingCard' as never);
            }}>
            {numberCard !== 0 && (
              <Text
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  right: 0,
                  width: 20,
                  height: 20,
                  top: -10,
                  backgroundColor: 'red',
                  color: 'white',
                  padding: 4,
                  textAlign: 'center',
                  borderRadius: 10,
                }}>
                {numberCard}
              </Text>
            )}
            <View
              style={{
                width: 35,
                height: 35,
                backgroundColor: '#10b9b0',
                padding: 4,
                borderRadius: 10,
              }}>
              <Image
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                source={require('../../assets/cart.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => {
              navigation.navigate('Login' as never);
            }}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => {
              navigation.navigate('Register' as never);
            }}>
            <Text style={[styles.buttonText, styles.signupButtonText]}>
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    height: 80,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: '100%',
    resizeMode: 'contain',
  },
  userContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 180,
    gap: 4,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#10b9b0',
  },
  signupButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#10b9b0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signupButtonText: {
    color: '#10b9b0',
  },
});

export default Header;
