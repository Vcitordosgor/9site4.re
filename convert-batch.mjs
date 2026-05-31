import sharp from 'sharp';
import { readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
const dir = process.argv[2];
if (!dir) throw new Error('usage: node convert-batch.mjs <dir>');
const files = readdirSync(dir).filter((x) => /\.(jpg|jpeg|png)$/i.test(x));
for (const f of files) {
  const src = join(dir, f);
  const dst = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const maxW = f.startsWith('hero') ? 1800 : 1200;
  await sharp(src)
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(dst);
  unlinkSync(src);
  console.log('✔', dst);
}
