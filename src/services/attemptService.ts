import httpRequest from '@/utils/httpRequest';

const attemptService = {
  startAttempt: (data: any) => httpRequest.post('/api/attempts', data),
  getExamContent: (id: string | number) => httpRequest.get(`/api/attempts/${id}/take`),
  submitAttempt: (id: string | number, data: any) => httpRequest.post(`/api/attempts/${id}/submit`, data),
  getResult: (id: string | number) => httpRequest.get(`/api/attempts/${id}/result`),
  getReview: (id: string | number) => httpRequest.get(`/api/attempts/${id}/review`),
  getHistory: () => httpRequest.get('/api/attempts/history'),
};

export { attemptService };
export default attemptService;
