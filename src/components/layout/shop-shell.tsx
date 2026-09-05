"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Header } from "./header";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { PageSurface } from "./page-surface";
import { useShopStore } from "@/stores/shop-store";
import { useUiStore } from "@/stores/ui-store";

export function ShopShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const refresh = useShopStore((s) => s.refresh);
  const ready = useShopStore((s) => s.ready);
  const cartOpen = useUiStore((s) => s.cartOpen);
  const filterOpen = useUiStore((s) => s.filterOpen);
  const menuOpen = useUiStore((s) => s.menuOpen);
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const setFilterOpen = useUiStore((s) => s.setFilterOpen);
  const setMenuOpen = useUiStore((s) => s.setMenuOpen);
  const home = pathname === "/";

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    setCartOpen(false);
    setFilterOpen(false);
    setMenuOpen(false);
  }, [pathname, setCartOpen, setFilterOpen, setMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || filterOpen || menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, filterOpen, menuOpen]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:bg-background focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header />
      <main id="main">
        {ready ? (
          home ? (
            <div className="home-landing">{children}</div>
          ) : (
            <PageSurface pathname={pathname}>{children}</PageSurface>
          )
        ) : (
          <PagePulse home={home} pathname={pathname} />
        )}
      </main>
      <Footer />
      <CartDrawer />
      <Toaster
        position="bottom-center"
        offset="calc(1rem + env(safe-area-inset-bottom))"
        mobileOffset="calc(1rem + env(safe-area-inset-bottom))"
        toastOptions={{
          className: "font-sans !rounded-none !border-border !bg-background !text-foreground !shadow-none",
        }}
      />
    </div>
  );
}

function PagePulse({ home, pathname }: { home: boolean; pathname: string }) {
  if (home) {
    return (
      <div>
        <div className="h-dvh animate-pulse bg-muted" />
      </div>
    );
  }
  return (
    <PageSurface pathname={pathname}>
      <div className={cn("h-[40vh] animate-pulse bg-muted/40")} />
    </PageSurface>
  );
}
