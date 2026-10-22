"use client";

import { AuthContext } from "@/app/(main)/_context/AuthProvider";
import PaginationBar from "@/components/pagination-bar";
import { orderService } from "@/services/order.service";
import { formatProductPrice } from "@/utils/product-display";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

const LIMIT = 10;
type OrderSortOption = "newest" | "oldest";

function parseSort(value: string | null): OrderSortOption {
  if (value === "oldest") {
    return "oldest";
  }
  return "newest";
}

function parsePage(value: string | null): number {
  const parsedPage = Number(value);
  if (!Number.isFinite(parsedPage) || parsedPage < 1) {
    return 1;
  }
  return Math.floor(parsedPage);
}

function formatOrderDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function toReadableStatus(status: string): string {
  if (status === "PAID") {
    return "Completed";
  }
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function OrderHistoryContent() {
  const { isLoading: isAuthLoading, isAuthenticated } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const sort = parseSort(searchParams.get("sort"));

  const canFetchOrders = !isAuthLoading && isAuthenticated;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-orders", page, sort],
    queryFn: () =>
      orderService.getMyOrders({
        page,
        limit: LIMIT,
        sort,
      }),
    enabled: canFetchOrders,
  });

  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 0;

  const updateQueryParams = (nextPage: number, nextSort: OrderSortOption) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("page", String(nextPage));
    nextSearchParams.set("sort", nextSort);
    router.replace(`${pathname}?${nextSearchParams.toString()}`);
  };

  if (isAuthLoading) {
    return (
      <section className="border border-[#d8d8d8] bg-white p-6">
        <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">Order History</h1>
        <p className="mt-3 text-[15px] text-black">Preparing account session...</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="border border-[#d8d8d8] bg-white p-6">
        <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">Order History</h1>
        <p className="mt-3 text-[15px] text-black">Loading your latest order...</p>
      </section>
    );
  }

  if (isError || !data?.data) {
    return (
      <section className="border border-[#d8d8d8] bg-white p-6">
        <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">Order History</h1>
        <p className="mt-3 text-[15px] text-black">
          Unable to load order history right now. Please reload the page and try again.
        </p>
      </section>
    );
  }

  const orders = data.data;

  return (
    <section className="border border-[#d8d8d8] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6e6e6] px-4 py-5 md:px-6">
        <h1 className="text-[28px] font-semibold leading-tight md:text-[34px]">Order History</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="order-sort" className="text-[13px] font-semibold text-black">
            Sort by:
          </label>
          <select
            id="order-sort"
            value={sort}
            onChange={(event) => updateQueryParams(1, parseSort(event.target.value))}
            className="cursor-pointer border border-[#ddd] bg-white px-3 py-2 text-[13px] focus:border-[#bb9b69] focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left text-[14px]">
          <thead className="border-b border-[#e8e8e8]">
            <tr>
              <th className="px-6 py-5 text-[15px] font-semibold uppercase tracking-[0.4px] text-black">
                Order
              </th>
              <th className="px-6 py-5 text-[15px] font-semibold uppercase tracking-[0.4px] text-black">
                Date
              </th>
              <th className="px-6 py-5 text-[15px] font-semibold uppercase tracking-[0.4px] text-black">
                Status
              </th>
              <th className="px-6 py-5 text-[15px] font-semibold uppercase tracking-[0.4px] text-black">
                Total
              </th>
              <th className="px-6 py-5 text-[15px] font-semibold uppercase tracking-[0.4px] text-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[15px] text-black">
                  You do not have any orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const itemCount = order.orderItems?.length ?? 0;
                const itemLabel = itemCount === 1 ? "item" : "items";
                return (
                  <tr key={order.id} className="border-b border-[#ececec] last:border-b-0">
                    <td className="px-6 py-7 text-[15px] text-black">#{order.id.slice(0, 7)}</td>
                    <td className="px-6 py-7 text-[15px] text-black">{formatOrderDate(order.updatedAt)}</td>
                    <td className="px-6 py-7 text-[15px] text-black">{toReadableStatus(order.status)}</td>
                    <td className="px-6 py-7 text-[15px] text-black">
                      <span className="font-semibold text-black">{formatProductPrice(order.totalAmount)}</span>{" "}
                      for {itemCount} {itemLabel}
                    </td>
                    <td className="px-6 py-7">
                      <Link
                        href={`/account/order-history/${order.id}`}
                        className="inline-flex min-w-[104px] items-center justify-center bg-[#bb9b69] px-6 py-3 text-[14px] font-semibold uppercase tracking-wide text-black transition-colors hover:bg-[#a88a5d]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.total > 0 ? (
        <div className="border-t border-[#e8e8e8] px-4 py-6 md:px-6">
          <PaginationBar
            page={pagination.page}
            totalPages={totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(nextPage) => {
              updateQueryParams(nextPage, sort);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      ) : null}
    </section>
  );
}
