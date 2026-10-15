# ADR-020: Temporary acceptance of verified patched tooling dependencies

Status: **Accepted with conditions on 2026-10-15; implementation validated locally, hosted CI pending.**

## Problem and current evidence

Main ca24722 compiles on iOS and Android, passes verify, and passes eight iPhone simulator flows. Validate remains red because raw npm audit evaluates published dependency versions, while guarded postinstall patches modify the installed sources. The 18 propagated high alerts have two root advisories: GHSA-vfj7-8cjw-p6xm (braces 3.0.3) and GHSA-86w9-cpqp-85rv (node-forge 1.4.0). Registry/advisories checked today still provide no patched release. Updating Expo alone cannot establish these roots are fixed. Expo 44 downgrade is incompatible with the approved baseline.

The existing regression tests reject deep string/direct-AST brace recursion, reject malformed RSA DigestAlgorithm cardinality accepted by original forge, and accept legitimate patterns/signatures. These prove bounded mitigations, not absence of every possible exploit or vulnerability. The dependencies are introduced by Expo/Metro tooling; this is not blanket proof that every production artifact excludes them.

## Owner decision and evidence

Permit a temporary CI policy exception **only for those two advisories on the exact verified patched installed source**, until 2026-10-22T00:00:00Z. This is a change to the project's current rule that every high advisory blocks CI; it is not an upstream package fix or a claim of zero vulnerabilities. This approval authorizes the CI policy, not store submission or publication.

The owner conditionally authorized a temporary patch if this audit issue does not prevent App Store release. Official Apple guidelines require appropriate app/SDK security but specify no npm audit exit-code gate; the inference is that a tooling-only scanner alert is not an automatic App Review blocker. An iOS production export with source maps contains 1,685 module sources and no braces/node-forge modules. This supports a tooling-only classification for this JavaScript export, not a guarantee about the signed IPA or App Review. Final signed-candidate inspection remains a release gate. [Apple guideline 1.6 and SDK responsibility](https://developer.apple.com/app-store/review/guidelines/).

CI additionally runs npm run security:bundle: an iOS production export/source-map inventory must contain app routes, valid sources and no braces/node-forge modules. Missing/malformed inventory or affected modules fail the job. The machine-readable inspection is saved beside the raw audit artifact. This enforces the tooling-only assumption on each CI run while retaining final signed-archive review.

Implement all of these together:

1. Retain unmodified raw npm audit JSON and its nonzero result visibly in the job summary/artifact. Keep npm run security as the raw local scanner; add a distinctly named policy check for CI.
2. Permit only the two exact advisory IDs, affected package versions/paths and their derived dependency alerts. Fail on any other high/critical advisory, unknown propagation, unavailable/malformed audit response or scanner failure.
3. Verify installed patched file hashes and package versions against a reviewed manifest before applying any exception. Fail if files/versions differ or patch application changes. Keep postinstall guards and idempotency.
4. Require the existing exploit/valid-input regression tests and clean-install aggregate verification to pass. Add tests for policy rejection of unknown alerts, missing/tampered patches, new advisory propagation, network/parse errors and expiration.
5. Fail after the expiration date. Replace with verified upstream fixes as soon as available; remove the exception only after clean installation, regressions and native builds pass.

The exception would allow CI policy to pass for known patched packages while raw audit still reports 18 high alerts. Residual risk includes incomplete mitigation coverage, maintaining a temporary source patch and future advisory changes. A hash check verifies reviewed bytes; it is not an independent security audit.

## Alternatives

- Keep the current gate red until verified upstream corrected releases are available. This preserves the existing policy and requires no approval or code change.
- Maintain audited forks replacing the affected dependencies. This transfers broader dependency maintenance to this small app and requires a separate scoped design/approval; do not rename a vulnerable package merely to escape scanning.
- Do not use audit suppression, fabricated versions, continue-on-error, omission of tool dependencies, a lower severity threshold or forced SDK downgrade as a substitute for remediation.

The owner decision authorizes only this bounded tooling exception. ADR-012 states: “A release requires upstream updates or a separately reviewed security decision.” Raw npm audit remains unchanged; the separate policy check can pass only with verified patches and reviewed ancestry. No store submission is authorized by this decision.

Sources: [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [forge advisory](https://github.com/advisories/GHSA-86w9-cpqp-85rv), [existing mitigation decision](012-guarded-security-mitigations.md).

## Concrete patched-source candidate

SHA-256 values from the clean npm ci installation verified on 2026-10-15. scripts/security/patch-manifest.json enforces these hashes, exact root package versions, installed paths and all 18 reviewed propagation entries. Changes to these bytes or ancestry require another review.

| Package          | Patched source   | SHA-256                                                            |
| ---------------- | ---------------- | ------------------------------------------------------------------ |
| braces 3.0.3     | lib/parse.js     | `c1cd62e79d56b502929b3d92be4c6b51330ddbb8feacc8fd4a1c8cd2b255042d` |
| braces 3.0.3     | lib/compile.js   | `46cedefe25a1ad266eceb7f6e6e0a11bd61df471e5b2ab3956d94c2e5de20be1` |
| braces 3.0.3     | lib/expand.js    | `0b534f9d3b95461a155254c9722b6aa3c770202230ef2f2672df05c190db2a33` |
| braces 3.0.3     | lib/stringify.js | `51d4cf0e6a4eec18ad05f38c800e0996f617ead54d2a7f4fc26741e475d9086d` |
| node-forge 1.4.0 | lib/rsa.js       | `60a68d0605c9edeec694474835326bffb932d4f8f6f1ba3f5b0ccda912ae6090` |
