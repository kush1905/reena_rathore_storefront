import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  solid: "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground",
  outline: "border border-accent/50 bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-primary-foreground",
  ghost: "bg-transparent text-accent underline-offset-8 hover:text-primary hover:underline",
  light: "border border-white text-white hover:bg-white hover:text-primary",
};

export type ButtonVariant = keyof typeof variants;

export function buttonClass(variant: ButtonVariant = "solid", className?: string) {
  return cn(
    "inline-flex items-center justify-center px-6 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 disabled:opacity-40",
    variants[variant],
    className,
  );
}

export function Button({
  variant = "solid",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
}) {
  return (
    <button className={buttonClass(variant, className)} {...props}>
      {children}
    </button>
  );
}
