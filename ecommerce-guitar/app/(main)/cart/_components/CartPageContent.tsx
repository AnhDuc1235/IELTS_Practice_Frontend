"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AuthContext } from "@/app/(main)/_context/AuthProvider";
import { cartService } from "@/services/cart.service";
import { formatProductPrice } from "@/utils/product-display";
import { Product, productsService } from "@/services/products.service";
import { FormNoticeAlert } from "@/components/form-notice-alert";
import SafeImage from "@/components/ui/safe-image";
import SiteBreadcrumb from "@/components/ui/site-breadcrumb";
import { cn } from "@/utils/cn";
import { Check, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const SUGGESTED_PRODUCTS_LIMIT = 10;
const QUANTITY_DELETE_VALUE = 0;
const CART_NOTICE_STORAGE_KEY = "cart-page-notice";
const NOTICE_AUTO_HIDE_MS = 8000;
const SUGGESTED_PRODUCT_IMAGE_FRAME_HEIGHT = 140;

type NoticeTone = "success" | "error";

interface CartPageNotice {
  tone: NoticeTone;
  message: string;
}

export default function CartPageContent() {
  const { isAuthenticated, isLoading: authLoading } = use(AuthContext);
  const [draftQuantities, setDraftQuantities] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<CartPageNotice | null>(null);

  useEffect(() => {
    const rawNotice = sessionStorage.getItem(CART_NOTICE_STORAGE_KEY);
    if (!rawNotice) return;

    try {
      const parsedNotice = JSON.parse(rawNotice) as CartPageNotice;
      if (parsedNotice?.tone && parsedNotice?.message) {
        setNotice(parsedNotice);
      }
    } catch {
    } finally {
      sessionStorage.removeItem(CART_NOTICE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => {
      setNotice(null);
    }, NOTICE_AUTO_HIDE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const setNoticeAndReload = (nextNotice: CartPageNotice) => {
    sessionStorage.setItem(CART_NOTICE_STORAGE_KEY, JSON.stringify(nextNotice));
    window.location.reload();
  };

  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });

  const cart = cartData?.data;
  const items = isAuthenticated ? cart?.cartItems || [] : [];
  const isEmpty = items.length === 0;

  const { data: categoriesResponse } = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => productsService.getCategories(),
    staleTime: 1000 * 60 * 10,
  });

  const suggestedCategoryId = categoriesResponse?.data?.[0]?.id;

  const { data: suggestedProducts } = useQuery({
    queryKey: ["suggested-products", suggestedCategoryId],
    queryFn: async () => {
      const response = await productsService.getProducts({
        limit: SUGGESTED_PRODUCTS_LIMIT,
        category: suggestedCategoryId || undefined,
      });
      return response.data ?? [];
    },
    enabled:
      categoriesResponse !== undefined &&
      (categoriesResponse.data.length === 0 || Boolean(suggestedCategoryId)),
  });

  const { mutate: updateQuantity, isPending: isUpdating } = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateCart(productId, quantity),
    onSuccess: (_, { productId }) => {
      setDraftQuantities((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      setNoticeAndReload({
        tone: "success",
        message: "Success: You have modified your shopping cart!",
      });
    },
    onError: () => {
      setNoticeAndReload({
        tone: "error",
        message:
          "Products marked with *** are not available in the desired quantity or not in stock!",
      });
    },
  });

  const { mutate: removeItem, isPending: isRemoving } = useMutation({
    mutationFn: (productId: string) => cartService.removeFromCart(productId),
    onSuccess: (_, productId) => {
      setDraftQuantities((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      setNoticeAndReload({
        tone: "success",
        message: "Success: You have modified your shopping cart!",
      });
    },
    onError: () =>
      setNoticeAndReload({
        tone: "error",
        message:
          "Products marked with *** are not available in the desired quantity or not in stock!",
      }),
  });

  const handleQuantityChange = (productId: string, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setDraftQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const handleConfirmUpdate = (productId: string) => {
    const currentItem = items.find((item) => item.product.id === productId);
    if (!currentItem) return;

    const draft = draftQuantities[productId];
    if (draft === undefined || draft === "" || draft === String(currentItem.quantity)) {
      return;
    }

    const nextQuantity = Number(draft);
    if (!Number.isInteger(nextQuantity) || nextQuantity < QUANTITY_DELETE_VALUE) {
      setNotice({
        tone: "error",
        message: "Products marked with *** are not available in the desired quantity or not in stock!",
      });
      return;
    }

    if (nextQuantity === QUANTITY_DELETE_VALUE) {
      removeItem(productId);
      return;
    }

    updateQuantity({ productId, quantity: nextQuantity });
  };

  const handleDeleteItem = (productId: string) => {
    removeItem(productId);
  };

  if (authLoading || (isAuthenticated && cartLoading)) {
    return <div className="py-20 text-center text-[13px]">Loading cart...</div>;
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

      <SiteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shopping Cart" },
        ]}
        className="mb-5"
      />

      {isEmpty ? (
        <div className="mb-8 text-center">
          <div className="text-[64px] leading-none text-[#e6bc4d]">!</div>
          <div className="mt-2 text-[34px] font-semibold">Shopping Cart</div>
          <div className="mt-1 text-[14px] text-[#666]">Your shopping cart is empty!</div>
          <Link
            href="/"
            className="mt-3 inline-block bg-[rgb(187,155,105)] px-7 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-[#a68a5a]"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mb-8 space-y-6">
          <div className="overflow-x-auto border border-[#ddd] bg-white">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#ddd]">
                  <th className="whitespace-nowrap border-r border-[#ddd] px-4 py-3 text-left font-semibold">
                    IMAGE
                  </th>
                  <th className="whitespace-nowrap border-r border-[#ddd] px-4 py-3 text-left font-semibold">
                    PRODUCT NAME
                  </th>
                  <th className="whitespace-nowrap border-r border-[#ddd] px-4 py-3 text-left font-semibold">
                    MODEL
                  </th>
                  <th className="whitespace-nowrap border-r border-[#ddd] px-4 py-3 text-center font-semibold">
                    QUANTITY
                  </th>
                  <th className="whitespace-nowrap border-r border-[#ddd] px-4 py-3 text-right font-semibold">
                    UNIT PRICE
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const price = Number(item.product.price);
                  const draftValue = draftQuantities[item.product.id];
                  const itemTotal = price * item.quantity;

                  return (
                    <tr key={item.id} className="border-b border-[#ddd]">
                      <td className="border-r border-[#ddd] px-4 py-3">
                        <div className="relative h-15 w-15">
                          <SafeImage
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            fill
                            sizes="60px"
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="border-r border-[#ddd] px-4 py-3">
                        <div className="font-semibold">{item.product.name}</div>
                      </td>
                      <td className="border-r border-[#ddd] px-4 py-3 text-[#666]">{item.product.sku}</td>
                      <td className="border-r border-[#ddd] px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max={item.product.stock}
                            value={draftValue ?? String(item.quantity)}
                            onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                            disabled={isUpdating || isRemoving}
                            className="w-24 border border-[#ddd] px-2 py-1 text-center text-[13px] disabled:opacity-50"
                          />
                          <button
                            onClick={() => handleConfirmUpdate(item.product.id)}
                            disabled={
                              isUpdating ||
                              isRemoving ||
                              draftValue === undefined ||
                              draftValue === "" ||
                              draftValue === String(item.quantity)
                            }
                            className="cursor-pointer bg-[#d4a574] p-1.5 text-white transition-colors hover:bg-[#bb9b69] disabled:cursor-not-allowed disabled:opacity-50"
                            title="Save changes"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.product.id)}
                            disabled={isRemoving || isUpdating}
                            className="cursor-pointer bg-[#e74c3c] p-1.5 text-white transition-colors hover:bg-[#d32f2f] disabled:cursor-not-allowed disabled:opacity-50"
                            title="Delete item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap border-r border-[#ddd] px-4 py-3 text-right">
                        ${price.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                        ${itemTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
            <div>
              <Link
                href="/"
                className="inline-block bg-[rgb(187,155,105)] px-6 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-[#a68a5a]"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="space-y-4">
              <div className="border border-[#ddd] bg-white p-5">
                <div className="mb-3 text-[16px] font-semibold">Order Summary</div>

                <div className="space-y-2 border-b border-[#ddd] pb-3">
                  <div className="flex justify-between text-[13px]">
                    <span>Subtotal:</span>
                    <span>${(cart?.totalPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span>Shipping:</span>
                    <span>TBD</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span>Tax:</span>
                    <span>TBD</span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between text-[15px] font-semibold">
                  <span>Total:</span>
                  <span>${(cart?.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-[#111] py-3 text-center text-[13px] font-semibold text-white transition-colors hover:bg-[#333]"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      )}

      {suggestedProducts && suggestedProducts.length > 0 && (
        <SuggestedProductsSlide products={suggestedProducts} />
      )}
    </>
  );
}

interface SuggestedProductsSlideProps {
  products: Product[];
}

function SuggestedProductsSlide({ products }: SuggestedProductsSlideProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const ITEMS_PER_SLIDE = 5;
  const maxStartIndex = Math.max(0, products.length - ITEMS_PER_SLIDE);
  const canSlide = maxStartIndex > 0;

  if (products.length === 0) return null;

  const startIdx = activeIndex;
  const slideItems = products.slice(startIdx, startIdx + ITEMS_PER_SLIDE);

  useEffect(() => {
    setActiveIndex((previous) => Math.min(previous, maxStartIndex));
  }, [maxStartIndex]);

  const handlePrevious = () => {
    if (!canSlide) return;
    setActiveIndex((previous) => Math.max(0, previous - 1));
  };

  const handleNext = () => {
    if (!canSlide) return;
    setActiveIndex((previous) => Math.min(maxStartIndex, previous + 1));
  };

  return (
    <>
      <div className="mt-8 bg-white p-6">
        <div className="mb-2 text-center text-[24px] font-semibold text-black">
          We think you&apos;d also like...
        </div>
        <div className="mb-6 text-center text-[12px] text-black">
          Here are some accessories you might want to add to your collection
        </div>

        <div className="space-y-4">
          <div className="group/carousel relative flex items-center justify-center">
          {canSlide ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-0 top-[40%] z-10 hidden h-14 w-8 cursor-pointer items-center justify-center bg-black/55 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100 lg:flex"
              aria-label="Show previous products"
            >
              <ChevronLeft size={20} />
            </button>
          ) : null}

          <div className="w-full overflow-hidden">
            <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3 lg:grid-cols-5">
              {slideItems.map((product: Product) => (
                <Link
                  key={product.id}
                  href={`/guitar-store/${product.id}`}
                  className="group overflow-hidden"
                  style={{ animation: "cartSuggestionFadeIn 320ms ease" }}
                >
                  <div
                    className="relative overflow-hidden border border-[#ddd] bg-white"
                    style={{ height: `${SUGGESTED_PRODUCT_IMAGE_FRAME_HEIGHT}px` }}
                  >
                    <SafeImage
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <div className="line-clamp-2 text-[12px] font-normal text-black">{product.name}</div>
                    <div className="mt-1 text-[13px] font-semibold text-black">
                      {formatProductPrice(product.price)}
                    </div>
                    <div className="mt-2">
                      <span className="block text-center text-[12px] text-[#9f7d48] transition-colors group-hover:text-[#9f7d48]">
                        See details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {canSlide ? (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-0 top-[40%] z-10 hidden h-14 w-8 cursor-pointer items-center justify-center bg-black/55 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100 lg:flex"
              aria-label="Show next products"
            >
              <ChevronRight size={20} />
            </button>
          ) : null}
          </div>

          {canSlide ? (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: maxStartIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all",
                    index === activeIndex ? "w-6 bg-[#bb9b69]" : "w-2 bg-[#bb9b69]/45 hover:bg-[#bb9b69]/70",
                  )}
                  aria-label={`Go to product slide ${index + 1}`}
                  aria-current={index === activeIndex}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        @keyframes cartSuggestionFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

