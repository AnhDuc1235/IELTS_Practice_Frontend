"use client";

import React from "react";

const reviews = [
  "Absolutely superb experience purchasing through GSI.",
  "I want to thank David Collett for making my visit outstanding.",
  "Came in yesterday looking to add to my collection.",
  "Best customer service experience I've ever had.",
  "The quality of guitars here is unmatched.",
  "Highly recommend to any guitarist serious about their craft.",
  "Professional and knowledgeable staff members.",
  "Great selection of instruments for every level.",
  "Worth every penny, excellent value.",
];

const REVIEWS_PER_SLIDE = 3;
const AUTO_SLIDE_INTERVAL_MS = 6000;
const MOBILE_BREAKPOINT_PX = 768;

export default function ReviewsSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [reviewsPerSlide, setReviewsPerSlide] = React.useState(REVIEWS_PER_SLIDE);

  React.useEffect(() => {
    const updateReviewsPerSlide = () => {
      setReviewsPerSlide(window.innerWidth < MOBILE_BREAKPOINT_PX ? 1 : REVIEWS_PER_SLIDE);
    };

    updateReviewsPerSlide();
    window.addEventListener("resize", updateReviewsPerSlide);

    return () => window.removeEventListener("resize", updateReviewsPerSlide);
  }, []);

  const totalSlides = Math.ceil(reviews.length / reviewsPerSlide);
  const startIdx = activeIndex * reviewsPerSlide;
  const slideReviews = reviews.slice(startIdx, startIdx + reviewsPerSlide);

  React.useEffect(() => {
    setActiveIndex((previous) => Math.min(previous, Math.max(0, totalSlides - 1)));
  }, [totalSlides]);

  React.useEffect(() => {
    if (totalSlides <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % totalSlides);
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [totalSlides]);

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-[1180px] px-4">
        <div className="text-center text-[34px] font-semibold">What are our customers saying?</div>

        <div className="mt-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {slideReviews.map((text, idx) => (
              <div key={idx} className="border border-[#dddddd] p-4 min-h-[120px]">
                <div className="text-[13px] text-[#444]">{text}</div>
              </div>
            ))}
          </div>

          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <div className="flex justify-center gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 cursor-pointer rounded-full transition-all ${
                      index === activeIndex
                        ? "w-8 bg-[#bb9b69]"
                        : "w-2.5 bg-[#bb9b69]/45 hover:bg-[#bb9b69]/70"
                    }`}
                    aria-label={`Go to review slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

