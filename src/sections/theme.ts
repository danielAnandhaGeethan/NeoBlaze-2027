import { data } from "../data";
import { sectionHeading } from "./shared";

/** Fills the Theme section: chapter heading, subtitle, description, connection note and the theme verse in a framed panel. */
export function renderTheme(): void {
  try {
    const root = document.getElementById("theme");
    if (!root) return;
    const { theme } = data;
    const original = theme.translation
      ? `<p class="mt-2 text-3xl text-accent" lang="he" dir="rtl">${theme.translation}</p>`
      : "";

    root.innerHTML = `
      <div class="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
        ${sectionHeading("II", theme.label, theme.title)}
        ${original}
        <p class="font-display text-sm font-bold uppercase tracking-widest text-muted">${theme.subtitle}</p>
        <p class="mt-6 text-xl leading-relaxed">${theme.description}</p>
        <p class="mt-4 text-xl leading-relaxed text-muted">${theme.connection}</p>
        <figure class="frame relative mt-12 rounded-md bg-surface px-6 py-14 sm:px-12">
          <span class="absolute right-6 top-1 font-display text-8xl leading-none text-accent" aria-hidden="true">&rdquo;</span>
          <blockquote class="relative whitespace-pre-line text-2xl italic leading-snug sm:text-4xl">${theme.verse.text}</blockquote>
          <figcaption class="relative mt-6 font-display text-sm font-bold uppercase tracking-widest text-primary">
            ${theme.verse.reference} <span class="text-muted">&middot; ${theme.verse.translation}</span>
          </figcaption>
        </figure>
      </div>`;
  } catch (e) {
    console.error(":::::renderTheme:::::", e);
  }
}
