import type { SiteContent, SiteContentInput, SiteContentRepository } from "@/persistence/types";

export type SiteContentService = {
  getSiteContent: () => Promise<SiteContent | null>;
  saveSiteContent: (input: SiteContentInput) => Promise<SiteContent>;
};

export function createSiteContentService(
  repository: SiteContentRepository,
): SiteContentService {
  return {
    getSiteContent: () => repository.get(),
    saveSiteContent: (input) => repository.upsert(input),
  };
}
