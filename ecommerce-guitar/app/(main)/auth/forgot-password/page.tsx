import ForgotForm from "./_components/ForgotForm";
import SiteBreadcrumb from "@/components/ui/site-breadcrumb";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-dvh bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-5">
        <SiteBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Forgotten Password" },
          ]}
          className="mb-5"
        />
        <ForgotForm />
      </div>
    </div>
  );
}

