"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { CartItemThumb } from "@/components/cart/cart-item-thumb";
import { buttonClass } from "@/components/ui/button";
import { useShopStore } from "@/stores/shop-store";
import { useUiStore } from "@/stores/ui-store";

export function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen);
  const setOpen = useUiStore((s) => s.setCartOpen);
  const cart = useShopStore((s) => s.cart);
  const updateQty = useShopStore((s) => s.updateQty);
  const removeFromCart = useShopStore((s) => s.removeFromCart);
  const reduce = useReducedMotion();
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-ink/40" aria-label="Close bag" onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={reduce ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-y-0 right-0 flex w-[min(26rem,100vw)] flex-col bg-background"
          >
            <div className="flex items-center justify-between border-b px-5 py-3">
              <p className="font-display text-2xl">Bag</p>
              <button className="flex size-11 items-center justify-center" onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="font-display text-3xl">Your bag is at rest</p>
                <p className="mt-2 text-sm text-muted-foreground">Nothing waiting yet. The atelier is open.</p>
                <Link href="/products" className={buttonClass("solid", "mt-6")} onClick={() => setOpen(false)}>
                  Continue shopping
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5">
                  {items.map((item) => (
                    <li key={item.sku} className="flex gap-3 border-b py-4">
                      <CartItemThumb
                        productId={item.productId}
                        image={item.image}
                        title={item.title}
                        className="h-28 w-20 shrink-0 rounded-sm bg-muted"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-display text-lg leading-snug">{item.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.color} · {item.size}
                        </p>
                        <p className="price mt-1 text-sm">{formatCurrency(item.price)}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <div className="flex items-center border">
                            <button
                              className="flex size-10 items-center justify-center"
                              aria-label="Decrease"
                              onClick={() => void updateQty(item.sku, Math.max(1, item.quantity - 1))}
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              className="flex size-10 items-center justify-center"
                              aria-label="Increase"
                              onClick={() => void updateQty(item.sku, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="min-h-10 px-1 text-[11px] tracking-[0.14em] uppercase underline underline-offset-4"
                            onClick={() => void removeFromCart(item.sku)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="price">{formatCurrency(subtotal)}</span>
                  </div>
                  <Link href="/checkout" onClick={() => setOpen(false)} className={buttonClass("solid", "mt-4 w-full")}>
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="mt-3 block py-2 text-center text-[11px] tracking-[0.16em] uppercase underline underline-offset-4"
                  >
                    View bag
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
