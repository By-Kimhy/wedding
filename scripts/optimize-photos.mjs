import sharp from "sharp";
import { mkdir, readFile, rename, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

/*
 * optimize-photos.mjs — re-encode the photographs as real WebP.
 *
 * A photograph off a phone or a download arrives as a JPEG, and renaming it
 * to .webp does not change that: the browser sniffs the bytes and copes, but
 * the file stays two to four times heavier than it needs to be, on an
 * invitation people mostly open over mobile data.
 *
 *   npm run photos:optimize
 *
 * Photographs are also capped at MAX_EDGE on their long side. A 2048px
 * original is far more than a 480px-wide invitation can show, even on a
 * retina screen with the gallery lightbox open. Every original is moved to
 * .photo-originals/ rather than deleted, so nothing is lost; raise MAX_EDGE
 * and re-run from that folder if you ever want more detail back.
 *
 * Anything already WebP is left alone, as is og.jpg: the Open Graph preview
 * is read by link scrapers, and JPEG is the format all of them accept.
 */

const DATA = "src/data/wedding.ts";
const DIR = "public/images";
const ARCHIVE = ".photo-originals";
const KEEP_AS_JPEG = new Set(["og"]);
const QUALITY = 82;
const MAX_EDGE = 1800;

const source = await readFile(DATA, "utf8");
const referenced = [
  ...new Set(
    [...source.matchAll(/"(\/images\/([A-Za-z0-9_.-]+)\.(?:webp|jpg|jpeg|png))"/g)].map(
      (match) => match[1],
    ),
  ),
].sort();

await mkdir(ARCHIVE, { recursive: true });

let before = 0;
let after = 0;
let converted = 0;

for (const ref of referenced) {
  const file = path.join("public", ref);
  const { name } = path.parse(ref);

  if (!existsSync(file)) {
    console.log(`  ${ref} — no file, skipped`);
    continue;
  }
  if (KEEP_AS_JPEG.has(name)) continue;

  const { format } = await sharp(file).metadata();
  if (format === "webp") continue;

  const target = path.join(DIR, `${name}.webp`);
  const was = (await stat(file)).size;

  /*
   * Move the original out of the way before encoding. A JPEG named .webp has
   * the same path as its own target, so writing first would overwrite the
   * only copy of the source.
   */
  if (existsSync(target) && path.resolve(target) !== path.resolve(file)) {
    await rename(target, path.join(ARCHIVE, `superseded-${name}.webp`));
  }
  const archived = path.join(ARCHIVE, path.basename(file));
  await rename(file, archived);

  await sharp(archived)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(target);

  const now = (await stat(target)).size;
  before += was;
  after += now;
  converted += 1;

  const saved = Math.round((1 - now / was) * 100);
  console.log(
    `  ${path.basename(file).padEnd(20)} ${(was / 1024).toFixed(0).padStart(5)}KB -> ${(now / 1024).toFixed(0).padStart(4)}KB webp  (−${saved}%)`,
  );
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
console.log(
  converted
    ? `\n${converted} photographs re-encoded: ${mb(before)}MB -> ${mb(after)}MB. Originals moved to ${ARCHIVE}/`
    : "\nEvery photograph is already WebP.",
);
