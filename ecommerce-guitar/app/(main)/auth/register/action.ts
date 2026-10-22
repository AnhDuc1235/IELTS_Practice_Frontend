"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { SERVER_API } from "@/utils/env";
import { sanitizeUserInput } from "@/utils/security";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 100;

const registerSchema = z.object({
  name: z.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
  email: z.string().toLowerCase().email().max(EMAIL_MAX_LENGTH),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

export async function registerAction(_prevState: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: sanitizeUserInput(formData.get("name")?.toString() ?? "", NAME_MAX_LENGTH),
    email: sanitizeUserInput(formData.get("email")?.toString() ?? "", EMAIL_MAX_LENGTH),
    password: formData.get("password")?.toString() ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false as const,
      message: "Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.",
    };
  }

  try {
    const res = await fetch(`${SERVER_API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await res.json().catch(() => undefined);

    if (!res.ok) {
      return {
        ok: false as const,
        message: data?.message ?? "Đăng ký thất bại",
        errors: data?.errors ?? undefined,
      };
    }

    revalidatePath("/auth/register");
    revalidatePath("/auth/login");
    return {
      ok: true as const,
      message: data?.message ?? "Register success",
    };
  } catch {
    return { ok: false as const, message: "Không thể đăng ký ngay lúc này" };
  }
}
