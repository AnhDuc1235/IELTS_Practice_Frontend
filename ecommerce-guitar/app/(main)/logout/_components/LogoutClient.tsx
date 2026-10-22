"use client";

import { useEffect } from "react";
import { logoutAction } from "@/app/(main)/_actions/auth.action";

export default function LogoutClient() {
  useEffect(() => {
    const run = async () => {
      let message = "You have been logged off your account.";
      try {
        const result = await logoutAction();
        if (result?.message) {
          message = result.message;
        }
      } catch {
      }
      window.location.href = `/auth/result?type=logout&next=/account&message=${encodeURIComponent(message)}`;
    };
    void run();
  }, []);

  return (
    <div className="bg-[#f5f5f5] text-black min-h-[50vh] flex items-center justify-center px-4">
      <p className="text-[15px] text-[#555]">Signing you out…</p>
    </div>
  );
}
