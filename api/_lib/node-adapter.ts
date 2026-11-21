import type { IncomingMessage, ServerResponse } from "node:http";

export type WebHandler = (request: Request) => Promise<Response>;

type NodeRequest = IncomingMessage & { body?: unknown; originalUrl?: string };

/** Reads the request body. Vercel hands over `req.body` already parsed for JSON; the dev server does not, so the stream is read then. */
async function readBody(req: NodeRequest): Promise<string> {
  if (typeof req.body === "string") return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8");
  if (req.body !== undefined && req.body !== null) return JSON.stringify(req.body);
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

/**
 * Runs a fetch-style handler (Request in, Response out) from a plain Node (req, res) function.
 * Used by api/event.ts on Vercel and by the dev server, so both paths behave the same.
 */
export async function runWebHandler(handler: WebHandler, req: NodeRequest, res: ServerResponse): Promise<void> {
  try {
    const method = req.method ?? "GET";
    const headers = new Headers();
    for (const [name, value] of Object.entries(req.headers)) {
      if (name === "content-length" || name === "transfer-encoding") continue;
      if (typeof value === "string") headers.set(name, value);
      else if (Array.isArray(value)) headers.set(name, value.join(", "));
    }
    const body = method === "GET" || method === "HEAD" ? undefined : await readBody(req);
    const request = new Request(`http://${req.headers.host ?? "localhost"}${req.originalUrl ?? req.url ?? "/"}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body }),
    });
    const response = await handler(request);
    res.statusCode = response.status;
    response.headers.forEach((value, name) => res.setHeader(name, value));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (e) {
    console.error(":::::runWebHandler:::::", e);
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Something went wrong. Please try again later." }));
  }
}
