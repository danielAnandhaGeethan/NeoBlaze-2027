import type { SiteData } from "./types";
import treasureHunt from "./content/events/treasure-hunt.json";
import singing from "./content/events/singing.json";
import photography from "./content/events/photography.json";
import quiz from "./content/events/quiz.json";
import clayModeling from "./content/events/clay-modeling.json";
import blockAndTackle from "./content/events/block-and-tackle.json";
import surpriseEvent from "./content/events/surprise-event.json";
import reels from "./content/events/reels.json";
import lightPhotography from "./content/events/light-photography.json";

/**
 * All text on the site lives here. Edit the values; the shape is checked by src/types.ts.
 * Seeded from the 2026 site. Anything marked UPDATE is year-specific, anything marked UNVERIFIED was copied
 * from 2026 and must be confirmed before publishing.
 */
export const data: SiteData = {
  site: {
    name: "NeoBlaze",
    year: "2027", // UPDATE each year
    subtitle: "Inter Church Youth Festival",
    tagline: "A one day youth festival with treasure hunts, music, reels, and more.", // used for the share preview in Part 9
    logo: "logo.webp",
    motto: "Bringing up youth in God",
  },

  nav: [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "theme", label: "Theme" },
    { id: "events", label: "Events" },
    { id: "schedule", label: "Schedule" },
    { id: "general-rules", label: "Rules" },
    { id: "contacts", label: "Contact" },
  ],

  eventInfo: {
    date: "date", // UPDATE (2026 was 21 February 2026)
    time: "time", // UPDATE
    // UNVERIFIED: the 2026 hero said "Palavakkam, ECR" but the contact address said "PRS Nagar, Bharathi Nagar" - confirm which is right.
    venue: "CSI Church of Jesus Christ, Palavakkam, ECR",
    address: "1/3, SH 49, PRS Nagar, Bharathi Nagar, Chennai, Tamil Nadu 600041",
    // UNVERIFIED: open this link once and check it lands on the church.
    mapLink: "https://maps.app.goo.gl/r6vGZ9J2d7xYwS3f9",
    startsAt: "2027-01-01T09:00:00+05:30", // UPDATE: countdown target, with the +05:30 India offset
  },

  hero: {
    description: "one line biblical description", // UPDATE
    image: { src: "/church.webp", alt: "CSI Church of Jesus Christ", caption: "CSI Church of Jesus Christ" },
    buttons: { events: "View events", map: "Open in Google Maps" },
    countdown: {
      labels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
      liveText: "The event is live",
    },
  },

  about: {
    label: "Who we are",
    title: "About NeoBlaze",
    paragraphs: [
      "NeoBlaze is the premier inter-church youth event hosted by the CJC Youth Fellowship, igniting hearts for Christ! We gather youth from 15 to 20 churches for a day packed with high-energy competition and powerful fellowship.",
      "This isn't just about winning prizes. It's about discovering God-given talents, building lasting friendships across different congregations, and uniting under one banner of faith. Get ready for a day of fun, challenge, and spiritual growth.",
    ],
    expectationsLabel: "What to expect",
    expectations: [
      "High-energy competitions",
      "A space to showcase your unique talents",
      "New friendships and connections across churches",
      "A vibrant, Christ-centered atmosphere",
    ],
    ageGroupLabel: "Age group",
    ageGroup: "18 to 35",
    mottoLabel: "Our motto",
    motto: "Bringing up youth in God",
  },

  // UPDATE: the whole theme block changes every year (2026 was "Teshuvah").
  theme: {
    label: "This year's theme",
    title: "theme title",
    subtitle: "theme subtitle",
    description: "theme description",
    connection: "theme connection",
    verse: { text: "verse text", reference: "verse reference", translation: "translation" },
  },

  tagLabels: { online: "Online", offline: "On-site" },

  sections: {
    events: {
      label: "Competitions",
      title: "Our events",
      intro: "Pick an event, read the rules, and get your church ready.",
    },
    details: {
      label: "Details and rules",
      title: "Event rules",
      intro: "Tap an event to read its rules and how to submit.",
    },
    schedule: { label: "The day", title: "Schedule" },
    rules: { label: "Please note", title: "General rules" },
    contacts: {
      label: "Get in touch",
      title: "Contact us",
      intro: "Questions about registration or your event? Call or email us.",
    },
  },

  ui: {
    filterAll: "All",
    cardCta: "Details and rules",
    rulesLabel: "Rules",
    submitLabel: "How to submit",
    deadlineLabel: "Deadline",
    mailButton: "Email your submission",
    callLabel: "Call the organisers",
    emailLabel: "Submissions and enquiries",
    venueLabel: "Venue",
  },

  // Event name, tag, tagline and Bible text live here. Description, facts, rules and submission details live in
  // src/content/events/<id>.json, which the event in-charges edit through the editor form. The Bible texts are suggestions (KJV).
  events: [
    {
      id: "treasure-hunt",
      name: "Treasure Hunt",
      mode: "offline",
      tagline: "Race through clues, solve the mystery, claim the treasure.",
      bible: { text: "“Seek, and ye shall find.”", reference: "Matthew 7:7" },
      ...treasureHunt,
    },
    {
      id: "singing",
      name: "Singing",
      mode: "offline",
      tagline: "Lift your voice, move the crowd, and sing a new song.",
      bible: { text: "“O sing unto the LORD a new song.”", reference: "Psalm 96:1" },
      ...singing,
    },
    {
      id: "photography",
      name: "Photography",
      mode: "offline",
      tagline: "Capture the essence of the day through your unique lens.",
      bible: { text: "“The heavens declare the glory of God.”", reference: "Psalm 19:1" },
      ...photography,
    },
    {
      id: "quiz",
      name: "Quiz",
      mode: "offline",
      tagline: "Test your knowledge of the Word. Fast, fun, and challenging.",
      bible: { text: "“Study to shew thyself approved unto God.”", reference: "2 Timothy 2:15" },
      ...quiz,
    },
    {
      id: "clay-modeling",
      name: "Miniature Clay Modeling",
      mode: "offline",
      tagline: "Shape your creativity from a lump of clay.",
      bible: { text: "“We are the clay, and thou our potter.”", reference: "Isaiah 64:8" },
      ...clayModeling,
    },
    {
      id: "block-and-tackle",
      name: "Block and Tackle",
      mode: "offline",
      tagline: "Think on your feet and argue both sides of the story.",
      bible: { text: "“Be ready always to give an answer to every man that asketh you a reason of the hope that is in you.”", reference: "1 Peter 3:15" },
      ...blockAndTackle,
    },
    {
      id: "surprise-event",
      name: "Surprise Event",
      mode: "offline",
      tagline: "Expect the unexpected. Anything could happen!",
      bible: { text: "“Call unto me, and I will answer thee, and shew thee great and mighty things.”", reference: "Jeremiah 33:3" },
      ...surpriseEvent,
    },
    {
      id: "reels",
      name: "Reels",
      mode: "online",
      tagline: "Create a viral-worthy reel before the event day.",
      bible: { text: "“Go ye into all the world, and preach the gospel to every creature.”", reference: "Mark 16:15" },
      ...reels,
    },
    {
      id: "light-photography",
      name: "Light Photography",
      mode: "online",
      tagline: "Paint with light and capture stunning images.",
      bible: { text: "“And God said, Let there be light: and there was light.”", reference: "Genesis 1:3" },
      ...lightPhotography,
    },
  ],

  generalRules: {
    items: [
      { label: "Age limit", content: "All participants should be between 18 and 35 years of age." },
      { label: "Reporting time", content: "Registration desks open at 9:30 AM on the event day. Please be on time." }, // UPDATE
      {
        label: "Registration fees",
        content: "Church Registration: ₹1000 | Individual Entry: ₹100. (Fees are subject to change).", // UPDATE
      },
      {
        label: "Discipline",
        content:
          "Please adhere to the schedule, follow volunteer instructions, and respect the church campus property. No abusive language or disruptive behavior will be tolerated.",
      },
      { label: "Final decision", content: "The judges' decision will be final for all events." },
    ],
    finalNote: "Detailed judging criteria and any last-minute updates will be announced closer to the event date.",
  },

  // UPDATE: times are from 2026. Add `eventId` to a line to link it to an event.
  schedule: [
    {
      day: "Event day",
      date: "date",
      items: [
        { time: "09:30 AM", title: "Registration & Fellowship" },
        { time: "10:00 AM", title: "Opening Session & Prayer" },
        { time: "10:30 AM", title: "Word Of God" },
        { time: "11:15 AM", title: "First Set of On-site Events" },
        { time: "01:00 PM", title: "Lunch Break" },
        { time: "02:00 PM", title: "Afternoon Events & Competitions" },
        { time: "05:30 PM", title: "Awards Ceremony & Closing Prayer" },
      ],
    },
  ],

  // UNVERIFIED: names and numbers are from 2026 - confirm they are still current.
  contacts: {
    list: [
      { name: "Charles", phone: "9710629387" },
      { name: "Presley", phone: "9003126573" },
      { name: "Prathip", phone: "9791441154" },
      { name: "Alan", phone: "9940150411" },
    ],
  },

  submissions: {
    email: "csichurchofjesuschrist@gmail.com", // UNVERIFIED: 2026 address
    instructions: "Email your submission to the address below. Include your church name and a contact person.",
    mailBody: "Church name:\nContact person:\nPhone number:\nLink to the submission:\n",
  },

  footer: {
    hostedBy: "Hosted by CJC Youth Fellowship",
    disclaimer: "By entering the venue you agree to be photographed and to respect all participants and volunteers.",
  },
};
