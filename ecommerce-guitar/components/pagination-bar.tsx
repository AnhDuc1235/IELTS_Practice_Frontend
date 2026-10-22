"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { getVisiblePages } from "@/utils/pagination";

const btnBase =
  "flex h-9 min-w-9 cursor-pointer items-center justify-center border px-2 text-[13px] transition-colors";
const btnInactive = "border-[#d8d8d8] bg-white text-[#8d6c36] hover:border-[#bb9b69]";
const btnActive = "border-[#1f2428] bg-[#1f2428] font-semibold text-white";
const iconBtn = `${btnBase} ${btnInactive} disabled:cursor-not-allowed disabled:opacity-50`;

export interface PaginationBarProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function PaginationBar({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationBarProps) {
  if (total <= 0) {
    return null;
  }

  const safeTotalPages = Math.max(1, totalPages);
  const visiblePages = getVisiblePages(safeTotalPages, page);
  const showingFrom = total > 0 ? (page - 1) * limit + 1 : 0;
  const showingTo = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={iconBtn}
          disabled={page <= 1 || safeTotalPages <= 1}
          onClick={() => onPageChange(1)}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          className={iconBtn}
          disabled={page <= 1 || safeTotalPages <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {visiblePages.map((visiblePage) => (
          <button
            key={visiblePage}
            type="button"
            onClick={() => onPageChange(visiblePage)}
            className={[btnBase, visiblePage === page ? btnActive : `${btnInactive} px-3`].join(" ")}
            aria-current={visiblePage === page ? "page" : undefined}
          >
            {visiblePage}
          </button>
        ))}

        <button
          type="button"
          className={iconBtn}
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange(Math.min(safeTotalPages, page + 1))}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          className={iconBtn}
          disabled={page >= safeTotalPages}
          onClick={() => onPageChange(safeTotalPages)}
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="text-[13px] text-[#444]">
        Showing {showingFrom} to {showingTo} of {total} ({safeTotalPages} Page)
      </p>
    </div>
  );
}
