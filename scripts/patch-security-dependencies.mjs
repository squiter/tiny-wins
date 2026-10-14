import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
async function version(name, expected) {
  const path = require.resolve(`${name}/package.json`);
  const data = JSON.parse(await readFile(path, 'utf8'));
  if (data.version !== expected) throw new Error(`Review security patch before updating ${name}.`);
}
async function patch(path, broken, fixed, count = 1) {
  const source = await readFile(path, 'utf8');
  if (source.includes(fixed)) return;
  if (source.split(broken).length - 1 !== count)
    throw new Error(`Dependency source changed; review security patch: ${path}`);
  await writeFile(path, source.replaceAll(broken, fixed));
}
await version('query-string', '7.1.3');
// The corrected decoder is ESM. SDK 57's CJS consumer needs its default export;
// Node 24 and Metro both support the module after this bounded compatibility fix.
await patch(
  require.resolve('query-string'),
  "const decodeComponent = require('decode-uri-component');",
  "const decodeComponent = require('decode-uri-component').default;",
);
await version('braces', '3.0.3');
const bracesPath = new URL('../node_modules/braces/', import.meta.url);
// Bound parser depth before its unmatched-node cleanup can call stringify.
await patch(
  new URL('lib/parse.js', bracesPath),
  '      stack.push(block);',
  "      stack.push(block);\n      if (stack.length > 129) throw new SyntaxError('Brace nesting exceeds 128.');",
  2,
);
// Direct AST callers can bypass parse. Check children iteratively before the
// recursive walkers; parent/prev backlinks are deliberately not traversed.
const guard = `
  const pending = [[ast, 0]];
  while (pending.length) {
    const [node, depth] = pending.pop();
    if (depth > 128) throw new SyntaxError('Brace nesting exceeds 128.');
    if (node.nodes) for (const child of node.nodes) pending.push([child, depth + 1]);
  }
`;
for (const file of ['compile', 'expand']) {
  const entry = `const ${file} = (ast, options = {}) => {`;
  await patch(new URL(`lib/${file}.js`, bracesPath), entry, entry + guard);
}
const stringifyEntry = 'module.exports = (ast, options = {}) => {';
await patch(new URL('lib/stringify.js', bracesPath), stringifyEntry, stringifyEntry + guard);
await version('node-forge', '1.4.0');
// The existing validator checks tags and the outer count but permits extra
// nested algorithm elements. Retain valid SHA encodings with optional NULL,
// rejecting the extra elements described in GHSA-86w9-cpqp-85rv.
await patch(
  require.resolve('node-forge/lib/rsa'),
  'obj.value.length !== 2',
  'obj.value.length !== 2 || obj.value[0].value.length > 2',
);
console.log(
  'Guarded decoder compatibility and braces/forge mitigations applied. Audit remains required.',
);
