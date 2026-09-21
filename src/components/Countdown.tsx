"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Calendar } from "@/components/Calendar";
import { Sprig } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { Lines, Section } from "@/components/ui/Section";
import { ui } from "@/data/i18n";
import { weddingDate } from "@/data/wedding";
import { useClockSeconds } from "@/lib/client";
import { useLanguage } from "@/lib/language";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const TARGET = weddingDate.getTime();

function remainingFrom(now: number): Remaining | null {
  const delta = TARGET - now;
  if (delta <= 0) return null;

  const seconds = Math.floor(delta / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

const pad = (value: number) => value.toString().padStart(2, "0");

function Unit({ value, label }: { value: string; label: string }) {
  const { fontClass } = useLanguage();

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <span
        className="font-display tabular block leading-none text-ink"
        style={{ fontSize: "clamp(1.9rem,10.5cqw,3rem)" }}
      >
        {value}
      </span>
      <span
        className={cn(
          "mt-3 block text-center text-[0.58rem] leading-tight font-medium tracking-[0.18em] text-muted uppercase",
          fontClass,
        )}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * The countdown. Rendered as four numerals on the paper — no dashboard tiles,
 * no boxes. The server renders placeholder dashes and the browser fills them
 * in, so the markup never disagrees with the client's clock.
 */
export function Countdown() {
  const { t, fontClass } = useLanguage();
  /* `null` until the page is running in the browser, then ticks each second. */
  const seconds = useClockSeconds();
  const remaining = seconds === null ? null : remainingFrom(seconds * 1000);
  const arrived = seconds !== null && remaining === null;

  return (
    <Section className="text-center" ariaLabel="Countdown to the wedding day">
      <Reveal distance={12} duration={0.8}>
        <Sprig className="mx-auto text-accent/70" width={44} />
      </Reveal>

      <Reveal delay={0.08} className="mt-8">
        <h2 className={cn("t-title text-ink", fontClass)}>
          <Lines as="span" text={ui.countdown.title} />
        </h2>
      </Reveal>

      <Reveal delay={0.16} className="mt-12">
        <AnimatePresence mode="wait" initial={false}>
          {arrived ? (
            <motion.p
              key="today"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className={cn("t-heading text-primary", fontClass)}
            >
              {t(ui.countdown.today)}
            </motion.p>
          ) : (
            <motion.div
              key="counting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex items-start justify-center gap-1"
              /*
               * `aria-live="off"` on purpose: a per-second announcement would
               * make the invitation unusable with a screen reader. The date
               * below carries the same information.
               */
              aria-live="off"
            >
              <Unit
                value={remaining ? String(remaining.days) : "—"}
                label={t(ui.countdown.days)}
              />
              <Unit
                value={remaining ? pad(remaining.hours) : "—"}
                label={t(ui.countdown.hours)}
              />
              <Unit
                value={remaining ? pad(remaining.minutes) : "—"}
                label={t(ui.countdown.minutes)}
              />
              <Unit
                value={remaining ? pad(remaining.seconds) : "—"}
                label={t(ui.countdown.seconds)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>

      <div className="mt-6">
        <Calendar />
      </div>
    </Section>
  );
}
