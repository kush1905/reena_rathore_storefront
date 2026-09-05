"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { shopApi, type HomepagePayload } from "@/lib/shop-api";
import { ProductCard, ProductSkeleton } from "@/components/product/product-card";
import { ProductCarousel } from "@/components/product/product-carousel";
import { HeroAtelier } from "@/components/home/hero-atelier";
import { CategoryMosaic } from "@/components/home/category-mosaic";
import { SpotlightGrid } from "@/components/home/spotlight-grid";
import { AtelierPanel } from "@/components/home/atelier-panel";
import { ShopImage } from "@/components/media/shop-image";
import { PageFade, ErrorState } from "@/components/ui/states";
import { Reveal } from "@/components/ui/reveal";
import { useShopStore } from "@/stores/shop-store";
import { descendantIds } from "@/lib/catalog";
import { MAJOR_RANGES } from "@/lib/navigation";
import type { Category, Collection, Product } from "@/types";

export default function HomePage() {
  const collections = useShopStore((s) => s.collections);
  const categories = useShopStore((s) => s.categories);
  const products = useShopStore((s) => s.products);
  const refreshFlag = useShopStore((s) => s.products.length);
  const [data, setData] = useState<HomepagePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setData(await shopApi.homepage());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load homepage");
    }
  }

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), 45000);
    return () => clearInterval(timer);
  }, [refreshFlag]);

  if (error && !data) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!data) {
    return (
      <div>
        <div className="h-dvh animate-pulse bg-muted" />
        <div className="px-4 py-16 sm:px-8">
          <ProductSkeleton />
        </div>
      </div>
    );
  }

  const { sections, resolved } = data;
  const visible = new Set(sections.filter((s) => s.visible).map((s) => s.type));
  const hero = resolved.heroBanners[0];
  const collection = resolved.featuredCollection;
  const catalog = categories.length ? categories : resolved.categories;
  const productPool =
    products.length > 0
      ? products
      : [...resolved.featuredProducts, ...resolved.newArrivals, ...resolved.showcase, ...resolved.bestsellers];
  const crimson =
    productPool.find((p) => p.slug === "royal-crimson-heritage-lehenga" || p.id === "prd_04") ??
    resolved.featuredProducts.find((p) => p.id === "prd_04") ??
    resolved.newArrivals.find((p) => p.id === "prd_04");
  const featured = pinFront(
    resolved.featuredProducts.slice(0, 8),
    crimson,
  );
  const newArrivals = pinFront(resolved.newArrivals, crimson);
  const collectionPool = collections.length ? collections : [];
  const categoryTiles = MAJOR_RANGES.map((range) => ({
    id: range.id,
    label: range.label,
    href: range.href,
    image:
      (range.preferProductSlug
        ? productPool.find((p) => p.slug === range.preferProductSlug)?.images[0]
        : undefined) ??
      rangeCoverImage(range.imageFrom, productPool, catalog, collectionPool, featured),
  }));

  const spotlight = [
    resolved.editorialBanner
      ? {
          title: resolved.editorialBanner.title,
          href: resolved.editorialBanner.destination,
          image: resolved.editorialBanner.desktopImage,
          kicker: "Editorial",
        }
      : null,
    {
      title: "The cocktail edit",
      href: "/collections/festive",
      image: featured[1]?.images[0] ?? collection?.image ?? "",
      kicker: "Occasion",
    },
    {
      title: "Accessories",
      href: "/collections/accessories",
      image: resolved.promoBanner?.desktopImage ?? featured[2]?.images[0] ?? "",
      kicker: "Details",
    },
    {
      title: "Bridal reds",
      href: "/collections/wedding",
      image: crimson?.images[0] ?? resolved.showcase[0]?.images[0] ?? featured[0]?.images[0] ?? "",
      kicker: "Wedding",
    },
  ].filter((item): item is NonNullable<typeof item> => Boolean(item?.image));

  const explore = [
    {
      title: "In the press",
      href: "/collections/editorial",
      image: resolved.editorialBanner?.desktopImage ?? featured[0]?.images[0],
    },
    {
      title: "Runway",
      href: "/collections/new-arrivals",
      image: newArrivals[0]?.images[0] ?? featured[1]?.images[0],
    },
    {
      title: "Sustaining crafts",
      href: "/collections",
      image: resolved.video.poster || collection?.image || featured[2]?.images[0],
    },
  ].filter((item): item is { title: string; href: string; image: string } => Boolean(item.image));

  const midBanner = {
    title: "Royal Crimson Heritage Lehenga",
    subtitle: "Silver sequin embroidery on deep crimson silk — bridal couture, just arrived.",
    href: "/products/royal-crimson-heritage-lehenga",
    cta: "Shop the piece",
    image: crimson?.images[0] ?? featured[0]?.images[0] ?? "",
  };

  return (
    <PageFade>
      {visible.has("hero") ? <HeroAtelier banner={hero} /> : null}

      {visible.has("categories") ? <CategoryMosaic items={categoryTiles} /> : null}

      {midBanner ? (
        <section className="relative min-h-[52vh] overflow-hidden sm:min-h-[62vh]">
          <ShopImage src={midBanner.image} alt="" fill width={1920} sizes="100vw" />
          <div className="absolute inset-0 bg-black/35" />
          <Reveal className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white sm:px-6">
            <p className="text-[11px] tracking-[0.32em] uppercase text-accent">Campaign</p>
            <h2 className="mt-3 font-display text-3xl text-balance sm:mt-4 sm:text-5xl lg:text-7xl">{midBanner.title}</h2>
            <p className="mt-3 max-w-md text-sm text-white/80 sm:mt-4 sm:text-base">{midBanner.subtitle}</p>
            <Link
              href={midBanner.href}
              className="mt-6 border border-white/60 px-6 py-3 text-[11px] tracking-[0.28em] uppercase transition-colors hover:bg-white hover:text-ink sm:mt-8 sm:px-8"
            >
              {midBanner.cta}
            </Link>
          </Reveal>
        </section>
      ) : null}

      {visible.has("featured_collection") && featured.length ? (
        <AtelierPanel tone="linen" contentClassName="px-4 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] tracking-[0.32em] text-primary uppercase">Featured</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl">
                {collection?.name ?? "Shop the collection"}
              </h2>
              {collection?.description ? (
                <p className="mt-4 text-muted-foreground">{collection.description}</p>
              ) : null}
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {featured.map((product, i) => (
                <Reveal key={product.id} delay={Math.min(i, 6) * 0.04}>
                  <ProductCard product={product} collections={collections} />
                </Reveal>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href={`/collections/${collection?.slug ?? "festive"}`}
                className="text-[11px] tracking-[0.28em] uppercase underline underline-offset-8"
              >
                Shop the collection
              </Link>
            </div>
          </Reveal>
        </AtelierPanel>
      ) : null}

      {visible.has("editorial") || visible.has("showcase") ? (
        <SpotlightGrid items={spotlight.slice(0, 4)} />
      ) : null}

      {visible.has("new_arrivals") && newArrivals.length ? (
        <AtelierPanel tone="petal" contentClassName="px-4 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <p className="text-[11px] tracking-[0.32em] text-primary uppercase">Just in</p>
                <h2 className="mt-2 font-display text-3xl sm:text-5xl">New arrivals</h2>
              </div>
              <Link href="/collections/new-arrivals" className="inline-flex min-h-10 items-center text-[11px] tracking-[0.22em] uppercase underline underline-offset-8">
                View all
              </Link>
            </div>
            <div className="mt-10">
              <ProductCarousel products={newArrivals} collections={collections} />
            </div>
          </Reveal>
        </AtelierPanel>
      ) : null}

      {visible.has("editorial") && resolved.editorialBanner ? (
        <section className="relative min-h-[56vh] overflow-hidden sm:min-h-[78vh]">
          <ShopImage
            src={resolved.editorialBanner.mobileImage || resolved.editorialBanner.desktopImage}
            alt=""
            fill
            width={1920}
            sizes="100vw"
            className="md:hidden"
          />
          <ShopImage
            src={resolved.editorialBanner.desktopImage}
            alt=""
            fill
            width={1920}
            sizes="100vw"
            className="hidden md:block"
          />
          <div className="absolute inset-0 bg-black/40" />
          <Reveal className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white sm:px-6">
            <h2 className="max-w-3xl font-display text-3xl text-balance sm:text-5xl lg:text-7xl">{resolved.editorialBanner.title}</h2>
            <p className="mt-4 max-w-lg text-sm text-white/85 sm:mt-5 sm:text-lg">{resolved.editorialBanner.subtitle}</p>
            <Link
              href={resolved.editorialBanner.destination}
              className="mt-8 border border-white/60 px-6 py-3 text-[11px] tracking-[0.28em] uppercase transition-colors hover:bg-white hover:text-ink sm:mt-10 sm:px-8"
            >
              {resolved.editorialBanner.cta || "Discover"}
            </Link>
          </Reveal>
        </section>
      ) : null}

      {visible.has("video") || visible.has("social") ? (
        <AtelierPanel tone="jaali" contentClassName="px-4 py-12 sm:px-8 sm:py-16">
          <Reveal>
            <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
              <div className="text-center lg:text-left">
                <p className="text-[11px] tracking-[0.32em] text-primary uppercase">The house</p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl">
                  {resolved.brandStory?.title ?? resolved.video.title}
                </h2>
                <p className="mt-4 max-w-md whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0 mx-auto">
                  {resolved.brandStory?.body ??
                    "An Indian atelier for silk, gota, and clothes made to hold a wedding week."}
                </p>
              </div>
              {resolved.video.url || resolved.video.poster ? (
                <div className="overflow-hidden bg-muted ring-1 ring-[color-mix(in_srgb,var(--accent)_25%,transparent)]">
                  {resolved.video.url ? (
                    <video className="aspect-video w-full object-cover" poster={resolved.video.poster} controls preload="metadata">
                      <source src={resolved.video.url} />
                    </video>
                  ) : (
                    <div className="relative aspect-video">
                      <ShopImage src={resolved.video.poster} alt="" fill width={1200} sizes="(max-width: 1024px) 100vw, 50vw" />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </Reveal>
        </AtelierPanel>
      ) : null}

      {explore.length ? (
        <AtelierPanel tone="vine" contentClassName="pt-14 sm:pt-16">
          <Reveal>
            <div className="mb-10 px-4 text-center sm:px-8">
              <p className="text-[11px] tracking-[0.32em] text-primary uppercase">Discover</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">More to explore</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {explore.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <Link href={item.href} className="group relative block aspect-[4/5] overflow-hidden bg-muted md:aspect-[3/4]">
                  <ShopImage
                    src={item.image}
                    alt={item.title}
                    fill
                    width={1100}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/45" />
                  <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                    <h3 className="font-display text-3xl tracking-[0.06em] text-white uppercase">{item.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </AtelierPanel>
      ) : null}

      {visible.has("testimonials") && resolved.testimonials.length ? (
        <AtelierPanel tone="lotus" contentClassName="px-4 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] tracking-[0.32em] text-primary uppercase">From the atelier books</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Notes from clients</h2>
            </div>
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {resolved.testimonials.map((review) => (
                <blockquote key={review.id} className="text-center md:text-left">
                  <p className="font-display text-2xl leading-snug">“{review.title}”</p>
                  <p className="mt-3 text-sm text-muted-foreground">{review.body}</p>
                  <p className="mt-4 text-[11px] tracking-[0.16em] uppercase">{review.customerName}</p>
                </blockquote>
              ))}
            </div>
          </Reveal>
        </AtelierPanel>
      ) : null}

      {resolved.bestsellers.length ? (
        <AtelierPanel tone="sand" corner="crest" contentClassName="px-4 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <p className="text-[11px] tracking-[0.32em] text-primary uppercase">Atelier favourites</p>
                <h2 className="mt-2 font-display text-3xl sm:text-5xl">Best sellers</h2>
              </div>
              <Link href="/collections/best-sellers" className="inline-flex min-h-10 items-center text-[11px] tracking-[0.22em] uppercase underline underline-offset-8">
                View all
              </Link>
            </div>
            <div className="mt-10">
              <ProductCarousel products={resolved.bestsellers} collections={collections} />
            </div>
          </Reveal>
        </AtelierPanel>
      ) : null}
    </PageFade>
  );
}

function pinFront(list: Product[], item?: Product) {
  if (!item) return list;
  return [item, ...list.filter((p) => p.id !== item.id)];
}

function rangeCoverImage(
  sources: { type: "category" | "collection"; slug: string }[],
  products: Product[],
  categories: Category[],
  collections: Collection[],
  featured: Product[],
) {
  for (const source of sources) {
    if (source.type === "collection") {
      const col = collections.find((c) => c.slug === source.slug);
      if (col?.image) return col.image;
      const fromProducts = col?.productIds
        .map((id) => products.find((p) => p.id === id)?.images[0])
        .find(Boolean);
      if (fromProducts) return fromProducts;
      continue;
    }
    const category = categories.find((c) => c.slug === source.slug);
    if (!category) continue;
    const ids = new Set(descendantIds(categories, category.id));
    const hit =
      products.find((p) => ids.has(p.categoryId))?.images[0] ??
      products.find((p) => p.categoryId === category.id)?.images[0];
    if (hit) return hit;
  }
  return featured[0]?.images[0] ?? products[0]?.images[0];
}
