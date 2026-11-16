import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { requireUser } from "@/lib/dashboard/session";
import { listApps, MAX_APPS_PER_USER } from "@/lib/dashboard/apps";
import { Button } from "@/components/ui/button";
import { Lockup } from "@/components/site/site-header";
import { AccountMenu, AppSwitcher } from "@/components/dashboard/nav";
import { LINKS } from "@/lib/chains";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const apps = await listApps(user.id);

  return (
    <div className="u-page min-h-screen">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface-300 focus:px-3 focus:py-2 focus:text-sm focus:text-ink-100"
      >
        Skip to content
      </a>
      <header className="u-header">
        <div className="u-container flex h-full items-center justify-between gap-3" style={{ maxWidth: 1080 }}>
          <div className="flex min-w-0 items-center gap-1.5">
            <Link href="/dashboard" aria-label="Uniport dashboard" className="shrink-0 rounded-sm">
              <Lockup />
            </Link>
            <AppSwitcher
              apps={apps.map((app) => ({ id: app.id, name: app.name }))}
              canCreate={apps.length < MAX_APPS_PER_USER}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="u-hide-sm">
              <a href={LINKS.docs}>Docs</a>
            </Button>
            <AccountMenu email={user.email} docsHref={LINKS.docs} />
          </div>
        </div>
      </header>
      <main id="dashboard-main" className="u-container py-8 sm:py-10" style={{ maxWidth: 1080 }}>
        {children}
      </main>
    </div>
  );
}
