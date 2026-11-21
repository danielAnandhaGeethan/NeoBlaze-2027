import { data } from "../data";
import { sectionHeading } from "./shared";

/** Fills the General rules section: a framed list of rules and the final note. */
export function renderGeneralRules(): void {
  try {
    const root = document.getElementById("general-rules");
    if (!root) return;
    const { generalRules, sections } = data;
    const rows = generalRules.items
      .map(
        (item) => `
          <div class="border-b border-line py-4 last:border-0 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt class="font-display text-xs font-bold uppercase tracking-widest text-primary">${item.label}</dt>
            <dd class="mt-1 text-lg sm:mt-0">${item.content}</dd>
          </div>`,
      )
      .join("");

    root.innerHTML = `
      <div class="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
        ${sectionHeading("VI", sections.rules.label, sections.rules.title)}
        <dl class="frame mt-10 rounded-md bg-surface px-6 py-4 text-left sm:px-8">${rows}</dl>
        <p class="mt-6 text-lg italic text-muted">${generalRules.finalNote}</p>
      </div>`;
  } catch (e) {
    console.error(":::::renderGeneralRules:::::", e);
  }
}
