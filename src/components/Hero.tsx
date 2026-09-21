"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Sprig } from "@/components/ui/Decor";
import { ParallaxPhoto } from "@/components/ui/ParallaxPhoto";
import { Reveal } from "@/components/ui/Reveal";
import { wedding } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { EASE, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The first thing behind the cover: one tall photograph, then the two names
 * set large on paper. No navigation bar — the invitation opens the way a
 * printed one does.
 */
export function Hero() {
  const { t, fontClass } = useLanguage();
  const { hero, couple, dateShort, dayOfWeek } = wedding;

  return (
    <section id="home" className="relative">
      <ParallaxPhoto
        photo={hero.photo}
        ratio="3/4.1"
        priority
        strength={9}
        className="w-full"
      >
        {/* The photograph dissolves into the paper rather than stopping hard. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-canvas"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[0.9rem] border border-paper/25"
        />
      </ParallaxPhoto>

      <div className="relative px-[var(--gutter)] pt-8 pb-[var(--section-gap)] text-center">
        <Reveal distance={14} duration={0.8}>
          <Sprig className="mx-auto text-accent/80" width={52} />
        </Reveal>

        <h1 className={cn("mt-8 flex flex-col items-center", fontClass)}>
          <Reveal delay={0.05}>
            <Image
              src="/kim.png"
              alt={`${t(couple.bride.displayName)} & ${t(couple.groom.displayName)}`}
              width={749}
              height={563}
              sizes="(max-width: 520px) 60vw, 288px"
              className="h-auto w-[min(60cqw,18rem)]"
            />
          </Reveal>
        </h1>

        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.1, delay: 0.42, ease: EASE }}
          className="mx-auto mt-10 block h-px w-24 origin-center bg-line"
        />

        <Reveal delay={0.5} distance={12}>
          <p className={cn("t-eyebrow mt-8 text-primary", fontClass)}>
            {t(dateShort)}
          </p>
          <p className={cn("t-caption mt-3 text-muted", fontClass)}>
            {t(dayOfWeek)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
