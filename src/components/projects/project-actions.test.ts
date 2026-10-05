import { test } from "node:test";
import assert from "node:assert/strict";
import { getProjectActions } from "./project-actions";
import type { PublicProject } from "@/persistence/types";

const baseProject: PublicProject = {
  id: "project",
  name: "Project",
  shortDescription: "A project.",
  problem: "A problem.",
  whatWasBuilt: "A solution.",
  result: "A result.",
  technicalDescription: "Technical details.",
  imageUrl: "",
  demoUrl: null,
  githubUrl: null,
  githubStars: null,
  githubForks: null,
  featuredRank: null,
  tags: [],
  funding: null,
};

test("project actions include both configured links", () => {
  assert.deepEqual(
    getProjectActions({
      ...baseProject,
      demoUrl: "https://demo.example",
      githubUrl: "https://github.com/example/project",
    }),
    [
      { label: "Live Demo", href: "https://demo.example" },
      { label: "GitHub", href: "https://github.com/example/project" },
    ],
  );
});

test("project actions omit missing links", () => {
  assert.deepEqual(getProjectActions(baseProject), []);
  assert.deepEqual(
    getProjectActions({ ...baseProject, githubUrl: "https://github.com/example/project" }),
    [{ label: "GitHub", href: "https://github.com/example/project" }],
  );
});
