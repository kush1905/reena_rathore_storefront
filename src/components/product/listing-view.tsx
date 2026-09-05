"use client";

import { ProductGrid } from "@/components/product/product-card";
import { ShopImage } from "@/components/media/shop-image";
import { EmptyState, PageFade } from "@/components/ui/states";
import { useShopStore } from "@/stores/shop-store";
import type { Product } from "@/types";

export function ListingView({
  title,
  kicker,
  products,
  description,
  image,
}: {
  title: string;
  kicker: string;
  products: Product[];
  description?: string;
  image?: string;
}) {
  const collections = useShopStore((s) => s.collections);
  return (
    <PageFade>
      {image ? (
        <div className="relative h-[38vh] min-h-56 overflow-hidden bg-muted">
          <ShopImage src={image} alt="" fill width={1920} sizes="100vw" priority />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 bottom-0 px-4 py-8 text-white sm:px-8">
            <p className="text-[11px] tracking-[0.24em] uppercase">{kicker}</p>
            <h1 className="mt-2 font-display text-5xl sm:text-6xl">{title}</h1>
            {description ? <p className="mt-3 max-w-xl text-sm text-white/80">{description}</p> : null}
          </div>
        </div>
      ) : (
        <div className="border-b px-4 py-10 sm:px-8 sm:py-14">
          <p className="kicker">{kicker}</p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">{title}</h1>
          {description ? <p className="mt-3 max-w-xl text-muted-foreground">{description}</p> : null}
        </div>
      )}
      <div className="px-4 py-10 sm:px-8">
        <p className="text-sm text-muted-foreground">{products.length} pieces</p>
        <div className="mt-8">
          <ProductGrid
            products={products}
            collections={collections}
            empty={<EmptyState title="Nothing here yet" body="This edit is being dressed. Look through the shop in the meantime." />}
          />
        </div>
      </div>
    </PageFade>
  );
}
