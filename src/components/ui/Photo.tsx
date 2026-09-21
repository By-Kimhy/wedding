"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import blurMap from "@/data/image-blur.json";
import type { Photo as PhotoData } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { EASE_LONG, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

const blurData = blurMap as Record<string, string>;

type PhotoProps = {
  photo: PhotoData;
  /** Overrides the photo's own ratio when the layout needs a different crop. */
  ratio?: string;
  /** Responsive size hint. Defaults to a full-width photo in the invitation. */
  sizes?: string;
  /** The cover photograph is the LCP element and must not be lazy-loaded. */
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /** Slow settle out of a slight zoom as the photo scrolls into view. */
  reveal?: boolean;
  /** Rendered above the photograph, inside the same frame. */
  children?: React.ReactNode;
  /** Extra emphasis on the frame, used by the editorial sections. */
  rounded?: boolean;
};

/**
 * Every photograph in the invitation goes through this frame: a fixed-ratio
 * box (so nothing shifts while images load), a warm placeholder underneath,
 * and `object-fit: cover` so a replacement photo of any size still sits right.
 */
export function Photo({
  photo,
  ratio,
  sizes = "(max-width: 520px) 100vw, 480px",
  priority = false,
  className,
  imageClassName,
  reveal = true,
  rounded = false,
  children,
}: PhotoProps) {
  const { t } = useLanguage();
  const blurDataURL = blurData[photo.src];

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-surface",
        rounded && "rounded-[2px]",
        className,
      )}
      style={{ aspectRatio: ratio ?? photo.ratio }}
    >
      <motion.div
        className="absolute inset-0"
        initial={reveal ? { scale: 1.07, opacity: 0 } : false}
        whileInView={reveal ? { scale: 1, opacity: 1 } : undefined}
        viewport={viewportOnce}
        transition={{ duration: 1.2, ease: EASE_LONG }}
      >
        <Image
          src={photo.src}
          alt={t(photo.alt)}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          className={cn("object-cover", imageClassName)}
        />
      </motion.div>
      {children}
    </div>
  );
}
