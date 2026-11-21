import { data } from "../data";
import { mailtoLink, sectionHeading } from "./shared";

/** Fills the Contact section: venue with map link, organisers with tap-to-call, and the submissions email. */
export function renderContacts(): void {
  try {
    const root = document.getElementById("contacts");
    if (!root) return;
    const { contacts, sections, ui, eventInfo, hero, submissions } = data;
    const people = contacts.list
      .map(
        (c) => `
          <li class="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0">
            <span class="text-xl">${c.name}${c.role ? ` <span class="text-sm text-muted">${c.role}</span>` : ""}</span>
            <a href="tel:${c.phone}" class="font-display text-sm font-bold tracking-widest text-primary hover:underline">${c.phone}</a>
          </li>`,
      )
      .join("");

    root.innerHTML = `
      <div class="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <div class="mx-auto max-w-3xl text-center">
          ${sectionHeading("VII", sections.contacts.label, sections.contacts.title)}
          <p class="text-xl leading-relaxed text-muted">${sections.contacts.intro ?? ""}</p>
        </div>
        <div class="mt-10 grid gap-6 text-left md:grid-cols-2">
          <div class="frame rounded-md bg-page p-6 sm:p-8">
            <h3 class="font-display text-xs font-bold uppercase tracking-widest text-primary">${ui.venueLabel}</h3>
            <p class="mt-3 text-2xl font-semibold leading-snug">${eventInfo.venue}</p>
            <p class="mt-2 text-lg text-muted">${eventInfo.address}</p>
            <a href="${eventInfo.mapLink}" target="_blank" rel="noopener noreferrer" class="mt-5 inline-block rounded-md border border-accent bg-surface px-6 py-3 font-display text-sm font-bold uppercase tracking-wider hover:border-primary">${hero.buttons.map}</a>
          </div>
          <div class="frame rounded-md bg-page p-6 sm:p-8">
            <h3 class="font-display text-xs font-bold uppercase tracking-widest text-primary">${ui.callLabel}</h3>
            <ul class="mt-2">${people}</ul>
          </div>
        </div>
        <div class="frame mt-6 rounded-md bg-page p-6 text-center sm:p-8">
          <h3 class="font-display text-xs font-bold uppercase tracking-widest text-primary">${ui.emailLabel}</h3>
          <p class="mt-3 text-lg text-muted">${submissions.instructions}</p>
          <a href="${mailtoLink(submissions.email)}" class="mt-3 inline-block break-all font-heading text-2xl font-bold text-primary hover:underline sm:text-3xl">${submissions.email}</a>
        </div>
      </div>`;
  } catch (e) {
    console.error(":::::renderContacts:::::", e);
  }
}
