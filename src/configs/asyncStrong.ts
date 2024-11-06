
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key:string, value:string) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Lỗi khi lưu dữ liệu:', e);
    }
  };

const getData = async (key:string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        } else {
            return null;
        }

    } catch (e) {
        console.error(e);
    }
};
const clearData = async () => {
    try {
      await AsyncStorage.removeItem('customer');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('access_token');
    } catch (e) {
      console.error('Error clearing data: ', e);
    }
  };

export { storeData, getData,clearData };