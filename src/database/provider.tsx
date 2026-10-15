import type { LanguagePreference } from '../features/localization/locale';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type PropsWithChildren,
} from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { HabitRepository } from '../features/habits/repository';
import { sqliteRepository } from './repository';
import { migrate, type MigrationDatabase } from './migrations';
import * as schema from './schema';
import type { Appearance, WeekStartsOn } from '../domain/preferences';
const PreferencesContext = createContext<{
  language: LanguagePreference;
  setLanguage(value: LanguagePreference): void;
  celebrationAnimations: boolean;
  setCelebrationAnimations(value: boolean): void;
  appearance: Appearance;
  setAppearance(value: Appearance): void;
  weekStartsOn: WeekStartsOn;
  setWeekStartsOn(value: WeekStartsOn): void;
} | null>(null);
const initialize = async (database: MigrationDatabase) => migrate(database);
const Context = createContext<HabitRepository | null>(null);
function RepositoryProvider({ children }: PropsWithChildren) {
  const sqlite = useSQLiteContext();
  const repository = useMemo(() => sqliteRepository(drizzle(sqlite, { schema })), [sqlite]);
  const [language, setLanguageState] = useState(() => repository.getLanguage());
  const setLanguage = useCallback(
    (value: LanguagePreference) => {
      repository.setLanguage(value);
      setLanguageState(value);
    },
    [repository],
  );
  const [celebrationAnimations, setCelebrations] = useState(() =>
    repository.getCelebrationAnimations(),
  );
  const setCelebrationAnimations = useCallback(
    (value: boolean) => {
      repository.setCelebrationAnimations(value);
      setCelebrations(value);
    },
    [repository],
  );
  const [appearance, setAppearanceState] = useState(() => repository.getAppearance());
  const setAppearance = useCallback(
    (value: Appearance) => {
      repository.setAppearance(value);
      setAppearanceState(value);
    },
    [repository],
  );
  const [weekStartsOn, setWeek] = useState(() => repository.getWeekStartsOn());
  const setWeekStartsOn = useCallback(
    (value: WeekStartsOn) => {
      repository.setWeekStartsOn(value);
      setWeek(value);
    },
    [repository],
  );
  const preferences = useMemo(
    () => ({
      language,
      setLanguage,
      weekStartsOn,
      setWeekStartsOn,
      appearance,
      setAppearance,
      celebrationAnimations,
      setCelebrationAnimations,
    }),
    [
      language,
      setLanguage,
      weekStartsOn,
      setWeekStartsOn,
      appearance,
      setAppearance,
      celebrationAnimations,
      setCelebrationAnimations,
    ],
  );
  return (
    <Context.Provider value={repository}>
      <PreferencesContext.Provider value={preferences}>{children}</PreferencesContext.Provider>
    </Context.Provider>
  );
}
export function DatabaseProvider({ children }: PropsWithChildren) {
  return (
    <SQLiteProvider databaseName="tiny-wins.db" onInit={initialize}>
      <RepositoryProvider>{children}</RepositoryProvider>
    </SQLiteProvider>
  );
}
export function useRepository() {
  const repository = useContext(Context);
  if (!repository) throw new Error('Database provider is missing');
  return repository;
}

export function usePreferences() {
  const preferences = useContext(PreferencesContext);
  if (!preferences) throw new Error('Database provider is missing');
  return preferences;
}
