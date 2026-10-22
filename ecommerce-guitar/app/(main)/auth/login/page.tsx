import { Suspense } from "react";
import LoginForm from "./LoginForm";
import SiteBreadcrumb from "@/components/ui/site-breadcrumb";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-5">
        <SiteBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Login" },
          ]}
          className="mb-5"
        />
        <div className="mb-6">
          <Suspense fallback={<p className="text-[15px] text-black">Loading...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
