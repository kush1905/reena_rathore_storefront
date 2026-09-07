"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Banner } from "@/types";

const HERO_IMAGE = "/hero/reena-rathore-luxe.jpg";

const COPY = {
  brand: "Reena Rathore",
  line: "Modern luxe — black silk, silver zari, and rugs underfoot.",
  primary: "Shop the collection",
  secondary: "View wedding edit",
};

export function HeroAtelier({ banner }: { banner?: Banner | null }) {
  const reduce = useReducedMotion();
  const primaryHref = banner?.destination || "/collections/festive";
  const fade = reduce
    ? undefined
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section className="hero-luxe relative isolate min-h-[calc(100dvh-var(--header-h))] overflow-hidden bg-[#1a120e] text-[#f7f1e8]">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${HERO_IMAGE}?v=2`}
          alt=""
          className={`hero-luxe-image absolute inset-0 h-full w-full object-cover object-center ${reduce ? "" : "hero-luxe-ken"}`}
        />
        <div className="hero-luxe-wash pointer-events-none absolute inset-0" aria-hidden />
        <div className="hero-luxe-grain pointer-events-none absolute inset-0" aria-hidden />
      </div>

      <div className="relative z-[1] flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-end px-5 pb-10 pt-24 sm:px-10 sm:pb-14 lg:justify-center lg:px-16 lg:pb-16 xl:px-20">
        <div className="hero-luxe-copy max-w-xl">
          <motion.p
            className="hero-luxe-kicker"
            {...(fade ? { ...fade, transition: { ...fade.transition, delay: 0.05 } } : {})}
          >
            Autumn Winter ’26
          </motion.p>

          <motion.h1
            className="hero-luxe-brand"
            {...(fade ? { ...fade, transition: { ...fade.transition, delay: 0.12 } } : {})}
          >
            {COPY.brand}
          </motion.h1>

          <motion.p
            className="hero-luxe-line"
            {...(fade ? { ...fade, transition: { ...fade.transition, delay: 0.22 } } : {})}
          >
            {COPY.line}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4"
            {...(fade ? { ...fade, transition: { ...fade.transition, delay: 0.32 } } : {})}
          >
            <Link href={primaryHref} className="hero-luxe-cta">
              {COPY.primary}
            </Link>
            <Link href="/collections/wedding" className="hero-luxe-link">
              {COPY.secondary}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
