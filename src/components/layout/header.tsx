"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "@/components/ui/nav-link";
import { MAIN_NAV } from "@/lib/navigation";
import { useShopStore } from "@/stores/shop-store";
import { useUiStore } from "@/stores/ui-store";

export const NAV = MAIN_NAV;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const cart = useShopStore((s) => s.cart);
  const refresh = useShopStore((s) => s.refresh);
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const setMenuOpen = useUiStore((s) => s.setMenuOpen);
  const [open, setOpenState] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  function setOpen(next: boolean) {
    setOpenState(next);
    setMenuOpen(next);
  }

  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    return () => setMenuOpen(false);
  }, [setMenuOpen]);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const sync = () => {
      document.documentElement.style.setProperty("--header-h", `${node.offsetHeight}px`);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="relative z-40 text-foreground">
      <div className="flex items-center justify-between gap-3 bg-ink px-4 py-2 text-[10px] tracking-[0.18em] text-[#f0e6d8] uppercase sm:px-8 sm:tracking-[0.22em]">
        <p className="truncate">Complimentary shipping above ₹15,000 · Atelier appointments in Mehrauli</p>
        <button
          className="hidden shrink-0 text-accent underline-offset-4 hover:underline md:block"
          onClick={() => {
            void refresh();
            toast.message("Catalogue refreshed");
          }}
        >
          Refresh catalogue
        </button>
      </div>
      <div className="border-b border-accent/30 bg-[#f3ebe1]">
        <div className="flex items-center gap-2 px-3 py-3 sm:gap-4 sm:px-8 sm:py-5">
          <button
            className="flex size-11 items-center justify-center lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5 text-primary" />
          </button>
          <Link href="/" className="group min-w-0 flex items-center gap-3">
            <span className="hidden h-8 w-px bg-accent sm:block" aria-hidden />
            <span className="truncate font-display text-[1.2rem] tracking-[0.06em] text-primary sm:text-[1.65rem] sm:tracking-[0.08em]">
              Reena Rathore
            </span>
          </Link>
          <nav className="ml-4 hidden flex-1 items-center justify-center gap-5 text-[10px] xl:ml-6 xl:flex xl:gap-7 xl:text-[11px]">
            {NAV.map((item) => (
              <NavLink key={item.href} href={item.href} className="tracking-[0.22em]">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1 text-primary sm:gap-2">
            <button
              aria-label="Search"
              aria-expanded={searchOpen}
              className="flex size-11 items-center justify-center transition-colors hover:text-accent"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search className="size-[1.15rem]" />
            </button>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden px-2 text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-accent sm:inline"
            >
              Account
            </Link>
            <Link
              href="/wishlist"
              className="relative flex size-11 items-center justify-center text-[#6b4423] transition-colors hover:text-primary"
              aria-label="Wishlist"
            >
              <Heart className="size-[1.15rem] fill-none stroke-[1.75]" />
            </Link>
            <button
              className="relative flex size-11 items-center justify-center transition-colors hover:text-accent"
              aria-label="Open bag"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="size-[1.15rem]" />
              {count > 0 ? <CountBadge value={count} /> : null}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {searchOpen ? (
            <motion.form
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden border-t border-accent/25 bg-[#ebe2d4]"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/products?q=${encodeURIComponent(q)}`);
                setSearchOpen(false);
              }}
            >
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search sarees, lehengas, sherwanis…"
                aria-label="Search the shop"
                className="w-full bg-transparent px-4 py-4 text-base text-primary outline-none placeholder:text-primary/40 sm:px-8 sm:text-lg"
              />
            </motion.form>
          ) : null}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-50 xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-label="Close menu" />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={reduce ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-[#f3ebe1] px-6 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-foreground"
            >
              <div className="mb-10 flex items-center justify-between gap-3">
                <p className="min-w-0 truncate font-display text-2xl tracking-[0.08em] text-primary">Reena Rathore</p>
                <button className="flex size-11 items-center justify-center" onClick={() => setOpen(false)} aria-label="Close">
                  <X />
                </button>
              </div>
              <nav className="grid gap-1 text-sm">
                {NAV.map((item) => (
                  <NavLink key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-3">
                    {item.label}
                  </NavLink>
                ))}
                <NavLink href="/products" onClick={() => setOpen(false)} className="py-3">
                  All products
                </NavLink>
                <NavLink href="/account" onClick={() => setOpen(false)} className="py-3">
                  Account
                </NavLink>
              </nav>
              <button className="mt-auto py-3 text-left text-sm text-muted-foreground" onClick={() => void refresh()}>
                Refresh catalogue
              </button>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function CountBadge({ value }: { value: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      key={value}
      initial={reduce ? false : { scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] text-accent-foreground"
    >
      {value}
    </motion.span>
  );
}
