import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { clearData, getData } from '../configs/asyncStrong';

function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
  });

  const GetUser = async () => {
    const userJson = await getData("customer");
    const userData = JSON.parse(userJson || '{}');
    setUser({
      fullName: userData.full_name || '',
      phoneNumber: userData.phone_number || '',
      email: userData.email || '',
      address: userData.address || '',
    });
  };

  const Logout = async () => {
    await clearData();
    navigation.navigate("Home" as never);
  };

  useEffect(() => {
    GetUser();
  }, []);

  const handleChange = (field: keyof typeof user, value: string) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {Object.entries(user).map(([key, value]) => (
          <View key={key} style={styles.inputContainer}>
            <Text>{key === 'fullName' ? 'Họ và tên' : key === 'phoneNumber' ? 'Số điện thoại' : key === 'email' ? 'Email' : 'Địa chỉ'}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => handleChange(key as keyof typeof user, text)}
              placeholder={`Nhập ${key === 'fullName' ? 'họ và tên' : key === 'phoneNumber' ? 'số điện thoại' : key === 'email' ? 'email' : 'địa chỉ'}`}
              keyboardType={key === 'phoneNumber' ? 'phone-pad' : key === 'email' ? 'email-address' : 'default'}
            />
          </View>
        ))}
        <View style={{ paddingBottom: 50 }}>
          <TouchableOpacity
            onPress={Logout}
            style={{ backgroundColor: '#10b9b0', padding: 20, borderRadius: 20 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Đăng xuất</Text>
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
    paddingHorizontal: 20,
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
});

export default ProfileScreen;
