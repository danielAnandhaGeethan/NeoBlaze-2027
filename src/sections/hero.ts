import { data } from "../data";
import { ornament } from "./shared";

const units = ["days", "hours", "minutes", "seconds"] as const;
const unitMs = { days: 86_400_000, hours: 3_600_000, minutes: 60_000, seconds: 1_000 };

/** Updates the countdown boxes once; returns true when the start time has passed (or is invalid). */
function tickCountdown(target: number, box: HTMLElement): boolean {
  try {
    const diff = target - Date.now();
    if (Number.isNaN(target) || diff <= 0) {
      box.querySelector("[data-grid]")?.classList.add("hidden");
      box.querySelector("[data-live]")?.classList.toggle("hidden", Number.isNaN(target));
      return true;
    }
    let rest = diff;
    for (const unit of units) {
      const value = Math.floor(rest / unitMs[unit]);
      rest -= value * unitMs[unit];
      const cell = box.querySelector(`[data-unit="${unit}"]`);
      if (cell) cell.textContent = String(value).padStart(2, "0");
    }
    return false;
  } catch (e) {
    console.error(":::::tickCountdown:::::", e);
    return true;
  }
}

/** Starts the one-second countdown to the event start and stops it once the event is live. */
function startCountdown(target: number, box: HTMLElement): void {
  try {
    if (tickCountdown(target, box)) return;
    const timer = window.setInterval(() => {
      if (tickCountdown(target, box)) window.clearInterval(timer);
    }, 1000);
  } catch (e) {
    console.error(":::::startCountdown:::::", e);
  }
}

/** Fills the Home section: name and year, biblical line, date and place, countdown, buttons and church image. */
export function renderHero(): void {
  try {
    const root = document.getElementById("hero");
    if (!root) return;
    const { site, eventInfo, hero } = data;
    const chip = "rounded-sm border border-accent bg-surface px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wider";
    const cells = units
      .map(
        (unit) => `
          <div class="frame rounded-md bg-surface p-3 text-center">
            <div data-unit="${unit}" class="font-display text-2xl font-extrabold tabular-nums sm:text-3xl">00</div>
            <div class="mt-1 font-display text-[10px] font-semibold uppercase tracking-widest text-muted">${hero.countdown.labels[unit]}</div>
          </div>`,
      )
      .join("");

    root.innerHTML = `
      <div class="bg-linear-to-b from-primary/15 to-transparent">
        <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p class="mb-3 font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">${site.subtitle}</p>
            <h1 class="text-5xl font-extrabold leading-none sm:text-7xl lg:text-8xl">${site.name} <span class="text-primary">${site.year}</span></h1>
            ${ornament("justify-start")}
            <p class="text-2xl italic leading-snug text-muted">${hero.description}</p>
            <div class="mt-6 flex flex-wrap gap-2">
              <span class="${chip}">${eventInfo.date}</span>
              <span class="${chip}">${eventInfo.time}</span>
              <span class="${chip}">${eventInfo.venue}</span>
            </div>
            <p class="mt-2 text-sm text-muted">${eventInfo.address}</p>
            <div id="countdown" class="mt-8 max-w-md">
              <div data-grid class="grid grid-cols-4 gap-3">${cells}</div>
              <p data-live class="hidden font-display text-xl font-extrabold uppercase tracking-wide text-primary">${hero.countdown.liveText}</p>
            </div>
            <div class="mt-8 flex flex-wrap gap-3">
              <a href="#events" class="rounded-md bg-primary px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-on-primary hover:opacity-90">${hero.buttons.events}</a>
              <a href="${eventInfo.mapLink}" target="_blank" rel="noopener noreferrer" class="rounded-md border border-accent bg-surface px-6 py-3 font-display text-sm font-bold uppercase tracking-wider hover:border-primary">${hero.buttons.map}</a>
            </div>
          </div>
          <figure class="relative mx-auto w-full max-w-lg">
            <img src="${hero.image.src}" alt="${hero.image.alt}" class="img-rim relative w-full" />
            <figcaption class="relative mt-2 text-center text-sm text-muted">${hero.image.caption}</figcaption>
          </figure>
        </div>
      </div>`;

    const countdown = root.querySelector<HTMLElement>("#countdown");
    if (countdown) startCountdown(Date.parse(eventInfo.startsAt), countdown);
  } catch (e) {
    console.error(":::::renderHero:::::", e);
  }
}
