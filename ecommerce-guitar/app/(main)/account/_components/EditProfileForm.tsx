"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountSideMenu from "@/app/(main)/auth/_components/AccountSideMenu";
import SiteBreadcrumb from "@/components/ui/site-breadcrumb";
import { updateProfileAction } from "../_actions/account-settings.action";

type Profile = { name: string; email: string; phone?: string; address?: string };

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateProfileAction, null);

  useEffect(() => {
    if (!state?.ok) return;
    const msg = encodeURIComponent(state.message ?? "Success");
    window.location.href = `/auth/result?type=profile&next=/account&message=${msg}`;
  }, [state]);

  return (
    <div className="min-h-dvh bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-5">
        <SiteBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Edit Information" },
          ]}
          className="mb-5"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
          <div className="border border-[#d8d8d8] bg-white p-6">
            <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">My Account Information</h1>
            <p className="mt-2 text-[15px] text-black">Your Personal Details</p>

            {state && !state.ok ? (
              <div className="mt-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                {state.message}
              </div>
            ) : null}

            <form className="mt-8 space-y-5" action={action}>
              <div>
                <label className="text-[15px] font-semibold">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={profile.name}
                  className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="text-[15px] font-semibold">
                  E-Mail <span className="text-red-600">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue={profile.email}
                  className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
                  placeholder="E-Mail"
                />
              </div>
              <div>
                <label className="text-[15px] font-semibold">
                  Telephone
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={profile.phone ?? ""}
                  className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
                  placeholder="Telephone"
                />
              </div>
              <div>
                <label className="text-[15px] font-semibold">Address</label>
                <input
                  name="address"
                  type="text"
                  defaultValue={profile.address ?? ""}
                  className="mt-2 w-full border border-[#cfcfcf] px-3 py-2 text-[14px] outline-none"
                  placeholder="Address"
                />
              </div>

              <div className="mt-10 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => router.push("/account")}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 bg-[#1e2227] px-7 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#161b22]"
                >
                  <span aria-hidden>←</span> Back
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="cursor-pointer bg-[rgb(187,155,105)] px-8 py-2.5 text-[15px] font-semibold text-black transition-colors hover:bg-[#a68a5a] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[rgb(187,155,105)]"
                >
                  {pending ? "Loading..." : "Change"}
                </button>
              </div>
            </form>
          </div>

          <AccountSideMenu active="Edit Account" />
        </div>
      </div>
    </div>
  );
}
