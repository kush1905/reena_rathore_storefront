"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ShopImage } from "@/components/media/shop-image";
import { Reveal } from "@/components/ui/reveal";
import { useShopStore } from "@/stores/shop-store";
import type { Collection, Product } from "@/types";

export function ProductCard({
  product,
  collections = [],
}: {
  product: Product;
  collections?: Collection[];
}) {
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const isWished = useShopStore((s) => s.isWished(product.id));
  const addToCart = useShopStore((s) => s.addToCart);
  const hover = product.images[1] ?? product.images[0];
  const inNew = collections.some((c) => c.slug === "new-arrivals" && c.productIds.includes(product.id));
  const inBest = collections.some((c) => c.slug === "best-sellers" && c.productIds.includes(product.id));
  const stock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const variant = product.variants.find((v) => v.stock > 0) ?? product.variants[0];

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-muted">
        <Link href={`/products/${product.slug}`} className="relative z-0 block aspect-[3/4]">
          <ShopImage
            src={product.images[0]}
            alt={product.title}
            fill
            width={800}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="product-card-image"
          />
          {hover && hover !== product.images[0] ? (
            <ShopImage
              src={hover}
              alt=""
              fill
              width={800}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            />
          ) : null}
        </Link>
        <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-col gap-1">
          {inNew ? <span className="bg-background/90 px-2 py-0.5 text-[10px] tracking-[0.16em] uppercase">New</span> : null}
          {inBest ? <span className="bg-primary px-2 py-0.5 text-[10px] tracking-[0.16em] text-primary-foreground uppercase">Bestseller</span> : null}
        </div>
        <button
          type="button"
          className={cn(
            "absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-background/90 transition-colors duration-300 hover:bg-background hover:text-primary",
            isWished && "text-primary",
          )}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWished}
          onClick={() => void toggleWishlist(product.id)}
        >
          <motion.span
            key={isWished ? "on" : "off"}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex"
          >
            <Heart className={cn("size-4 transition-colors duration-300", isWished && "fill-current")} />
          </motion.span>
        </button>
        {variant && stock > 0 ? (
          <button
            className="absolute inset-x-3 bottom-3 z-10 bg-background/95 py-2 text-center text-[11px] tracking-[0.18em] uppercase opacity-100 transition duration-300 ease-out md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            onClick={() => void addToCart(variant.sku, 1, variant.size, variant.color)}
          >
            Quick add
          </button>
        ) : (
          <span className="absolute inset-x-3 bottom-3 z-10 bg-background/95 py-2 text-center text-[11px] tracking-[0.18em] uppercase">
            Out of stock
          </span>
        )}
      </div>
      <div className="pt-3">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 font-display text-base leading-snug transition-colors duration-300 group-hover:text-primary sm:text-lg"
        >
          {product.title}
        </Link>
        <p className="price mt-1 text-sm">
          {formatCurrency(product.price)}
          {product.mrp > product.price ? (
            <span className="ml-2 text-muted-foreground line-through">{formatCurrency(product.mrp)}</span>
          ) : null}
        </p>
      </div>
    </article>
  );
}

export function ProductGrid({ products, collections, empty }: { products: Product[]; collections: Collection[]; empty?: ReactNode }) {
  if (!products.length) return empty ?? null;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <Reveal key={product.id} delay={Math.min(i, 8) * 0.05}>
          <ProductCard product={product} collections={collections} />
        </Reveal>
      ))}
    </div>
  );
}

export function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-muted" />
          <div className="mt-3 h-4 w-3/4 bg-muted" />
          <div className="mt-2 h-3 w-1/3 bg-muted" />
        </div>
      ))}
    </div>
  );
}
