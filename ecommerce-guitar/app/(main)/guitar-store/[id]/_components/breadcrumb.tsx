"use client";

import SiteBreadcrumb from "@/components/ui/site-breadcrumb";

interface BreadcrumbProps {
  productName: string;
}

export default function Breadcrumb({ productName }: BreadcrumbProps) {
  return (
    <SiteBreadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Guitar Store", href: "/guitar-store" },
        { label: productName },
      ]}
    />
  );
}
