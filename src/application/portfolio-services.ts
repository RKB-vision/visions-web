import { openPersistence } from "@/persistence/open";
import { createPortfolioPersistence } from "@/persistence/create-persistence";
import { createProjectService, createAdminProjectService } from "@/application/projects/project-service";
import { createSiteContentService } from "@/application/site-content/site-content-service";
import { createPublicPortfolioService } from "@/application/public-portfolio-service";
import { getPersistenceConfig } from "@/persistence/database";

let singleton: ReturnType<typeof buildPortfolioServices> | null = null;

function buildPortfolioServices(databasePath?: string) {
  const persistenceHandle = openPersistence(databasePath);
  const persistence = createPortfolioPersistence(persistenceHandle.db);
  const projects = createProjectService(persistence.projects);
  const siteContent = createSiteContentService(persistence.siteContent);
  return {
    persistence,
    close: persistenceHandle.close,
    projects,
    adminProjects: createAdminProjectService(persistence.adminProjects),
    siteContent,
    publicPortfolio: createPublicPortfolioService(projects, siteContent),
  };
}

/** Process-local composition used by server code. Not a public HTTP API. */
export function getPortfolioServices(databasePath?: string) {
  if (!singleton) {
    singleton = buildPortfolioServices(databasePath ?? getPersistenceConfig().databasePath);
  }
  return singleton;
}

export function createIsolatedPortfolioServices(databasePath: string) {
  return buildPortfolioServices(databasePath);
}
