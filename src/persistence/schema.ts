/**
 * Initial schema for authoritative portfolio data.
 *
 * Ownership rules encoded here:
 * - Suggested tags live in project_tag_suggestions and are never joined into public reads.
 * - Project funding configuration (enabled/goal/purpose) is owner-managed on projects.
 * - Amount raised is NOT a stored project column; it is derived from verified successful payment_records.
 * - Published flag controls the public/private boundary at the query layer.
 */
export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  bio TEXT NOT NULL DEFAULT '',
  education TEXT NOT NULL DEFAULT '',
  skills_json TEXT NOT NULL DEFAULT '[]',
  achievements_json TEXT NOT NULL DEFAULT '[]',
  github_url TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL DEFAULT '',
  problem TEXT NOT NULL DEFAULT '',
  what_was_built TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT '',
  technical_description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  demo_url TEXT,
  github_url TEXT,
  github_stars INTEGER,
  github_forks INTEGER,
  featured_rank INTEGER,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  funding_enabled INTEGER NOT NULL DEFAULT 0 CHECK (funding_enabled IN (0, 1)),
  funding_goal INTEGER NOT NULL DEFAULT 0 CHECK (funding_goal >= 0),
  funding_purpose TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS project_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technology', 'interest', 'project_type')),
  UNIQUE (project_id, tag, category)
);

CREATE INDEX IF NOT EXISTS idx_project_tags_project ON project_tags(project_id);

CREATE TABLE IF NOT EXISTS project_tag_suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technology', 'interest', 'project_type')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'removed')),
  suggested_at TEXT NOT NULL,
  UNIQUE (project_id, tag, category)
);

CREATE INDEX IF NOT EXISTS idx_project_tag_suggestions_project ON project_tag_suggestions(project_id);

CREATE TABLE IF NOT EXISTS payment_records (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  amount INTEGER NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL CHECK (status IN ('initiated', 'pending', 'successful', 'failed', 'cancelled')),
  provider TEXT NOT NULL DEFAULT '',
  provider_reference TEXT NOT NULL DEFAULT '',
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified')),
  verified_at TEXT,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_provider_reference
  ON payment_records(provider, provider_reference)
  WHERE provider_reference <> '';

CREATE INDEX IF NOT EXISTS idx_payment_project ON payment_records(project_id);
`;

export const MIGRATION_ID = "001_initial_schema";
