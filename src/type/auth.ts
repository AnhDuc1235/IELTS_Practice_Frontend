export type TUser = {
  id?: number | string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: string;
};

export type TAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

// Khung phản hồi chung của backend: { success, message, data }
export type TApiResponse<T = unknown> = {
  success?: boolean;
  message: string;
  data: T;
};
