import BlogPostDetail from "./_components/blog-post-detail";
import { BlogBreadcrumb } from "../_components/blog-breadcrumb";
import { BlogPageHero } from "../_components/blog-page-hero";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;

  return (
    <div className="bg-white">
      <BlogPageHero title="Blog" />
      <div className="mx-auto max-w-[1180px] px-4 py-6">
        <BlogBreadcrumb variant="article" articleLabel="Article" />
        <div className="border-t border-[#d7d7d7] pt-6">
          <BlogPostDetail postId={id} />
        </div>
      </div>
    </div>
  );
}
