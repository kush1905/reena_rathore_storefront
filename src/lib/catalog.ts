import type { Category, Collection, Product } from "@/types";

export function descendantIds(categories: Category[], id: string): string[] {
  const ids = [id];
  for (const child of categories.filter((c) => c.parentId === id)) {
    ids.push(...descendantIds(categories, child.id));
  }
  return ids;
}

export function filterProducts(
  products: Product[],
  categories: Category[],
  collections: Collection[],
  filters: {
    q?: string;
    category?: string;
    collection?: string;
    size?: string;
    color?: string;
    availability?: string;
    sale?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  },
) {
  let items = [...products];
  if (filters.category && filters.category !== "all") {
    const cat = categories.find((c) => c.slug === filters.category || c.id === filters.category);
    if (cat) {
      const ids = new Set(descendantIds(categories, cat.id));
      items = items.filter((p) => ids.has(p.categoryId));
    }
  }
  if (filters.collection && filters.collection !== "all") {
    const col = collections.find((c) => c.slug === filters.collection || c.id === filters.collection);
    if (col) items = items.filter((p) => col.productIds.includes(p.id));
  }
  if (filters.sale === "1" || filters.sale === "true") {
    items = items.filter((p) => p.mrp > p.price);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        categories.find((c) => c.id === p.categoryId)?.name.toLowerCase().includes(q),
    );
  }
  if (filters.size && filters.size !== "all") items = items.filter((p) => p.sizes.includes(filters.size!));
  if (filters.color && filters.color !== "all") {
    items = items.filter((p) => p.colors.some((c) => c.name.toLowerCase() === filters.color!.toLowerCase()));
  }
  if (filters.availability === "in_stock") items = items.filter((p) => p.variants.some((v) => v.stock > 0));
  if (filters.availability === "out_of_stock") items = items.filter((p) => p.variants.every((v) => v.stock <= 0));
  const min = filters.minPrice ? Number(filters.minPrice) : undefined;
  const max = filters.maxPrice ? Number(filters.maxPrice) : undefined;
  if (min != null && !Number.isNaN(min)) items = items.filter((p) => p.price >= min);
  if (max != null && !Number.isNaN(max)) items = items.filter((p) => p.price <= max);
  const sort = filters.sort ?? "newest";
  items.sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "title") return a.title.localeCompare(b.title);
    return b.createdAt.localeCompare(a.createdAt);
  });
  return items;
}
