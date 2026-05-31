import sharp from 'sharp';
import { statSync, unlinkSync } from 'fs';
const src = 'public/images/avocat/bibliotheque.jpg';
const dst = 'public/images/avocat/bibliotheque.webp';
const before = statSync(src).size;
await sharp(src).resize({ width: 1600 }).webp({ quality: 78, effort: 5 }).toFile(dst);
console.log(`${(before/1024).toFixed(0)} KB → ${(statSync(dst).size/1024).toFixed(0)} KB`);
unlinkSync(src);
