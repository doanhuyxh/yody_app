import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {clearData, storeData} from '../configs/asyncStrong';
import axiosInstance from '../configs/axios';

function LoginScreen() {
  const [email, setEmail] = useState('userapp1@gmail.com');
  const [password, setPassword] = useState('123456789');

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Vui lòng nhập email khẩu');
      return;
    }

    let data = {
      password: password,
      user_name: email,
    };

    const res: any = await axiosInstance.post('/auth/login', data);

    if (res.code == 20001) {
      await storeData('customer', res.data.customer);
      await storeData(
        'access_token',
        JSON.stringify(res.data.tokens.access_token),
      );
      await storeData(
        'refresh_token',
        JSON.stringify(res.data.tokens.refresh_token),
      );
      navigation.navigate('Home' as never);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register' as never);
  };

  useEffect(() => {
    clearData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image source={require('../assets/logo.png')} />
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>Đăng nhập</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <View style={styles.containerBtn}>
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: 'black',
            width: '100%',
            padding: 20,
            borderRadius: 10,
          }}>
          <Text style={{color: 'white', textAlign: 'center'}}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerRes}>
        <Text style={{fontSize: 20}}>Bạn chưa có tài khoản?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={{textDecorationLine: 'underline', fontSize: 20}}>
            Đăng ký ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
  },
  logo: {
    width: 'auto',
    transform: [{translateX: 0}, {translateY: -200}],
  },
  form: {
    width: '100%',
    transform: [{translateX: 0}, {translateY: -100}],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  containerRes: {
    flexDirection: 'row',
    gap: 10,
    transform: [{translateY: -80}],
  },
  containerBtn: {
    width: '100%',
    transform: [{translateY: -100}],
  },
});

export default LoginScreen;
