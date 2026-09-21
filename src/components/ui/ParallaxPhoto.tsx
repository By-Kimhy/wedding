"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import blurMap from "@/data/image-blur.json";
import type { Photo as PhotoData } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

const blurData = blurMap as Record<string, string>;

/**
 * A full-bleed photograph that drifts a little slower than the page. Used for
 * the two hero moments only — parallax everywhere would feel restless.
 */
export function ParallaxPhoto({
  photo,
  ratio,
  className,
  priority = false,
  /** How far the image travels across its own frame, as a percentage. */
  strength = 12,
  overlayClassName,
  children,
  sizes = "(max-width: 520px) 100vw, 480px",
}: {
  photo: PhotoData;
  ratio?: string;
  className?: string;
  priority?: boolean;
  strength?: number;
  overlayClassName?: string;
  children?: React.ReactNode;
  sizes?: string;
}) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${strength}%`, `${strength}%`],
  );

  return (
    <div
      ref={ref}
      className={cn("relative isolate overflow-hidden bg-surface", className)}
      style={{ aspectRatio: ratio ?? photo.ratio }}
    >
      <motion.div
        className="absolute inset-x-0 -inset-y-[15%]"
        style={reduced ? undefined : { y }}
      >
        <Image
          src={photo.src}
          alt={t(photo.alt)}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          placeholder={blurData[photo.src] ? "blur" : "empty"}
          blurDataURL={blurData[photo.src]}
          className="object-cover"
        />
      </motion.div>
      {overlayClassName && (
        <div aria-hidden className={cn("absolute inset-0", overlayClassName)} />
      )}
      {children}
    </div>
  );
}
