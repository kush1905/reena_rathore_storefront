import { api } from "./api";
import type { Address, Banner, Cart, Category, Collection, ContentPage, Customer, HomepageSection, Order, Product, Review, WishlistEntry } from "@/types";

export const shopApi = {
  products: (params = "") => apiList<Product>(`/products?public=1${params ? `&${params}` : ""}`),
  product: (id: string) => apiOne<Product>(`/products/${id}?public=1`),
  categories: () => apiList<Category>("/categories?public=1"),
  collections: () => apiList<Collection>("/collections?public=1"),
  collection: (id: string) => apiOne<Collection>(`/collections/${id}?public=1`),
  homepage: () => apiOne<HomepagePayload>("/homepage?public=1"),
  banners: () => apiList<Banner>("/banners?public=1"),
  reviews: (productId: string) => apiList<Review>(`/reviews?public=1&productId=${productId}`),
  customer: (customerId: string) => apiOne<Customer>(`/customers/${customerId}`),
  updateAddresses: (customerId: string, addresses: Address[]) =>
    apiOne<Customer>(`/customers/${customerId}/addresses`, {
      method: "PATCH",
      body: JSON.stringify({ addresses }),
    }),
  cart: (customerId: string) => apiOne<Cart>(`/cart/${customerId}`),
  addToCart: (customerId: string, body: { sku: string; quantity: number; size?: string; color?: string }) =>
    apiOne<Cart>(`/cart/${customerId}/items`, { method: "POST", body: JSON.stringify(body) }),
  updateCart: (customerId: string, sku: string, quantity: number) =>
    apiOne<Cart>(`/cart/${customerId}/items/${encodeURIComponent(sku)}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),
  removeCart: (customerId: string, sku: string) =>
    apiOne<Cart>(`/cart/${customerId}/items/${encodeURIComponent(sku)}`, { method: "DELETE" }),
  wishlist: (customerId: string) => apiList<WishlistEntry>(`/wishlist/${customerId}`),
  addWishlist: (customerId: string, productId: string) =>
    apiOne<WishlistEntry>(`/wishlist/${customerId}/items`, { method: "POST", body: JSON.stringify({ productId }) }),
  removeWishlist: (customerId: string, productId: string) =>
    apiOne<{ deleted: boolean }>(`/wishlist/${customerId}/items/${productId}`, { method: "DELETE" }),
  orders: (customerId: string) => apiList<Order>(`/orders?customerId=${customerId}`),
  order: (id: string) => apiOne<Order>(`/orders/${id}`),
  placeOrder: (body: unknown) => apiOne<Order>("/orders", { method: "POST", body: JSON.stringify(body) }),
};

export type HomepagePayload = {
  sections: HomepageSection[];
  resolved: {
    heroBanners: Banner[];
    featuredCollection: Collection | null;
    featuredProducts: Product[];
    newArrivals: Product[];
    bestsellers: Product[];
    showcase: Product[];
    editorialBanner: Banner | null;
    promoBanner: Banner | null;
    categories: Category[];
    video: { poster: string; url: string; title: string };
    testimonials: Review[];
    brandStory: ContentPage | null;
  };
};

async function apiList<T>(path: string, init?: RequestInit) {
  return api<T[]>(path, init);
}
async function apiOne<T>(path: string, init?: RequestInit) {
  return api<T>(path, init);
}
