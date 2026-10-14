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
    () => ({ weekStartsOn, setWeekStartsOn, appearance, setAppearance }),
    [weekStartsOn, setWeekStartsOn, appearance, setAppearance],
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
