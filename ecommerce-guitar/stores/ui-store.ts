"use client";

import { create } from "zustand";

type UiState = {
  searchOpen: boolean;
  cartOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  setCartOpen: (v: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  searchOpen: false,
  cartOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
  setCartOpen: (v) => set({ cartOpen: v }),
}));
