import sharp from "sharp";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

/*
 * sync-photos.mjs — point wedding.ts at the photographs that are actually on
 * disk, then rebuild the blur placeholders from them.
 *
 * Dropping your own photograph into public/images/ usually changes its
 * extension (a .jpg off a phone replacing the .webp that shipped here), which
 * leaves wedding.ts pointing at a file that no longer exists and the section
 * rendering nothing. This matches each slot by *name* and rewrites the
 * extension to whatever is really there. Run it after every batch of swaps:
 *
 *   npm run photos
 *
 * It never writes to public/images/ — your photographs are only ever read.
 */

const DATA = "src/data/wedding.ts";
const DIR = "public/images";
const BLUR = "src/data/image-blur.json";

const source = await readFile(DATA, "utf8");
const files = await readdir(DIR);

/*
 * Every file on disk, indexed by basename: "bride" -> "bride.jpg". A slot can
 * hold two files at once — the .webp that shipped here and the .jpg you just
 * dropped beside it — so the most recently written one wins, which is the one
 * you meant.
 */
const byName = new Map();
for (const file of files) {
  if (file.startsWith(".")) continue;

  const name = path.parse(file).name;
  const when = (await stat(path.join(DIR, file))).mtimeMs;
  const held = byName.get(name);

  if (!held || when > held.when) byName.set(name, { file, when });
}

const referenced = [
  ...new Set(
    [...source.matchAll(/"(\/images\/[A-Za-z0-9_.-]+\.(?:webp|jpg|jpeg|png))"/g)].map(
      (match) => match[1],
    ),
  ),
];

let next = source;
const resolved = [];
const missing = [];

for (const ref of referenced) {
  const name = path.parse(ref).name;
  const onDisk = byName.get(name);

  if (!onDisk) {
    missing.push(ref);
    continue;
  }

  const corrected = `/images/${onDisk.file}`;
  if (corrected !== ref) {
    next = next.replaceAll(`"${ref}"`, `"${corrected}"`);
    console.log(`  ${ref}  ->  ${corrected}`);
  }
  resolved.push(corrected);
}

if (next !== source) await writeFile(DATA, next);

/* Blur placeholders, read from the photographs the invitation now points at. */
const blur = {};
for (const ref of resolved.sort()) {
  const file = path.join("public", ref);
  const tiny = await sharp(file)
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer();
  blur[ref] = `data:image/webp;base64,${tiny.toString("base64")}`;
}
await writeFile(BLUR, JSON.stringify(blur, null, 2) + "\n");

/* Photographs sitting in the folder that no section will ever show. */
const used = new Set(resolved.map((ref) => path.basename(ref)));
const unused = [...byName.values()]
  .map((entry) => entry.file)
  .filter((file) => !used.has(file));

console.log(`\n${resolved.length} photographs wired up, blur placeholders rebuilt.`);
if (missing.length) console.log(`\nNo file for:\n${missing.map((m) => `  ${m}`).join("\n")}`);
if (unused.length) console.log(`\nUnused in public/images/:\n${unused.map((u) => `  ${u}`).join("\n")}`);
