import AccountSideMenu from "@/app/(main)/auth/_components/AccountSideMenu";
import SiteBreadcrumb from "@/components/ui/site-breadcrumb";
import { requireAuthSession } from "@/utils/require-auth";
import OrderDetailContent from "../_components/OrderDetailContent";

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  await requireAuthSession();
  const { orderId } = await params;

  return (
    <div className="min-h-dvh bg-white text-black">
      <div className="mx-auto max-w-[1180px] px-4 py-4 md:py-5">
        <SiteBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Order History", href: "/account/order-history" },
            { label: "Order Detail" },
          ]}
          className="mb-5"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_200px]">
          <OrderDetailContent orderId={orderId} />
          <AccountSideMenu active="Order History" />
        </div>
      </div>
    </div>
  );
}
