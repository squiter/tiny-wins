const PREFERENCE_KEY = 'tiny-wins.site-language';
const PREFERENCES = new Set(['auto', 'en', 'pt-BR']);
const PAGES = new Set(['index.html', 'support.html', 'privacy.html']);

export function resolveLanguage(preference, browserLanguages = []) {
  if (preference === 'en' || preference === 'pt-BR') return preference;
  for (const language of browserLanguages) {
    const primary = String(language).toLowerCase().split('-')[0];
    if (primary === 'en') return 'en';
    if (primary === 'pt') return 'pt-BR';
  }
  return 'en';
}

export function readPreference(storage) {
  try {
    const preference = storage.getItem(PREFERENCE_KEY);
    return PREFERENCES.has(preference) ? preference : 'auto';
  } catch {
    return 'auto';
  }
}

export function savePreference(storage, preference) {
  if (!PREFERENCES.has(preference)) throw new Error('Unsupported site language');
  try {
    if (preference === 'auto') storage.removeItem(PREFERENCE_KEY);
    else storage.setItem(PREFERENCE_KEY, preference);
  } catch {
    // The URL carries an explicit choice even when browser storage is unavailable.
  }
}

export function languageUrl(baseUrl, page, language, preference, hash = '') {
  if (!PAGES.has(page) || !['en', 'pt-BR'].includes(language)) {
    throw new Error('Unsupported localized page');
  }
  const prefix = language === 'pt-BR' ? 'pt/' : '';
  const url = new URL(prefix + (page === 'index.html' ? '' : page), baseUrl);
  if (PREFERENCES.has(preference)) url.searchParams.set('lang', preference);
  url.hash = hash;
  return url;
}

function initializeLanguage() {
  const root = document.documentElement;
  const current = new URL(window.location.href);
  const base = new URL(root.dataset.siteRoot, current);
  const page = root.dataset.page;
  const query = current.searchParams.get('lang');
  // Access to localStorage itself can throw in restricted/private browser contexts.
  let storage;
  try {
    storage = window.localStorage;
  } catch {
    storage = undefined;
  }
  const preference = PREFERENCES.has(query) ? query : readPreference(storage);
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const language = resolveLanguage(preference, browserLanguages);
  const explicit = PREFERENCES.has(query) ? preference : undefined;
  const target = languageUrl(base, page, language, explicit, current.hash);
  if (target.pathname !== current.pathname) {
    window.location.replace(target.href);
    return;
  }

  const selector = document.querySelector('#site-language');
  selector.value = preference;
  selector.disabled = false;
  selector.addEventListener('change', () => {
    const nextPreference = selector.value;
    savePreference(storage, nextPreference);
    const nextLanguage = resolveLanguage(nextPreference, browserLanguages);
    window.location.assign(
      languageUrl(base, page, nextLanguage, nextPreference, window.location.hash),
    );
  });

  // Preserve explicit choices through internal navigation, including blocked-storage mode.
  if (explicit) {
    for (const link of document.querySelectorAll('a[href]')) {
      if (link.getAttribute('href').startsWith('#')) continue;
      const destination = new URL(link.href);
      if (destination.origin === base.origin && destination.pathname.startsWith(base.pathname)) {
        destination.searchParams.set('lang', explicit);
        link.href = destination.href;
      }
    }
  }
}

if (typeof document !== 'undefined') initializeLanguage();
