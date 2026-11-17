"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { BookOpen, Check, ChevronsUpDown, LayoutGrid, LogOut, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/dashboard/actions";

const menuContent =
  "z-50 min-w-[220px] max-w-[calc(100vw-32px)] rounded-lg border border-line-200 bg-surface-200 p-1 text-sm text-ink-100 shadow-popover outline-none";
const menuItem =
  "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-[13px] leading-5 text-ink-200 outline-none select-none data-[highlighted]:bg-surface-400 data-[highlighted]:text-ink-100 [&_svg]:size-4 [&_svg]:shrink-0";
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-text";

/**
 * The breadcrumb in the top bar. On the apps list it is a plain "Apps" label;
 * inside an app it names the app and opens a menu to jump to another one.
 */
export function AppSwitcher({ apps, canCreate }: { apps: { id: string; name: string }[]; canCreate: boolean }) {
  const params = useParams<{ id?: string }>();
  const current = apps.find((app) => app.id === params.id);

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-sm">
      <span aria-hidden className="px-1 text-ink-300 select-none">
        /
      </span>
      <Link
        href="/dashboard"
        aria-current={current ? undefined : "page"}
        className={cn(
          "rounded-sm px-1.5 py-1 font-medium hover:text-ink-100",
          current ? "u-hide-sm text-ink-300" : "text-ink-100",
          focusRing,
        )}
      >
        Apps
      </Link>
      {current ? (
        <>
          <span aria-hidden className="u-hide-sm px-1 text-ink-300 select-none">
            /
          </span>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              aria-label={`Switch app. Current app: ${current.name}`}
              className={cn(
                "flex min-w-0 cursor-pointer items-center gap-1.5 rounded-sm px-1.5 py-1 font-medium text-ink-100 hover:bg-surface-300 data-[state=open]:bg-surface-300",
                focusRing,
              )}
            >
              <span className="truncate">{current.name}</span>
              <ChevronsUpDown aria-hidden className="size-3.5 shrink-0 text-ink-300" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="start" sideOffset={8} className={menuContent}>
                <DropdownMenu.Label className="px-2.5 py-1.5 text-xs text-ink-300">Your apps</DropdownMenu.Label>
                {apps.map((app) => (
                  <DropdownMenu.Item key={app.id} asChild className={menuItem}>
                    <Link href={`/dashboard/apps/${app.id}`} aria-current={app.id === current.id ? "true" : undefined}>
                      <span className="min-w-0 flex-1 truncate">{app.name}</span>
                      {app.id === current.id ? <Check aria-hidden className="text-ink-100" /> : null}
                    </Link>
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-line-100" />
                <DropdownMenu.Item asChild className={menuItem}>
                  <Link href="/dashboard">
                    <LayoutGrid aria-hidden />
                    All apps
                  </Link>
                </DropdownMenu.Item>
                {canCreate ? (
                  <DropdownMenu.Item asChild className={menuItem}>
                    <Link href="/dashboard/new">
                      <Plus aria-hidden />
                      New app
                    </Link>
                  </DropdownMenu.Item>
                ) : null}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </>
      ) : null}
    </nav>
  );
}

/** The round button at the right of the top bar: who is signed in, docs, sign out. */
export function AccountMenu({ email, docsHref }: { email: string; docsHref: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Account menu"
        className={cn(
          "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-200 bg-surface-300 text-[13px] font-medium text-ink-100 uppercase hover:bg-surface-400 data-[state=open]:bg-surface-400",
          focusRing,
        )}
      >
        <span aria-hidden>{email.charAt(0) || "?"}</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className={menuContent}>
          <DropdownMenu.Label className="px-2.5 py-1.5">
            <span className="block text-xs text-ink-300">Signed in as</span>
            <span className="block truncate text-[13px] text-ink-100" title={email}>
              {email}
            </span>
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-line-100" />
          <DropdownMenu.Item asChild className={menuItem}>
            <a href={docsHref}>
              <BookOpen aria-hidden />
              Docs
            </a>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={menuItem}
            disabled={pending}
            onSelect={(event) => {
              event.preventDefault();
              startTransition(() => signOutAction());
            }}
          >
            <LogOut aria-hidden />
            {pending ? "Signing out…" : "Sign out"}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

/** Overview / Payments / Settings for one app. Real links, so each page has its own address. */
export function AppTabs({ appId }: { appId: string }) {
  const pathname = usePathname();
  const base = `/dashboard/apps/${appId}`;
  const tabs = [
    { label: "Overview", href: base },
    { label: "Payments", href: `${base}/payments` },
    { label: "Settings", href: `${base}/settings` },
  ];
  return (
    <nav aria-label="App sections" className="-mx-4 overflow-x-auto border-b border-line-100 px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-6">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "-mb-px inline-flex h-10 items-center rounded-sm border-b-2 text-sm font-medium whitespace-nowrap transition-colors",
                  active ? "border-ink-100 text-ink-100" : "border-transparent text-ink-300 hover:text-ink-100",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-text",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
