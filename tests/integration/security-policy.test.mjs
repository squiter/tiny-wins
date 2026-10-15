import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { verifyPatches } from '../../scripts/security/audit-policy.mjs';
const manifest = JSON.parse(
  await readFile(new URL('../../scripts/security/patch-manifest.json', import.meta.url)),
);
it('verifies real installed patch bytes and rejects missing/tampered sources or version changes', async () => {
  await expect(verifyPatches(process.cwd(), manifest)).resolves.toBeUndefined();
  const root = await mkdtemp(join(tmpdir(), 'tiny-wins-policy-'));
  try {
    for (const [name, pkg] of Object.entries(manifest.packages)) {
      const folder = join(root, 'node_modules', name);
      await mkdir(join(folder, 'lib'), { recursive: true });
      await writeFile(join(folder, 'package.json'), JSON.stringify({ version: pkg.version }));
      for (const file of Object.keys(pkg.files))
        await writeFile(
          join(folder, file),
          await readFile(join(process.cwd(), 'node_modules', name, file)),
        );
    }
    await expect(verifyPatches(root, manifest)).resolves.toBeUndefined();
    const source = join(root, 'node_modules/node-forge/lib/rsa.js');
    await writeFile(source, 'unpatched or changed source');
    await expect(verifyPatches(root, manifest)).rejects.toThrow('security patch');
    await rm(source);
    await expect(verifyPatches(root, manifest)).rejects.toThrow();
    await writeFile(
      join(root, 'node_modules/braces/package.json'),
      JSON.stringify({ version: '3.0.4' }),
    );
    await expect(verifyPatches(root, manifest)).rejects.toThrow('version');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
