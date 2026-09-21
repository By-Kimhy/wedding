"use client";

import { useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

import { wedding, type PetalPiece } from "@/data/wedding";
import { useIsClient } from "@/lib/client";

type Petal = {
  key: number;
  src: string;
  style: CSSProperties;
};

const between = (min: number, max: number) => min + Math.random() * (max - min);

/** Picks a piece, respecting the relative `weight` of each. */
function pickPiece(pieces: PetalPiece[]): PetalPiece {
  const total = pieces.reduce((sum, piece) => sum + piece.weight, 0);
  let roll = Math.random() * total;

  for (const piece of pieces) {
    roll -= piece.weight;
    if (roll <= 0) return piece;
  }

  return pieces[pieces.length - 1];
}

function buildPetals(count: number, pieces: PetalPiece[]): Petal[] {
  if (pieces.length === 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const piece = pickPiece(pieces);
    const size = between(piece.minSize, piece.maxSize);

    /*
     * Each petal gets its own lane across the width, jittered inside it, so
     * they scatter instead of clumping in one column.
     */
    const lane = ((index + between(0.1, 0.9)) / count) * 100;

    /* Smaller pieces fall further away: slower, fainter, slightly blurred. */
    const depth = (size - piece.minSize) / (piece.maxSize - piece.minSize || 1);
    const fall = between(30, 50) - depth * 6;

    /*
     * Sideways travel is measured against the invitation column, not the
     * window, so a petal drifts the same distance on a phone as it does
     * inside the card on a desktop. Petals starting near an edge are nudged
     * back towards the middle, so they do not simply drift out and vanish.
     */
    const inward = ((50 - lane) / 50) * 6;
    const drift = between(-10, 10) + inward;

    return {
      key: index,
      src: piece.src,
      style: {
        left: `${lane}%`,
        width: `${size}px`,
        filter: depth < 0.35 ? `blur(${(0.35 - depth) * 2.4}px)` : undefined,
        "--fall": `${fall}s`,
        "--flutter": `${between(3.2, 6.4)}s`,
        /*
         * A negative delay starts each petal partway through its fall, so the
         * air is already full when the invitation opens instead of filling up
         * over the first half minute.
         */
        "--delay": `${-between(0, fall)}s`,
        "--drift": `${drift.toFixed(1)}cqw`,
        "--sway": `${between(6, 18)}px`,
        "--peak": `${between(piece.maxOpacity * 0.45, piece.maxOpacity).toFixed(2)}`,
        "--spin-from": `${between(-25, 25)}deg`,
        "--spin-mid": `${between(120, 260) * (Math.random() < 0.5 ? -1 : 1)}deg`,
        "--spin-to": `${between(-25, 25)}deg`,
      } as CSSProperties,
    };
  });
}

/**
 * Romduol blossoms and 囍 drifting down over the invitation.
 *
 * The layout is random, so it is generated in the browser only — the server
 * renders nothing and there is no hydration mismatch. Guests who ask for
 * reduced motion get no falling anything.
 */
export function PetalRain() {
  const { petals } = wedding.decor;
  const isClient = useIsClient();
  const reduced = useReducedMotion();
  const [pieces] = useState(() => buildPetals(petals.count, petals.pieces));

  if (!petals.enabled || !isClient || reduced || pieces.length === 0) {
    return null;
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[55]">
      {/* Clipped to the card, so nothing falls past its edges on a desktop. */}
      <div className="invitation-column relative h-full overflow-hidden">
        {pieces.map((petal) => (
          <span key={petal.key} className="petal" style={petal.style}>
            {/*
              * A plain <img> on purpose. These are two tiny source files (4KB
              * and 5KB) reused across every petal and fetched once each; one
              * of them is an SVG, which next/image can only touch behind the
              * `dangerouslyAllowSVG` flag. The optimiser has nothing to add.
              */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={petal.src} alt="" decoding="async" draggable={false} />
          </span>
        ))}
      </div>
    </div>
  );
}
