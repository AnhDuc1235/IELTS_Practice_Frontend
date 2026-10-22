"use client";

import { useActionState, useEffect } from "react";
import { registerAction } from "./action";
import AccountSideMenu from "../_components/AccountSideMenu";

type RegState =
  | { ok: true; message: string }
  | { ok: false; message: string; errors?: Record<string, string> }
  | null;

const initialState: RegState = null;

export default function RegisterForm() {
  const [state, action] = useActionState(registerAction, initialState);

  useEffect(() => {
    if (!state || !state.ok) return;
    const t = window.setTimeout(
      () =>
        (window.location.href = `/auth/result?type=register&next=/auth/login?registered=1&message=${encodeURIComponent(state.message)}`),
      700,
    );
    return () => window.clearTimeout(t);
  }, [state]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
      <div>
        {state ? (
          <div
            className={[
              "border px-4 py-3 text-sm font-semibold mb-4",
              state.ok
                ? "bg-green-100 border-green-300 text-green-800"
                : "bg-red-100 border-red-300 text-red-800",
            ].join(" ")}
          >
            {state.message}
          </div>
        ) : null}

        <form action={action} className="space-y-4 border border-[#d8d8d8] bg-white p-6">
          <div className="text-[28px] font-semibold">Register Account</div>
          <div className="text-[14px] text-[#555]">
            If you already have an account with us, please login at the login page.
          </div>

          <div className="pt-2 grid grid-cols-1 gap-4">
            <div>
              <label className="text-[15px] font-semibold">Your Name *</label>
              <input
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="text-[15px] font-semibold">E-Mail *</label>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="text-[15px] font-semibold">Password *</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                maxLength={100}
                autoComplete="new-password"
                className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer bg-[rgb(187,155,105)] px-8 py-2.5 text-[15px] font-semibold text-black transition-colors hover:bg-[#a68a5a]"
          >
            Continue
          </button>
        </form>
      </div>

      <AccountSideMenu active="Register" />
    </div>
  );
}
