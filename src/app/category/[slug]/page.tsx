"use client";

import { use } from "react";
import { ListingView } from "@/components/product/listing-view";
import { descendantIds } from "@/lib/catalog";
import { EmptyState } from "@/components/ui/states";
import { useShopStore } from "@/stores/shop-store";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const categories = useShopStore((s) => s.categories);
  const products = useShopStore((s) => s.products);
  const ready = useShopStore((s) => s.ready);
  const error = useShopStore((s) => s.error);

  if (!ready) {
    return <EmptyState title="Loading aisle" body="Fetching the catalogue…" />;
  }
  if (error && !categories.length) {
    return <EmptyState title="Catalogue unavailable" body={error} />;
  }

  const category = categories.find((c) => c.slug === slug || c.id === slug);
  if (!category) return <EmptyState title="Category not found" body="This aisle is empty for now." />;
  const ids = new Set(descendantIds(categories, category.id));
  const items = products.filter((p) => ids.has(p.categoryId));
  const cover =
    (slug === "women"
      ? items.find((p) => p.slug === "champagne-reception-gown")?.images[0] ??
        items.find((p) => p.categoryId === "cat_gowns")?.images[0]
      : undefined) ?? items[0]?.images[0];
  return (
    <ListingView
      kicker="Category"
      title={category.name}
      image={cover}
      products={items}
    />
  );
}
