import Link from "next/link";
import type { PublicProject } from "@/persistence/types";

export function ProjectCard({ project }: { project: PublicProject }) {
  const metrics = [
    project.githubStars !== null ? `${project.githubStars} stars` : null,
    project.githubForks !== null ? `${project.githubForks} forks` : null,
  ].filter((metric): metric is string => metric !== null);

  return (
    <article className="project-card">
      {project.imageUrl ? (
        <img
          className="project-card__image"
          src={project.imageUrl}
          alt={`${project.name} project visual`}
        />
      ) : (
        <div className="project-card__image project-card__image--empty" aria-label="Project visual unavailable">
          Project visual
        </div>
      )}
      <div className="project-card__body">
        <div>
          <p className="eyebrow">Project</p>
          <h2>{project.name}</h2>
          <p>{project.shortDescription}</p>
        </div>
        {project.tags.length > 0 ? (
          <ul className="tag-list" aria-label={`${project.name} technologies and topics`}>
            {project.tags.map((tag) => (
              <li key={`${tag.category}:${tag.tag}`}>{tag.tag}</li>
            ))}
          </ul>
        ) : null}
        {metrics.length > 0 ? (
          <p className="project-card__metrics" aria-label="GitHub metrics">
            {metrics.join(" · ")}
          </p>
        ) : null}
        <Link className="button button--secondary" href={`/projects/${encodeURIComponent(project.id)}`}>
          View Project
        </Link>
      </div>
    </article>
  );
}
