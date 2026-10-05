import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { openTestPersistence } from "./open";
import { createPortfolioPersistence } from "./create-persistence";
import type { Persistence } from "./database";
import type { PortfolioPersistence } from "./types";

let handle: Persistence;
let persistence: PortfolioPersistence;

beforeEach(() => {
  handle = openTestPersistence();
  persistence = createPortfolioPersistence(handle.db);
});

afterEach(() => {
  handle.close();
});

const publishedProject = {
  id: "proj-published",
  name: "Published Project",
  shortDescription: "A published card description",
  problem: "Problem statement",
  whatWasBuilt: "What was built",
  result: "The result",
  technicalDescription: "Technical details",
  imageUrl: "/images/published.png",
  demoUrl: "https://demo.example.com",
  githubUrl: "https://github.com/example/published",
  featuredRank: 1,
};

const draftProject = {
  id: "proj-draft",
  name: "Draft Project",
  shortDescription: "Draft only",
};

test("schema migration creates required tables", () => {
  const tables = handle.db
    .prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name IN (
        'site_content','projects','project_tags','project_tag_suggestions','payment_records','schema_migrations'
      )`,
    )
    .all() as Array<{ name: string }>;
  const names = tables.map((t) => t.name).sort();
  assert.deepEqual(names, [
    "payment_records",
    "project_tag_suggestions",
    "project_tags",
    "projects",
    "schema_migrations",
    "site_content",
  ]);
});

test("project record stores Project Map fields needed for cards, details, tags, links, ranking, metrics, and funding", async () => {
  const created = await persistence.adminProjects.createDraft({
    ...publishedProject,
    githubStars: 42,
    githubForks: 7,
    fundingEnabled: true,
    fundingGoal: 100000,
    fundingPurpose: "Server costs",
  });

  assert.equal(created.name, "Published Project");
  assert.equal(created.shortDescription, "A published card description");
  assert.equal(created.problem, "Problem statement");
  assert.equal(created.whatWasBuilt, "What was built");
  assert.equal(created.result, "The result");
  assert.equal(created.technicalDescription, "Technical details");
  assert.equal(created.imageUrl, "/images/published.png");
  assert.equal(created.demoUrl, "https://demo.example.com");
  assert.equal(created.githubUrl, "https://github.com/example/published");
  assert.equal(created.githubStars, 42);
  assert.equal(created.githubForks, 7);
  assert.equal(created.featuredRank, 1);
  assert.equal(created.fundingEnabled, true);
  assert.equal(created.fundingGoal, 100000);
  assert.equal(created.fundingPurpose, "Server costs");
  assert.equal(created.published, false);
});

test("public reads exclude drafts and return only published projects", async () => {
  await persistence.adminProjects.createDraft(publishedProject);
  await persistence.adminProjects.createDraft(draftProject);
  await persistence.adminProjects.setPublished("proj-published", true);

  const list = await persistence.projects.listPublished();
  assert.equal(list.length, 1);
  assert.equal(list[0]?.id, "proj-published");

  const draftLookup = await persistence.projects.getPublishedById("proj-draft");
  assert.equal(draftLookup, null);

  const publishedLookup = await persistence.projects.getPublishedById("proj-published");
  assert.ok(publishedLookup);
  assert.equal(publishedLookup.id, "proj-published");
});

test("public project shape does not expose administrative fields", async () => {
  await persistence.adminProjects.createDraft({
    ...publishedProject,
    fundingEnabled: true,
    fundingGoal: 50000,
  });
  await persistence.adminProjects.setPublished("proj-published", true);

  const project = await persistence.projects.getPublishedById("proj-published");
  assert.ok(project);
  const keys = Object.keys(project).sort();
  assert.deepEqual(keys, [
    "demoUrl",
    "featuredRank",
    "funding",
    "githubForks",
    "githubStars",
    "githubUrl",
    "id",
    "imageUrl",
    "name",
    "problem",
    "result",
    "shortDescription",
    "tags",
    "technicalDescription",
    "whatWasBuilt",
  ]);
  assert.equal("published" in project, false);
  assert.equal("fundingEnabled" in project, false);
  assert.equal("fundingGoal" in project, false);
  assert.equal("createdAt" in project, false);
});

test("suggested metadata remains separate from owner-approved metadata", async () => {
  await persistence.adminProjects.createDraft(publishedProject);
  await persistence.adminProjects.setPublished("proj-published", true);

  await persistence.projectTags.replaceApproved("proj-published", [
    { tag: "TypeScript", category: "technology" },
    { tag: "Web Application", category: "project_type" },
  ]);

  await persistence.projectTagSuggestions.create({
    projectId: "proj-published",
    tag: "AI",
    category: "interest",
  });

  const publicProject = await persistence.projects.getPublishedById("proj-published");
  assert.ok(publicProject);
  const publicTags = publicProject.tags.map((t) => t.tag).sort();
  assert.deepEqual(publicTags, ["TypeScript", "Web Application"]);
  assert.equal(publicTags.includes("AI"), false);

  const suggestions = await persistence.projectTagSuggestions.listByProjectId("proj-published");
  assert.equal(suggestions.length, 1);
  assert.equal(suggestions[0]?.tag, "AI");
  assert.equal(suggestions[0]?.status, "pending");

  const adminProject = await persistence.adminProjects.getById("proj-published");
  assert.ok(adminProject);
  const adminTags = adminProject.tags.map((t) => t.tag).sort();
  assert.deepEqual(adminTags, ["TypeScript", "Web Application"]);
});

test("funding totals derive only from verified successful payment records", async () => {
  await persistence.adminProjects.createDraft({
    ...publishedProject,
    fundingEnabled: true,
    fundingGoal: 100000,
  });
  await persistence.adminProjects.setPublished("proj-published", true);

  await persistence.payments.insert({
    id: "pay-1",
    projectId: "proj-published",
    amount: 40000,
    status: "successful",
    provider: "upi",
    providerReference: "ref-1",
    verificationStatus: "verified",
    verifiedAt: "2026-10-05T10:00:00.000Z",
  });
  await persistence.payments.insert({
    id: "pay-2",
    projectId: "proj-published",
    amount: 20000,
    status: "successful",
    provider: "upi",
    providerReference: "ref-2",
    verificationStatus: "unverified",
  });
  await persistence.payments.insert({
    id: "pay-3",
    projectId: "proj-published",
    amount: 15000,
    status: "failed",
    provider: "upi",
    providerReference: "ref-3",
    verificationStatus: "verified",
  });
  await persistence.payments.insert({
    id: "pay-4",
    projectId: "proj-published",
    amount: 25000,
    status: "cancelled",
    provider: "upi",
    providerReference: "ref-4",
  });

  const total = await persistence.payments.sumVerifiedSuccessfulByProjectId("proj-published");
  assert.equal(total, 40000);

  const publicProject = await persistence.projects.getPublishedById("proj-published");
  assert.ok(publicProject);
  assert.ok(publicProject.funding);
  assert.equal(publicProject.funding.amountRaised, 40000);
  assert.equal(publicProject.funding.goal, 100000);
  assert.equal(publicProject.funding.goalReached, false);
});

test("goal reached derives from verified totals when amount meets goal", async () => {
  await persistence.adminProjects.createDraft({
    ...publishedProject,
    fundingEnabled: true,
    fundingGoal: 50000,
  });
  await persistence.adminProjects.setPublished("proj-published", true);

  await persistence.payments.insert({
    id: "pay-goal",
    projectId: "proj-published",
    amount: 50000,
    status: "successful",
    provider: "upi",
    providerReference: "ref-goal",
    verificationStatus: "verified",
  });

  const project = await persistence.projects.getPublishedById("proj-published");
  assert.ok(project?.funding);
  assert.equal(project.funding.amountRaised, 50000);
  assert.equal(project.funding.goalReached, true);
});

test("funding is null for projects without active funding configuration", async () => {
  await persistence.adminProjects.createDraft(publishedProject);
  await persistence.adminProjects.setPublished("proj-published", true);

  const project = await persistence.projects.getPublishedById("proj-published");
  assert.ok(project);
  assert.equal(project.funding, null);
});

test("duplicate payment provider references are rejected for idempotency", async () => {
  await persistence.adminProjects.createDraft(publishedProject);
  await persistence.payments.insert({
    id: "pay-a",
    projectId: "proj-published",
    amount: 1000,
    status: "pending",
    provider: "upi",
    providerReference: "same-ref",
  });

  await assert.rejects(
    () =>
      persistence.payments.insert({
        id: "pay-b",
        projectId: "proj-published",
        amount: 2000,
        status: "pending",
        provider: "upi",
        providerReference: "same-ref",
      }),
    /Duplicate payment provider reference/,
  );
});

test("site content round-trips owner-maintained portfolio fields", async () => {
  assert.equal(await persistence.siteContent.get(), null);

  const saved = await persistence.siteContent.upsert({
    bio: "Builder of useful software.",
    education: "B.Tech",
    skills: ["TypeScript", "Next.js"],
    achievements: ["Open source contributor"],
    githubUrl: "https://github.com/example",
    linkedinUrl: "https://linkedin.com/in/example",
  });

  assert.equal(saved.bio, "Builder of useful software.");
  assert.deepEqual(saved.skills, ["TypeScript", "Next.js"]);

  const loaded = await persistence.siteContent.get();
  assert.ok(loaded);
  assert.equal(loaded.education, "B.Tech");
  assert.equal(loaded.githubUrl, "https://github.com/example");
  assert.equal(loaded.linkedinUrl, "https://linkedin.com/in/example");
});

test("empty payment history yields zero funding total without fabrication", async () => {
  await persistence.adminProjects.createDraft({
    ...publishedProject,
    fundingEnabled: true,
    fundingGoal: 10000,
  });
  const total = await persistence.payments.sumVerifiedSuccessfulByProjectId("proj-published");
  assert.equal(total, 0);
});
