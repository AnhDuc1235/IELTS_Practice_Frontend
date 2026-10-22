"use client";

import { AuthContext } from "@/app/(main)/_context/AuthProvider";
import { orderService } from "@/services/order.service";
import { formatProductPrice } from "@/utils/product-display";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

const ORDER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function OrderDetailContent({ orderId }: { orderId: string }) {
  const { isLoading: isAuthLoading, isAuthenticated } = useContext(AuthContext);
  const hasValidOrderId = Boolean(orderId && ORDER_ID_PATTERN.test(orderId));

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order-history-detail", orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: hasValidOrderId && !isAuthLoading && isAuthenticated,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  if (!hasValidOrderId) {
    return (
      <section className="border border-[#d8d8d8] bg-white p-6">
        <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">Order Details</h1>
        <p className="mt-3 text-[15px] text-black">Invalid order ID. Please return to your order history.</p>
      </section>
    );
  }

  if (isAuthLoading || isLoading) {
    return (
      <section className="border border-[#d8d8d8] bg-white p-6">
        <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">Order Details</h1>
        <p className="mt-3 text-[15px] text-black">Loading order details...</p>
      </section>
    );
  }

  if (isError || !data?.data) {
    return (
      <section className="border border-[#d8d8d8] bg-white p-6">
        <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">Order Details</h1>
        <p className="mt-3 text-[15px] text-black">
          Unable to load order details right now. Please reload the page and try again.
        </p>
      </section>
    );
  }

  const order = data.data;

  return (
    <section className="border border-[#d8d8d8] bg-white p-6">
      <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">Order Details</h1>

      <div className="mt-5 grid grid-cols-1 gap-4 text-[14px] lg:grid-cols-2">
        <InfoItem label="Order ID" value={order.id} />
        <InfoItem label="Status" value={order.status} />
        <InfoItem label="Payment Method" value={order.paymentMethod} />
        <InfoItem label="Paid" value={order.isPaid ? "Yes" : "No"} />
        <InfoItem label="Receiver Name" value={order.receiverName} />
        <InfoItem label="Phone" value={order.phone} />
      </div>

      <div className="mt-6 overflow-x-auto border border-[#ddd]">
        <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
          <thead className="bg-[#f2f2f5]">
            <tr>
              <th className="border-b border-[#ddd] px-4 py-3 font-semibold">Product</th>
              <th className="border-b border-[#ddd] px-4 py-3 font-semibold">Quantity</th>
              <th className="border-b border-[#ddd] px-4 py-3 font-semibold">Price</th>
              <th className="border-b border-[#ddd] px-4 py-3 font-semibold">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.orderItems ?? []).map((item) => (
              <tr key={item.id}>
                <td className="border-b border-[#eee] px-4 py-3">{item.productName}</td>
                <td className="border-b border-[#eee] px-4 py-3">{item.quantity}</td>
                <td className="border-b border-[#eee] px-4 py-3">{formatProductPrice(item.price)}</td>
                <td className="border-b border-[#eee] px-4 py-3">
                  {formatProductPrice(Number(item.price) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 break-words text-right text-[16px] font-semibold">
        Total Amount: {formatProductPrice(order.totalAmount)}
      </div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#ddd] bg-[#fafafa] px-4 py-3">
      <div className="text-[12px] uppercase tracking-wide text-black">{label}</div>
      <div className="mt-1 text-[14px] font-semibold text-black">{value}</div>
    </div>
  );
}
