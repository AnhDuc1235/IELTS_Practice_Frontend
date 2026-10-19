import httpRequest from '@/utils/httpRequest';
import { TTestSummary } from '@/type/test';

const testService = {
  getTests: () => httpRequest.get<any, TTestSummary[]>('/api/tests'),
  getTestById: (id: string | number) => httpRequest.get(`/api/tests/${id}`),
};

export { testService };
export default testService;
