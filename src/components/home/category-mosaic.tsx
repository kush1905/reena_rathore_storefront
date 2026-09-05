"use client";

import Link from "next/link";
import { ShopImage } from "@/components/media/shop-image";
import { Reveal } from "@/components/ui/reveal";
import { MAIN_NAV } from "@/lib/navigation";

export type RangeTile = {
  id: string;
  label: string;
  href: string;
  image?: string;
};

export function CategoryMosaic({ items }: { items: RangeTile[] }) {
  const tiles = items.filter((item) => item.image).slice(0, 7);
  if (!tiles.length) return null;

  return (
    <section className="silhouette-strip relative overflow-hidden border-y border-border/60">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="silhouette-strip-veil absolute inset-0" />
        <div className="silhouette-strip-motif absolute inset-0" />
        <div className="silhouette-strip-grain absolute inset-0" />
        <MandalaCorner className="silhouette-corner silhouette-corner--tl max-sm:hidden" />
        <MandalaCorner className="silhouette-corner silhouette-corner--tr max-sm:hidden" flip="x" />
        <MandalaCorner className="silhouette-corner silhouette-corner--bl max-sm:hidden" flip="y" />
        <MandalaCorner className="silhouette-corner silhouette-corner--br max-sm:hidden" flip="xy" />
      </div>

      <div className="relative z-[1] mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8 sm:py-9 lg:flex-row lg:items-center lg:gap-10 lg:py-8">
        <Reveal className="shrink-0 lg:w-[12rem]">
          <p className="text-[10px] tracking-[0.3em] text-primary uppercase">Major selling range</p>
          <h2 className="mt-1.5 font-display text-2xl leading-tight text-ink sm:text-[1.65rem]">Shop by world</h2>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] tracking-[0.22em] text-muted-foreground uppercase">
            {MAIN_NAV.slice(0, 3).map((item) => (
              <Link key={item.href} href={item.href} className="py-1 transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </Reveal>

        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:px-0 md:grid-cols-7">
          {tiles.map((tile, i) => (
            <Reveal key={tile.id} delay={Math.min(i, 6) * 0.04} className="w-[42%] shrink-0 sm:w-auto">
              <Link href={tile.href} className="group block text-center">
                <span className="relative mx-auto block aspect-square w-full overflow-hidden rounded-full bg-[#d8cfc3] shadow-[0_6px_20px_rgba(40,28,18,0.08)] ring-1 ring-[color-mix(in_srgb,var(--ink)_10%,transparent)]">
                  <ShopImage
                    src={tile.image!}
                    alt={tile.label}
                    fill
                    width={280}
                    sizes="(max-width: 640px) 42vw, 10vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-[#1a120e]/0 transition-colors duration-500 group-hover:bg-[#1a120e]/12" />
                </span>
                <span className="mt-2.5 block line-clamp-2 font-display text-[0.85rem] leading-tight tracking-[0.06em] text-ink uppercase transition-colors duration-300 group-hover:text-primary sm:text-[0.95rem] sm:tracking-[0.08em]">
                  {tile.label}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MandalaCorner({ className, flip }: { className: string; flip?: "x" | "y" | "xy" }) {
  const transform =
    flip === "x" ? "scaleX(-1)" : flip === "y" ? "scaleY(-1)" : flip === "xy" ? "scale(-1)" : undefined;
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" style={transform ? { transform } : undefined}>
      <path d="M10 86V24c0-8 6-14 14-14h62" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="36" cy="36" r="18" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="36" cy="36" r="10" stroke="currentColor" strokeWidth="1" />
      <circle cx="36" cy="36" r="3" fill="currentColor" opacity="0.5" />
      <path
        d="M36 18c3 4 5 8 5 11s-2 7-5 11c-3-4-5-8-5-11s2-7 5-11z"
        stroke="currentColor"
        strokeWidth="0.95"
        opacity="0.85"
      />
      <path
        d="M36 18c3 4 5 8 5 11s-2 7-5 11c-3-4-5-8-5-11s2-7 5-11z"
        stroke="currentColor"
        strokeWidth="0.95"
        opacity="0.85"
        transform="rotate(90 36 36)"
      />
      <path
        d="M36 18c3 4 5 8 5 11s-2 7-5 11c-3-4-5-8-5-11s2-7 5-11z"
        stroke="currentColor"
        strokeWidth="0.95"
        opacity="0.85"
        transform="rotate(45 36 36)"
      />
      <path d="M62 14h24M14 62v24" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    </svg>
  );
}
