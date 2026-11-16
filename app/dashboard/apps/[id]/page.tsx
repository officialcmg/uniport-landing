import type { ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { requireApp } from "@/lib/dashboard/session";
import { getSummary, listPayments, type AppDetail } from "@/lib/dashboard/apps";
import { formatUsd } from "@/lib/dashboard/format";
import { CodeBlock } from "@/components/site/code-block";
import { Panel, Stat, textLink } from "@/components/dashboard/panel";
import { PaymentsTable } from "@/components/dashboard/payments-table";

function snippet(publicId: string | null): string {
  return `import { UniportButton } from 'uniport-sdk'

<UniportButton
  appId="${publicId ?? "app_..."}"
  recipient="0x..."
  destinationToken="arbitrumUSDC"
  onSuccess={(result) => console.log('Paid', result.depositAddress)}
/>`;
}

function ConfirmNote() {
  return (
    <p className="text-sm leading-6 text-ink-200">
      Before you ship goods or grant access, have your server{" "}
      <Link href="/docs/confirm-payment" className={textLink}>
        confirm the payment
      </Link>
      .
    </p>
  );
}

function Step({ number, title, done = false, children }: { number: number; title: string; done?: boolean; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[24px_minmax(0,1fr)] gap-x-3 border-t border-line-100 px-5 py-5 first:border-0 sm:gap-x-4 sm:px-6">
      <span
        className={
          done
            ? "flex size-6 items-center justify-center rounded-full bg-success-soft text-success"
            : "u-num flex size-6 items-center justify-center rounded-full border border-line-200 text-xs font-medium text-ink-200"
        }
      >
        {done ? <Check aria-hidden className="size-3.5" /> : number}
      </span>
      <div className="flex min-w-0 flex-col gap-3">
        <h3 className="text-sm leading-6 font-medium text-ink-100">
          {title}
          {done ? <span className="sr-only"> (done)</span> : null}
        </h3>
        {children}
      </div>
    </li>
  );
}

function GetStarted({ app }: { app: AppDetail }) {
  const hasSite = app.allowedOrigins.length > 0;
  const settings = `/dashboard/apps/${app.id}/settings#websites`;
  return (
    <Panel
      title="Get started"
      description="Four steps to your first payment. This guide goes away once a payment arrives."
      flush
    >
      <ol className="border-t border-line-100">
        <Step number={1} title="Install the SDK">
          <CodeBlock code="npm i uniport-sdk" lang="bash" file="Terminal" fileIcon={false} lineNumbers={false} />
        </Step>
        <Step number={2} title="Add the button, with this app's App ID">
          <CodeBlock code={snippet(app.publicId)} file="Checkout.tsx" lineNumbers={false} />
          <ConfirmNote />
        </Step>
        <Step number={3} title="Allow your website" done={hasSite}>
          {hasSite ? (
            <p className="text-sm leading-6 text-ink-200">
              <span className="font-mono text-[13px] break-all text-ink-100">{app.allowedOrigins.join(", ")}</span>{" "}
              can use this App ID{app.allowLocalhost ? ", and so can localhost" : ""}.{" "}
              <Link href={settings} className={textLink}>
                Change
              </Link>
            </p>
          ) : (
            <p className="text-sm leading-6 text-ink-200">
              {app.allowLocalhost
                ? "Only localhost can use this App ID so far, which is enough to build with."
                : "No website can use this App ID yet."}{" "}
              <Link href={settings} className={textLink}>
                Add your website
              </Link>{" "}
              before you go live.
            </p>
          )}
        </Step>
        <Step number={4} title="Take a payment">
          <p className="text-sm leading-6 text-ink-200">
            Open your page and pay with the button. The payment shows up here as soon as the payer is given a
            deposit address.
          </p>
        </Step>
      </ol>
    </Panel>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-t border-line-100 py-3 first:border-0 first:pt-0 last:pb-0">
      <dt className="text-xs text-ink-300">{label}</dt>
      <dd className="min-w-0 text-sm leading-6 text-ink-100">{children}</dd>
    </div>
  );
}

function Configuration({ app }: { app: AppDetail }) {
  const recipients = app.recipientAllowlist ?? [];
  return (
    <Panel
      title="Configuration"
      action={
        <Link href={`/dashboard/apps/${app.id}/settings`} className={`${textLink} text-sm leading-6`}>
          Edit<span className="sr-only"> settings</span>
        </Link>
      }
    >
      <dl>
        <Row label="Allowed websites">
          {app.allowedOrigins.length === 0 ? (
            <span className="text-ink-200">None yet</span>
          ) : (
            <ul className="font-mono text-[13px]">
              {app.allowedOrigins.map((origin) => (
                <li key={origin} className="truncate" title={origin}>
                  {origin}
                </li>
              ))}
            </ul>
          )}
        </Row>
        <Row label="localhost">{app.allowLocalhost ? "Allowed" : "Not allowed"}</Row>
        <Row label="Recipients">
          {recipients.length === 0 ? (
            "Any address"
          ) : (
            <ul className="font-mono text-[13px]">
              {recipients.map((address) => (
                <li key={address} className="truncate" title={address}>
                  {address}
                </li>
              ))}
            </ul>
          )}
        </Row>
      </dl>
    </Panel>
  );
}

export default async function AppOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, app } = await requireApp(id);
  const [summary, payments] = await Promise.all([getSummary(user.id, app.id), listPayments(user.id, app.id, 5)]);

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="stats-title">
        <h2 id="stats-title" className="mb-3 text-sm font-medium text-ink-200">
          Last 30 days
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat label="Payments started" value={String(summary.payments)} />
          <Stat label="Paid" value={String(summary.succeeded)} />
          <Stat label="Volume received" value={formatUsd(summary.volumeUsd)} />
        </dl>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          {summary.everUsed ? (
            <>
              <Panel
                title="Recent payments"
                flush
                action={
                  <Link href={`/dashboard/apps/${app.id}/payments`} className={`${textLink} text-sm leading-6`}>
                    View all<span className="sr-only"> payments</span>
                  </Link>
                }
              >
                <PaymentsTable payments={payments} compact />
              </Panel>
              <details className="group rounded-xl border border-line-100 bg-surface-200">
                <summary className="cursor-pointer list-none rounded-xl px-5 py-4 text-sm font-medium text-ink-100 sm:px-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    Integration code
                    <span className="text-xs font-normal text-ink-300 group-open:hidden">Show</span>
                    <span className="hidden text-xs font-normal text-ink-300 group-open:inline">Hide</span>
                  </span>
                </summary>
                <div className="flex flex-col gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
                  <CodeBlock code={snippet(app.publicId)} file="Checkout.tsx" lineNumbers={false} />
                  <ConfirmNote />
                </div>
              </details>
            </>
          ) : (
            <GetStarted app={app} />
          )}
        </div>
        <Configuration app={app} />
      </div>
    </div>
  );
}
