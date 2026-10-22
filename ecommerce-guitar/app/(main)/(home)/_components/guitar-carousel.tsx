"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productsService } from "@/services/products.service";
import SafeImage from "@/components/ui/safe-image";
import { cn } from "@/utils/cn";
import { formatProductPrice, getProductPrimaryImage } from "@/utils/product-display";

const RECENT_PRODUCTS_LIMIT = 9;
const RECENT_PRODUCTS_FETCH_LIMIT = 50;
const MOBILE_BREAKPOINT_PX = 768;
const SLIDE_GAP_PX = 32;
const isFeaturedProduct = (isFeatured: unknown): boolean => isFeatured === 1 || isFeatured === true || isFeatured === "1";

export default function GuitarCarousel() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [itemsPerView, setItemsPerView] = React.useState(3);

  const { data, isLoading, error } = useQuery({
    queryKey: ["recent-arrivals"],
    queryFn: () =>
      productsService.getProducts({
        page: 1,
        limit: RECENT_PRODUCTS_FETCH_LIMIT,
        sort: "newest",
      }),
    staleTime: 1000 * 60 * 5,
  });

  const products = React.useMemo(() => {
    const allProducts = data?.data ?? [];
    return allProducts.filter((product) => isFeaturedProduct(product.isFeatured)).slice(0, RECENT_PRODUCTS_LIMIT);
  }, [data?.data]);
  React.useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(window.innerWidth < MOBILE_BREAKPOINT_PX ? 1 : 3);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxStartIndex = Math.max(0, products.length - itemsPerView);
  const canSlide = maxStartIndex > 0;

  React.useEffect(() => {
    setActiveIndex((previous) => Math.min(previous, maxStartIndex));
  }, [maxStartIndex]);

  React.useEffect(() => {
    if (!canSlide) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous >= maxStartIndex ? 0 : previous + 1));
    }, 6000);

    return () => window.clearInterval(timer);
  }, [canSlide, maxStartIndex]);

  const handlePrevious = () => {
    if (!canSlide) {
      return;
    }
    setActiveIndex((previous) => Math.max(0, previous - 1));
  };

  const handleNext = () => {
    if (!canSlide) {
      return;
    }
    setActiveIndex((previous) => Math.min(maxStartIndex, previous + 1));
  };

  return (
    <section className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-[1180px] px-4">
        <div className="flex items-center justify-center gap-3 text-center leading-none">
          <h2 className="text-[28px] font-semibold text-black lg:text-[32px]">Recent Arrivals:</h2>
          <Link
            href="/guitar-store"
            className="cursor-pointer text-[15px] text-[#4d4d4d] underline decoration-[#dadada] underline-offset-[7px] transition-colors hover:text-black lg:text-[16px]"
          >
            Shop Guitars
          </Link>
        </div>

        <div className="mt-12 space-y-7">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-[420px] bg-[#efefef]" />
                  <div className="mt-4 h-5 w-3/4 bg-[#efefef]" />
                  <div className="mt-3 h-5 w-1/3 bg-[#efefef]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">
              Error loading recent arrivals.
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-[#777]">
              No recent arrivals available.
            </div>
          ) : (
            <>
              <div className="group/carousel relative">
                {canSlide ? (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="absolute left-0 top-[42%] z-10 hidden h-12 w-8 -translate-x-1/2 cursor-pointer items-center justify-center bg-[#8a8a8a]/80 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100 lg:flex"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-0 top-[42%] z-10 hidden h-12 w-8 translate-x-1/2 cursor-pointer items-center justify-center bg-[#8a8a8a]/80 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100 lg:flex"
                      aria-label="Next slide"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                ) : null}

                <div className="w-full overflow-hidden">
                  <div
                    className="flex gap-8 transition-transform duration-220 ease-out"
                    style={{
                      transform: `translateX(calc(-${activeIndex} * ((100% - ${(itemsPerView - 1) * SLIDE_GAP_PX}px) / ${itemsPerView} + ${SLIDE_GAP_PX}px)))`,
                    }}
                  >
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="w-full shrink-0"
                        style={{
                          flexBasis: `calc((100% - ${(itemsPerView - 1) * SLIDE_GAP_PX}px) / ${itemsPerView})`,
                        }}
                      >
                        <Link href={`/guitar-store/${product.id}`} className="group block">
                          <div className="relative h-[420px] overflow-hidden bg-white">
                            <SafeImage
                              src={getProductPrimaryImage(product)}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                          </div>
                          <div className="mt-4 text-center md:text-left">
                            <h3 className="line-clamp-2 text-[15px] font-bold leading-6 text-black">
                              {product.name}
                            </h3>
                            <p className="mt-1 text-[20px] text-black">{formatProductPrice(product.price)}</p>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {canSlide ? (
                <div className="flex justify-center gap-2 pt-1">
                  {Array.from({ length: maxStartIndex + 1 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "h-2 cursor-pointer rounded-full transition-all",
                        index === activeIndex ? "w-6 bg-[#bb9b69]" : "w-2 bg-[#bb9b69]/45 hover:bg-[#bb9b69]/70",
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}