import type { IncomingMessage, ServerResponse } from "node:http";
import { GET, POST } from "./_lib/event-handlers";
import { runWebHandler } from "./_lib/node-adapter";

/** Vercel entry point for /api/event: a plain Node (req, res) function that runs the GET and POST handlers. */
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method === "GET") return runWebHandler(GET, req, res);
  if (req.method === "POST") return runWebHandler(POST, req, res);
  res.statusCode = 405;
  res.setHeader("allow", "GET, POST");
  res.end("Method not allowed");
}
