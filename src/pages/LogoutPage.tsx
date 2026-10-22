import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      navigate(
        `/auth/result?type=logout&next=/&message=${encodeURIComponent('Logout success')}`
      );
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white text-gray-700">
      <p className="text-[15px]">Logging out...</p>
    </div>
  );
}

export { LogoutPage };
