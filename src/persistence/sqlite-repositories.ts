import type { DatabaseSync } from "node:sqlite";
import type {
  AdminProject,
  AdminProjectRepository,
  ApprovedTag,
  DraftProjectInput,
  PaymentInput,
  PaymentRecord,
  PaymentRepository,
  PaymentStatus,
  ProjectFundingView,
  ProjectRepository,
  ProjectTagRepository,
  ProjectTagSuggestionRepository,
  ProjectUpdateInput,
  PublicProject,
  SiteContent,
  SiteContentInput,
  SiteContentRepository,
  TagCategory,
  TagSuggestionStatus,
  VerificationStatus,
} from "./types";

type ProjectRow = {
  id: string;
  name: string;
  short_description: string;
  problem: string;
  what_was_built: string;
  result: string;
  technical_description: string;
  image_url: string;
  demo_url: string | null;
  github_url: string | null;
  github_stars: number | null;
  github_forks: number | null;
  featured_rank: number | null;
  published: number;
  funding_enabled: number;
  funding_goal: number;
  funding_purpose: string;
  created_at: string;
  updated_at: string;
};

type TagRow = { tag: string; category: string };

type SuggestionRow = {
  id: number;
  project_id: string;
  tag: string;
  category: string;
  status: string;
  suggested_at: string;
};

type PaymentRow = {
  id: string;
  project_id: string;
  amount: number;
  status: string;
  provider: string;
  provider_reference: string;
  verification_status: string;
  verified_at: string | null;
  created_at: string;
};

function now(): string {
  return new Date().toISOString();
}

function mapTags(rows: ReadonlyArray<TagRow>): ApprovedTag[] {
  return rows.map((row) => ({
    tag: row.tag,
    category: row.category as TagCategory,
  }));
}

function mapPayment(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    projectId: row.project_id,
    amount: row.amount,
    status: row.status as PaymentStatus,
    provider: row.provider,
    providerReference: row.provider_reference,
    verificationStatus: row.verification_status as VerificationStatus,
    verifiedAt: row.verified_at,
    createdAt: row.created_at,
  };
}

function fundingView(
  row: Pick<ProjectRow, "funding_enabled" | "funding_goal" | "funding_purpose">,
  amountRaised: number,
): ProjectFundingView | null {
  if (!row.funding_enabled) {
    return null;
  }
  return {
    enabled: true,
    goal: row.funding_goal,
    amountRaised,
    purpose: row.funding_purpose,
    goalReached: amountRaised >= row.funding_goal,
  };
}

function baseProjectFields(row: ProjectRow) {
  return {
    id: row.id,
    name: row.name,
    shortDescription: row.short_description,
    problem: row.problem,
    whatWasBuilt: row.what_was_built,
    result: row.result,
    technicalDescription: row.technical_description,
    imageUrl: row.image_url,
    demoUrl: row.demo_url,
    githubUrl: row.github_url,
    githubStars: row.github_stars,
    githubForks: row.github_forks,
    featuredRank: row.featured_rank,
  };
}

