"use client";

import Link from "next/link";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="mt-10 border-t bg-ink text-[#f3eee6] sm:mt-16">
      <div className="grid gap-10 px-4 py-12 sm:px-8 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl tracking-[0.08em]">Reena Rathore</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#cfc6b8]">
            An Indian label for silk, gota, and clothes made to hold a wedding week. Cut in Mehrauli, embroidered across Varanasi, Jaipur, and Lucknow.
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.2em] text-accent uppercase">Shop</p>
          <ul className="mt-4 grid gap-1 text-sm text-[#cfc6b8]">
            <li>
              <Link href="/category/women" className="inline-block py-2 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline">
                Women
              </Link>
            </li>
            <li>
              <Link href="/collections/wedding" className="inline-block py-2 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline">
                Wedding
              </Link>
            </li>
            <li>
              <Link href="/category/jewellery" className="inline-block py-2 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline">
                Jewelry
              </Link>
            </li>
            <li>
              <Link href="/category/accessories" className="inline-block py-2 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline">
                Accessories
              </Link>
            </li>
            <li>
              <Link href="/collections/festive" className="inline-block py-2 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline">
                Gifting
              </Link>
            </li>
            <li>
              <Link href="/products?sale=1" className="inline-block py-2 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline">
                Sale
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.2em] text-accent uppercase">House</p>
          <ul className="mt-4 grid gap-1 text-sm text-[#cfc6b8]">
            <li>
              <Link href="/account" className="inline-block py-2 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline">
                Account
              </Link>
            </li>
            <li>
              <Link href="/orders" className="inline-block py-2 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="inline-block py-2 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/cart" className="inline-block py-2 underline-offset-4 transition-colors duration-300 hover:text-white hover:underline">
                Bag
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.2em] text-accent uppercase">Atelier notes</p>
          <p className="mt-4 text-sm text-[#cfc6b8]">Mehrauli Flagship, New Delhi. Tuesday–Sunday, 11:00–20:00.</p>
          <form
            className="mt-4 flex items-end gap-2 border-b border-[#3a342e] pb-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.querySelector("input");
              if (!input?.value.trim()) return;
              toast.message("You are on the atelier list");
              form.reset();
            }}
          >
            <label className="sr-only" htmlFor="nl">
              Email
            </label>
            <input
              id="nl"
              type="email"
              required
              placeholder="Email for studio notes"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-[#8a8278]"
            />
            <button type="submit" className="shrink-0 py-2 text-[11px] tracking-[0.16em] text-accent uppercase">
              Join
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
