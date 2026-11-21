import { data } from "../data";
import { sectionHeading } from "./shared";

/** Fills the Schedule section: one vertical timeline per day, with each event line linking to its details when linked. */
export function renderSchedule(): void {
  try {
    const root = document.getElementById("schedule");
    if (!root) return;
    const { schedule, sections } = data;
    const days = schedule
      .map((day) => {
        const items = day.items
          .map((item) => {
            const title = item.eventId
              ? `<a href="#event-${item.eventId}" class="hover:text-primary hover:underline">${item.title}</a>`
              : item.title;
            const venue = item.venue ? `<p class="text-sm text-muted">${item.venue}</p>` : "";
            return `
              <li class="relative pb-8 pl-8 last:pb-0">
                <span class="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-surface" aria-hidden="true"></span>
                <p class="font-display text-sm font-bold uppercase tracking-widest text-primary">${item.time}</p>
                <p class="text-xl leading-snug">${title}</p>
                ${venue}
              </li>`;
          })
          .join("");
        return `
          <div class="mt-10 text-left">
            <h3 class="font-heading text-3xl font-bold leading-tight">${day.day}</h3>
            <p class="font-display text-xs font-bold uppercase tracking-widest text-muted">${day.date}</p>
            <ol class="mt-6 border-l-2 border-accent">${items}</ol>
          </div>`;
      })
      .join("");

    root.innerHTML = `
      <div class="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
        ${sectionHeading("V", sections.schedule.label, sections.schedule.title)}
        ${days}
      </div>`;
  } catch (e) {
    console.error(":::::renderSchedule:::::", e);
  }
}
