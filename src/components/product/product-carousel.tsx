"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ProductCard } from "@/components/product/product-card";
import type { Collection, Product } from "@/types";

export function ProductCarousel({ products, collections }: { products: Product[]; collections: Collection[] }) {
  const [ref] = useEmblaCarousel({ align: "start", dragFree: true });
  if (!products.length) return null;
  return (
    <div className="overflow-hidden" ref={ref}>
      <div className="flex gap-4 pr-4 sm:gap-5 sm:pr-0">
        {products.map((product) => (
          <div key={product.id} className="min-w-0 shrink-0 basis-[72%] sm:basis-[42%] lg:basis-[24%]">
            <ProductCard product={product} collections={collections} />
          </div>
        ))}
      </div>
    </div>
  );
}
