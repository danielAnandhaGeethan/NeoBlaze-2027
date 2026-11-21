import { data } from "../data";
import type { EventMode } from "../types";
import { eventTag, sectionHeading } from "./shared";

type Filter = EventMode | "all";

const chipBase =
  "rounded-sm border px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-colors";
const chipOn = "border-primary bg-primary text-on-primary";
const chipOff = "border-accent bg-page hover:border-primary";

/** Shows only the cards of one mode (or all) and marks the active filter chip. */
function setEventFilter(filter: Filter): void {
  try {
    document.querySelectorAll<HTMLElement>("[data-event-card]").forEach((card) => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset["mode"] !== filter);
    });
    document.querySelectorAll<HTMLElement>("[data-filter]").forEach((chip) => {
      const active = chip.dataset["filter"] === filter;
      chip.setAttribute("aria-pressed", String(active));
      chip.className = `${chipBase} ${active ? chipOn : chipOff}`;
    });
  } catch (e) {
    console.error(":::::setEventFilter:::::", e);
  }
}

/** Fills the Events section: heading, intro, filter chips and one card per event. */
export function renderEvents(): void {
  try {
    const root = document.getElementById("events");
    if (!root) return;
    const { events, sections, ui, tagLabels } = data;
    const modes: EventMode[] = ["offline", "online"];
    const count = (mode: Filter) => (mode === "all" ? events.length : events.filter((e) => e.mode === mode).length);
    const chips = (["all", ...modes] as Filter[])
      .map((mode) => {
        const label = mode === "all" ? ui.filterAll : tagLabels[mode];
        return `<button type="button" data-filter="${mode}" aria-pressed="false" class="${chipBase} ${chipOff}">${label} (${count(mode)})</button>`;
      })
      .join("");
    const cards = events
      .map(
        (e) => `
          <li data-event-card data-mode="${e.mode}">
            <article class="flex h-full flex-col rounded-md border border-accent bg-page p-6 motion-safe:transition motion-safe:hover:-translate-y-1 hover:border-primary">
              <div>${eventTag(e.mode)}</div>
              <h3 class="mt-4 font-heading text-3xl font-bold leading-tight">${e.name}</h3>
              <p class="mt-2 text-lg leading-snug">${e.tagline}</p>
              <blockquote class="mt-4 border-t border-line pt-4 italic text-muted">
                ${e.bible.text}
                <cite class="mt-1 block font-display text-xs font-bold not-italic uppercase tracking-widest text-primary">${e.bible.reference}</cite>
              </blockquote>
              <a href="#event-${e.id}" class="mt-auto pt-5 font-display text-xs font-bold uppercase tracking-widest text-primary hover:underline">${ui.cardCta} &rarr;</a>
            </article>
          </li>`,
      )
      .join("");

    root.innerHTML = `
      <div class="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div class="mx-auto max-w-3xl text-center">
          ${sectionHeading("III", sections.events.label, sections.events.title)}
          <p class="text-xl leading-relaxed text-muted">${sections.events.intro ?? ""}</p>
        </div>
        <div class="mt-8 flex flex-wrap justify-center gap-3" role="group">${chips}</div>
        <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${cards}</ul>
      </div>`;

    root.querySelectorAll<HTMLElement>("[data-filter]").forEach((chip) => {
      chip.addEventListener("click", () => setEventFilter(chip.dataset["filter"] as Filter));
    });
    setEventFilter("all");
  } catch (e) {
    console.error(":::::renderEvents:::::", e);
  }
}
