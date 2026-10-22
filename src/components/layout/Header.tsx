import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User as UserIcon } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const links = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Thư viện đề thi', path: '/tests' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/learnly-logo.svg" alt="Learnly" className="h-9 w-auto" />
        </Link>

        {/* Menu điều hướng */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            {links.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`text-[rgba(6,41,98,1)] hover:opacity-80 transition-opacity ${location.pathname === item.path ? 'font-bold underline' : ''
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Khu vực Tài khoản / Đăng ký / Đăng nhập */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[rgba(6,41,98,1)] hover:opacity-80 transition-opacity"
                >
                  <UserIcon size={16} className="shrink-0" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </Link>
                <Link
                  to="/logout"
                  className="text-sm font-medium text-[rgba(6,41,98,1)] hover:underline"
                >
                  Đăng xuất
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="text-sm font-medium text-[rgba(6,41,98,1)] hover:underline"
                >
                  Đăng ký
                </Link>
                <Link
                  to="/login"
                  className="bg-[rgba(6,41,98,1)] text-white font-semibold px-4 py-1.5 rounded text-sm hover:opacity-90 transition-opacity"
                >
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>


      </div>
    </header>
  );
}

export { Header };
