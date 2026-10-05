import type {
  AdminProject,
  AdminProjectRepository,
  PublicProject,
  ProjectRepository,
} from "@/persistence/types";

export type ProjectService = {
  /** Public boundary: published projects only, with approved tags and derived funding totals. */
  listPublishedProjects: () => Promise<ReadonlyArray<PublicProject>>;
  getPublishedProject: (id: string) => Promise<PublicProject | null>;
};

export function createProjectService(
  repository: ProjectRepository,
): ProjectService {
  return {
    listPublishedProjects: () => repository.listPublished(),
    getPublishedProject: (id) => repository.getPublishedById(id),
  };
}

export type AdminProjectService = {
  /** Administrative boundary. Callers must enforce authentication/authorization (TASK-009). */
  listProjects: () => Promise<ReadonlyArray<AdminProject>>;
  getProject: (id: string) => Promise<AdminProject | null>;
};

export function createAdminProjectService(
  repository: AdminProjectRepository,
): AdminProjectService {
  return {
    listProjects: () => repository.listAll(),
    getProject: (id) => repository.getById(id),
  };
}
