"use client";

import { ParallaxPhoto } from "@/components/ui/ParallaxPhoto";
import { Reveal } from "@/components/ui/Reveal";
import { ui } from "@/data/i18n";
import { wedding } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

/**
 * The last page. One full photograph, four short lines, and a slow fade in
 * from the paper above so the invitation closes rather than simply stopping.
 */
export function Footer() {
  const { t, fontClass } = useLanguage();
  const { closing, couple, dateLabel } = wedding;

  return (
    <footer className="relative z-[1] isolate">
      <ParallaxPhoto
        photo={closing.photo}
        ratio="9/15"
        strength={8}
        className="w-full"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[rgba(22,39,63,0.7)] via-[rgba(29,63,112,0.46)] to-[rgba(18,36,62,0.82)]"
        />
        {/* Dissolve out of the paper above. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-canvas to-transparent"
        />
        <div aria-hidden className="paper-grain absolute inset-0 opacity-25" />

        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center px-[var(--gutter)] text-center text-paper",
            fontClass,
          )}
        >
          <Reveal distance={16} duration={1}>
            <p className="t-eyebrow text-paper/70">{t(ui.closing.thankYou)}</p>
          </Reveal>

          <Reveal delay={0.12} className="mt-7">
            <p className="t-lead text-balance-pretty max-w-[24ch] text-paper/90">
              {t(ui.closing.line)}
            </p>
          </Reveal>

          <Reveal delay={0.22} className="mt-14">
            <span aria-hidden className="mx-auto block h-px w-12 bg-paper/40" />
          </Reveal>

          <Reveal delay={0.3} className="mt-12">
            <p className="t-title text-paper">
              {t(couple.bride.displayName)}
              <span aria-hidden className="mx-3 text-paper/60">
                &amp;
              </span>
              {t(couple.groom.displayName)}
            </p>
            <p className="t-eyebrow mt-6 text-paper/70">{t(dateLabel)}</p>
          </Reveal>

          <Reveal delay={0.4} className="mt-16">
            <a
              href="#home"
              className="t-caption text-[0.62rem] tracking-[0.3em] text-paper/50 uppercase transition-colors duration-500 hover:text-paper"
            >
              {t(ui.closing.backToTop)}
            </a>
          </Reveal>
        </div>
      </ParallaxPhoto>
    </footer>
  );
}
