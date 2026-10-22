"use server";

import { SERVER_API } from "@/utils/env";
import { Product } from "@/services/products.service";

export async function fetchProductById(id: string): Promise<Product> {
  try {
    const response = await fetch(`${SERVER_API}/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const product = data?.data;

    if (!product || typeof product !== "object" || !product.id) {
      throw new Error(`Invalid product response for id: ${id}`);
    }

    return product;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Server] Error fetching product ${id}:`, message);
    throw error;
  }
}
