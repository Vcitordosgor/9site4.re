#!/usr/bin/env node
/**
 * Recompress oversized WebP images in /public/images.
 * - WebP > 200KB: re-encode at quality 68, max width 1200px (longest side).
 * - In-place (overwrites only if new file is smaller).
 *
 * Usage: node scripts/recompress-images.mjs [--dry]
 */
import { readdir, stat, writeFile, rename, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('../public/images/', import.meta.url).pathname;
const DRY = process.argv.includes('--dry');
const THRESHOLD = 200 * 1024; // 200 KB
const QUALITY = 68;
const MAX_W = 1200;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (entry.isFile() && /\.(webp|jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const files = await walk(ROOT);
let total = 0, savedTotal = 0, touched = 0;

for (const file of files) {
  const s = await stat(file);
  total += s.size;
  if (s.size <= THRESHOLD) continue;

  const isWebp = /\.webp$/i.test(file);
  const ext = extname(file).toLowerCase();
  const img = sharp(file);
  const meta = await img.metadata();
  const width = meta.width ?? 0;
  const newW = Math.min(width || MAX_W, MAX_W);

  let pipeline = sharp(file).rotate();
  if (width > MAX_W) pipeline = pipeline.resize({ width: newW });

  let buf;
  if (isWebp || ext === '.jpg' || ext === '.jpeg') {
    buf = await pipeline.webp({ quality: QUALITY, effort: 6 }).toBuffer();
  } else {
    buf = await pipeline.webp({ quality: QUALITY, effort: 6 }).toBuffer();
  }

  if (buf.length < s.size) {
    const saved = s.size - buf.length;
    savedTotal += saved;
    touched++;
    console.log(`✔ ${file.replace(ROOT, '')}  ${(s.size/1024).toFixed(0)}KB → ${(buf.length/1024).toFixed(0)}KB  (−${(saved/1024).toFixed(0)}KB)`);
    if (!DRY) {
      // If the source is not already .webp, write to .webp and remove old (but keep filename mapping safe).
      // Since we only target .webp/.jpg/.png and our codebase uses .webp paths, we ONLY overwrite the existing .webp files in place.
      if (isWebp) {
        await writeFile(file, buf);
      } else {
        // For jpg/png > threshold we leave them (don't risk breaking refs) — just log.
        console.log(`  (skipped write — non-webp source: ${file})`);
      }
    }
  } else {
    console.log(`= ${file.replace(ROOT, '')} no gain (${(s.size/1024).toFixed(0)}KB)`);
  }
}

console.log(`\nTotal scanned: ${(total/1024/1024).toFixed(1)} MB, recompressed: ${touched} files, saved ${(savedTotal/1024/1024).toFixed(2)} MB`);
