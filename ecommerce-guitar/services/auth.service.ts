import { SERVER_API } from "@/utils/env";

export const requestLogin = async (loginData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${SERVER_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      throw new Error("Email or password failed");
    }
    return response.json();
  } catch {
    return false;
  }
};

export const requestGoogleLogin = async (code: string) => {
  try {
    const response = await fetch(`${SERVER_API}/auth/google/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) {
      throw new Error("Google login failed");
    }
    return response.json();
  } catch {
    return false;
  }
};

export const getUser = async (accessToken: string) => {
  try {
    const response = await fetch(`${SERVER_API}/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Unathorize");
    }
    return response.json();
  } catch {
    return false;
  }
};

export const requestRefreshToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${SERVER_API}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Refresh token failed");
    }
    return response.json();
  } catch {
    return false;
  }
};
