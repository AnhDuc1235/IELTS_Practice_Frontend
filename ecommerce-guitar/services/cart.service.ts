import { httpClient } from "@/services/http-client";

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    thumbnail: string;
    price: string | number;
    stock: number;
  };
}

export interface CartResponse {
  message: string;
  data: {
    id: string;
    userId: string;
    cartItems: CartItem[];
    totalItems: number;
    totalPrice: number;
    totalUniqueItems: number;
  };
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const response = await httpClient.get("/cart");
    return response.data;
  },

  async addToCart(productId: string, quantity: number): Promise<CartResponse> {
    const response = await httpClient.post("/cart", { productId, quantity });
    return response.data;
  },

  async updateCart(productId: string, quantity: number): Promise<CartResponse> {
    const response = await httpClient.put(`/cart/${productId}`, { quantity });
    return response.data;
  },

  async removeFromCart(productId: string): Promise<CartResponse> {
    const response = await httpClient.delete(`/cart/${productId}`);
    return response.data;
  },
};