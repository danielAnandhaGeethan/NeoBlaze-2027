import "./style.css";
import { data } from "./data";
import { limits } from "../api/_lib/validate";
import type { EventContent, EventItem } from "./types";
import { eventPanelHtml } from "./sections/event-details";
import { esc, eventTag } from "./sections/shared";

const root = document.getElementById("editor");
const params = new URLSearchParams(location.search);
const eventId = params.get("event") ?? "";
const key = params.get("key") ?? "";
const identity = data.events.find((e) => e.id === eventId);

const input =
  "w-full rounded-md border border-accent bg-surface px-3 py-2 text-lg focus:border-primary focus:outline-none";
const small = "rounded-md border border-accent px-2 py-1 text-sm hover:border-primary";
const label = "font-display text-xs font-bold uppercase tracking-widest text-primary";

let state: EventContent | null = null;
let version = "";
let mode = "";
let dirty = false;

/** Replaces the page content with a single message card (errors, success). */
function showMessage(html: string): void {
  try {
    if (root) root.innerHTML = `<div class="frame rounded-md bg-surface p-6 text-lg">${html}</div>`;
  } catch (e) {
    console.error(":::::showMessage:::::", e);
  }
}

/** Redraws the fact rows and rule rows from the current state. */
function renderLists(): void {
  try {
    if (!state) return;
    const facts = document.getElementById("facts");
    const rules = document.getElementById("rules");
    if (facts) {
      facts.innerHTML = state.facts
        .map(
          (f, i) => `
            <div class="flex gap-2">
              <input class="${input} sm:w-48" data-field="fact-label" data-i="${i}" maxlength="${limits.factLabel}" placeholder="Label" value="${esc(f.label)}" />
              <input class="${input}" data-field="fact-value" data-i="${i}" maxlength="${limits.factValue}" placeholder="Value" value="${esc(f.value)}" />
              <button type="button" class="${small}" data-action="remove-fact" data-i="${i}" aria-label="Remove fact">&#10005;</button>
            </div>`,
        )
        .join("");
    }
    if (rules) {
      rules.innerHTML = state.rules
        .map(
          (r, i) => `
            <div class="flex gap-2">
              <span class="mt-2 w-6 shrink-0 font-display text-sm font-bold text-primary">${i + 1}.</span>
              <textarea rows="2" class="${input}" data-field="rule" data-i="${i}" maxlength="${limits.rule}">${esc(r)}</textarea>
              <div class="flex flex-col gap-1">
                <button type="button" class="${small}" data-action="up-rule" data-i="${i}" aria-label="Move rule up">&uarr;</button>
                <button type="button" class="${small}" data-action="down-rule" data-i="${i}" aria-label="Move rule down">&darr;</button>
                <button type="button" class="${small}" data-action="remove-rule" data-i="${i}" aria-label="Remove rule">&#10005;</button>
              </div>
            </div>`,
        )
        .join("");
    }
  } catch (e) {
    console.error(":::::renderLists:::::", e);
  }
}

/** Redraws the live preview with the same markup the website uses. */
function updatePreview(): void {
  try {
    const preview = document.getElementById("preview");
    if (preview && identity && state) preview.innerHTML = eventPanelHtml({ ...identity, ...state } as EventItem, true);
  } catch (e) {
    console.error(":::::updatePreview:::::", e);
  }
}

/** Sends the changes to the API and shows what happened. */
async function save(): Promise<void> {
  const status = document.getElementById("status");
  const button = document.getElementById("save") as HTMLButtonElement | null;
  try {
    if (button) button.disabled = true;
    if (status) status.textContent = "Saving...";
    const honeypot = (document.getElementById("website") as HTMLInputElement | null)?.value ?? "";
    const response = await fetch("/api/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event: eventId, key, version, content: state, website: honeypot }),
    });
    const body = (await response.json()) as { error?: string };
    if (!response.ok) {
      if (status) status.textContent = body.error ?? "Could not save. Please try again.";
      return;
    }
    dirty = false;
    showMessage(
      mode === "local"
        ? "<p><strong>Saved (test mode).</strong> The change is saved on this computer only.</p>"
        : "<p><strong>Thank you!</strong> Your changes were sent to the organisers for review. They appear on the website after approval.</p>",
    );
  } catch (e) {
    console.error(":::::save:::::", e);
    if (status) status.textContent = "Could not save. Check your connection and try again.";
  } finally {
    if (button) button.disabled = false;
  }
}

/** Handles typing in any field. */
function onInput(event: Event): void {
  try {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const field = target.dataset["field"];
    if (!field || !state) return;
    const i = Number(target.dataset["i"]);
    if (field === "description") {
      state.description = target.value;
      const counter = document.getElementById("count");
      if (counter) counter.textContent = `${target.value.length} / ${limits.description}`;
    } else if (field === "fact-label" && state.facts[i]) state.facts[i].label = target.value;
    else if (field === "fact-value" && state.facts[i]) state.facts[i].value = target.value;
    else if (field === "rule" && i < state.rules.length) state.rules[i] = target.value;
    else if (field === "deadline") state.submission.deadline = target.value;
    else if (field === "format") state.submission.format = target.value;
    dirty = true;
    updatePreview();
  } catch (e) {
    console.error(":::::onInput:::::", e);
  }
}

