export interface MigrationDatabase {
  execSync(sql: string): void;
  getFirstSync<T>(sql: string): T | null;
  withTransactionSync(operation: () => void): void;
}
const initialSchema = `
CREATE TABLE habits (
 id TEXT PRIMARY KEY NOT NULL,
 title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 1 AND 80),
 color TEXT NOT NULL CHECK(color IN ('forest','blue','coral','violet','teal','amber')),
 starts_on TEXT NOT NULL,
 created_at TEXT NOT NULL
);
CREATE TABLE completions (
 habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
 local_date TEXT NOT NULL,
 timezone TEXT NOT NULL,
 completed_at TEXT NOT NULL,
 PRIMARY KEY (habit_id, local_date)
);`;
const migrations = [
  initialSchema,
  `
ALTER TABLE habits ADD COLUMN icon TEXT NOT NULL DEFAULT 'plant' CHECK(icon IN ('plant','water','book','walk','stretch','sun','moon','heart','coffee','study','music','smile'));
ALTER TABLE habits ADD COLUMN archived_at TEXT;
ALTER TABLE habits ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
UPDATE habits SET sort_order = (
 SELECT count(*) FROM habits AS earlier
 WHERE earlier.created_at < habits.created_at OR (earlier.created_at = habits.created_at AND earlier.id < habits.id)
);`,
];
export function migrate(database: MigrationDatabase) {
  database.execSync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  const version =
    database.getFirstSync<{ user_version: number }>('PRAGMA user_version')?.user_version ?? 0;
  if (version > migrations.length)
    throw new Error('This database requires a newer Tiny Wins version.');
  for (let index = version; index < migrations.length; index += 1) {
    database.withTransactionSync(() => {
      database.execSync(migrations[index]!);
      database.execSync(`PRAGMA user_version = ${index + 1};`);
    });
  }
}
