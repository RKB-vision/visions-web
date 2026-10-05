import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { getPersistenceConfig, type Persistence } from "./database";
import { MIGRATION_ID, SCHEMA_SQL } from "./schema";

export function openDatabase(databasePath: string): DatabaseSync {
  if (databasePath !== ":memory:") {
    mkdirSync(dirname(databasePath), { recursive: true });
  }
  const db = new DatabaseSync(databasePath);
  db.exec("PRAGMA foreign_keys = ON;");
  return db;
}

export function migrate(db: DatabaseSync): void {
  db.exec(SCHEMA_SQL);
  const existing = db
    .prepare("SELECT id FROM schema_migrations WHERE id = ?")
    .get(MIGRATION_ID) as { id: string } | undefined;
  if (!existing) {
    db.prepare("INSERT INTO schema_migrations (id, applied_at) VALUES (?, ?)").run(
      MIGRATION_ID,
      new Date().toISOString(),
    );
  }
}

export function openPersistence(databasePath?: string): Persistence {
  const path = databasePath ?? getPersistenceConfig().databasePath;
  const db = openDatabase(path);
  migrate(db);
  return {
    db,
    close: () => db.close(),
  };
}

export function openTestPersistence(): Persistence {
  return openPersistence(":memory:");
}
