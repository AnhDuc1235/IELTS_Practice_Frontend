import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getCookie } from '@/utils/cookies';

/**
 * Middleware cho các trang Guest (Login, Register):
 * - Nếu người dùng ĐÃ có token trong Cookie (đã đăng nhập) thì chuyển thẳng tới /account.
 * - Nếu chưa đăng nhập thì cho phép vào trang (<Outlet />).
 */
export default function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const token = getCookie('accessToken');

  if (isLoading) {
    return null;
  }

  if (token || isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
}

export { GuestRoute };
