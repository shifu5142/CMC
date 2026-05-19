import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

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
      aria-label={SITE.name}
    >
      <Image
        src="/CMC-ICON.png"
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 rounded-md object-contain"
        priority
      />
      {iconOnly ? null : (
        <span className="text-sm font-semibold tracking-tight">{SITE.name}</span>
      )}
    </Link>
  );
}
