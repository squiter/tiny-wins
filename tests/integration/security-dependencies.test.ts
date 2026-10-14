import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';
const require = createRequire(import.meta.url);

it('bounds brace nesting before recursive compile/expand/stringify, including direct ASTs', () => {
  const braces = require('braces');
  const deeplyNested = '{'.repeat(4000) + 'a,b' + '}'.repeat(4000);
  for (const operation of ['parse', 'compile', 'expand', 'stringify']) {
    expect(() => braces[operation](deeplyNested)).toThrow(SyntaxError);
    expect(() => braces[operation](deeplyNested)).toThrow('nesting exceeds 128');
  }
  let ast: object = { type: 'text', value: 'a' };
  for (let index = 0; index < 4000; index++) ast = { type: 'root', nodes: [ast] };
  for (const operation of ['compile', 'expand', 'stringify'])
    expect(() => braces[operation](ast)).toThrow('nesting exceeds 128');
  expect(braces.expand('src/{app,domain}/{a,b}.ts')).toEqual([
    'src/app/a.ts',
    'src/app/b.ts',
    'src/domain/a.ts',
    'src/domain/b.ts',
  ]);
  expect(braces.compile('{1..3}')).toBe('([1-3])');
});

it('rejects the extra DigestAlgorithm element accepted by original forge, and accepts normal signatures', () => {
  // Isolate the original and patched RSA modules in a child process. No test
  // keys are written to disk and no forge globals leak into other tests.
  const result = execFileSync(
    process.execPath,
    [
      '-e',
      `
    const fs = require('node:fs');
    const Module = require('node:module');
    const forge = require('node-forge');
    const pair = forge.pki.rsa.generateKeyPair({bits:1024,e:3});
    const md = forge.md.sha256.create(); md.update('Tiny Wins regression fixture');
    const digest = md.digest().getBytes();
    const validSignature = pair.privateKey.sign(md);
    const a = forge.asn1;
    const algorithm = a.create(a.Class.UNIVERSAL,a.Type.SEQUENCE,true,[
      a.create(a.Class.UNIVERSAL,a.Type.OID,false,a.oidToDer(forge.oids.sha256).getBytes()),
      a.create(a.Class.UNIVERSAL,a.Type.NULL,false,''),
      a.create(a.Class.UNIVERSAL,a.Type.NULL,false,'')
    ]);
    const info = a.create(a.Class.UNIVERSAL,a.Type.SEQUENCE,true,[algorithm,a.create(a.Class.UNIVERSAL,a.Type.OCTETSTRING,false,digest)]);
    const malformed = pair.privateKey.sign(a.toDer(info).getBytes(),'NONE');
    let rejected = false; try { rejected = pair.publicKey.verify(digest,malformed) !== true; } catch { rejected = true; }
    const valid = pair.publicKey.verify(digest,validSignature);
    const path = require.resolve('node-forge/lib/rsa');
    const source = fs.readFileSync(path,'utf8').replace('obj.value.length !== 2 || obj.value[0].value.length > 2','obj.value.length !== 2');
    const original = new Module(path,module); original.filename = path; original.paths = Module._nodeModulePaths(require('node:path').dirname(path)); original._compile(source,path);
    const baseline = original.exports.setPublicKey(pair.publicKey.n,pair.publicKey.e);
    console.log(JSON.stringify({originalAccepted:baseline.verify(digest,malformed),patchedRejected:rejected,validAccepted:valid}));
  `,
    ],
    { cwd: process.cwd(), encoding: 'utf8', timeout: 10000 },
  );
  expect(JSON.parse(result)).toEqual({
    originalAccepted: true,
    patchedRejected: true,
    validAccepted: true,
  });
});

it('keeps Router query parsing and native project UUIDs compatible with patched dependencies', () => {
  const query = require('query-string');
  expect(query.parse('title=Ler%20%F0%9F%8C%B1&day=2026-10-13')).toEqual({
    title: 'Ler 🌱',
    day: '2026-10-13',
  });
  expect(query.stringify({ title: 'Ler 🌱', day: '2026-10-13' })).toBe(
    'day=2026-10-13&title=Ler%20%F0%9F%8C%B1',
  );
  expect(() => query.parse('value=%'.repeat(10000))).not.toThrow();
  const xcode = require('xcode');
  const project = xcode.project(
    fileURLToPath(new URL('../fixtures/minimal.pbxproj', import.meta.url)),
  );
  project.parseSync();
  expect(project.generateUuid()).toMatch(/^[0-9A-F]{24}$/);
});
