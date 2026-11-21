import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Checks an event key against the hashes in the EDITOR_KEY_HASHES environment variable ({"quiz":"<sha256 hex>", ...}).
 * Without that variable the key check is skipped only when running locally (never on Vercel).
 */
export function checkKey(eventId: string, key: string): "ok" | "local" | "denied" {
  if (!/^[a-z0-9-]{1,40}$/.test(eventId)) return "denied";
  const raw = process.env["EDITOR_KEY_HASHES"];
  if (!raw) return process.env["VERCEL"] ? "denied" : "local";
  let expected: string | undefined;
  try {
    expected = (JSON.parse(raw) as Record<string, string>)[eventId];
  } catch (e) {
    console.error(":::::checkKey:::::", e);
    return "denied";
  }
  if (!expected || key.length < 16) return "denied";
  const actual = createHash("sha256").update(key).digest("hex");
  if (actual.length !== expected.length) return "denied";
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected)) ? "ok" : "denied";
}
