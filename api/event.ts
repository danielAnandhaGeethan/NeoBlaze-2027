import type { IncomingMessage, ServerResponse } from "node:http";

/** TEMPORARY diagnostic version: loads the handlers lazily so a load failure is reported instead of crashing. */
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const { GET, POST } = await import("./_lib/event-handlers.js");
    const { runWebHandler } = await import("./_lib/node-adapter.js");
    if (req.method === "GET") return await runWebHandler(GET, req, res);
    if (req.method === "POST") return await runWebHandler(POST, req, res);
    res.statusCode = 405;
    res.setHeader("allow", "GET, POST");
    res.end("Method not allowed");
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ diagnostic: String(e), stack: String((e as Error).stack).split("\n").slice(0, 5), node: process.version }));
  }
}
