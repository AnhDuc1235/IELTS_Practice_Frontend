import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AccountSideMenuProps {
  active: string;
}

const menuItems = [
  { label: 'Login', href: '/login', secure: false },
  { label: 'Register', href: '/register', secure: false },
  { label: 'Forgotten Password', href: '/forgot-password', secure: false },
  { label: 'Account', href: '/account', secure: true },
  { label: 'Edit Account', href: '/account/edit', secure: true },
  { label: 'Password', href: '/account/change-password', secure: true },
  { label: 'Order History', href: '/history', secure: true },
  { label: 'Logout', href: '/logout', secure: true },
];

export default function AccountSideMenu({ active }: AccountSideMenuProps) {
  const { isAuthenticated } = useAuth();

  // Khi chưa đăng nhập: CHỈ hiển thị Login, Register, Forgotten Password
  // Khi đã đăng nhập: CHỈ hiển thị các mục tài khoản (Account, Edit Account, Password, Order History, Logout)
  const displayedItems = isAuthenticated
    ? menuItems.filter((item) => item.secure)
    : menuItems.filter((item) => !item.secure);

  return (
    <aside className="border border-[#d6d6d6] bg-white lg:sticky lg:top-20 self-start">
      {displayedItems.map((item, idx) => {
        const isActive = active === item.label;

        return (
          <Link
            key={item.label}
            to={item.href}
            className={[
              'block cursor-pointer border-b border-[#dcdcdc] px-4 py-3 text-[14px] transition-colors',
              idx === displayedItems.length - 1 ? 'border-b-0' : '',
              isActive
                ? 'bg-[#062962] text-white font-semibold'
                : 'text-black hover:bg-[#f5f5f5]',
            ].join(' ')}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}

export { AccountSideMenu };
