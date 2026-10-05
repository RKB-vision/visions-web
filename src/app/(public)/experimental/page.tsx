import Link from "next/link";
import { getPortfolioServices } from "@/application/portfolio-services";
import { ProjectCard } from "@/components/projects/project-card";
import "./experimental.css";

export const dynamic = "force-dynamic";

export default async function ExperimentalPage() {
  const services = getPortfolioServices();
  const [content, projects] = await Promise.all([
    services.publicPortfolio.getSiteContent(),
    services.publicPortfolio.listProjects(),
  ]);

  return (
    <main className="experimental">
      <nav className="experimental__nav">
        <Link href="/">Visions</Link>
        <Link href="/projects">Standard mode</Link>
      </nav>
      <section className="experimental__hero">
        <p className="eyebrow">Experimental mode</p>
        <h1>{content?.bio ?? "A living archive of ideas."}</h1>
        <p>Explore the work through a more immersive lens.</p>
      </section>
      <div className="project-grid">
        {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </main>
  );
}
