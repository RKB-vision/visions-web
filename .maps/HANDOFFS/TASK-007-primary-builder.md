FROM: Primary Builder
TO: Auditor / next implementation agent
DATE: 2026-10-05
TASK: TASK-007 — Build project cards and project detail pages
STATUS: READY_FOR_AUDIT
BRANCH: maps/builder-a
COMMIT: 74faf79b19ccc59d08e612d9f05bb74e1c2a1322

FILES CHANGED:
- `src/components/projects/project-actions.ts`
- `src/components/projects/project-actions.test.ts`
- `src/components/projects/project-card.tsx`
- `src/components/projects/project-detail.tsx`
- `src/app/(public)/projects/page.tsx`
- `src/app/(public)/projects/[id]/page.tsx`
- `src/app/globals.css`
- `.maps/TASKS/TASK-007.yml`
- `.maps/AGENT_LOG/2026-10-05-task-007-primary-builder.md`
- `.maps/SYSTEM_STATE.md`

IMPLEMENTATION:
Added reusable project cards and concise detail presentation. Cards include
project name, summary, visual/visual placeholder, approved tags, present GitHub
metrics, and a View Project link. Details include overview, problem, build,
result, technical details, visuals, and only configured Live Demo/GitHub
actions. Published project retrieval remains the only data source, so unknown
or unpublished identifiers return the framework 404 response.

VERIFICATION:
- `npm test` — 15/15 passed, including both-link, single-link, and no-link
  conditional action tests.
- `npm run typecheck` — passed.
- `npm run lint` — passed with two existing `no-img-element` warnings for
  externally configured project visuals.
- `npm run build` — passed; `/projects` and `/projects/[id]` are dynamic routes.
- `npm audit --omit=dev` — 0 production vulnerabilities.
- Browser inspection with a local ignored fixture verified cards, both external
  actions, detail sections, unknown-project 404 behavior, and 390px layout width.

KNOWN PROBLEMS:
- GitHub metric threshold/eligibility remains intentionally deferred to
  TASK-012; this task displays only metrics present in the public data.
- Image URLs are owner-provided external values and use native `<img>` elements;
  Next.js reports advisory performance warnings, not errors.
- Homepage, filtering, personalization, and funding presentation belong to
  other tasks.

NEXT STEP:
Continue with another unblocked task such as TASK-008 after its TASK-004
dependency is resolved, or TASK-013 if authentication dependency handling is
settled. TASK-004 remains blocked by unresolved deterministic weighting.

IMPORTANT CONTEXT:
No fixture database was committed. The local visual fixture was removed after
inspection. The `/admin` route remains a presentation placeholder and is not
authorization.
