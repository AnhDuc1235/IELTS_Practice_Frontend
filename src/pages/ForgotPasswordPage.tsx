import { useNavigate } from 'react-router-dom';
import AccountSideMenu from '@/components/auth/AccountSideMenu';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-6">

        {/* Bố cục 2 cột giống ecommerce-guitar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
          <div className="border border-[#d8d8d8] bg-white p-6 shadow-xs">
            <h1 className="text-[28px] font-semibold leading-tight md:text-[34px] text-gray-900">
              Reset Your Password
            </h1>

            <p className="mt-3 text-[15px] text-[#555]">
              Enter the e-mail address associated with your account and verify through OTP code.
            </p>

            <div className="mt-6 border border-amber-200 bg-amber-50 text-amber-900 p-4 rounded-xs text-[14px] leading-relaxed">
              <p className="font-semibold text-amber-950 mb-1">
                Lưu ý từ hệ thống Backend Learnly:
              </p>
              Theo tài liệu API, chức năng gửi OTP qua email đang được phát triển thêm trên máy chủ. Bạn có thể quay lại trang đăng nhập để tiếp tục sử dụng.
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="inline-flex cursor-pointer items-center justify-center gap-2 bg-[#1e2227] px-7 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#161b22] rounded-xs"
              >
                &larr; Back to Login
              </button>
            </div>
          </div>

          {/* Menu bên phải */}
          <AccountSideMenu active="Forgotten Password" />
        </div>

      </div>
    </div>
  );
}

export { ForgotPasswordPage };
