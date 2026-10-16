import { readFile } from 'node:fs/promises';
import { getPngInfo } from '@expo/image-utils';
import { describe, expect, it } from 'vitest';

const root = new URL('../../', import.meta.url);
const config = JSON.parse(await readFile(new URL('app.json', root), 'utf8')).expo;
const asset = (file) => getPngInfo(new URL(file, root).pathname);

describe('native brand assets', () => {
  it('provides a 1024px opaque icon without a PNG alpha channel', async () => {
    const png = await asset(config.icon);
    expect([png.width, png.height]).toEqual([1024, 1024]);
    const bytes = await readFile(new URL(config.icon, root));
    expect(bytes[25]).toBe(2); // PNG RGB, not RGBA: required for the iOS app icon.
  });

  it.each(['foregroundImage', 'monochromeImage'])(
    'keeps every visible %s pixel within the Android adaptive-icon safe circle',
    async (field) => {
      const png = await asset(config.android.adaptiveIcon[field]);
      expect([png.width, png.height]).toEqual([1024, 1024]);
      let visible = 0;
      let outside = 0;
      for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
          if (png.data[(y * png.width + x) * 4 + 3] > 0) {
            visible++;
            if (Math.hypot(x - 511.5, y - 511.5) > 1024 / 3) outside++;
          }
        }
      }
      expect(visible).toBeGreaterThan(100_000);
      expect(outside).toBe(0);
      expect(png.data[3]).toBe(0);
    },
  );

  it('has transparent light/dark splash marks and matching OS palettes', async () => {
    const [, splash] = config.plugins.find((plugin) => plugin[0] === 'expo-splash-screen');
    expect([splash.backgroundColor, splash.dark.backgroundColor]).toEqual(['#FBF8F1', '#141B17']);
    for (const file of [splash.image, splash.dark.image]) {
      const png = await asset(file);
      expect([png.width, png.height]).toEqual([1024, 1024]);
      expect(png.data[3]).toBe(0);
      expect(png.data[(224 * 1024 + 224) * 4 + 3]).toBe(255);
    }
  });
});
