"use client";

import Link from "next/link";
import { ProductGrid } from "@/components/product/product-card";
import { buttonClass } from "@/components/ui/button";
import { EmptyState, PageFade } from "@/components/ui/states";
import { useShopStore } from "@/stores/shop-store";
import { useUiStore } from "@/stores/ui-store";

export default function WishlistPage() {
  const products = useShopStore((s) => s.products);
  const collections = useShopStore((s) => s.collections);
  const wishlist = useShopStore((s) => s.wishlist);
  const cart = useShopStore((s) => s.cart);
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const items = wishlist.map((w) => products.find((p) => p.id === w.productId)).filter(Boolean);
  const bagCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  if (!items.length) {
    return (
      <EmptyState
        title="Nothing saved yet"
        body="Heart a piece to keep it close. It will wait here."
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/products" className={buttonClass("outline")}>
              Browse the shop
            </Link>
            <button type="button" className={buttonClass("solid")} onClick={() => setCartOpen(true)}>
              View bag{bagCount ? ` (${bagCount})` : ""}
            </button>
          </div>
        }
      />
    );
  }

  return (
    <PageFade>
      <div className="border-b px-4 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Saved</p>
            <h1 className="mt-2 font-display text-5xl">Wishlist</h1>
            <p className="mt-2 text-sm text-muted-foreground">{items.length} saved pieces</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass("solid")} onClick={() => setCartOpen(true)}>
              View bag{bagCount ? ` (${bagCount})` : ""}
            </button>
            <Link href="/cart" className={buttonClass("outline")}>
              Go to cart
            </Link>
          </div>
        </div>
      </div>
      <div className="px-4 py-10 sm:px-8">
        <ProductGrid products={items as NonNullable<(typeof items)[number]>[]} collections={collections} />
      </div>
    </PageFade>
  );
}
