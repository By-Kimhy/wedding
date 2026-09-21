"use client";

import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ui } from "@/data/i18n";
import { wedding, type StoryChapter } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

function Chapter({ chapter, index }: { chapter: StoryChapter; index: number }) {
  const { t, fontClass } = useLanguage();
  /* Alternating full-bleed and inset photographs give the scroll a rhythm. */
  const fullBleed = index % 2 === 0;

  return (
    <article className="relative">
      <Reveal distance={22} duration={1.05}>
        <div className={cn(fullBleed ? "" : "px-[var(--gutter)]")}>
          <Photo
            photo={chapter.photo}
            ratio={fullBleed ? "4/5" : "1/1"}
            sizes="(max-width: 520px) 100vw, 480px"
          />
        </div>
      </Reveal>

      <div className="relative mt-9 px-[var(--gutter)]">
        {/* A faint folio number, the way a printed book marks a chapter. */}
        <Reveal distance={0} duration={1.2} className="pointer-events-none">
          <span
            aria-hidden
            className="font-display absolute -top-4 right-[var(--gutter)] leading-none text-accent/20 select-none"
            style={{ fontSize: "clamp(4rem,22cqw,6rem)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </Reveal>

        <Reveal delay={0.06} className="relative">
          <p className={cn("t-eyebrow text-primary", fontClass)}>
            {chapter.year}
          </p>
          <h3 className={cn("t-heading mt-3 text-ink", fontClass)}>
            {t(chapter.title)}
          </h3>
          <span aria-hidden className="mt-5 block h-px w-10 bg-accent/50" />
          <p
            className={cn(
              "t-body text-balance-pretty mt-5 max-w-[34ch] text-muted",
              fontClass,
            )}
          >
            {t(chapter.body)}
          </p>
        </Reveal>
      </div>
    </article>
  );
}

/**
 * Four chapters told down the page: a photograph, a year, a couple of lines.
 * Deliberately not a timeline component — nothing here is a dot on a rail.
 */
export function Story() {
  return (
    <Section id="story" bleed ariaLabel="Our story">
      <div className="px-[var(--gutter)]">
        <SectionHeader eyebrow={ui.story.eyebrow} title={ui.story.title} />
      </div>

      <div className="mt-16 space-y-20">
        {wedding.story.map((chapter, index) => (
          <Chapter key={chapter.id} chapter={chapter} index={index} />
        ))}
      </div>
    </Section>
  );
}
