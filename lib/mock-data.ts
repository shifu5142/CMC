import type {
  ActivityEvent,
  CategoryDatum,
  ChartPoint,
  ChatMessage,
  GitHubCommit,
  GitHubPR,
  GitHubRepo,
  ReviewIssue,
  ReviewResult,
  TeamMember,
  UploadedFile,
  User,
} from "@/types";

/* ----------------------------------- User --------------------------------- */

export const mockUser: User = {
  id: "user_01HXY",
  email: "alex@codepilot.ai",
  name: "Alex Rivera",
  imageUrl: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
  plan: "pro",
  role: "owner",
  createdAt: "2025-09-12T10:23:00.000Z",
};

/* ---------------------------------- Review -------------------------------- */

const sampleIssues: ReviewIssue[] = [
  {
    id: "iss_01",
    title: "Potential SQL injection in user query",
    description:
      "User input is being concatenated directly into the SQL string. Use parameterized queries via the driver instead.",
    category: "security",
    severity: "critical",
    line: 42,
    endLine: 46,
    snippet:
      "const sql = `SELECT * FROM users WHERE email = '${email}'`;\nconst result = await db.query(sql);",
    suggestion:
      "const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);",
    reference: "CWE-89",
  },
  {
    id: "iss_02",
    title: "Avoid N+1 database queries in loop",
    description:
      "Querying inside a for-loop scales linearly with input. Batch the lookup with a single `IN` query.",
    category: "performance",
    severity: "high",
    line: 88,
    endLine: 94,
    snippet:
      "for (const id of userIds) {\n  const u = await db.users.findById(id);\n  results.push(u);\n}",
    suggestion:
      "const results = await db.users.find({ _id: { $in: userIds } });",
  },
  {
    id: "iss_03",
    title: "Unhandled promise rejection",
    description:
      "`sendEmail(...)` returns a promise but is not awaited; rejections will crash the worker silently.",
    category: "bug",
    severity: "high",
    line: 121,
    snippet: "sendEmail(user.email, template)",
    suggestion: "await sendEmail(user.email, template).catch(logError);",
  },
  {
    id: "iss_04",
    title: "Extract magic numbers into named constants",
    description:
      "`86400` appears in multiple places. Introducing `SECONDS_IN_DAY` improves readability and reduces drift.",
    category: "refactor",
    severity: "medium",
    line: 17,
    suggestion: "const SECONDS_IN_DAY = 60 * 60 * 24;",
  },
  {
    id: "iss_05",
    title: "Use optional chaining for safer access",
    description:
      "`user.profile.bio` will throw if `profile` is undefined. Replace with `user?.profile?.bio`.",
    category: "bug",
    severity: "low",
    line: 203,
  },
  {
    id: "iss_06",
    title: "Inconsistent naming convention",
    description:
      "Mixing `camelCase` and `snake_case` for variables in the same module reduces readability.",
    category: "style",
    severity: "info",
    line: 11,
  },
];

export const mockReview: ReviewResult = {
  id: "rev_01HXYZ",
  language: "typescript",
  filename: "src/server/users.ts",
  createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  summary:
    "Found 6 issues across 4 categories. 1 critical issue requires immediate attention.",
  highlights: [
    "1 critical security risk (SQL injection) — block merge until fixed.",
    "Performance hotspot: N+1 query pattern in user fetch loop.",
    "Code quality is generally good — type coverage at 94%.",
    "Estimated fix time: ~45 minutes for all issues.",
  ],
  metrics: {
    score: 78,
    security: 62,
    performance: 74,
    maintainability: 88,
    estimatedFixTime: 45,
  },
  issues: sampleIssues,
};

