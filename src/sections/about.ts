import { data } from "../data";
import { sectionHeading } from "./shared";

/** Fills the About section: chapter heading, paragraphs with a drop cap, what to expect, age group and the motto card. */
export function renderAbout(): void {
  try {
    const root = document.getElementById("about");
    if (!root) return;
    const { about } = data;
    const paragraphs = about.paragraphs
      .map((text, i) => `<p class="${i === 0 ? "dropcap " : ""}mt-6 text-left text-xl leading-relaxed">${text}</p>`)
      .join("");
    const expectations = about.expectations
      .map(
        (text) => `
          <li class="flex gap-3"><span class="mt-1 text-primary" aria-hidden="true">&#10013;</span><span>${text}</span></li>`,
      )
      .join("");

    root.innerHTML = `
      <div class="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
        ${sectionHeading("I", about.label, about.title)}
        ${paragraphs}
        <div class="mt-10 text-left">
          <h3 class="font-display text-sm font-bold uppercase tracking-widest text-primary">${about.expectationsLabel}</h3>
          <ul class="mt-4 grid gap-3 text-lg sm:grid-cols-2">${expectations}</ul>
          <p class="mt-6 font-display text-sm font-bold uppercase tracking-widest">
            <span class="text-muted">${about.ageGroupLabel}:</span> ${about.ageGroup}
          </p>
        </div>
        <blockquote class="frame relative mt-12 rounded-md bg-page px-6 py-12 sm:px-12">
          <span class="absolute left-6 top-1 font-display text-8xl leading-none text-accent" aria-hidden="true">&ldquo;</span>
          <p class="relative font-display text-xs font-bold uppercase tracking-[0.25em] text-muted">${about.mottoLabel}</p>
          <p class="relative mt-3 font-heading text-3xl font-bold leading-tight text-primary sm:text-4xl">${about.motto}</p>
        </blockquote>
      </div>`;
  } catch (e) {
    console.error(":::::renderAbout:::::", e);
  }
}
