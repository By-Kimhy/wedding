"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ui } from "@/data/i18n";
import { wedding, type ScheduleItem } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

function Entry({ item, index }: { item: ScheduleItem; index: number }) {
  const { t, fontClass } = useLanguage();

  return (
    <Reveal
      as="li"
      delay={Math.min(index, 5) * 0.06}
      distance={16}
      className={cn(
        "relative grid grid-cols-[13px_1fr] gap-x-5 pb-11 last:pb-0",
        fontClass,
      )}
    >
      {/* A ring on the rail, filled to mark the hour. */}
      <span aria-hidden className="relative mt-[0.45rem] size-[13px]">
        <span className="absolute inset-0 rounded-full border border-accent bg-canvas" />
        <span className="absolute inset-[3.5px] rounded-full bg-primary" />
      </span>

      <div className="min-w-0">
        {/* A time a guest has to act on, so plain rather than script. */}
        <p className="font-ui t-caption text-[0.72rem] tracking-[0.16em] text-muted">
          {t(item.time)}
        </p>
        <h3 className="t-heading text-balance-pretty mt-1.5 text-ink">
          {t(item.title)}
        </h3>
        {item.note && (
          <p className="t-body text-balance-pretty mt-2 text-secondary">
            {t(item.note)}
          </p>
        )}
      </div>
    </Reveal>
  );
}

/**
 * The running order of the day, from the first guests arriving to the last of
 * the celebration. It sits after the venue, so a guest reads *where* and then
 * *when*.
 */
export function Schedule() {
  const { t, fontClass } = useLanguage();

  return (
    <Section id="schedule" className="bg-surface/55" ariaLabel="Wedding schedule">
      <SectionHeader eyebrow={ui.schedule.eyebrow} title={ui.schedule.title}>
        <Reveal delay={0.14} className="mt-6">
          <p className={cn("t-body text-balance-pretty text-muted", fontClass)}>
            {t(ui.schedule.intro)}
          </p>
        </Reveal>
      </SectionHeader>

      <ol className="relative mt-14">
        {/*
          * The rail runs behind the rings, stopping short at both ends so the
          * timeline fades in and out rather than being cut off.
          */}
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-1.5 w-px bg-gradient-to-b from-transparent via-accent to-aqua"
        />

        {wedding.schedule.map((item, index) => (
          <Entry key={item.id} item={item} index={index} />
        ))}
      </ol>
    </Section>
  );
}
