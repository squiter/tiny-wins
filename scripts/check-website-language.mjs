import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  languageUrl,
  readPreference,
  resolveLanguage,
  savePreference,
} from '../website/language.mjs';

test('browser preferences select the first supported language, with English fallback', () => {
  assert.equal(resolveLanguage('auto', ['pt-PT', 'en-US']), 'pt-BR');
  assert.equal(resolveLanguage('auto', ['en-GB', 'pt-BR']), 'en');
  assert.equal(resolveLanguage('auto', ['fr-FR', 'PT-br']), 'pt-BR');
  assert.equal(resolveLanguage('auto', ['ja-JP']), 'en');
  assert.equal(resolveLanguage('auto'), 'en');
});

test('manual overrides take precedence over browser languages', () => {
  assert.equal(resolveLanguage('en', ['pt-BR']), 'en');
  assert.equal(resolveLanguage('pt-BR', ['en-US']), 'pt-BR');
  assert.equal(resolveLanguage('invalid', ['pt-BR']), 'pt-BR');
});

test('preferences persist and auto removes the saved override', () => {
  const data = new Map();
  const storage = {
    getItem: (key) => data.get(key),
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
  assert.equal(readPreference(storage), 'auto');
  savePreference(storage, 'pt-BR');
  assert.equal(readPreference(storage), 'pt-BR');
  savePreference(storage, 'en');
  assert.equal(readPreference(storage), 'en');
  savePreference(storage, 'auto');
  assert.equal(readPreference(storage), 'auto');
  assert.equal(data.size, 0);
  assert.throws(() => savePreference(storage, 'fr'));
});

test('unavailable or blocked storage never breaks resolution or switching', () => {
  const blocked = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
    removeItem() {
      throw new Error('blocked');
    },
  };
  assert.equal(readPreference(blocked), 'auto');
  assert.equal(readPreference(undefined), 'auto');
  assert.doesNotThrow(() => savePreference(blocked, 'en'));
  assert.doesNotThrow(() => savePreference(blocked, 'auto'));
  assert.doesNotThrow(() => savePreference(undefined, 'pt-BR'));
});

test('localized URLs retain page, fragment and explicit selection under project hosting', () => {
  const base = 'https://squiter.github.io/tiny-wins/';
  assert.equal(
    languageUrl(base, 'privacy.html', 'pt-BR', 'pt-BR', '#contact').href,
    base + 'pt/privacy.html?lang=pt-BR#contact',
  );
  assert.equal(languageUrl(base, 'support.html', 'en', 'en').href, base + 'support.html?lang=en');
  assert.equal(
    languageUrl(base, 'index.html', 'pt-BR', 'auto', '#por-dentro').href,
    base + 'pt/?lang=auto#por-dentro',
  );
  assert.equal(languageUrl(base, 'index.html', 'en').href, base);
  assert.throws(() => languageUrl(base, '../private.html', 'en'));
});

test('local preview and language return produce stable canonical paths without loops', () => {
  const base = 'http://localhost:8093/';
  for (const page of ['index.html', 'support.html', 'privacy.html']) {
    const pt = languageUrl(base, page, 'pt-BR', 'pt-BR');
    const en = languageUrl(base, page, 'en', 'en');
    assert.equal(pt.origin, 'http://localhost:8093');
    assert.equal(pt.pathname, '/pt/' + (page === 'index.html' ? '' : page));
    assert.equal(en.pathname, '/' + (page === 'index.html' ? '' : page));
    assert.equal(languageUrl(base, page, 'pt-BR', 'pt-BR').href, pt.href);
  }
});
