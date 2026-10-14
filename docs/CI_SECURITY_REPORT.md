# CI and dependency remediation

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

Follow the new native jobs, review any actual compiler error, and replace temporary security patches when upstream corrected releases exist. Keep security alerts visible. The planned per-habit binary victory-tile Insights overview is task 008; it was intentionally not implemented in this security slice.
