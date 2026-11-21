/** Shape of src/data.ts. A typo or missing field here fails `npm run build` instead of showing as a blank on the page. */

export type EventMode = "online" | "offline";

export interface Fact {
  label: string;
  value: string;
}

export interface EventItem {
  id: string;
  name: string;
  mode: EventMode;
  tagline: string;
  /** Short Bible text and its reference, shown on the event card. */
  bible: { text: string; reference: string };
  description: string;
  /** Participants, time limit and similar one-line facts. */
  facts: Fact[];
  rules: string[];
  submission: { required: boolean; deadline?: string; format?: string };
}

export interface ScheduleItem {
  time: string;
  title: string;
  eventId?: string;
  venue?: string;
}

export interface ScheduleDay {
  day: string;
  date: string;
  items: ScheduleItem[];
}

export interface Contact {
  name: string;
  role?: string;
  phone: string;
}

export interface SectionText {
  label: string;
  title: string;
  intro?: string;
}

export interface SiteData {
  site: { name: string; year: string; subtitle: string; tagline: string; logo: string; motto: string };
  nav: { id: string; label: string }[];
  eventInfo: { date: string; time: string; venue: string; address: string; mapLink: string; startsAt: string };
  hero: {
    description: string;
    image: { src: string; alt: string; caption: string };
    buttons: { events: string; map: string };
    countdown: {
      labels: { days: string; hours: string; minutes: string; seconds: string };
      liveText: string;
    };
  };
  about: {
    label: string;
    title: string;
    paragraphs: string[];
    expectationsLabel: string;
    expectations: string[];
    ageGroupLabel: string;
    ageGroup: string;
    mottoLabel: string;
    motto: string;
  };
  theme: {
    label: string;
    title: string;
    subtitle: string;
    /** Original-language word for the theme (for example Hebrew); leave out when there is none. */
    translation?: string;
    description: string;
    connection: string;
    verse: { text: string; reference: string; translation: string };
  };
  /** Text shown on the online / offline tag of each event. */
  tagLabels: Record<EventMode, string>;
  /** Heading text for the sections below the About and Theme sections. */
  sections: { events: SectionText; details: SectionText; schedule: SectionText; rules: SectionText; contacts: SectionText };
  /** Small texts used on cards, details and contact blocks. */
  ui: {
    filterAll: string;
    cardCta: string;
    rulesLabel: string;
    submitLabel: string;
    deadlineLabel: string;
    mailButton: string;
    callLabel: string;
    emailLabel: string;
    venueLabel: string;
  };
  events: EventItem[];
  generalRules: { items: { label: string; content: string }[]; finalNote: string };
  schedule: ScheduleDay[];
  contacts: { list: Contact[] };
  /** `mailBody` is the text prefilled in the email a participant opens from an event. */
  submissions: { email: string; instructions: string; mailBody: string };
  footer: { hostedBy: string; disclaimer: string };
}
