import type { PublicProject } from "@/persistence/types";

export type ProjectAction = {
  label: "Live Demo" | "GitHub";
  href: string;
};

export function getProjectActions(project: PublicProject): ProjectAction[] {
  const actions: ProjectAction[] = [];

  if (project.demoUrl) {
    actions.push({ label: "Live Demo", href: project.demoUrl });
  }
  if (project.githubUrl) {
    actions.push({ label: "GitHub", href: project.githubUrl });
  }

  return actions;
}
