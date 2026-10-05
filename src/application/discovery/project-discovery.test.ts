import { test } from "node:test";
import assert from "node:assert/strict";
import { discoverProjects } from "./project-discovery";
import type { PublicProject } from "@/persistence/types";

const project = (id: string, tags: PublicProject["tags"], featuredRank: number): PublicProject => ({
  id,
  name: id,
  shortDescription: id,
  problem: "",
  whatWasBuilt: "",
  result: "",
  technicalDescription: "",
  imageUrl: "",
  demoUrl: null,
  githubUrl: null,
  githubStars: null,
  githubForks: null,
  featuredRank,
  tags,
  funding: null,
});

test("discovery ranks matches and intersects filters", () => {
  const projects = [
    project("python", [{ tag: "Python", category: "technology" }], 2),
    project("ai", [{ tag: "AI / Machine Learning", category: "interest" }], 1),
  ];
  assert.deepEqual(discoverProjects(projects).map((item) => item.id), ["ai", "python"]);
  assert.deepEqual(
    discoverProjects(projects, { filters: { technology: ["Python"], interest: ["AI"] } }),
    [],
  );
  assert.deepEqual(
    discoverProjects(projects, { preferences: { visitorType: "AI / Machine Learning", interests: [] } }).map(
      (item) => item.id,
    ),
    ["ai", "python"],
  );
});
