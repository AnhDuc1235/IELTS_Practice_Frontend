"use server";

import { revalidatePath } from "next/cache";
import { SERVER_API } from "@/utils/env";
import { getAccessTokenOrRefresh } from "@/app/(main)/_actions/auth.action";
import { fetchWrapper } from "@/utils/fetch";
import { editProfileFormSchema } from "../_components/edit-profile-form.schema";

export async function updateProfileAction(
  _prev: { ok?: boolean; message?: string } | null,
  formData: FormData,
) {
  const token = await getAccessTokenOrRefresh();
  if (!token) {
    return { ok: false, message: "You are not signed in." };
  }
  const payload = {
    name: (formData.get("name") ?? "").toString().trim(),
    email: (formData.get("email") ?? "").toString().trim(),
    phone: (formData.get("phone") ?? "").toString().trim(),
    address: (formData.get("address") ?? "").toString().trim(),
  };
  const parsed = editProfileFormSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check your profile information.",
    };
  }

  const body = parsed.data;
  const res = await fetchWrapper(`${SERVER_API}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) {
    return {
      ok: false,
      message: data?.message ?? "Could not update profile.",
    };
  }
  revalidatePath("/account");
  revalidatePath("/account/edit");
  return {
    ok: true,
    message: data?.message ?? "Your profile has been updated.",
  };
}

export async function changePasswordAction(
  _prev: { ok?: boolean; message?: string } | null,
  formData: FormData,
) {
  const token = await getAccessTokenOrRefresh();
  if (!token) {
    return { ok: false, message: "You are not signed in." };
  }
  const password = (formData.get("password") ?? "").toString();
  const confirm = (formData.get("password_confirm") ?? "").toString();
  const otp = (formData.get("otp") ?? "").toString().trim();
  if (!password) {
    return { ok: false, message: "Password is required." };
  }
  if (password !== confirm) {
    return { ok: false, message: "Passwords do not match." };
  }
  if (!/^\d{6}$/.test(otp)) {
    return { ok: false, message: "Enter the 6-digit verification code." };
  }
  const res = await fetchWrapper(`${SERVER_API}/auth/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, otp }),
  });
  const data = (await res.json().catch(() => ({}))) as { message?: string };
  if (!res.ok) {
    return {
      ok: false,
      message: data?.message ?? "Could not change password.",
    };
  }
  revalidatePath("/account");
  return {
    ok: true,
    message: data?.message ?? "Your password has been changed.",
  };
}
