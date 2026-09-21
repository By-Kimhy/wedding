"use client";

import { Reveal } from "@/components/ui/Reveal";
import { monthNames, ui, weekdayNames } from "@/data/i18n";
import { wedding, type Lang } from "@/data/wedding";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

/*
 * The month is read off the ISO string rather than from a Date: `getDate()`
 * answers in the guest's own time zone, so a guest west of Indochina would
 * otherwise find the heart drawn around the day before the wedding.
 */
const [year, month, day] = wedding.date.slice(0, 10).split("-").map(Number);

/** Monday-first position of the 1st, and how many days the month runs to. */
const leadingBlanks = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

const cells: (number | null)[] = [
  ...Array.from({ length: leadingBlanks }, () => null),
  ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
];
/* Pad the last row so every week is a full seven columns wide. */
while (cells.length % 7 !== 0) cells.push(null);

const weeks = Array.from({ length: cells.length / 7 }, (_, index) =>
  cells.slice(index * 7, index * 7 + 7),
);

const KHMER_DIGITS = "០១២៣៤៥៦៧៨៩";

/** Khmer writes the date in its own numerals; the grid stays Arabic. */
function numerals(value: number, lang: Lang) {
  return lang === "kh"
    ? String(value).replace(/\d/g, (digit) => KHMER_DIGITS[Number(digit)])
    : String(value);
}

/** The mark drawn around the wedding day. */
function Heart() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className="absolute top-1/2 left-1/2 size-9 -translate-x-1/2 -translate-y-1/2 text-primary"
    >
      <path
        d="M12 20.4C12 20.4 3.5 15.2 3.5 9.4C3.5 6.6 5.6 4.5 8.2 4.5C9.9 4.5 11.3 5.4 12 6.7C12.7 5.4 14.1 4.5 15.8 4.5C18.4 4.5 20.5 6.6 20.5 9.4C20.5 15.2 12 20.4 12 20.4Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The month of the wedding, set as a printed calendar inside a ruled frame:
 * the year and the month across the top, the year again as a watermark behind
 * the grid, and a heart drawn around the one day that matters.
 */
export function Calendar() {
  const { t, lang, fontClass } = useLanguage();
  const headingSize = { fontSize: "clamp(1.3rem,7cqw,2rem)" };

  return (
    <div className={cn("mx-auto w-full max-w-[22rem]", fontClass)}>
      <Reveal distance={14} duration={0.8}>
        <div className="border border-primary/25 px-[clamp(0.5rem,3cqw,1rem)] py-6">
          <div className="flex items-baseline justify-between gap-3">
            <span
              className="font-display tabular leading-none text-primary"
              style={headingSize}
            >
              {numerals(year, lang)}
            </span>
            <span className="flex items-baseline gap-1.5 leading-none text-primary">
              <span className="font-display" style={headingSize}>
                {monthNames[lang][month - 1]}
              </span>
              <span
                className="font-ui tabular text-primary/55"
                style={{ fontSize: "clamp(0.75rem,3.4cqw,0.95rem)" }}
              >
                / {numerals(day, lang)}
              </span>
            </span>
          </div>

          <div className="relative mt-6">
            {/* The year again, ghosted behind the grid like printed stock. */}
            <span
              aria-hidden
              className="font-display tabular pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center leading-none text-primary/[0.07]"
              style={{ fontSize: "clamp(3.5rem,22cqw,6rem)" }}
            >
              {numerals(year, lang)}
            </span>

            <table className="relative w-full table-fixed border-collapse">
              {/* The grid is ornament; the date beneath it is what gets read out. */}
              <caption className="sr-only">{t(wedding.dateLabel)}</caption>
              <thead>
                <tr>
                  {weekdayNames[lang].map((name, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="pb-5 text-center text-[0.62rem] leading-tight font-medium text-muted"
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, weekIndex) => (
                  <tr key={weekIndex}>
                    {week.map((date, dayIndex) => (
                      <td key={dayIndex} className="p-0 text-center align-middle">
                        {date !== null && (
                          <span
                            className={cn(
                              "font-ui tabular relative flex h-9 items-center justify-center text-[0.85rem]",
                              date === day ? "text-primary" : "text-muted",
                            )}
                            aria-label={
                              date === day ? t(ui.calendar.weddingDay) : undefined
                            }
                          >
                            {date === day && <Heart />}
                            <span className="relative">{date}</span>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.12} distance={10} className="mt-5">
        <p className="t-caption flex items-center justify-center gap-1.5 text-muted">
          {t(ui.calendar.saveTheDate)}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-3 shrink-0 text-primary/70"
          >
            <path
              d="M12 20.4C12 20.4 3.5 15.2 3.5 9.4C3.5 6.6 5.6 4.5 8.2 4.5C9.9 4.5 11.3 5.4 12 6.7C12.7 5.4 14.1 4.5 15.8 4.5C18.4 4.5 20.5 6.6 20.5 9.4C20.5 15.2 12 20.4 12 20.4Z"
              fill="currentColor"
            />
          </svg>
        </p>
      </Reveal>
    </div>
  );
}
