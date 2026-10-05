import type { ApprovedTag, PublicProject } from "@/persistence/types";

export type DiscoveryFilters = Partial<Record<ApprovedTag["category"], ReadonlyArray<string>>>;

export type VisitorPreferences = {
  visitorType: string;
  interests: ReadonlyArray<string>;
};

function normalized(value: string): string {
  return value.trim().toLowerCase();
}

function matchesFilters(project: PublicProject, filters: DiscoveryFilters): boolean {
  return (Object.entries(filters) as Array<[ApprovedTag["category"], ReadonlyArray<string> | undefined]>).every(
    ([category, values]) => {
      if (!values || values.length === 0) return true;
      const projectTags = new Set(
        project.tags.filter((tag) => tag.category === category).map((tag) => normalized(tag.tag)),
      );
      return values.every((value) => projectTags.has(normalized(value)));
    },
  );
}

export function discoverProjects(
  projects: ReadonlyArray<PublicProject>,
  options: {
    filters?: DiscoveryFilters;
    preferences?: VisitorPreferences;
    offset?: number;
    limit?: number;
  } = {},
): ReadonlyArray<PublicProject> {
  const filters = options.filters ?? {};
  const filtered = projects.filter((project) => matchesFilters(project, filters));
  const preferences = options.preferences;
  const ordered = [...filtered].sort((a, b) => {
    if (preferences) {
      const interests = new Set(preferences.interests.map(normalized));
      const score = (project: PublicProject) =>
        project.tags.filter(
          (tag) =>
            (tag.category === "interest" && interests.has(normalized(tag.tag))) ||
            normalized(tag.tag) === normalized(preferences.visitorType),
        ).length;
      const scoreDifference = score(b) - score(a);
      if (scoreDifference !== 0) return scoreDifference;
    }
    const rankA = a.featuredRank ?? Number.MAX_SAFE_INTEGER;
    const rankB = b.featuredRank ?? Number.MAX_SAFE_INTEGER;
    return rankA - rankB || a.name.localeCompare(b.name);
  });
  const offset = Math.max(0, options.offset ?? 0);
  const limit = Math.max(0, options.limit ?? ordered.length);
  return ordered.slice(offset, offset + limit);
}
