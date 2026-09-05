"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { shopApi } from "@/lib/shop-api";
import { formatCurrency, formatDate } from "@/lib/format";
import { EmptyState, ErrorState, PageFade } from "@/components/ui/states";
import { useShopStore } from "@/stores/shop-store";
import type { Order } from "@/types";

export default function OrdersPage() {
  const customerId = useShopStore((s) => s.customerId);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    shopApi
      .orders(customerId)
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load orders"));
  }, [customerId]);

  if (error) return <ErrorState message={error} />;
  if (!orders) return <div className="h-64 animate-pulse bg-muted" />;
  if (!orders.length) {
    return <EmptyState title="No orders yet" body="Place a demo order from checkout. It will appear here and in admin." />;
  }

  return (
    <PageFade>
      <div className="px-4 py-10 sm:px-8">
        <h1 className="font-display text-5xl">Orders</h1>
        <ul className="mt-8 divide-y">
          {orders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-5">
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.date)} · {order.orderStatus.replaceAll("_", " ")}
                </p>
              </div>
              <p>{formatCurrency(order.total)}</p>
              <Link href={`/orders/${order.id}`} className="text-[11px] tracking-[0.16em] uppercase underline">
                Track
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageFade>
  );
}
