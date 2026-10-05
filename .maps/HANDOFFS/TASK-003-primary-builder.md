FROM: Primary Builder
TO: Auditor / next implementation agent
DATE: 2026-10-05
TASK: TASK-003 — Implement public portfolio content retrieval
STATUS: READY_FOR_AUDIT
BRANCH: maps/builder-a
COMMIT: Pending until commit

FILES CHANGED:
- `src/application/public-portfolio-service.ts`
- `src/application/public-portfolio-service.test.ts`
- `src/application/portfolio-services.ts`
- `package.json`, `package-lock.json`
- `.maps/DECISIONS/2026-10-05-public-read-service.md`
- `.maps/TASKS/TASK-003.yml`
- `.maps/AGENT_LOG/2026-10-05-task-003-primary-builder.md`
- `.maps/SYSTEM_STATE.md`

IMPLEMENTATION:
Added a read-only public application service. It composes the existing
published-project service with site content and projects the site content to
only public presentation fields. Published project retrieval remains backed by
the TASK-002 repository boundary, which excludes drafts, publication flags,
funding administration fields, and unapproved suggestions. Missing projects
return `null`; nullable external links remain nullable for consumers to omit.

VERIFICATION:
- `npm test` — 13/13 passed.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm audit --omit=dev` — 0 production vulnerabilities.
- Tests explicitly cover published/draft separation, missing projects, public
  site-content projection, and absence of administrative fields.

KNOWN PROBLEMS:
- Public pages still use placeholder presentation; TASK-006/007 own page UI.
- TASK-004 remains blocked until the deterministic multi-match weighting rule is
  resolved and recorded.

NEXT STEP:
Implement TASK-007 (project cards and project detail pages), which depends on
the completed public retrieval boundary and does not require TASK-004.

IMPORTANT CONTEXT:
The public service is application-layer code and should remain independent of
Next.js route presentation. Administrative writes remain outside this service.
