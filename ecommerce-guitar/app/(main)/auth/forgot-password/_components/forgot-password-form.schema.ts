import { z } from "zod";

export const forgotPasswordFormSchema = z
  .object({
    email: z.string().trim().email("Please enter a valid e-mail address."),
    otp: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit verification code."),
    password: z.string().min(1, "Password is required."),
    password_confirm: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords do not match.",
    path: ["password_confirm"],
  });
