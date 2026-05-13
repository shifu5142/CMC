import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { SITE } from "@/lib/constants";

const FOOTER_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/#changelog" },
      { label: "Docs", href: "/#docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Blog", href: "/#blog" },
      { label: "Careers", href: "/#careers" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/#terms" },
      { label: "Privacy", href: "/#privacy" },
      { label: "Security", href: "/#security" },
      { label: "DPA", href: "/#dpa" },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {SITE.description}
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              © {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {group.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
