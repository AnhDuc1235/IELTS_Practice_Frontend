"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "../../_actions/auth.action";
import AccountSideMenu from "../_components/AccountSideMenu";
import { SERVER_API } from "@/utils/env";

export default function LoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    loginAction,
    {} as { success?: boolean; message?: string },
  );

  useEffect(() => {
    if (state.success) {
      window.location.href = `/auth/result?type=login&next=/account&message=${encodeURIComponent("Login success")}`;
    }
  }, [state]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_200px]">
        <section className="border border-[#d8d8d8] bg-white p-4 md:p-5">
          <div className="text-[17px] font-semibold">New Customer</div>
          <div className="mt-1 text-[15px] font-semibold text-black">
            Register Account
          </div>
          <p className="mt-4 text-[14px] text-[#444] leading-6">
            By creating an account you will be able to shop faster, be up to date
            on an order&apos;s status, and keep track of the orders you have
            previously made.
          </p>
          <div className="mt-5">
            <button
              type="button"
              className="w-full cursor-pointer bg-[rgb(187,155,105)] text-black font-semibold py-2.5 text-[15px] hover:brightness-95 transition-all"
              onClick={() => router.push("/auth/register")}
            >
              Continue
            </button>
          </div>
        </section>

        <section className="border border-[#d8d8d8] bg-white p-4 md:p-5">
          <div className="text-[28px] font-semibold text-black">
            Login to your account
          </div>

          <form className="mt-5 space-y-4" action={action}>
            {state.message ? (
              <div className="mx-3 bg-amber-300 px-3 py-2 text-center">
                {state.message}
              </div>
            ) : null}
            <div>
              <label className="text-[16px] font-semibold">E-Mail Address</label>
              <input
                type="email"
                name="email"
                maxLength={254}
                autoComplete="email"
                className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
                placeholder="E-Mail Address"
                required
              />
            </div>
            <div>
              <label className="text-[16px] font-semibold">Password</label>
              <input
                type="password"
                name="password"
                minLength={6}
                maxLength={100}
                autoComplete="current-password"
                className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
                placeholder="Password"
                required
              />
              <div className="mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-[14px] text-[rgb(187,155,105)] hover:underline"
                >
                  Forgotten Password
                </Link>
              </div>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full cursor-pointer bg-[rgb(187,155,105)] text-black font-semibold py-2.5 text-[15px] hover:brightness-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? "Loading..." : "Login"}
            </button>
            <div className="pt-1 space-y-2">
              <button
                type="button"
                className="w-full cursor-pointer bg-[#4285f4] text-white py-2 text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-[#2f6fd6] disabled:cursor-not-allowed"
                onClick={() => {
                  const redirectTo = encodeURIComponent(window.location.origin);
                  window.location.href = `${SERVER_API}/auth/google?redirectTo=${redirectTo}`;
                }}
              >
                <span className="bg-white rounded-full p-1 flex items-center justify-center">
                  <img
                    src="/google-icon-logo-svgrepo-com.svg"
                    alt="Google"
                    className="w-4 h-4"
                  />
                </span>
                Continue with Google
              </button>
            </div>
          </form>
        </section>

        <AccountSideMenu active="Login" />
      </div>
    </div>
  );
}
