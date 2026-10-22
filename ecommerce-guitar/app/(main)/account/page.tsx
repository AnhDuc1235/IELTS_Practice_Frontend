import Link from "next/link";
import { SERVER_API } from "@/utils/env";
import { requireAccessToken } from "@/utils/require-auth";
import AccountSideMenu from "@/app/(main)/auth/_components/AccountSideMenu";
import SiteBreadcrumb from "@/components/ui/site-breadcrumb";
import { redirect } from "next/navigation";

type Profile = { name: string; email: string };

const topItems: { label: string; href?: string }[] = [
  { label: "Edit your account information", href: "/account/edit" },
  { label: "Change your password", href: "/account/change-password" },
  { label: "Order history", href: "/account/order-history" },
];
export default async function AccountPage() {
  const accessToken = await requireAccessToken();

  const res = await fetch(`${SERVER_API}/profile`, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    redirect("/auth/login");
  }

  const data = (await res.json()) as { data: Profile };
  const user = data.data;

  return (
    <div className="min-h-dvh bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-5">
        <SiteBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account" },
          ]}
          className="mb-5"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
          <div className="space-y-5">
            <section className="border border-[#d8d8d8] bg-white">
              <div className="px-5 py-4 border-b border-[#d8d8d8]">
                <h2 className="text-[24px] font-semibold md:text-[28px]">My Account</h2>
                <div className="mt-1 break-words text-[14px] text-black">{user.name} - {user.email}</div>
              </div>
              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 md:grid-cols-3">
                {topItems.map((item) =>
                  item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block cursor-pointer border border-[#dedede] px-3 py-2 text-center text-[14px] text-black hover:text-[rgb(187,155,105)]"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div key={item.label} className="border border-[#dedede] px-3 py-2 text-center text-[14px] text-black">
                      {item.label}
                    </div>
                  ),
                )}
              </div>
            </section>

          </div>

          <AccountSideMenu active="Account" />
        </div>
      </div>
    </div>
  );
}

