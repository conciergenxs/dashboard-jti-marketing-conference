export type DayKey = "day1" | "day2" | "day3";

export const EVENT = {
  title: "Grow Beyond Limits",
  subtitle: "Market Conference 2026 · Live Analytics",
  location: "Yogyakarta, Indonesia",
  tagline: "Bersama, Pasti Menang!",
  target: 350,
};

export const DAYS: { key: DayKey; label: string; caption: string }[] = [
  { key: "day1", label: "Day 1", caption: "Enter the Infinite" },
  { key: "day2", label: "Day 2", caption: "Break Beyond" },
  { key: "day3", label: "Day 3", caption: "Continue Infinity" },
];

export type Kpis = {
  registered: number;
  checkedIn: number;
  engagement: number;
  /** All three ticks: Pre-event, JTI Got Talent, Employee Award. */
  complete: number;
  /** Live Q&A: questions sent from the microsite, and by how many people. */
  questions: number;
  askers: number;
};

export type Mission = {
  id: string;
  index: string;
  name: string;
  promise: string;
  /** People who have sent it at least once — the send that ticks Pre-event. */
  sent: number;
  /** Sends after someone's first: counted, never ticked twice. */
  resends: number;
};

export type Slice = { label: string; value: number };

export type Talent = {
  id: string;
  name: string;
  act: string;
  votes: number;
};

/** The passport's checklist, as head counts. */
export type Checklist = {
  preEvent: number;
  welcomeDinner: number;
  talent: number;
  award: number;
  /** Everyone with all four ticked. */
  complete: number;
};

/**
 * The passport's Activity Quota, as the microsite stamps it: one stamp each,
 * self-scanned at a venue QR or scanned by the crew. The Infinite Race is a
 * single stamp for the whole race, not one per phase.
 */
export const ACTIVITIES = [
  { id: "hotel-arrival", name: "Arrival at Hotel", day: "day1", scan: "Self scan" },
  { id: "welcome-arrival", name: "Welcome Dinner Arrival", day: "day1", scan: "Self scan" },
  { id: "writing-photobooth", name: "Writing Photobooth", day: "day1", scan: "Crew scan" },
  { id: "move-beyond", name: "Move Beyond", day: "day1", scan: "Crew scan" },
  { id: "infinity-crossing", name: "Infinity Crossing", day: "day1", scan: "Crew scan" },
  { id: "infinity-link", name: "Infinity Link", day: "day1", scan: "Crew scan" },
  { id: "redemption-corner", name: "Redemption Corner", day: "day1", scan: "Crew scan" },
  { id: "conference-arrival", name: "Morning Market Conference", day: "day2", scan: "Self scan" },
  { id: "infinite-race", name: "The Infinite Race", day: "day2", scan: "Self scan" },
  { id: "gala-check-in", name: "Infinite Gala", day: "day2", scan: "Self scan" },
  {
    id: "slow-motion-photobooth",
    name: "Super Slow Motion Photobooth",
    day: "day2",
    scan: "Crew scan",
  },
] as const;

export const ACTIVITY_DAYS = [
  { day: "day1", label: "Day 1", caption: "17 Nov · Welcome Dinner" },
  { day: "day2", label: "Day 2", caption: "18 Nov · Conference, Race & Gala" },
] as const;

/** Stamps collected per activity, in `ACTIVITIES` order. */
export type ActivityStamps = number[];

export type DayData = {
  kpis: Kpis;
  pulse: { label: string; checkins: number; activity: number }[];
  missions: Mission[];
  checklist: Checklist;
  functions: Slice[];
  /** Got Talent's ballot is hidden until 18 Nov, 20.30 — Day 1 has no votes. */
  votingOpen: boolean;
  talents: Talent[];
  gallery: { photos: number; likes: number; contributors: number; topMoment: string };
  hub: Slice[];
  activities: ActivityStamps;
};

