"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import { findCategoryIdByExactName } from "@/utils/product-display";

const cards = [
  {
    title: "Explore our Guitar Store",
    description:
      "In our store we feature instruments crafted only by the very best guitar luthiers, who we believe build guitars to last - both in terms of musical quality and investment.",
    links: ["Classical Guitars", "Flamenco Guitars"],
    image: "/luigi-locatto-2-3-262x345.webp",
    alt: "Explore guitar store",
  },
  {
    title: "Get inspired",
    description:
      "Here you'll find a collection of guitars previously featured at GSI. Sometimes guitars from the museum make their way back to our store. Be notified of their return via our notification system!",
    links: ["Museum Guitars"],
    image: "/Collection18-262x345.webp",
    alt: "Get inspired collection",
  },
];

export default function FindDreamGuitarSection() {
  const { data: categoriesResponse } = useQuery({
    queryKey: ["dream-guitar-categories"],
    queryFn: () => productsService.getCategories(),
    staleTime: 1000 * 60 * 10,
  });

  const categories = categoriesResponse?.data ?? [];
  const classicalCategoryId = findCategoryIdByExactName(categories, "Classical Guitars");
  const flamencoCategoryId = findCategoryIdByExactName(categories, "Flamenco Guitars");

  const categoryLinkMap: Record<string, string> = {
    "Classical Guitars": classicalCategoryId ? `/guitar-store?category=${classicalCategoryId}` : "/guitar-store",
    "Flamenco Guitars": flamencoCategoryId ? `/guitar-store?category=${flamencoCategoryId}` : "/guitar-store",
    "Museum Guitars": "/guitar-store",
  };

  return (
    <section className="home-black-band home-black-band--double bg-black py-10 text-white lg:py-14">
      <div className="mx-auto w-full max-w-[1180px] px-4">
        <div className="text-center">
          <h2 className="text-[22px] font-semibold leading-tight lg:text-[24px]">Find Your Dream Guitar</h2>
          <p className="mt-2 text-[11px] text-white/65 lg:text-[12px]">
            You can test any guitar you want from the comfort of your own home no matter where you live.
          </p>
        </div>

        <div className="mt-8 grid w-full gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          {cards.map((card, cardIndex) => (
            <div key={card.title} className="w-full">
              <div className="grid w-full grid-cols-1 md:min-h-[360px] md:grid-cols-[minmax(0,55%)_minmax(0,1fr)] md:items-stretch">
                <div className="relative z-0 h-[240px] w-full bg-black md:min-h-[360px] md:h-full">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    className="object-contain object-center md:object-left"
                    sizes="(max-width: 768px) 100vw, 55vw"
                    priority={cardIndex === 0}
                  />
                </div>

                <div className="relative z-[1] flex w-full min-w-0 md:h-full md:items-center">
                  <div className="flex min-h-[240px] w-full max-w-full flex-col justify-center gap-4 bg-[#f7f7f7] p-6 text-left text-black md:h-[74%] md:max-h-[74%] md:min-h-0 md:overflow-y-auto md:-ml-[4.5rem] md:w-[calc(100%+4.5rem)] md:max-w-[420px] md:shrink-0 md:shadow-[4px_0_12px_rgba(0,0,0,0.08)] lg:-ml-[4.5rem]">
                    <h3 className="text-[19px] font-medium leading-tight text-[#bb9b69] lg:text-[20px]">{card.title}</h3>
                    <p className="break-words text-[12px] leading-relaxed text-black [overflow-wrap:anywhere] lg:text-[13px]">
                      {card.description}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {card.links.map((linkLabel) => (
                        <Link
                          key={linkLabel}
                          href={categoryLinkMap[linkLabel] ?? "/guitar-store"}
                          className="cursor-pointer border-b border-[#bdbdbd] pb-0.5 text-[13px] font-semibold text-black underline-offset-2 transition-colors hover:text-[#bb9b69]"
                        >
                          {linkLabel}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
