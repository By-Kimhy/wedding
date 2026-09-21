"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, Section } from "@/components/ui/Section";
import { ui } from "@/data/i18n";
import { wedding } from "@/data/wedding";
import { useInvitation } from "@/lib/invitation";
import { useLanguage } from "@/lib/language";
import { parseVideo, subscribeToEmbedPlayback } from "@/lib/video";
import { cn } from "@/lib/utils";

export function Video() {
  const { t, fontClass } = useLanguage();
  const { setVideoPlaying } = useInvitation();
  const [playing, setPlaying] = useState(false);
  const { video } = wedding;

  if (!video.enabled) return null;

  const source = parseVideo(video.url);
  if (source.kind === "unknown") return null;

  return (
    <Section bleed ariaLabel={t(video.title)}>
      <div className="px-[var(--gutter)] text-center">
        <Reveal distance={12} duration={0.8}>
          <Eyebrow text={ui.video.eyebrow} />
        </Reveal>
        <Reveal delay={0.08} className="mt-5">
          <h2 className={cn("t-title text-ink", fontClass)}>{t(video.title)}</h2>
        </Reveal>
      </div>

      <Reveal delay={0.14} className="mt-12">
        <div className="relative aspect-video w-full overflow-hidden bg-ink">
          {playing ? (
            source.kind === "file" ? (
              <FilePlayer src={source.src} poster={video.poster.src} />
            ) : (
              <EmbedPlayer
                kind={source.kind}
                embedUrl={source.embedUrl}
                title={t(video.title)}
              />
            )
          ) : (
            <button
              type="button"
              onClick={() => {
                setPlaying(true);
                setVideoPlaying(true);
              }}
              aria-label={t(ui.video.play)}
              className="group absolute inset-0 h-full w-full cursor-pointer"
            >
              <Photo
                photo={video.poster}
                ratio="16/9"
                reveal={false}
                sizes="(max-width: 520px) 100vw, 480px"
                className="h-full w-full"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[rgba(22,39,63,0.42)] transition-colors duration-700 group-hover:bg-[rgba(22,39,63,0.18)]"
                />
              </Photo>

              <span className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                <motion.span
                  aria-hidden
                  className="relative flex size-[4.25rem] items-center justify-center rounded-full border border-paper/60"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* A slow halo, the only looping animation on the page. */}
                  <motion.span
                    className="absolute inset-0 rounded-full border border-paper/40"
                    animate={{ scale: [1, 1.45], opacity: [0.5, 0] }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="ml-1 text-paper"
                  >
                    <path d="M7 4.5 19.5 12 7 19.5z" />
                  </svg>
                </motion.span>

                <span
                  className={cn(
                    "t-eyebrow text-[0.65rem] text-paper/85",
                    fontClass,
                  )}
                >
                  {t(video.caption)}
                </span>
              </span>
            </button>
          )}
        </div>
      </Reveal>
    </Section>
  );
}

function FilePlayer({ src, poster }: { src: string; poster: string }) {
  const { setVideoPlaying } = useInvitation();

  useEffect(() => {
    setVideoPlaying(true);
    return () => setVideoPlaying(false);
  }, [setVideoPlaying]);

  return (
    <video
      src={src}
      poster={poster}
      controls
      autoPlay
      playsInline
      className="h-full w-full object-cover"
      onPlay={() => setVideoPlaying(true)}
      onPause={() => setVideoPlaying(false)}
      onEnded={() => setVideoPlaying(false)}
    />
  );
}

function EmbedPlayer({
  kind,
  embedUrl,
  title,
}: {
  kind: "youtube" | "vimeo";
  embedUrl: string;
  title: string;
}) {
  const { setVideoPlaying } = useInvitation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const src =
    kind === "youtube"
      ? `${embedUrl}&origin=${encodeURIComponent(window.location.origin)}`
      : embedUrl;

  useEffect(() => {
    setVideoPlaying(true);
    const iframe = iframeRef.current;
    if (!iframe) return;
    const unsubscribe = subscribeToEmbedPlayback(iframe, kind, setVideoPlaying);
    return () => {
      unsubscribe();
      setVideoPlaying(false);
    };
  }, [kind, setVideoPlaying]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="h-full w-full border-0"
    />
  );
}
