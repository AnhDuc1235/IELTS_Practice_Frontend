"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { postsService } from "@/services/posts.service";
import { sanitizeHtml } from "@/utils/security";

function isHtmlContent(value: string) {
  return /<[a-z][\s\S]*>/i.test(value.trim());
}

function formatPostHeaderDate(value: string) {
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

interface BlogPostDetailProps {
  postId: string;
}

export default function BlogPostDetail({ postId }: BlogPostDetailProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => postsService.getPostById(postId),
    retry: false,
  });

  const post = data?.data;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 py-4">
        <div className="h-3.5 w-28 rounded bg-[#e8e8e8]" />
        <div className="h-9 w-full max-w-3xl rounded bg-[#e8e8e8] md:h-10" />
        <div className="h-36 w-full max-w-3xl rounded bg-[#e8e8e8] md:h-40" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="py-16 text-center">
        <p className="text-[13px] text-[#555]">This article could not be found.</p>
        <Link href="/blog" className="mt-3 inline-block text-[13px] font-semibold text-[#8d6c36] hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto w-full text-left">
      <p className="text-[14px] font-medium text-[#bb9b69] md:text-[15px]">
        {formatPostHeaderDate(post.updatedAt)}
      </p>
      <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-black md:text-[34px]">
        {post.title}
      </h1>

      <div className="mt-8 w-full">
        {isHtmlContent(post.content) ? (
          <div
            className="post-html-content post-html-content--detail text-[#333]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
        ) : (
          <p className="whitespace-pre-wrap text-[17px] leading-relaxed text-[#333] md:text-[18px]">
            {post.content}
          </p>
        )}
      </div>
    </article>
  );
}
