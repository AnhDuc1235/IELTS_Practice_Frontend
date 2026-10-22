import AccountSideMenu from "@/app/(main)/auth/_components/AccountSideMenu";
import SiteBreadcrumb from "@/components/ui/site-breadcrumb";

export default function AccountPlaceholderPage({
  title,
  active,
}: {
  title: string;
  active: string;
}) {
  return (
    <div className="min-h-dvh bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-5">
        <SiteBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: title },
          ]}
          className="mb-5"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
          <section className="border border-[#d8d8d8] bg-white p-6">
            <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">{title}</h1>
            <p className="mt-3 text-[15px] text-black">
              This section is ready for API integration.
            </p>
          </section>
          <AccountSideMenu active={active} />
        </div>
      </div>
    </div>
  );
}

