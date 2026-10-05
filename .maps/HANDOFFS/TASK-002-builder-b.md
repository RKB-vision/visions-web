# MAPS Handoff

FROM: Builder B
TO: Auditor (then next implementation agent for TASK-003/TASK-004)
DATE: 2026-10-05
TASK: TASK-002 — Implement authoritative portfolio data and persistence boundaries
STATUS: READY_FOR_AUDIT
BRANCH: maps/builder-b
COMMIT: (see git log on maps/builder-b for the TASK-002 implementation commit)

FILES CHANGED:
- `src/persistence/database.ts` — PersistenceConfig + Persistence handle types (extended from TASK-001)
- `src/persistence/schema.ts` — initial SQL schema + migration id
- `src/persistence/open.ts` — openDatabase, migrate, openPersistence, openTestPersistence
- `src/persistence/types.ts` — repository contracts and public/admin/funding/payment types
- `src/persistence/sqlite-repositories.ts` — SQLite implementations of all repositories
- `src/persistence/create-persistence.ts` — composition root wiring repositories from a DatabaseSync
- `src/persistence/persistence.test.ts` — 11 data-layer tests (node:test via tsx)
- `src/application/projects/project-service.ts` — public ProjectService + AdminProjectService (replaces TASK-001 stub)
- `src/application/site-content/site-content-service.ts` — SiteContentService
- `src/application/portfolio-services.ts` — process-local composition for server code
- `package.json` — added `test` script; devDependencies `tsx`, `@types/node@^25`
- `.maps/DECISIONS/2026-10-05-node-sqlite-driver.md`
- `.maps/DECISIONS/2026-10-05-funding-derivation-and-tests.md`
- `.maps/TASKS/TASK-002.yml` — claimed then set READY_FOR_AUDIT
- `.maps/TASKS/TASK-001.yml` — merge resolution: COMPLETE + Builder A recorded as agent
- `.maps/SYSTEM_STATE.md`
- `.maps/AGENT_LOG/2026-10-05-builder-b.md`
- `.maps/HANDOFFS/TASK-002-builder-b.md`

IMPLEMENTATION:
Extended Builder A's TASK-001 foundation (not replaced). Persistence uses Node 25 built-in `node:sqlite` behind repository contracts, per the TASK-001 SQLite adapter decision.

Schema (migration `001_initial_schema`):
- `site_content` — single-row owner-maintained bio/education/skills/achievements/URLs
- `projects` — full Project Map fields for cards/details/links/featured rank/GitHub metrics + funding configuration (enabled, goal integer minor units, purpose). `published` flag is the public/private boundary. Amount raised is intentionally NOT a column.
- `project_tags` — owner-approved metadata only (technology | interest | project_type)
- `project_tag_suggestions` — assistive suggestions stored separately with status pending/approved/removed; never joined into public reads
- `payment_records` — amount, status, provider, provider_reference (unique for idempotency), verification_status; only verified successful rows contribute to funding totals
- `schema_migrations` — records applied migration ids

Access layer:
- `ProjectRepository` (public boundary): listPublished / getPublishedById return published projects only, with approved tags and funding derived from verified successful payments. Output shape excludes drafts, publication flags, and admin funding fields.
- `AdminProjectRepository` (admin boundary): full records, createDraft (starts unpublished), update, setPublished. Not used by public reads. Authorization is TASK-009 and is NOT implemented here.
- `ProjectTagRepository` / `ProjectTagSuggestionRepository` — approved vs suggested separation
- `SiteContentRepository` / `PaymentRepository` — including sumVerifiedSuccessfulByProjectId

Services:
- `createProjectService` — public reads
- `createAdminProjectService` — administrative reads (authorization deferred)
- `createSiteContentService`
- `createIsolatedPortfolioServices(databasePath)` — for tests; `getPortfolioServices()` — process-local singleton for server code

Decision records document: node:sqlite driver choice; integer minor-unit amounts; funding totals derived from verified successful payments; node:test + tsx for data-layer tests.

VERIFICATION (actually run in Builder B worktree):
- `npm test` — 11/11 passed (schema migration; project field coverage; public reads exclude drafts; public shape has no admin fields; suggestions separate from approved; funding total from verified successful only; goal-reached derivation; funding null when disabled; duplicate provider_reference rejected; site content round-trip; zero total without fabrication)
- `npm run typecheck` — passed
- `npm run lint` — passed (after removing one unused import)
- `npm run build` — passed (Next.js 16.3.8; routes /, /admin, /projects, /_not-found)
- `npm audit --omit=dev` — 0 production vulnerabilities (full audit still shows 7 dev-only eslint-chain findings, unchanged from TASK-001)

TASK-002 acceptance mapping:
- Project Map fields on project records — test "project record stores Project Map fields..."
- Suggested metadata separate from approved — test "suggested metadata remains separate..."
- Public reads exclude drafts/admin/unapproved — tests "public reads exclude drafts...", "public project shape does not expose administrative fields", suggestion separation test
- Funding totals derive from verified successful payments — tests "funding totals derive only from verified successful...", "goal reached derives...", "empty payment history yields zero..."

KNOWN PROBLEMS:
- No HTTP/routes use these services yet; public pages still render placeholder content. TASK-003/TASK-006 own presentation wiring.
- Admin write operations exist in the repository layer but have no authenticated API/UI (TASK-009/TASK-011).
- `node:sqlite` is experimental in Node 25; driver swap risk is isolated behind repository interfaces (decision recorded).
- Amounts are integer minor units (paise/cents). UI/payment tasks must format accordingly.
- TASK-001 remains status COMPLETE (builder), not Auditor VERIFIED.
- Planning docs still untracked on `main`; committed on maps/builder-a and maps/builder-b.
- Full `npm audit` still reports 7 dev-only vulnerabilities in the eslint chain; production audit is clean.

NEXT STEP:
Auditor reviews TASK-002 against PROJECT_MAP section 6, ARCHITECTURE_MAP sections 3.4/7/8, and this handoff's verification evidence; marks VERIFIED or records issues in `.maps/ISSUES/`. After TASK-002 is verified, TASK-003 (public retrieval) and TASK-004 (discovery/filtering) become parallel-eligible. Do not start BLOCKED tasks (TASK-009/012/014/015) until their product decisions are recorded.

IMPORTANT CONTEXT:
- Public funding total = SUM(payment_records.amount) WHERE status='successful' AND verification_status='verified'. Never trust client-side success claims.
- Suggested tags must never appear in public project reads; only project_tags (approved) are exposed.
- New projects start unpublished via AdminProjectRepository.createDraft; publication is an explicit owner action (TASK-011 will enforce review-before-publish UI/API).
- Payment provider_reference has a partial unique index for idempotent inserts; duplicate refs throw.
- Use `createIsolatedPortfolioServices(':memory:')` or openPersistence(':memory:') in tests; do not point tests at the real data/visions.db file.
- This handoff and `.maps/AGENT_LOG/2026-10-05-builder-b.md` are the durable record; no Builder B knowledge exists only in chat.
