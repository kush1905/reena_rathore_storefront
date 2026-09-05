"use client";

import { use, useEffect, useState } from "react";
import { shopApi } from "@/lib/shop-api";
import { formatCurrency, formatDate } from "@/lib/format";
import { ErrorState, PageFade } from "@/components/ui/states";
import { cn } from "@/lib/utils";
import type { Order, TimelineEvent } from "@/types";

const TRACK = ["Order placed", "Payment confirmed", "Packed", "Dispatched", "In transit", "Delivered"];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    shopApi
      .order(id)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Order not found"));
  }, [id]);

  if (error) return <ErrorState message={error} />;
  if (!order) return <div className="h-80 animate-pulse bg-muted" />;

  return (
    <PageFade>
      <div className="px-4 py-10 sm:px-8">
        <p className="text-[11px] tracking-[0.2em] uppercase text-primary">Payment successful — demo</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">{order.id}</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {formatDate(order.date)} · {order.fulfillmentType === "store_pickup" ? "Store pickup" : "Home delivery"} · {formatCurrency(order.total)}
        </p>
        <ol className="mt-10 grid gap-4">
          {(order.timeline.length
            ? order.timeline
            : TRACK.map((label, i): TimelineEvent => ({ id: `t${i}`, label, at: "", done: false }))
          ).map((step) => (
            <li key={step.id} className="flex gap-4">
              <span className={cn("mt-1 size-3 shrink-0 rounded-full", step.done ? "bg-primary" : "border border-foreground/30")} />
              <div className="min-w-0">
                <p className={cn("font-medium", !step.done && "text-muted-foreground")}>{step.label}</p>
                {step.at ? <p className="text-xs text-muted-foreground">{formatDate(step.at)}</p> : null}
                {step.note ? <p className="text-sm">{step.note}</p> : null}
              </div>
            </li>
          ))}
        </ol>
        <ul className="mt-10 divide-y border-t">
          {order.items.map((item) => (
            <li key={item.sku} className="flex flex-col gap-1 py-4 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <span className="min-w-0 break-words">
                {item.title}
                <span className="text-muted-foreground">
                  {" "}
                  · {item.color} · {item.size} × {item.quantity}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>
    </PageFade>
  );
}
