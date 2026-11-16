import "server-only";
import { db } from "@/lib/db";
import { generateAppId } from "@/lib/app-id";

// Every function here takes the signed-in user's id first and only ever
// touches that user's apps: each query filters on owner_user_id.

export const MAX_APPS_PER_USER = 10;

export type AppSummary = {
  id: string;
  name: string;
  publicId: string | null;
  allowedOrigins: string[];
  createdAt: string;
  payments30d: number;
};

export type AppDetail = AppSummary & {
  allowLocalhost: boolean;
  recipientAllowlist: string[] | null;
};

export type Payment = {
  depositAddress: string;
  status: string | null;
  swapType: string;
  originAsset: string;
  destinationAsset: string;
  amountIn: string | null;
  amountOut: string | null;
  amountOutUsd: string | null;
  recipient: string;
  origin: string | null;
  destinationTxHashes: string[] | null;
  createdAt: string;
};

/** Last-30-day counts and volume, plus whether the app has ever had a payment. */
export type Summary = { payments: number; succeeded: number; volumeUsd: number; everUsed: boolean };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function secret(): string {
  const value = process.env.APP_ID_HMAC_SECRET;
  if (!value) throw new Error("APP_ID_HMAC_SECRET is not set");
  return value;
}

type AppRow = {
  id: string;
  name: string;
  public_id: string | null;
  allowed_origins: string[] | null;
  allow_localhost: boolean;
  recipient_allowlist: string[] | null;
  created_at: string;
  payments_30d: string | number;
};

function toDetail(row: AppRow): AppDetail {
  return {
    id: row.id,
    name: row.name,
    publicId: row.public_id,
    allowedOrigins: row.allowed_origins ?? [],
    allowLocalhost: row.allow_localhost,
    recipientAllowlist: row.recipient_allowlist,
    createdAt: row.created_at,
    payments30d: Number(row.payments_30d),
  };
}

const APP_COLUMNS = `
  a.id, a.name, a.allow_localhost, a.created_at,
  to_jsonb(a.allowed_origins) AS allowed_origins,
  to_jsonb(a.recipient_allowlist) AS recipient_allowlist,
  (SELECT i.id FROM app_ids i WHERE i.app_id = a.id AND i.disabled_at IS NULL
   ORDER BY i.created_at DESC LIMIT 1) AS public_id,
  (SELECT count(*) FROM quotes q WHERE q.app_id = a.id
   AND q.created_at > now() - interval '30 days') AS payments_30d`;

export async function listApps(userId: string): Promise<AppDetail[]> {
  const rows = (await db().query(
    `SELECT ${APP_COLUMNS} FROM apps a
     WHERE a.owner_user_id = $1 AND a.status = 'active' ORDER BY a.created_at`,
    [userId],
  )) as AppRow[];
  return rows.map(toDetail);
}

export async function getApp(userId: string, appId: string): Promise<AppDetail | null> {
  if (!UUID.test(appId)) return null;
  const rows = (await db().query(
    `SELECT ${APP_COLUMNS} FROM apps a
     WHERE a.owner_user_id = $1 AND a.id = $2::uuid AND a.status = 'active'`,
    [userId, appId],
  )) as AppRow[];
  return rows[0] ? toDetail(rows[0]) : null;
}

/** Creates an app with its first App ID. Returns the new app's id. */
export async function createApp(userId: string, name: string, allowedOrigins: string[]): Promise<string> {
  const sql = db();
  const existing = (await sql.query(
    `SELECT count(*) AS n FROM apps WHERE owner_user_id = $1 AND status = 'active'`,
    [userId],
  )) as { n: string }[];
  if (Number(existing[0].n) >= MAX_APPS_PER_USER) {
    throw new Error(`You can have up to ${MAX_APPS_PER_USER} apps. Delete one to add another.`);
  }
  const id = crypto.randomUUID();
  const publicId = await generateAppId(secret());
  await sql.transaction([
    sql.query(
      `INSERT INTO apps (id, owner_user_id, name, allowed_origins) VALUES ($1::uuid, $2, $3, $4::text[])`,
      [id, userId, name, allowedOrigins],
    ),
    sql.query(`INSERT INTO app_ids (id, app_id) VALUES ($1, $2::uuid)`, [publicId, id]),
  ]);
  return id;
}

/** Renames an app. */
export async function renameApp(userId: string, appId: string, name: string): Promise<boolean> {
  if (!UUID.test(appId)) return false;
  const rows = (await db().query(
    `UPDATE apps SET name = $3, updated_at = now()
     WHERE owner_user_id = $1 AND id = $2::uuid AND status = 'active' RETURNING id`,
    [userId, appId, name],
  )) as { id: string }[];
  return rows.length > 0;
}

