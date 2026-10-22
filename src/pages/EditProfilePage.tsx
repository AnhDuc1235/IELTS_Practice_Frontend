import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import authService from '@/services/authService';
import AccountSideMenu from '@/components/auth/AccountSideMenu';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, isLoading, refreshUser } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Xử lý gửi form cập nhật thông tin qua FormData (không cần lạm dụng nhiều useState hay useEffect)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      address: String(formData.get('address') ?? '').trim(),
    };

    try {
      const response = await authService.updateProfile(updatedData);

      if (response.success || response.data) {
        // Tải lại thông tin mới nhất vào AuthContext
        await refreshUser();

        // Chuyển tới trang kết quả
        navigate(
          `/auth/result?type=profile&next=/account&message=${encodeURIComponent('Update profile success')}`
        );
      } else {
        setErrorMessage(response.message || 'Cập nhật thông tin thất bại.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <p className="text-[15px] text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-6">

        {/* Bố cục 2 cột giống ecommerce-guitar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
          <div className="border border-[#d8d8d8] bg-white p-6 shadow-xs">
            <h1 className="text-[28px] font-semibold leading-tight md:text-[34px] text-gray-900">
              My Account Information
            </h1>

            <p className="mt-2 text-[15px] text-[#555]">
              Your Personal Details
            </p>

            {/* Thông báo lỗi nếu có */}
            {errorMessage && (
              <div className="mt-4 border border-red-300 bg-red-100 text-red-800 px-4 py-3 text-sm font-semibold rounded-xs">
                {errorMessage}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-[15px] font-semibold block text-gray-800">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={user.name}
                  className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none focus:border-[#062962]"
                  placeholder="Name"
                />
              </div>

              <div>
                <label className="text-[15px] font-semibold block text-gray-800">
                  E-Mail <span className="text-red-600">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue={user.email}
                  className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none focus:border-[#062962]"
                  placeholder="E-Mail"
                />
              </div>

              <div>
                <label className="text-[15px] font-semibold block text-gray-800">
                  Telephone
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={user.phone || ''}
                  className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none focus:border-[#062962]"
                  placeholder="Telephone"
                />
              </div>

              <div>
                <label className="text-[15px] font-semibold block text-gray-800">
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  defaultValue={user.address || ''}
                  className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none focus:border-[#062962]"
                  placeholder="Address"
                />
              </div>

              {/* Nhóm nút Quay lại và Lưu thay đổi */}
              <div className="mt-10 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/account')}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 bg-[#1e2227] px-7 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#161b22] rounded-xs"
                >
                  &larr; Back
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer bg-[#062962] px-8 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#083884] disabled:cursor-not-allowed disabled:opacity-60 rounded-xs"
                >
                  {submitting ? 'Saving...' : 'Change'}
                </button>
              </div>
            </form>
          </div>

          {/* Menu bên phải */}
          <AccountSideMenu active="Edit Account" />
        </div>

      </div>
    </div>
  );
}

export { EditProfilePage };
