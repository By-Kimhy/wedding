"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type InvitationContextValue = {
  /** True once the guest has pressed "Open invitation". */
  opened: boolean;
  /** Opens the invitation and unlocks audio in the same user gesture. */
  open: () => void;
  /** Whether the guest wants the soundtrack playing. */
  musicOn: boolean;
  setMusicOn: (on: boolean) => void;
  toggleMusic: () => void;
  /** True while the wedding film is playing — the soundtrack ducks for it. */
  videoPlaying: boolean;
  setVideoPlaying: (playing: boolean) => void;
};

const InvitationContext = createContext<InvitationContextValue | null>(null);

export function InvitationProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  /* The page behind the cover must not scroll while the cover is up. */
  useEffect(() => {
    document.body.dataset.locked = opened ? "false" : "true";
    return () => {
      delete document.body.dataset.locked;
    };
  }, [opened]);

  /*
   * A guest who reloads mid-invitation should land back where they were, not
   * be thrown to the bottom of a page that is still covered.
   */
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const open = useCallback(() => {
    setOpened(true);
    /*
     * Autoplay policies only grant audio permission inside a user gesture, so
     * the intent to play is recorded here and the player acts on it.
     */
    setMusicOn(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /*
   * After the cover dissolves, walk the invitation from the hero to the
   * closing photograph at a steady pace. A guest who starts scrolling
   * themselves keeps control — we never steal the page back.
   */
  useEffect(() => {
    if (!opened) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let frame = 0;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;

    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousBehavior;
    };

    const listenId = window.setTimeout(() => {
      window.addEventListener("wheel", cancel, { passive: true });
      window.addEventListener("touchmove", cancel, { passive: true });
      window.addEventListener("pointerdown", cancel);
      window.addEventListener("keydown", cancel);
    }, 80);

    const startId = window.setTimeout(() => {
      if (cancelled) return;

      root.style.scrollBehavior = "auto";
      const startY = window.scrollY;
      const startedAt = performance.now();
      /* Slow enough to read as the page moves, not a skip to the footer. */
      const pixelsPerMs = 0.16;

      const tick = (now: number) => {
        if (cancelled) return;
        const maxY = Math.max(
          0,
          root.scrollHeight - window.innerHeight,
        );
        const nextY = Math.min(maxY, startY + (now - startedAt) * pixelsPerMs);
        window.scrollTo(0, nextY);
        if (nextY < maxY) {
          frame = requestAnimationFrame(tick);
          return;
        }
        root.style.scrollBehavior = previousBehavior;
      };

      frame = requestAnimationFrame(tick);
    }, 1400);

    return () => {
      cancel();
      window.clearTimeout(listenId);
      window.clearTimeout(startId);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
      window.removeEventListener("pointerdown", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, [opened]);

  const value = useMemo<InvitationContextValue>(
    () => ({
      opened,
      open,
      musicOn,
      setMusicOn,
      toggleMusic: () => setMusicOn((on) => !on),
      videoPlaying,
      setVideoPlaying,
    }),
    [opened, open, musicOn, videoPlaying],
  );

  return (
    <InvitationContext.Provider value={value}>
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation(): InvitationContextValue {
  const value = useContext(InvitationContext);
  if (!value) {
    throw new Error("useInvitation must be used inside <InvitationProvider>");
  }
  return value;
}
