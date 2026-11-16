import type { Metadata } from "next";
import { requireApp } from "@/lib/dashboard/session";
import {
  DeleteAppButton,
  NameForm,
  RecipientsForm,
  ReplaceAppIdButton,
  WebsitesForm,
} from "@/components/dashboard/forms";

export const metadata: Metadata = { title: "Settings" };

export default async function AppSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { app } = await requireApp(id);

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <NameForm app={{ id: app.id, name: app.name }} />
      <WebsitesForm app={{ id: app.id, allowedOrigins: app.allowedOrigins, allowLocalhost: app.allowLocalhost }} />
      <RecipientsForm app={{ id: app.id, recipientAllowlist: app.recipientAllowlist }} />

      <section id="app-id" aria-labelledby="app-id-title" className="scroll-mt-24 rounded-xl border border-line-100 bg-surface-200 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="min-w-0 basis-80 grow">
            <h2 id="app-id-title" className="text-base font-medium text-ink-100">
              App ID
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-200">
              The App ID is public, so it is safe in your website&apos;s code. Replace it if another site is misusing
              it.
            </p>
            <p className="mt-3 font-mono text-[13px] break-all text-ink-100">{app.publicId ?? "No App ID"}</p>
          </div>
          <ReplaceAppIdButton appId={app.id} />
        </div>
      </section>

      <section
        id="danger"
        aria-labelledby="danger-title"
        className="scroll-mt-24 rounded-xl border border-destructive/30 bg-surface-200 p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="min-w-0 basis-80 grow">
            <h2 id="danger-title" className="text-base font-medium text-destructive">
              Delete this app
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-200">
              Its App ID stops working for good and the app leaves your dashboard. This cannot be undone.
            </p>
          </div>
          <DeleteAppButton appId={app.id} appName={app.name} />
        </div>
      </section>
    </div>
  );
}