/**
 * The Gallery is built but held back on the microsite (`GALLERY_ENABLED` there);
 * the dashboard follows it and shows the checklist in its place.
 */
export const GALLERY_ENABLED = false;

export const VOTING_OPENS_LABEL = "Wed, 18 Nov · 20.30";

const missionBase: Omit<Mission, "sent" | "resends">[] = [
  { id: "m1", index: "01", name: "Connect to Win", promise: "Break your usual circle" },
  {
    id: "m2",
    index: "02",
    name: "Infinity Quiz",
    promise: "Know the people, the brand, the journey",
  },
  { id: "m3", index: "03", name: "Win Together", promise: "Turn our shared spirit into words" },
];

const talentBase = [
  { id: "t1", name: "The Infinity Sound", act: "Music & Band · West Region Team" },
  { id: "t2", name: "Nada Beyond Limits", act: "Music & Band · East Region Team" },
  { id: "t3", name: "Gerak Infinity", act: "Contemporary Dance · Central Region Team" },
  { id: "t4", name: "Langkah Tanpa Batas", act: "Contemporary Dance · North Region Team" },
  { id: "t5", name: "Beyond The Runway", act: "Entertainment & Fashion · Marketing Team" },
  { id: "t6", name: "Grow Squad", act: "Entertainment & Fashion · Trade Marketing Team" },
];

function pulse(
  points: number,
  peakCheckins: number,
  peakActivity: number,
  startHour: number,
): { label: string; checkins: number; activity: number }[] {
  return Array.from({ length: points }, (_, i) => {
    const t = i / (points - 1);
    const bell = Math.exp(-Math.pow((t - 0.45) * 2.4, 2));
    const wave = 0.85 + 0.15 * Math.sin(i * 1.7);
    const hour = startHour + i;
    return {
      label: `${String(hour).padStart(2, "0")}:00`,
      checkins: Math.round(peakCheckins * bell * wave),
      activity: Math.round(peakActivity * (0.35 + bell * 0.8) * wave),
    };
  });
}

// Missions close at the end of Day 1 and both ballots run on Day 2's night,
// so from Day 2 on those numbers are final.
const MISSIONS_FINAL = missionBase.map((m, i) => ({
  ...m,
  sent: [302, 236, 171][i]!,
  resends: [58, 44, 27][i]!,
}));
const TALENTS_FINAL = talentBase.map((t, i) => ({ ...t, votes: [74, 66, 51, 43, 38, 26][i]! }));
// Day 1's stamps are final by its night; Day 2's land on the 18th. The
// Redemption Corner stamp is the prize claim, so it matches the sunglasses.
const DAY1_STAMPS = [318, 309, 214, 187, 168, 152, 296];
const STAMPS_DAY1 = [...DAY1_STAMPS, 0, 0, 0, 0];
const STAMPS_FINAL = [...DAY1_STAMPS, 329, 322, 331, 204];

