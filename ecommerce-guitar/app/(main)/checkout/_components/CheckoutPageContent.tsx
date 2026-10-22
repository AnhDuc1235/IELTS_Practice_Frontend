"use client";

import { AuthContext } from "@/app/(main)/_context/AuthProvider";
import { cartService } from "@/services/cart.service";
import { orderService } from "@/services/order.service";
import { writeLatestCheckoutOrder } from "@/utils/order-checkout-storage";
import { formatProductPrice } from "@/utils/product-display";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormNoticeAlert } from "@/components/form-notice-alert";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/ui/safe-image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";

const checkoutSchema = z.object({
  receiverName: z.string().trim().min(2, "Receiver name must be at least 2 characters."),
  phone: z.string().trim().min(8, "Phone number must be at least 8 characters."),
  shippingAddress: z.string().trim().min(10, "Shipping address must be at least 10 characters."),
  paymentMethod: z.string().trim().min(1, "Please select a payment method."),
  acceptedTerms: z
    .boolean()
    .refine((value) => value === true, "You have agree to the Terms & Conditions."),
});

type CheckoutFormValues = {
  receiverName: string;
  phone: string;
  shippingAddress: string;
  paymentMethod: string;
  acceptedTerms: boolean;
};

type CheckoutNoticeTone = "success" | "error";

interface CheckoutNotice {
  tone: CheckoutNoticeTone;
  message: string;
}

const NOTICE_AUTO_HIDE_MS = 8000;
const BANK_TRANSFER_METHOD = "Bank transfer";
const CASH_ON_DELIVERY_METHOD = "COD";

const initialValues: CheckoutFormValues = {
  receiverName: "",
  phone: "",
  shippingAddress: "",
  paymentMethod: BANK_TRANSFER_METHOD,
  acceptedTerms: false,
};

