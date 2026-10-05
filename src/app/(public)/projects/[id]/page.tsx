import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioServices } from "@/application/portfolio-services";
import { ProjectDetail } from "@/components/projects/project-detail";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getPortfolioServices().publicPortfolio.getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <p>
        <Link href="/projects">← All projects</Link>
      </p>
      <ProjectDetail project={project} />
    </main>
  );
}
