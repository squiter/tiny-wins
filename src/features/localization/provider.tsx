import { portuguese, type MessageKey, type MessageValues } from './messages';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type PropsWithChildren,
} from 'react';
import { useLocales } from 'expo-localization';
import { usePreferences } from '../../database/provider';
import { resolveLanguage } from './locale';
import { interfaceCopy } from './presentation';

const Context = createContext<ReturnType<typeof interfaceCopy> | null>(null);
export function LocalizationProvider({ children }: PropsWithChildren) {
  const { language: preference } = usePreferences();
  const locales = useLocales();
  const language = resolveLanguage(preference, locales[0]?.languageTag);
  const value = useMemo(() => interfaceCopy(language), [language]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useI18n() {
  const value = useContext(Context);
  if (!value) throw new Error('Localization provider is missing.');
  return value;
}
// Recovery cannot assume the database (or saved preference) can be read.
export function useSystemI18n() {
  const locales = useLocales();
  const language = resolveLanguage('system', locales[0]?.languageTag);
  return useMemo(() => interfaceCopy(language), [language]);
}

// Keep message intent in state so an already-visible notice follows language changes.
export function useMessage() {
  const { t } = useI18n();
  const [message, setMessage] = useState<{ key: MessageKey; values?: MessageValues } | null>(null);
  const show = useCallback(
    (key: MessageKey | '', values?: MessageValues) => setMessage(key ? { key, values } : null),
    [],
  );
  const showFailure = useCallback((error: unknown, fallback: MessageKey) => {
    const key = error instanceof Error ? error.message : '';
    setMessage({ key: Object.hasOwn(portuguese, key) ? (key as MessageKey) : fallback });
  }, []);
  return [message ? t(message.key, message.values) : '', show, showFailure] as const;
}
