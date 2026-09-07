"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CLOSE_EVENT = "reena-rathore:select-close";

export function ThemedSelect({
  label,
  value,
  onChange,
  options,
  includeAll = true,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  includeAll?: boolean;
  className?: string;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; left: number; width: number; maxHeight: number } | null>(null);

  const items = includeAll ? [["all", "All"], ...options] : options;
  const currentValue = value || "all";
  const currentLabel = items.find(([v]) => v === currentValue)?.[1] ?? "All";
  const active = Boolean(value) && value !== "all";

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.("[data-themed-select-menu]")) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    };
    const onPeer = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail !== id) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener(CLOSE_EVENT, onPeer);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener(CLOSE_EVENT, onPeer);
    };
  }, [open, id]);

  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const el = buttonRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const width = Math.max(rect.width, 196);
      const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);
      const spaceBelow = window.innerHeight - rect.bottom - 16;
      const spaceAbove = rect.top - 16;
      const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;
      setCoords({
        left,
        width,
        maxHeight: Math.min(280, openUp ? spaceAbove : spaceBelow),
        ...(openUp ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
      });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, items.length]);

  function toggle() {
    if (!open) window.dispatchEvent(new CustomEvent(CLOSE_EVENT, { detail: id }));
    setOpen((prev) => !prev);
  }

  function choose(next: string) {
    onChange(next);
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div ref={rootRef} className={cn("relative w-full md:w-[11.5rem]", className)}>
      <span id={`${id}-label`} className="block text-[10px] tracking-[0.2em] text-primary uppercase">
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        id={`${id}-button`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-button`}
        onClick={toggle}
        className={cn(
          "mt-1.5 flex w-full items-center justify-between gap-3 border bg-card px-3 py-2.5 text-left text-[11px] tracking-[0.14em] uppercase transition-colors duration-200",
          open ? "border-accent" : "border-border hover:border-accent/70",
          active ? "text-primary" : "text-foreground",
        )}
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-accent transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && coords && typeof document !== "undefined"
        ? createPortal(
            <ul
              data-themed-select-menu
              role="listbox"
              aria-labelledby={`${id}-label`}
              style={{
                top: coords.top,
                bottom: coords.bottom,
                left: coords.left,
                width: coords.width,
                maxHeight: coords.maxHeight,
              }}
              className="fixed z-[80] overflow-y-auto border border-border bg-card py-1 shadow-[0_18px_50px_rgba(28,25,23,0.14)]"
            >
              {items.map(([itemValue, itemLabel]) => {
                const selected = itemValue === currentValue;
                return (
                  <li key={itemValue} role="none">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => choose(itemValue)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-[11px] tracking-[0.12em] uppercase transition-colors duration-150",
                        selected ? "bg-muted text-primary" : "text-foreground hover:bg-muted hover:text-primary",
                      )}
                    >
                      <span>{itemLabel}</span>
                      {selected ? <span className="h-px w-5 shrink-0 bg-accent" aria-hidden /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
