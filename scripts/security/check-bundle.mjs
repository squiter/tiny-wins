import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { inspectModuleMaps } from './audit-policy.mjs';
const maps = [];
async function inspect(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = join(folder, entry.name);
    if (entry.isDirectory()) await inspect(file);
    else if (entry.name.endsWith('.map')) maps.push(JSON.parse(await readFile(file, 'utf8')));
  }
}
try {
  await inspect('.expo/security-bundle');
  const result = inspectModuleMaps(maps);
  await writeFile('production-module-inspection.json', JSON.stringify(result, null, 2) + '\n');
  console.log(
    `PASS: inspected ${result.modules} production iOS JS modules; no braces/node-forge. Signed archive inspection still required before submission.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Production module inspection failed.');
  process.exitCode = 1;
}
