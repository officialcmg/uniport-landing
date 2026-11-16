import type { Metadata } from "next";
import Link from "next/link";
import { requireApp } from "@/lib/dashboard/session";
import { listPayments } from "@/lib/dashboard/apps";
import { Button } from "@/components/ui/button";
import { EmptyState, Panel } from "@/components/dashboard/panel";
import { PaymentsTable } from "@/components/dashboard/payments-table";

export const metadata: Metadata = { title: "Payments" };

const LIMIT = 50;

export default async function AppPaymentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, app } = await requireApp(id);
  const payments = await listPayments(user.id, app.id, LIMIT);

  return (
    <Panel
      title="Payments"
      description={
        payments.length >= LIMIT
          ? `The most recent ${LIMIT}. A payment's status updates while the payer's browser, or your server, is checking on it.`
          : "Newest first. A payment's status updates while the payer's browser, or your server, is checking on it."
      }
      flush
    >
      {payments.length === 0 ? (
        <div className="border-t border-line-100">
          <EmptyState
            title="No payments yet"
            action={
              <Button asChild size="sm">
                <Link href={`/dashboard/apps/${app.id}`}>See how to add the button</Link>
              </Button>
            }
          >
            A payment appears here as soon as a payer is given a deposit address.
          </EmptyState>
        </div>
      ) : (
        <PaymentsTable payments={payments} />
      )}
    </Panel>
  );
}
