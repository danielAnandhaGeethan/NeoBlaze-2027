import type { EventContent } from "../../src/types";

/** A problem with what the in-charge typed; the message is shown on the form. */
export class ValidationError extends Error {}

/** Length limits. The editor form (src/edit.ts) imports these too, so the form and the server always agree. */
export const limits = {
  description: 600,
  facts: 6,
  factLabel: 40,
  factValue: 200,
  rules: 15,
  rule: 300,
  deadline: 60,
  format: 400,
};

/** Cleans one text value: control characters removed, trimmed, length-checked. Throws a message the form can show. */
function text(value: unknown, max: number, field: string): string {
  if (typeof value !== "string") throw new ValidationError(`${field} must be text.`);
  const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  if (cleaned.length > max) throw new ValidationError(`${field} is too long (at most ${max} characters).`);
  return cleaned;
}

/** Checks the form's data and returns the content to store. `required` comes from the stored file, not from the form. */
export function validateContent(input: unknown, required: boolean): EventContent {
  if (typeof input !== "object" || input === null) throw new ValidationError("Nothing to save.");
  const body = input as Record<string, unknown>;

  const description = text(body["description"], limits.description, "The description");
  if (!description) throw new ValidationError("The description cannot be empty.");

  const rawFacts = Array.isArray(body["facts"]) ? (body["facts"] as unknown[]) : [];
  if (rawFacts.length > limits.facts) throw new ValidationError(`Use at most ${limits.facts} facts.`);
  const facts = rawFacts
    .map((f) => {
      const row = (f ?? {}) as Record<string, unknown>;
      return { label: text(row["label"], limits.factLabel, "A fact label"), value: text(row["value"], limits.factValue, "A fact value") };
    })
    .filter((f) => f.label || f.value);
  if (facts.some((f) => !f.label || !f.value)) throw new ValidationError("Each fact needs both a label and a value.");

  const rawRules = Array.isArray(body["rules"]) ? (body["rules"] as unknown[]) : [];
  if (rawRules.length > limits.rules) throw new ValidationError(`Use at most ${limits.rules} rules.`);
  const rules = rawRules.map((r) => text(r, limits.rule, "A rule")).filter(Boolean);
  if (rules.length === 0) throw new ValidationError("Add at least one rule.");

  const sub = (typeof body["submission"] === "object" && body["submission"] !== null ? body["submission"] : {}) as Record<string, unknown>;
  const deadline = required ? text(sub["deadline"] ?? "", limits.deadline, "The deadline") : "";
  const format = required ? text(sub["format"] ?? "", limits.format, "The submission instructions") : "";

  return {
    description,
    facts,
    rules,
    submission: { required, ...(deadline ? { deadline } : {}), ...(format ? { format } : {}) },
  };
}
