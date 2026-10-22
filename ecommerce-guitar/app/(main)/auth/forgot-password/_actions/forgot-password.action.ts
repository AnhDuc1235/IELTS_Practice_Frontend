"use server";

import { SERVER_API } from "@/utils/env";
import { forgotPasswordFormSchema } from "../_components/forgot-password-form.schema";

export async function forgotPasswordAction(
  _prev: { ok?: boolean; message?: string } | null,
  formData: FormData,
) {
  const payload = {
    email: (formData.get("email") ?? "").toString().trim(),
    otp: (formData.get("otp") ?? "").toString().trim(),
    password: (formData.get("password") ?? "").toString(),
    password_confirm: (formData.get("password_confirm") ?? "").toString(),
  };

  const parsed = forgotPasswordFormSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check your input.",
    };
  }

  const { email, otp, password } = parsed.data;

  const res = await fetch(`${SERVER_API}/auth/forgot-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      otp,
      password,
    }),
    cache: "no-store",
  });

  const rawText = await res.text();
  let backendMessage: string | undefined;
  if (rawText) {
    try {
      const parsedJson = JSON.parse(rawText) as { message?: string };
      backendMessage = parsedJson?.message;
    } catch {
      backendMessage = rawText;
    }
  }

  if (!res.ok) {
    return {
      ok: false,
      message: backendMessage ?? "Could not reset password.",
    };
  }

  return {
    ok: true,
    message: backendMessage ?? "Your password has been reset.",
  };
}
