// Rules for an app's allowed websites. The API applies the same rules
// (uniport-backend, src/apps.ts: normaliseAllowedOrigin); keep them in step.

import { UserError } from "./errors";

// Domains under which anyone can register a site. A wildcard over one of these
// would allow other people's websites.
const SHARED_DOMAINS = new Set([
  "vercel.app", "netlify.app", "pages.dev", "workers.dev", "github.io", "gitlab.io",
  "web.app", "firebaseapp.com", "herokuapp.com", "onrender.com", "railway.app", "fly.dev",
  "azurewebsites.net", "cloudfront.net", "amazonaws.com", "appspot.com", "surge.sh",
  "glitch.me", "replit.app", "ngrok.io", "ngrok-free.app", "co.uk", "com.au", "co.jp",
  "com.br", "co.in", "co.nz", "co.za", "com.mx", "com.sg", "com.tr", "com.cn",
]);

/**
 * Checks one allowed-origin entry and returns it in the form the API compares
 * against: an exact origin (https://shop.example.com) or a subdomain wildcard
 * (https://*.example.com). Throws with a message for the developer otherwise.
 */
export function normaliseAllowedOrigin(entry: string): string {
  const value = entry.trim();
  if (value.length > 255) throw new UserError(`"${value.slice(0, 40)}…" is too long for a website address.`);
  const wildcard = value.match(/^(https?):\/\/\*\.([^/*:]+)\/?$/i);
  if (wildcard) {
    const domain = wildcard[2].toLowerCase().replace(/\.$/, "");
    const labels = domain.split(".");
    if (labels.some((label) => /[^\x00-\x7f]/.test(label))) {
      throw new UserError(`"${value}" has letters outside a–z. Write the domain in its xn-- form for a wildcard.`);
    }
    if (labels.length < 2 || /^\d+$/.test(labels[labels.length - 1]) || labels.some((label) => !/^[a-z0-9-]+$/.test(label))) {
      throw new UserError(`"${value}" is too broad: a wildcard needs a domain you own, such as https://*.example.com.`);
    }
    if (SHARED_DOMAINS.has(domain)) {
      throw new UserError(`"${value}" would allow other people's sites on ${domain}. List your own sites one by one.`);
    }
    return `${wildcard[1].toLowerCase()}://*.${domain}`;
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new UserError(`"${value}" is not a website address. Use one like https://shop.example.com.`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UserError(`"${value}" must start with https:// or http://.`);
  }
  if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
    throw new UserError(`"${value}" should be just the site, with no path: ${url.origin}.`);
  }
  if (value.includes("*")) {
    throw new UserError(`"${value}" is not a supported wildcard. Use the form https://*.example.com.`);
  }
  if (url.hostname.endsWith(".")) {
    throw new UserError(`"${value}" ends with a dot. Remove it.`);
  }
  if (["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.hostname.endsWith(".localhost")) {
    throw new UserError("localhost is covered by the \"Allow localhost\" setting; there is no need to list it.");
  }
  return url.origin;
}

/** Parses a textarea of sites, one per line (commas also work), into checked, de-duplicated origins. */
export function parseAllowedOrigins(text: string): string[] {
  const entries = text
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (entries.length > 20) throw new UserError("An app can have at most 20 allowed sites.");
  return [...new Set(entries.map(normaliseAllowedOrigin))];
}

/** Parses a textarea of recipient addresses, one per line. Empty means any recipient. */
export function parseRecipients(text: string): string[] | null {
  const entries = text
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (entries.length === 0) return null;
  if (entries.length > 20) throw new UserError("An app can have at most 20 recipient addresses.");
  for (const entry of entries) {
    if (entry.length > 128 || /\s/.test(entry)) throw new UserError(`"${entry.slice(0, 40)}" does not look like an address.`);
  }
  return [...new Set(entries)];
}
