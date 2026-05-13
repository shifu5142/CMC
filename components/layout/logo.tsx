import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  /** Hide the wordmark and only show the mark. */
  iconOnly?: boolean;
}

export function Logo({ href = "/", className, iconOnly = false }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-foreground",
        className,
      )}
      aria-label="CodePilot AI"
    >
      <span
        aria-hidden
        className="relative grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-500 shadow-[0_0_24px_-6px_hsl(263_85%_65%/0.7)]"
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          className="text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="8 6 2 12 8 18" />
          <polyline points="16 6 22 12 16 18" />
        </svg>
      </span>
      {iconOnly ? null : (
        <span className="text-sm font-semibold tracking-tight">
          CodePilot<span className="text-muted-foreground"> AI</span>
        </span>
      )}
    </Link>
  );
}
