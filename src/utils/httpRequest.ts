import axios from 'axios';

const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

httpRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpRequest.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/auth/refresh-token`,
            { refreshToken }
          );

          if (res.data?.accessToken) {
            const newAccessToken = res.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return httpRequest(originalRequest);
          }
        } catch {
          localStorage.clear();
          window.location.href = '/';
        }
      }
    }
    const message = error.response?.data?.message || error.message || 'Error';
    return Promise.reject(new Error(message));
  }
);

export default httpRequest;
