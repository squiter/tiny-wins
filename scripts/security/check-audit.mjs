import { spawnSync } from 'node:child_process';
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { assessAudit, verifyPatches } from './audit-policy.mjs';

try {
  const manifest = JSON.parse(await readFile(new URL('./patch-manifest.json', import.meta.url)));
  const audit = spawnSync('npm', ['audit', '--audit-level=high', '--json'], {
    encoding: 'utf8',
    timeout: 120000,
    maxBuffer: 10 * 1024 * 1024,
  });
  await writeFile('dependency-audit.json', audit.stdout || '');
  if (audit.error || ![0, 1].includes(audit.status))
    throw new Error('npm audit could not complete; security policy fails closed.');
  const report = JSON.parse(audit.stdout);
  let patchesVerified = false;
  if (report.metadata?.vulnerabilities?.high || report.metadata?.vulnerabilities?.critical) {
    await verifyPatches(process.cwd(), manifest);
    patchesVerified = true;
  }
  const decision = assessAudit(report, { now: Date.now(), patchesVerified, manifest });
  const summary = `Raw npm audit exit: ${audit.status}. High: ${report.metadata?.vulnerabilities?.high ?? 'unknown'}; critical: ${report.metadata?.vulnerabilities?.critical ?? 'unknown'}.\nSecurity policy: ${decision.allowed ? 'PASS' : 'FAIL'} — ${decision.reason}\nTemporary exception active: ${decision.exceptions}. Expiry: ${manifest.expiresAt}.\n`;
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `## Dependency security policy\n\n${summary}\nRaw unmodified report: dependency-audit artifact. A policy pass is not a clean raw audit.\n`,
    );
  if (!decision.allowed) process.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Security policy failed.');
  process.exitCode = 1;
}
