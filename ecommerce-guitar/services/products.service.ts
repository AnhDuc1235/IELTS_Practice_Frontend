import { httpClient } from "./http-client";

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  thumbnail: string;
  thumbnailPublicId: string;
  description: string;
  price: string;
  stock: number;
  isFeatured: boolean;
  categoryId: string;
  attributes: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: ProductImage[];
}

export interface ProductsResponse {
  message: string;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CategoriesResponse {
  message: string;
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ProductSort = "newest" | "oldest" | "price_desc" | "price_asc";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}

interface ApiProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "asc" | "desc";
  price?: "asc" | "desc";
}

function buildProductsQueryParams(params?: GetProductsParams): ApiProductsParams {
  if (!params) {
    return {};
  }

  const queryParams: ApiProductsParams = {
    page: params.page,
    limit: params.limit,
    search: params.search || undefined,
    category: params.category || undefined,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
  };

  switch (params.sort) {
    case "oldest":
      queryParams.sort = "asc";
      break;
    case "price_desc":
      queryParams.price = "desc";
      break;
    case "price_asc":
      queryParams.price = "asc";
      break;
    case "newest":
    default:
      queryParams.sort = "desc";
      break;
  }

  return queryParams;
}

export const productsService = {
  getProducts: async (params?: GetProductsParams): Promise<ProductsResponse> => {
    const response = await httpClient.get("/products", {
      params: buildProductsQueryParams(params),
    });
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await httpClient.get(`/products/${id}`);
      const product = response.data?.data;
      
      if (!product || typeof product !== "object" || !product.id) {
        throw new Error(`Product not found or invalid response for id: ${id}`);
      }
      
      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to fetch product: ${String(error)}`);
    }
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await httpClient.get("/category");
    return response.data;
  },
};
