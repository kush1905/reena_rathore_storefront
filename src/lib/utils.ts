import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DEMO_CUSTOMER_ID =
  process.env.NEXT_PUBLIC_DEMO_CUSTOMER_ID ?? "cus_demo";
