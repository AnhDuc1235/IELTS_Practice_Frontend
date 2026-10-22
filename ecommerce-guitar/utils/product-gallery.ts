import type { Product } from "@/services/products.service";

export interface GalleryItem {
  id: string;
  url: string;
}

export type ProductGalleryViewScale = "expanded" | "natural";

export type ProductGalleryOpenPayload = {
  index: number;
  scale: ProductGalleryViewScale;
};

export function buildProductGalleryItems(product: Product): GalleryItem[] {
  const seen = new Set<string>();
  const items: GalleryItem[] = [];

  const add = (id: string, url: string | undefined | null) => {
    if (!url || seen.has(url)) {
      return;
    }
    seen.add(url);
    items.push({ id, url });
  };

  add("thumbnail", product.thumbnail);

  if (Array.isArray(product.images)) {
    product.images.forEach((image, index) => {
      const url = typeof image?.url === "string" ? image.url : null;
      const id = typeof image?.id === "string" && image.id ? image.id : `image-${index}`;
      add(id, url);
    });
  }

  return items;
}

export function galleryIndexForUrl(items: GalleryItem[], url: string): number {
  const index = items.findIndex((item) => item.url === url);
  return index >= 0 ? index : 0;
}