export const DATA: Record<DayKey, DayData> = {
  day1: {
    kpis: {
      registered: 342,
      checkedIn: 318,
      engagement: 84,
      complete: 0,
      questions: 9,
      askers: 8,
    },
    pulse: pulse(10, 96, 210, 9),
    missions: MISSIONS_FINAL,
    checklist: { preEvent: 309, welcomeDinner: 318, talent: 0, award: 0, complete: 0 },
    functions: [
      { label: "Sales & Distribution", value: 108 },
      { label: "Marketing", value: 58 },
      { label: "Operations", value: 52 },
      { label: "Finance", value: 38 },
      { label: "People & Culture", value: 34 },
      { label: "Corporate Affairs", value: 28 },
    ],
    votingOpen: false,
    talents: talentBase.map((t) => ({ ...t, votes: 0 })),
    gallery: {
      photos: 612,
      likes: 1840,
      contributors: 246,
      topMoment: "Welcome Dinner · Infinite Night gate",
    },
    hub: [
      { label: "Personal Journey", value: 32 },
      { label: "Live Interaction", value: 27 },
      { label: "Engagement Hub", value: 24 },
      { label: "Content & Memories", value: 17 },
    ],
    activities: STAMPS_DAY1,
  },
  day2: {
    kpis: {
      registered: 350,
      checkedIn: 341,
      engagement: 93,
      complete: 271,
      questions: 146,
      askers: 118,
    },
    pulse: pulse(11, 128, 340, 8),
    missions: MISSIONS_FINAL,
    checklist: { preEvent: 309, welcomeDinner: 332, talent: 298, award: 305, complete: 271 },
    functions: [
      { label: "Sales & Distribution", value: 116 },
      { label: "Marketing", value: 63 },
      { label: "Operations", value: 56 },
      { label: "Finance", value: 41 },
      { label: "People & Culture", value: 36 },
      { label: "Corporate Affairs", value: 29 },
    ],
    votingOpen: true,
    talents: TALENTS_FINAL,
    gallery: {
      photos: 1284,
      likes: 4720,
      contributors: 318,
      topMoment: "Infinite Gala · Got Talent finale",
    },
    hub: [
      { label: "Personal Journey", value: 21 },
      { label: "Live Interaction", value: 34 },
      { label: "Engagement Hub", value: 28 },
      { label: "Content & Memories", value: 17 },
    ],
    activities: STAMPS_FINAL,
  },
  day3: {
    kpis: {
      registered: 350,
      checkedIn: 336,
      engagement: 89,
      complete: 271,
      questions: 146,
      askers: 118,
    },
    pulse: pulse(8, 74, 180, 7),
    missions: MISSIONS_FINAL,
    checklist: { preEvent: 309, welcomeDinner: 332, talent: 298, award: 305, complete: 271 },
    functions: [
      { label: "Sales & Distribution", value: 114 },
      { label: "Marketing", value: 62 },
      { label: "Operations", value: 55 },
      { label: "Finance", value: 40 },
      { label: "People & Culture", value: 35 },
      { label: "Corporate Affairs", value: 30 },
    ],
    votingOpen: true,
    talents: TALENTS_FINAL,
    gallery: {
      photos: 1502,
      likes: 6180,
      contributors: 329,
      topMoment: "Collective Time Capsule reveal",
    },
    hub: [
      { label: "Personal Journey", value: 18 },
      { label: "Live Interaction", value: 22 },
      { label: "Engagement Hub", value: 24 },
      { label: "Content & Memories", value: 36 },
    ],
    activities: STAMPS_FINAL,
  },
};

/** What the activity log can say; `from` keeps a moment out of days it can't happen on. */
export const FEED_TEMPLATES: { kind: string; text: string; from?: DayKey; until?: DayKey }[] = [
  { kind: "checkin", text: "just checked in at the venue" },
  { kind: "checkin", text: "got a stamp at the Writing Photobooth", until: "day1" },
  { kind: "checkin", text: "checked in at The Infinite Race", from: "day2", until: "day2" },
  { kind: "mission", text: "sent Mission 01 · Connect to Win", until: "day1" },
  { kind: "mission", text: "retook Mission 02 · Infinity Quiz", until: "day1" },
  { kind: "mission", text: "sent another pantun for Mission 03 · Win Together", until: "day1" },
  { kind: "reward", text: "claimed Sunglasses at the Redemption Corner", until: "day1" },
  { kind: "vote", text: "voted in JTI Got Talent", from: "day2", until: "day2" },
  { kind: "vote", text: "voted in the Employee Award", from: "day2", until: "day2" },
  { kind: "question", text: "sent a question to Live Q&A" },
];

export const FEED_NAMES = [
  "Dimas P.",
  "Ayu R.",
  "Rangga S.",
  "Nadia H.",
  "Bagus W.",
  "Sinta L.",
  "Fajar A.",
  "Melati K.",
  "Yoga N.",
  "Prita M.",
  "Arif B.",
  "Tania D.",
];

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    n,
  );
}
