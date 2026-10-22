import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import AccountSideMenu from '@/components/auth/AccountSideMenu';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Submit đăng ký tài khoản (POST /auth/register)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await authService.register({ name, email, password });

      if (response.success || response.data) {
        // Chuyển hướng tới trang thông báo kết quả giống ecommerce-guitar
        navigate(
          `/auth/result?type=register&next=/login&message=${encodeURIComponent('Register account success. Please login to continue.')}`
        );
      } else {
        setErrorMessage(response.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-6">

        {/* Bố cục 2 cột giống ecommerce-guitar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
          <div>

            {/* Thông báo lỗi nếu có */}
            {errorMessage && (
              <div className="border border-red-300 bg-red-100 text-red-800 px-4 py-3 text-sm font-semibold mb-4 rounded-xs">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 border border-[#d8d8d8] bg-white p-6 shadow-xs"
            >
              <div className="text-[28px] font-semibold text-gray-900">
                Register Account
              </div>

              <div className="text-[14px] text-[#555]">
                If you already have an account with us, please login at the{' '}
                <Link to="/login" className="text-[#062962] font-medium underline">
                  login page
                </Link>
                .
              </div>

              <div className="pt-2 grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[15px] font-semibold block text-gray-800">
                    Your Name *
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none focus:border-[#062962]"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="text-[15px] font-semibold block text-gray-800">
                    E-Mail *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none focus:border-[#062962]"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="text-[15px] font-semibold block text-gray-800">
                    Password *
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    maxLength={100}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none focus:border-[#062962]"
                    placeholder="Enter your password (at least 6 characters)"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer bg-[#062962] px-8 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#083884] disabled:opacity-60 rounded-xs"
                >
                  {loading ? 'Processing...' : 'Continue'}
                </button>
              </div>
            </form>
          </div>

          {/* Menu bên phải */}
          <AccountSideMenu active="Register" />
        </div>

      </div>
    </div>
  );
}

export { RegisterPage };
