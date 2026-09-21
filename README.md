# Lita & Kim — a multilingual mobile wedding invitation

A mobile-first digital wedding invitation: a sealed cover that opens into one
continuous, cinematic page. English, 中文 and ខ្មែរ, switchable at any point
without a reload. Everything you would want to change lives in two files.

Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript,
Tailwind CSS v4 and Framer Motion.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run start
```

---

## Making it yours

### 1. The content — `src/data/wedding.ts`

Every name, date, photo path, address, story chapter and gallery entry is in
this one file. No component hard-codes wedding information. Each piece of copy
is a `{ en, zh, kh }` object.

The parts you will almost certainly edit:

| Key | What it is |
| --- | --- |
| `couple` | Names, full names, parents, portraits |
| `date`, `dateLabel`, `dateShort` | The day. `date` drives the countdown, so keep the timezone offset |
| `message`, `verse` | The opening note |
| `story` | The four chapters, each with a year, a photo and a couple of lines |
| `events` | Ceremony and reception: times, venues, map links |
| `schedule` | The running order of the day, shown as a timeline after the map |
| `gallery` | Photos plus a `span` (`full` / `half` / `wide`) that places them |
| `video` | A YouTube, Vimeo or MP4 link |
| `location` | Venue, address, Google Maps link, map preview |
| `music` | The soundtrack |
| `wishes` | Whether the guest book is shown, and where submissions go |
| `decor.petals` | The Romduol blossoms and 囍 falling over the card |
| `meta.siteUrl` | Set this before deploying — it builds the Open Graph URLs |

### 2. The look — `src/styles/theme.css`

The palette, the type scale, the invitation width and the easing are all
custom properties in one `:root` block. Change a colour there and the whole
invitation follows; nothing else in the project names a colour.

```css
--color-background: #fbfdff;  /* paper */
--color-text:       #16273f;  /* ink */
--color-primary:    #2c5ea8;  /* deep blue, for labels and buttons */
--color-accent:     #a3c4e7;  /* mid blue, for rules and ornament */
--color-backdrop:   #c2dcf0;  /* the ground the card rests on */
--invitation-max:   480px;    /* the width of the card on a desktop */
```

The placeholder artwork is drawn from the same palette — `scripts/generate-placeholders.mjs`
carries a copy of it, so if you change the theme before swapping in real
photographs, change both and re-run `npm run placeholders`.

Interface copy — navigation, buttons, form labels — lives separately in
`src/data/i18n.ts`.

---

## Photographs

Replace the files in `public/images/` keeping the same names, or point
`wedding.ts` at new paths. Suggested ratios:

| File | Ratio |
| --- | --- |
| `cover.webp`, `closing.webp` | 9:16 |
| `hero.webp`, `bride.webp`, `groom.webp`, `story-*.webp` | 4:5 |
| `gallery-*.webp` | 4:5, 3:4, 1:1, 16:9 — mixed on purpose |
| `video-thumb.webp` | 16:9 |
| `og.jpg` | 1200×630 |

Every photo sits in a fixed-ratio frame with `object-fit: cover`, so a
replacement of any size fits without distortion and without shifting the page
as it loads. Images are served through `next/image` (AVIF/WebP, responsive
sizes, lazy below the fold) — only the cover is eager, since it is the LCP.

### Blur placeholders

`src/data/image-blur.json` holds a tiny inline preview for each photo. After
replacing images, regenerate it:

```bash
npm run placeholders
rm -rf .next/cache/images   # Next caches optimised images by URL, not content
```

That script (`scripts/generate-placeholders.mjs`) also draws the
placeholder artwork shipped with the project. Delete it once you have real
photographs — but keep the blur map in step, or `Photo` will simply skip the
blur-up for images it does not know.

---

## Falling petals

Romduol blossoms (`public/romdoul_flower.svg`) and 囍 (`public/喜.png`) drift
down over the invitation. Everything about them is in `wedding.decor.petals`:

```ts
petals: {
  enabled: true,
  count: 18,                 // how many are in the air at once
  pieces: [
    { src: "/romdoul_flower.svg", weight: 3, minSize: 14, maxSize: 28, maxOpacity: 0.6 },
    { src: "/喜.png",             weight: 1, minSize: 17, maxSize: 28, maxOpacity: 0.4 },
  ],
}
```

`weight` is the relative chance of a piece being picked, so the red 囍 stays an
occasional accent against the gold blossoms. Add any file in `public/` as
another piece, or set `enabled: false` to turn the whole thing off.

Each petal gets its own lane, size, speed, drift, sway and spin, picked at
random in the browser — the server renders nothing, so there is no hydration
mismatch and no two visits look the same. Only `transform` and `opacity` are
animated, entirely in CSS, so the effect stays on the compositor. Guests who
ask for reduced motion get none of it.

---

## Music

The soundtrack is `public/audio/khmer.mp4`, set in `wedding.music.url`. Any
audio file under `public/audio/` works — mp3, m4a/mp4, ogg or wav — and the
element loops it.

Audio is never fetched or played until the guest presses **Open invitation** —
that click is the user gesture browsers require, and `preload="none"` means the
file costs nothing until then. If it is missing or the browser refuses to play,
the control hides itself rather than lying about playing.

---

## Guest wishes

The guest book works immediately, keeping wishes in the browser's
`localStorage`, so you can demonstrate the flow before wiring anything up.

To collect them for real, set an endpoint:

```ts
wishes: {
  endpoint: "https://script.google.com/macros/s/.../exec",
}
```

Anything that accepts a `POST` of JSON will do — a Google Apps Script bound to
a Sheet, a Formspree form, or your own Next.js route handler. A wish is posted
as `{ id, name, message, at }`.

---

## How it is put together

```
src/
├── app/
│   ├── layout.tsx          fonts, metadata, viewport
│   ├── page.tsx            structured data + the shell
│   ├── providers.tsx       language, invitation state, MotionConfig
│   └── globals.css         Tailwind tokens, type scale, base styles
├── components/
│   ├── InvitationShell.tsx the column of paper everything sits on
│   ├── InvitationCover.tsx the sealed cover and its opening transition
│   ├── Hero.tsx  WeddingMessage.tsx  Couple.tsx  Story.tsx
│   ├── Countdown.tsx  Events.tsx  Gallery.tsx  Video.tsx
│   ├── Location.tsx  Schedule.tsx  Wishes.tsx  Footer.tsx
│   ├── MusicPlayer.tsx  LanguageBar.tsx  LanguageSwitcher.tsx
│   └── ui/                 Photo, ParallaxPhoto, Lightbox, Reveal,
│                           Section, Button, Decor, PageBackdrop
├── data/     wedding.ts · i18n.ts · image-blur.json
├── lib/      language · invitation · motion · client · video · utils
└── styles/   theme.css
```

**Two controls, no menu.** The invitation is one continuous page, so there is
no navigation: just the language pill at the top left and the soundtrack
button at the top right, both pinned to the card and both sitting above the
falling petals so they stay readable.

**One column, two sizes.** Everything the guest reads lives inside
`.invitation-column`: full-bleed on a phone, a 480px card centred on a pale blue
ground from tablet upwards. That column is a CSS container, and the type scale
is written in `cqw` against it — so the invitation reads identically at 320px
on a phone and at 480px inside a 1920px window, rather than shrinking to fit.
The two controls are positioned against the same column, so nothing escapes
the card on a desktop.

**Typography follows the language.** Each language has its own pair of faces —
a title face and a body face — and the language class re-points `--font-title`,
which the type scale reads:

| | Title | Body |
| --- | --- | --- |
| English | HughIsLife | Inter |
| 中文 | Ma Shan Zheng | Noto Serif SC |
| ខ្មែរ | Hanuman | Kantumruy Pro |

Every stack ends with the other two scripts, so a Khmer word inside an English
heading still lands on a Khmer face rather than a random system fallback. The
Khmer and Chinese faces are not preloaded: a guest reading in English never
downloads a byte of them.

The two Chinese faces are **subsetted**. Loaded whole through `next/font` they
emit ~400 `@font-face` rules between them — one per CJK unicode-range slice,
about 140KB of render-blocking CSS on every visit. But the invitation's Chinese
copy is a fixed set of ~320 characters, so `npm run fonts:zh` fetches a subset
containing exactly those and writes `public/fonts/*.subset.woff2` plus a
two-rule `src/styles/fonts-zh.css`.

**Re-run `npm run fonts:zh` after changing any Chinese copy**, or new
characters will fall back to a system font.

Every `var()` in the font stacks carries an inline fallback, because an
undefined `var()` inside `font-family` invalidates the whole declaration and
would drop every language to a system font.

HughIsLife is a local file (`public/fonts/`); the rest come from `next/font`.
Its `@font-face` carries a `unicode-range` that withholds U+0030–0039, because
the free cut of that font ships advertising artwork in place of its digits.

**Motion.** Framer Motion, with `reducedMotion="user"` set globally: guests who
ask for less motion get the fades without the movement. Reveals animate only
`transform` and `opacity`, fire once, and run 0.6–1.2s on a single easing
curve.

---

## Accessibility

Semantic landmarks and headings; a skip link; labelled form fields with
validation messages; a lightbox that traps and restores focus and answers
`Esc` / `←` / `→`; 48px minimum touch targets; visible focus rings; and the
invitation marked `inert` while the cover is up, so keyboard focus cannot fall
behind it. The countdown deliberately does not announce itself every second —
the full date sits beneath it.

---

## Credits

Placeholder photography, the map preview and the ornament are generated by
`scripts/generate-placeholders.mjs` — original work, free to replace.
Fonts are self-hosted through `next/font` (no requests to Google at runtime).
