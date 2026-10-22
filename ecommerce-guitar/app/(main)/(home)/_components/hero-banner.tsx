"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slide, slidesService } from "@/services/slides.service";
import SafeImage from "@/components/ui/safe-image";
import { cn } from "@/utils/cn";

function getWrappedSlide(slides: Slide[], index: number) {
  const slideCount = slides.length;
  return slides[(index + slideCount) % slideCount];
}

function HeroBannerSkeleton() {
  return (
    <section className="border-y border-[#d4bd94] bg-[#eeeeee]">
      <div className="mx-auto w-full max-w-[1920px] px-0 py-0 lg:px-0">
        <div className="px-3 py-3 lg:px-5">
          <div className="h-[220px] rounded-[6px] bg-[#ddd5c6] lg:h-[320px]" />
        </div>
      </div>
    </section>
  );
}

type BannerTripleFrameProps = {
  slides: Slide[];
  centerIndex: number;
  slideCount: number;
  onGoPrev: () => void;
  onGoNext: () => void;
  isActiveFrame: boolean;
};

function BannerTripleFrame({
  slides,
  centerIndex,
  slideCount,
  onGoPrev,
  onGoNext,
  isActiveFrame,
}: BannerTripleFrameProps) {
  const centerSlide = slides[centerIndex];
  const leftSlide = getWrappedSlide(slides, centerIndex - 1);
  const rightSlide = getWrappedSlide(slides, centerIndex + 1);

  return (
    <div className="grid gap-3 lg:grid-cols-[0.2fr_1fr_0.2fr] lg:items-stretch">
      {slideCount > 1 ? (
        <div className="relative hidden min-h-[240px] overflow-hidden rounded-[6px] bg-black lg:block lg:min-h-[320px]">
          <button
            type="button"
            className="absolute inset-0 z-[1] cursor-pointer"
            onClick={onGoPrev}
            aria-label="Show previous banner preview"
          >
            <SafeImage
              src={leftSlide.imageUrl}
              alt={leftSlide.title || "Previous banner preview"}
              fill
              sizes="(min-width: 1024px) 40vw, 0vw"
              quality={90}
              className="object-cover"
            />
          </button>
        </div>
      ) : null}

      <article className="relative min-h-[200px] overflow-hidden rounded-[6px] border border-[#d8c6a3] bg-black lg:min-h-[320px]">
        <div className="relative h-[200px] w-full lg:h-[320px]">
          <SafeImage
            src={centerSlide.imageUrl}
            alt={centerSlide.title || "Home banner"}
            fill
            sizes="100vw"
            className="object-cover"
            priority={isActiveFrame}
          />
          <Link
            href={centerSlide.linkUrl || "#"}
            target={centerSlide.linkUrl ? "_blank" : undefined}
            rel={centerSlide.linkUrl ? "noreferrer noopener" : undefined}
            className="absolute inset-0 z-[1] cursor-pointer"
            aria-label={centerSlide.title || "Open banner link"}
          />
        </div>
      </article>

      {slideCount > 1 ? (
        <div className="relative hidden min-h-[240px] overflow-hidden rounded-[6px] bg-black lg:block lg:min-h-[320px]">
          <button
            type="button"
            className="absolute inset-0 z-[1] cursor-pointer"
            onClick={onGoNext}
            aria-label="Show next banner preview"
          >
            <SafeImage
              src={rightSlide.imageUrl}
              alt={rightSlide.title || "Next banner preview"}
              fill
              sizes="(min-width: 1024px) 40vw, 0vw"
              quality={90}
              className="object-cover"
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["home-hero-slides"],
    queryFn: () => slidesService.getSlides(),
    staleTime: 1000 * 60 * 5,
  });

  const slides = data?.data ?? [];
  const slideCount = slides.length;

  React.useEffect(() => {
    if (slideCount <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % slideCount);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [slideCount]);

  if (isLoading || slides.length === 0) {
    return <HeroBannerSkeleton />;
  }

  const safeIndex = ((activeIndex % slideCount) + slideCount) % slideCount;

  const goPrev = () => {
    setActiveIndex((previous) => (previous - 1 + slideCount) % slideCount);
  };

  const goNext = () => {
    setActiveIndex((previous) => (previous + 1) % slideCount);
  };

  return (
    <section className="border-y border-[#d4bd94] bg-[#eeeeee]">
      <div className="relative mx-auto w-full max-w-[1920px]">
        <div className="px-3 py-3 lg:px-5">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-220 ease-out"
                style={{ transform: `translateX(-${safeIndex * 100}%)` }}
              >
                {slides.map((_, frameIndex) => (
                  <div key={slides[frameIndex].id} className="min-w-full shrink-0">
                    <BannerTripleFrame
                      slides={slides}
                      centerIndex={frameIndex}
                      slideCount={slideCount}
                      onGoPrev={goPrev}
                      onGoNext={goNext}
                      isActiveFrame={frameIndex === safeIndex}
                    />
                  </div>
                ))}
              </div>
            </div>

            {slideCount > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 z-20 hidden h-12 w-8 -translate-y-1/2 cursor-pointer items-center justify-center bg-black/55 text-white transition-colors hover:bg-black/70 lg:flex"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-4 top-1/2 z-20 hidden h-12 w-8 -translate-y-1/2 cursor-pointer items-center justify-center bg-black/55 text-white transition-colors hover:bg-black/70 lg:flex"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            ) : null}

            {slideCount > 1 ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "pointer-events-auto h-2.5 cursor-pointer rounded-full transition-all",
                      index === safeIndex ? "w-8 bg-[#bb9b69]" : "w-2.5 bg-[#bb9b69]/45",
                    )}
                    aria-label={`Go to hero slide ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
