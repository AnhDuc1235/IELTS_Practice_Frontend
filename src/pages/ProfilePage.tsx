import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AccountSideMenu from '@/components/auth/AccountSideMenu';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <p className="text-[15px] text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const accountActionLinks = [
    { label: 'Edit your account information', href: '/account/edit' },
    { label: 'Change your password', href: '/account/change-password' },
    { label: 'Lịch sử làm bài', href: '/history' },
  ];

  return (
    <div className="min-h-[70vh] bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-6">

        {/* Bố cục 2 cột giống ecommerce-guitar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
          <div className="space-y-6">
            
            {/* Hộp My Account */}
            <section className="border border-[#d8d8d8] bg-white shadow-xs">
              <div className="px-5 py-4 border-b border-[#d8d8d8]">
                <h2 className="text-[24px] font-semibold md:text-[28px] text-gray-900">
                  My Account
                </h2>
                <div className="mt-1 break-words text-[14px] text-gray-600">
                  {user.name} &bull; {user.email}
                </div>
              </div>

              {/* Các liên kết hành động */}
              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 md:grid-cols-3">
                {accountActionLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block cursor-pointer border border-[#dedede] px-3 py-3 text-center text-[14px] text-gray-800 hover:text-[#062962] hover:border-[#062962] transition-colors rounded-xs"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>

            {/* Chi tiết thông tin cá nhân */}
            <section className="border border-[#d8d8d8] bg-white p-5 shadow-xs">
              <h3 className="text-[18px] font-semibold text-gray-900 mb-4 pb-2 border-b border-[#e5e5e5]">
                Thông tin cá nhân
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
                <div>
                  <span className="text-gray-500 block text-[13px]">Họ và tên:</span>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>

                <div>
                  <span className="text-gray-500 block text-[13px]">Địa chỉ email:</span>
                  <span className="font-medium text-gray-900">{user.email}</span>
                </div>

                <div>
                  <span className="text-gray-500 block text-[13px]">Số điện thoại:</span>
                  <span className="font-medium text-gray-900">
                    {user.phone || 'Chưa cập nhật'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 block text-[13px]">Địa chỉ:</span>
                  <span className="font-medium text-gray-900">
                    {user.address || 'Chưa cập nhật'}
                  </span>
                </div>
              </div>
            </section>

          </div>

          {/* Menu bên phải */}
          <AccountSideMenu active="Account" />
        </div>

      </div>
    </div>
  );
}

export { ProfilePage };
