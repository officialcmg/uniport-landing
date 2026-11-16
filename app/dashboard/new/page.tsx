import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/dashboard/session";
import { listApps, MAX_APPS_PER_USER } from "@/lib/dashboard/apps";
import { Button } from "@/components/ui/button";
import { CreateAppForm } from "@/components/dashboard/forms";

export const metadata: Metadata = { title: "New app" };

export default async function NewAppPage() {
  const user = await requireUser();
  const apps = await listApps(user.id);
  const atLimit = apps.length >= MAX_APPS_PER_USER;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 sm:pt-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-ink-100">New app</h1>
        <p className="mt-2 text-sm leading-6 text-ink-200">
          {atLimit
            ? `You have ${apps.length} apps, which is the limit. Delete one to add another.`
            : "You get an App ID straight away, and you can change everything later."}
        </p>
      </div>
      {atLimit ? (
        <div>
          <Button asChild>
            <Link href="/dashboard">Back to apps</Link>
          </Button>
        </div>
      ) : (
        <section aria-label="New app" className="rounded-xl border border-line-100 bg-surface-200 p-5 sm:p-6">
          <CreateAppForm />
        </section>
      )}
    </div>
  );
}
