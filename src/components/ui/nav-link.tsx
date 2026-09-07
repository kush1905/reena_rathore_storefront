"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
  className,
  onClick,
  inverted,
}: {
  href: string;
  children: string;
  className?: string;
  onClick?: () => void;
  inverted?: boolean;
}) {
  const pathname = usePathname();
  const path = href.split("?")[0];
  const isActive = href.includes("?") ? false : path === "/" ? pathname === "/" : pathname === path;

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative inline-block py-1 tracking-[0.2em] uppercase transition-colors duration-300",
        inverted ? "text-white/85 hover:text-white" : "text-primary/80 hover:text-accent",
        isActive && !inverted && "text-primary",
        className,
      )}
    >
      {children}
      <span
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100",
          isActive && "scale-x-100",
        )}
        aria-hidden
      />
    </Link>
  );
}
