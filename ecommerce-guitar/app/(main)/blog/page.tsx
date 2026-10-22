import { Suspense } from "react";
import BlogPageContent from "./_components/BlogPageContent";
import { BlogBreadcrumb } from "./_components/blog-breadcrumb";
import { BlogPageHero } from "./_components/blog-page-hero";

function BlogFallback() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between">
        <div className="h-7 w-48 rounded bg-[#e0e0e0]" />
        <div className="h-9 w-full rounded bg-[#e0e0e0] md:max-w-[220px]" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border border-[#e2e2e2] bg-white p-0">
            <div className="aspect-[16/10] min-h-[200px] bg-[#e8e8e8] sm:min-h-[220px]" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-4/5 bg-[#e8e8e8]" />
              <div className="h-2.5 w-full bg-[#e8e8e8]" />
              <div className="h-2.5 w-2/3 bg-[#e8e8e8]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="bg-white">
      <BlogPageHero />
      <div className="mx-auto max-w-[1180px] px-4 py-6">
        <BlogBreadcrumb variant="listing" />
        <div className="border-t border-[#d7d7d7] pt-6">
          <Suspense fallback={<BlogFallback />}>
            <BlogPageContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
