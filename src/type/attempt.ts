export type TAttemptSummary = {
  attemptId: number;
  status: 'in_progress' | 'submitted' | 'graded';
  durationMinutes?: number;
};

export type AttemptSummary = TAttemptSummary;
