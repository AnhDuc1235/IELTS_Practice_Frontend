import { notFound } from "next/navigation";
import { fetchProductById } from "./_actions/product.action";
import ProductDetailContent from "./_components/product-detail-content";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  try {
    const product = await fetchProductById(id);
    return <ProductDetailContent product={product} />;
  } catch (error) {
    console.error(`[Page] Error loading product ${id}:`, error instanceof Error ? error.message : error);
    notFound();
  }
}
