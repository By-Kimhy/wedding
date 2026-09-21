"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import blurMap from "@/data/image-blur.json";
import { ui } from "@/data/i18n";
import type { GalleryPhoto } from "@/data/wedding";
import { useIsClient } from "@/lib/client";
import { useLanguage } from "@/lib/language";
import { EASE } from "@/lib/motion";

const blurData = blurMap as Record<string, string>;

/** Horizontal travel, in pixels, that counts as a deliberate swipe. */
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 320;

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={direction === "left" ? "" : "rotate-180"}
    >
      <path d="M15 4 7 12l8 8" />
    </svg>
  );
}

export function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: GalleryPhoto[];
  /** `null` closes the lightbox. */
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const { t, fontClass } = useLanguage();
  const mounted = useIsClient();
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<Element | null>(null);
  const open = index !== null;

  const goTo = useCallback(
    (offset: number) => {
      if (index === null) return;
      onNavigate((index + offset + photos.length) % photos.length);
    },
    [index, onNavigate, photos.length],
  );

  /* Keyboard: escape closes, arrows move. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") goTo(-1);
      else if (event.key === "ArrowRight") goTo(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, goTo]);

  /* Lock the page behind, and hand focus to the dialog and back again. */
  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement;
    document.body.dataset.lightbox = "open";
    closeRef.current?.focus();

    return () => {
      delete document.body.dataset.lightbox;
      if (restoreFocusTo.current instanceof HTMLElement) {
        restoreFocusTo.current.focus();
      }
    };
  }, [open]);

  if (!mounted) return null;

  const photo = index === null ? null : photos[index];

  return createPortal(
    <AnimatePresence>
      {photo && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t(ui.gallery.open)}
          className="fixed inset-0 z-[100] flex flex-col bg-[rgba(13,27,45,0.97)] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className="flex shrink-0 items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <span
              className={`t-caption text-[0.7rem] tracking-[0.24em] text-paper/60 ${fontClass}`}
            >
              {String(index + 1).padStart(2, "0")}
              <span className="mx-2 opacity-50">/</span>
              {String(photos.length).padStart(2, "0")}
            </span>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t(ui.gallery.close)}
              className="flex size-11 cursor-pointer items-center justify-center text-paper/75 transition-colors hover:text-paper"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={photo.src}
                className="relative h-full w-full max-w-[min(100%,900px)] cursor-grab touch-pan-y active:cursor-grabbing"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.35, ease: EASE }}
                drag="x"
                dragSnapToOrigin
                dragElastic={0.18}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  const far = Math.abs(info.offset.x) > SWIPE_DISTANCE;
                  const fast = Math.abs(info.velocity.x) > SWIPE_VELOCITY;
                  if (!far && !fast) return;
                  goTo(info.offset.x < 0 ? 1 : -1);
                }}
              >
                <Image
                  src={photo.src}
                  alt={t(photo.alt)}
                  fill
                  sizes="(max-width: 900px) 100vw, 900px"
                  placeholder={blurData[photo.src] ? "blur" : "empty"}
                  blurDataURL={blurData[photo.src]}
                  className="pointer-events-none object-contain select-none"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex shrink-0 items-center justify-center gap-8 px-5 pt-1 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => goTo(-1)}
              aria-label={t(ui.gallery.previous)}
              className="flex size-12 cursor-pointer items-center justify-center border border-paper/25 text-paper/70 transition-colors hover:border-paper/60 hover:text-paper"
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              aria-label={t(ui.gallery.next)}
              className="flex size-12 cursor-pointer items-center justify-center border border-paper/25 text-paper/70 transition-colors hover:border-paper/60 hover:text-paper"
            >
              <Chevron direction="right" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
