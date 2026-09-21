"use client";

import { languageShortNames, ui } from "@/data/i18n";
import { LANGUAGES, type Lang } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

/*
 * Khmer clusters stack marks above and below the line, and Chinese glyphs
 * carry more detail than Latin caps, so both need a little more size than the
 * English label to stay legible at this scale.
 */
const faceFor: Record<Lang, string> = {
  /* A control label, so plain rather than the page's script face. */
  en: "font-ui text-[0.72rem] tracking-[0.1em]",
  zh: "font-zh text-[0.8rem]",
  kh: "font-kh text-[0.86rem]",
};

const htmlLangFor: Record<Lang, string> = {
  en: "en",
  zh: "zh-Hans",
  kh: "km",
};

/**
 * ENG · 中文 · ខ្មែរ
 *
 * A segmented pill, so it stays readable wherever it sits — over a photograph
 * or over paper. Switching is pure React state: the page is never reloaded and
 * the guest keeps their place in the invitation.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t(ui.language.label)}
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-line bg-canvas/85 p-1 shadow-[var(--shadow-float)] backdrop-blur-md",
        className,
      )}
    >
      {LANGUAGES.map((code) => {
        const active = lang === code;

        return (
          <button
            key={code}
            type="button"
            lang={htmlLangFor[code]}
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={cn(
              "cursor-pointer rounded-full px-3 py-1.5 leading-[1.5] font-medium transition-colors duration-[400ms]",
              faceFor[code],
              active
                ? "bg-primary/12 text-primary"
                : "text-muted hover:text-primary",
            )}
          >
            {languageShortNames[code]}
          </button>
        );
      })}
    </div>
  );
}
