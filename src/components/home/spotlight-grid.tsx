"use client";

import Link from "next/link";
import { ShopImage } from "@/components/media/shop-image";
import { Reveal } from "@/components/ui/reveal";
import { AtelierPanel } from "@/components/home/atelier-panel";

export function SpotlightGrid({
  items,
}: {
  items: { title: string; href: string; image: string; kicker?: string }[];
}) {
  if (!items.length) return null;

  return (
    <AtelierPanel tone="sand" corners contentClassName="pt-14 sm:pt-16">
      <Reveal>
        <div className="mb-10 px-4 text-center sm:px-8">
          <p className="text-[11px] tracking-[0.32em] text-primary uppercase">Curated</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">In the spotlight</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.href + item.title} delay={Math.min(i, 3) * 0.06}>
            <Link
              href={item.href}
              className="group relative block aspect-[4/5] overflow-hidden bg-muted sm:aspect-[5/4] lg:aspect-[16/11]"
            >
              <ShopImage
                src={item.image}
                alt={item.title}
                fill
                width={1400}
                sizes="(max-width: 640px) 100vw, 50vw"
                className="transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/65" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                {item.kicker ? (
                  <p className="text-[10px] tracking-[0.28em] uppercase text-white/70">{item.kicker}</p>
                ) : null}
                <h3 className="mt-2 font-display text-3xl tracking-[0.04em] uppercase sm:text-4xl">{item.title}</h3>
                <span className="mt-4 inline-block text-[11px] tracking-[0.24em] uppercase underline underline-offset-8">
                  Discover
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </AtelierPanel>
  );
}
