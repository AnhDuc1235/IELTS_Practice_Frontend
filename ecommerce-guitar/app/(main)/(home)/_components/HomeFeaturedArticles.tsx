"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { postsService } from "@/services/posts.service";
import SafeImage from "@/components/ui/safe-image";

function toPlainText(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function HomeFeaturedArticles() {
  const { data } = useQuery({
    queryKey: ["home-featured-posts"],
    queryFn: () => postsService.getPosts(3),
    staleTime: 1000 * 60 * 5,
  });

  const posts = data?.data ?? [];
  const displayedPosts = posts.slice(0, 3);

  return (
    <section className="home-black-band home-black-band--double bg-black py-14 text-white">
      <div className="mx-auto max-w-[1180px] px-4">
        <div className="text-center text-[30px] font-semibold">
          Featured Articles, Upcoming Events, Best Guitarists and more!
        </div>
        <div className="mt-2 text-center text-[15px] text-white/85">
          Top stories you may have missed at{" "}
          <span className="font-semibold text-white">GSI</span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:items-stretch">
          {displayedPosts.map((post, index) => (
            <article
              key={`${post.id}-${index}`}
              className="flex flex-col overflow-hidden border border-white/20 bg-black"
            >
              <div className="relative aspect-[16/10] min-h-[210px] w-full shrink-0 overflow-hidden bg-black/5">
                {post.thumbnail ? (
                  <SafeImage
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-fill object-center"
                  />
                ) : (
                  <div className="h-full w-full bg-black/20" />
                )}
              </div>

              <div className="flex flex-1 flex-col p-4 pt-3">
                <h3 className="text-[15px] font-semibold leading-snug">
                  <Link href={`/blog/${post.id}`} className="line-clamp-2 hover:text-[rgb(187,155,105)]">
                    {post.title}
                  </Link>
                </h3>

                <div className="mt-2 h-[3rem] flex-1">
                  <p className="line-clamp-2 text-[14px] leading-relaxed text-white/82">{toPlainText(post.content)}</p>
                </div>

                <div className="mt-auto flex items-center gap-2 pt-3 text-[12px] font-medium text-[#bb9b69]">
                  <CalendarDays size={13} className="shrink-0" aria-hidden />
                  <span>{formatDate(post.updatedAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-block cursor-pointer bg-[rgb(187,155,105)] px-7 py-2 text-[13px] font-semibold text-black"
          >
            READ OUR BLOG
          </Link>
        </div>
      </div>
    </section>
  );
}
