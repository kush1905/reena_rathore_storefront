"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { CartItemThumb } from "@/components/cart/cart-item-thumb";
import { buttonClass } from "@/components/ui/button";
import { EmptyState, PageFade } from "@/components/ui/states";
import { useShopStore } from "@/stores/shop-store";

export default function CartPage() {
  const cart = useShopStore((s) => s.cart);
  const updateQty = useShopStore((s) => s.updateQty);
  const removeFromCart = useShopStore((s) => s.removeFromCart);
  const toggleWishlist = useShopStore((s) => s.toggleWishlist);
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 15000 || subtotal === 0 ? 0 : 450;
  const total = subtotal + shipping;

  if (!items.length) {
    return (
      <EmptyState
        title="Your bag is at rest"
        body="Nothing waiting yet. The atelier is open whenever you are."
        action={
          <Link href="/products" className={buttonClass("outline")}>
            Continue shopping
          </Link>
        }
      />
    );
  }

  return (
    <PageFade>
      <div className="grid gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="kicker">Bag</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Your pieces</h1>
          <ul className="mt-8 divide-y">
            {items.map((item) => (
              <li key={item.sku} className="flex gap-3 py-6 sm:gap-4">
                <CartItemThumb
                  productId={item.productId}
                  image={item.image}
                  title={item.title}
                  className="h-28 w-20 shrink-0 rounded-sm bg-muted sm:h-36 sm:w-28"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-display text-xl sm:text-2xl">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.color} · {item.size}
                  </p>
                  <p className="price mt-2">{formatCurrency(item.price)}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex items-center border">
                      <button
                        className="flex size-10 items-center justify-center"
                        aria-label="Decrease"
                        onClick={() => void updateQty(item.sku, Math.max(1, item.quantity - 1))}
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="flex size-10 items-center justify-center"
                        aria-label="Increase"
                        onClick={() => void updateQty(item.sku, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button className="min-h-10 text-xs tracking-[0.12em] uppercase underline underline-offset-4" onClick={() => void removeFromCart(item.sku)}>
                      Remove
                    </button>
                    <button className="min-h-10 text-xs tracking-[0.12em] uppercase underline underline-offset-4" onClick={() => void toggleWishlist(item.productId)}>
                      Move to wishlist
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <aside className="h-fit border bg-card p-5 sm:sticky sm:top-28 sm:p-6">
          <p className="text-[11px] tracking-[0.18em] uppercase">Summary</p>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="price">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Estimated shipping</dt>
              <dd>{shipping ? formatCurrency(shipping) : "Complimentary"}</dd>
            </div>
            <div className="flex justify-between border-t pt-2 font-medium">
              <dt>Total</dt>
              <dd className="price">{formatCurrency(total)}</dd>
            </div>
          </dl>
          <input className="mt-4 w-full border bg-transparent px-3 py-2.5 text-sm" placeholder="Promo code (demo)" />
          <Link href="/checkout" className={buttonClass("solid", "mt-4 w-full")}>
            Checkout
          </Link>
        </aside>
      </div>
    </PageFade>
  );
}
