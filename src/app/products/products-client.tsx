"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { ProductGrid, ProductSkeleton } from "@/components/product/product-card";
import { CategoryChips } from "@/components/product/category-chips";
import { FilterDrawer, FilterSelect } from "@/components/product/filter-drawer";
import { EmptyState, PageFade } from "@/components/ui/states";
import { useShopStore } from "@/stores/shop-store";
import { useUiStore } from "@/stores/ui-store";
import { filterProducts } from "@/lib/catalog";

export default function ProductsClient() {
  const products = useShopStore((s) => s.products);
  const categories = useShopStore((s) => s.categories);
  const collections = useShopStore((s) => s.collections);
  const ready = useShopStore((s) => s.ready);
  const setFilterOpen = useUiStore((s) => s.setFilterOpen);
  const filterOpen = useUiStore((s) => s.filterOpen);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const filters = {
    q: params.get("q") ?? "",
    category: params.get("category") ?? "",
    collection: params.get("collection") ?? "",
    size: params.get("size") ?? "",
    color: params.get("color") ?? "",
    availability: params.get("availability") ?? "",
    sale: params.get("sale") ?? "",
    sort: params.get("sort") ?? "newest",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
  };

  const filtered = useMemo(
    () => filterProducts(products, categories, collections, filters),
    // filters is derived from the current search params
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, categories, collections, params],
  );

  const sizes = [...new Set(products.flatMap((p) => p.sizes))];
  const colors = [...new Set(products.flatMap((p) => p.colors.map((c) => c.name)))];
  const activeCount = ["q", "category", "collection", "size", "color", "availability"].filter(
    (key) => filters[key as keyof typeof filters],
  ).length;

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  function filterFields() {
    return (
      <>
        <FilterSelect label="Category" value={filters.category} onChange={(v) => setParam("category", v)} options={categories.map((c) => [c.slug, c.name] as [string, string])} />
        <FilterSelect label="Collection" value={filters.collection} onChange={(v) => setParam("collection", v)} options={collections.map((c) => [c.slug, c.name] as [string, string])} />
        <FilterSelect label="Size" value={filters.size} onChange={(v) => setParam("size", v)} options={sizes.map((s) => [s, s] as [string, string])} />
        <FilterSelect label="Colour" value={filters.color} onChange={(v) => setParam("color", v)} options={colors.map((c) => [c, c] as [string, string])} />
        <FilterSelect
          label="Availability"
          value={filters.availability}
          onChange={(v) => setParam("availability", v)}
          options={[
            ["in_stock", "In stock"],
            ["out_of_stock", "Out of stock"],
          ]}
        />
        <FilterSelect
          label="Sort"
          value={filters.sort}
          onChange={(v) => setParam("sort", v)}
          includeAll={false}
          options={[
            ["newest", "Newest"],
            ["price_asc", "Price · low"],
            ["price_desc", "Price · high"],
            ["title", "Name"],
          ]}
        />
      </>
    );
  }

  if (!ready) {
    return (
      <div className="px-4 py-10 sm:px-8">
        <ProductSkeleton />
      </div>
    );
  }

  return (
    <PageFade>
      <div className="border-b">
        <div className="px-4 py-10 sm:px-8 sm:py-14">
          <p className="kicker">{filters.sale === "1" ? "Offers" : "Catalogue"}</p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">{filters.sale === "1" ? "Sale" : "The shop"}</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {filters.sale === "1"
              ? "Pieces with a quieter price — still cut for the week."
              : "Silk, gota, and clothes made to hold a wedding week."}
          </p>
        </div>
      </div>
      <div className="px-4 py-6 sm:px-8">
        <div className="mb-6">
          <CategoryChips categories={categories} />
        </div>
        <div className="flex items-end justify-between gap-4 border-y py-5">
          <div className="hidden flex-wrap items-end gap-3 md:flex">{filterFields()}</div>
          <button
            className="flex min-h-11 items-center gap-2 px-1 text-[11px] tracking-[0.16em] uppercase md:hidden"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal className="size-4" />
            Filters{activeCount ? ` · ${activeCount}` : ""}
          </button>
          <p className="self-end pb-2.5 text-sm text-muted-foreground">{filtered.length} pieces</p>
        </div>
        <FilterDrawer>{filterFields()}</FilterDrawer>
        <div className="mt-8">
          <ProductGrid
            products={filtered}
            collections={collections}
            empty={<EmptyState title="No pieces match" body="Try another colour, size, or a quieter word." />}
          />
        </div>
      </div>
    </PageFade>
  );
}
