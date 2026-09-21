"use client";

import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ui } from "@/data/i18n";
import { wedding, type Localized } from "@/data/wedding";
import { useIsClient } from "@/lib/client";
import { useLanguage } from "@/lib/language";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Wish = {
  id: string;
  name: string;
  message: string | Localized;
  /** ISO timestamp; absent on the wishes seeded in `wedding.ts`. */
  at?: string;
};

const STORAGE_KEY = "invitation:wishes";

const fieldClass =
  "w-full min-h-[48px] border-b border-line bg-transparent py-3 text-ink " +
  "placeholder:text-secondary/70 outline-none transition-colors duration-500 " +
  "focus:border-primary";

/* Read once per visit, then kept in step with whatever this guest adds. */
let cached: Wish[] | undefined;

function loadLocal(): Wish[] {
  if (cached) return cached;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cached = raw ? (JSON.parse(raw) as Wish[]) : [];
  } catch {
    cached = [];
  }

  return cached;
}

function saveLocal(wishes: Wish[]) {
  cached = wishes;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
  } catch {
    // Storage is unavailable; the wish still shows for this visit.
  }
}

/**
 * The guest book. Wishes are set as plain type separated by hairlines — no
 * bubbles, no avatars, nothing that would make the page feel like a feed.
 */
export function Wishes() {
  const { t, lang, fontClass } = useLanguage();
  const formId = useId();
  const { wishes: config } = wedding;

  const seeded: Wish[] = config.seed.map((wish, index) => ({
    id: `seed-${index}`,
    name: wish.name,
    message: wish.message,
  }));

  /*
   * Wishes stored on this device are read in the browser only, so the server
   * markup and the first client render always agree.
   */
  const isClient = useIsClient();
  const [submitted, setSubmitted] = useState<Wish[] | null>(null);
  const added = submitted ?? (isClient ? loadLocal() : []);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thanks, setThanks] = useState(false);

  if (!config.enabled) return null;

  const all = [...added].reverse().concat(seeded);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !message.trim()) {
      setError(t(ui.wishes.errorFields));
      return;
    }

    setError(null);
    setSending(true);

    const wish: Wish = {
      id: `local-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      at: new Date().toISOString(),
    };

    try {
      if (config.endpoint) {
        const response = await fetch(config.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(wish),
        });
        if (!response.ok) throw new Error(`Unexpected status ${response.status}`);
      }

      const next = [...added, wish];
      saveLocal(next);
      setSubmitted(next);
      setName("");
      setMessage("");
      setThanks(true);
      window.setTimeout(() => setThanks(false), 5000);
    } catch {
      setError(t(ui.wishes.errorSend));
    } finally {
      setSending(false);
    }
  }

  return (
    <Section ariaLabel="Guest wishes">
      <SectionHeader eyebrow={ui.wishes.eyebrow} title={ui.wishes.title} />

      <form
        onSubmit={handleSubmit}
        noValidate
        className={cn("mt-12 flex flex-col gap-9", fontClass)}
      >
        <div>
          <label
            htmlFor={`${formId}-name`}
            className="t-eyebrow block text-primary"
          >
            {t(ui.wishes.name)}
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t(ui.wishes.namePlaceholder)}
            className={cn(fieldClass, "t-body mt-3")}
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-message`}
            className="t-eyebrow block text-primary"
          >
            {t(ui.wishes.message)}
          </label>
          <textarea
            id={`${formId}-message`}
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={t(ui.wishes.messagePlaceholder)}
            className={cn(fieldClass, "t-body mt-3 resize-none")}
          />
        </div>

        {error && (
          <p role="alert" className="t-caption -mt-3 text-primary">
            {error}
          </p>
        )}

        <div className="flex flex-col items-center gap-4">
          <Button type="submit" disabled={sending}>
            {t(sending ? ui.wishes.submitting : ui.wishes.submit)}
          </Button>

          <AnimatePresence>
            {thanks && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="t-caption text-secondary"
                role="status"
              >
                {t(ui.wishes.thanks)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>

      <ul className="mt-16 flex flex-col">
        {all.length === 0 && (
          <li className={cn("t-body text-center text-secondary", fontClass)}>
            {t(ui.wishes.empty)}
          </li>
        )}

        {all.map((wish, index) => (
          <Reveal
            as="li"
            key={wish.id}
            delay={Math.min(index, 4) * 0.05}
            distance={14}
            className={cn(
              "border-t border-hairline py-8 first:border-t-0 first:pt-0",
              fontClass,
            )}
          >
            <p className="t-body text-balance-pretty text-ink/85">
              {typeof wish.message === "string" ? wish.message : t(wish.message)}
            </p>
            <p className="t-eyebrow mt-4 text-primary">
              {wish.name}
              {wish.at && (
                <span className="ml-3 tracking-[0.12em] text-secondary normal-case">
                  {new Intl.DateTimeFormat(
                    lang === "zh" ? "zh-Hans" : lang === "kh" ? "km" : "en-GB",
                    { day: "numeric", month: "short", year: "numeric" },
                  ).format(new Date(wish.at))}
                </span>
              )}
            </p>
          </Reveal>
        ))}
      </ul>

      {!config.endpoint && (
        <p
          className={cn(
            "t-caption mt-12 text-center text-secondary/80",
            fontClass,
          )}
        >
          {t(ui.wishes.storedLocally)}
        </p>
      )}
    </Section>
  );
}
