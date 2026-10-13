# ADR-008: Bounded repair of the browser SQLite response header

Status: accepted temporary compatibility fix. Date: 2026-10-13.

Live preview testing with several habits exposed truncated JSON from expo-sqlite 57.0.4's synchronous worker bridge. WorkerChannel.ts writes a 32-bit response length using Uint8Array.set with a Uint32Array input, which copies element values into bytes and loses the upper length bits. The receiver reads a Uint32 length and consequently receives only length modulo 256 bytes. This is a browser bridge bug, not corrupt habit data.

scripts/patch-expo-sqlite.mjs changes that single write to a Uint32Array view over the response buffer. It runs on npm postinstall, is idempotent, checks the exact package version/source and fails visibly if an upgrade needs review. expo-sqlite is pinned to 57.0.4; do not bypass the version check on upgrades. Remove this workaround once a verified upstream fix is available. No new package is introduced and no native SQLite behavior changes.

The regression test executes the actual installed worker module and serializer in a Node VM, including results over 255 bytes and UTF-8 habit titles. It failed against the original source (reported length 222), then passed after the repair. Multi-habit browser validation and a clean npm ci confirm both visible behavior and reproducibility. Native runtime checks remain separate.
