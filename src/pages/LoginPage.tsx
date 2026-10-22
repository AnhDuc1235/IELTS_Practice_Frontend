import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import AccountSideMenu from '@/components/auth/AccountSideMenu';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Submit đăng nhập truyền thống (Email + Password)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.data) {
        // Lưu token và lấy thông tin người dùng
        await login(response.data);

        // Chuyển hướng tới trang thông báo kết quả
        navigate(
          `/auth/result?type=login&next=/account&message=${encodeURIComponent('Login success')}`
        );
      } else {
        setErrorMessage('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập qua Google OAuth
  const handleGoogleLogin = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    const redirectTo = encodeURIComponent(window.location.origin);
    window.location.href = `${apiBase}/auth/google?redirectTo=${redirectTo}`;
  };

  return (
    <div className="min-h-[70vh] bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-6">

        {/* 3 cột theo phong cách ecommerce-guitar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_200px]">
          
          {/* Cột 1: Khách hàng mới (New Customer) */}
          <section className="border border-[#d8d8d8] bg-white p-4 md:p-5 flex flex-col justify-between">
            <div>
              <div className="text-[17px] font-semibold text-gray-900">
                New Customer
              </div>

              <div className="mt-1 text-[15px] font-semibold text-black">
                Register Account
              </div>

              <p className="mt-4 text-[14px] text-[#444] leading-6">
                By creating an account you will be able to practice tests faster,
                keep track of your scores and test attempts, and access premium IELTS materials.
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full cursor-pointer bg-[#062962] text-white font-semibold py-2.5 text-[15px] hover:bg-[#083884] transition-all rounded-xs"
                onClick={() => navigate('/register')}
              >
                Continue
              </button>
            </div>
          </section>

          {/* Cột 2: Form đăng nhập (Login to your account) */}
          <section className="border border-[#d8d8d8] bg-white p-4 md:p-5">
            <div className="text-[28px] font-semibold text-black">
              Login to your account
            </div>

            {/* Thông báo lỗi nếu có */}
            {errorMessage && (
              <div className="mt-4 bg-amber-100 border border-amber-300 text-amber-900 px-3 py-2 text-center text-[14px]">
                {errorMessage}
              </div>
            )}

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-[16px] font-semibold block text-gray-800">
                  E-Mail Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                  autoComplete="email"
                  className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none focus:border-[#062962]"
                  placeholder="E-Mail Address"
                  required
                />
              </div>

              <div>
                <label className="text-[16px] font-semibold block text-gray-800">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  maxLength={100}
                  autoComplete="current-password"
                  className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none focus:border-[#062962]"
                  placeholder="Password"
                  required
                />

                <div className="mt-2 text-right">
                  <Link
                    to="/forgot-password"
                    className="text-[14px] text-[#062962] hover:underline"
                  >
                    Forgotten Password
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-[#062962] text-white font-semibold py-2.5 text-[15px] hover:bg-[#083884] transition-all disabled:opacity-60 disabled:cursor-not-allowed rounded-xs"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>

              {/* Nút đăng nhập với Google */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full cursor-pointer bg-[#4285f4] text-white py-2 text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-[#2f6fd6] rounded-xs"
                >
                  <span className="bg-white rounded-full p-1 flex items-center justify-center">
                    <img
                      src="/google-icon-logo-svgrepo-com.svg"
                      alt="Google"
                      className="w-4 h-4"
                    />
                  </span>
                  Continue with Google
                </button>
              </div>
            </form>
          </section>

          {/* Cột 3: Menu bên phải */}
          <AccountSideMenu active="Login" />
        </div>

      </div>
    </div>
  );
}

export { LoginPage };
