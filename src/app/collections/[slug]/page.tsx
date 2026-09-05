"use client";

import { use } from "react";
import { ListingView } from "@/components/product/listing-view";
import { EmptyState } from "@/components/ui/states";
import { useShopStore } from "@/stores/shop-store";

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const collections = useShopStore((s) => s.collections);
  const products = useShopStore((s) => s.products);
  const collection = collections.find((c) => c.slug === slug || c.id === slug);
  if (!collection) return <EmptyState title="Collection not found" body="This edit is no longer on the floor." />;
  const items = products.filter((p) => collection.productIds.includes(p.id));
  return (
    <ListingView
      kicker={collection.season || "Collection"}
      title={collection.name}
      description={collection.description}
      image={collection.image}
      products={items}
    />
  );
}
