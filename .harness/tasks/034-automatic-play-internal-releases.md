# Task: 034 — Automatic protected Google Play internal releases

Status: prepared — GitHub/Google configured and hosted authentication PASS; Play permissions/first-app/pilot acceptance pending
Goal: Automate validated release tags → signed AAB → Play internal testing without per-release approval; use constrained credentials and short-lived Google authentication.
Non-goals: Production publication, accepting legal terms, payments, bypassing pending Play account checks, generating a permanent Google service-account JSON key, changing app UI/data, or touching the owner's plan edits.
Files/modules allowed: Android candidate/release workflows and focused release scripts/tests, release guide, ADR-024, this task/backlog/evidence; GitHub environment/secrets/variables/rules required for this authorized setup.
Dependencies: Owner explicitly selected the recommended automatic setup on 2026-10-16. Upload-key backup exists in 1Password. Play identity review still blocks first-app creation; Google Cloud project/identity provider/service-account details must be confirmed, never invented.
Acceptance criteria:

- Only authorized main-source release tags can reach signing; public PR/fork jobs never receive signing secrets or Google credentials.
- Tests/security run without secrets before signing. Use isolated hosted runners, pinned actions, transient credential files, minimal token permissions and protected tag/environment rules, without required manual reviewers.
- Separate upload-key signing from Google Play app signing; store only the upload credential in the restricted GitHub environment, retaining the verified 1Password backup.
- Use Workload Identity Federation/OIDC for Google API access; no permanent account key JSON. Restrict the service identity to this app's internal testing.
- Publishing stays disabled until account/app/first upload/API prerequisites are ready; never fall back to production or claim skipped publishing as completed.
- Validate release provenance/version/artifact checks and API behavior with negative tests; run npm run verify and review remote settings readback.
- Document exact configured state, pending Google-side steps and operational/security tradeoffs.

Required tests: Release helper/publisher/workflow security regressions; npm run verify; remote environment/tag/main-policy readbacks; actual signed CI execution when source and configuration are available. No app UI/persistence changes.
Commands executed / results:

- Current GitHub repository is public, default main; owner token has admin permissions. No existing rulesets or main branch protection; github-pages is the only environment. Existing release workflow is manual-only with read-only repository token.

- Configured and read back android-signing (main + android-v* tags) and android-publish (android-v* tags only), with no required reviewers and no environment admin bypass.
- Configured three active rulesets: main updates and release-tag creation restricted to admins; release-tag updates/deletions prohibited without bypass. Current sole direct collaborator is the owner/admin.
- Automatic review initially denied the sensitive transfer under broad consent. Owner subsequently explicitly authorized the exact Private 1Password → four android-signing Secrets transfer. Completed once after that consent, verified backup bytes before reading and checked all four remote secret names without printing values. Configured public certificate variable and PLAY_INTERNAL_ENABLED=false. No permanent Google account key created.
- Extracted the existing signing helper; added tag/version planning, protected release workflow, internal-only API publisher and one-time Google OIDC setup script. Actions are pinned by commit. Documentation explains trust, version codes, failures and prerequisites.
- Initial npm run verify caught missing explicit node:buffer imports in the new publisher/test. Fixed both; final npm run verify PASS: 118 unit + 54 integration = 172 tests, types/lint/format and iOS/Android/web exports.
- bash -n for both new shell helpers, node --check for both new JS helpers, git diff --check: PASS.
- npm run security:bundle: PASS, 1701 production iOS modules; affected tooling absent. Initial network-limited security:policy attempt failed closed with an invalid audit report; network-enabled retry PASS under existing approved exception, raw 18 high/0 critical, expiry 2026-10-22T00:00:00Z. Audit is not clean.
- Evidence: .harness/evidence/034-automation/. No passwords, private key bytes or tokens retained there.
- Owner has no Cloud project and wants to create one; initial project/terms selection remains with owner. Google bootstrap script not executed; gcloud unavailable locally. Console account checks still block initial Play app creation.
- No commit/push or release tag created in this side conversation; hosted signing workflow and Google token/API path remain unexecuted. Existing owner plan modifications preserved. No UI/persistence changes or new device claims.

Open questions: Owner creates/selects Google Cloud project; pending Play account verification and first app/permissions/pilot setup.
Handoff summary: Restricted GitHub signing credentials are ready, and local release automation passes verification. Guide owner through Cloud project creation, configure short-lived identity, publish workflow source and prove hosted signing, then complete first Play upload and pilot update before enabling internal publishing. No per-release credential approval is configured.

## Recovered Cloud setup — 2026-10-16

Owner supplied project `tiny-wins-511823` and confirmed at action time the restricted Google identity binding and registration of public GitHub identifiers. Recovered the existing Firefox Cloud Shell; verified project number 295413158727. Executed the reviewed bootstrap: required APIs enabled, dedicated `tiny-wins-play` service account, `tiny-wins-github` pool and `android-release` provider created; impersonation binding limited to repository ID 1418132621. Read back ACTIVE provider, exact owner/repository/workflow/tag/environment conditions and an empty list of user-managed service-account keys. Registered and read back both public identifiers in GitHub android-publish. PLAY_INTERNAL_ENABLED remains false. No store access grant, release tag, workflow push or hosted token-exchange claim. Evidence: `.harness/evidence/034-automation/google-oidc-bootstrap.json`. Next: publish/review workflow source, validate hosted authentication, then app-scoped Play permissions/first upload/pilot gates before enabling publishing.

Hosted OIDC follow-up (task 036): source workflow published in 059dca8 and manual auth-only diagnostic run 38981458656 attempt 2 PASS. Initial runtime exposed the repository's immutable OIDC subject format; corrected only subject equality in Google and the bootstrap helper, preserving all other constraints. 174 final local tests pass in the isolated publication snapshot. No AAB was built, no Play API call was made, no artifacts were created and PLAY_INTERNAL_ENABLED remains false. Frozen evidence: .harness/evidence/036-oidc/acceptance-summary.json. Earlier pending-auth notes above are historical; app access/first upload/pilot remain pending.
