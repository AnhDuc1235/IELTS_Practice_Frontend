"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/app/(main)/_context/AuthProvider";
import { cartService } from "@/services/cart.service";
import SafeImage from "@/components/ui/safe-image";

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { isAuthenticated } = use(AuthContext);

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: open && isAuthenticated,
  });

  const cart = cartData?.data;
  const items = cart?.cartItems || [];
  const isEmpty = items.length === 0;

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prev;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/70"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={[
          "fixed right-0 top-0 z-[70] flex h-screen w-full max-w-[400px] flex-col border-l border-[#ddd] bg-white text-black transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#ddd] px-4 py-3">
          <h2 className="text-[17px] font-semibold">Your Cart</h2>
          <button className="cursor-pointer px-2 py-1 text-[12px]" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isEmpty ? (
            <div className="text-[13px] text-[#555]">Your shopping cart is empty!</div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-[#ddd] pb-3 last:border-b-0">
                  <div className="relative h-[60px] w-[60px] flex-shrink-0">
                    <SafeImage
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-[12px]">
                    <div className="line-clamp-1 font-semibold text-[#333]">
                      {item.product.name}
                    </div>
                    <div className="mt-1 text-[#666]">Qty: {item.quantity}</div>
                    <div className="mt-1 font-semibold text-[#333]">
                      ${Number(item.product.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isEmpty && (
            <div className="mt-4 border-t border-[#ddd] pt-4">
              <div className="flex justify-between text-[13px] font-semibold">
                <span>Total:</span>
                <span>${(cart?.totalPrice || 0).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 border-t border-[#ddd] bg-white p-3">
          <Link
            className="flex-1 bg-[rgb(187,155,105)] py-2 text-center text-[13px] font-semibold text-black transition-colors hover:bg-[#a68a5a]"
            href="/cart"
            onClick={onClose}
          >
            Edit cart
          </Link>
          <Link
            className="flex-1 bg-[#111] py-2 text-center text-[13px] font-semibold text-white transition-colors hover:bg-[#333]"
            href="/checkout"
            onClick={onClose}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}