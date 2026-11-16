import { getTokenByAssetId } from "uniport-sdk/core";

/** "5 USDC on Base" for an amount in a token's smallest units; falls back to the raw values. */
export function formatTokenAmount(amount: string | null, assetId: string): string {
  const token = getTokenByAssetId(assetId);
  if (!token) return amount ? `${amount} of ${shorten(assetId, 14)}` : shorten(assetId, 20);
  const label = `${token.symbol} on ${chainName(token.chain)}`;
  if (!amount || !/^\d+$/.test(amount)) return label;
  return `${trim(fromSmallestUnits(amount, token.decimals))} ${label}`;
}

function fromSmallestUnits(amount: string, decimals: number): string {
  const padded = amount.padStart(decimals + 1, "0");
  const whole = padded.slice(0, padded.length - decimals);
  const fraction = decimals > 0 ? padded.slice(-decimals).replace(/0+$/, "") : "";
  return fraction ? `${whole}.${fraction}` : whole;
}

/** Keeps at most six decimal places, for display only. */
function trim(value: string): string {
  const [whole, fraction = ""] = value.split(".");
  const short = fraction.slice(0, 6).replace(/0+$/, "");
  return short ? `${whole}.${short}` : whole;
}

function chainName(chain: string): string {
  const names: Record<string, string> = { eth: "Ethereum", arb: "Arbitrum", op: "Optimism", pol: "Polygon", bsc: "BNB Chain", avax: "Avalanche", sol: "Solana", btc: "Bitcoin" };
  return names[chain] ?? chain.charAt(0).toUpperCase() + chain.slice(1);
}

export function shorten(value: string, keep = 10): string {
  return value.length <= keep + 4 ? value : `${value.slice(0, keep - 4)}…${value.slice(-4)}`;
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short",
  }).format(date);
}

const STATUS: Record<string, { label: string; variant: "neutral" | "success" | "warning" | "accent" }> = {
  PENDING_DEPOSIT: { label: "Waiting for payment", variant: "neutral" },
  KNOWN_DEPOSIT_TX: { label: "Payment seen", variant: "accent" },
  PROCESSING: { label: "Processing", variant: "accent" },
  SUCCESS: { label: "Paid", variant: "success" },
  INCOMPLETE_DEPOSIT: { label: "Underpaid", variant: "warning" },
  REFUNDED: { label: "Refunded", variant: "warning" },
  FAILED: { label: "Failed", variant: "warning" },
};

/** A payment's status in plain words. A quote nobody has checked on yet has no status. */
export function statusLabel(status: string | null) {
  if (!status) return { label: "Waiting for payment", variant: "neutral" as const };
  return STATUS[status] ?? { label: status, variant: "neutral" as const };
}
