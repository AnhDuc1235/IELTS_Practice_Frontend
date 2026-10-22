"use client";

import axios from "axios";
import { SERVER_API } from "@/utils/env";
import {
  getToken,
  refreshTokenAction,
  removeToken,
} from "@/app/(main)/_actions/auth.action";

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

let bearerToken: string | undefined;
let refreshPromise: Promise<AuthTokens | null> | null = null;

export function setHttpClientBearerToken(token: string | undefined) {
  bearerToken = token;
}

export async function refreshHttpClientSession() {
  if (!refreshPromise) {
    refreshPromise = refreshTokenAction()
      .then((tokenData) => {
        bearerToken = tokenData?.accessToken;
        return tokenData;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export const httpClient = axios.create({
  baseURL: SERVER_API,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(async (config) => {
  const nextHeaders = config.headers ?? {};
  const { accessToken } = await getToken();
  const activeToken = accessToken || bearerToken;

  if (activeToken) {
    bearerToken = activeToken;
    nextHeaders.Authorization = `Bearer ${activeToken}`;
  }

  config.headers = nextHeaders;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokenData = await refreshHttpClientSession();
        if (!tokenData) {
          throw new Error("Refresh token failed");
        }

        const newToken = tokenData.accessToken;
        originalRequest.headers = originalRequest.headers ?? {};

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      } catch (err) {
        await removeToken();
        setHttpClientBearerToken(undefined);
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
