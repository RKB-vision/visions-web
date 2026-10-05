import { ProjectCard } from "@/components/projects/project-card";
import { getPortfolioServices } from "@/application/portfolio-services";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPortfolioServices().publicPortfolio.listProjects();

  return (
    <main>
      <h1>Projects</h1>
      <p>Explore the work and the ideas behind it.</p>
      {projects.length > 0 ? (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p>No published projects are available yet.</p>
      )}
    </main>
  );
}
