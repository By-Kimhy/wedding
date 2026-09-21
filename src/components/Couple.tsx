"use client";

import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { VerticalRule } from "@/components/ui/Decor";
import { ui } from "@/data/i18n";
import { wedding, type Localized, type Photo as PhotoData } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

type PersonProps = {
  role: Localized;
  displayName: Localized;
  fullName: Localized;
  note: Localized;
  photo: PhotoData;
  /** "left" puts the photograph against the left edge of the invitation. */
  side: "left" | "right";
};

function Person({ role, displayName, fullName, note, photo, side }: PersonProps) {
  const { t, fontClass } = useLanguage();
  const isLeft = side === "left";

  return (
    <article className="relative">
      <Reveal distance={20} duration={1}>
        <div className={cn("w-[82%]", isLeft ? "mr-auto" : "ml-auto")}>
          <Photo
            photo={photo}
            ratio="4/5"
            sizes="(max-width: 520px) 82vw, 394px"
            className="shadow-[0_18px_50px_-28px_rgba(22,39,63,0.55)]"
          />
        </div>
      </Reveal>

      <Reveal
        delay={0.12}
        className={cn(
          "relative mt-7 px-[var(--gutter)]",
          isLeft ? "text-right" : "text-left",
        )}
      >
        {/* A hairline that runs under the name, from the outer edge inwards. */}
        <span
          aria-hidden
          className={cn(
            "absolute top-2 block h-px w-10 bg-line",
            isLeft ? "right-[var(--gutter)]" : "left-[var(--gutter)]",
          )}
        />

        <p className={cn("t-eyebrow pt-7 text-primary", fontClass)}>{t(role)}</p>

        <h3
          className={cn("t-title mt-3 text-ink", fontClass)}
          aria-label={t(fullName)}
        >
          {t(displayName)}
        </h3>

        <p className={cn("t-caption mt-2 text-secondary", fontClass)}>
          {t(fullName)}
        </p>

        <p className={cn("t-body mt-4 text-muted", fontClass)}>{t(note)}</p>
      </Reveal>
    </article>
  );
}

/**
 * The bride and the groom, presented as two facing editorial spreads rather
 * than a pair of profile cards.
 */
export function Couple() {
  const { bride, groom } = wedding.couple;

  return (
    <Section id="couple" bleed ariaLabel="The couple">
      <div className="px-[var(--gutter)]">
        <SectionHeader eyebrow={ui.couple.eyebrow} />
      </div>

      <div className="mt-14 space-y-16">
        <Person
          side="left"
          role={ui.couple.bride}
          displayName={bride.displayName}
          fullName={bride.fullName}
          note={bride.note}
          photo={bride.photo}
        />

        <Reveal distance={0} duration={1.2}>
          <VerticalRule height="4.5rem" />
        </Reveal>

        <Person
          side="right"
          role={ui.couple.groom}
          displayName={groom.displayName}
          fullName={groom.fullName}
          note={groom.note}
          photo={groom.photo}
        />
      </div>
    </Section>
  );
}
