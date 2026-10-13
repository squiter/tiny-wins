import { readFile, writeFile } from 'node:fs/promises';

// SDK 57's web bridge writes a 32-bit length through an 8-bit view, truncating
// results over 255 bytes. Keep this fix bounded to the verified package version.
const packagePath = new URL('../node_modules/expo-sqlite/package.json', import.meta.url);
const { version } = JSON.parse(await readFile(packagePath, 'utf8'));
const channelPath = new URL('../node_modules/expo-sqlite/web/WorkerChannel.ts', import.meta.url);
const source = await readFile(channelPath, 'utf8');
const broken = 'resultArray.set(new Uint32Array([length]), 0);';
const fixed = 'new Uint32Array(resultBuffer, 0, 1)[0] = length;';
if (version !== '57.0.4')
  throw new Error('Review the SQLite web bridge patch before updating expo-sqlite.');
if (!source.includes(fixed)) {
  if (source.split(broken).length !== 2)
    throw new Error('SQLite web bridge source changed; review the patch.');
  await writeFile(channelPath, source.replace(broken, fixed));
}
console.log('Expo SQLite web response-length fix applied (57.0.4).');
