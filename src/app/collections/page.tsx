"use client";

import Link from "next/link";
import { PageFade } from "@/components/ui/states";
import { ShopImage } from "@/components/media/shop-image";
import { Reveal } from "@/components/ui/reveal";
import { useShopStore } from "@/stores/shop-store";

export default function CollectionsPage() {
  const collections = useShopStore((s) => s.collections);
  return (
    <PageFade>
      <div className="border-b px-4 py-10 sm:px-8 sm:py-14">
        <p className="kicker">Collections</p>
        <h1 className="mt-2 font-display text-5xl sm:text-6xl">The season</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Edits from the atelier — festive, wedding, and what just arrived.</p>
      </div>
      <div className="grid gap-6 px-4 py-10 sm:px-8 md:grid-cols-2">
        {collections.map((collection, i) => (
          <Reveal key={collection.id} delay={Math.min(i, 6) * 0.06}>
            <Link href={`/collections/${collection.slug}`} className="group relative block min-h-80 overflow-hidden bg-muted">
              <ShopImage src={collection.image} alt="" fill width={1200} sizes="(max-width: 768px) 100vw, 50vw" className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-[11px] tracking-[0.2em] uppercase">{collection.season}</p>
                <h2 className="mt-1 font-display text-4xl">{collection.name}</h2>
                <p className="mt-2 max-w-md text-sm text-white/85">{collection.description}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </PageFade>
  );
}
