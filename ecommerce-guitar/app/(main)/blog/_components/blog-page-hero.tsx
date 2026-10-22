import Image from "next/image";

interface BlogPageHeroProps {
  title?: string;
}

export function BlogPageHero({ title = "All Stories" }: BlogPageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/footer-bg-1920x940.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="relative mx-auto flex h-[130px] max-w-[1180px] items-center px-4 text-white">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight sm:text-[28px]">{title}</h1>
          <p className="mt-1 text-[11px] sm:text-[12px]">
            Enjoy discovering stories, culture, friends and being a part of our community
          </p>
        </div>
      </div>
    </section>
  );
}
