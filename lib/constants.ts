import type { NavLink, PricingPlan } from "@/types";

export const SITE = {
  name: "CMC",
  shortName: "CMC",
  tagline: "Check your code for errors and vulnerabilities.",
  description:
    "CMC helps you check your code for errors, security issues, and vulnerabilities.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://codepilot.ai",
  twitter: "@codepilotai",
  email: "hello@codepilot.ai",
} as const;

export const MAIN_NAV: NavLink[] = [
  { label: "Product", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/#changelog" },
  { label: "Docs", href: "/#docs" },
];

export const DASHBOARD_NAV: NavLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "New Review", href: "/review", icon: "Sparkles" },
  { label: "GitHub", href: "/github", icon: "Github" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Team", href: "/team", icon: "Users" },
  { label: "Billing", href: "/billing", icon: "CreditCard" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

export const SUPPORTED_LANGUAGES = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
] as const;

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    description: "For solo devs trying things out.",
    features: [
      "50 reviews / month",
      "Public repos only",
      "Community support",
      "Basic dashboard",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    interval: "month",
    description: "For senior engineers shipping daily.",
    features: [
      "Unlimited reviews",
      "Private repos + GitHub App",
      "Security + performance scans",
      "Slack & email alerts",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
    stripePriceId: "price_pro_monthly",
  },
  {
    id: "team",
    name: "Team",
    price: 49,
    interval: "month",
    description: "For teams that ship faster than they break.",
    features: [
      "Everything in Pro",
      "Up to 10 seats included",
      "SSO + audit logs",
      "Custom policies & severities",
      "Dedicated success manager",
    ],
    cta: "Contact sales",
    highlight: false,
    stripePriceId: "price_team_monthly",
  },
];

export const SEVERITY_META = {
  critical: {
    label: "Critical",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    dot: "bg-red-500",
  },
  high: {
    label: "High",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    dot: "bg-orange-500",
  },
  medium: {
    label: "Medium",
    badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    dot: "bg-yellow-500",
  },
  low: {
    label: "Low",
    badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    dot: "bg-sky-500",
  },
  info: {
    label: "Info",
    badge: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
    dot: "bg-zinc-500",
  },
} as const;

export const CATEGORY_META = {
  security: { label: "Security", icon: "Shield" },
  performance: { label: "Performance", icon: "Zap" },
  bug: { label: "Bug", icon: "Bug" },
  refactor: { label: "Refactor", icon: "Wand2" },
  style: { label: "Style", icon: "Brush" },
} as const;
