# CodePilot AI

AI-powered code review SaaS. **Frontend + mocked API routes only** — backend logic (MongoDB, OpenAI, Stripe) is intentionally left as scaffolds for you to fill in.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + custom shadcn-style UI primitives
- **Clerk** authentication
- **Mongoose** (MongoDB) connection helper
- **OpenAI / Stripe / UploadThing** ready for backend wiring
- **Zustand** for client state
- **Framer Motion** for animations
- **Recharts** for charts
- **cmdk** for ⌘K command palette
- **sonner** for toasts

## Getting started

```bash
# 1. Install deps (you control this)
npm install
# or
pnpm install

# 2. Fill in env
cp .env.example .env.local
# edit values

# 3. Run
npm run dev
```

Open <http://localhost:3000>.

## Project structure

```
app/
  page.tsx                  # Landing
  dashboard/                # Overview, stats, recent reviews
  review/                   # AI code review workspace (editor + results)
  github/                   # Repos, PRs, commits
  analytics/                # Charts and metrics
  team/                     # Roster + invite dialog
  billing/                  # Subscription + invoices
  settings/                 # Profile, API keys, prefs, theme
  pricing/                  # Public pricing page
  sign-in/ , sign-up/       # Clerk
  api/
    review/route.ts         # POST runs mock review, GET lists recent
    github/route.ts         # Returns mock repos/PRs/commits
    upload/route.ts         # Mock UploadThing response
    chat/route.ts           # Mock AI chat reply
  layout.tsx                # Metadata + providers
  sitemap.ts , robots.ts

components/
  layout/                   # Navbar, Footer, Sidebar, DashboardShell, CommandMenu, Providers
  landing/                  # Hero, Features, Pricing, Testimonials, CTA, LogoCloud
  dashboard/                # StatsCards, UsageChart, ActivityFeed, RecentReviews, CategoryBreakdown
  review/                   # CodeEditor (Monaco), UploadArea, ResultsPanel, IssueCard, ScoreIndicator, AIChat
  ui/                       # shadcn-style primitives (button, card, input, etc.)

lib/
  utils.ts                  # cn(), date / number formatting
  api.ts                    # Typed fetch wrapper
  mongoose.ts               # Connection helper (scaffold)
  constants.ts              # Nav, pricing plans, severity metadata
  mock-data.ts              # Static fixtures used everywhere

store/                      # Zustand stores
hooks/                      # useFetch, useDebounce, useHotkey, useMediaQuery
services/                   # reviewService, githubService, billingService
types/index.ts              # Shared TypeScript types

middleware.ts               # Clerk auth middleware
```

## What's mocked

| Surface       | Status                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| Auth          | Clerk wired (needs `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)                                              |
| AI review     | `POST /api/review` returns a fixture from `lib/mock-data.ts`                                         |
| GitHub        | `GET /api/github` returns mock repos / PRs / commits                                                 |
| Uploads       | `POST /api/upload` returns a fake `UploadedFile`                                                     |
| AI chat       | `POST /api/chat` returns a deterministic reply                                                       |
| Stripe        | Upgrade buttons hit `billingService` which simulates a 600ms checkout session and redirects locally  |
| MongoDB       | `connectToDatabase()` is implemented but never called — wire it in once you have models             |

## Next steps for backend

1. Add models in `lib/models/` (e.g. `User`, `Review`, `Repo`) and import them in API routes.
2. Swap the mock body of each `app/api/*/route.ts` for real DB / OpenAI / Stripe calls.
3. Add a real Stripe Checkout endpoint at `app/api/checkout/route.ts` and call it from `billingService.createCheckoutSession`.
4. Wire UploadThing per its docs (`uploadthing/next`).
5. Replace `mockUser`, `mockTeam`, etc. with `auth()` from Clerk and DB queries.

## Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Run production server
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```
