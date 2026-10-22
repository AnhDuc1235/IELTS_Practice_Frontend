"use client";

import { FormNoticeAlert, type FormNoticeTone } from "@/components/form-notice-alert";
import AccountSideMenu from "@/app/(main)/auth/_components/AccountSideMenu";
import { otpService } from "@/services/otp.service";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { forgotPasswordAction } from "../_actions/forgot-password.action";
import { forgotPasswordFormSchema } from "./forgot-password-form.schema";

const LS_COOLDOWN_UNTIL = "forgot_password_otp_cooldown_until";
const LS_OTP_SENT_ONCE = "forgot_password_otp_sent_once";
const SS_FORGOT_PASSWORD_NOTICE = "forgot_password_page_notice";
const COOLDOWN_MS = 50_000;
const NOTICE_AUTO_HIDE_MS = 8000;

function readCooldownUntil(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LS_COOLDOWN_UNTIL);
  if (!raw) return null;
  const until = Number(raw);
  if (!Number.isFinite(until) || until <= Date.now()) {
    localStorage.removeItem(LS_COOLDOWN_UNTIL);
    return null;
  }
  return until;
}

export default function ForgotForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(forgotPasswordAction, null);
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ tone: FormNoticeTone; message: string } | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [hasSentOtpBefore, setHasSentOtpBefore] = useState(false);
  const [tick, setTick] = useState(0);

  const resetOtpSendState = useCallback(() => {
    localStorage.removeItem(LS_COOLDOWN_UNTIL);
    localStorage.removeItem(LS_OTP_SENT_ONCE);
    setCooldownUntil(null);
    setHasSentOtpBefore(false);
  }, []);

  useEffect(() => {
    setCooldownUntil(readCooldownUntil());
    setHasSentOtpBefore(localStorage.getItem(LS_OTP_SENT_ONCE) === "1");

    const raw = sessionStorage.getItem(SS_FORGOT_PASSWORD_NOTICE);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { tone?: FormNoticeTone; message?: string };
      sessionStorage.removeItem(SS_FORGOT_PASSWORD_NOTICE);
      if (parsed.tone && parsed.message) {
        setNotice({ tone: parsed.tone, message: parsed.message });
      }
    } catch {
      sessionStorage.removeItem(SS_FORGOT_PASSWORD_NOTICE);
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => setNotice(null), NOTICE_AUTO_HIDE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  useEffect(() => {
    if (!cooldownUntil || cooldownUntil <= Date.now()) return;
    const id = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      sessionStorage.setItem(
        SS_FORGOT_PASSWORD_NOTICE,
        JSON.stringify({
          tone: "success",
          message: "Success: Your password has been reset.",
        }),
      );
      window.location.reload();
      return;
    }
    setNotice({ tone: "error", message: state.message ?? "Could not reset password." });
  }, [state]);

  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: (email: string) => otpService.sendForgotEmailOtp(email),
    onSuccess: () => {
      localStorage.setItem(LS_OTP_SENT_ONCE, "1");
      setHasSentOtpBefore(true);
      const until = Date.now() + COOLDOWN_MS;
      localStorage.setItem(LS_COOLDOWN_UNTIL, String(until));
      setCooldownUntil(until);
      setNotice({ tone: "success", message: "Success: Verification code sent to your email." });
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message;
      setNotice({
        tone: "error",
        message: msg ?? "Could not send verification code.",
      });
    },
  });

  const remainingSec = useMemo(() => {
    if (!cooldownUntil || cooldownUntil <= Date.now()) return 0;
    return Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
  }, [cooldownUntil, tick]);

  const isCooldown = remainingSec > 0;
  const otpButtonLabel = isCooldown ? `Resend (${remainingSec}s)` : hasSentOtpBefore ? "Resend" : "Send";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetOtpSendState();
    setNotice(null);

    const formData = new FormData(event.currentTarget);
    const parsed = forgotPasswordFormSchema.safeParse({
      email: String(formData.get("email") ?? "").trim(),
      otp: String(formData.get("otp") ?? ""),
      password: String(formData.get("password") ?? ""),
      password_confirm: String(formData.get("password_confirm") ?? ""),
    });

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid input.";
      setNotice({ tone: "error", message: msg });
      return;
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleSendOtp = (form: HTMLFormElement) => {
    if (isCooldown || isSendingOtp) return;
    const email = String(new FormData(form).get("email") ?? "").trim();
    const parsedEmail = forgotPasswordFormSchema.shape.email.safeParse(email);
    if (!parsedEmail.success) {
      const msg = parsedEmail.error.issues[0]?.message ?? "Please enter a valid e-mail address.";
      setNotice({ tone: "error", message: msg });
      return;
    }
    setNotice(null);
    sendOtp(parsedEmail.data);
  };

  const submitDisabled = pending || isPending;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
      <div className="border border-[#d8d8d8] bg-white p-6">
        <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">Reset Your Password</h1>
        <p className="mt-3 text-[15px] text-[#555]">
          Enter the e-mail address associated with your account and verify through otp code.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          {notice ? (
            <FormNoticeAlert tone={notice.tone} message={notice.message} onClose={() => setNotice(null)} />
          ) : null}

          <div>
            <label className="text-[15px] font-semibold">
              Your E-Mail Address <span className="text-red-600">*</span>
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
              placeholder="E-Mail Address"
            />
          </div>

          <div>
            <p className="text-[15px] font-semibold">Verify your account</p>
            <p className="mt-1 text-[13px] text-black">We will send a 6-digit code to your email address.</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                pattern="\d{6}"
                title="6-digit code"
                placeholder="000000"
                className="w-[7.5rem] border border-[#cfcfcf] px-2 py-2 text-center text-[15px] tracking-widest outline-none"
              />
              <button
                type="button"
                disabled={isCooldown || isSendingOtp}
                onClick={(event) => handleSendOtp(event.currentTarget.form as HTMLFormElement)}
                className="min-w-[120px] cursor-pointer border border-[#1e2227] bg-[#1e2227] px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:border-[#161b22] hover:bg-[#161b22] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#1e2227] disabled:hover:bg-[#1e2227]"
              >
                {isSendingOtp ? "Sending..." : otpButtonLabel}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[15px] font-semibold">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
              placeholder="Password"
            />
          </div>

          <div>
            <label className="text-[15px] font-semibold">
              Password Confirm <span className="text-red-600">*</span>
            </label>
            <input
              name="password_confirm"
              type="password"
              autoComplete="new-password"
              className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
              placeholder="Password Confirm"
            />
          </div>

          <div className="mt-10 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="inline-flex cursor-pointer items-center justify-center gap-2 bg-[#1e2227] px-7 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#161b22]"
            >
              <span aria-hidden>←</span> Back
            </button>
            <button
              type="submit"
              disabled={submitDisabled}
              className="cursor-pointer bg-[rgb(187,155,105)] px-8 py-2.5 text-[15px] font-semibold text-black transition-colors hover:bg-[#a68a5a] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[rgb(187,155,105)]"
            >
              {submitDisabled ? "Loading..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      <AccountSideMenu active="Forgotten Password" />
    </div>
  );
}