/** Handles the add, remove, move and save buttons. */
function onClick(event: Event): void {
  try {
    const button = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (!button || !state) return;
    const i = Number(button.dataset["i"]);
    const action = button.dataset["action"];
    if (action === "save") {
      void save();
      return;
    }
    if (action === "add-fact" && state.facts.length < limits.facts) state.facts.push({ label: "", value: "" });
    else if (action === "remove-fact") state.facts.splice(i, 1);
    else if (action === "add-rule" && state.rules.length < limits.rules) state.rules.push("");
    else if (action === "remove-rule") state.rules.splice(i, 1);
    else if (action === "up-rule" && i > 0) [state.rules[i - 1], state.rules[i]] = [state.rules[i] ?? "", state.rules[i - 1] ?? ""];
    else if (action === "down-rule" && i < state.rules.length - 1) [state.rules[i + 1], state.rules[i]] = [state.rules[i] ?? "", state.rules[i + 1] ?? ""];
    dirty = true;
    renderLists();
    updatePreview();
  } catch (e) {
    console.error(":::::onClick:::::", e);
  }
}

/** Builds the form for the loaded event. */
function renderForm(): void {
  try {
    if (!root || !identity || !state) return;
    document.title = `Edit ${identity.name} - ${data.site.name}`;
    const sub = state.submission.required
      ? `<section class="space-y-3">
           <h2 class="${label} font-display text-xs">${data.ui.submitLabel}</h2>
           <label class="block"><span class="text-muted">${data.ui.deadlineLabel}</span>
             <input class="${input}" data-field="deadline" maxlength="${limits.deadline}" value="${esc(state.submission.deadline ?? "")}" /></label>
           <label class="block"><span class="text-muted">How participants should submit</span>
             <textarea rows="3" class="${input}" data-field="format" maxlength="${limits.format}">${esc(state.submission.format ?? "")}</textarea></label>
         </section>`
      : "";
    const banner =
      mode === "local"
        ? `<p class="frame rounded-md bg-surface p-4 text-sm">Test mode: changes are saved on this computer, not sent for review.</p>`
        : "";
    root.innerHTML = `
      <div class="space-y-8">
        <div>
          <div class="flex flex-wrap items-center gap-3"><h1 class="font-heading text-4xl font-bold leading-tight">${esc(identity.name)}</h1>${eventTag(identity.mode)}</div>
          <p class="mt-3 text-lg text-muted">Update the description and rules below. The organisers review your changes before they appear on the website.</p>
        </div>
        ${banner}
        <section class="space-y-3">
          <h2 class="${label} font-display text-xs">Description</h2>
          <textarea rows="4" class="${input}" data-field="description" maxlength="${limits.description}">${esc(state.description)}</textarea>
          <p id="count" class="text-right text-sm text-muted">${state.description.length} / ${limits.description}</p>
        </section>
        <section class="space-y-3">
          <h2 class="${label} font-display text-xs">Facts (participants, time limit, and so on)</h2>
          <div id="facts" class="space-y-2"></div>
          <button type="button" class="${small}" data-action="add-fact">+ Add a fact</button>
        </section>
        <section class="space-y-3">
          <h2 class="${label} font-display text-xs">Rules</h2>
          <div id="rules" class="space-y-2"></div>
          <button type="button" class="${small}" data-action="add-rule">+ Add a rule</button>
        </section>
        ${sub}
        <input id="website" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden" />
        <div class="flex flex-wrap items-center gap-4">
          <button id="save" type="button" data-action="save" class="rounded-md bg-primary px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-on-primary hover:opacity-90 disabled:opacity-50">Send for review</button>
          <p id="status" role="status" aria-live="polite" class="text-lg"></p>
        </div>
        <section class="space-y-3">
          <h2 class="${label} font-display text-xs">Preview (how it will look on the website)</h2>
          <div id="preview"></div>
        </section>
      </div>`;
    root.addEventListener("input", onInput);
    root.addEventListener("click", onClick);
    renderLists();
    updatePreview();
  } catch (e) {
    console.error(":::::renderForm:::::", e);
  }
}

/** Loads the event's current content from the API; shows a clear message if the link is wrong. */
async function loadEvent(): Promise<void> {
  try {
    if (!identity || !key) {
      showMessage("This link is incomplete. Please ask the organisers for your event link.");
      return;
    }
    const response = await fetch(`/api/event?event=${encodeURIComponent(eventId)}&key=${encodeURIComponent(key)}`);
    const body = (await response.json()) as { content?: EventContent; version?: string; mode?: string; error?: string };
    if (!response.ok || !body.content) {
      showMessage(esc(body.error ?? "Could not load your event. Please try again later."));
      return;
    }
    state = body.content;
    version = body.version ?? "";
    mode = body.mode ?? "";
    renderForm();
  } catch (e) {
    console.error(":::::loadEvent:::::", e);
    showMessage("Could not load your event. Check your connection and try again.");
  }
}

window.addEventListener("beforeunload", (event) => {
  if (dirty) event.preventDefault();
});
void loadEvent();
