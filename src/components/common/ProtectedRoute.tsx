import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getCookie } from '@/utils/cookies';

/**
 * Middleware kiểm tra đăng nhập:
 * - Kiểm tra nếu có token trong Cookie thì được tính là đăng nhập và cho phép xem trang (<Outlet />).
 * - Nếu không có token trong Cookie (chưa đăng nhập) thì lập tức "đá" về trang /login.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const token = getCookie('accessToken');

  // Khi đang nạp phiên đăng nhập từ cookie lúc mới mở web
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <p className="text-[15px] text-gray-600">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  // Nếu không có token trong cookie và chưa xác thực thì chuyển hướng về /login
  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export { ProtectedRoute };
