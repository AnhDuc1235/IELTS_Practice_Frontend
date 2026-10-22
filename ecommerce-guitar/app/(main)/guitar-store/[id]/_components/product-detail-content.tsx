"use client";

import * as React from "react";
import { Product } from "@/services/products.service";
import { buildProductGalleryItems, type ProductGalleryOpenPayload } from "@/utils/product-gallery";
import Breadcrumb from "./breadcrumb";
import ProductInfoBlock from "./product-info-block";
import ProductImagesBlock from "./product-images-block";
import ProductDescriptionBlock from "./product-description-block";
import RelatedProductsBlock from "./related-products-block";
import ProductImageLightbox from "./product-image-lightbox";

interface ProductDetailContentProps {
  product: Product;
}

export default function ProductDetailContent({ product }: ProductDetailContentProps) {
  const galleryItems = React.useMemo(() => buildProductGalleryItems(product), [product]);
  const [lightbox, setLightbox] = React.useState<ProductGalleryOpenPayload | null>(null);

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto max-w-[1180px] px-4 py-5">
        <Breadcrumb productName={product.name} />

        <ProductInfoBlock product={product} galleryItems={galleryItems} onOpenGallery={setLightbox} />

        <ProductImagesBlock images={product.images} galleryItems={galleryItems} onOpenGallery={setLightbox} />

        <ProductDescriptionBlock description={product.description} />

        <RelatedProductsBlock currentProductId={product.id} />
      </div>

      <ProductImageLightbox
        items={galleryItems}
        open={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={(nextIndex) =>
          setLightbox((previous) => (previous ? { ...previous, index: nextIndex } : null))
        }
      />
    </div>
  );
}
