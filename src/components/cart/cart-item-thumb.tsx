"use client";

import { cn } from "@/lib/utils";
import { useShopStore } from "@/stores/shop-store";

/** Compact cart thumbnail — falls back to catalogue image when line item has none. */
export function CartItemThumb({
  productId,
  image,
  title,
  className,
}: {
  productId: string;
  image?: string;
  title: string;
  className?: string;
}) {
  const products = useShopStore((s) => s.products);
  const fromCatalog = products.find((p) => p.id === productId)?.images[0];
  const src = image || fromCatalog || "";

  if (!src) {
    return <div className={cn("shrink-0 bg-muted", className)} aria-hidden />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      className={cn("shrink-0 object-cover", className)}
      loading="lazy"
    />
  );
}
