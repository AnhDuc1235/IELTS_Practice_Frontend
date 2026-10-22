import SiteBreadcrumb from "@/components/ui/site-breadcrumb";

type BlogBreadcrumbProps =
  | { variant: "listing" }
  | { variant: "article"; articleLabel: string };

export function BlogBreadcrumb(props: BlogBreadcrumbProps) {
  if (props.variant === "listing") {
    return (
      <SiteBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />
    );
  }

  return (
    <SiteBreadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: props.articleLabel },
      ]}
    />
  );
}