export default function CheckoutPageContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [values, setValues] = useState<CheckoutFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormValues, string>>>({});
  const [notice, setNotice] = useState<CheckoutNotice | null>(null);
  const [didAutofillName, setDidAutofillName] = useState(false);

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
  });

  const cart = cartData?.data;
  const items = cart?.cartItems ?? [];
  const isEmpty = items.length === 0;

  useEffect(() => {
    if (!isAuthenticated || !user?.name || didAutofillName || values.receiverName.trim().length > 0) {
      return;
    }

    setValues((prev) => ({ ...prev, receiverName: user.name }));
    setDidAutofillName(true);
  }, [didAutofillName, isAuthenticated, user?.name, values.receiverName]);

  const totalText = useMemo(() => formatProductPrice(cart?.totalPrice ?? 0), [cart?.totalPrice]);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => {
      setNotice(null);
    }, NOTICE_AUTO_HIDE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const createOrderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (response) => {
      const order = response.data.order;
      const qrUrl = response.qrUrl || response.data?.qrUrl || null;
      const selectedPaymentMethod = values.paymentMethod;

      writeLatestCheckoutOrder({
        orderId: order.id,
        paymentMethod: selectedPaymentMethod,
        qrUrl,
        totalAmount: order.totalAmount,
      });

      router.push("/checkout/payment");
    },
    onError: () => {
      setNotice({
        tone: "error",
        message: "Unable to continue to payment right now. Please check your information and try again.",
      });
    },
  });

  const onValueChange = <K extends keyof CheckoutFormValues>(key: K, value: CheckoutFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleContinuePayment = () => {
    setNotice(null);
    const parsed = checkoutSchema.safeParse(values);
    if (!parsed.success) {
      const formErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        receiverName: formErrors.receiverName?.[0],
        phone: formErrors.phone?.[0],
        shippingAddress: formErrors.shippingAddress?.[0],
        paymentMethod: formErrors.paymentMethod?.[0],
        acceptedTerms: formErrors.acceptedTerms?.[0],
      });
      setNotice({
        tone: "error",
        message: "Please complete all required information to continue to payment.",
      });
      return;
    }

    createOrderMutation.mutate({
      receiverName: parsed.data.receiverName,
      phone: parsed.data.phone,
      shippingAddress: parsed.data.shippingAddress,
      paymentMethod: parsed.data.paymentMethod,
    });
  };

  if (isLoading) {
    return <div className="py-20 text-center text-[13px]">Loading checkout...</div>;
  }

  return (
    <>
      {notice && (
        <FormNoticeAlert
          tone={notice.tone}
          message={notice.message}
          onClose={() => setNotice(null)}
        />
      )}

      <div className="mb-5 text-[13px] text-[#777]">Home / Shopping Cart / Checkout</div>

      {isEmpty ? (
        <div className="mb-8 border border-[#ddd] bg-white p-8 text-center">
          <div className="text-[22px] font-semibold">Your cart is empty.</div>
          <p className="mt-2 text-[14px] text-[#666]">
            Please add products to your cart before continuing to checkout.
          </p>
          <Link
            href="/guitar-store"
            className="mt-4 inline-block bg-[rgb(187,155,105)] px-7 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-[#a68a5a]"
          >
            Go To Guitar Store
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[3fr_2fr]">
          <section className="border border-[#ddd] bg-white p-6 lg:p-8">
            <h1 className="text-[36px] font-semibold text-black">Checkout</h1>

            <div className="mt-7 space-y-5">
              <CheckoutField
                label="Your Name:"
                value={values.receiverName}
                onChange={(nextValue) => onValueChange("receiverName", nextValue)}
                error={errors.receiverName}
                placeholder="Receiver name"
              />

              <CheckoutField
                label="Phone:"
                value={values.phone}
                onChange={(nextValue) => onValueChange("phone", nextValue)}
                error={errors.phone}
                placeholder="Phone number"
              />

              <CheckoutField
                label="Shipping Address:"
                value={values.shippingAddress}
                onChange={(nextValue) => onValueChange("shippingAddress", nextValue)}
                error={errors.shippingAddress}
                placeholder="Street, district, city"
              />

              <div>
                <label className="text-[15px] font-semibold text-black">Payment Method:</label>
                <select
                  value={values.paymentMethod}
                  onChange={(event) => onValueChange("paymentMethod", event.target.value)}
                  className="mt-2 h-[42px] w-full cursor-pointer border border-[#d7d7d7] px-3 text-[14px] outline-none"
                >
                  <option value={BANK_TRANSFER_METHOD}>Bank Transfer</option>
                  <option value={CASH_ON_DELIVERY_METHOD}>Cash On Delivery</option>
                </select>
                {errors.paymentMethod ? (
                  <p className="mt-1 text-[12px] text-[#b42318]">{errors.paymentMethod}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-7 space-y-2 text-[14px]">
              <label className="flex items-start gap-2 text-black">
                <input
                  type="checkbox"
                  checked={values.acceptedTerms}
                  onChange={(event) => onValueChange("acceptedTerms", event.target.checked)}
                  className="mt-0.5 h-4 w-4 border border-[#bbb]"
                />
                <span>I have read and agree to the Terms & Conditions</span>
              </label>
              {errors.acceptedTerms ? (
                <p className="text-[12px] text-[#b42318]">{errors.acceptedTerms}</p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <Link href="/cart" className="text-[14px] font-semibold text-black underline underline-offset-2">
                Return to cart
              </Link>
              <button
                type="button"
                onClick={handleContinuePayment}
                disabled={createOrderMutation.isPending}
                className="inline-flex cursor-pointer items-center gap-2 bg-[#20b24b] px-7 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#16943b] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {createOrderMutation.isPending ? "Processing..." : "Continue to Payment"}
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          <aside className="border border-l-0 border-[#ddd] bg-[#f2f2f5] p-4 lg:border-l-[2px] lg:border-l-[#ddd] lg:p-5">
            <div className="sticky top-4 h-fit space-y-4">
              {items.map((item) => {
                const quantityText = `x${item.quantity}`;
                return (
                  <div key={item.id} className="flex gap-3 border-b border-[#ddd] pb-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-[#ddd] bg-white">
                      <SafeImage
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 text-[14px] font-medium leading-tight text-[#222]">
                        {item.product.name}
                      </div>
                      <div className="mt-1 text-[12px] text-[#666]">{item.product.sku}</div>
                      <div className="mt-1 flex items-end gap-2">
                        <div className="text-[16px] font-semibold leading-none text-black">
                          {formatProductPrice(item.product.price)}
                        </div>
                        <span className="text-[12px] leading-none text-[#666]">{quantityText}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="space-y-3 pt-2 text-[14px] font-semibold text-black">
                <div className="flex items-center justify-between border-b border-[#ddd] pb-3">
                  <span className="text-[14px]">Sub-Total:</span>
                  <span>{totalText}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px]">Total:</span>
                  <span>{totalText}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function CheckoutField({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div>
      <label className="text-[15px] font-semibold text-black">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-[42px] w-full border border-[#d7d7d7] px-3 text-[14px] outline-none"
        placeholder={placeholder}
      />
      {error ? <p className="mt-1 text-[12px] text-[#b42318]">{error}</p> : null}
    </div>
  );
}

