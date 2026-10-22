import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuthSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? null;
  const refreshToken = cookieStore.get("refreshToken")?.value ?? null;

  if (!accessToken && !refreshToken) {
    redirect("/auth/login");
  }

  return { accessToken, refreshToken };
}

export async function requireAccessToken() {
  const { accessToken } = await requireAuthSession();

  if (!accessToken) {
    redirect("/auth/login");
  }

  return accessToken;
}
