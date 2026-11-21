import { data } from "../data";
import type { EventMode } from "../types";

const escapes: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapes text for use inside HTML, so text typed into the editor form can never inject markup. */
export function esc(text: string): string {
  return text.replace(/[&<>"']/g, (c) => escapes[c] ?? c);
}

/** Flame and cross divider; pass a justify-* class to align it. */
export function ornament(align = "justify-center"): string {
  const flame = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z"/></svg>`;
  const cross = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2h2v6h6v2h-6v12h-2V10H5V8h6z"/></svg>`;
  return `<div class="my-6 flex items-center gap-3 text-accent ${align}" aria-hidden="true">${flame}<span class="h-px w-12 bg-current"></span>${cross}<span class="h-px w-12 bg-current"></span>${flame}</div>`;
}

/** Chapter numeral and label above a large section title, followed by the divider; every section uses it so headings stay identical. */
export function sectionHeading(numeral: string, label: string, title: string): string {
  return `
    <p class="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">${numeral}. ${label}</p>
    <h2 class="mt-3 text-4xl font-bold leading-tight sm:text-5xl">${title}</h2>
    ${ornament()}`;
}

/** Sapphire "Online" or gold "On-site" tag; the wording comes from data.tagLabels. */
export function eventTag(mode: EventMode): string {
  const colours = mode === "online" ? "bg-tag-online text-on-tag-online" : "bg-tag-offline text-on-tag-offline";
  return `<span class="inline-block rounded-sm px-3 py-1 font-display text-[11px] font-bold uppercase tracking-widest ${colours}">${data.tagLabels[mode]}</span>`;
}

/** mailto: link with an optional prefilled subject and body. */
export function mailtoLink(email: string, subject?: string, body?: string): string {
  const query = [subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`]
    .filter(Boolean)
    .join("&");
  return `mailto:${email}${query ? `?${query}` : ""}`;
}
