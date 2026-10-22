import {
  getAccessTokenOrRefresh,
  refreshTokenAction,
} from "@/app/(main)/_actions/auth.action";
import "server-only";

function withAuthHeader(requestInit: RequestInit, accessToken: string | null) {
  const headers = new Headers(requestInit.headers || {});

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return {
    ...requestInit,
    headers,
  };
}

export const fetchWrapper = async (
  url: string,
  requestInit: RequestInit = {},
) => {
  const accessToken = await getAccessTokenOrRefresh();
  const response = await fetch(url, withAuthHeader(requestInit, accessToken));

  if (response.status !== 401) {
    return response;
  }

  const tokenData = await refreshTokenAction();
  if (!tokenData) {
    return response;
  }

  return fetch(url, withAuthHeader(requestInit, tokenData.accessToken));
};
