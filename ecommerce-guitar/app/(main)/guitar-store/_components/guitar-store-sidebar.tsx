"use client";

import * as React from "react";
import { Category } from "@/services/products.service";
import { sanitizeUserInput } from "@/utils/security";
import { GuitarStoreFilters } from "./guitar-store-page";

const SEARCH_MAX_LENGTH = 100;
const PRICE_MAX_VALUE = 99_999_999;

interface GuitarStoreSidebarProps {
  categories: Category[];
  selectedCategoryId: string;
  filters: GuitarStoreFilters;
  onFilterChange: (filters: Partial<GuitarStoreFilters>) => void;
}

export default function GuitarStoreSidebar({
  categories,
  selectedCategoryId,
  filters,
  onFilterChange,
}: GuitarStoreSidebarProps) {
  const [searchInput, setSearchInput] = React.useState(filters.search);
  const [minPrice, setMinPrice] = React.useState<string>(filters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = React.useState<string>(filters.maxPrice?.toString() || "");

  React.useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  React.useEffect(() => {
    setMinPrice(filters.minPrice != null ? String(filters.minPrice) : "");
  }, [filters.minPrice]);

  React.useEffect(() => {
    setMaxPrice(filters.maxPrice != null ? String(filters.maxPrice) : "");
  }, [filters.maxPrice]);

  const orderedCategories = React.useMemo(() => {
    const next = [...categories];
    const flamencoIndex = next.findIndex((category) => category.name.trim().toLowerCase() === "flamenco guitars");
    const accessoriesIndex = next.findIndex((category) => {
      const normalizedName = category.name.trim().toLowerCase();
      return normalizedName.includes("accessories") || normalizedName.includes("accessory");
    });

    if (flamencoIndex === -1 || accessoriesIndex === -1) {
      return next;
    }

    const [accessoriesCategory] = next.splice(accessoriesIndex, 1);
    const targetIndex = next.findIndex((category) => category.name.trim().toLowerCase() === "flamenco guitars");
    next.splice(targetIndex + 1, 0, accessoriesCategory);

    return next;
  }, [categories]);

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({ category: categoryId });
  };

  const applySearchFilter = () => {
    onFilterChange({ search: sanitizeUserInput(searchInput, SEARCH_MAX_LENGTH) });
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applySearchFilter();
  };

  const parsePriceInput = (value: string): number | null => {
    const trimmed = value.trim();
    if (trimmed === "") {
      return null;
    }
    const n = Number(trimmed);
    if (!Number.isFinite(n) || n < 0 || n > PRICE_MAX_VALUE) {
      return null;
    }
    return n;
  };

  const handlePriceChange = () => {
    onFilterChange({
      minPrice: parsePriceInput(minPrice),
      maxPrice: parsePriceInput(maxPrice),
    });
  };

  return (
    <aside className="h-fit border-b border-[#d7d7d7] bg-white py-4 lg:sticky lg:top-4 lg:border-b-0 lg:pr-5">
      <div className="mb-8">
        <h3 className="mb-4 text-[16px] font-bold text-[#bb9b69]">
          Categories
        </h3>
        <div className="space-y-3">
          {orderedCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              className={`block cursor-pointer text-left text-[13px] text-black ${
                selectedCategoryId === category.id ? "font-bold" : "font-normal"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-[16px] font-bold text-[#bb9b69]">
          Search
        </h3>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by name or SKU"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onBlur={applySearchFilter}
            maxLength={SEARCH_MAX_LENGTH}
            className="w-full rounded border border-[#ddd] px-3 py-2 text-[13px] focus:border-[#bb9b69] focus:outline-none"
          />
        </form>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-[16px] font-bold text-[#bb9b69]">
          Price
        </h3>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] text-black">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              onBlur={handlePriceChange}
              min={0}
              max={PRICE_MAX_VALUE}
              className="w-full rounded border border-[#ddd] px-2 py-1 text-[12px] focus:border-[#bb9b69] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-black">Max Price</label>
            <input
              type="number"
              placeholder="99999"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              onBlur={handlePriceChange}
              min={0}
              max={PRICE_MAX_VALUE}
              className="w-full rounded border border-[#ddd] px-2 py-1 text-[12px] focus:border-[#bb9b69] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
