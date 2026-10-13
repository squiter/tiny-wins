import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { expect, it } from 'vitest';

// Exercise the installed browser worker code, including its real serializer,
// without starting a browser or changing globals in other tests.
function loadWorkerModule(name: string): Record<string, (arg: unknown) => unknown> {
  const source = readFileSync(
    new URL(`../../node_modules/expo-sqlite/web/${name}.ts`, import.meta.url),
    'utf8',
  );
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  runInNewContext(code, {
    exports,
    require: (path: string) => loadWorkerModule(path.slice(2)),
    SharedArrayBuffer,
    Uint8Array,
    Uint32Array,
    Int32Array,
    Atomics,
    TextEncoder,
    TextDecoder,
    console,
    __DEV__: false,
  });
  return exports;
}
it('roundtrips browser worker results larger than one byte of length, including UTF-8 titles', () => {
  const channel = loadWorkerModule('WorkerChannel');
  const serializer = loadWorkerModule('SyncSerializer');
  const result = Array.from({ length: 6 }, (_, index) => ({
    id: `habit-${index}`,
    title: 'Ler um livro — 🌱'.repeat(5),
    icon: 'book',
    color: 'coral',
  }));
  const lockBuffer = new SharedArrayBuffer(4);
  const resultBuffer = new SharedArrayBuffer(1024 * 1024);
  channel.sendWorkerResult!({
    id: 1,
    result,
    error: null,
    syncTrait: { lockBuffer, resultBuffer },
  });
  const length = new Uint32Array(resultBuffer, 0, 1)[0]!;
  expect(length).toBeGreaterThan(255);
  const json = new TextDecoder().decode(new Uint8Array(resultBuffer, 4, length));
  expect(serializer.deserialize!(json)).toEqual({ result });
  expect(Atomics.load(new Int32Array(lockBuffer), 0)).toBe(2);
});
