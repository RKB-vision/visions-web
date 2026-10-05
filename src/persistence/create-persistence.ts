import type { DatabaseSync } from "node:sqlite";
import type { PortfolioPersistence } from "./types";
import {
  createSqlitePaymentRepository,
  createSqliteProjectRepository,
  createSqliteProjectTagRepository,
  createSqliteProjectTagSuggestionRepository,
  createSqliteSiteContentRepository,
} from "./sqlite-repositories";

/**
 * Composition root for the persistence boundary.
 * Application services receive these repositories; they never open SQLite directly.
 */
export function createPortfolioPersistence(db: DatabaseSync): PortfolioPersistence {
  const { projects, adminProjects } = createSqliteProjectRepository(db);
  return {
    projects,
    adminProjects,
    projectTags: createSqliteProjectTagRepository(db),
    projectTagSuggestions: createSqliteProjectTagSuggestionRepository(db),
    siteContent: createSqliteSiteContentRepository(db),
    payments: createSqlitePaymentRepository(db),
  };
}
