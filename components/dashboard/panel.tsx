import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A titled card: the building block of the dashboard pages. */
export function Panel({
  title,
  description,
  action,
  children,
  className,
  flush = false,
}: {
  title: string;
  description?: ReactNode;
  /** A link or button shown at the right of the title. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Lets the content run edge to edge, for tables and lists. */
  flush?: boolean;
}) {
  return (
    <section className={cn("rounded-xl border border-line-100 bg-surface-200", className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pt-5 sm:px-6">
        <div className="min-w-0">
          <h2 className="text-base font-medium text-ink-100">{title}</h2>
          {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-200">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className={cn("mt-4", flush ? "" : "px-5 pb-5 sm:px-6 sm:pb-6")}>{children}</div>
    </section>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-line-100 bg-surface-200 px-5 py-4">
      <dt className="text-[13px] text-ink-300">{label}</dt>
      <dd className="u-num mt-1 text-2xl font-medium tracking-tight text-ink-100">{value}</dd>
      {hint ? <dd className="mt-1 text-xs text-ink-300">{hint}</dd> : null}
    </div>
  );
}

/** What a list shows when it has nothing in it yet. */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <p className="text-sm font-medium text-ink-100">{title}</p>
      {children ? <p className="mt-1 max-w-md text-sm leading-6 text-ink-300">{children}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export const textLink =
  "rounded-sm text-brand-text underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-text";
