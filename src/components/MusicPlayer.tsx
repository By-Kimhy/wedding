"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ui } from "@/data/i18n";
import { wedding } from "@/data/wedding";
import { useInvitation } from "@/lib/invitation";
import { useLanguage } from "@/lib/language";
import { EASE } from "@/lib/motion";

/**
 * Five bars that breathe while the track plays, struck through when it does
 * not — so the control says which state it is in, not just what it will do.
 */
function Bars({ playing }: { playing: boolean }) {
  const heights = [0.45, 0.85, 0.6, 1, 0.5];

  return (
    <span aria-hidden className="relative flex h-4 items-end gap-[2px]">
      {heights.map((peak, index) => (
        <motion.span
          key={index}
          className="w-[2px] origin-bottom bg-current"
          style={{ height: "100%" }}
          animate={
            playing
              ? { scaleY: [0.25, peak, 0.35, peak * 0.8, 0.25] }
              : /* At rest the bars keep their shape, so the slash reads as
                   struck through an equaliser rather than floating above it. */
                { scaleY: peak * 0.62 }
          }
          transition={
            playing
              ? {
                  duration: 1.8 + index * 0.22,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : { duration: 0.4, ease: EASE }
          }
        />
      ))}

      <motion.span
        className="absolute top-1/2 left-1/2 h-[1.5px] w-[22px] rounded-full bg-current"
        style={{ rotate: -35, x: "-50%", y: "-50%" }}
        initial={false}
        animate={{ scaleX: playing ? 0 : 1, opacity: playing ? 0 : 1 }}
        transition={{ duration: 0.35, ease: EASE }}
      />
    </span>
  );
}

/**
 * A small floating control for the soundtrack.
 *
 * Nothing is fetched and nothing plays until the guest opens the invitation —
 * that click is the user gesture browsers require before audio may start.
 */
export function MusicPlayer() {
  const { opened, musicOn, setMusicOn, toggleMusic, videoPlaying } =
    useInvitation();
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [available, setAvailable] = useState(true);
  const { music } = wedding;
  const audible = opened && musicOn && !videoPlaying;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !opened) return;

    if (!musicOn) {
      audio.pause();
      return;
    }

    /*
     * Mute rather than pause while the film is on: restoring volume does not
     * need a fresh user gesture, whereas play() after the YouTube player
     * pauses often does.
     */
    audio.volume = videoPlaying ? 0 : music.volume;
    if (audio.paused) {
      audio.play().catch(() => {
        setMusicOn(false);
      });
    }
  }, [opened, musicOn, videoPlaying, music.volume, setMusicOn]);

  if (!music.enabled || !available) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={music.url}
        loop
        preload="none"
        onError={() => setAvailable(false)}
        aria-hidden
      />

      <AnimatePresence>
        {opened && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[60]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          >
            <div className="invitation-column relative h-full">
              <button
                type="button"
                onClick={toggleMusic}
                aria-pressed={musicOn}
                aria-label={t(musicOn ? ui.music.pause : ui.music.play)}
                title={t(music.title)}
                className="pointer-events-auto absolute top-[max(1rem,env(safe-area-inset-top))] right-[var(--gutter)] flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-canvas/85 text-primary shadow-[var(--shadow-float)] backdrop-blur-md transition-colors duration-500 hover:border-primary/60 hover:text-ink"
              >
                {/* A slow halo while the music is on. */}
                {audible && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-primary/35"
                    animate={{ scale: [1, 1.5], opacity: [0.45, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <Bars playing={audible} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
