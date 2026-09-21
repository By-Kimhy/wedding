"use client";

import type { ReactNode } from "react";

import type { Localized } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Diamond } from "./Decor";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Let the content run to the edge of the invitation (photography does). */
  bleed?: boolean;
  /** Trim the standard vertical rhythm for sections that sit close together. */
  tight?: boolean;
  ariaLabel?: string;
};

export function Section({
  id,
  children,
  className,
  bleed = false,
  tight = false,
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "relative w-full",
        !bleed && "px-[var(--gutter)]",
        tight
          ? "py-[calc(var(--section-gap)*0.55)]"
          : "py-[var(--section-gap)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Renders copy that was authored with newlines: single newlines become line
 * breaks, blank lines become a new paragraph.
 */
export function Lines({
  text,
  className,
  paragraphClassName,
  /** Use "span" inside headings, where a <p> would be invalid markup. */
  as = "p",
}: {
  text: Localized | string;
  className?: string;
  paragraphClassName?: string;
  as?: "p" | "span";
}) {
  const { t } = useLanguage();
  const paragraphs = t(text).split("\n\n");
  const Paragraph = as;

  return (
    <span className={cn("block", className)}>
      {paragraphs.map((paragraph, index) => (
        <Paragraph
          key={index}
          className={cn(
            as === "span" && "block",
            index > 0 && "mt-[1.1em]",
            paragraphClassName,
          )}
        >
          {paragraph.split("\n").map((line, lineIndex, all) => (
            <span key={lineIndex}>
              {line}
              {lineIndex < all.length - 1 && <br />}
            </span>
          ))}
        </Paragraph>
      ))}
    </span>
  );
}

/** The small letterspaced label that opens each section. */
export function Eyebrow({
  text,
  className,
  withMarks = true,
}: {
  text: Localized | string;
  className?: string;
  withMarks?: boolean;
}) {
  const { t, fontClass } = useLanguage();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-primary",
        fontClass,
        "t-eyebrow",
        className,
      )}
    >
      {withMarks && <Diamond size={4} className="shrink-0 opacity-70" />}
      {t(text)}
      {withMarks && <Diamond size={4} className="shrink-0 opacity-70" />}
    </span>
  );
}

/** Eyebrow plus display title, the standard opening of a section. */
export function SectionHeader({
  eyebrow,
  title,
  align = "center",
  className,
  children,
}: {
  eyebrow?: Localized | string;
  title?: Localized | string;
  align?: "center" | "left";
  className?: string;
  children?: ReactNode;
}) {
  const { fontClass } = useLanguage();

  return (
    <header
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal distance={12} duration={0.7}>
          <Eyebrow text={eyebrow} />
        </Reveal>
      )}
      {title && (
        <Reveal delay={0.08} className="mt-5">
          <h2 className={cn("t-title text-ink text-balance-pretty", fontClass)}>
            <Lines as="span" text={title} />
          </h2>
        </Reveal>
      )}
      {children}
    </header>
  );
}
