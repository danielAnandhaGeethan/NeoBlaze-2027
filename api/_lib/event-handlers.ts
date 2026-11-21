import { checkKey } from "./auth.js";
import { HttpError, getStore } from "./store.js";
import { ValidationError, validateContent } from "./validate.js";

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

/** Best-effort limit of 20 requests a minute per address (each server instance counts on its own). */
const hits = new Map<string, number[]>();
function limited(request: Request): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

/** Turns an error into a response; only HttpError messages are shown to the person. */
function failure(name: string, e: unknown): Response {
  if (e instanceof HttpError) return json({ error: e.message }, e.status);
  console.error(`:::::${name}:::::`, e);
  return json({ error: "Something went wrong. Please try again later." }, 500);
}

/** GET /api/event?event=<id>&key=<key>: the event's current editable content and its version. */
export async function GET(request: Request): Promise<Response> {
  try {
    if (limited(request)) return json({ error: "Too many requests. Wait a minute and try again." }, 429);
    const params = new URL(request.url).searchParams;
    const id = params.get("event") ?? "";
    if (checkKey(id, params.get("key") ?? "") === "denied") return json({ error: "This link is not valid." }, 403);
    const store = getStore();
    const stored = await store.read(id);
    return json({ content: stored.content, version: stored.version, mode: store.mode });
  } catch (e) {
    return failure("GET", e);
  }
}

/** POST /api/event: { event, key, version, content, website }; saves the content (as a pull request in production). */
export async function POST(request: Request): Promise<Response> {
  try {
    if (limited(request)) return json({ error: "Too many requests. Wait a minute and try again." }, 429);
    const raw = await request.text();
    if (raw.length > 20_000) return json({ error: "That is too much text." }, 413);
    const body = JSON.parse(raw) as Record<string, unknown>;
    if (body["website"]) return json({ error: "Could not save." }, 400); // hidden spam-trap field
    const id = String(body["event"] ?? "");
    if (checkKey(id, String(body["key"] ?? "")) === "denied") return json({ error: "This link is not valid." }, 403);

    const store = getStore();
    const current = await store.read(id);
    const content = validateContent(body["content"], current.content.submission.required);
    const reference = await store.save(id, content, String(body["version"] ?? ""));
    return json({ ok: true, reference, mode: store.mode });
  } catch (e) {
    if (e instanceof SyntaxError) return json({ error: "Could not read your changes." }, 400);
    if (e instanceof ValidationError) return json({ error: e.message }, 400);
    return failure("POST", e);
  }
}
