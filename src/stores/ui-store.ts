"use client";

import { create } from "zustand";

type UiState = {
  cartOpen: boolean;
  filterOpen: boolean;
  menuOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setFilterOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  cartOpen: false,
  filterOpen: false,
  menuOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setFilterOpen: (filterOpen) => set({ filterOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));
