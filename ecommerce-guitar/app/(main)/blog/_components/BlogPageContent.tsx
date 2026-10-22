"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Search } from "lucide-react";
import * as React from "react";
import PaginationBar from "@/components/pagination-bar";
import { Skeleton } from "@/components/ui/skeleton";
import SafeImage from "@/components/ui/safe-image";
import { postsService } from "@/services/posts.service";

const PAGE_LIMIT = 12;

function toPlainText(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parsePage(value: string | null): number {
  const parsedPage = Number(value);
  if (!Number.isFinite(parsedPage) || parsedPage < 1) {
    return 1;
  }
  return Math.floor(parsedPage);
}

function PostCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden border border-[#e2e2e2] bg-white">
      <Skeleton className="aspect-[16/10] min-h-[200px] w-full shrink-0 rounded-none" />
      <div className="flex flex-1 flex-col p-3 pt-2.5">
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="mt-2 h-2.5 w-full" />
        <Skeleton className="mt-2 h-2.5 w-2/3" />
        <Skeleton className="mt-auto h-2.5 w-20 pt-4" />
      </div>
    </article>
  );
}

export default function BlogPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const safeReplace = React.useCallback(
    (url: string) => {
      try {
        router.replace(url);
      } catch {
        window.location.href = url;
      }
    },
    [router],
  );

  const page = parsePage(searchParams.get("page"));
  const searchFromUrl = (searchParams.get("search") ?? "").trim();

  const [draftSearch, setDraftSearch] = React.useState(searchFromUrl);

  React.useEffect(() => {
    setDraftSearch(searchFromUrl);
  }, [searchFromUrl]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = draftSearch.trim();
    if (next === searchFromUrl) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (next) {
      params.set("search", next);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    safeReplace(`${pathname}?${params.toString()}`);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", page, searchFromUrl, PAGE_LIMIT],
    queryFn: () =>
      postsService.getPosts({
        page,
        limit: PAGE_LIMIT,
        search: searchFromUrl || undefined,
      }),
    staleTime: 1000 * 60,
  });

  const posts = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 0;

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    safeReplace(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col gap-3 pb-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[20px] font-semibold tracking-tight text-black md:text-[22px]">
          Most Recent Articles
        </h1>

        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-w-[200px] shrink-0 sm:max-w-[220px] md:max-w-[240px]"
        >
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#888]"
            aria-hidden
          />
          <input
            type="search"
            value={draftSearch}
            onChange={(event) => setDraftSearch(event.target.value)}
            placeholder="Search"
            maxLength={100}
            className="h-9 w-full border border-[#d8d8d8] bg-white py-1.5 pl-9 pr-2.5 text-[13px] text-black placeholder:text-[#999] focus:border-[#bb9b69] focus:outline-none"
            aria-label="Search articles by title"
          />
        </form>
      </div>

      {isError ? (
        <p className="py-12 text-center text-[13px] text-red-600">
          Unable to load articles. Please try again later.
        </p>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="py-16 text-center text-[13px] text-[#666]">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col overflow-hidden border border-[#e2e2e2] bg-white shadow-sm"
            >
              <Link
                href={`/blog/${post.id}`}
                className="relative block aspect-[16/10] w-full min-h-[200px] shrink-0 overflow-hidden bg-[#f0f0f0] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8d6c36] sm:min-h-[220px]"
                aria-label={`View article: ${post.title}`}
              >
                {post.thumbnail ? (
                  <SafeImage
                    src={post.thumbnail}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-fill object-center"
                  />
                ) : (
                  <div className="h-full w-full bg-[#e8e8e8]" />
                )}
              </Link>

              <div className="flex flex-1 flex-col p-3 pt-2.5">
                <h2 className="text-[13px] font-semibold leading-snug">
                  <Link
                    href={`/blog/${post.id}`}
                    className="line-clamp-2 text-black hover:text-[#8d6c36]"
                  >
                    {post.title}
                  </Link>
                </h2>

                <div className="mt-1.5 min-h-[2.75rem] flex-1">
                  <p className="line-clamp-2 text-[12px] leading-relaxed text-[#444]">
                    {toPlainText(post.content)}
                  </p>
                </div>

                <div className="mt-2.5 border-t border-[#e8e8e8] pt-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8d6c36]">
                    <CalendarDays size={12} className="shrink-0" aria-hidden />
                    <span>{formatDate(post.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination && pagination.total > 0 ? (
        <div className="mt-8 border-t border-[#d7d7d7] pt-6">
          <PaginationBar
            page={pagination.page}
            totalPages={totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </>
  );
}
