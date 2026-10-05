import type { ProjectRepository } from "@/persistence/projects/project-repository";

export function createProjectService(repository: ProjectRepository) {
  return {
    listPublishedProjects: () => repository.listPublished(),
  };
}
