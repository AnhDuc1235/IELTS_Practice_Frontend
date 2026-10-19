import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import HomePage from '@/pages/HomePage';
import TestListPage from '@/pages/TestListPage';
import TestDetailPage from '@/pages/TestDetailPage';
import ExamPage from '@/pages/ExamPage';
import ResultPage from '@/pages/ResultPage';
import ReviewPage from '@/pages/ReviewPage';
import HistoryPage from '@/pages/HistoryPage';

export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tests" element={<TestListPage />} />
          <Route path="/tests/:id" element={<TestDetailPage />} />
          <Route path="/exam/:attemptId" element={<ExamPage />} />
          <Route path="/result/:attemptId" element={<ResultPage />} />
          <Route path="/review/:attemptId" element={<ReviewPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </div>
  );
}
