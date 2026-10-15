# CI and dependency remediation

## Current status — 2026-10-15

On ca24722, [iOS compilation 38655197293](https://github.com/squiter/tiny-wins/actions/runs/38655197293), [Android compilation 38655197167](https://github.com/squiter/tiny-wins/actions/runs/38655197167) and [eight iPhone flows 38656406501](https://github.com/squiter/tiny-wins/actions/runs/38656406501) PASS. [Validate 38655197157](https://github.com/squiter/tiny-wins/actions/runs/38655197157) passes verify; only dependency-audit fails. JUnit and OS readbacks/captures were reviewed. Earlier simulator failures are superseded, not ignored.

A clean npm ci and npm run verify pass again: 70 unit + 22 SQLite integration tests, including exploit and valid-input mitigation regressions, strict checks and three exports. Raw audit JSON exits 1 with 18 high / 0 moderate / 0 critical. npm/GitHub advisories still list braces 3.0.3 and forge 1.4.0 without corrected releases. CI now preserves the full raw audit JSON as a seven-day artifact; its high/critical exit semantics are unchanged. No dependency update/downgrade was applied.

[Proposed ADR-020](adr/020-proposed-patched-dependency-audit-policy.md) describes a temporary, expiring exception for the two exact advisories only if patched source hashes and exploit regressions pass. It contains concrete hashes and residual risks. It is **not approved or implemented**; the current gate remains red. ADR-012 requires a separately reviewed security decision before changing this policy.

## Diagnosis

Main commit `8165536`, [Validate run 38492768239](https://github.com/squiter/tiny-wins/actions/runs/38492768239): `verify` passed; `dependency-audit` failed on 33 findings (18 high, 15 moderate). This was an actual security gate failure, not a test/build failure.

Earlier native runs marked cancelled were superseded by later pushes. At diagnosis, Android run 38492768310 and iOS run 38492768347 were still compiling; this does not establish a compiler failure. Prior Android builds are recorded in DELIVERY_REPORT.md. No iOS success is claimed.

Push+PR had scheduled duplicate native builds for the same branch. Workflows now trigger push on main and PR for other branches, sharing concurrency by head branch name. For iOS, compile only ARM64 simulator rather than a generic two-architecture build; the artifact targets Apple Silicon simulators. Keep timeouts, unsigned builds, pinned actions, read-only permissions and the separate audit gate.

## Remediation

| Root dependency                  | Change                                                                     | Actual result                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| drizzle-kit / old esbuild loader | Remove unused generator/config; keep runtime ORM and tested SQL migrations | Removed corresponding moderate alerts                                                                |
| xcode → uuid                     | Scoped override 11.1.1                                                     | Project parsing/UUID generation and iOS/Android prebuild pass                                        |
| query-string → decoder           | Scoped override 0.5.0 plus guarded default-export compatibility            | Unicode/malformed queries, actual Router navigation and exports pass                                 |
| braces 3.0.3                     | Guard parse/AST walkers at nesting depth 128                               | Deep strings/direct ASTs reject with controlled error; normal patterns pass                          |
| node-forge 1.4.0                 | Reject extra nested DigestAlgorithm elements                               | Original source accepts the malformed regression; patched rejects it; normal SHA256 signature passes |

Audit after changes: **18 high, 0 moderate, 0 critical**. All 15 moderate alerts were removed. The remaining high alerts propagate from two upstream packages without a corrected published release. Local mitigations are reproducible on clean install, but the version-based audit intentionally stays red. See ADR-012 and the upstream advisories; this is not a release security approval.

## Verification

- Clean `npm ci` applies all guarded patches; running patch scripts again is idempotent.
- `npm run verify` passes **64 tests** (47 unit, 17 real SQLite/worker/dependency integration), types/lint/format and iOS/Android/web exports.
- Clean installation and the full gate also pass under **Node 24.21.0**, matching hosted CI's major version; Node 26 verification passed separately.
- `expo prebuild --platform ios --no-install` and Android equivalent pass with the changed dependency graph. Prebuild creates projects, not native compilation or runtime proof.
- Actual browser navigation to a habit date query opens the correct day inspector; Today/Insights/Settings load and the existing six habits/three wins remain intact. A stopped preview server was restarted; the stale error tab was replaced with a working preview tab.
- Native compile results for the new graph still require the next hosted run. Native Maestro/accessibility/runtime gates remain open.

## Next steps

Release-preparation refresh (2026-10-14): raw `npm audit --json` still reports **18 high, 0 moderate, 0 critical**, with the same braces 3.0.3 / node-forge 1.4.0 advisories. `npm ls` places both under Expo CLI/Metro tooling. Validate run 38636973295 on 6524866 passes its verify job and fails only the separate dependency audit. No corrected package update is inferred from this audit output. Its offered Expo 44.0.6 downgrade is incompatible with the approved baseline and was not applied. Tooling dependency placement informs a future reviewed risk assessment; it does not close the release gate or prove absence from every production artifact.

Follow the new native jobs, review any actual compiler error, and replace temporary security patches when upstream corrected releases exist. Keep security alerts visible. The planned per-habit binary victory-tile Insights overview is task 008; it was intentionally not implemented in this security slice.

## Conditional tooling policy — 2026-10-15

Owner approved temporary patches if these audit findings do not prevent App Store release. Apple guidelines require secure app/SDK behavior but publish no npm audit exit-code requirement. An inspected iOS production export with source maps has 1,685 module sources and excludes braces/node-forge. These findings are tooling-only for that export; final signed candidate inspection remains required, and App Review acceptance is not guaranteed.

ADR-020 is now accepted with conditions. npm run security remains the unmodified failing scanner. npm run security:policy saves raw JSON/status and allows only the two reviewed IDs, exact installed patched files/versions/paths and the 18 captured propagation records until 2026-10-22T00:00:00Z. Critical/new findings, invalid/network/scanner responses, changed/missing source or expiry fail closed. CI runs exploit/valid-input integration regressions before this policy. Local policy PASS with raw exit 1 / 18 high; dedicated tests reject mismatches and attacks. No dependency rename/downgrade or blanket severity suppression.

CI also requires npm run security:bundle: freshly export production iOS JavaScript with source maps, require actual app routes/nonempty module inventory and reject braces/node-forge paths. Save inspection JSON alongside the audit. This is stronger reachability evidence than dependency ancestry alone, without claiming final signed-archive inspection.
