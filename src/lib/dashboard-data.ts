import {
  ACTIVITIES,
  EVENT_DATES,
  FUNCTIONS,
  PARTICIPANTS,
  TALENT_ACTS,
  checklistOf,
  type Participant,
} from "@/lib/detail-data";

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
  /** All four ticks: Pre-event, Welcome Dinner, JTI Got Talent, Inspire Awards. */
  complete: number;
  /** Q&A: questions sent from the microsite, and by how many people. */
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

/** Stamps collected per activity, in `ACTIVITIES` order. */
export type ActivityStamps = number[];

export type DayData = {
  kpis: Kpis;
  pulse: { label: string; checkins: number; activity: number }[];
  missions: Mission[];
  checklist: Checklist;
  functions: Slice[];
  /** JTI Got Talent's final standings — the ballot closed before the event. */
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

/** In `TALENT_ACTS` order. */
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

/*
 * Everything with a detail page is counted from PARTICIPANTS, so a panel,
 * its "See all" table and the Activity Log can never disagree. Each day shows
 * what had happened by its end: both ballots closed before the event, missions
 * close with Day 1, and nothing is recorded on Day 3, so Day 2 and Day 3 are
 * the final numbers.
 */
const END_OF: Record<DayKey, string> = {
  day1: `${EVENT_DATES.day1} 23:59:59`,
  day2: `${EVENT_DATES.day2} 23:59:59`,
  day3: `${EVENT_DATES.day2} 23:59:59`,
};

const count = (test: (p: Participant) => boolean) => PARTICIPANTS.filter(test).length;
const TICKS = PARTICIPANTS.map(checklistOf);

const MISSIONS = missionBase.map((m, k) => ({
  ...m,
  sent: count((p) => p.sends[k]! > 0),
  resends: PARTICIPANTS.reduce((s, p) => s + Math.max(0, p.sends[k]! - 1), 0),
}));

const TALENTS = talentBase.map((t, i) => ({
  ...t,
  votes: count((p) => p.vote === TALENT_ACTS[i]),
}));

/** Every tick is settled by the end of Day 1, so the checklist reads the same from then on. */
const CHECKLIST: Checklist = {
  preEvent: TICKS.filter((t) => t.preEvent).length,
  welcomeDinner: TICKS.filter((t) => t.welcomeDinner).length,
  talent: TICKS.filter((t) => t.talent).length,
  award: TICKS.filter((t) => t.award).length,
  complete: TICKS.filter((t) => t.preEvent && t.welcomeDinner && t.talent && t.award).length,
};

/** What the records can't say yet: hub traffic, the hourly pulse and the gallery. */
const AMBIENT: Record<DayKey, Pick<DayData, "pulse" | "gallery" | "hub"> & { engagement: number }> =
  {
    day1: {
      engagement: 84,
      pulse: pulse(10, 96, 210, 9),
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
    },
    day2: {
      engagement: 93,
      pulse: pulse(11, 128, 340, 8),
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
    },
    day3: {
      engagement: 89,
      pulse: pulse(8, 74, 180, 7),
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
    },
  };

function dayData(day: DayKey): DayData {
  const end = END_OF[day];
  const here = (p: Participant) => p.checkinAt !== null && p.checkinAt <= end;
  const asked = PARTICIPANTS.map((p) => p.questions.filter((t) => t <= end).length);
  const { engagement, ...ambient } = AMBIENT[day];
  return {
    ...ambient,
    kpis: {
      registered: PARTICIPANTS.length,
      checkedIn: count(here),
      engagement,
      complete: CHECKLIST.complete,
      questions: asked.reduce((s, n) => s + n, 0),
      askers: asked.filter((n) => n > 0).length,
    },
    missions: MISSIONS,
    checklist: CHECKLIST,
    functions: FUNCTIONS.map((f) => ({ label: f, value: count((p) => p.fn === f && here(p)) })),
    talents: TALENTS,
    activities: ACTIVITIES.map((a) =>
      count((p) => {
        const t = p.stamps[a.id];
        return t !== undefined && t <= end;
      }),
    ),
  };
}

export const DATA: Record<DayKey, DayData> = {
  day1: dayData("day1"),
  day2: dayData("day2"),
  day3: dayData("day3"),
};

/**
 * What the live feed can say; `from`/`until` keep a moment out of days it
 * can't happen on. Nobody votes during the event — both ballots closed before
 * it — and nothing is scanned on Day 3, so its feed is quiet.
 */
export const FEED_TEMPLATES: { kind: string; text: string; from?: DayKey; until?: DayKey }[] = [
  { kind: "checkin", text: "checked in at the Welcome Dinner", until: "day1" },
  { kind: "checkin", text: "got a stamp at Infinity Crossing", until: "day1" },
  { kind: "checkin", text: "got a stamp at Infinity Link", until: "day1" },
  { kind: "checkin", text: "got a stamp at Move Beyond", until: "day1" },
  { kind: "mission", text: "sent Mission 01 · Connect to Win", until: "day1" },
  { kind: "mission", text: "retook Mission 02 · Infinity Quiz", until: "day1" },
  { kind: "mission", text: "sent another pantun for Mission 03 · Win Together", until: "day1" },
  { kind: "reward", text: "claimed Sunglasses at the Redemption Corner", until: "day1" },
  {
    kind: "reward",
    text: "claimed the Handcrafted Leather Journal at the Redemption Corner",
    until: "day1",
  },
  {
    kind: "checkin",
    text: "checked in at the Morning Market Conference",
    from: "day2",
    until: "day2",
  },
  { kind: "checkin", text: "checked in at The Infinite Race", from: "day2", until: "day2" },
  { kind: "checkin", text: "checked in at the Infinite Gala", from: "day2", until: "day2" },
  { kind: "question", text: "sent a question to Q&A", until: "day2" },
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
