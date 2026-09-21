"use client";

import type { ComponentType } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

import { EASE, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactNode;
  /** Seconds to wait after the element enters the viewport. */
  delay?: number;
  /** How far the element travels, in pixels. 0 fades in place. */
  distance?: number;
  duration?: number;
  as?: "div" | "section" | "li" | "figure" | "p" | "span";
};

/**
 * The invitation's one scroll-reveal. Content rises a short distance and
 * fades in as it arrives. Framer's `MotionConfig reducedMotion="user"` strips
 * the movement automatically for guests who ask for less motion.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 24,
  duration = 0.9,
  className,
  as = "div",
  ...rest
}: RevealProps) {
  /*
   * Every element this renders takes the same motion props; the cast keeps
   * the polymorphic `as` usable without a union of ten element types.
   */
  const Component = motion[as] as ComponentType<HTMLMotionProps<"div">>;

  return (
    <Component
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration, delay, ease: EASE }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
