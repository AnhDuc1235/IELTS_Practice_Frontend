"use client";

import Link from "next/link";
import { use } from "react";
import { AuthContext } from "@/app/(main)/_context/AuthProvider";

const items = [
  { label: "Login", href: "/auth/login", secure: false },
  { label: "Register", href: "/auth/register", secure: false },
  { label: "Forgotten Password", href: "/auth/forgot-password", secure: false },
  { label: "Account", href: "/account", secure: true },
  { label: "Edit Account", href: "/account/edit", secure: true },
  { label: "Password", href: "/account/change-password", secure: true },
  { label: "Order History", href: "/account/order-history", secure: true },
  { label: "Logout", href: "/logout", secure: true },
];

export default function AccountSideMenu({ active }: { active: string }) {
  const { isAuthenticated } = use(AuthContext);
  const filtered = isAuthenticated
    ? items.filter(
        (item) =>
          item.label !== "Login" &&
          item.label !== "Register" &&
          item.label !== "Forgotten Password",
      )
    : items;

  return (
    <aside className="border border-[#d6d6d6] bg-white lg:sticky lg:top-4">
      {filtered.map((item, idx) => {
        const href = item.secure && !isAuthenticated ? "/auth/login" : item.href;
        const isActive = active === item.label;
        return (
          <Link
            key={item.label}
            href={href}
            className={[
              "block cursor-pointer border-b border-[#dcdcdc] px-4 py-3 text-[14px]",
              idx === filtered.length - 1 ? "border-b-0" : "",
              isActive ? "bg-black text-white font-semibold" : "text-black hover:bg-[#f5f5f5]",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
