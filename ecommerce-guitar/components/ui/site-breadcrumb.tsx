"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SiteBreadcrumbItem {
  label: string;
  href?: string;
}

interface SiteBreadcrumbProps {
  items: SiteBreadcrumbItem[];
  className?: string;
}

export default function SiteBreadcrumb({ items, className }: SiteBreadcrumbProps) {
  return (
    <nav className={`mb-4 flex flex-wrap items-center gap-2 ${className ?? ""}`.trim()} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isCurrent ? (
              <Link
                href={item.href}
                className="text-[12px] text-[#bb9b69] transition-colors hover:text-[#a68a5a]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isCurrent ? "page" : undefined}
                className={isCurrent ? "text-[12px] font-semibold text-black" : "text-[12px] text-[#bb9b69]"}
              >
                {item.label}
              </span>
            )}

            {!isCurrent ? <ChevronRight size={14} className="shrink-0 text-[#ccc]" /> : null}
          </div>
        );
      })}
    </nav>
  );
}
