/** Primary shop navigation + homepage major selling ranges */

export type NavItem = {
  label: string;
  href: string;
};

export const MAIN_NAV: NavItem[] = [
  { label: "Women", href: "/category/women" },
  { label: "Wedding", href: "/collections/wedding" },
  { label: "Jewelry", href: "/category/jewellery" },
  { label: "Accessories", href: "/category/accessories" },
  { label: "Gifting", href: "/collections/festive" },
  { label: "Discover", href: "/collections" },
  { label: "Sale", href: "/products?sale=1" },
];

/** Homepage “major selling range” tiles — order matches the nav story */
export const MAJOR_RANGES: {
  id: string;
  label: string;
  href: string;
  /** Prefer these category/collection slugs when resolving a cover image */
  imageFrom: { type: "category" | "collection"; slug: string }[];
  /** Optional product slug whose first image should win as the tile cover */
  preferProductSlug?: string;
}[] = [
  {
    id: "women",
    label: "Women",
    href: "/category/women",
    imageFrom: [
      { type: "category", slug: "gowns" },
      { type: "category", slug: "sarees" },
      { type: "category", slug: "lehenga-sets" },
    ],
    /** Prefer this product cover when present in the catalogue */
    preferProductSlug: "champagne-reception-gown",
  },
  {
    id: "wedding",
    label: "Wedding",
    href: "/collections/wedding",
    imageFrom: [
      { type: "collection", slug: "wedding" },
      { type: "category", slug: "lehenga-sets" },
    ],
  },
  {
    id: "jewelry",
    label: "Jewelry",
    href: "/category/jewellery",
    imageFrom: [
      { type: "category", slug: "jewellery" },
      { type: "category", slug: "earrings" },
      { type: "category", slug: "necklaces" },
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    href: "/category/accessories",
    imageFrom: [
      { type: "category", slug: "accessories" },
      { type: "category", slug: "bags" },
      { type: "category", slug: "shoes" },
    ],
  },
  {
    id: "gifting",
    label: "Gifting",
    href: "/collections/festive",
    imageFrom: [
      { type: "collection", slug: "festive" },
      { type: "category", slug: "bags" },
      { type: "category", slug: "jewellery" },
    ],
  },
  {
    id: "discover",
    label: "Discover",
    href: "/collections",
    imageFrom: [
      { type: "collection", slug: "editorial" },
      { type: "collection", slug: "new-arrivals" },
    ],
  },
  {
    id: "sale",
    label: "Sale",
    href: "/products?sale=1",
    imageFrom: [
      { type: "collection", slug: "best-sellers" },
      { type: "collection", slug: "summer" },
    ],
  },
];
