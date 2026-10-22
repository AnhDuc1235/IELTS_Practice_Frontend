import { useNavigate } from 'react-router-dom';
import AccountSideMenu from '@/components/auth/AccountSideMenu';

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-6">

        {/* Bố cục 2 cột giống ecommerce-guitar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
          <div className="border border-[#d8d8d8] bg-white p-6 shadow-xs">
            <h1 className="text-[28px] font-semibold leading-tight text-gray-900">
              Change Password
            </h1>

            <p className="mt-2 text-[14px] text-gray-600">
              Cập nhật mật khẩu bảo vệ tài khoản của bạn.
            </p>

            <div className="mt-6 border border-blue-200 bg-blue-50 text-blue-900 p-4 rounded-xs text-[14px] leading-relaxed">
              <p className="font-semibold text-blue-950 mb-1">
                Thông báo tính năng:
              </p>
              Chức năng đổi mật khẩu đang được tạm hoãn và sẽ sớm được cập nhật khi hệ thống backend Learnly hoàn thiện API đổi mật khẩu.
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="inline-flex cursor-pointer items-center justify-center gap-2 bg-[#062962] px-7 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#083884] rounded-xs"
              >
                &larr; Quay lại tài khoản
              </button>
            </div>
          </div>

          {/* Menu bên phải */}
          <AccountSideMenu active="Password" />
        </div>

      </div>
    </div>
  );
}

export { ChangePasswordPage };
