"use client";

import { AuthContext } from "@/app/(main)/_context/AuthProvider";
import { orderService } from "@/services/order.service";
import {
  readLatestCheckoutOrder,
  type LatestCheckoutOrderSnapshot,
} from "@/utils/order-checkout-storage";
import { formatProductPrice } from "@/utils/product-display";
import { AlertCircle, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SafeImage from "@/components/ui/safe-image";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";

const BANK_NAME = "VP BANK";
const ACCOUNT_NAME = "DANG HOANG ANH DUC";
const ACCOUNT_NUMBER = "AGBSP205840394";
const BANK_TRANSFER_METHOD = "Bank transfer";
const COD_METHOD = "COD";
const CASH_ON_DELIVERY_METHOD = "CASH_ON_DELIVERY";

function resolvePaymentInput(
  latestSnapshot: LatestCheckoutOrderSnapshot | null,
) {
  if (latestSnapshot) {
    return {
      orderId: latestSnapshot.orderId,
      paymentMethod: latestSnapshot.paymentMethod,
      snapshot: latestSnapshot,
    };
  }

  return {
    orderId: null,
    paymentMethod: null,
    snapshot: null,
  };
}

function isBankTransferMethod(paymentMethod: string | null): boolean {
  if (!paymentMethod) {
    return false;
  }
  return paymentMethod.toLowerCase() === BANK_TRANSFER_METHOD.toLowerCase();
}

export default function PaymentPageContent() {
  const { isLoading: isAuthLoading, isAuthenticated } = useContext(AuthContext);
  const [latestSnapshot, setLatestSnapshot] = useState<LatestCheckoutOrderSnapshot | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    const latestOrderSnapshot = readLatestCheckoutOrder();
    setLatestSnapshot(latestOrderSnapshot);
    setIsClientReady(true);
  }, []);

  const paymentInput = resolvePaymentInput(latestSnapshot);
  const hasOrderId = Boolean(paymentInput.orderId);
  const isCashOnDelivery =
    paymentInput.paymentMethod === CASH_ON_DELIVERY_METHOD ||
    paymentInput.paymentMethod === COD_METHOD;
  const isBankTransfer = isBankTransferMethod(paymentInput.paymentMethod);
  const canFetchOrder =
    hasOrderId && isBankTransfer && !isAuthLoading && isClientReady && isAuthenticated;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", paymentInput.orderId],
    queryFn: () => orderService.getOrderById(paymentInput.orderId as string),
    enabled: canFetchOrder,
    refetchInterval: (query) => {
      if (!isBankTransfer) {
        return false;
      }
      const nextOrder = query.state.data?.data;
      if (nextOrder?.isPaid || nextOrder?.status === "CANCELLED") {
        return false;
      }
      return 5000;
    },
  });

  const order = data?.data;
  const isPaid = Boolean(order?.isPaid);
  const isCancelled = order?.status === "CANCELLED";

  if (!isClientReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[14px] text-[#666]">
        Loading payment details...
      </div>
    );
  }

  if (!isCashOnDelivery && isAuthLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[14px] text-[#666]">
        Preparing account session...
      </div>
    );
  }

  if (!paymentInput.orderId || !paymentInput.paymentMethod || !hasOrderId) {
    return (
      <PaymentStatusPanel
        tone="error"
        message="Transaction failed. You can only access this page after continuing from checkout."
      />
    );
  }

  if (isCashOnDelivery) {
    return (
      <PaymentStatusPanel
        tone="success"
        message="Your order has been placed successfully. We will contact you via email and phone."
      />
    );
  }

  if (isPaid) {
    return (
      <PaymentStatusPanel
        tone="success"
        message="Payment succeeded. Thank you for purchasing our product."
      />
    );
  }

  if (isCancelled) {
    return (
      <PaymentStatusPanel
        tone="error"
        message="Payment failed. Your order has expired!"
        linkHref="/cart"
        linkLabel="Back to cart"
        linkClassName="mt-6 inline-flex bg-[#bb9b69] px-6 py-2 text-[14px] font-semibold text-black transition-colors hover:bg-[#a68452]"
      />
    );
  }

  const amount = order?.totalAmount || paymentInput.snapshot?.totalAmount || "0";
  const amountText = formatProductPrice(amount);
  const qrUrl = paymentInput.snapshot?.qrUrl;

  return (
    <div className="grid min-h-[60vh] grid-cols-1 lg:grid-cols-2">
      <section className="flex items-center justify-center px-6 py-10 lg:px-14">
        {isLoading ? (
          <div className="text-[14px] text-[#666]">Loading payment QR...</div>
        ) : qrUrl ? (
          <div className="text-center">
            <div className="relative h-[320px] w-[320px] overflow-hidden">
              <SafeImage
                src={qrUrl}
                alt="QR payment code"
                fill
                sizes="320px"
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="mt-3 text-[13px] text-[#666]">QR expired after 5 minutes</p>
          </div>
        ) : (
          <div className="text-center text-[14px] text-[#666]">
            QR code is unavailable. Please check your order details in account history.
          </div>
        )}
      </section>

      <section className="bg-[#f2f2f5] px-6 py-10 lg:border-l-[2px] lg:border-l-[#ddd] lg:px-10">
        <div className="mx-auto w-full max-w-[500px] p-5">
          <div className="flex items-center gap-3 border-b border-[#ddd] pb-4">
            <div className="rounded bg-white p-1">
              <Image
                src="/VPBank_idvt06J5ke_0.png"
                alt="VP Bank logo"
                width={74}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="text-[18px] font-semibold text-[#222]">{BANK_NAME}</div>
          </div>

          <div className="space-y-4 py-5 text-[14px] text-[#333]">
            <PaymentDetailRow label="Account Holder" value={ACCOUNT_NAME} />
            <PaymentDetailRow label="Account Number" value={ACCOUNT_NUMBER} />
            <PaymentDetailRow label="Amount" value={amountText} />
            <PaymentDetailRow label="Transfer Description" value={paymentInput.orderId} />
          </div>

          <div className="flex items-center justify-between border-t border-[#ddd] pt-4">
            <span className="text-[28px] font-semibold text-[#222]">TOTAL</span>
            <span className="text-[28px] font-semibold text-[#222]">{amountText}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function PaymentDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#ececec] pb-3 last:border-b-0">
      <span className="font-medium text-[#555]">{label}:</span>
      <span className="text-right font-semibold text-[#222]">{value}</span>
    </div>
  );
}

function PaymentStatusPanel({
  tone,
  message,
  linkHref = "/account/order-history",
  linkLabel = "Go to Order History",
  linkClassName = "mt-6 inline-flex bg-[rgb(187,155,105)] px-6 py-2 text-[14px] font-semibold text-black transition-colors hover:bg-[#a68a5a]",
}: {
  tone: "success" | "error";
  message: string;
  linkHref?: string;
  linkLabel?: string;
  linkClassName?: string;
}) {
  const isSuccess = tone === "success";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full text-white ${
          isSuccess ? "bg-[#16a34a]" : "bg-[#d64545]"
        }`}
      >
        {isSuccess ? <Check size={42} strokeWidth={3} /> : <AlertCircle size={40} strokeWidth={2.5} />}
      </div>
      <p className="mt-5 max-w-[620px] text-[22px] font-medium leading-tight text-[#222]">{message}</p>
      <Link href={linkHref} className={linkClassName}>
        {linkLabel}
      </Link>
    </div>
  );
}
