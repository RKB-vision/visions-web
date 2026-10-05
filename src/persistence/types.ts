export type TagCategory = "technology" | "interest" | "project_type";

export type ApprovedTag = {
  tag: string;
  category: TagCategory;
};

export type TagSuggestionStatus = "pending" | "approved" | "removed";

export type TagSuggestion = {
  id: number;
  projectId: string;
  tag: string;
  category: TagCategory;
  status: TagSuggestionStatus;
  suggestedAt: string;
};

export type ProjectFundingView = {
  enabled: true;
  goal: number;
  amountRaised: number;
  purpose: string;
  goalReached: boolean;
};

export type PublicProject = {
  id: string;
  name: string;
  shortDescription: string;
  problem: string;
  whatWasBuilt: string;
  result: string;
  technicalDescription: string;
  imageUrl: string;
  demoUrl: string | null;
  githubUrl: string | null;
  githubStars: number | null;
  githubForks: number | null;
  featuredRank: number | null;
  tags: ApprovedTag[];
  funding: ProjectFundingView | null;
};

export type AdminProject = {
  id: string;
  name: string;
  shortDescription: string;
  problem: string;
  whatWasBuilt: string;
  result: string;
  technicalDescription: string;
  imageUrl: string;
  demoUrl: string | null;
  githubUrl: string | null;
  githubStars: number | null;
  githubForks: number | null;
  featuredRank: number | null;
  published: boolean;
  fundingEnabled: boolean;
  fundingGoal: number;
  fundingPurpose: string;
  tags: ApprovedTag[];
  createdAt: string;
  updatedAt: string;
};

export type DraftProjectInput = {
  id: string;
  name: string;
  shortDescription?: string;
  problem?: string;
  whatWasBuilt?: string;
  result?: string;
  technicalDescription?: string;
  imageUrl?: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
  githubStars?: number | null;
  githubForks?: number | null;
  featuredRank?: number | null;
  fundingEnabled?: boolean;
  fundingGoal?: number;
  fundingPurpose?: string;
};

export type ProjectUpdateInput = Partial<Omit<DraftProjectInput, "id">> & {
  published?: boolean;
};

export type PaymentStatus =
  | "initiated"
  | "pending"
  | "successful"
  | "failed"
  | "cancelled";

export type VerificationStatus = "unverified" | "verified";

export type PaymentRecord = {
  id: string;
  projectId: string;
  amount: number;
  status: PaymentStatus;
  provider: string;
  providerReference: string;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  createdAt: string;
};

export type PaymentInput = {
  id: string;
  projectId: string;
  amount: number;
  status: PaymentStatus;
  provider?: string;
  providerReference?: string;
  verificationStatus?: VerificationStatus;
  verifiedAt?: string | null;
  createdAt?: string;
};

/**
 * Public boundary: returns only published projects shaped for public presentation.
 * Never returns drafts, publication flags, funding-admin fields, or tag suggestions.
 */
export interface ProjectRepository {
  listPublished(): Promise<ReadonlyArray<PublicProject>>;
  getPublishedById(id: string): Promise<PublicProject | null>;
}

/**
 * Administrative boundary: full records including drafts and funding configuration.
 * Callers must enforce authorization; this interface is not used by public reads.
 */
export interface AdminProjectRepository {
  listAll(): Promise<ReadonlyArray<AdminProject>>;
  getById(id: string): Promise<AdminProject | null>;
  createDraft(input: DraftProjectInput): Promise<AdminProject>;
  update(id: string, input: ProjectUpdateInput): Promise<AdminProject>;
  setPublished(id: string, published: boolean): Promise<void>;
}

export interface ProjectTagRepository {
  listApprovedByProjectId(projectId: string): Promise<ReadonlyArray<ApprovedTag>>;
  listApprovedByProjectIds(
    projectIds: ReadonlyArray<string>,
  ): Promise<Map<string, ReadonlyArray<ApprovedTag>>>;
  replaceApproved(projectId: string, tags: ReadonlyArray<ApprovedTag>): Promise<void>;
}

/**
 * Suggestions are assistive only. They are never returned by public project reads
 * and never become approved metadata without an explicit owner decision (TASK-010).
 */
export interface ProjectTagSuggestionRepository {
  listByProjectId(projectId: string): Promise<ReadonlyArray<TagSuggestion>>;
  create(input: {
    projectId: string;
    tag: string;
    category: TagCategory;
    suggestedAt?: string;
  }): Promise<TagSuggestion>;
}

export interface SiteContent {
  bio: string;
  education: string;
  skills: string[];
  achievements: string[];
  githubUrl: string;
  linkedinUrl: string;
  updatedAt: string;
}

export type SiteContentInput = Omit<SiteContent, "updatedAt">;

export interface SiteContentRepository {
  get(): Promise<SiteContent | null>;
  upsert(input: SiteContentInput): Promise<SiteContent>;
}

export interface PaymentRepository {
  insert(input: PaymentInput): Promise<PaymentRecord>;
  listByProjectId(projectId: string): Promise<ReadonlyArray<PaymentRecord>>;
  /**
   * Authoritative funding total: only verified successful payments count.
   */
  sumVerifiedSuccessfulByProjectId(projectId: string): Promise<number>;
}

export type PortfolioPersistence = {
  projects: ProjectRepository;
  adminProjects: AdminProjectRepository;
  projectTags: ProjectTagRepository;
  projectTagSuggestions: ProjectTagSuggestionRepository;
  siteContent: SiteContentRepository;
  payments: PaymentRepository;
};
