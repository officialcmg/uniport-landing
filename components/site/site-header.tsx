import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/site/icon";
import { MobileNav } from "@/components/site/mobile-nav";
import { LINKS } from "@/lib/chains";

export type NavLink = { label: string; href: string };

export const SITE_NAV: NavLink[] = [
  { label: "Why Uniport", href: "/#why" },
  { label: "How it works", href: "/#how" },
  { label: "Use cases", href: "/#use-cases" },
  { label: "Chains", href: "/#chains" },
  { label: "Docs", href: LINKS.docs },
];

export function Lockup({ height = 20 }: { height?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/uniport-lockup-light.svg" alt="Uniport" style={{ height, width: "auto", display: "block" }} />;
}

/** Linear-style sticky header. `center` replaces the nav (the docs put search there). */
export function SiteHeader({
  nav = SITE_NAV,
  badge,
  center,
  innerClassName,
  mobileNav = true,
  githubIcon = true,
}: {
  nav?: NavLink[];
  badge?: ReactNode;
  center?: ReactNode;
  innerClassName?: string;
  mobileNav?: boolean;
  githubIcon?: boolean;
}) {
  return (
    <header className="u-header">
      <div className={`u-container u-header-in${innerClassName ? ` ${innerClassName}` : ""}`}>
        <div className="u-header-brand">
          <Link href="/" aria-label="Uniport home">
            <Lockup />
          </Link>
          {badge}
        </div>
        {center ?? (
          <nav className="u-nav" aria-label="Primary">
            {nav.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="u-header-actions">
          <Button asChild variant="ghost" size="sm" className="u-hide-sm">
            <a href={LINKS.github}>
              {githubIcon ? <Icon name="github" size="sm" /> : null}
              GitHub
            </a>
          </Button>
          <Button asChild variant="primary" size="sm">
            <a href={LINKS.demo}>Launch demo</a>
          </Button>
          {mobileNav ? <MobileNav nav={nav} /> : null}
        </div>
      </div>
    </header>
  );
}
