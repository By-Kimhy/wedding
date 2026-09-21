import { cn } from "@/lib/utils";

/** A hairline that fades out at both ends. */
export function Rule({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block rule-x w-full", className)} />;
}

/** A short vertical hairline, used to lead the eye between sections. */
export function VerticalRule({
  className,
  height = "4rem",
}: {
  className?: string;
  height?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("block rule-y mx-auto", className)}
      style={{ height }}
    />
  );
}

/** A small rotated square — the invitation's recurring punctuation mark. */
export function Diamond({
  className,
  size = 5,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden
      className={cn("block rotate-45 bg-accent/70", className)}
      style={{ width: size, height: size }}
    />
  );
}

/** Three leaves on the right of the stem; mirrored for the left. */
const leaves = (
  <g fill="currentColor" opacity="0.6">
    <path d="M12 24.6C15.6 23.7 18.2 21 18.9 18C15.4 18.7 12.9 21.2 12 24.6Z" />
    <path d="M12 18.4C15.2 17.6 17.5 15.2 18.1 12.5C15 13.1 12.8 15.4 12 18.4Z" />
    <path d="M12 12.8C14.7 12.1 16.6 10.1 17.1 7.9C14.6 8.4 12.7 10.4 12 12.8Z" />
  </g>
);

/**
 * A small original sprig: one stem, three pairs of leaves and a closed bud.
 * The invitation's only figurative mark, used sparingly so the photography
 * keeps the attention.
 */
export function Sprig({
  className,
  width = 46,
}: {
  className?: string;
  width?: number;
}) {
  /* The mark is drawn upright; the width prop sets its height to match. */
  const height = (width * 30) / 24;

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 30"
      width={width * 0.8}
      height={height * 0.8}
      fill="none"
      className={cn("text-accent", className)}
    >
      <path
        d="M12 29.5V6.8"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.8"
      />
      {leaves}
      <g transform="translate(24 0) scale(-1 1)">{leaves}</g>
      <path
        d="M12 7.2C10.5 5.3 10.6 2.9 12 1.1C13.4 2.9 13.5 5.3 12 7.2Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

/** A rule broken by a sprig in the middle. */
export function SprigDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex w-full items-center gap-4 text-accent", className)}
    >
      <Rule />
      <Sprig className="shrink-0" />
      <Rule />
    </div>
  );
}

/** A rule broken by a diamond, for tighter spaces. */
export function DiamondDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex w-full items-center gap-3", className)}>
      <Rule />
      <Diamond className="shrink-0" />
      <Rule />
    </div>
  );
}

