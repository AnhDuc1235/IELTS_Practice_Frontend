import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService from '@/services/authService';
import { TAuthTokens, TUser } from '@/type/auth';
import { getCookie, setCookie, removeCookie } from '@/utils/cookies';

type TAuthContext = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean; // true khi đang kiểm tra phiên đăng nhập từ cookie
  login: (tokens: TAuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: TUser | null) => void;
};

const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy thông tin người dùng từ GET /profile
  const refreshUser = async () => {
    const res = await authService.getProfile();
    setUser(res.data);
  };

  // Mở web: Kiểm tra nếu có token trong Cookie thì khôi phục phiên đăng nhập
  useEffect(() => {
    const restoreSession = async () => {
      const token = getCookie('accessToken') || localStorage.getItem('accessToken');
      if (token) {
        try {
          await refreshUser();
        } catch {
          // Token không hợp lệ thì xoá sạch cookie
          removeCookie('accessToken');
          removeCookie('refreshToken');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  // Đăng nhập: Lưu accessToken & refreshToken vào Cookies
  const login = async (tokens: TAuthTokens) => {
    setCookie('accessToken', tokens.accessToken);
    setCookie('refreshToken', tokens.refreshToken);
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    await refreshUser();
  };

  // Đăng xuất: Gọi API và xoá sạch tokens trong Cookies
  const logout = async () => {
    try {
      const token = getCookie('accessToken');
      if (token) {
        await authService.logout();
      }
    } catch {
      // API lỗi vẫn dọn sạch cookie ở client
    }

    removeCookie('accessToken');
    removeCookie('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
