DECISION: Use Node's built-in `node:sqlite` (DatabaseSync) as the V1 SQLite driver, behind the persistence adapter boundary already chosen in TASK-001.
DATE: 2026-10-05
REASON: The runtime is Node.js 25, which ships `node:sqlite`. Using the built-in module avoids a native addon dependency (better-sqlite3) and keeps `npm install` simple while honoring the TASK-001 decision that application code accesses storage through repository contracts rather than raw database calls scattered through routes.
ALTERNATIVES CONSIDERED: better-sqlite3 (native module, mature API); a hosted relational database (already rejected in TASK-001 for V1); node:sqlite experimental API (accepted because the adapter boundary isolates drivers if a later migration is needed).
TRADEOFF: `node:sqlite` is marked experimental by Node and may change across major versions. The repository interfaces in `src/persistence/types.ts` absorb that risk: swapping drivers should not change application services.
AFFECTED COMPONENTS: Persistence boundary, Project Content, Project Management/Admin (later tasks), Funding, Payment Integration (later tasks), data-layer tests.
