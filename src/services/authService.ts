import httpRequest from '@/utils/httpRequest';

const authService = {
  login: (data: any) => httpRequest.post('/api/auth/login', data),
  register: (data: any) => httpRequest.post('/api/auth/register', data),
  refreshToken: (refreshToken: string) => httpRequest.post('/api/auth/refresh-token', { refreshToken }),
  logout: () => httpRequest.post('/api/auth/logout'),
};

export { authService };
export default authService;
