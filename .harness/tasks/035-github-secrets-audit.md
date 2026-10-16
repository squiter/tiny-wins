# Task: 035 — GitHub Actions secrets exposure audit

Status: complete — scoped audit with one explicitly partial historical artifact
Goal: Audit repository/environment secrets and variables, published/local Actions, retained logs/artifacts and tracked history for public credential exposure.
Non-goals: Reveal/download secret values, rotate working credentials without evidence, change distribution/account settings or overwrite concurrent task 033/034 work.
Files/modules allowed: Focused security audit report, evidence without sensitive values, narrow workflow/script fixes and regression checks if supported by findings.
Dependencies: Owner explicitly requested detailed GitHub secrets/variables/Actions validation on 2026-10-16. Preserve concurrent release automation and owner plan edits.
Acceptance criteria:

- Inventory scopes and protections using metadata; never print secret values.
- Inspect published main separately from uncommitted release automation, following secret inputs through commands, errors, caches and uploads.
- Scan accessible retained workflow logs and relevant artifacts/history for credential indicators; document coverage, unavailable/expired material and false positives.
- Address concrete exposure paths within the authorized scope, test changes and distinguish confirmed leaks from preventive findings.
- Record exact evidence and limitations; no absolute guarantee based on GitHub masking alone.

Required tests: Targeted scanners/workflow review, available GitHub security alerts, relevant regression checks and npm run verify for code/config changes.
Commands executed / results:

- GitHub metadata API: 0 repository/Dependabot secrets, 4 environment signing secrets; 4 variables classified as public identifiers/fingerprint/control. Environment/branch/tag rules, immutable OIDC subject, read-only defaults, pinned source and zero available secret alerts reviewed. No stored signing secret plaintext retrieved.
- 246 original completed run logs + 2 new runs, 249 archives including failed/successful real Google OIDC attempts: Gitleaks zero indicators, successful token environment visibly masked. CLI HTTP/network canaries PASS; 24 release regression tests PASS.
- 169 artifact manifests / 2,311 entries inspected, zero recognized credential filenames. Text read complete for 168; artifact 12064947466 remains partial after connection reset on retry. 1,470 text/config/log files / 14.67 GB scanned. Six whole-artifact recursive byte inspections include two APKs. Media/most nested historical binaries not exhaustively decoded.
- Official Gitleaks 8.30.1 checksum verified. Git history raw exit 1: one SHA256 file-integrity digest manually verified. Artifact raw exit 1: 3,296 classified OS diagnostic candidates, zero unclassified; no scanner allowlist or suppression. Actual cryptographic platform asset metadata is recorded as unnecessary OS exposure, not dismissed as a clean scanner result or leaked Tiny Wins credential.
- Narrow fix published as d0ee0f1: explicit/typed iOS evidence upload paths, no broad simulator folder. New glob regression retains required reports/screenshots/hierarchies and rejects raw OS logs/representative credential paths. No UI/persistence change or new dependency/permission.
- npm run verify PASS: 118 unit + 57 integration (175), types/lint/format and all exports. Hosted Validate 38981990855 PASS on successor 2afbed1, which includes the correction; earlier d0ee CI was superseded, not a test failure.
- Report: docs/GITHUB_ACTIONS_SECURITY_AUDIT.md; sanitized evidence: .harness/evidence/035-security. Raw logs/OS values and scanner candidate values are excluded from publication. Concurrent task 033/034/036 and owner plan edits preserved.
  Open questions: None for read-only audit; publishing/rotation follow-up depends on findings.
  Handoff summary: No confirmed public Tiny Wins credential exposure found within documented coverage. Excessive simulator diagnostics upload corrected/published. Legacy manual candidate environment binding remains separately prepared local work; keep signing secrets environment-scoped. First hosted signing/Play publication and independent Google IAM review remain outside this audit.
