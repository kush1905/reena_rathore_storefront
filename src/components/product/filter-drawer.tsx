"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemedSelect } from "@/components/ui/select";
import { useUiStore } from "@/stores/ui-store";

export function FilterDrawer({ children }: { children: ReactNode }) {
  const open = useUiStore((s) => s.filterOpen);
  const setOpen = useUiStore((s) => s.setFilterOpen);
  const reduce = useReducedMotion();

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
        <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-ink/40" aria-label="Close filters" onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            initial={reduce ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto bg-background px-5 py-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-2xl">Filter</p>
              <button onClick={() => setOpen(false)} aria-label="Close filters">
                <X className="size-5" />
              </button>
            </div>
            <div className="grid gap-5">{children}</div>
            <Button className="mt-8 w-full" onClick={() => setOpen(false)}>
              View pieces
            </Button>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  includeAll = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  includeAll?: boolean;
}) {
  return <ThemedSelect label={label} value={value} onChange={onChange} options={options} includeAll={includeAll} />;
}
