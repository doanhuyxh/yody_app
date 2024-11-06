import axios from 'axios';
import { getData } from './asyncStrong';


const getToken = async () => {
    let token = await getData("access_token")
    if (token) {
        token = JSON.parse(token)
    }
    return token
}

const axiosInstance = axios.create({
  baseURL: 'https://api.yody.lokid.xyz/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = await getToken();
    if (token) {
      token = token.replace(/['"]+/g, '');
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error('Error response:', error.response);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;