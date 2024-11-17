import axios from 'axios';
import { getData, storeData } from './asyncStrong';

const getToken = async () => {
  let token = await getData("access_token");
  if (token) {
    token = JSON.parse(token);
  }
  return token;
};

const getRefreshToken = async () => {
  let token = await getData("refresh_token");
  if (token) {
    token = JSON.parse(token);
    if (token) {
      token = token.replace(/['"]+/g, '');
    }
  }
  return token;
};

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
      console.log(`Bearer ${token}`);
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
  async (error) => {
    if (error.response) {
      const originalRequest = error.config;
      
      if (error.response.data.code === 20005 && !originalRequest._retry) {
        originalRequest._retry = true; 

        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          try {
            const response = await axios.post(
              'https://api.yody.lokid.xyz/api/auth/refresh',
              {},
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              }
            );

            const newAccessToken = response.data?.access_token;
            if (newAccessToken) {
              await storeData("access_token", JSON.stringify(newAccessToken));
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            return Promise.reject(refreshError);
          }
        }
      }

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
