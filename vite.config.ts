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
          const mod = (await server.ssrLoadModule("/api/event.ts")) as { default: (r: typeof req, s: typeof res) => Promise<void> };
          await mod.default(req, res);
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
