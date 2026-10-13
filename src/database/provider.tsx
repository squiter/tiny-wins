import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { HabitRepository } from '../features/habits/repository';
import { sqliteRepository } from './repository';
import { migrate, type MigrationDatabase } from './migrations';
import * as schema from './schema';
const initialize = async (database: MigrationDatabase) => migrate(database);
const Context = createContext<HabitRepository | null>(null);
function RepositoryProvider({ children }: PropsWithChildren) {
  const sqlite = useSQLiteContext();
  const repository = useMemo(() => sqliteRepository(drizzle(sqlite, { schema })), [sqlite]);
  return <Context.Provider value={repository}>{children}</Context.Provider>;
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