export function createSqliteProjectRepository(db: DatabaseSync): {
  projects: ProjectRepository;
  adminProjects: AdminProjectRepository;
} {
  const tagsRepo = createSqliteProjectTagRepository(db);
  const paymentsRepo = createSqlitePaymentRepository(db);

  function loadTags(
    projectIds: ReadonlyArray<string>,
  ): Promise<Map<string, ReadonlyArray<ApprovedTag>>> {
    return tagsRepo.listApprovedByProjectIds(projectIds);
  }

  async function toPublic(
    row: ProjectRow,
    tags: ReadonlyArray<ApprovedTag>,
  ): Promise<PublicProject> {
    const amountRaised = row.funding_enabled
      ? await paymentsRepo.sumVerifiedSuccessfulByProjectId(row.id)
      : 0;
    return {
      ...baseProjectFields(row),
      tags: [...tags],
      funding: fundingView(row, amountRaised),
    };
  }

  async function toAdmin(
    row: ProjectRow,
    tags: ReadonlyArray<ApprovedTag>,
  ): Promise<AdminProject> {
    return {
      ...baseProjectFields(row),
      published: row.published === 1,
      fundingEnabled: row.funding_enabled === 1,
      fundingGoal: row.funding_goal,
      fundingPurpose: row.funding_purpose,
      tags: [...tags],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  const projects: ProjectRepository = {
    async listPublished() {
      const rows = db
        .prepare(
          `SELECT * FROM projects WHERE published = 1 ORDER BY featured_rank IS NULL, featured_rank ASC, name ASC`,
        )
        .all() as ProjectRow[];
      const tagMap = await loadTags(rows.map((r) => r.id));
      return Promise.all(
        rows.map((row) => toPublic(row, tagMap.get(row.id) ?? [])),
      );
    },

    async getPublishedById(id) {
      const row = db
        .prepare(`SELECT * FROM projects WHERE id = ? AND published = 1`)
        .get(id) as ProjectRow | undefined;
      if (!row) {
        return null;
      }
      const tags = await tagsRepo.listApprovedByProjectId(row.id);
      return toPublic(row, tags);
    },
  };

  const adminProjects: AdminProjectRepository = {
    async listAll() {
      const rows = db
        .prepare(`SELECT * FROM projects ORDER BY updated_at DESC`)
        .all() as ProjectRow[];
      const tagMap = await loadTags(rows.map((r) => r.id));
      return Promise.all(rows.map((row) => toAdmin(row, tagMap.get(row.id) ?? [])));
    },

    async getById(id) {
      const row = db.prepare(`SELECT * FROM projects WHERE id = ?`).get(id) as
        | ProjectRow
        | undefined;
      if (!row) {
        return null;
      }
      const tags = await tagsRepo.listApprovedByProjectId(row.id);
      return toAdmin(row, tags);
    },

    async createDraft(input: DraftProjectInput) {
      const timestamp = now();
      db.prepare(
        `INSERT INTO projects (
          id, name, short_description, problem, what_was_built, result,
          technical_description, image_url, demo_url, github_url,
          github_stars, github_forks, featured_rank, published,
          funding_enabled, funding_goal, funding_purpose, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
      ).run(
        input.id,
        input.name,
        input.shortDescription ?? "",
        input.problem ?? "",
        input.whatWasBuilt ?? "",
        input.result ?? "",
        input.technicalDescription ?? "",
        input.imageUrl ?? "",
        input.demoUrl ?? null,
        input.githubUrl ?? null,
        input.githubStars ?? null,
        input.githubForks ?? null,
        input.featuredRank ?? null,
        input.fundingEnabled ? 1 : 0,
        input.fundingGoal ?? 0,
        input.fundingPurpose ?? "",
        timestamp,
        timestamp,
      );
      const created = await adminProjects.getById(input.id);
      if (!created) {
        throw new Error(`Failed to load created project ${input.id}`);
      }
      return created;
    },

    async update(id: string, input: ProjectUpdateInput) {
      const existing = db.prepare(`SELECT * FROM projects WHERE id = ?`).get(id) as
        | ProjectRow
        | undefined;
      if (!existing) {
        throw new Error(`Project ${id} not found`);
      }

      const next = {
        name: input.name ?? existing.name,
        short_description: input.shortDescription ?? existing.short_description,
        problem: input.problem ?? existing.problem,
        what_was_built: input.whatWasBuilt ?? existing.what_was_built,
        result: input.result ?? existing.result,
        technical_description: input.technicalDescription ?? existing.technical_description,
        image_url: input.imageUrl ?? existing.image_url,
        demo_url: input.demoUrl !== undefined ? input.demoUrl : existing.demo_url,
        github_url: input.githubUrl !== undefined ? input.githubUrl : existing.github_url,
        github_stars:
          input.githubStars !== undefined ? input.githubStars : existing.github_stars,
        github_forks:
          input.githubForks !== undefined ? input.githubForks : existing.github_forks,
        featured_rank:
          input.featuredRank !== undefined ? input.featuredRank : existing.featured_rank,
        funding_enabled:
          input.fundingEnabled !== undefined
            ? input.fundingEnabled
              ? 1
              : 0
            : existing.funding_enabled,
        funding_goal: input.fundingGoal ?? existing.funding_goal,
        funding_purpose: input.fundingPurpose ?? existing.funding_purpose,
        published:
          input.published !== undefined ? (input.published ? 1 : 0) : existing.published,
        updated_at: now(),
      };

      db.prepare(
        `UPDATE projects SET
          name = ?, short_description = ?, problem = ?, what_was_built = ?,
          result = ?, technical_description = ?, image_url = ?, demo_url = ?,
          github_url = ?, github_stars = ?, github_forks = ?, featured_rank = ?,
          funding_enabled = ?, funding_goal = ?, funding_purpose = ?,
          published = ?, updated_at = ?
        WHERE id = ?`,
      ).run(
        next.name,
        next.short_description,
        next.problem,
        next.what_was_built,
        next.result,
        next.technical_description,
        next.image_url,
        next.demo_url,
        next.github_url,
        next.github_stars,
        next.github_forks,
        next.featured_rank,
        next.funding_enabled,
        next.funding_goal,
        next.funding_purpose,
        next.published,
        next.updated_at,
        id,
      );

      const updated = await adminProjects.getById(id);
      if (!updated) {
        throw new Error(`Failed to reload project ${id}`);
      }
      return updated;
    },

    async setPublished(id: string, published: boolean) {
      const result = db
        .prepare(
          `UPDATE projects SET published = ?, updated_at = ? WHERE id = ?`,
        )
        .run(published ? 1 : 0, now(), id);
      if (result.changes === 0) {
        throw new Error(`Project ${id} not found`);
      }
    },
  };

  return { projects, adminProjects };
}

export function createSqliteProjectTagRepository(db: DatabaseSync): ProjectTagRepository {
  return {
    async listApprovedByProjectId(projectId) {
      const rows = db
        .prepare(
          `SELECT tag, category FROM project_tags WHERE project_id = ? ORDER BY category, tag`,
        )
        .all(projectId) as TagRow[];
      return mapTags(rows);
    },

    async listApprovedByProjectIds(projectIds) {
      const result = new Map<string, ApprovedTag[]>();
      if (projectIds.length === 0) {
        return result;
      }
      const placeholders = projectIds.map(() => "?").join(", ");
      const rows = db
        .prepare(
          `SELECT project_id, tag, category FROM project_tags
           WHERE project_id IN (${placeholders})
           ORDER BY project_id, category, tag`,
        )
        .all(...projectIds) as Array<TagRow & { project_id: string }>;
      for (const row of rows) {
        const list = result.get(row.project_id) ?? [];
        list.push({ tag: row.tag, category: row.category as TagCategory });
        result.set(row.project_id, list);
      }
      return result;
    },

    async replaceApproved(projectId, tags) {
      db.prepare(`DELETE FROM project_tags WHERE project_id = ?`).run(projectId);
      const insert = db.prepare(
        `INSERT INTO project_tags (project_id, tag, category) VALUES (?, ?, ?)`,
      );
      for (const tag of tags) {
        insert.run(projectId, tag.tag, tag.category);
      }
    },
  };
}

export function createSqliteProjectTagSuggestionRepository(
  db: DatabaseSync,
): ProjectTagSuggestionRepository {
  return {
    async listByProjectId(projectId) {
      const rows = db
        .prepare(
          `SELECT id, project_id, tag, category, status, suggested_at
           FROM project_tag_suggestions
           WHERE project_id = ?
           ORDER BY suggested_at, id`,
        )
        .all(projectId) as SuggestionRow[];
      return rows.map((row) => ({
        id: row.id,
        projectId: row.project_id,
        tag: row.tag,
        category: row.category as TagCategory,
        status: row.status as TagSuggestionStatus,
        suggestedAt: row.suggested_at,
      }));
    },

    async create(input) {
      const suggestedAt = input.suggestedAt ?? now();
      const result = db
        .prepare(
          `INSERT INTO project_tag_suggestions (project_id, tag, category, status, suggested_at)
           VALUES (?, ?, ?, 'pending', ?)`,
        )
        .run(input.projectId, input.tag, input.category, suggestedAt);
      const created = db
        .prepare(
          `SELECT id, project_id, tag, category, status, suggested_at
           FROM project_tag_suggestions WHERE id = ?`,
        )
        .get(Number(result.lastInsertRowid)) as SuggestionRow;
      return {
        id: created.id,
        projectId: created.project_id,
        tag: created.tag,
        category: created.category as TagCategory,
        status: created.status as TagSuggestionStatus,
        suggestedAt: created.suggested_at,
      };
    },
  };
}

export function createSqliteSiteContentRepository(db: DatabaseSync): SiteContentRepository {
  type SiteContentRow = {
    bio: string;
    education: string;
    skills_json: string;
    achievements_json: string;
    github_url: string;
    linkedin_url: string;
    updated_at: string;
  };

  function mapSiteContent(row: SiteContentRow): SiteContent {
    return {
      bio: row.bio,
      education: row.education,
      skills: JSON.parse(row.skills_json) as string[],
      achievements: JSON.parse(row.achievements_json) as string[],
      githubUrl: row.github_url,
      linkedinUrl: row.linkedin_url,
      updatedAt: row.updated_at,
    };
  }

  return {
    async get() {
      const row = db.prepare(`SELECT * FROM site_content WHERE id = 1`).get() as
        | SiteContentRow
        | undefined;
      return row ? mapSiteContent(row) : null;
    },

    async upsert(input: SiteContentInput) {
      const updatedAt = now();
      db.prepare(
        `INSERT INTO site_content (
          id, bio, education, skills_json, achievements_json,
          github_url, linkedin_url, updated_at
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          bio = excluded.bio,
          education = excluded.education,
          skills_json = excluded.skills_json,
          achievements_json = excluded.achievements_json,
          github_url = excluded.github_url,
          linkedin_url = excluded.linkedin_url,
          updated_at = excluded.updated_at`,
      ).run(
        input.bio,
        input.education,
        JSON.stringify(input.skills),
        JSON.stringify(input.achievements),
        input.githubUrl,
        input.linkedinUrl,
        updatedAt,
      );
      const row = db.prepare(`SELECT * FROM site_content WHERE id = 1`).get() as SiteContentRow;
      return mapSiteContent(row);
    },
  };
}

export function createSqlitePaymentRepository(db: DatabaseSync): PaymentRepository {
  return {
    async insert(input: PaymentInput) {
      const record: PaymentInput = {
        provider: "",
        providerReference: "",
        verificationStatus: "unverified",
        verifiedAt: null,
        createdAt: now(),
        ...input,
      };
      try {
        db.prepare(
          `INSERT INTO payment_records (
            id, project_id, amount, status, provider, provider_reference,
            verification_status, verified_at, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ).run(
          record.id,
          record.projectId,
          record.amount,
          record.status,
          record.provider ?? "",
          record.providerReference ?? "",
          record.verificationStatus ?? "unverified",
          record.verifiedAt ?? null,
          record.createdAt ?? now(),
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes("UNIQUE") || message.includes("unique")) {
          throw new Error(
            `Duplicate payment provider reference: ${record.provider}/${record.providerReference}`,
          );
        }
        throw error;
      }
      const row = db
        .prepare(`SELECT * FROM payment_records WHERE id = ?`)
        .get(record.id) as PaymentRow;
      return mapPayment(row);
    },

    async listByProjectId(projectId) {
      const rows = db
        .prepare(
          `SELECT * FROM payment_records WHERE project_id = ? ORDER BY created_at, id`,
        )
        .all(projectId) as PaymentRow[];
      return rows.map(mapPayment);
    },

    async sumVerifiedSuccessfulByProjectId(projectId) {
      const row = db
        .prepare(
          `SELECT COALESCE(SUM(amount), 0) AS total
           FROM payment_records
           WHERE project_id = ?
             AND status = 'successful'
             AND verification_status = 'verified'`,
        )
        .get(projectId) as { total: number };
      return row.total;
    },
  };
}
