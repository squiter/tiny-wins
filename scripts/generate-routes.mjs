import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const require = createRequire(import.meta.url);
const root = resolve('src/app');
process.env.EXPO_ROUTER_APP_ROOT = root;
// Match Expo CLI's generator so CI validates current routes without a dev server.
const { requireContext } = require('expo-router/internal/testing');
const { EXPO_ROUTER_CTX_IGNORE } = require('expo-router/_ctx-shared');
const {
  getTypedRoutesDeclarationFile,
} = require('@expo/router-server/build/typed-routes/generate');
const declaration = getTypedRoutesDeclarationFile(
  requireContext(root, true, EXPO_ROUTER_CTX_IGNORE),
);
if (!declaration) throw new Error('Expo route type generation failed.');
mkdirSync('.expo/types', { recursive: true });
writeFileSync('.expo/types/router.d.ts', declaration);
