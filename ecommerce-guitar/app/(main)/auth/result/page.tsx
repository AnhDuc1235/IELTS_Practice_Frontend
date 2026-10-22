"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { clampString, safeRedirectPathOrFallback } from "@/utils/security";

const RESULT_MESSAGE_MAX_LENGTH = 200;

function AuthResultContent() {
  const params = useSearchParams();
  const type = params.get("type") || "info";
  const message = clampString(params.get("message") || "Action completed", RESULT_MESSAGE_MAX_LENGTH);
  const next = safeRedirectPathOrFallback(params.get("next"), "/");

  const title =
    type === "login"
      ? "Account Login"
      : type === "register"
        ? "Account Register"
        : type === "logout"
          ? "Account Logout"
          : type === "profile"
            ? "Account Information"
            : type === "password"
              ? "Change Password"
              : "Account Notice";

  return (
    <div className="bg-[#f5f5f5] min-h-[65vh]">
      <div className="max-w-[1260px] mx-auto px-4 py-8">
        <div className="text-[13px] text-[#777] mb-5">Home / Account / {title}</div>
        <section className="border border-[#d8d8d8] bg-white p-6">
          <h1 className="text-[42px] font-semibold">{title}</h1>
          <p className="text-[16px] text-[#444] mt-4">{message}</p>
          <div className="mt-6">
            <Link
              href={next}
              className="inline-block bg-[rgb(187,155,105)] text-black px-7 py-2 text-[14px] font-semibold"
            >
              Continue
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AuthResultPage() {
  return (
    <Suspense fallback={null}>
      <AuthResultContent />
    </Suspense>
  );
}
