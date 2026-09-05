"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { shopApi } from "@/lib/shop-api";
import { DEMO_CUSTOMER_ID } from "@/lib/utils";
import type { Cart, Category, Collection, Product, WishlistEntry } from "@/types";
import { useUiStore } from "@/stores/ui-store";

type ShopState = {
  customerId: string;
  categories: Category[];
  collections: Collection[];
  products: Product[];
  cart: Cart | null;
  wishlist: WishlistEntry[];
  ready: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addToCart: (sku: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateQty: (sku: string, quantity: number) => Promise<void>;
  removeFromCart: (sku: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWished: (productId: string) => boolean;
};

function readCustomerId() {
  if (typeof window === "undefined") return DEMO_CUSTOMER_ID;
  const stored = localStorage.getItem("reena-rathore-demo-customer");
  if (stored) return stored;
  localStorage.setItem("reena-rathore-demo-customer", DEMO_CUSTOMER_ID);
  return DEMO_CUSTOMER_ID;
}

export const useShopStore = create<ShopState>((set, get) => ({
  customerId: DEMO_CUSTOMER_ID,
  categories: [],
  collections: [],
  products: [],
  cart: null,
  wishlist: [],
  ready: false,
  error: null,
  refresh: async () => {
    const customerId = readCustomerId();
    try {
      const [categories, collections, products, cart, wishlist] = await Promise.all([
        shopApi.categories(),
        shopApi.collections(),
        shopApi.products(),
        shopApi.cart(customerId),
        shopApi.wishlist(customerId),
      ]);
      set({ customerId, categories, collections, products, cart, wishlist, ready: true, error: null });
    } catch (error) {
      set({
        ready: true,
        error: error instanceof Error ? error.message : "Unable to load the atelier",
      });
    }
  },
  addToCart: async (sku, quantity = 1, size, color) => {
    try {
      const cart = await shopApi.addToCart(get().customerId, { sku, quantity, size, color });
      set({ cart });
      toast.success("Added to bag");
      useUiStore.getState().setCartOpen(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add to bag");
      throw error;
    }
  },
  updateQty: async (sku, quantity) => {
    const previous = get().cart;
    if (previous) {
      set({
        cart: {
          ...previous,
          items: previous.items.map((item) => (item.sku === sku ? { ...item, quantity } : item)),
        },
      });
    }
    try {
      const cart = await shopApi.updateCart(get().customerId, sku, quantity);
      set({ cart });
    } catch (error) {
      if (previous) set({ cart: previous });
      toast.error(error instanceof Error ? error.message : "Could not update bag");
    }
  },
  removeFromCart: async (sku) => {
    const cart = await shopApi.removeCart(get().customerId, sku);
    set({ cart });
    toast.message("Removed from bag");
  },
  toggleWishlist: async (productId) => {
    const wished = get().wishlist.some((w) => w.productId === productId);
    if (wished) {
      await shopApi.removeWishlist(get().customerId, productId);
      set({ wishlist: get().wishlist.filter((w) => w.productId !== productId) });
      toast.message("Removed from wishlist");
    } else {
      const entry = await shopApi.addWishlist(get().customerId, productId);
      set({ wishlist: [entry, ...get().wishlist] });
      toast.success("Saved to wishlist");
    }
  },
  isWished: (productId) => get().wishlist.some((w) => w.productId === productId),
}));
