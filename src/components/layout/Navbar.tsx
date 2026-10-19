import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">IELTS Practice</Link>
      <nav className="flex gap-4">
        <Link to="/tests" className="text-slate-600 hover:text-blue-600 font-medium">Đề thi</Link>
        <Link to="/history" className="text-slate-600 hover:text-blue-600 font-medium">Lịch sử</Link>
      </nav>
    </header>
  );
};
