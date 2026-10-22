"use client";

import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "ABOUT GSI",
    links: ["Our story", "Foundation", "Frequently asked questions", "Contact / Schedule a visit"],
  },
  {
    title: "SHOP GUITARS",
    links: ["Classical Guitars", "Flamenco Guitars", "Accessories"],
  },
  {
    title: "SELL YOUR GUITAR",
    links: ["Auction", "Sell a guitar", "Marketplace"],
  },
  {
    title: "EXPAND A FAN",
    links: ["Video Platform", "Blog", "Terms & Conditions"],
  },
];

type SocialLink = {
  label: string;
  href: string;
  viewBox: string;
  pathD: string;
};

const socialLinks: SocialLink[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/guitarsalon/",
    viewBox: "0 0 320 512",
    pathD:
      "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/guitarsaloninternational/",
    viewBox: "0 0 448 512",
    pathD:
      "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.6 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
  },
  {
    label: "Twitter (X)",
    href: "https://x.com/guitarsalon",
    viewBox: "0 0 24 24",
    pathD:
      "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/c/Guitarsalon",
    viewBox: "0 0 24 24",
    pathD:
      "M23.498 6.186a2.997 2.997 0 0 0-2.11-2.12C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.389.521A2.997 2.997 0 0 0 .502 6.186 31.18 31.18 0 0 0 0 12a31.18 31.18 0 0 0 .502 5.814 2.997 2.997 0 0 0 2.109 2.12c1.884.52 9.389.52 9.389.52s7.505 0 9.389-.52a2.997 2.997 0 0 0 2.109-2.12A31.18 31.18 0 0 0 24 12a31.18 31.18 0 0 0-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@guitarsaloninternational",
    viewBox: "0 0 448 512",
    pathD:
      "M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z",
  },
];

function SocialIconSvg({ viewBox, pathD }: { viewBox: string; pathD: string }) {
  return (
    <svg
      viewBox={viewBox}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d={pathD} />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="home-black-band bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-[1180px] px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[320px_1fr]">
          <div>
            <Image src="/gsi-logo.svg" alt="GSI logo" width={480} height={266} className="h-[108px] w-auto" />
            <div className="mt-4 text-[12px] leading-6 text-[#bb9b69]">
              1455 39th Dr., Santa Barbara, California 90406
              <br />
              Phone: +1 (310) 206 0000
              <br />
              Toll free: +1 (888) 770 1944
              <div className="mt-3 flex flex-row flex-nowrap items-center gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="text-white transition-colors hover:text-white"
                  >
                    <SocialIconSvg viewBox={link.viewBox} pathD={link.pathD} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <div className="text-[11px] font-semibold text-[#bb9b69]">{column.title}</div>
                <div className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      className="block text-[12px] text-white transition-colors hover:text-[#bb9b69]"
                      onClick={(event) => event.preventDefault()}
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-[12px] text-white/60 sm:flex-row sm:justify-between">
          <span>2026 (c) Guitar Salon International</span>
          <span className="space-x-4">
            <Link
              href="#"
              className="transition-colors hover:text-white"
              onClick={(event) => event.preventDefault()}
            >
              terms & conditions
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-white"
              onClick={(event) => event.preventDefault()}
            >
              privacy policy
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
