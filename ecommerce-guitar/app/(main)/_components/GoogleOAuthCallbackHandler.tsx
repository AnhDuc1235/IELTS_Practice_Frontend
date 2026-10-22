"use client";

import { googleLoginAction } from "@/app/(main)/_actions/auth.action";
import { useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function GoogleOAuthCallbackHandler() {
  const searchParams = useSearchParams();
  const oauthFormRef = useRef<HTMLFormElement>(null);
  const hasSubmittedOauthCode = useRef(false);
  const [googleLoginState, googleLoginFormAction] = useActionState(
    googleLoginAction,
    {} as { success?: boolean },
  );

  const oauthCode = searchParams.get("code") ?? "";

  useEffect(() => {
    if (!oauthCode || hasSubmittedOauthCode.current) {
      return;
    }

    hasSubmittedOauthCode.current = true;
    oauthFormRef.current?.requestSubmit();
  }, [oauthCode]);

  useEffect(() => {
    if (googleLoginState.success) {
      window.location.href = `/auth/result?type=login&next=/account&message=${encodeURIComponent("Login success")}`;
      return;
    }

    if (Object.keys(googleLoginState).length > 0 && !googleLoginState.success) {
      window.location.href = `/auth/result?type=login&next=/auth/login&message=${encodeURIComponent("Login failed")}`;
    }
  }, [googleLoginState]);

  if (!oauthCode) {
    return null;
  }

  return (
    <form ref={oauthFormRef} action={googleLoginFormAction} className="hidden">
      <input type="hidden" name="code" value={oauthCode} />
    </form>
  );
}
