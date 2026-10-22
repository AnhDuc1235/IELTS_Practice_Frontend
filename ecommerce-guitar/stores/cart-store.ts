"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: string;
  quantity: number;
  thumbnail: string;
  stock: number;
  sku: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subTotal: number;
  total: number;
  
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  calculateTotals: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subTotal: 0,
      total: 0,

      addItem: (item: CartItem) => {
        const state = get();
        const existingItem = state.items.find((i) => i.productId === item.productId);
        
        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          updatedItems = [...state.items, item];
        }
        
        set({ items: updatedItems });
        get().calculateTotals();
      },

      updateQuantity: (productId: string, quantity: number) => {
        const state = get();
        const updatedItems = quantity <= 0
          ? state.items.filter((i) => i.productId !== productId)
          : state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            );
        
        set({ items: updatedItems });
        get().calculateTotals();
      },

      removeItem: (productId: string) => {
        const state = get();
        const updatedItems = state.items.filter((i) => i.productId !== productId);
        set({ items: updatedItems });
        get().calculateTotals();
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, subTotal: 0, total: 0 });
      },

      setItems: (items: CartItem[]) => {
        set({ items });
        get().calculateTotals();
      },

      calculateTotals: () => {
        const state = get();
        const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const subTotal = state.items.reduce((sum, item) => {
          const price = parseFloat(item.price.replace(/[$,]/g, ""));
          return sum + price * item.quantity;
        }, 0);
        
        set({
          totalItems,
          subTotal,
          total: subTotal,
        });
      },
    }),
    {
      name: "cart-storage",
      version: 1,
    }
  )
);
