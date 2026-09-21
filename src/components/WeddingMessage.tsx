"use client";

import { DiamondDivider } from "@/components/ui/Decor";
import { Lines, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { wedding } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

/** The quiet opening note, set centred with a lot of air around it. */
export function WeddingMessage() {
  const { fontClass } = useLanguage();

  return (
    <Section tight className="text-center">
      <Reveal distance={16} duration={0.9}>
        <Lines
          text={wedding.message}
          className={cn("t-lead text-balance-pretty text-ink/85", fontClass)}
        />
      </Reveal>

      <Reveal delay={0.15} className="mx-auto mt-12 max-w-[13rem]">
        <DiamondDivider />
      </Reveal>

      <Reveal delay={0.22} className="mt-12">
        <blockquote
          className={cn(
            "t-body text-balance-pretty text-muted italic",
            fontClass,
          )}
        >
          <Lines text={wedding.verse} />
        </blockquote>
      </Reveal>
    </Section>
  );
}
