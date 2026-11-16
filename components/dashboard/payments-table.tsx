import type { Payment } from "@/lib/dashboard/apps";
import { formatTokenAmount, formatWhen, shorten, statusLabel } from "@/lib/dashboard/format";
import { Badge } from "@/components/ui/badge";

function site(origin: string | null): string {
  return origin ? origin.replace(/^https?:\/\//, "") : "A server or script";
}

const th = "h-10 px-3 text-left text-xs font-medium whitespace-nowrap text-ink-300 first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6";
const td = "px-3 py-3 whitespace-nowrap first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6";

/**
 * Payments as a table on wide screens and as a stacked list on phones.
 * `compact` drops the columns that do not fit a narrow panel.
 */
export function PaymentsTable({ payments, compact = false }: { payments: Payment[]; compact?: boolean }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-line-100">
              <th scope="col" className={th}>When</th>
              <th scope="col" className={th}>Status</th>
              {compact ? null : <th scope="col" className={th}>Paid with</th>}
              <th scope="col" className={th}>You receive</th>
              <th scope="col" className={th}>From site</th>
              {compact ? null : <th scope="col" className={th}>Deposit address</th>}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => {
              const status = statusLabel(payment.status);
              return (
                <tr key={`${payment.depositAddress}:${index}`} className="border-b border-line-100 last:border-0 hover:bg-surface-300/50">
                  <td className={`${td} u-num text-ink-200`}>{formatWhen(payment.createdAt)}</td>
                  <td className={td}>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                  {compact ? null : (
                    <td className={`${td} text-ink-100`}>{formatTokenAmount(payment.amountIn, payment.originAsset)}</td>
                  )}
                  <td className={`${td} text-ink-100`}>{formatTokenAmount(payment.amountOut, payment.destinationAsset)}</td>
                  <td className={`${td} text-ink-200`}>{site(payment.origin)}</td>
                  {compact ? null : (
                    <td className={`${td} font-mono text-xs text-ink-200`} title={payment.depositAddress}>
                      {shorten(payment.depositAddress, 14)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="border-t border-line-100 md:hidden">
        {payments.map((payment, index) => {
          const status = statusLabel(payment.status);
          return (
            <li key={`${payment.depositAddress}:${index}`} className="flex flex-col gap-1.5 border-b border-line-100 px-5 py-3.5 last:border-0">
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-sm font-medium text-ink-100">
                  {formatTokenAmount(payment.amountOut, payment.destinationAsset)}
                </span>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
              <div className="text-xs leading-5 text-ink-300">
                Paid with {formatTokenAmount(payment.amountIn, payment.originAsset)}
              </div>
              <div className="flex flex-wrap justify-between gap-x-3 text-xs leading-5 text-ink-300">
                <span className="u-num">{formatWhen(payment.createdAt)}</span>
                <span className="min-w-0 truncate">{site(payment.origin)}</span>
              </div>
              <div className="font-mono text-xs text-ink-300" title={payment.depositAddress}>
                {shorten(payment.depositAddress, 14)}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
