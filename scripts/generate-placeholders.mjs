import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/images");
await mkdir(OUT, { recursive: true });

/*
 * The invitation's palette, lightest to deepest. Mirrors the tokens in
 * src/styles/theme.css — change them there and here together.
 */
const P = {
  ivory: "#fbfdff",
  cream: "#eaf5fd",
  sand: "#dbedf9",
  champagne: "#ccf2f4",
  clay: "#a3c4e7",
  taupe: "#7fa6cc",
  mocha: "#4a6280",
  cocoa: "#2c5ea8",
  charcoal: "#16273f",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

/**
 * Soft tonal field that reads like an out-of-focus photograph: a diagonal
 * gradient, a few blurred masses, film grain and a vignette.
 */
function photoSvg({ w, h, a, b, c, glow, label, seed = 3 }) {
  const s = Math.max(w, h);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.85" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="52%" stop-color="${b}"/>
      <stop offset="100%" stop-color="${c}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${glow[0]}" cy="${glow[1]}" r="0.72">
      <stop offset="0%" stop-color="#f6fcff" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="#f6fcff" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#f6fcff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="0.5" cy="0.45" r="0.78">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="${P.charcoal}" stop-opacity="0.30"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="${s * 0.042}"/></filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${seed}"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#g)"/>

  <g filter="url(#soft)" opacity="0.8">
    <ellipse cx="${w * 0.26}" cy="${h * 0.3}" rx="${s * 0.3}" ry="${s * 0.26}" fill="${P.ivory}" opacity="0.42"/>
    <ellipse cx="${w * 0.78}" cy="${h * 0.66}" rx="${s * 0.32}" ry="${s * 0.3}" fill="${c}" opacity="0.5"/>
    <ellipse cx="${w * 0.58}" cy="${h * 0.12}" rx="${s * 0.24}" ry="${s * 0.18}" fill="${P.cream}" opacity="0.3"/>
    <ellipse cx="${w * 0.12}" cy="${h * 0.9}" rx="${s * 0.26}" ry="${s * 0.2}" fill="${P.cocoa}" opacity="0.3"/>
  </g>

  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>

  <g opacity="0.16" stroke="${P.ivory}" fill="none" stroke-width="${Math.max(1, s * 0.0016)}">
    <rect x="${w * 0.06}" y="${h * 0.045}" width="${w * 0.88}" height="${h * 0.91}"/>
  </g>

  <g opacity="0.34" stroke="${P.ivory}" fill="none" stroke-width="${Math.max(1, s * 0.0018)}">
    <circle cx="${w / 2}" cy="${h / 2}" r="${s * 0.052}"/>
    <path d="M${w / 2 - s * 0.096} ${h / 2} h${s * 0.03} M${w / 2 + s * 0.066} ${h / 2} h${s * 0.03}"/>
  </g>

  <g transform="translate(${w / 2} ${h / 2})" fill="${P.ivory}" fill-opacity="0.42">
    <path d="M0 ${-s * 0.026} C ${s * 0.013} ${-s * 0.011} ${s * 0.013} ${s * 0.011} 0 ${s * 0.026} C ${-s * 0.013} ${s * 0.011} ${-s * 0.013} ${-s * 0.011} 0 ${-s * 0.026} Z"/>
    <path d="M${-s * 0.026} 0 C ${-s * 0.011} ${-s * 0.013} ${s * 0.011} ${-s * 0.013} ${s * 0.026} 0 C ${s * 0.011} ${s * 0.013} ${-s * 0.011} ${s * 0.013} ${-s * 0.026} 0 Z"/>
  </g>

  <text x="${w / 2}" y="${h - h * 0.062}" text-anchor="middle" fill="${P.ivory}" fill-opacity="0.46"
    font-family="Helvetica, Arial, sans-serif" font-size="${Math.max(9, s * 0.019)}" letter-spacing="${Math.max(2, s * 0.006)}">${esc(label)}</text>

  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.055" style="mix-blend-mode:multiply"/>
</svg>`;
}

/** Stylised street-map preview so the location section has something map-like. */
function mapSvg({ w, h }) {
  const roads = [];
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 13; i++) {
    const y = h * (0.06 + i * 0.074);
    roads.push(
      `<path d="M0 ${y.toFixed(1)} Q ${(w * 0.5).toFixed(1)} ${(y + (rnd() - 0.5) * h * 0.07).toFixed(1)} ${w} ${(y + (rnd() - 0.5) * h * 0.05).toFixed(1)}" stroke="${P.ivory}" stroke-opacity="${0.5 + rnd() * 0.35}" stroke-width="${(1 + rnd() * 3).toFixed(1)}" fill="none"/>`,
    );
  }
  for (let i = 0; i < 16; i++) {
    const x = w * (0.03 + i * 0.062);
    roads.push(
      `<path d="M${x.toFixed(1)} 0 Q ${(x + (rnd() - 0.5) * w * 0.05).toFixed(1)} ${(h * 0.5).toFixed(1)} ${(x + (rnd() - 0.5) * w * 0.06).toFixed(1)} ${h}" stroke="${P.ivory}" stroke-opacity="${0.4 + rnd() * 0.35}" stroke-width="${(1 + rnd() * 2.4).toFixed(1)}" fill="none"/>`,
    );
  }
  const blocks = [];
  for (let i = 0; i < 42; i++) {
    const bw = w * (0.03 + rnd() * 0.07);
    const bh = h * (0.04 + rnd() * 0.1);
    blocks.push(
      `<rect x="${(rnd() * (w - bw)).toFixed(1)}" y="${(rnd() * (h - bh)).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${P.clay}" fill-opacity="${(0.1 + rnd() * 0.2).toFixed(2)}"/>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="mg" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0%" stop-color="${P.cream}"/>
      <stop offset="100%" stop-color="${P.sand}"/>
    </radialGradient>
    <filter id="grain2">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="11"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#mg)"/>
  ${blocks.join("")}
  <path d="M0 ${h * 0.72} Q ${w * 0.3} ${h * 0.62} ${w * 0.55} ${h * 0.78} T ${w} ${h * 0.7} L ${w} ${h} L 0 ${h} Z" fill="${P.taupe}" fill-opacity="0.22"/>
  ${roads.join("")}
  <path d="M0 ${h * 0.54} L ${w} ${h * 0.47}" stroke="${P.champagne}" stroke-width="${h * 0.035}" stroke-opacity="0.55" fill="none"/>
  <g transform="translate(${w * 0.5} ${h * 0.46})">
    <circle r="${h * 0.13}" fill="${P.cocoa}" fill-opacity="0.14"/>
    <path d="M0 ${h * 0.075} C ${-h * 0.075} ${-h * 0.005} ${-h * 0.055} ${-h * 0.085} 0 ${-h * 0.085} C ${h * 0.055} ${-h * 0.085} ${h * 0.075} ${-h * 0.005} 0 ${h * 0.075} Z" fill="${P.cocoa}"/>
    <circle cy="${-h * 0.042}" r="${h * 0.018}" fill="${P.ivory}"/>
  </g>
  <rect width="${w}" height="${h}" filter="url(#grain2)" opacity="0.06" style="mix-blend-mode:multiply"/>
</svg>`;
}

const PHOTOS = [
  { f: "cover", w: 1080, h: 1920, a: P.cocoa, b: P.clay, c: P.champagne, glow: [0.5, 0.26], label: "COVER  ·  9:16", seed: 2 },
  { f: "hero", w: 1200, h: 1500, a: P.sand, b: P.clay, c: P.mocha, glow: [0.42, 0.3], label: "HERO  ·  4:5", seed: 4 },
  { f: "bride", w: 1200, h: 1500, a: P.cream, b: P.sand, c: P.taupe, glow: [0.38, 0.26], label: "BRIDE  ·  4:5", seed: 6 },
  { f: "groom", w: 1200, h: 1500, a: P.clay, b: P.taupe, c: P.cocoa, glow: [0.6, 0.3], label: "GROOM  ·  4:5", seed: 8 },
  { f: "story-01", w: 1200, h: 1500, a: P.cream, b: P.champagne, c: P.clay, glow: [0.55, 0.35], label: "STORY 01  ·  4:5", seed: 10 },
  { f: "story-02", w: 1200, h: 1500, a: P.sand, b: P.taupe, c: P.mocha, glow: [0.35, 0.4], label: "STORY 02  ·  4:5", seed: 12 },
  { f: "story-03", w: 1200, h: 1500, a: P.champagne, b: P.clay, c: P.cocoa, glow: [0.62, 0.32], label: "STORY 03  ·  4:5", seed: 14 },
  { f: "story-04", w: 1200, h: 1500, a: P.ivory, b: P.cream, c: P.champagne, glow: [0.5, 0.3], label: "STORY 04  ·  4:5", seed: 16 },
  { f: "gallery-01", w: 1200, h: 1500, a: P.taupe, b: P.clay, c: P.cream, glow: [0.45, 0.3], label: "GALLERY 01  ·  4:5", seed: 18 },
  { f: "gallery-02", w: 1080, h: 1440, a: P.cream, b: P.sand, c: P.clay, glow: [0.5, 0.28], label: "02  ·  3:4", seed: 20 },
  { f: "gallery-03", w: 1080, h: 1440, a: P.clay, b: P.mocha, c: P.cocoa, glow: [0.55, 0.35], label: "03  ·  3:4", seed: 22 },
  { f: "gallery-04", w: 1600, h: 900, a: P.sand, b: P.champagne, c: P.taupe, glow: [0.4, 0.32], label: "GALLERY 04  ·  16:9", seed: 24 },
  { f: "gallery-05", w: 1200, h: 1500, a: P.cocoa, b: P.mocha, c: P.clay, glow: [0.58, 0.26], label: "GALLERY 05  ·  4:5", seed: 26 },
  { f: "gallery-06", w: 1100, h: 1100, a: P.cream, b: P.champagne, c: P.taupe, glow: [0.44, 0.3], label: "06  ·  1:1", seed: 28 },
  { f: "gallery-07", w: 1100, h: 1100, a: P.champagne, b: P.clay, c: P.mocha, glow: [0.56, 0.34], label: "07  ·  1:1", seed: 30 },
  { f: "gallery-08", w: 1600, h: 1000, a: P.taupe, b: P.sand, c: P.cream, glow: [0.5, 0.3], label: "GALLERY 08  ·  8:5", seed: 32 },
  { f: "gallery-09", w: 1080, h: 1440, a: P.sand, b: P.clay, c: P.cocoa, glow: [0.38, 0.36], label: "09  ·  3:4", seed: 34 },
  { f: "gallery-10", w: 1080, h: 1440, a: P.cream, b: P.taupe, c: P.mocha, glow: [0.62, 0.3], label: "10  ·  3:4", seed: 36 },
  { f: "video-thumb", w: 1600, h: 900, a: P.cocoa, b: P.mocha, c: P.taupe, glow: [0.5, 0.4], label: "FILM  ·  16:9", seed: 38 },
  { f: "closing", w: 1080, h: 1920, a: P.cocoa, b: P.clay, c: P.champagne, glow: [0.5, 0.72], label: "CLOSING  ·  9:16", seed: 40 },
];

const blur = {};

async function emit(name, svg, w, h) {
  const buf = Buffer.from(svg);
  const file = path.join(OUT, `${name}.webp`);
  await sharp(buf, { density: 96 }).webp({ quality: 82, effort: 5 }).toFile(file);
  const tiny = await sharp(buf, { density: 96 })
    .resize(Math.max(8, Math.round((w / h) * 14)), 14, { fit: "fill" })
    .webp({ quality: 40 })
    .toBuffer();
  blur[`/images/${name}.webp`] = `data:image/webp;base64,${tiny.toString("base64")}`;
}

for (const p of PHOTOS) await emit(p.f, photoSvg(p), p.w, p.h);
await emit("map", mapSvg({ w: 1600, h: 1000 }), 1600, 1000);

/* Open Graph card: 1200x630 JPEG with the couple's names. */
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="og" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${P.cream}"/><stop offset="55%" stop-color="${P.sand}"/><stop offset="100%" stop-color="${P.clay}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#og)"/>
  <g stroke="${P.mocha}" stroke-opacity="0.35" fill="none"><rect x="46" y="46" width="1108" height="538"/></g>
  <text x="600" y="212" text-anchor="middle" fill="${P.mocha}" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="10">TOGETHER WITH OUR FAMILIES</text>
  <text x="600" y="340" text-anchor="middle" fill="${P.charcoal}" font-family="Georgia, 'Times New Roman', serif" font-size="112" letter-spacing="8">LITA &amp; KIM</text>
  <path d="M470 392 h260" stroke="${P.mocha}" stroke-opacity="0.5"/>
  <text x="600" y="452" text-anchor="middle" fill="${P.cocoa}" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="12">20 DECEMBER 2026</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile(path.join(OUT, "og.jpg"));

await writeFile("src/data/image-blur.json", JSON.stringify(blur, null, 2) + "\n");
console.log(`generated ${PHOTOS.length + 1} webp + og.jpg`);
