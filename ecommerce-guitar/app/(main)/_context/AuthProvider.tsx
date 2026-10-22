"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { createContext, useEffect } from "react";
import { getToken } from "../_actions/auth.action";
import { decodeJwt } from "jose";
import {
  refreshHttpClientSession,
  setHttpClientBearerToken,
} from "@/services/http-client";

const TOKEN_REFRESH_THRESHOLD_SECONDS = 5 * 60;

type AuthContextType = {
  user: {
    id: number;
    name: string;
    email: string;
  };
  accessToken?: string;
  isLoading: boolean;
  isAuthenticated: boolean;
};

function getRefreshDelayMs(accessToken?: string) {
  if (!accessToken) {
    return null;
  }

  try {
    const { exp } = decodeJwt(accessToken);
    if (!exp) {
      return null;
    }

    const secondsUntilRefresh =
      exp - Date.now() / 1000 - TOKEN_REFRESH_THRESHOLD_SECONDS;

    return Math.max(secondsUntilRefresh * 1000, 0);
  } catch {
    return null;
  }
}

export const AuthProvider = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  const { isLoading, isAuthenticated, user, accessToken } = useAuth();

  useEffect(() => {
    setHttpClientBearerToken(accessToken || undefined);
  }, [accessToken]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let isCancelled = false;

    const scheduleRefresh = async (token?: string) => {
      const tokenToSchedule = token || (await getToken()).accessToken;
      const delayMs = getRefreshDelayMs(tokenToSchedule);

      if (isCancelled || delayMs === null) {
        return;
      }

      timeoutId = setTimeout(async () => {
        const tokenData = await refreshHttpClientSession();

        if (!tokenData) {
          setHttpClientBearerToken(undefined);
          window.location.href = "/auth/login";
          return;
        }

        if (!isCancelled) {
          scheduleRefresh(tokenData.accessToken);
        }
      }, delayMs);
    };

    scheduleRefresh(accessToken || undefined);

    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);
