"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { Diamond } from "@/components/ui/Decor";
import blurMap from "@/data/image-blur.json";
import { ui } from "@/data/i18n";
import { wedding } from "@/data/wedding";
import { useInvitation } from "@/lib/invitation";
import { useLanguage } from "@/lib/language";
import { EASE, EASE_LONG } from "@/lib/motion";
import { cn } from "@/lib/utils";

const blurData = blurMap as Record<string, string>;

/** Children rise into place one after another as the cover appears. */
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

/**
 * The sealed envelope. It fills the invitation column, shows almost nothing
 * but the photograph and the couple's names, and hands over to the invitation
 * with a slow dissolve when the guest presses "Open invitation".
 */
export function InvitationCover() {
  const { opened, open } = useInvitation();
  const { t, fontClass } = useLanguage();
  const { cover, couple, dateLabel } = wedding;

  return (
    <AnimatePresence>
      {!opened && (
        <motion.div
          key="cover"
          className="fixed inset-0 z-50 bg-backdrop"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <motion.div
            className="invitation-column relative h-full overflow-hidden bg-canvas"
            exit={{ scale: 1.06 }}
            transition={{ duration: 1.4, ease: EASE_LONG }}
          >
            {/* The photograph, drifting almost imperceptibly. */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.12, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                opacity: { duration: 1.6, ease: EASE },
                scale: { duration: 16, ease: "linear" },
              }}
            >
              <Image
                src={cover.photo.src}
                alt={t(cover.photo.alt)}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 520px) 100vw, 480px"
                placeholder={blurData[cover.photo.src] ? "blur" : "empty"}
                blurDataURL={blurData[cover.photo.src]}
                /*
                 * Held out of focus so the names read cleanly over it. The
                 * overscan is what makes that possible: a blur samples beyond
                 * the element's edge and would otherwise leave a soft, pale
                 * border down all four sides. Tune the blur here — the scrim
                 * below carries the rest of the contrast.
                 */
                className="scale-[1.08] object-cover blur-[7px]"
              />
            </motion.div>

            {/*
              * A pale scrim rather than a dark one: the palette is light
              * throughout, so the cover lifts the photograph towards paper and
              * sets the type in ink. Deepen these stops and swap the ink
              * classes below for `paper` if the cover photograph is dark.
              */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-[rgba(251,253,255,0.66)] via-[rgba(233,244,252,0.44)] to-[rgba(251,253,255,0.82)]"
            />
            <div aria-hidden className="paper-grain absolute inset-0 opacity-20" />

            <motion.div
              className={cn(
                "relative flex h-full flex-col justify-between px-[var(--gutter)] py-[max(2rem,6svh)] text-ink",
                fontClass,
              )}
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.16, delayChildren: 0.5 } },
              }}
            >
              {/* The language pill lives in <LanguageBar>, above this cover. */}
              <span aria-hidden />

              <div className="flex flex-col items-center text-center">
                <motion.p
                  variants={item}
                  transition={{ duration: 1, ease: EASE }}
                  className="t-eyebrow text-primary"
                >
                  {t(cover.kicker)}
                </motion.p>

                <motion.div
                  variants={item}
                  transition={{ duration: 1, ease: EASE }}
                  className="mt-7 flex w-full max-w-[15rem] items-center gap-4"
                >
                  <span
                    aria-hidden
                    className="block h-px w-full bg-gradient-to-r from-transparent to-accent"
                  />
                  <Diamond size={4} className="shrink-0" />
                  <span
                    aria-hidden
                    className="block h-px w-full bg-gradient-to-l from-transparent to-accent"
                  />
                </motion.div>

                <motion.h1
                  variants={item}
                  transition={{ duration: 1.2, ease: EASE }}
                  className="mt-7 flex flex-col items-center"
                >
                  <Image
                    src="/kim.png"
                    alt={`${t(couple.bride.displayName)} & ${t(couple.groom.displayName)}`}
                    width={749}
                    height={563}
                    priority
                    sizes="(max-width: 520px) 60vw, 288px"
                    className="h-auto w-[min(60cqw,18rem)]"
                  />
                </motion.h1>

                <motion.p
                  variants={item}
                  transition={{ duration: 1, ease: EASE }}
                  className="t-eyebrow mt-8 text-muted"
                >
                  {t(dateLabel)}
                </motion.p>
              </div>

              <motion.div
                variants={item}
                transition={{ duration: 1, ease: EASE }}
                className="flex flex-col items-center"
              >
                <button
                  type="button"
                  onClick={open}
                  className="group rounded-full relative inline-flex min-h-[52px] cursor-pointer items-center justify-center overflow-hidden border border-primary/45 px-9 py-3.5 transition-colors duration-700 hover:border-primary"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-y-100"
                  />
                  <span className="t-eyebrow relative text-primary transition-colors duration-700 group-hover:text-paper">
                    {t(ui.cover.open)}
                  </span>
                </button>

              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
