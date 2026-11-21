// Creates one random key per event. Run: node scripts/make-keys.mjs
// - The keys are printed once: send each in-charge their own link, and do not commit them.
// - The hashes go into the EDITOR_KEY_HASHES environment variable on Vercel. Only hashes are ever stored.
import { createHash, randomBytes } from "node:crypto";
import { readdirSync } from "node:fs";

const ids = readdirSync(new URL("../src/content/events/", import.meta.url))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(".json", ""));

const hashes = {};
console.log("Event links (replace <site> with your website address):\n");
for (const id of ids) {
  const key = randomBytes(24).toString("base64url");
  hashes[id] = createHash("sha256").update(key).digest("hex");
  console.log(`${id.padEnd(20)} https://<site>/edit/?event=${id}&key=${key}`);
}
console.log("\nEDITOR_KEY_HASHES (paste as one line into Vercel):\n");
console.log(JSON.stringify(hashes));
