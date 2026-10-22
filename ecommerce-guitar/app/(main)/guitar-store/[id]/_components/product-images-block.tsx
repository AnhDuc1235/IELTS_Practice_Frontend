"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/services/products.service";
import SafeImage from "@/components/ui/safe-image";
import { galleryIndexForUrl, type GalleryItem, type ProductGalleryOpenPayload } from "@/utils/product-gallery";
import { cn } from "@/utils/cn";

interface ProductImagesBlockProps {
  images: ProductImage[];
  galleryItems: GalleryItem[];
  onOpenGallery: (payload: ProductGalleryOpenPayload) => void;
}

interface NormalizedImageItem {
  id: string;
  url: string;
}

function resolveImageUrl(image: unknown): string | null {
  if (!image || typeof image !== "object") {
    return null;
  }

  const record = image as Record<string, unknown>;

  if (typeof record.url === "string" && record.url) {
    return record.url;
  }

  if (typeof record.value === "string" && record.value) {
    return record.value;
  }

  return null;
}

export default function ProductImagesBlock({ images, galleryItems, onOpenGallery }: ProductImagesBlockProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const normalizedImages = React.useMemo<NormalizedImageItem[]>(() => {
    if (!Array.isArray(images)) {
      return [];
    }

    return images
      .map((image, index) => {
        const url = resolveImageUrl(image as unknown);
        if (!url) {
          return null;
        }

        const id = typeof image.id === "string" && image.id ? image.id : `image-${index}`;

        return { id, url };
      })
      .filter((item): item is NormalizedImageItem => item !== null);
  }, [images]);

  if (normalizedImages.length === 0) {
    return null;
  }

  const itemsPerView = 3;
  const maxStartIndex = Math.max(0, normalizedImages.length - itemsPerView);
  const canSlide = maxStartIndex > 0;

  React.useEffect(() => {
    setActiveIndex((previous) => Math.min(previous, maxStartIndex));
  }, [maxStartIndex]);

  const goToPrevious = () => {
    if (!canSlide) {
      return;
    }
    setActiveIndex((previous) => Math.max(0, previous - 1));
  };

  const goToNext = () => {
    if (!canSlide) {
      return;
    }
    setActiveIndex((previous) => Math.min(maxStartIndex, previous + 1));
  };

  return (
    <section className="mb-6 space-y-3 p-0">
      <div className="group/carousel relative flex items-center justify-center">
        {canSlide ? (
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-0 top-[40%] z-10 hidden h-14 w-8 cursor-pointer items-center justify-center bg-black/55 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100 lg:flex"
            aria-label="Show previous image"
          >
            <ChevronLeft size={20} />
          </button>
        ) : null}

        <div className="w-full overflow-hidden">
          <div
            className="flex gap-3 transition-transform duration-220 ease-out"
            style={{
              transform: `translateX(calc(-${activeIndex} * ((100% - 24px) / 3 + 12px)))`,
            }}
          >
            {normalizedImages.map((image) => (
              <div key={image.id} className="shrink-0 basis-[calc((100%-24px)/3)]">
                <button
                  type="button"
                  onClick={() =>
                    onOpenGallery({
                      index: galleryIndexForUrl(galleryItems, image.url),
                      scale: "expanded",
                    })
                  }
                  className="relative block w-full cursor-zoom-in overflow-hidden border-0 bg-transparent p-0"
                  aria-label="Open full screen image gallery"
                >
                  <SafeImage
                    src={image.url}
                    alt="Product image"
                    width={1200}
                    height={1200}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="block h-auto w-full"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {canSlide ? (
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-0 top-[40%] z-10 hidden h-14 w-8 cursor-pointer items-center justify-center bg-black/55 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100 lg:flex"
            aria-label="Show next image"
          >
            <ChevronRight size={20} />
          </button>
        ) : null}
      </div>

      {canSlide ? (
        <div className="flex justify-center gap-2">
          {Array.from({ length: maxStartIndex + 1 }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2 cursor-pointer rounded-full transition-all",
                index === activeIndex ? "w-6 bg-[#bb9b69]" : "w-2 bg-[#bb9b69]/45 hover:bg-[#bb9b69]/70",
              )}
              aria-label={`Go to image slide ${index + 1}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