export const mockRecentReviews: ReviewResult[] = [
  mockReview,
  {
    ...mockReview,
    id: "rev_02",
    filename: "src/app/api/checkout/route.ts",
    summary: "Found 3 issues. No critical findings.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    metrics: { ...mockReview.metrics, score: 91, estimatedFixTime: 12 },
    issues: sampleIssues.slice(2, 5),
  },
  {
    ...mockReview,
    id: "rev_03",
    filename: "src/lib/payments.ts",
    summary: "Found 5 issues. 2 high-severity items.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    metrics: { ...mockReview.metrics, score: 64, estimatedFixTime: 70 },
    issues: sampleIssues.slice(0, 5),
  },
  {
    ...mockReview,
    id: "rev_04",
    filename: "src/components/Editor.tsx",
    language: "tsx",
    summary: "Found 2 minor refactor suggestions.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    metrics: { ...mockReview.metrics, score: 96, estimatedFixTime: 8 },
    issues: sampleIssues.slice(3, 5),
  },
];

/* ---------------------------------- GitHub -------------------------------- */

export const mockRepos: GitHubRepo[] = [
  {
    id: "repo_1",
    name: "codepilot-web",
    fullName: "codepilot-ai/codepilot-web",
    description: "Main marketing & app frontend for CodePilot AI.",
    language: "TypeScript",
    stars: 482,
    forks: 27,
    private: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    defaultBranch: "main",
  },
  {
    id: "repo_2",
    name: "review-engine",
    fullName: "codepilot-ai/review-engine",
    description: "Static + AI hybrid code review engine.",
    language: "Rust",
    stars: 1289,
    forks: 64,
    private: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    defaultBranch: "main",
  },
  {
    id: "repo_3",
    name: "infrastructure",
    fullName: "codepilot-ai/infrastructure",
    description: "Terraform + Kubernetes manifests.",
    language: "HCL",
    stars: 31,
    forks: 4,
    private: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    defaultBranch: "main",
  },
  {
    id: "repo_4",
    name: "docs",
    fullName: "codepilot-ai/docs",
    description: "Public-facing docs site.",
    language: "MDX",
    stars: 76,
    forks: 12,
    private: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    defaultBranch: "main",
  },
];

