import { data } from "../data";
import type { EventItem } from "../types";
import { eventTag, mailtoLink, sectionHeading } from "./shared";

/** Opens the event that the URL hash points to (#event-<id>), so the card links land on an open panel. */
function openFromHash(): void {
  try {
    const target = document.getElementById(location.hash.slice(1));
    if (target instanceof HTMLDetailsElement) target.open = true;
  } catch (e) {
    console.error(":::::openFromHash:::::", e);
  }
}

/** Builds the "How to submit" block with a prefilled email button; empty for events without a submission. */
function submissionBlock(event: EventItem): string {
  try {
    if (!event.submission.required) return "";
    const { ui, submissions, site } = data;
    const href = mailtoLink(submissions.email, `${site.name} ${site.year} - ${event.name}`, submissions.mailBody);
    const deadline = event.submission.deadline
      ? `<p><span class="text-muted">${ui.deadlineLabel}:</span> <strong>${event.submission.deadline}</strong></p>`
      : "";
    const format = event.submission.format ? `<p>${event.submission.format}</p>` : "";
    return `
      <div class="frame rounded-md bg-page p-6">
        <h4 class="font-display text-xs font-bold uppercase tracking-widest text-primary">${ui.submitLabel}</h4>
        <div class="mt-3 space-y-2 text-lg">${deadline}${format}</div>
        <a href="${href}" class="mt-4 inline-block rounded-md bg-primary px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-on-primary hover:opacity-90">${ui.mailButton}</a>
        <p class="mt-2 text-sm text-muted">${submissions.email}</p>
      </div>`;
  } catch (e) {
    console.error(":::::submissionBlock:::::", e);
    return "";
  }
}

/** Fills the event details section: one expandable panel per event with facts, rules and the submission block. */
export function renderEventDetails(): void {
  try {
    const root = document.getElementById("event-details");
    if (!root) return;
    const { events, sections, ui } = data;
    const panels = events
      .map((e) => {
        const facts = e.facts.length
          ? `<dl class="grid gap-x-8 gap-y-2 sm:grid-cols-2">${e.facts
              .map(
                (f) =>
                  `<div><dt class="font-display text-xs font-bold uppercase tracking-widest text-primary">${f.label}</dt><dd class="text-lg">${f.value}</dd></div>`,
              )
              .join("")}</dl>`
          : "";
        const rules = e.rules.map((r) => `<li>${r}</li>`).join("");
        return `
          <details id="event-${e.id}" class="group scroll-mt-24 rounded-md border border-accent bg-surface">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
              <span class="flex flex-wrap items-center gap-3">
                <span class="font-heading text-3xl font-bold leading-tight">${e.name}</span>
                ${eventTag(e.mode)}
              </span>
              <span class="text-2xl text-primary transition-transform group-open:rotate-180" aria-hidden="true">&#9662;</span>
            </summary>
            <div class="space-y-6 border-t border-line p-5">
              <p class="text-xl leading-relaxed">${e.description}</p>
              ${facts}
              <div>
                <h4 class="font-display text-xs font-bold uppercase tracking-widest text-primary">${ui.rulesLabel}</h4>
                <ol class="mt-3 list-decimal space-y-2 pl-6 text-lg marker:font-display marker:text-primary">${rules}</ol>
              </div>
              ${submissionBlock(e)}
            </div>
          </details>`;
      })
      .join("");

    root.innerHTML = `
      <div class="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <div class="text-center">
          ${sectionHeading("IV", sections.details.label, sections.details.title)}
          <p class="text-xl leading-relaxed text-muted">${sections.details.intro ?? ""}</p>
        </div>
        <div class="mt-10 space-y-4">${panels}</div>
      </div>`;

    window.addEventListener("hashchange", openFromHash);
    openFromHash();
  } catch (e) {
    console.error(":::::renderEventDetails:::::", e);
  }
}
