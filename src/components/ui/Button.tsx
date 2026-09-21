"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

type Variant = "outline" | "solid" | "quiet";

const base =
  "group relative inline-flex min-h-[48px] items-center justify-center gap-3 " +
  "px-7 py-3.5 t-eyebrow text-center transition-colors duration-500 " +
  "disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  outline:
    "border border-primary/45 text-primary hover:border-primary hover:bg-primary hover:text-paper",
  solid: "bg-primary text-paper hover:bg-ink",
  quiet: "text-primary underline-offset-8 hover:underline",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  /** Full width inside the invitation column. */
  block?: boolean;
};

export function Button({
  variant = "outline",
  className,
  children,
  block,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { fontClass } = useLanguage();

  return (
    <button
      type={type}
      className={cn(base, variants[variant], fontClass, block && "w-full", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "outline",
  className,
  children,
  block,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { fontClass } = useLanguage();

  return (
    <a
      className={cn(base, variants[variant], fontClass, block && "w-full", className)}
      {...rest}
    >
      {children}
    </a>
  );
}
