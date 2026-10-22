"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/services/products.service";
import { AuthContext } from "@/app/(main)/_context/AuthProvider";
import { galleryIndexForUrl, type GalleryItem, type ProductGalleryOpenPayload } from "@/utils/product-gallery";
import { formatProductPrice } from "@/utils/product-display";
import { useNotificationStore } from "@/stores/notification-store";
import { useUiStore } from "@/stores/ui-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart.service";
import SafeImage from "@/components/ui/safe-image";

interface ProductInfoBlockProps {
  product: Product;
  galleryItems: GalleryItem[];
  onOpenGallery: (payload: ProductGalleryOpenPayload) => void;
}

interface AttributeRow {
  name: string;
  value: string;
}

function formatAttributeValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.value === "string" || typeof record.value === "number" || typeof record.value === "boolean") {
      return String(record.value);
    }
  }

  return "";
}

function normalizeAttributes(attributes: unknown): AttributeRow[] {
  if (!attributes) {
    return [];
  }

  if (Array.isArray(attributes)) {
    return attributes
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        const record = item as Record<string, unknown>;
        const name = typeof record.key === "string" ? record.key : "";
        const value = formatAttributeValue(record.value);

        if (!name || !value) {
          return null;
        }

        return { name, value };
      })
      .filter((row): row is AttributeRow => row !== null);
  }

  if (typeof attributes === "object") {
    return Object.entries(attributes as Record<string, unknown>)
      .map(([name, value]) => ({
        name,
        value: formatAttributeValue(value),
      }))
      .filter((row) => row.name && row.value);
  }

  return [];
}

export default function ProductInfoBlock({ product, galleryItems, onOpenGallery }: ProductInfoBlockProps) {
  const router = useRouter();
  const { isAuthenticated } = use(AuthContext);
  const queryClient = useQueryClient();
  const addToast = useNotificationStore((state) => state.addToast);
  const setCartOpen = useUiStore((state) => state.setCartOpen);

  const { mutate: addToCart, isPending } = useMutation({
    mutationFn: () => cartService.addToCart(product.id, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      addToast(`${product.name} has been added to your cart`, "success");
      setCartOpen(true);
    },
    onError: () => {
      addToast("Failed to add product to cart", "error");
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      addToast("Please sign in to add items to your cart", "error");
      router.push("/auth/login");
      return;
    }
    if (product.stock <= 0) {
      addToast("Product is out of stock", "error");
      return;
    }
    addToCart();
  };

  const attributeRows = normalizeAttributes(product.attributes);

  const handleOpenMainImage = () => {
    onOpenGallery({
      index: galleryIndexForUrl(galleryItems, product.thumbnail),
      scale: "natural",
    });
  };

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-4">
      <div className="flex items-center justify-center px-0 py-2 lg:px-0 lg:py-2">
        <button
          type="button"
          onClick={handleOpenMainImage}
          className="relative block h-[620px] w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
          aria-label="Open full screen image gallery"
        >
          <SafeImage
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
          />
        </button>
      </div>

      <div className="flex flex-col justify-start space-y-3">
        <div className="text-[12px] uppercase tracking-[0.08em] text-[#b49564]">SKU: {product.sku}</div>

        <h1 className="text-[24px] font-bold leading-[1.12] text-black">{product.name}</h1>

        {attributeRows.length > 0 && (
          <div className="border-b border-[#dbdbdb]">
            {attributeRows.map((attribute, index) => (
              <div
                key={`${attribute.name}-${index}`}
                className={`grid grid-cols-[1fr_1.3fr] gap-3 py-1.5 ${index === 0 ? "" : "border-t border-[#dbdbdb]"}`}
              >
                <span className="text-[12px] font-bold capitalize text-black">{attribute.name}</span>
                <span className="text-[12px] text-black">{attribute.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="py-3">
          <p className="text-[24px] font-bold leading-none text-black">{formatProductPrice(product.price)}</p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isPending}
          className="w-full cursor-pointer bg-[#bb9b69] py-3 text-[13px] font-extrabold tracking-[0.06em] text-black transition-colors duration-300 hover:bg-[#a88a56] hover:text-white disabled:cursor-not-allowed disabled:bg-[#ccc]"
        >
          {isPending ? "ADDING..." : "ADD TO CART"}
        </button>

        <p className="text-[12px] text-[#888]">
          Applicable sales tax and shipping charges will be added at checkout.
        </p>
      </div>
    </section>
  );
}
