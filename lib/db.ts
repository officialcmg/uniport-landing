import "server-only";
import { neon } from "@neondatabase/serverless";

/**
 * The Neon database the API also writes to. The dashboard connects with its
 * own role, which can change apps and only read payments.
 */
export function db() {
  const url = process.env.DASHBOARD_DATABASE_URL;
  if (!url) throw new Error("DASHBOARD_DATABASE_URL is not set");
  return neon(url);
}