export const mockPRs: GitHubPR[] = [
  {
    id: "pr_1",
    number: 412,
    title: "feat(api): paginated /reviews endpoint",
    author: "morgan",
    authorAvatar: "https://avatars.githubusercontent.com/u/1?v=4",
    status: "open",
    additions: 284,
    deletions: 47,
    filesChanged: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    reviewScore: 82,
  },
  {
    id: "pr_2",
    number: 411,
    title: "fix(billing): retry failed Stripe webhooks",
    author: "rina",
    authorAvatar: "https://avatars.githubusercontent.com/u/2?v=4",
    status: "merged",
    additions: 58,
    deletions: 12,
    filesChanged: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    reviewScore: 94,
  },
  {
    id: "pr_3",
    number: 410,
    title: "chore: bump next to 16.2.6",
    author: "alex",
    authorAvatar: "https://avatars.githubusercontent.com/u/3?v=4",
    status: "draft",
    additions: 1024,
    deletions: 980,
    filesChanged: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export const mockCommits: GitHubCommit[] = [
  {
    sha: "a1b2c3d",
    message: "feat(review): stream incremental issues from server",
    author: "alex",
    authorAvatar: "https://avatars.githubusercontent.com/u/3?v=4",
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    filesChanged: 6,
  },
  {
    sha: "e4f5g6h",
    message: "fix(dashboard): empty-state spacing on mobile",
    author: "morgan",
    authorAvatar: "https://avatars.githubusercontent.com/u/1?v=4",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    filesChanged: 2,
  },
  {
    sha: "i7j8k9l",
    message: "docs: add quickstart for GitHub App install",
    author: "rina",
    authorAvatar: "https://avatars.githubusercontent.com/u/2?v=4",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    filesChanged: 1,
  },
];

/* --------------------------------- Activity ------------------------------- */

export const mockActivity: ActivityEvent[] = [
  {
    id: "act_1",
    type: "review.completed",
    actor: { name: "CodePilot", avatar: undefined },
    message: "Review completed on `src/server/users.ts` — score 78",
    meta: { score: 78 },
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
  },
  {
    id: "act_2",
    type: "pr.opened",
    actor: {
      name: "morgan",
      avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    },
    message: "Opened PR #412 — feat(api): paginated /reviews endpoint",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "act_3",
    type: "member.joined",
    actor: {
      name: "rina",
      avatar: "https://avatars.githubusercontent.com/u/2?v=4",
    },
    message: "Rina Patel joined the team",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: "act_4",
    type: "subscription.updated",
    actor: { name: "billing" },
    message: "Upgraded to Pro plan — $19 / mo",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

/* ---------------------------------- Team ---------------------------------- */

export const mockTeam: TeamMember[] = [
  {
    id: "tm_1",
    name: "Alex Rivera",
    email: "alex@codepilot.ai",
    avatar: "https://avatars.githubusercontent.com/u/3?v=4",
    role: "owner",
    status: "active",
    joinedAt: "2025-09-12T10:23:00.000Z",
  },
  {
    id: "tm_2",
    name: "Morgan Lee",
    email: "morgan@codepilot.ai",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    role: "admin",
    status: "active",
    joinedAt: "2025-10-02T14:10:00.000Z",
  },
  {
    id: "tm_3",
    name: "Rina Patel",
    email: "rina@codepilot.ai",
    avatar: "https://avatars.githubusercontent.com/u/2?v=4",
    role: "member",
    status: "active",
    joinedAt: "2025-11-19T09:00:00.000Z",
  },
  {
    id: "tm_4",
    name: "Sam Okafor",
    email: "sam@codepilot.ai",
    role: "member",
    status: "pending",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

/* --------------------------------- Charts --------------------------------- */

export const mockTrend: ChartPoint[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  const base = 18 + Math.round(Math.sin(i / 2) * 10 + i * 1.6);
  return {
    date: d.toISOString().slice(5, 10),
    reviews: base,
    issues: Math.round(base * 1.8 + (i % 3) * 4),
    fixed: Math.round(base * 1.4),
  };
});

export const mockCategoryBreakdown: CategoryDatum[] = [
  { category: "security", count: 14 },
  { category: "performance", count: 22 },
  { category: "bug", count: 31 },
  { category: "refactor", count: 48 },
  { category: "style", count: 19 },
];

/* --------------------------------- Uploads -------------------------------- */

export const mockUploads: UploadedFile[] = [
  {
    id: "up_1",
    name: "users.ts",
    url: "https://utfs.io/f/mock-users.ts",
    size: 8412,
    type: "text/typescript",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

/* ---------------------------------- Chat ---------------------------------- */

export const mockChat: ChatMessage[] = [
  {
    id: "msg_1",
    role: "assistant",
    content:
      "Hey! I just finished reviewing `users.ts`. The critical SQL injection on line 42 is the most urgent issue — want me to walk you through the fix?",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

/* ------------------------------- Testimonials ----------------------------- */

export const mockTestimonials = [
  {
    quote:
      "CodePilot caught a credential leak in our auth service the day we installed it. It paid for itself in 24 hours.",
    name: "Maya Chen",
    role: "Staff Engineer, Vercel",
    avatar: "https://avatars.githubusercontent.com/u/8?v=4",
  },
  {
    quote:
      "It's like having a senior reviewer awake at 3am. Our PR throughput is up 40%.",
    name: "Daniel Park",
    role: "CTO, Linear",
    avatar: "https://avatars.githubusercontent.com/u/9?v=4",
  },
  {
    quote:
      "We replaced three internal linters with CodePilot. Our SOC2 audit was a non-event.",
    name: "Priya Raman",
    role: "Head of Security, Notion",
    avatar: "https://avatars.githubusercontent.com/u/10?v=4",
  },
];
