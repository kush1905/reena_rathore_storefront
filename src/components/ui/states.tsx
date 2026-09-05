"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function PageFade({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-4xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-4xl">The atelier is unreachable</h1>
      <p className="mt-3 text-muted-foreground">{message}</p>
      {onRetry ? (
        <button className="mt-6 border border-foreground px-5 py-2 text-sm tracking-[0.16em] uppercase" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
