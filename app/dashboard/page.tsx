import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/lib/dashboard/session";
import { listApps, MAX_APPS_PER_USER } from "@/lib/dashboard/apps";
import { Button } from "@/components/ui/button";
import { CreateAppForm } from "@/components/dashboard/forms";

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const apps = await listApps(user.id);

  if (apps.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 sm:pt-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-ink-100">Create your first app</h1>
          <p className="mt-2 text-sm leading-6 text-ink-200">
            An app gives you an App ID to pass to the Uniport button. It tells Uniport which payments are yours and
            which websites may take them.
          </p>
        </div>
        <section aria-label="New app" className="rounded-xl border border-line-100 bg-surface-200 p-5 sm:p-6">
          <CreateAppForm />
        </section>
      </div>
    );
  }

  const atLimit = apps.length >= MAX_APPS_PER_USER;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-ink-100">Apps</h1>
          <p className="mt-1 text-sm leading-6 text-ink-200">
            {atLimit
              ? `You have ${apps.length} apps, which is the limit. Delete one to add another.`
              : "Each app has its own App ID, allowed websites and payments."}
          </p>
        </div>
        {atLimit ? null : (
          <Button asChild variant="primary">
            <Link href="/dashboard/new">
              <Plus aria-hidden className="size-4" />
              New app
            </Link>
          </Button>
        )}
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => (
          <li key={app.id}>
            <Link
              href={`/dashboard/apps/${app.id}`}
              className="flex h-full flex-col rounded-xl border border-line-100 bg-surface-200 p-5 transition-colors hover:border-line-200 hover:bg-surface-300/60"
            >
              <span className="truncate text-[15px] font-medium text-ink-100">{app.name}</span>
              <span className="mt-1 truncate font-mono text-xs text-ink-300">{app.publicId ?? "No App ID"}</span>
              <span className="mt-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-line-100 pt-3 text-xs leading-5 text-ink-300">
                <span>
                  <span className="u-num text-ink-100">{app.payments30d}</span>{" "}
                  {app.payments30d === 1 ? "payment" : "payments"} in 30 days
                </span>
                <span>
                  {app.allowedOrigins.length === 0
                    ? app.allowLocalhost
                      ? "localhost only"
                      : "No websites"
                    : plural(app.allowedOrigins.length, "website", "websites")}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
