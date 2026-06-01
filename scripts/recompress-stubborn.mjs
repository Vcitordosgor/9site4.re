#!/usr/bin/env node
import { stat, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const files = [
  'public/images/photographe/extra-8.webp',
  'public/images/sentiers/cascade.webp',
  'public/images/paysagiste/extra-5.webp',
  'public/images/gite/extra-2.webp',
  'public/images/sentiers/cascade-1024.webp',
  'public/images/excursions/extra-3.webp',
  'public/images/photographe/pexels-seyma-akbulut-60707124-8182453.webp',
  'public/images/gite/extra-8.webp',
  'public/images/sentiers/volcan.webp',
];

for (const file of files) {
  try {
    const before = (await stat(file)).size;
    const meta = await sharp(file).metadata();
    const targetW = file.includes('-1024') ? 1024 : 1100;
    let p = sharp(file).rotate();
    if ((meta.width ?? 0) > targetW) p = p.resize({ width: targetW });
    const buf = await p.webp({ quality: 58, effort: 6 }).toBuffer();
    if (buf.length < before) {
      await writeFile(file, buf);
      console.log(`✔ ${file}  ${(before/1024).toFixed(0)}KB → ${(buf.length/1024).toFixed(0)}KB`);
    } else {
      console.log(`= ${file} no gain`);
    }
  } catch (e) {
    console.log(`✗ ${file} ${e.message}`);
  }
}