/** Sets which websites may use the app's App ID in a browser. */
export async function setAllowedWebsites(
  userId: string,
  appId: string,
  allowedOrigins: string[],
  allowLocalhost: boolean,
): Promise<boolean> {
  if (!UUID.test(appId)) return false;
  const rows = (await db().query(
    `UPDATE apps SET allowed_origins = $3::text[], allow_localhost = $4, updated_at = now()
     WHERE owner_user_id = $1 AND id = $2::uuid AND status = 'active' RETURNING id`,
    [userId, appId, allowedOrigins, allowLocalhost],
  )) as { id: string }[];
  return rows.length > 0;
}

/** Sets the addresses the app may pay out to. Null means any recipient. */
export async function setRecipients(userId: string, appId: string, recipientAllowlist: string[] | null): Promise<boolean> {
  if (!UUID.test(appId)) return false;
  const rows = (await db().query(
    `UPDATE apps SET recipient_allowlist = $3::text[], updated_at = now()
     WHERE owner_user_id = $1 AND id = $2::uuid AND status = 'active' RETURNING id`,
    [userId, appId, recipientAllowlist],
  )) as { id: string }[];
  return rows.length > 0;
}

/** Replaces the app's App ID. The old one stops working within about a minute. */
export async function rotateAppId(userId: string, appId: string): Promise<string | null> {
  if (!(await getApp(userId, appId))) return null;
  const sql = db();
  const publicId = await generateAppId(secret());
  await sql.transaction([
    sql.query(`UPDATE app_ids SET disabled_at = now() WHERE app_id = $1::uuid AND disabled_at IS NULL`, [appId]),
    sql.query(`INSERT INTO app_ids (id, app_id) VALUES ($1, $2::uuid)`, [publicId, appId]),
  ]);
  return publicId;
}

/** Deletes an app: its App IDs stop working and it leaves the list. Its payments are kept. */
export async function deleteApp(userId: string, appId: string): Promise<boolean> {
  if (!(await getApp(userId, appId))) return false;
  const sql = db();
  await sql.transaction([
    sql.query(`UPDATE apps SET status = 'deleted', updated_at = now() WHERE id = $1::uuid`, [appId]),
    sql.query(`UPDATE app_ids SET disabled_at = now() WHERE app_id = $1::uuid AND disabled_at IS NULL`, [appId]),
  ]);
  return true;
}

type PaymentRow = {
  deposit_address: string;
  status: string | null;
  swap_type: string;
  origin_asset: string;
  destination_asset: string;
  amount_in: string | null;
  amount_out: string | null;
  amount_out_usd: string | null;
  recipient: string;
  origin: string | null;
  destination_tx_hashes: string[] | null;
  created_at: string;
};

/** The app's most recent quotes that a payer was given a deposit address for. */
export async function listPayments(userId: string, appId: string, limit = 50): Promise<Payment[]> {
  if (!UUID.test(appId)) return [];
  const rows = (await db().query(
    `SELECT q.deposit_address, q.status, q.swap_type, q.origin_asset, q.destination_asset,
            q.amount_in, q.amount_out, q.amount_out_usd, q.recipient, q.origin,
            q.destination_tx_hashes, q.created_at
     FROM quotes q JOIN apps a ON a.id = q.app_id
     WHERE a.owner_user_id = $1 AND a.id = $2::uuid
     ORDER BY q.created_at DESC LIMIT $3`,
    [userId, appId, limit],
  )) as PaymentRow[];
  return rows.map((row) => ({
    depositAddress: row.deposit_address,
    status: row.status,
    swapType: row.swap_type,
    originAsset: row.origin_asset,
    destinationAsset: row.destination_asset,
    amountIn: row.amount_in,
    amountOut: row.amount_out,
    amountOutUsd: row.amount_out_usd,
    recipient: row.recipient,
    origin: row.origin,
    destinationTxHashes: row.destination_tx_hashes,
    createdAt: row.created_at,
  }));
}

/** Counts and USD volume for the app over the last 30 days, and whether it has had any payment at all. */
export async function getSummary(userId: string, appId: string): Promise<Summary> {
  if (!UUID.test(appId)) return { payments: 0, succeeded: 0, volumeUsd: 0, everUsed: false };
  const rows = (await db().query(
    `SELECT count(*) FILTER (WHERE q.created_at > now() - interval '30 days') AS payments,
            count(*) FILTER (WHERE q.status = 'SUCCESS' AND q.created_at > now() - interval '30 days') AS succeeded,
            coalesce(sum(q.amount_out_usd::numeric) FILTER (
              WHERE q.status = 'SUCCESS' AND q.created_at > now() - interval '30 days'
                AND q.amount_out_usd ~ '^[0-9]+(\\.[0-9]+)?$'), 0) AS volume_usd,
            count(*) AS total
     FROM quotes q JOIN apps a ON a.id = q.app_id
     WHERE a.owner_user_id = $1 AND a.id = $2::uuid`,
    [userId, appId],
  )) as { payments: string; succeeded: string; volume_usd: string; total: string }[];
  const row = rows[0];
  return {
    payments: Number(row.payments),
    succeeded: Number(row.succeeded),
    volumeUsd: Number(row.volume_usd),
    everUsed: Number(row.total) > 0,
  };
}
