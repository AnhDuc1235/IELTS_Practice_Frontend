"use server";

import {
  getUser,
  requestGoogleLogin,
  requestLogin,
  requestRefreshToken,
} from "@/services/auth.service";
import { cookies } from "next/headers";
import { z } from "zod";
import { SERVER_API } from "@/utils/env";
import { revalidatePath } from "next/cache";
import { sanitizeUserInput } from "@/utils/security";

const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 5 * 60 * 60;

const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 100;
const GOOGLE_CODE_MAX_LENGTH = 2048;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(EMAIL_MAX_LENGTH),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type CurrentUserResult = {
  data?: {
    id: string | number;
    name: string;
    email: string;
  };
};

function isAuthTokens(value: unknown): value is AuthTokens {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as AuthTokens).accessToken === "string" &&
    typeof (value as AuthTokens).refreshToken === "string"
  );
}

function normalizeCurrentUser(
  userResult: CurrentUserResult | false,
  accessToken: string,
) {
  if (!userResult || !userResult.data) {
    return null;
  }

  return {
    data: {
      id: Number(userResult.data.id) || 0,
      name: userResult.data.name,
      email: userResult.data.email,
    },
    accessToken,
  };
}

export const saveToken = async (tokenData: AuthTokens) => {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
    path: "/",
  };

  cookieStore.set("accessToken", tokenData.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });
  cookieStore.set("refreshToken", tokenData.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
};

export const getToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  return { accessToken, refreshToken };
};

export const removeToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};

export const refreshTokenAction = async () => {
  const { refreshToken } = await getToken();

  if (!refreshToken) {
    await removeToken();
    return null;
  }

  const refreshResult = await requestRefreshToken(refreshToken);
  const tokenData = refreshResult?.data;

  if (!isAuthTokens(tokenData)) {
    await removeToken();
    return null;
  }

  await saveToken(tokenData);
  return tokenData;
};

export const getAccessTokenOrRefresh = async () => {
  const { accessToken, refreshToken } = await getToken();

  if (accessToken) {
    return accessToken;
  }

  if (!refreshToken) {
    return null;
  }

  const tokenData = await refreshTokenAction();
  return tokenData?.accessToken ?? null;
};

export const loginAction = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const parsed = loginSchema.safeParse({
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { success: false, message: "Invalid email or password." };
  }

  try {
    const loginResult = await requestLogin(parsed.data);

    if (!loginResult?.data) {
      return {
        success: false,
        message: "Login failed. Please check your details and try again.",
      };
    }

    await saveToken(loginResult.data);
    return { success: true, message: "Login successful." };
  } catch {
    return { success: false, message: "Something went wrong. Please try again later." };
  }
};

export const googleLoginAction = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const code = sanitizeUserInput(formData.get("code")?.toString() ?? "", GOOGLE_CODE_MAX_LENGTH);

  if (!code) {
    return { success: false, message: "Invalid Google authorization code." };
  }

  try {
    const googleLoginResult = await requestGoogleLogin(code);

    if (!googleLoginResult?.data) {
      return { success: false, message: "Google sign-in failed." };
    }

    await saveToken(googleLoginResult.data);
    return { success: true, message: "Login successful." };
  } catch {
    return { success: false, message: "Connection error during Google sign-in." };
  }
};

export const getCurrentUser = async () => {
  const accessToken = await getAccessTokenOrRefresh();

  if (!accessToken) return null;

  try {
    const userResult = await getUser(accessToken);

    const currentUser = normalizeCurrentUser(userResult, accessToken);

    if (currentUser) return currentUser;

    const tokenData = await refreshTokenAction();
    if (!tokenData) return null;

    const refreshedUserResult = await getUser(tokenData.accessToken);
    return normalizeCurrentUser(refreshedUserResult, tokenData.accessToken);
  } catch {
    return null;
  }
};

export async function logoutAction() {
  const { accessToken } = await getToken();
  let message = "Đăng xuất thành công";

  try {
    if (accessToken) {
      const res = await fetch(`${SERVER_API}/auth/logout`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json().catch(() => undefined);
      if (data?.message) {
        message = data.message;
      }
    }
  } finally {
    await removeToken();
    revalidatePath("/", "layout");
  }

  return { success: true, message };
}
