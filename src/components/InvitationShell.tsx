"use client";

import { motion } from "framer-motion";

import { Countdown } from "@/components/Countdown";
import { Couple } from "@/components/Couple";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { LanguageBar } from "@/components/LanguageBar";
import { InvitationCover } from "@/components/InvitationCover";
import { Location } from "@/components/Location";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PetalRain } from "@/components/PetalRain";
import { Schedule } from "@/components/Schedule";
import { Story } from "@/components/Story";
import { Video } from "@/components/Video";
import { WeddingMessage } from "@/components/WeddingMessage";
import { Wishes } from "@/components/Wishes";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { ui } from "@/data/i18n";
import { useInvitation } from "@/lib/invitation";
import { useLanguage } from "@/lib/language";
import { EASE_LONG } from "@/lib/motion";

/**
 * The invitation itself: one continuous column of paper that runs from the
 * hero to the closing photograph, with the cover sealed over the top of it
 * until the guest opens it.
 */
export function InvitationShell() {
  const { opened } = useInvitation();
  const { t } = useLanguage();

  return (
    <>
      <PageBackdrop />

      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:z-[60] focus:-translate-x-1/2 focus:bg-canvas focus:px-5 focus:py-3 focus:text-primary"
      >
        {t(ui.common.skipToContent)}
      </a>

      <motion.div
        className="invitation-column relative min-h-screen-s bg-canvas shadow-[var(--shadow-page)]"
        initial={{ opacity: 0, y: 26 }}
        animate={opened ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 1.3, delay: opened ? 0.35 : 0, ease: EASE_LONG }}
        /* Keyboard focus must not reach the invitation while it is covered. */
        inert={!opened}
      >
        <main className="relative z-[1]">
          <Hero />
          <WeddingMessage />
          <Couple />
          <Story />
          <Countdown />
          <Gallery />
          <Video />
          <Location />
          <Schedule />
          <Wishes />
        </main>

        <Footer />
      </motion.div>

      <InvitationCover />
      <LanguageBar />
      <MusicPlayer />
      {/* Above the cover, so the petals are already falling when it opens. */}
      <PetalRain />
    </>
  );
}
