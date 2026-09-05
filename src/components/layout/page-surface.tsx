"use client";

import type { ReactNode } from "react";
import { AtelierPanel, type AtelierTone, type CornerStyle } from "@/components/home/atelier-panel";

const ROUTE_SURFACE: { match: (path: string) => boolean; tone: AtelierTone; corner: CornerStyle }[] = [
  { match: (p) => p.startsWith("/products"), tone: "linen", corner: "linen" },
  { match: (p) => p.startsWith("/collections"), tone: "petal", corner: "petal" },
  { match: (p) => p.startsWith("/category"), tone: "vine", corner: "vine" },
  { match: (p) => p.startsWith("/cart") || p.startsWith("/checkout"), tone: "sand", corner: "sand" },
  { match: (p) => p.startsWith("/wishlist"), tone: "lotus", corner: "lotus" },
  { match: (p) => p.startsWith("/orders") || p.startsWith("/account"), tone: "jaali", corner: "jaali" },
];

export function surfaceForPath(pathname: string): { tone: AtelierTone; corner: CornerStyle } {
  return ROUTE_SURFACE.find((entry) => entry.match(pathname)) ?? { tone: "linen", corner: "crest" };
}

export function PageSurface({
  pathname,
  children,
}: {
  pathname: string;
  children: ReactNode;
}) {
  const { tone, corner } = surfaceForPath(pathname);
  return (
    <AtelierPanel tone={tone} corner={corner} contentClassName="px-0 pb-10 sm:pb-12">
      {children}
    </AtelierPanel>
  );
}
