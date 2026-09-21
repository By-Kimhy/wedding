"use client";

import { motion } from "framer-motion";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { EASE } from "@/lib/motion";

/**
 * The language switcher, parked at the top left for the whole visit — over the
 * cover and then over the invitation behind it, so there is only ever one of
 * them. It is the only persistent control besides the soundtrack button
 * opposite: the invitation is one continuous page, so a guest never needs a
 * menu, only to keep scrolling.
 *
 * It sits above the falling petals, which would otherwise drift across the
 * labels and make them hard to read.
 */
export function LanguageBar() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[60]"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
    >
      <div className="invitation-column relative h-full">
        <LanguageSwitcher className="pointer-events-auto absolute top-[max(1rem,env(safe-area-inset-top))] left-[var(--gutter)]" />
      </div>
    </motion.div>
  );
}
