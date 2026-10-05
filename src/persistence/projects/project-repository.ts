export type Project = {
  id: string;
  name: string;
  published: boolean;
};

export interface ProjectRepository {
  listPublished(): Promise<ReadonlyArray<Project>>;
}
