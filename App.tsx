import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
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

import { fetchSizes } from './src/slices/sizeSlice.ts';
import { fetchColors } from './src/slices/colorSlice.ts';
import { fetchCategory } from './src/slices/categorySlice.ts';

declare global {
  var toastRef: any;
}

const Stack = createNativeStackNavigator();

function App() {
  const toastRef = useRef<any>(null);

  useEffect(()=>{

    store.dispatch(fetchSizes())
    store.dispatch(fetchColors())
    store.dispatch(fetchCategory())

    if (toastRef.current) {
      global.toastRef = toastRef.current;
    }

  },[])

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
              options={
                {
                  headerShown:true,
                  headerTitle:"",
                  headerBackTitleVisible:false
                }
              }
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
            <Stack.Screen name="ShoppingCard" component={ShoppingCardScreen} />
          </Stack.Navigator>
          <Toast ref={toastRef}/>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
