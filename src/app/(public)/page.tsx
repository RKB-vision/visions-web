import Link from "next/link";
import { getPortfolioServices } from "@/application/portfolio-services";
import { ProjectCard } from "@/components/projects/project-card";
import { PersonalizationPoll } from "@/components/personalization/personalization-poll";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const services = getPortfolioServices();
  const [content, projects] = await Promise.all([
    services.publicPortfolio.getSiteContent(),
    services.publicPortfolio.listProjects(),
  ]);

  return (
    <main>
      <p>Visions portfolio</p>
      <h1>{content?.bio ?? "A clear view of what I build."}</h1>
      <p>{content?.education ?? "Projects, experiments, and practical software."}</p>
      <div className="action-list">
        <Link className="button button--primary" href="/projects">Browse projects</Link>
        <Link className="button button--secondary" href="/experimental">Experimental mode</Link>
      </div>
      <PersonalizationPoll />
      {content?.skills.length ? (
        <section>
          <h2>Skills</h2>
          <ul className="tag-list">{content.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </section>
      ) : null}
      {projects.length ? (
        <section>
          <h2>Selected projects</h2>
          <div className="project-grid">{projects.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} />)}</div>
        </section>
      ) : null}
      {content ? (
        <footer className="action-list">
          <a href={content.githubUrl}>GitHub</a>
          <a href={content.linkedinUrl}>LinkedIn</a>
        </footer>
      ) : null}
    </main>
  );
}
