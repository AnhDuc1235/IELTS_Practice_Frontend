"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { productsService, ProductSort } from "@/services/products.service";
import { findCategoryIdByExactName, findCategoryIdByKeywords } from "@/utils/product-display";
import SiteBreadcrumb from "@/components/ui/site-breadcrumb";
import GuitarStoreSidebar from "./guitar-store-sidebar";
import GuitarStoreGrid from "./guitar-store-grid";

function parsePriceQueryParam(raw: string | null): number | null {
  if (raw === null) {
    return null;
  }
  const trimmed = raw.trim();
  if (trimmed === "") {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export interface GuitarStoreFilters {
  page: number;
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  sort: ProductSort;
}

export default function GuitarStorePageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [filters, setFilters] = React.useState<GuitarStoreFilters>({
    page: 1,
    search: "",
    category: "",
    minPrice: null,
    maxPrice: null,
    sort: "newest",
  });
  const filtersRef = React.useRef(filters);
  filtersRef.current = filters;

  const { data: categoriesResponse, isSuccess: categoriesFetched } = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => productsService.getCategories(),
    staleTime: 1000 * 60 * 10,
  });

  const categories = React.useMemo(
    () => categoriesResponse?.data ?? [],
    [categoriesResponse?.data],
  );

  React.useEffect(() => {
    const search = (searchParams.get("search") || "").trim();
    const categoryQuery = (searchParams.get("category") || "").trim();
    const minPrice = parsePriceQueryParam(searchParams.get("minPrice"));
    const maxPrice = parsePriceQueryParam(searchParams.get("maxPrice"));
    const scope = searchParams.get("scope");
    const accessoriesCategoryId = findCategoryIdByKeywords(categories, ["accessories", "accessory"]);
    const classicalCategoryId = findCategoryIdByExactName(categories, "Classical Guitars");
    const flamencoCategoryId = findCategoryIdByExactName(categories, "Flamenco Guitars");

    let resolvedCategoryFromQuery = "";
    const isIdQuery = categories.some((category) => category.id === categoryQuery);
    if (isIdQuery) {
      resolvedCategoryFromQuery = categoryQuery;
    } else if (categoryQuery === "classical-guitars" && classicalCategoryId) {
      resolvedCategoryFromQuery = classicalCategoryId;
    } else if (categoryQuery === "flamenco-guitars" && flamencoCategoryId) {
      resolvedCategoryFromQuery = flamencoCategoryId;
    }

    setFilters((previous) => ({
      ...previous,
      page: 1,
      search,
      category:
        resolvedCategoryFromQuery ||
        (scope === "accessories" && accessoriesCategoryId ? accessoriesCategoryId : classicalCategoryId || ""),
      minPrice,
      maxPrice,
    }));
  }, [searchParamsString, categoriesResponse?.data, categories]);

  const defaultCategoryId =
    findCategoryIdByExactName(categories, "Classical Guitars") || (categories.length > 0 ? categories[0]?.id ?? "" : "");
  const resolvedCategoryId = filters.category || defaultCategoryId;
  const accessoriesCategoryId = findCategoryIdByKeywords(categories, ["accessories", "accessory"]);
  const isAccessoriesCategoryActive = Boolean(
    accessoriesCategoryId && resolvedCategoryId === accessoriesCategoryId,
  );
  const activeCategoryName = categories.find((category) => category.id === resolvedCategoryId)?.name;

  const productsQueryEnabled =
    categoriesFetched && (categories.length === 0 || Boolean(resolvedCategoryId));

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "products",
      filters.page,
      filters.search,
      resolvedCategoryId,
      filters.minPrice,
      filters.maxPrice,
      filters.sort,
    ],
    queryFn: () =>
      productsService.getProducts({
        page: filters.page,
        limit: 14,
        search: filters.search.trim() || undefined,
        category: resolvedCategoryId || undefined,
        minPrice: filters.minPrice ?? undefined,
        maxPrice: filters.maxPrice ?? undefined,
        sort: filters.sort,
      }),
    staleTime: 1000 * 60 * 5,
    enabled: productsQueryEnabled,
  });

  const updateFilters = (newFilters: Partial<GuitarStoreFilters>) => {
    const previous = filtersRef.current;
    const merged = {
      ...previous,
      page: 1,
      ...newFilters,
    };
    const next: GuitarStoreFilters = {
      ...merged,
      search: merged.search.trim(),
    };

    setFilters(next);
    filtersRef.current = next;

    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (next.search) {
      nextSearchParams.set("search", next.search);
    } else {
      nextSearchParams.delete("search");
    }

    if (next.category) {
      nextSearchParams.set("category", next.category);
    } else {
      nextSearchParams.delete("category");
    }

    if (next.minPrice != null && Number.isFinite(next.minPrice)) {
      nextSearchParams.set("minPrice", String(next.minPrice));
    } else {
      nextSearchParams.delete("minPrice");
    }

    if (next.maxPrice != null && Number.isFinite(next.maxPrice)) {
      nextSearchParams.set("maxPrice", String(next.maxPrice));
    } else {
      nextSearchParams.delete("maxPrice");
    }

    nextSearchParams.delete("scope");
    const queryString = nextSearchParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    setFilters((previous) => ({
      ...previous,
      page,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bannerTitle = activeCategoryName ?? "Guitar Store";
  const bannerScope = activeCategoryName ?? "Guitars";

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden">
        <Image
          src="/footer-bg-1920x940.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="relative mx-auto flex h-[130px] max-w-[1180px] items-center justify-between gap-4 px-4">
          <div className="min-w-0 text-white">
            <h1 className="text-[28px] font-bold leading-tight">{bannerTitle}</h1>
            <p className="mt-1 text-[11px] sm:text-[12px]">
              World&apos;s Finest {bannerScope} Carefully Selected by our Experts
            </p>
          </div>
          <Image
            src="/header-store-guitar-bg-1-320x130.webp"
            alt="Featured guitar"
            width={320}
            height={130}
            className="hidden h-full w-auto object-contain sm:block"
            priority
          />
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-4 py-6">
        <SiteBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Guitar Store", href: "/guitar-store" },
            ...(activeCategoryName ? [{ label: activeCategoryName }] : []),
          ]}
        />

        <div className="grid grid-cols-1 border-t border-[#d7d7d7] lg:grid-cols-[240px_1fr]">
          <GuitarStoreSidebar
            categories={categories}
            selectedCategoryId={resolvedCategoryId}
            filters={filters}
            onFilterChange={updateFilters}
          />

          <div className="pt-4 lg:border-l lg:border-[#d7d7d7] lg:pl-8 lg:pt-0">
            <GuitarStoreGrid
              data={data}
              isLoading={isLoading || !productsQueryEnabled}
              error={error}
              filters={filters}
              isAccessoriesCategoryActive={isAccessoriesCategoryActive}
              onPageChange={handlePageChange}
              onSortChange={(sort) => updateFilters({ sort })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
