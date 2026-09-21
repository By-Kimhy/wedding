"use client";

import { useMemo, useState } from "react";

import { Lightbox } from "@/components/ui/Lightbox";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ui } from "@/data/i18n";
import { wedding, type GalleryPhoto } from "@/data/wedding";
import { useLanguage } from "@/lib/language";

type Row =
  | { kind: "single"; photo: GalleryPhoto; at: number }
  | { kind: "pair"; photos: [GalleryPhoto, GalleryPhoto]; at: [number, number] };

/**
 * Walks the gallery once and groups consecutive `half` photos into two-up
 * rows. The rhythm — tall, pair, wide, tall, pair, wide — comes out of the
 * data rather than being hard-coded here.
 */
function buildRows(photos: GalleryPhoto[]): Row[] {
  const rows: Row[] = [];

  for (let i = 0; i < photos.length; i += 1) {
    const photo = photos[i];
    const next = photos[i + 1];

    if (photo.span === "half" && next?.span === "half") {
      rows.push({ kind: "pair", photos: [photo, next], at: [i, i + 1] });
      i += 1;
      continue;
    }

    rows.push({ kind: "single", photo, at: i });
  }

  return rows;
}

function Tile({
  photo,
  index,
  onOpen,
  sizes,
  ratio,
  delay = 0,
}: {
  photo: GalleryPhoto;
  index: number;
  onOpen: (index: number) => void;
  sizes: string;
  ratio?: string;
  delay?: number;
}) {
  const { t } = useLanguage();

  return (
    <Reveal distance={18} duration={1} delay={delay} className="min-w-0">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`${t(ui.gallery.open)} — ${t(photo.alt)}`}
        className="group relative block w-full cursor-pointer"
      >
        <Photo
          photo={photo}
          ratio={ratio}
          sizes={sizes}
          reveal={false}
          imageClassName="transition-transform duration-[1400ms] ease-[var(--ease-soft)] group-hover:scale-[1.05]"
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/10"
          />
        </Photo>
      </button>
    </Reveal>
  );
}

/**
 * The photography section. Deliberately not an even grid: tall frames, paired
 * squares and wide panoramas alternate so the scroll keeps its interest.
 */
export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const photos = wedding.gallery;
  const rows = useMemo(() => buildRows(photos), [photos]);

  return (
    <Section id="gallery" bleed ariaLabel="Gallery">
      <div className="px-[var(--gutter)]">
        <SectionHeader eyebrow={ui.gallery.eyebrow} title={ui.gallery.title} />
      </div>

      <div className="mt-14 flex flex-col gap-2">
        {rows.map((row) =>
          row.kind === "pair" ? (
            <div
              key={`pair-${row.at[0]}`}
              className="grid grid-cols-2 gap-2 px-2"
            >
              <Tile
                photo={row.photos[0]}
                index={row.at[0]}
                onOpen={setActive}
                sizes="(max-width: 520px) 48vw, 236px"
              />
              <Tile
                photo={row.photos[1]}
                index={row.at[1]}
                onOpen={setActive}
                sizes="(max-width: 520px) 48vw, 236px"
                delay={0.08}
              />
            </div>
          ) : (
            <div
              key={`single-${row.at}`}
              className={row.photo.span === "wide" ? "" : "px-2"}
            >
              <Tile
                photo={row.photo}
                index={row.at}
                onOpen={setActive}
                sizes="(max-width: 520px) 100vw, 480px"
              />
            </div>
          ),
        )}
      </div>

      <Lightbox
        photos={photos}
        index={active}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </Section>
  );
}
