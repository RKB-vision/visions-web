import type { PublicProject, SiteContent } from "@/persistence/types";
import type { ProjectService } from "@/application/projects/project-service";
import type { SiteContentService } from "@/application/site-content/site-content-service";

export type PublicSiteContent = Pick<
  SiteContent,
  "bio" | "education" | "skills" | "achievements" | "githubUrl" | "linkedinUrl"
>;

export type PublicPortfolioService = {
  getSiteContent: () => Promise<PublicSiteContent | null>;
  listProjects: () => Promise<ReadonlyArray<PublicProject>>;
  getProject: (id: string) => Promise<PublicProject | null>;
};

export function createPublicPortfolioService(
  projects: ProjectService,
  siteContent: SiteContentService,
): PublicPortfolioService {
  return {
    getSiteContent: async () => {
      const content = await siteContent.getSiteContent();
      if (!content) {
        return null;
      }

      const { bio, education, skills, achievements, githubUrl, linkedinUrl } =
        content;
      return { bio, education, skills, achievements, githubUrl, linkedinUrl };
    },
    listProjects: () => projects.listPublishedProjects(),
    getProject: (id) => projects.getPublishedProject(id),
  };
}
