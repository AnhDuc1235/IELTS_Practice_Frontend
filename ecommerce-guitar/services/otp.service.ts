import { httpClient } from "@/services/http-client";

export const otpService = {
  async sendOtp(): Promise<{ message?: string }> {
    const response = await httpClient.post("/otp/send");
    return response.data;
  },

  async sendForgotEmailOtp(email: string): Promise<{ message?: string }> {
    const response = await httpClient.post("/otp/forgot-email", { email });
    return response.data;
  },
};
