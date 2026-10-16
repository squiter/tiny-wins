import { readFile } from 'node:fs/promises';
import { matchesGlob } from 'node:path';
import { expect, it } from 'vitest';
import { parse } from 'yaml';

it('retains explicit iOS test evidence without publishing raw system logs or credentials', async () => {
  const workflow = parse(await readFile('.github/workflows/ios-smoke.yml', 'utf8'));
  const uploads = workflow.jobs.smoke.steps.filter((step) =>
    step.uses?.startsWith('actions/upload-artifact@'),
  );
  const prefix = '/runner-temp/tiny-wins-smoke/';
  const patterns = uploads.flatMap((step) =>
    step.with.path
      .replaceAll('${{ runner.temp }}', '/runner-temp')
      .trim()
      .split('\n')
      .map((pattern) => pattern.trim()),
  );
  const uploaded = (relative) =>
    patterns.some((pattern) => matchesGlob(prefix + relative, pattern));
  for (const file of [
    'results.xml',
    'feature-results.xml',
    'metro.log',
    'system-dark.txt',
    'screenshots/flow/commands.json',
    'screenshots/flow/screen-hierarchy/failure.xml',
    'screenshots/flow/screen-hierarchy/failure.json',
    'screenshots/flow/screenshots/failure.png',
    'screenshots/flow/takeScreenshot/today.png',
    'screenshots/flow/logs/maestro.log',
    'screenshots/flow/logs/device-xctest.log',
  ])
    expect(uploaded(file), file).toBe(true);
  for (const file of [
    'device-simulator.log',
    'screenshots/flow/logs/device-simulator.log',
    'screenshots/flow/logs/unexpected-system-dump.log',
    'credentials.json',
    '.env',
    'upload.jks',
    'screenshots/flow/logs/.env',
    'screenshots/flow/screen-hierarchy/.env',
    'screenshots/flow/screenshots/credentials.json',
  ])
    expect(uploaded(file), file).toBe(false);
});
