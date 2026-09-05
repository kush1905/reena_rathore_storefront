"use client";

import { use, useEffect, useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Heart, X } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { attr, detailRows, isReadyToShip } from "@/lib/product-details";
import { ShopImage } from "@/components/media/shop-image";
import { ProductCarousel } from "@/components/product/product-carousel";
import { Button, buttonClass } from "@/components/ui/button";
import { EmptyState, PageFade } from "@/components/ui/states";
import { shopApi } from "@/lib/shop-api";
import { useShopStore } from "@/stores/shop-store";
import type { Review } from "@/types";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const products = useShopStore((s) => s.products);
  const collections = useShopStore((s) => s.collections);
  const addToCart = useShopStore((s) => s.addToCart);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const product = products.find((p) => p.slug === slug || p.id === slug);
  const wished = useShopStore((s) => (product ? s.isWished(product.id) : false));
  const [color, setColor] = useState(product?.colors[0]?.name ?? "");
  const [size, setSize] = useState(product?.sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [guide, setGuide] = useState(false);
  const [fulfillment, setFulfillment] = useState<"home_delivery" | "store_pickup">("home_delivery");
  const [reviews, setReviews] = useState<Review[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!product) return;
    setColor(product.colors[0]?.name ?? "");
    setSize(product.sizes[0] ?? "");
    setActive(0);
    void shopApi
      .reviews(product.id)
      .then(setReviews)
      .catch(() => setReviews([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  useEffect(() => {
    if (!zoom && !guide) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoom(false);
        setGuide(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, guide]);

  if (!product) {
    return (
      <EmptyState
        title="This piece is not available"
        body="It may have left the atelier, or the link is old."
        action={
          <Link href="/products" className={buttonClass("outline")}>
            Back to the shop
          </Link>
        }
      />
    );
  }

  const variant =
    product.variants.find((v) => v.color === color && v.size === size) ??
    product.variants.find((v) => v.size === size) ??
    product.variants[0];
  const stock = variant?.stock ?? 0;
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 8);
  const stockLabel = stock <= 0 ? "Out of stock" : stock <= 2 ? `Only ${stock} left` : "Available";
  const ready = isReadyToShip(product);
  const productionNote =
    attr(product, "Production note") ||
    (ready
      ? ""
      : "This is a made-to-order style. We take up to 60 business days for production and dispatch within India and internationally.");
  const details = detailRows(product);

  function add() {
    if (variant) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("rr_fulfillment", fulfillment);
      }
      void addToCart(variant.sku, qty, variant.size, variant.color);
    }
  }

  return (
    <PageFade>
      <div className="grid gap-10 px-4 py-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:grid-cols-2 lg:px-8 lg:py-12 lg:pb-12">
        <div>
          <button
            type="button"
            className="relative block aspect-[3/4] w-full overflow-hidden bg-muted"
            onClick={() => setZoom(true)}
            aria-label="Zoom image"
          >
            {product.images.map((image, i) => (
              <ShopImage
                key={image}
                src={image}
                alt={i === active ? product.title : ""}
                fill
                width={1400}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={i === 0}
                className={cn("absolute inset-0 transition-opacity duration-500 ease-out", i === active ? "opacity-100" : "opacity-0")}
              />
            ))}
            <span className="absolute right-3 bottom-3 bg-background/90 px-2 py-1 text-[10px] tracking-[0.16em] uppercase">Zoom</span>
          </button>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {product.images.map((image, i) => (
              <button
                key={image}
                type="button"
                aria-label={`View image ${i + 1}`}
                aria-pressed={i === active}
                className={cn("relative h-20 w-16 shrink-0 overflow-hidden", i === active && "ring-1 ring-foreground")}
                onClick={() => setActive(i)}
              >
                <ShopImage src={image} alt="" fill width={200} sizes="64px" />
              </button>
            ))}
          </div>
          {product.video ? (
            <video className="mt-4 aspect-video w-full object-cover" controls poster={product.images[0]} preload="metadata">
              <source src={product.video} />
            </video>
          ) : null}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="inline-flex border border-foreground/20 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase">
            {ready ? "Ready to ship" : "Made to order"}
          </div>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl">{product.title}</h1>
          <p className="price mt-4 text-lg">
            {formatCurrency(variant?.price ?? product.price)}
            {product.mrp > product.price ? (
              <span className="ml-2 text-muted-foreground line-through">{formatCurrency(product.mrp)}</span>
            ) : null}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">MRP inclusive of all taxes</p>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {product.description || product.shortDescription}
          </p>

          {product.colors.length > 0 ? (
            <div className="mt-8">
              <p className="text-[11px] tracking-[0.16em] uppercase">Colour · {color}</p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                    onClick={() => setColor(c.name)}
                    className={cn(
                      "size-10 rounded-full border transition duration-300 sm:size-8",
                      color === c.name ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "opacity-80 hover:opacity-100",
                    )}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {product.sizes.length > 0 ? (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-[0.16em] uppercase">Size · {size}</p>
                <button type="button" className="min-h-10 text-[11px] tracking-[0.14em] uppercase underline underline-offset-4" onClick={() => setGuide(true)}>
                  View size guide
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "min-w-12 border px-3 py-2 text-sm transition-colors duration-300",
                      size === s ? "bg-foreground text-background" : "hover:border-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <fieldset className="mt-6">
            <legend className="text-[11px] tracking-[0.16em] uppercase">Delivery</legend>
            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="fulfillment"
                  checked={fulfillment === "home_delivery"}
                  onChange={() => setFulfillment("home_delivery")}
                />
                Home delivery
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="fulfillment"
                  checked={fulfillment === "store_pickup"}
                  onChange={() => setFulfillment("store_pickup")}
                />
                Store pick-up
              </label>
            </div>
          </fieldset>

          <p className={cn("mt-4 text-sm", stock <= 0 ? "text-primary" : "text-muted-foreground")}>{stockLabel}</p>

          <div className="mt-6 hidden items-center gap-3 lg:flex">
            <Qty qty={qty} setQty={setQty} />
            <Button disabled={stock <= 0 || !variant} className="flex-1" onClick={add}>
              Add to cart
            </Button>
            <button type="button" className="border p-3" aria-label="Wishlist" aria-pressed={wished} onClick={() => void toggleWishlist(product.id)}>
              <Heart className={cn("size-4 transition-colors duration-300", wished && "fill-current text-primary")} />
            </button>
          </div>

          {productionNote ? <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{productionNote}</p> : null}

          <Link
            href="/collections/new-arrivals"
            className="mt-4 flex items-center justify-between gap-3 border border-foreground/20 px-4 py-3 text-sm transition-colors hover:border-foreground"
          >
            <span>Explore pieces shipping in 24 hours</span>
            <span aria-hidden>→</span>
          </Link>

          <div className="mt-10 divide-y border-y">
            <Accordion title="Product details" defaultOpen>
              {details.length ? (
                <dl className="grid gap-3 text-sm">
                  {details.map((row) => (
                    <div key={row.label} className="grid gap-1 sm:grid-cols-[10rem_1fr]">
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className="whitespace-pre-line">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">Detail fields will appear here once filled in admin.</p>
              )}
            </Accordion>
            <Accordion title="Contact our stylist">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Need help with sizing, blouse stitching, or pairing jewellery? Write to{" "}
                <a className="underline underline-offset-4" href="mailto:studio@reenarathore.com">
                  studio@reenarathore.com
                </a>{" "}
                or call{" "}
                <a className="underline underline-offset-4" href="tel:+919999313366">
                  +91 99993 13366
                </a>
                .
              </p>
            </Accordion>
            <Accordion title="Delivery & returns">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Ready-to-ship pieces leave the atelier within two to five working days. Store pick-up is available at the Mehrauli flagship.
                Ready-to-wear returns are accepted within seven days if unworn with tags attached. Bridal, made-to-order, and jewellery cannot
                be returned.
              </p>
            </Accordion>
            <Accordion title="Disclaimer">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Colour and embroidery may vary slightly from images due to lighting and the handmade nature of the craft. Measurements are
                approximate. Please read the production note before ordering made-to-order styles.
              </p>
            </Accordion>
          </div>

          {reviews.length ? (
            <div className="mt-10 border-t pt-8">
              <p className="text-[11px] tracking-[0.16em] uppercase">
                Reviews · {product.rating} ({product.reviewCount})
              </p>
              <div className="mt-4 grid gap-4">
                {reviews.map((review) => (
                  <blockquote key={review.id}>
                    <p className="font-medium">{review.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>
                    <p className="mt-2 text-[11px] tracking-[0.12em] uppercase">{review.customerName}</p>
                  </blockquote>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t bg-background px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <Qty qty={qty} setQty={setQty} />
        <div className="min-w-0 flex-1">
          <p className="price truncate text-xs">{formatCurrency(variant?.price ?? product.price)}</p>
          <Button disabled={stock <= 0 || !variant} className="mt-1 w-full py-2.5" onClick={add}>
            Add to cart
          </Button>
        </div>
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center border"
          aria-label="Wishlist"
          aria-pressed={wished}
          onClick={() => void toggleWishlist(product.id)}
        >
          <Heart className={cn("size-4", wished && "fill-current text-primary")} />
        </button>
      </div>

      {related.length ? (
        <section className="px-4 py-12 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:px-8 lg:pb-12">
          <h2 className="font-display text-3xl">You may also like</h2>
          <div className="mt-8">
            <ProductCarousel products={related} collections={collections} />
          </div>
        </section>
      ) : null}

      <AnimatePresence>
        {zoom ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <button type="button" className="absolute inset-0" aria-label="Close zoom" onClick={() => setZoom(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Zoomed product image"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="relative z-10 h-[85vh] w-full max-w-3xl"
            >
              <ShopImage src={product.images[active]} alt={product.title} fill width={1600} sizes="90vw" className="object-contain" />
              <button type="button" className="absolute top-2 right-2 text-white" aria-label="Close" onClick={() => setZoom(false)}>
                <X />
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {guide ? (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" className="absolute inset-0" aria-label="Close size guide" onClick={() => setGuide(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Size guide"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 max-w-md bg-background p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-3xl">Size guide</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Indian atelier sizing. If you are between sizes, take the larger. Bridal lehengas can be altered at the Mehrauli flagship.
              </p>
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="py-2">Size</th>
                    <th>Bust</th>
                    <th>Waist</th>
                  </tr>
                </thead>
                <tbody>
                  {["XS 32 24", "S 34 26", "M 36 28", "L 38 30", "XL 40 32"].map((row) => {
                    const [s, b, w] = row.split(" ");
                    return (
                      <tr key={s} className="border-t">
                        <td className="py-2">{s}</td>
                        <td>{b}</td>
                        <td>{w}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button type="button" className="mt-4 text-[11px] tracking-[0.16em] uppercase" onClick={() => setGuide(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PageFade>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-[11px] tracking-[0.2em] uppercase"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-300", open && "rotate-180")} />
      </button>
      {open ? (
        <div id={panelId} className="pb-5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function Qty({ qty, setQty }: { qty: number; setQty: (n: number) => void }) {
  return (
    <div className="flex items-center border">
      <button type="button" className="flex size-10 items-center justify-center sm:px-3 sm:py-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
        −
      </button>
      <span className="w-8 text-center text-sm">{qty}</span>
      <button type="button" className="flex size-10 items-center justify-center sm:px-3 sm:py-3" onClick={() => setQty(qty + 1)} aria-label="Increase">
        +
      </button>
    </div>
  );
}
