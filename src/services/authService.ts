import httpRequest from '@/utils/httpRequest';
import { TApiResponse, TAuthTokens, TUser } from '@/type/auth';

// Các API theo api.md.
// httpRequest đã trả về response.data nên kiểu trả về khai báo là TApiResponse<...>.
// Refresh token do interceptor trong httpRequest tự xử lý.
const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    httpRequest.post<any, TApiResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    httpRequest.post<any, TApiResponse<TAuthTokens>>('/auth/login', data),

  // Đổi code của Google OAuth lấy token của hệ thống
  googleLogin: (code: string) =>
    httpRequest.post<any, TApiResponse<TAuthTokens>>('/auth/google/login', { code }),

  logout: () => httpRequest.delete<any, TApiResponse>('/auth/logout'),

  getProfile: () => httpRequest.get<any, TApiResponse<TUser>>('/profile'),

  updateProfile: (data: Partial<TUser>) =>
    httpRequest.patch<any, TApiResponse<TUser>>('/profile', data),
};

export { authService };
export default authService;
