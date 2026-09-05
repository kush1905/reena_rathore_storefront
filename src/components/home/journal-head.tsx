"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function JournalHead({
  index,
  kicker,
  title,
  href,
  invert = false,
}: {
  index: string;
  kicker: string;
  title: string;
  href?: string;
  invert?: boolean;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-6", invert ? "border-white/12" : "border-border")}>
      <div>
        <p className="text-[11px] tracking-[0.36em] text-accent uppercase">
          {index} · {kicker}
        </p>
        <h2 className={cn("mt-4 font-display text-5xl leading-[0.92] italic sm:text-6xl lg:text-7xl", invert && "text-[#f3eee6]")}>
          {title}
        </h2>
        <span className="mt-6 block h-px w-14 bg-accent" />
      </div>
      {href ? (
        <Link
          href={href}
          className={cn(
            "mb-2 shrink-0 text-[11px] tracking-[0.22em] uppercase underline-offset-8 hover:underline",
            invert ? "text-[#e8dfd2]" : "text-foreground",
          )}
        >
          View all
        </Link>
      ) : null}
    </div>
  );
}
