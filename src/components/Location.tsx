"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Lines, Section, SectionHeader } from "@/components/ui/Section";
import { ui } from "@/data/i18n";
import { wedding } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

/**
 * Where the day happens. The map preview is a still image framed like the rest
 * of the photography — no third-party embed, so nothing is loaded from another
 * origin and nothing shifts as the page settles.
 */
export function Location() {
  const { t, fontClass } = useLanguage();
  const { location } = wedding;

  return (
    <Section id="location" ariaLabel="The venue">
      <SectionHeader eyebrow={ui.location.eyebrow} />

      <Reveal delay={0.06} className="mt-10 text-center">
        <h3 className={cn("t-title text-ink", fontClass)}>{t(location.venue)}</h3>
        <Lines
          text={location.address}
          className={cn(
            "t-body text-balance-pretty mt-5 text-muted",
            fontClass,
          )}
        />
      </Reveal>

      <Reveal delay={0.12} className="mt-12">
        <a
          href={location.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t(ui.location.openMaps)} — ${t(location.venue)}`}
          className="group relative block"
        >
          <Photo
            photo={location.mapPreview}
            ratio="8/5"
            sizes="(max-width: 520px) 100vw, 480px"
          >
            {/* A tint of the accent keeps the map inside the invitation's palette. */}
            <span
              aria-hidden
              className="absolute inset-0 bg-[var(--color-accent)] opacity-[0.07] transition-opacity duration-700 group-hover:opacity-0"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[0.65rem] border border-paper/45"
            />
          </Photo>
        </a>
      </Reveal>

      <Reveal delay={0.18} className="mt-10 flex flex-col items-center">
        <ButtonLink
          href={location.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(ui.location.openMaps)}
        </ButtonLink>

        <p className={cn("t-caption mt-7 text-center text-secondary", fontClass)}>
          {t(location.note)}
        </p>
      </Reveal>
    </Section>
  );
}
