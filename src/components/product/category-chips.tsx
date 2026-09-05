"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import type { Category } from "@/types";

export function CategoryChips({ categories }: { categories: Category[] }) {
  const [ref] = useEmblaCarousel({ align: "start", dragFree: true });
  const items = categories.filter((c) => !c.hidden && c.parentId == null).sort((a, b) => a.order - b.order);
  if (!items.length) return null;
  return (
    <div className="overflow-hidden md:hidden" ref={ref}>
      <div className="flex gap-2 pr-4">
        {items.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="shrink-0 border px-4 py-2.5 text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 hover:border-foreground"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
