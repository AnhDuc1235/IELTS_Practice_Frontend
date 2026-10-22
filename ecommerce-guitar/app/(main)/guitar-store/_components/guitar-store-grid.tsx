"use client";

import Link from "next/link";
import PaginationBar from "@/components/pagination-bar";
import { GuitarStoreFilters } from "./guitar-store-page";
import { ProductsResponse } from "@/services/products.service";
import { Skeleton } from "@/components/ui/skeleton";
import SafeImage from "@/components/ui/safe-image";
import { formatProductPrice, getProductPrimaryImage } from "@/utils/product-display";

interface GuitarStoreGridProps {
  data?: ProductsResponse;
  isLoading: boolean;
  error: Error | null;
  filters: GuitarStoreFilters;
  isAccessoriesCategoryActive: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (sort: GuitarStoreFilters["sort"]) => void;
}

const SORT_OPTIONS: Array<{ label: string; value: GuitarStoreFilters["sort"] }> = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Price: Low to High", value: "price_asc" },
];

function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="h-[340px] w-full rounded-none bg-[#f1f1f1]" />
      <Skeleton className="mx-auto mt-3 h-4 w-4/5" />
      <Skeleton className="mx-auto mt-2 h-4 w-1/4" />
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default function GuitarStoreGrid({
  data,
  isLoading,
  error,
  filters,
  isAccessoriesCategoryActive,
  onPageChange,
  onSortChange,
}: GuitarStoreGridProps) {
  if (error) {
    return (
      <div className="col-span-1 py-8 text-center md:col-span-2">
        <p className="text-red-500">Error loading products. Please try again.</p>
      </div>
    );
  }

  const products = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 0;

  return (
    <div>
      <div className="mb-6 flex justify-end pb-4 pt-3">
        <div className="flex items-center gap-2">
          <label className="text-[13px] font-semibold text-black">Sort By:</label>
          <select
            value={filters.sort}
            onChange={(event) => onSortChange(event.target.value as GuitarStoreFilters["sort"])}
            className="cursor-pointer rounded border border-[#ddd] bg-white px-3 py-2 text-[13px] focus:border-[#bb9b69] focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-x-10 gap-y-9 sm:grid-cols-2">
          {products.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-[#999]">No products found</p>
            </div>
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/guitar-store/${product.id}`}
                className="group block"
              >
                <div className="relative h-[300px] overflow-hidden">
                  <SafeImage
                    src={getProductPrimaryImage(product)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={
                      isAccessoriesCategoryActive
                        ? "scale-[0.92] object-contain p-3"
                        : "object-cover object-[center_50%]"
                    }
                  />
                </div>
                <div className="mt-3 text-center">
                  <h3 className="mx-auto h-[40px] line-clamp-2 max-w-[95%] text-[15px] font-normal leading-[1.35] text-black">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex h-[18px] items-center justify-center gap-2">
                    <span className="text-[17px] font-bold leading-none text-black">
                      {formatProductPrice(product.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {pagination && pagination.total > 0 ? (
        <div className="mt-8 border-t border-[#ddd] pb-6 pt-5">
          <PaginationBar
            page={pagination.page}
            totalPages={totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </div>
  );
}
