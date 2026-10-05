export type PersistenceConfig = {
  databasePath: string;
};

export function getPersistenceConfig(): PersistenceConfig {
  return {
    databasePath: process.env.DATABASE_PATH ?? "./data/visions.db",
  };
}
