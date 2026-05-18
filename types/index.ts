/* -------------------------------------------------------------------------- */
/* Shared TypeScript types for CodePilot AI                                   */
/* -------------------------------------------------------------------------- */

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type IssueCategory =
  | "security"
  | "performance"
  | "bug"
  | "refactor"
  | "style";

export type IconName = string;

export interface NavLink {
  label: string;
  href: string;
  icon?: IconName;
  external?: boolean;
}

/* ------------------------------- User / Auth ------------------------------ */

export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  plan: PlanId;
  role: "owner" | "admin" | "member";
  createdAt: string;
}

export type PlanId = "free" | "pro" | "team";

/* --------------------------------- Pricing -------------------------------- */

export interface PricingPlan {
  id: PlanId;
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
  stripePriceId?: string;
}

/* ---------------------------------- AI Review ----------------------------- */

export interface ReviewIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: Severity;
  line?: number;
  endLine?: number;
  snippet?: string;
  suggestion?: string;
  /** Optional CWE / OWASP reference for security issues. */
  reference?: string;
}

export interface ReviewMetrics {
  /** Overall quality score (0-100). */
  score: number;
  security: number;
  performance: number;
  maintainability: number;
  /** Estimated effort to fix (minutes). */
  estimatedFixTime: number;
}

export interface ReviewResult {
  id: string;
  language: string;
  filename?: string;
  createdAt: string;
  /** Summary headline shown above the issues list. */
  summary: string;
  /** Markdown highlights (bullets). */
  highlights: string[];
  metrics: ReviewMetrics;
  issues: ReviewIssue[];
  /** AI review narrative from backend `/review`. */
  reviewDescription?: string;
  /** Suggested fixed code from backend `/review`. */
  reviewCode?: string;
}

export interface ReviewRequestPayload {
  code: string;
  language: string;
  filename?: string;
}

/* --------------------------------- GitHub --------------------------------- */

export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  language: string;
  stars: number;
  forks: number;
  private: boolean;
  updatedAt: string;
  defaultBranch: string;
}

export interface GitHubPR {
  id: string;
  number: number;
  title: string;
  author: string;
  authorAvatar: string;
  status: "open" | "merged" | "closed" | "draft";
  additions: number;
  deletions: number;
  filesChanged: number;
  createdAt: string;
  reviewScore?: number;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  filesChanged: number;
}

/* --------------------------------- Activity ------------------------------- */

export interface ActivityEvent {
  id: string;
  type:
    | "review.completed"
    | "review.started"
    | "pr.opened"
    | "pr.merged"
    | "member.joined"
    | "subscription.updated";
  actor: { name: string; avatar?: string };
  message: string;
  meta?: Record<string, string | number>;
  createdAt: string;
}

/* ---------------------------------- Team ---------------------------------- */

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "member";
  status: "active" | "pending";
  joinedAt: string;
}

/* --------------------------------- Charts --------------------------------- */

export interface ChartPoint {
  date: string;
  reviews: number;
  issues: number;
  fixed: number;
}

export interface CategoryDatum {
  category: IssueCategory;
  count: number;
}

/* --------------------------------- Upload --------------------------------- */

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

/* ---------------------------------- Chat ---------------------------------- */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

/* ----------------------------- API envelopes ------------------------------ */

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
