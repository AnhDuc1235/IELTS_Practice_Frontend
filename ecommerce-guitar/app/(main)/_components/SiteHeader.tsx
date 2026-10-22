"use client";

import * as React from "react";
import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/app/(main)/_context/AuthProvider";
import { useUiStore } from "@/stores/ui-store";
import CartDrawer from "./cart-drawer";
import { cartService } from "@/services/cart.service";
import { productsService } from "@/services/products.service";
import { findCategoryIdByExactName } from "@/utils/product-display";

const storeCards = [
  { title: "Classical Guitars", img: "/1979-miguel-rodriguez-churchdoor-cd-csar-2-1-400x163.webp" },
  { title: "Flamenco Guitars", img: "/c-1912-manuel-ramirez-sp-cy-1-400x163.webp" },
];

function HeaderMegaMenu({
  isOpen,
  classicalCategoryId,
  flamencoCategoryId,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean;
  classicalCategoryId?: string;
  flamencoCategoryId?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="absolute inset-x-0 top-[calc(100%-16px)] z-50 border-x border-b border-[#ddd] bg-white text-black"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mx-auto max-w-[1180px] px-4 py-4">
        <div className="grid grid-cols-2 gap-6">
          {storeCards.map((card) => {
            const categoryId = card.title === "Classical Guitars" ? classicalCategoryId : flamencoCategoryId;
            const href = categoryId ? `/guitar-store?category=${categoryId}` : "/guitar-store";

            return (
              <Link key={card.title} href={href} className="block border-r border-[#ececec] pr-4 last:border-r-0">
                <div className="mx-auto mb-2 w-[78%] text-center text-[13px] font-bold">{card.title}</div>
                <div className="relative h-[88px] overflow-hidden">
                  <div className="relative mx-auto h-full w-[78%]">
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      sizes="(max-width: 1024px) 38vw, 420px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const { isAuthenticated } = use(AuthContext);
  const { cartOpen, setCartOpen } = useUiStore();
  const [isStoreTriggerHovered, setIsStoreTriggerHovered] = React.useState(false);
  const [isStoreDropdownHovered, setIsStoreDropdownHovered] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
  });
  const cartCount = cartData?.data?.totalItems || 0;

  const { data: categoriesResponse } = useQuery({
    queryKey: ["header-product-categories"],
    queryFn: () => productsService.getCategories(),
    staleTime: 1000 * 60 * 10,
  });

  const categories = categoriesResponse?.data ?? [];
  const classicalCategoryId = findCategoryIdByExactName(categories, "Classical Guitars");
  const flamencoCategoryId = findCategoryIdByExactName(categories, "Flamenco Guitars");
  const accessoriesCategoryId = findCategoryIdByExactName(categories, "Accessories");
  const isStoreMenuOpen = isStoreTriggerHovered || isStoreDropdownHovered;
  const classicalStoreHref = classicalCategoryId ? `/guitar-store?category=${classicalCategoryId}` : "/guitar-store";
  const flamencoStoreHref = flamencoCategoryId ? `/guitar-store?category=${flamencoCategoryId}` : "/guitar-store";
  const accessoriesHref = accessoriesCategoryId ? `/guitar-store?category=${accessoriesCategoryId}` : "/guitar-store";

  React.useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const handleCartClick = () => {
    setCartOpen(true);
  };

  return (
    <>
      <header className="relative border-b border-[#1a1a1a] bg-black text-white">
        <div className="flex h-6 items-center justify-center bg-[rgb(187,155,105)] text-[11px] font-semibold tracking-wide text-black">
          TRY ANY GUITAR WITH NO PURCHASE COMMITMENT
        </div>

        <div className="mx-auto flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
          <button
            type="button"
            aria-label="Open main menu"
            className="inline-flex h-9 w-9 items-center justify-center text-white hover:text-[rgb(187,155,105)]"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="block" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src="/logo-gsi-text.svg"
              alt="Guitar Salon International"
              width={618}
              height={92}
              className="h-7 w-auto sm:h-8"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link href={isAuthenticated ? "/account" : "/auth/login"} className="hover:text-[rgb(187,155,105)]">
              <UserRound size={19} />
            </Link>
            <button
              type="button"
              className="relative cursor-pointer hover:text-[rgb(187,155,105)]"
              onClick={handleCartClick}
              aria-label="Open cart sidebar"
            >
              <ShoppingCart size={19} />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[rgb(187,155,105)] px-1 text-[10px] font-semibold text-black">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="mx-auto hidden max-w-[1180px] px-4 pb-3 pt-4 lg:block">
          <div className="flex gap-4">
            <Link href="/" className="block shrink-0">
              <Image
                src="/logo-ico-gsi.svg"
                alt="GSI icon"
                width={54}
                height={116}
                className="h-[116px] w-auto"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div className="flex min-h-[52px] items-end justify-between">
                <Link href="/" className="block translate-y-[20px]">
                  <Image
                    src="/logo-gsi-text.svg"
                    alt="Guitar Salon International"
                    width={618}
                    height={92}
                    className="h-[35px] w-auto"
                  />
                </Link>

                <div className="hidden translate-y-[14px] items-center gap-5 text-[13px] font-semibold md:flex">
                  <Link href={isAuthenticated ? "/account" : "/auth/login"} className="hover:text-[rgb(187,155,105)]">
                    {isAuthenticated ? "Account" : "Sign In / Register"}
                  </Link>
                  <Link href="/cart" className="hover:text-[rgb(187,155,105)]">
                    Cart ({cartCount})
                  </Link>
                  <button
                    type="button"
                    className="cursor-pointer hover:text-[rgb(187,155,105)]"
                    onClick={handleCartClick}
                    aria-label="Open cart sidebar"
                  >
                    <ShoppingCart size={17} />
                  </button>
                  <Link href={isAuthenticated ? "/account" : "/auth/login"} className="hover:text-[rgb(187,155,105)]">
                    <UserRound size={17} />
                  </Link>
                </div>
              </div>

              <div className="flex min-h-[52px] translate-y-[7px] items-center gap-6 text-[12px] font-semibold">
                <div className="hidden items-center gap-6 lg:flex">
                  <button
                    type="button"
                    className={`group relative inline-flex items-center gap-0.5 transition-colors ${
                      isStoreMenuOpen ? "text-black" : "hover:text-black"
                    }`}
                    aria-expanded={isStoreMenuOpen}
                    onMouseEnter={() => setIsStoreTriggerHovered(true)}
                    onMouseLeave={() => setIsStoreTriggerHovered(false)}
                    onFocus={() => setIsStoreTriggerHovered(true)}
                    onBlur={() => setIsStoreTriggerHovered(false)}
                  >
                    <span
                      className={`pointer-events-none absolute inset-y-[-8px] left-[-12px] right-[-12px] z-0 ${
                        isStoreMenuOpen ? "bg-white" : "bg-transparent group-hover:bg-white"
                      }`}
                      aria-hidden="true"
                    />
                    {isStoreMenuOpen ? (
                      <span
                        className="absolute left-[-12px] right-[-12px] top-full z-10 h-4 bg-transparent"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="relative z-10">Guitar Store</span>
                    <ChevronDown size={10} className="relative z-10" />
                  </button>
                  <Link
                    href={accessoriesHref}
                    className="group relative inline-flex transition-colors hover:text-black"
                    onMouseEnter={() => {
                      setIsStoreTriggerHovered(false);
                      setIsStoreDropdownHovered(false);
                    }}
                    onFocus={() => {
                      setIsStoreTriggerHovered(false);
                      setIsStoreDropdownHovered(false);
                    }}
                  >
                    <span
                      className="pointer-events-none absolute inset-y-[-8px] left-[-12px] right-[-12px] z-0 bg-transparent transition-colors group-hover:bg-white"
                      aria-hidden="true"
                    />
                    <span className="relative z-10">Accessories</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="group relative inline-flex transition-colors hover:text-black"
                    onMouseEnter={() => {
                      setIsStoreTriggerHovered(false);
                      setIsStoreDropdownHovered(false);
                    }}
                  >
                    <span
                      className="pointer-events-none absolute inset-y-[-8px] left-[-12px] right-[-12px] z-0 bg-transparent transition-colors group-hover:bg-white"
                      aria-hidden="true"
                    />
                    <span className="relative z-10">Blog</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <HeaderMegaMenu
          isOpen={isStoreMenuOpen}
          classicalCategoryId={classicalCategoryId}
          flamencoCategoryId={flamencoCategoryId}
          onMouseEnter={() => setIsStoreDropdownHovered(true)}
          onMouseLeave={() => setIsStoreDropdownHovered(false)}
        />

        {mobileMenuOpen ? (
          <div className="fixed inset-0 z-[70] bg-black/60 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="h-full w-[86%] max-w-[360px] overflow-y-auto bg-[#1f2328] p-5 text-[#bb9b69]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-end">
                <button
                  type="button"
                  aria-label="Close main menu"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/35 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <nav className="space-y-4 text-[16px] font-semibold">
                <Link href={classicalStoreHref} className="block hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                  Guitar Store
                </Link>
                <Link href={classicalStoreHref} className="block hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                  Classical Guitars
                </Link>
                <Link href={flamencoStoreHref} className="block hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                  Flamenco Guitars
                </Link>
                <Link href={accessoriesHref} className="block hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                  Accessories
                </Link>
                <Link href="/blog" className="block hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                  Blog
                </Link>
                <Link
                  href={isAuthenticated ? "/account" : "/auth/login"}
                  className="block hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isAuthenticated ? "Account" : "Sign In / Register"}
                </Link>
                <Link href="/cart" className="block hover:text-white" onClick={() => setMobileMenuOpen(false)}>
                  Cart ({cartCount})
                </Link>
              </nav>
            </div>
          </div>
        ) : null}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
