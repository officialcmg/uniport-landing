import type { ReactNode } from "react";
import { requireApp } from "@/lib/dashboard/session";
import { CopyValue } from "@/components/dashboard/copy-value";
import { AppTabs } from "@/components/dashboard/nav";

export default async function AppLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { app } = await requireApp(id);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <h1 className="min-w-0 text-2xl font-medium tracking-tight break-words text-ink-100">{app.name}</h1>
          {app.publicId ? (
            <CopyValue value={app.publicId} label="App ID" />
          ) : (
            <span className="text-sm text-ink-300">No App ID</span>
          )}
        </div>
        <AppTabs appId={app.id} />
      </div>
      {children}
    </div>
  );
}
