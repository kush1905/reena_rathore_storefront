"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { shopApi } from "@/lib/shop-api";
import { formatCurrency } from "@/lib/format";
import { CartItemThumb } from "@/components/cart/cart-item-thumb";
import { EmptyState, PageFade } from "@/components/ui/states";
import { useShopStore } from "@/stores/shop-store";
import type { Address, FulfillmentType } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useShopStore((s) => s.cart);
  const customerId = useShopStore((s) => s.customerId);
  const refresh = useShopStore((s) => s.refresh);
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("home_delivery");
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState<Address>({
    name: "Demo User",
    phone: "+91 90000 00001",
    line1: "12, NCPA Apartments",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400021",
    country: "India",
  });

  if (!items.length) {
    return <EmptyState title="Nothing to check out" body="Add pieces to the bag first." />;
  }

  async function place() {
    setBusy(true);
    try {
      const order = await shopApi.placeOrder({
        customerId,
        fulfillmentType: fulfillment,
        paymentMethod: "Demo card",
        shippingAddress: address,
        billingAddress: address,
        pickupLocation: fulfillment === "store_pickup" ? "Mehrauli Flagship" : undefined,
      });
      await refresh();
      toast.success("Payment successful — demo");
      router.push(`/orders/${order.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageFade>
      <div className="grid gap-10 px-4 py-10 sm:px-8 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Checkout</h1>
          <div className="mt-8 grid gap-3">
            <Field label="Name" value={address.name} onChange={(name) => setAddress({ ...address, name })} />
            <Field label="Phone" value={address.phone} onChange={(phone) => setAddress({ ...address, phone })} />
            <Field label="Address" value={address.line1} onChange={(line1) => setAddress({ ...address, line1 })} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="City" value={address.city} onChange={(city) => setAddress({ ...address, city })} />
              <Field label="PIN" value={address.postalCode} onChange={(postalCode) => setAddress({ ...address, postalCode })} />
            </div>
            <Field label="State" value={address.state} onChange={(state) => setAddress({ ...address, state })} />
          </div>
          <div className="mt-8">
            <p className="text-[11px] tracking-[0.16em] uppercase">Fulfilment</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["home_delivery", "store_pickup"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFulfillment(type)}
                  className={`border px-4 py-3 text-sm ${fulfillment === type ? "bg-foreground text-background" : ""}`}
                >
                  {type === "home_delivery" ? "Home delivery" : "Store pickup"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 border p-4">
            <p className="text-[11px] tracking-[0.16em] uppercase">Payment</p>
            <p className="mt-2 text-sm text-muted-foreground">Demo card · no real charge. Totals are calculated on the server from live prices.</p>
          </div>
        </div>
        <aside className="h-fit bg-card p-5 sm:p-6">
          {items.map((item) => (
            <div key={item.sku} className="flex items-center justify-between gap-3 border-b py-3 text-sm last:border-b-0">
              <div className="flex min-w-0 items-center gap-3">
                <CartItemThumb
                  productId={item.productId}
                  image={item.image}
                  title={item.title}
                  className="h-14 w-11 shrink-0 rounded-sm bg-muted"
                />
                <span className="min-w-0 truncate">
                  {item.title} × {item.quantity}
                </span>
              </div>
              <span className="shrink-0 tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <p className="mt-4 border-t pt-3 text-sm">Subtotal {formatCurrency(subtotal)}</p>
          <button disabled={busy} onClick={() => void place()} className="mt-6 w-full bg-foreground py-3.5 text-[11px] tracking-[0.2em] text-background uppercase disabled:opacity-50">
            {busy ? "Placing…" : "Place demo order"}
          </button>
        </aside>
      </div>
    </PageFade>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-[11px] tracking-[0.14em] uppercase">
      {label}
      <input className="border bg-transparent px-3 py-2 text-sm tracking-normal normal-case" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
