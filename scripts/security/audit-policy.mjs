import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function verifyPatches(root, manifest) {
  for (const [name, expected] of Object.entries(manifest.packages)) {
    const folder = resolve(root, 'node_modules', name);
    const actual = JSON.parse(await readFile(resolve(folder, 'package.json'), 'utf8'));
    if (actual.version !== expected.version) throw new Error(`Unreviewed ${name} version.`);
    for (const [file, hash] of Object.entries(expected.files)) {
      const bytes = await readFile(resolve(folder, file));
      if (createHash('sha256').update(bytes).digest('hex') !== hash)
        throw new Error(`Unreviewed or missing security patch: ${name}/${file}.`);
    }
  }
}

export function assessAudit(report, { now, patchesVerified, manifest }) {
  const fail = (reason) => ({ allowed: false, exceptions: false, reason });
  if (
    !report ||
    report.error ||
    !report.metadata?.vulnerabilities ||
    !report.vulnerabilities ||
    Array.isArray(report.vulnerabilities) ||
    typeof report.vulnerabilities !== 'object'
  )
    return fail('Missing or invalid npm audit report.');
  const entries = Object.entries(report.vulnerabilities);
  const counts = report.metadata.vulnerabilities;
  const severities = ['info', 'low', 'moderate', 'high', 'critical'];
  for (const severity of severities) {
    if (!Number.isInteger(counts[severity]) || counts[severity] < 0)
      return fail('Invalid audit severity counts.');
    if (entries.filter(([, entry]) => entry?.severity === severity).length !== counts[severity])
      return fail('Audit entries do not match severity counts.');
  }
  if (entries.some(([, entry]) => !severities.includes(entry?.severity)))
    return fail('Unknown audit severity.');
  if (counts.total !== entries.length) return fail('Invalid audit total.');
  const blocked = entries.filter(([, entry]) => ['high', 'critical'].includes(entry.severity));
  if (!blocked.length)
    return { allowed: true, exceptions: false, reason: 'No high/critical alerts.' };
  if (counts.critical) return fail('Critical alerts are never excepted.');
  if (!Number.isFinite(now) || !Number.isFinite(Date.parse(manifest.expiresAt)))
    return fail('Invalid policy clock or expiry.');
  if (now >= Date.parse(manifest.expiresAt)) return fail('Temporary security policy expired.');
  if (patchesVerified !== true) return fail('Patched installed source has not been verified.');

  for (const [name, entry] of blocked) {
    const expected = manifest.propagation[name];
    const via = entry.via?.map((item) => (typeof item === 'string' ? item : item?.url));
    if (
      !expected ||
      !Array.isArray(entry.nodes) ||
      !Array.isArray(via) ||
      via.some((value) => typeof value !== 'string') ||
      JSON.stringify([...entry.nodes].sort()) !== JSON.stringify(expected.nodes) ||
      JSON.stringify(via.sort()) !== JSON.stringify(expected.via)
    )
      return fail(`Unreviewed advisory propagation: ${name}.`);
    const pending = [name];
    const visited = new Set();
    let roots = 0;
    while (pending.length) {
      const current = pending.pop();
      if (visited.has(current)) continue;
      visited.add(current);
      const entry = report.vulnerabilities[current];
      if (!entry || !Array.isArray(entry.via) || !entry.via.length)
        return fail(`Unknown or missing advisory ancestry: ${current}.`);
      for (const via of entry.via) {
        if (typeof via === 'string') {
          pending.push(via);
          continue;
        }
        const prefix = 'https://github.com/advisories/';
        const id =
          typeof via?.url === 'string' && via.url.startsWith(prefix)
            ? via.url.slice(prefix.length)
            : '';
        const packageName = manifest.advisories[id];
        if (!packageName || current !== packageName || via.name !== packageName)
          return fail(`Unreviewed advisory affecting ${current}.`);
        if (entry.nodes?.length !== 1 || entry.nodes[0] !== `node_modules/${packageName}`)
          return fail(`Unreviewed installed path for ${packageName}.`);
        roots += 1;
      }
    }
    if (!roots) return fail(`No verified advisory root for ${name}.`);
  }
  return { allowed: true, exceptions: true, reason: 'Only reviewed, patched tooling advisories.' };
}

export function inspectModuleMaps(maps) {
  const sources = [];
  function collect(map) {
    if (!map || typeof map !== 'object') throw new Error('Invalid production source map.');
    if (Array.isArray(map.sources)) sources.push(...map.sources);
    if (Array.isArray(map.sections)) for (const section of map.sections) collect(section.map);
  }
  for (const map of maps) collect(map);
  if (!sources.length || sources.some((source) => typeof source !== 'string'))
    throw new Error('Production module inventory is missing or malformed.');
  const normalized = sources.map((source) => source.replaceAll('\\', '/'));
  if (!normalized.some((source) => source.includes('/src/app/') || source.startsWith('src/app/')))
    throw new Error('Production inventory does not identify the app routes.');
  const affected = normalized.filter((source) => /(^|\/)(braces|node-forge)(\/|$)/.test(source));
  if (affected.length)
    throw new Error(`Tooling dependency appears in production modules: ${affected.join(', ')}`);
  return {
    platform: 'ios',
    kind: 'production-js-export',
    modules: sources.length,
    affectedModules: affected,
    signedArchiveInspected: false,
  };
}
