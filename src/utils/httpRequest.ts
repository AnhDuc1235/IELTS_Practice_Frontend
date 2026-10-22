import axios from 'axios';
import { TAuthTokens } from '@/type/auth';
import { getCookie, setCookie, removeCookie } from '@/utils/cookies';

const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn accessToken từ Cookie vào Header Authorization
httpRequest.interceptors.request.use(
  (config) => {
    const token = getCookie('accessToken') || localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Dùng chung 1 lần refresh khi nhiều request cùng bị 401
let refreshPromise: Promise<TAuthTokens> | null = null;

const requestNewTokens = (refreshToken: string) => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${httpRequest.defaults.baseURL}/auth/refresh-token`, { refreshToken })
      .then((res) => res.data.data as TAuthTokens)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

httpRequest.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getCookie('refreshToken') || localStorage.getItem('refreshToken');

    // Access token hết hạn (401): xin token mới bằng refreshToken
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      try {
        const tokens = await requestNewTokens(refreshToken);

        // Lưu token mới vào Cookie
        setCookie('accessToken', tokens.accessToken);
        setCookie('refreshToken', tokens.refreshToken);
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return httpRequest(originalRequest);
      } catch {
        // Refresh token cũng hết hạn: xoá sạch Cookie và về trang login
        removeCookie('accessToken');
        removeCookie('refreshToken');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(new Error('Phiên đăng nhập đã hết hạn'));
      }
    }

    const message = error.response?.data?.message || error.message || 'Error';
    return Promise.reject(new Error(message));
  }
);

export default httpRequest;
