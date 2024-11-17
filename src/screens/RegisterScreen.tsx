import {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../configs/axios';

function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleRegister = () => {
    let data = {
        "address":"",
        "email":email,
        "full_name":fullName,
        "password":password,
        "phone":phone

    }
    axiosInstance.post("/auth/register", data)
    .then((res:any)=>{
       if(res.code != 5001){
        navigation.navigate("Login" as never)
        return
       }
       Alert.alert('Error', 'Đăng ký thất bại');
    })
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image source={require('../assets/logo.png')} />
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={{marginBottom:10}}>Đăng ký miễn phí để truy cập bất kỳ sản phẩm nào của chúng tôi</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          keyboardType='default'
          value={fullName}
          onChangeText={text => setFullName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={text => setEmail(text)}
        />
         <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          keyboardType='phone-pad'
          value={phone}
          onChangeText={text => setPhone(text)}
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
          onPress={handleRegister}
          style={{
            backgroundColor: 'black',
            width: '100%',
            padding: 20,
            borderRadius: 10,
          }}>
          <Text style={{color: 'white', textAlign: 'center'}}>Đăng Ký</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerRes}>
        <Text style={{fontSize: 20}}>Bạn đã có tài khoản?</Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={{textDecorationLine: 'underline', fontSize: 20}}>
            Đăng nhập
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
    transform: [{translateX: 0}, {translateY: -120}],
  },
  form: {
    width: '100%',
    transform: [{translateX: 0}, {translateY: -80}],
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color:"#000"
  },
  containerRes: {
    flexDirection: 'row',
    gap: 10,
    transform: [{translateY: -60}],
  },
  containerBtn: {
    width: '100%',
    transform: [{translateY: -80}],
  },
});

export default RegisterScreen;
