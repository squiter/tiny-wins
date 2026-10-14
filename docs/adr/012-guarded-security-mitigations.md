# ADR-012: Bounded dependency overrides and temporary security mitigations

Status: accepted, temporary mitigations; release security gate remains open

The owner explicitly requested dependency vulnerability fixes and CI diagnosis. Keep Expo SDK 57 / compatible React Native rather than following npm's proposed downgrade to Expo 44 or RN 0.72. The 33 initial findings are dependency-propagated alerts, not 33 distinct root vulnerabilities.

Remove unused drizzle-kit and its configuration: migrations are already explicit versioned SQL exercised against real SQLite. Runtime Drizzle ORM stays. Scope overrides to xcode→uuid 11.1.1 (its CJS v4 API is retained) and query-string→decode-uri-component 0.5.0 (corrected decoder). Router's CJS query-string 7.1.3 requires an exact-version compatibility patch to consume the decoder's ESM default. Clean Node 24 installation, URL parsing tests, native project parsing/prebuild and all-platform export verify this boundary.

Published braces 3.0.3 and node-forge 1.4.0 have no patched release for the current advisories. A guarded, idempotent postinstall script applies local mitigations:

- Braces: reject nesting deeper than 128 before recursive traversal, including parser cleanup and direct AST compile/expand/stringify calls. Normal patterns retain their behavior. Very deeply nested glob patterns deliberately become a controlled SyntaxError.
- Forge: reject extra elements inside the existing validated DigestAlgorithm sequence in RSA PKCS#1 v1.5 verification. Existing tags/hash validation remain intact; legitimate algorithm encodings/signatures remain accepted. A regression signs a malformed DigestInfo with an ephemeral test key, proves original source accepts it, and verifies patched source rejects it. This validates the reported cardinality weakness, not all cryptographic behavior.

Package versions and source replacement counts must match, or installation fails for manual review. Remove patches only after a verified upstream release and retain regression tests. No audit suppression, renamed fake package version, bypassed certificate verification or vulnerable forced downgrade. The raw npm audit continues failing because it evaluates published versions rather than patched installed contents. A release requires upstream updates or a separately reviewed security decision; local mitigation tests do not make that gate pass.

Sources: [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [forge advisory](https://github.com/advisories/GHSA-86w9-cpqp-85rv), [decoder advisory](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr), [uuid advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq).
