import { Category, Product } from "@/services/products.service";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function normalizeCategoryText(category: Category) {
  return `${category.name} ${category.slug}`.toLowerCase();
}

export function findCategoryIdByKeywords(categories: Category[], keywords: string[]): string | undefined {
  return categories.find((category) =>
    keywords.some((keyword) => normalizeCategoryText(category).includes(keyword)),
  )?.id;
}

export function findCategoryIdByExactName(categories: Category[], expectedName: string): string | undefined {
  const normalizedExpectedName = expectedName.trim().toLowerCase();
  return categories.find((category) => category.name.trim().toLowerCase() === normalizedExpectedName)?.id;
}

export function getProductPrimaryImage(product: Product) {
  return product.thumbnail || product.images[0]?.url || "/home-slide-2.png";
}

export function formatProductPrice(price: string | number) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Inquire";
  }

  return `$${currencyFormatter.format(numericPrice)}`;
}
