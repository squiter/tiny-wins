import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { assessAudit } from '../../scripts/security/audit-policy.mjs';
const manifest = JSON.parse(
  readFileSync(new URL('../../scripts/security/patch-manifest.json', import.meta.url)),
);
const captured = JSON.parse(
  readFileSync(new URL('../fixtures/dependency-audit.json', import.meta.url)),
);
const options = { now: Date.parse('2026-10-15T12:00:00Z'), patchesVerified: true, manifest };
const assess = (report, overrides = {}) => assessAudit(report, { ...options, ...overrides });

describe('temporary patched tooling policy', () => {
  it('accepts the captured real report only as a visible exception', () => {
    expect(assess(captured)).toMatchObject({ allowed: true, exceptions: true });
    expect(assess(captured, { patchesVerified: false }).allowed).toBe(false);
  });
  it('allows a genuinely clean audit without an exception, even after expiry', () => {
    const clean = {
      vulnerabilities: {},
      metadata: {
        vulnerabilities: { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0 },
      },
    };
    expect(assess(clean, { now: Date.parse('2027-01-01'), patchesVerified: false })).toMatchObject({
      allowed: true,
      exceptions: false,
    });
  });
  it.each(['2026-10-22T00:00:00Z', '2026-11-01T00:00:00Z'])(
    'rejects exceptions at/after expiry: %s',
    (date) => {
      expect(assess(captured, { now: Date.parse(date) }).allowed).toBe(false);
    },
  );
  it('rejects an invalid clock', () => expect(assess(captured, { now: NaN }).allowed).toBe(false));
  it.each([
    null,
    {},
    { error: { code: 'ENETWORK' } },
    { metadata: { vulnerabilities: {} }, vulnerabilities: [] },
  ])('fails closed for missing/malformed scanner output', (report) => {
    expect(assess(report).allowed).toBe(false);
  });
  it('rejects mismatched severity counts', () => {
    const report = structuredClone(captured);
    report.metadata.vulnerabilities.high = 0;
    expect(assess(report).allowed).toBe(false);
  });
  it('rejects a new direct advisory even on a reviewed package', () => {
    const report = structuredClone(captured);
    report.vulnerabilities.braces.via.push({
      name: 'braces',
      url: 'https://github.com/advisories/GHSA-new-unknown-alert',
      severity: 'high',
    });
    expect(assess(report).allowed).toBe(false);
  });
  it('rejects a new affected dependency propagating a known advisory', () => {
    const report = structuredClone(captured);
    report.vulnerabilities.newPackage = {
      severity: 'high',
      nodes: ['node_modules/newPackage'],
      via: ['braces'],
    };
    report.metadata.vulnerabilities.high++;
    report.metadata.vulnerabilities.total++;
    expect(assess(report).allowed).toBe(false);
  });
  it('rejects another installed copy of an affected package', () => {
    const report = structuredClone(captured);
    report.vulnerabilities.braces.nodes.push('node_modules/other/node_modules/braces');
    expect(assess(report).allowed).toBe(false);
  });
  it('never permits a critical alert', () => {
    const report = structuredClone(captured);
    report.vulnerabilities.braces.severity = 'critical';
    report.metadata.vulnerabilities.high--;
    report.metadata.vulnerabilities.critical++;
    expect(assess(report).allowed).toBe(false);
  });
  it('rejects missing ancestry and closed cycles even if declared in a candidate manifest', () => {
    const report = {
      vulnerabilities: {
        a: { severity: 'high', nodes: ['node_modules/a'], via: ['b'] },
        b: { severity: 'high', nodes: ['node_modules/b'], via: ['a'] },
      },
      metadata: {
        vulnerabilities: { info: 0, low: 0, moderate: 0, high: 2, critical: 0, total: 2 },
      },
    };
    const candidate = {
      ...manifest,
      propagation: {
        a: { nodes: ['node_modules/a'], via: ['b'] },
        b: { nodes: ['node_modules/b'], via: ['a'] },
      },
    };
    expect(assess(report, { manifest: candidate }).allowed).toBe(false);
    delete report.vulnerabilities.b;
    report.metadata.vulnerabilities.high--;
    report.metadata.vulnerabilities.total--;
    expect(assess(report, { manifest: candidate }).allowed).toBe(false);
  });
});

it('rejects affected packages in production and missing/malformed module inventories', async () => {
  const { inspectModuleMaps } = await import('../../scripts/security/audit-policy.mjs');
  expect(
    inspectModuleMaps([
      { sources: ['../../src/app/index.tsx', '../../node_modules/react/index.js'] },
    ]),
  ).toMatchObject({ modules: 2, affectedModules: [], signedArchiveInspected: false });
  for (const packageName of ['braces', 'node-forge']) {
    expect(() =>
      inspectModuleMaps([
        { sources: ['src/app/index.tsx', `node_modules/${packageName}/index.js`] },
      ]),
    ).toThrow('Tooling dependency');
  }
  for (const maps of [
    [],
    [{}],
    [{ sources: [] }],
    [{ sources: [null] }],
    [{ sources: ['some-other-app.js'] }],
  ]) {
    expect(() => inspectModuleMaps(maps)).toThrow();
  }
  expect(
    inspectModuleMaps([{ sections: [{ map: { sources: ['src/app/index.tsx'] } }] }]).modules,
  ).toBe(1);
});
