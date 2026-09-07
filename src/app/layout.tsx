import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Instrument_Serif } from "next/font/google";
import { ShopShell } from "@/components/layout/shop-shell";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Reena Rathore",
  description: "Reena Rathore — silk, gota, and clothes made to hold a wedding week.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${cormorant.variable} ${instrument.variable} font-sans antialiased`}>
        <ShopShell>{children}</ShopShell>
      </body>
    </html>
  );
}
