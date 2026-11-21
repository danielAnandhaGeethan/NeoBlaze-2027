import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { EventContent } from "../../src/types";

/** An error whose message is safe to show the in-charge. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export interface Stored {
  content: EventContent;
  /** Identifies the stored version; a save is refused if it changed since the form loaded it. */
  version: string;
}

export interface Store {
  mode: "github" | "local";
  read(id: string): Promise<Stored>;
  /** Saves the content; returns a short reference (the pull request number, or "local"). */
  save(id: string, content: EventContent, version: string): Promise<string>;
}

const filePath = (id: string) => `src/content/events/${id}.json`;
const serialise = (content: EventContent) => JSON.stringify(content, null, 2) + "\n";

/** Dev only: reads and writes the local JSON files so the form can be tested without GitHub. */
const localStore: Store = {
  mode: "local",
  async read(id) {
    try {
      const raw = await readFile(join(process.cwd(), filePath(id)), "utf8");
      return { content: JSON.parse(raw) as EventContent, version: createHash("sha1").update(raw).digest("hex") };
    } catch {
      throw new HttpError(404, "That event was not found.");
    }
  },
  async save(id, content, version) {
    const current = await this.read(id);
    if (current.version !== version) throw new HttpError(409, "This event changed since you opened it. Reload the page and try again.");
    await writeFile(join(process.cwd(), filePath(id)), serialise(content));
    return "local";
  },
};

/** Production: reads from GitHub and saves by opening a pull request, so every change is reviewed. */
function githubStore(token: string, repo: string, base: string): Store {
  const call = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${token}`,
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
        "user-agent": "neoblaze-event-editor",
        "content-type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(":::::githubStore:::::", response.status, path, await response.text());
      throw new HttpError(502, "Could not reach the website storage. Try again in a minute.");
    }
    return (await response.json()) as T;
  };

  const read = async (id: string): Promise<Stored> => {
    const file = await call<{ content: string; sha: string }>(`/contents/${filePath(id)}?ref=${encodeURIComponent(base)}`);
    const raw = Buffer.from(file.content, "base64").toString("utf8");
    return { content: JSON.parse(raw) as EventContent, version: file.sha };
  };

  return {
    mode: "github",
    read,
    async save(id, content, version) {
      const current = await read(id);
      if (current.version !== version) throw new HttpError(409, "This event changed since you opened it. Reload the page and try again.");

      const open = await call<{ head: { ref: string } }[]>("/pulls?state=open&per_page=100");
      if (open.some((pr) => pr.head.ref.startsWith(`content/${id}-`))) {
        throw new HttpError(409, "An earlier change to this event is still waiting for review. Try again after it is approved.");
      }

      const baseRef = await call<{ object: { sha: string } }>(`/git/ref/heads/${encodeURIComponent(base)}`);
      const branch = `content/${id}-${Date.now().toString(36)}`;
      await call("/git/refs", { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseRef.object.sha }) });
      await call(`/contents/${filePath(id)}`, {
        method: "PUT",
        body: JSON.stringify({
          message: `Update ${id} content via the event editor`,
          content: Buffer.from(serialise(content)).toString("base64"),
          sha: current.version,
          branch,
        }),
      });
      const pr = await call<{ number: number }>("/pulls", {
        method: "POST",
        body: JSON.stringify({
          title: `Event edit: ${id}`,
          head: branch,
          base,
          body: `Submitted through the event editor form for \`${id}\`. Review the change to \`${filePath(id)}\`, then merge to publish.`,
        }),
      });
      return String(pr.number);
    },
  };
}

/** Picks GitHub when configured; the local files only outside Vercel. */
export function getStore(): Store {
  const token = process.env["GITHUB_TOKEN"];
  const repo = process.env["GITHUB_REPO"];
  if (token && repo) return githubStore(token, repo, process.env["GITHUB_BASE_BRANCH"] ?? "main");
  if (!process.env["VERCEL"]) return localStore;
  throw new HttpError(500, "The editor is not set up yet. Please tell the organisers.");
}
