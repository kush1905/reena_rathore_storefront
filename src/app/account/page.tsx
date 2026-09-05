"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Heart, MapPin, Package, ShoppingBag, ArrowUpRight, Mail, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { shopApi } from "@/lib/shop-api";
import { ShopImage } from "@/components/media/shop-image";
import { buttonClass } from "@/components/ui/button";
import { PageFade } from "@/components/ui/states";
import { Reveal } from "@/components/ui/reveal";
import { useShopStore } from "@/stores/shop-store";
import { useUiStore } from "@/stores/ui-store";
import type { Address, Customer, Order } from "@/types";

const FALLBACK_PROFILE = {
  name: "Demo User",
  email: "guest@demo.com",
  phone: "+91 90000 00001",
  location: "New Delhi, Delhi",
  joined: "September 2026",
};

const EMPTY_ADDRESS = (): Address => ({
  label: "",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
});

export default function AccountPage() {
  const customerId = useShopStore((s) => s.customerId);
  const cart = useShopStore((s) => s.cart);
  const wishlist = useShopStore((s) => s.wishlist);
  const products = useShopStore((s) => s.products);
  const setCartOpen = useUiStore((s) => s.setCartOpen);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [editor, setEditor] = useState<{ mode: "add" | "edit"; index: number; draft: Address } | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    shopApi
      .orders(customerId)
      .then(setOrders)
      .catch(() => setOrders([]));
    shopApi
      .customer(customerId)
      .then(setCustomer)
      .catch(() => setCustomer(null));
  }, [customerId]);

  useEffect(() => {
    if (!editor) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditor(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editor]);

  const bagCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const bagValue = cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const wishItems = useMemo(
    () => wishlist.map((w) => products.find((p) => p.id === w.productId)).filter(Boolean).slice(0, 4),
    [wishlist, products],
  );
  const recentOrders = (orders ?? []).slice(0, 3);
  const continueShopping = products.filter((p) => p.status === "published").slice(0, 4);
  const profile = {
    name: customer?.name || FALLBACK_PROFILE.name,
    email: customer?.email || FALLBACK_PROFILE.email,
    phone: customer?.phone || FALLBACK_PROFILE.phone,
    location: customer?.location || FALLBACK_PROFILE.location,
    joined: customer?.joinedAt
      ? new Date(customer.joinedAt).toLocaleString("en-IN", { month: "long", year: "numeric" })
      : FALLBACK_PROFILE.joined,
  };
  const addresses = customer?.addresses ?? [];
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function persistAddresses(next: Address[], successMessage: string) {
    setSavingAddress(true);
    try {
      const updated = await shopApi.updateAddresses(customerId, next);
      setCustomer(updated);
      toast.success(successMessage);
      setEditor(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update addresses");
    } finally {
      setSavingAddress(false);
    }
  }

  function openAdd() {
    setEditor({
      mode: "add",
      index: -1,
      draft: {
        ...EMPTY_ADDRESS(),
        name: profile.name,
        phone: profile.phone,
      },
    });
  }

  function openEdit(index: number) {
    const current = addresses[index];
    if (!current) return;
    setEditor({ mode: "edit", index, draft: { ...EMPTY_ADDRESS(), ...current } });
  }

  async function saveEditor() {
    if (!editor) return;
    const draft = sanitizeAddress(editor.draft);
    const error = validateAddress(draft);
    if (error) {
      toast.error(error);
      return;
    }
    if (editor.mode === "add") {
      await persistAddresses([...addresses, draft], "Address saved");
      return;
    }
    const next = addresses.map((item, i) => (i === editor.index ? draft : item));
    await persistAddresses(next, "Address updated");
  }

  async function deleteAddress(index: number) {
    const target = addresses[index];
    if (!target) return;
    const label = target.label || target.line1;
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) return;
    const next = addresses.filter((_, i) => i !== index);
    await persistAddresses(next, "Address deleted");
  }

  async function makeDefault(index: number) {
    if (index <= 0) return;
    const next = [...addresses];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    await persistAddresses(next, "Default address updated");
  }

  return (
    <PageFade>
      <div className="px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
        <Reveal>
          <div className="grid gap-8 border-b border-foreground/10 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div
                className="flex size-20 shrink-0 items-center justify-center border border-foreground/20 bg-foreground text-2xl tracking-[0.12em] text-background sm:size-24 sm:text-3xl"
                aria-hidden
              >
                <span className="font-display">{initials}</span>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.28em] text-primary uppercase">Your atelier profile</p>
                <h1 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl">{profile.name}</h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Welcome back. Manage orders, saved pieces, addresses, and your bag from one place. This is a demo guest
                  session — live sign-in can replace it later.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex max-w-full items-center gap-1.5 truncate">
                    <Mail className="size-3.5 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {profile.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 self-start lg:self-end">
              <span className="border border-foreground/20 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase">
                Demo session
              </span>
              <span className="max-w-[11rem] truncate border border-foreground/20 px-3 py-1.5 font-mono text-[10px] tracking-wide text-muted-foreground sm:max-w-none">
                {customerId}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <HubLink
              href="/orders"
              icon={<Package className="size-5" />}
              label="Orders"
              value={orders === null ? "…" : String(orders.length)}
              hint={orders?.length ? "Track making & dispatch" : "Place your first order"}
            />
            <HubLink
              href="/wishlist"
              icon={<Heart className="size-5" />}
              label="Wishlist"
              value={String(wishlist.length)}
              hint={wishlist.length ? "Pieces waiting for you" : "Heart something to save it"}
            />
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="group border border-foreground/15 bg-background/50 p-5 text-left transition-colors duration-300 hover:border-foreground/40 hover:bg-background"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                  <ShoppingBag className="size-5" />
                </span>
                <ArrowUpRight className="size-4 opacity-40 transition group-hover:opacity-100" />
              </div>
              <p className="mt-6 text-[11px] tracking-[0.2em] uppercase">Bag</p>
              <p className="mt-1 font-display text-4xl">{bagCount}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {bagCount ? `${formatCurrency(bagValue)} in bag` : "Your bag is empty"}
              </p>
            </button>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal delay={0.08}>
            <section>
              <SectionHead title="Recent orders" href="/orders" action="View all" />
              {orders === null ? (
                <div className="mt-5 h-40 animate-pulse bg-foreground/5" />
              ) : recentOrders.length ? (
                <ul className="mt-5 divide-y border-y border-foreground/10">
                  {recentOrders.map((order) => (
                    <li key={order.id}>
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex flex-wrap items-center gap-4 py-5 transition-colors hover:bg-foreground/[0.02]"
                      >
                        <div className="relative size-16 shrink-0 overflow-hidden bg-muted sm:size-20">
                          <ShopImage src={order.items[0]?.image ?? ""} alt="" fill width={200} sizes="80px" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{order.id}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatDate(order.date)} · {order.orderStatus.replaceAll("_", " ")}
                          </p>
                          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                            {order.items.map((item) => item.title).join(" · ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="price">{formatCurrency(order.total)}</p>
                          <p className="mt-2 text-[10px] tracking-[0.16em] uppercase underline-offset-4 group-hover:underline">
                            Track
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyPanel
                  title="No orders yet"
                  body="When you check out, your making timeline and tracking will live here."
                  href="/products"
                  cta="Browse the shop"
                />
              )}
            </section>
          </Reveal>

          <Reveal delay={0.1}>
            <section>
              <SectionHead title="Saved for later" href="/wishlist" action="Wishlist" />
              {wishItems.length ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {wishItems.map((product) =>
                    product ? (
                      <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                          <ShopImage
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            width={400}
                            sizes="(max-width: 1024px) 45vw, 20vw"
                            className="transition duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm">{product.title}</p>
                        <p className="price mt-1 text-sm">{formatCurrency(product.price)}</p>
                      </Link>
                    ) : null,
                  )}
                </div>
              ) : (
                <EmptyPanel
                  title="Nothing saved"
                  body="Tap the heart on a piece to keep it close."
                  href="/products"
                  cta="Find a favourite"
                />
              )}

              {bagCount > 0 && cart ? (
                <div className="mt-8 border border-foreground/15 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] tracking-[0.2em] uppercase">In your bag</p>
                      <p className="mt-1 font-display text-2xl">
                        {bagCount} {bagCount === 1 ? "piece" : "pieces"}
                      </p>
                    </div>
                    <p className="price">{formatCurrency(bagValue)}</p>
                  </div>
                  <div className="mt-4 flex -space-x-2">
                    {cart.items.slice(0, 4).map((item) => (
                      <div key={item.sku} className="relative size-12 overflow-hidden border-2 border-background bg-muted">
                        <ShopImage src={item.image} alt="" fill width={96} sizes="48px" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button type="button" className={buttonClass("solid")} onClick={() => setCartOpen(true)}>
                      Open bag
                    </button>
                    <Link href="/checkout" className={buttonClass("outline")}>
                      Checkout
                    </Link>
                  </div>
                </div>
              ) : null}
            </section>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <section className="mt-12 border-t border-foreground/10 pt-10">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border border-foreground/15 bg-background/40 p-6 sm:p-8">
                <p className="text-[11px] tracking-[0.2em] uppercase">Profile</p>
                <h2 className="mt-2 font-display text-3xl">Contact details</h2>
                <dl className="mt-6 grid gap-4 text-sm">
                  <Detail label="Name" value={profile.name} />
                  <Detail label="Email" value={profile.email} />
                  <Detail label="Phone" value={profile.phone} icon={<Phone className="size-3.5" />} />
                  <Detail label="Member since" value={profile.joined} />
                </dl>
              </div>

              <div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] tracking-[0.2em] uppercase">Delivery</p>
                    <h2 className="mt-2 font-display text-3xl">Saved addresses</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                      {customer === null ? "…" : `${addresses.length} saved`}
                    </p>
                    <button
                      type="button"
                      className={buttonClass("outline", "px-4 py-2")}
                      onClick={openAdd}
                      disabled={!customer || savingAddress}
                    >
                      Add address
                    </button>
                  </div>
                </div>

                {customer === null ? (
                  <div className="mt-5 h-40 animate-pulse bg-foreground/5" />
                ) : addresses.length ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {addresses.map((address, index) => (
                      <AddressCard
                        key={`${address.postalCode}-${address.line1}-${index}`}
                        address={address}
                        isDefault={index === 0}
                        busy={savingAddress}
                        onEdit={() => openEdit(index)}
                        onDelete={() => void deleteAddress(index)}
                        onMakeDefault={index === 0 ? undefined : () => void makeDefault(index)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 border border-dashed border-foreground/20 px-5 py-8 text-center sm:px-8">
                    <p className="font-display text-2xl">No addresses saved</p>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                      Add a home, office, or gift address for faster checkout.
                    </p>
                    <button type="button" className={buttonClass("outline", "mt-5")} onClick={openAdd}>
                      Add address
                    </button>
                  </div>
                )}
                <p className="mt-4 text-xs text-muted-foreground">
                  The first address is your default for home delivery. Use Edit, Delete, or Set as default on any card.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        {continueShopping.length ? (
          <Reveal delay={0.14}>
            <section className="mt-12 border-t border-foreground/10 pt-10">
              <SectionHead title="Continue shopping" href="/products" action="Shop all" />
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {continueShopping.map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      <ShopImage
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        width={500}
                        sizes="(max-width: 768px) 45vw, 22vw"
                        className="transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm">{product.title}</p>
                    <p className="price mt-1 text-sm">{formatCurrency(product.price)}</p>
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        ) : null}
      </div>

      <AnimatePresence>
        {editor ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button type="button" className="absolute inset-0" aria-label="Close address editor" onClick={() => setEditor(null)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={editor.mode === "add" ? "Add address" : "Edit address"}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto bg-background p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase">Delivery</p>
                  <h2 className="mt-1 font-display text-3xl">{editor.mode === "add" ? "Add address" : "Edit address"}</h2>
                </div>
                <button type="button" className="border p-2" aria-label="Close" onClick={() => setEditor(null)}>
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-6 grid gap-3">
                <Field
                  label="Label"
                  value={editor.draft.label ?? ""}
                  placeholder="Home, Office, Family…"
                  onChange={(label) => setEditor({ ...editor, draft: { ...editor.draft, label } })}
                />
                <Field
                  label="Full name"
                  value={editor.draft.name}
                  onChange={(name) => setEditor({ ...editor, draft: { ...editor.draft, name } })}
                />
                <Field
                  label="Phone"
                  value={editor.draft.phone}
                  onChange={(phone) => setEditor({ ...editor, draft: { ...editor.draft, phone } })}
                />
                <Field
                  label="Address line 1"
                  value={editor.draft.line1}
                  onChange={(line1) => setEditor({ ...editor, draft: { ...editor.draft, line1 } })}
                />
                <Field
                  label="Address line 2"
                  value={editor.draft.line2 ?? ""}
                  onChange={(line2) => setEditor({ ...editor, draft: { ...editor.draft, line2 } })}
                />
                <Field
                  label="Landmark"
                  value={editor.draft.landmark ?? ""}
                  onChange={(landmark) => setEditor({ ...editor, draft: { ...editor.draft, landmark } })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="City"
                    value={editor.draft.city}
                    onChange={(city) => setEditor({ ...editor, draft: { ...editor.draft, city } })}
                  />
                  <Field
                    label="PIN"
                    value={editor.draft.postalCode}
                    onChange={(postalCode) => setEditor({ ...editor, draft: { ...editor.draft, postalCode } })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="State"
                    value={editor.draft.state}
                    onChange={(state) => setEditor({ ...editor, draft: { ...editor.draft, state } })}
                  />
                  <Field
                    label="Country"
                    value={editor.draft.country}
                    onChange={(country) => setEditor({ ...editor, draft: { ...editor.draft, country } })}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <button type="button" className={buttonClass("solid")} disabled={savingAddress} onClick={() => void saveEditor()}>
                  {savingAddress ? "Saving…" : editor.mode === "add" ? "Save address" : "Save changes"}
                </button>
                <button type="button" className={buttonClass("outline")} disabled={savingAddress} onClick={() => setEditor(null)}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PageFade>
  );
}

function sanitizeAddress(address: Address): Address {
  return {
    label: address.label?.trim() || undefined,
    name: address.name.trim(),
    phone: address.phone.trim(),
    line1: address.line1.trim(),
    line2: address.line2?.trim() || undefined,
    landmark: address.landmark?.trim() || undefined,
    city: address.city.trim(),
    state: address.state.trim(),
    postalCode: address.postalCode.trim(),
    country: address.country.trim() || "India",
  };
}

function validateAddress(address: Address) {
  if (address.name.length < 2) return "Enter the full name.";
  if (address.phone.length < 8) return "Enter a valid phone number.";
  if (address.line1.length < 3) return "Enter the street address.";
  if (address.city.length < 2) return "Enter the city.";
  if (address.state.length < 2) return "Enter the state.";
  if (address.postalCode.length < 4) return "Enter a valid PIN code.";
  return null;
}

function AddressCard({
  address,
  isDefault,
  busy,
  onEdit,
  onDelete,
  onMakeDefault,
}: {
  address: Address;
  isDefault?: boolean;
  busy?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMakeDefault?: () => void;
}) {
  return (
    <article className="flex flex-col border border-foreground/15 bg-background/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] tracking-[0.18em] uppercase">{address.label || "Address"}</p>
        {isDefault ? (
          <span className="border border-foreground/20 px-2 py-0.5 text-[10px] tracking-[0.16em] uppercase">Default</span>
        ) : null}
      </div>
      <p className="mt-3 font-medium">{address.name}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {address.line1}
        {address.line2 ? (
          <>
            <br />
            {address.line2}
          </>
        ) : null}
        {address.landmark ? (
          <>
            <br />
            {address.landmark}
          </>
        ) : null}
        <br />
        {address.city}, {address.state} {address.postalCode}
        <br />
        {address.country}
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Phone className="size-3.5" />
        {address.phone}
      </p>
      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 border-t border-foreground/10 pt-4 text-[11px] tracking-[0.16em] uppercase">
        <button type="button" className="min-h-10 underline underline-offset-4 disabled:opacity-40" disabled={busy} onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="min-h-10 underline underline-offset-4 disabled:opacity-40" disabled={busy} onClick={onDelete}>
          Delete
        </button>
        {onMakeDefault ? (
          <button type="button" className="min-h-10 underline underline-offset-4 disabled:opacity-40" disabled={busy} onClick={onMakeDefault}>
            Set as default
          </button>
        ) : null}
      </div>
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="border border-foreground/20 bg-transparent px-3 py-2.5 outline-none transition-colors focus:border-foreground"
      />
    </label>
  );
}

function HubLink({
  href,
  icon,
  label,
  value,
  hint,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="group border border-foreground/15 bg-background/50 p-5 transition-colors duration-300 hover:border-foreground/40 hover:bg-background"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-muted-foreground transition-colors group-hover:text-foreground">{icon}</span>
        <ArrowUpRight className="size-4 opacity-40 transition group-hover:opacity-100" />
      </div>
      <p className="mt-6 text-[11px] tracking-[0.2em] uppercase">{label}</p>
      <p className="mt-1 font-display text-4xl">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
    </Link>
  );
}

function SectionHead({ title, href, action }: { title: string; href: string; action: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      <Link href={href} className="inline-flex min-h-10 items-center text-[11px] tracking-[0.18em] uppercase underline underline-offset-8">
        {action}
      </Link>
    </div>
  );
}

function Detail({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("text-right", icon && "inline-flex items-center gap-1.5")}>
        {icon}
        {value}
      </dd>
    </div>
  );
}

function EmptyPanel({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="mt-5 border border-dashed border-foreground/20 px-5 py-8 text-center sm:px-8">
      <p className="font-display text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      <Link href={href} className={buttonClass("outline", "mt-5")}>
        {cta}
      </Link>
    </div>
  );
}
