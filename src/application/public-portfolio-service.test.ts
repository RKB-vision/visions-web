import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { createIsolatedPortfolioServices } from "@/application/portfolio-services";
import type { PublicSiteContent } from "@/application/public-portfolio-service";

let services: ReturnType<typeof createIsolatedPortfolioServices>;

beforeEach(() => {
  services = createIsolatedPortfolioServices(":memory:");
});

afterEach(() => {
  services.close();
});

test("public portfolio retrieval includes only published projects and public site content", async () => {
  await services.siteContent.saveSiteContent({
    bio: "A builder.",
    education: "Computer science",
    skills: ["TypeScript"],
    achievements: [" shipped"],
    githubUrl: "https://github.com/example",
    linkedinUrl: "https://linkedin.com/in/example",
  });
  await services.persistence.adminProjects.createDraft({
    id: "draft",
    name: "Private draft",
    technicalDescription: "Do not expose this.",
  });
  await services.persistence.adminProjects.createDraft({
    id: "published",
    name: "Published project",
    shortDescription: "A public project.",
    demoUrl: null,
    githubUrl: null,
  });
  await services.persistence.adminProjects.setPublished("published", true);

  const publicSiteContent = await services.publicPortfolio.getSiteContent();
  const publicProjects = await services.publicPortfolio.listProjects();

  assert.deepEqual(publicSiteContent, {
    bio: "A builder.",
    education: "Computer science",
    skills: ["TypeScript"],
    achievements: [" shipped"],
    githubUrl: "https://github.com/example",
    linkedinUrl: "https://linkedin.com/in/example",
  } satisfies PublicSiteContent);
  assert.deepEqual(publicProjects.map(({ id, name }) => ({ id, name })), [
    { id: "published", name: "Published project" },
  ]);
  assert.equal(
    Object.hasOwn(publicProjects[0]!, "published"),
    false,
  );
  assert.equal(
    Object.hasOwn(publicProjects[0]!, "fundingEnabled"),
    false,
  );
});

test("public portfolio retrieval returns null for missing projects", async () => {
  assert.equal(await services.publicPortfolio.getProject("missing"), null);
});
