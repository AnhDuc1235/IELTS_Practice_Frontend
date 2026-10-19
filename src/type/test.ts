export type TTestSummary = {
  id: number;
  title: string;
  skill: 'listening' | 'reading' | 'writing' | 'speaking';
  category: 'academic' | 'general_training';
  durationMinutes: number;
  partsCount: number;
  totalQuestions: number;
  attemptsCount: number;
};

export type TestSummary = TTestSummary;
