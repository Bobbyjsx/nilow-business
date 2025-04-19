import axios from 'axios';
import { BASE_API_URL, TOKEN_KEY } from './constants';
import { auth } from '@/app/auth';
import { getSession } from 'next-auth/react';

const http = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-client-role': 'Business',
  },
});

http.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = session?.user?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default http;

export const getServerError = (error: any) => {
  const errorMessage = error?.response?.data?.response?.message || error?.response?.data?.message[0] || error?.message || 'An error occurred';

  return errorMessage;
};
