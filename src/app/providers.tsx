"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

import { InvitationProvider } from "@/lib/invitation";
import { LanguageProvider } from "@/lib/language";

/**
 * `reducedMotion="user"` makes Framer drop every transform animation for
 * guests whose system asks for less motion, while still fading content in, so
 * nothing ever appears without warning or moves when it shouldn't.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <InvitationProvider>{children}</InvitationProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
