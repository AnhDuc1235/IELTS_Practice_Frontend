import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Xử lý callback sau khi người dùng xác thực Google OAuth.
 * Backend redirect về frontend kèm query ?code=...
 * Handler này đổi mã code lấy token hệ thống và hoàn tất đăng nhập.
 */
export default function GoogleOAuthCallbackHandler() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isExchangingRef = useRef(false);

  const code = searchParams.get('code');

  useEffect(() => {
    if (!code || isExchangingRef.current) return;
    isExchangingRef.current = true;

    const exchangeCode = async () => {
      try {
        const response = await authService.googleLogin(code);

        if (response.data) {
          // Lưu token và cập nhật session
          await login(response.data);

          // Xoá query param 'code' khỏi URL
          searchParams.delete('code');
          setSearchParams(searchParams, { replace: true });

          // Chuyển hướng tới trang thông báo kết quả giống ecommerce-guitar
          navigate(
            `/auth/result?type=login&next=/account&message=${encodeURIComponent('Login success')}`
          );
        } else {
          throw new Error('Google sign-in failed');
        }
      } catch (err: any) {
        console.error('Google OAuth exchange error:', err);
        searchParams.delete('code');
        setSearchParams(searchParams, { replace: true });

        navigate(
          `/auth/result?type=login&next=/login&message=${encodeURIComponent('Login failed. Please try again.')}`
        );
      }
    };

    exchangeCode();
  }, [code, login, navigate, searchParams, setSearchParams]);

  return null;
}

export { GoogleOAuthCallbackHandler };
