import type { PublicProject } from "@/persistence/types";
import { getProjectActions } from "./project-actions";

function DetailSection({ title, children }: { title: string; children: string }) {
  return children ? (
    <section className="detail-section">
      <h2>{title}</h2>
      <p>{children}</p>
    </section>
  ) : null;
}

export function ProjectDetail({ project }: { project: PublicProject }) {
  const actions = getProjectActions(project);

  return (
    <article className="project-detail">
      <header className="project-detail__header">
        <p className="eyebrow">Project</p>
        <h1>{project.name}</h1>
        <p className="project-detail__overview">{project.shortDescription}</p>
        {actions.length > 0 ? (
          <div className="action-list" aria-label="Project links">
            {actions.map((action) => (
              <a
                className="button button--primary"
                href={action.href}
                key={action.label}
                target="_blank"
                rel="noreferrer"
              >
                {action.label}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      {project.imageUrl ? (
        <figure className="project-detail__visual">
          <img src={project.imageUrl} alt={`${project.name} project visual`} />
        </figure>
      ) : null}

      <div className="project-detail__content">
        <DetailSection title="The problem">{project.problem}</DetailSection>
        <DetailSection title="What was built">{project.whatWasBuilt}</DetailSection>
        <DetailSection title="Result">{project.result}</DetailSection>
        <DetailSection title="Technical details">{project.technicalDescription}</DetailSection>
      </div>

      {project.tags.length > 0 ? (
        <footer>
          <ul className="tag-list" aria-label="Project tags">
            {project.tags.map((tag) => (
              <li key={`${tag.category}:${tag.tag}`}>{tag.tag}</li>
            ))}
          </ul>
        </footer>
      ) : null}
    </article>
  );
}
