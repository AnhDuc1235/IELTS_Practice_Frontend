"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, LayoutGrid, Play, X, ZoomIn } from "lucide-react";
import type { GalleryItem, ProductGalleryOpenPayload } from "@/utils/product-gallery";
import SafeImage from "@/components/ui/safe-image";
import { cn } from "@/utils/cn";

interface ProductImageLightboxProps {
  items: GalleryItem[];
  open: ProductGalleryOpenPayload | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ProductImageLightbox({
  items,
  open,
  onClose,
  onNavigate,
}: ProductImageLightboxProps) {
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [showGrid, setShowGrid] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const isOpen = open !== null;
  const index = open?.index ?? null;
  const viewScale = open?.scale ?? "expanded";
  const total = items.length;
  const safeIndex =
    isOpen && index !== null ? Math.min(Math.max(index, 0), Math.max(total - 1, 0)) : 0;
  const hasMultiple = total > 1;

  React.useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false);
      setShowGrid(false);
      setIsPlaying(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    setIsZoomed(false);
  }, [safeIndex]);

  React.useEffect(() => {
    if (!isOpen || !isPlaying || !hasMultiple) {
      return;
    }

    const timer = window.setInterval(() => {
      onNavigate((safeIndex + 1) % total);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [isOpen, isPlaying, hasMultiple, safeIndex, total, onNavigate]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const html = document.documentElement;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (scrollbarGap > 0) {
      document.body.style.paddingRight = `${scrollbarGap}px`;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (!hasMultiple) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onNavigate(safeIndex <= 0 ? total - 1 : safeIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNavigate(safeIndex >= total - 1 ? 0 : safeIndex + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, hasMultiple, onClose, onNavigate, safeIndex, total]);

  if (!open || total === 0) {
    return null;
  }

  const goPrev = () => {
    onNavigate(safeIndex <= 0 ? total - 1 : safeIndex - 1);
  };

  const goNext = () => {
    onNavigate(safeIndex >= total - 1 ? 0 : safeIndex + 1);
  };

  const togglePlay = () => {
    setIsPlaying((previous) => !previous);
  };

  const gridReserve = hasMultiple && showGrid ? "8.5rem" : "0px";
  const contentHeightExpanded = `calc(100dvh - ${gridReserve})`;
  const contentHeightNaturalBase = `calc(100svh - 4.25rem - ${gridReserve})`;
  const imageFrameStyle: React.CSSProperties =
    viewScale === "expanded"
      ? { maxHeight: contentHeightExpanded, maxWidth: "min(100vw, 100dvw)" }
      : {
          maxHeight: `min(${contentHeightNaturalBase}, 68svh)`,
          maxWidth: "min(calc(100svw - 2rem), 860px)",
        };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overscroll-none bg-black/80 text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Product image gallery"
      onClick={onClose}
    >
      <header
        className={cn(
          "z-40 flex items-center justify-between gap-4 px-4 py-3",
          viewScale === "expanded"
            ? "absolute inset-x-0 top-0 bg-black/45 backdrop-blur-[1px]"
            : "relative shrink-0",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {hasMultiple ? (
          <span className="text-[13px] font-medium tabular-nums">
            {safeIndex + 1} / {total}
          </span>
        ) : (
          <span className="text-[13px]" />
        )}

        <div className="flex items-center gap-4">
          {hasMultiple ? (
            <>
              <button
                type="button"
                onClick={() => setIsZoomed((previous) => !previous)}
                className="cursor-pointer p-1 opacity-90 transition-opacity hover:opacity-100"
                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              >
                <ZoomIn size={22} strokeWidth={1.75} />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className={cn(
                  "cursor-pointer p-1 opacity-90 transition-opacity hover:opacity-100",
                  isPlaying && "text-[#bb9b69]",
                )}
                aria-label={isPlaying ? "Stop slideshow" : "Start slideshow"}
              >
                <Play size={22} strokeWidth={1.75} />
              </button>

              <button
                type="button"
                onClick={() => setShowGrid((previous) => !previous)}
                className={cn(
                  "cursor-pointer p-1 opacity-90 transition-opacity hover:opacity-100",
                  showGrid && "text-[#bb9b69]",
                )}
                aria-label={showGrid ? "Hide thumbnail grid" : "Show thumbnail grid"}
              >
                <LayoutGrid size={22} strokeWidth={1.75} />
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1 opacity-90 transition-opacity hover:opacity-100"
            aria-label="Close gallery"
          >
            <X size={24} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {hasMultiple ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            className="absolute left-0 top-1/2 z-30 flex h-14 w-8 -translate-y-1/2 cursor-pointer items-center justify-center bg-black/55 text-white transition-opacity hover:bg-black/70"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
        ) : null}

        <div className="relative h-full min-h-0 w-full overflow-hidden">
          {items.map((item, itemIndex) => (
            <div
              key={item.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-[350ms] ease-in-out",
                itemIndex === safeIndex ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none",
              )}
              aria-hidden={itemIndex !== safeIndex}
              onClick={onClose}
            >
              <div
                className={cn(
                  "grid h-full min-h-0 w-full place-items-center overflow-hidden",
                  viewScale === "expanded" ? "p-0" : "px-4 py-5 sm:px-6 sm:py-6",
                )}
              >
                <div
                  onClick={(event) => event.stopPropagation()}
                  className={cn(
                    "relative box-border flex max-h-full max-w-full justify-center transition-transform duration-200 ease-out",
                    isZoomed && itemIndex === safeIndex && "scale-[1.35]",
                  )}
                  style={itemIndex === safeIndex ? imageFrameStyle : undefined}
                >
                  <SafeImage
                    src={item.url}
                    alt="Product image"
                    width={viewScale === "expanded" ? 8192 : 2400}
                    height={viewScale === "expanded" ? 8192 : 2400}
                    quality={viewScale === "expanded" ? 100 : 92}
                    className="h-auto w-auto max-h-full max-w-full object-contain"
                    sizes={viewScale === "expanded" ? "100vw" : "(max-width: 768px) 100vw, 860px"}
                    priority={itemIndex === safeIndex}
                  />

                  <div className="pointer-events-none absolute bottom-1 right-1 opacity-55 sm:bottom-2 sm:right-2">
                    <Image src="/gsi-logo.svg" alt="" width={40} height={16} className="h-auto w-10" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMultiple ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className="absolute right-0 top-1/2 z-30 flex h-14 w-8 -translate-y-1/2 cursor-pointer items-center justify-center bg-black/55 text-white transition-opacity hover:bg-black/70"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        ) : null}
      </div>

      {hasMultiple && showGrid ? (
        <footer
          className="relative z-30 shrink-0 border-t border-white/10 bg-black/40 px-4 py-3"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto flex max-w-[1180px] gap-2 overflow-x-auto pb-1">
            {items.map((item, thumbIndex) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(thumbIndex)}
                className={cn(
                  "relative h-16 w-20 shrink-0 overflow-hidden border-2 transition-colors",
                  thumbIndex === safeIndex ? "border-[#bb9b69]" : "border-transparent opacity-70 hover:opacity-100",
                )}
                aria-label={`Image ${thumbIndex + 1}`}
              >
                <SafeImage src={item.url} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </footer>
      ) : null}
    </div>
  );
}
