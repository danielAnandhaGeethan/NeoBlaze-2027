import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

/** Dev only: runs api/event.ts inside the dev server, so the editor form works locally without Vercel (saves to the local JSON files). */
function devApi(): Plugin {
  return {
    name: "dev-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/event", async (req, res) => {
        try {
          const method = req.method ?? "GET";
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const request = new Request(`http://localhost${req.originalUrl ?? req.url ?? ""}`, {
            method,
            headers: req.headers as Record<string, string>,
            ...(method === "GET" || method === "HEAD" ? {} : { body: Buffer.concat(chunks) }),
          });
          const handlers = (await server.ssrLoadModule("/api/event.ts")) as Record<string, (r: Request) => Promise<Response>>;
          const handler = handlers[method];
          const response = handler ? await handler(request) : new Response("Method not allowed", { status: 405 });
          res.statusCode = response.status;
          response.headers.forEach((value, name) => res.setHeader(name, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (e) {
          console.error(":::::devApi:::::", e);
          res.statusCode = 500;
          res.end("Dev API error");
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), devApi()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        edit: fileURLToPath(new URL("./edit/index.html", import.meta.url)),
      },
    },
  },
});
