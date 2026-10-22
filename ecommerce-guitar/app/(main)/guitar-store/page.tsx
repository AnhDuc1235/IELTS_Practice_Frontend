import { Suspense } from "react";
import GuitarStorePageContent from "./_components/guitar-store-page";

export default function GuitarStorePage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-[#f5f5f5]" />}>
      <GuitarStorePageContent />
    </Suspense>
  );
}
