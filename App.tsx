import 'react-native-gesture-handler';
import React, {useEffect, useRef} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import store from './src/configs/store.ts';
import './src/configs/logger.ts';
import Toast from 'react-native-toast-message';

import HomeScreen from './src/screens/HomeScreen.tsx';
import LoginScreen from './src/screens/LoginScreen.tsx';
import RegisterScreen from './src/screens/RegisterScreen.tsx';
import DetailProductScreen from './src/screens/DetailProductScreen.tsx';
import ProfileScreen from './src/screens/ProfileScreen.tsx';
import ShoppingCardScreen from './src/screens/ShoppingCardScreen.tsx';
import OrderDetailScreen from './src/screens/OrderDetailScreen.tsx';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen.tsx';
import CheckOutScreen from './src/screens/CheckOutScreen.tsx';

import {fetchSizes} from './src/slices/sizeSlice.ts';
import {fetchColors} from './src/slices/colorSlice.ts';
import {fetchCategory} from './src/slices/categorySlice.ts';

const Stack = createNativeStackNavigator();

function App() {
  const toastRef = useRef<any>(null);

  useEffect(() => {
    store.dispatch(fetchSizes());
    store.dispatch(fetchColors());
    store.dispatch(fetchCategory());
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerBackTitle: '',
              headerShown: false,
            }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="DetailProduct"
              component={DetailProductScreen}
              options={{
                headerShown: true,
                headerTitle: '',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: true,
                title: 'Thông tin tài khoản',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="ShoppingCard"
              component={ShoppingCardScreen}
              options={{
                headerShown: true,
                title: 'Giỏ hàng',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="OrderDetail"
              component={OrderDetailScreen}
              options={{
                headerShown: true,
                title: 'Thông tin đơn hàng',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="OrderHistory"
              component={OrderHistoryScreen}
              options={{
                headerShown: true,
                title: 'Đơn hàng đã đặt',
                headerBackTitleVisible: false,
              }}
            />

            <Stack.Screen
              name="CheckOut"
              component={CheckOutScreen}
              options={{
                headerShown: true,
                title: 'Thanh toán',
                headerBackTitleVisible: false,
              }}
            />
            
          </Stack.Navigator>
          <Toast />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
