import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import EditProfilePage from '@/pages/EditProfilePage';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import AuthResultPage from '@/pages/AuthResultPage';
import LogoutPage from '@/pages/LogoutPage';
import TestListPage from '@/pages/TestListPage';
import TestDetailPage from '@/pages/TestDetailPage';
import ExamPage from '@/pages/ExamPage';
import ResultPage from '@/pages/ResultPage';
import ReviewPage from '@/pages/ReviewPage';
import HistoryPage from '@/pages/HistoryPage';
import GoogleOAuthCallbackHandler from '@/components/auth/GoogleOAuthCallbackHandler';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import GuestRoute from '@/components/common/GuestRoute';

export default function App() {
  return (
    <div>
      {/* Tự động bắt callback mã OAuth từ Google (?code=...) */}
      <GoogleOAuthCallbackHandler />

      <Routes>
        <Route element={<MainLayout />}>
          {/* 1. Các trang công khai (Public) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tests" element={<TestListPage />} />
          <Route path="/tests/:id" element={<TestDetailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/result" element={<AuthResultPage />} />
          <Route path="/logout" element={<LogoutPage />} />

          {/* 2. Middleware cho khách: Nếu ĐÃ có token trong Cookie thì đá vào /account */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
          </Route>

          {/* 3. Middleware bảo vệ (ProtectedRoute): Bắt buộc phải có token trong Cookie, không có thì đá ra /login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/profile" element={<Navigate to="/account" replace />} />

            <Route path="/account/edit" element={<EditProfilePage />} />
            <Route path="/profile/edit" element={<Navigate to="/account/edit" replace />} />

            <Route path="/account/change-password" element={<ChangePasswordPage />} />

            {/* Các trang làm bài, xem điểm, lịch sử thi IELTS */}
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/exam/:attemptId" element={<ExamPage />} />
            <Route path="/result/:attemptId" element={<ResultPage />} />
            <Route path="/review/:attemptId" element={<ReviewPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
