import {
  ACTIVITIES,
  CHECK_IN_EVENTS,
  EVENT_DATES,
  FUNCTIONS,
  INSPIRE_CATEGORY_META,
  INSPIRE_STANDINGS,
  PARTICIPANTS,
  TALENT_ACTS,
  checklistOf,
  type AwardStanding,
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

export type Kpis = {
  registered: number;
  checkedIn: number;
  /** All four ticks: Pre-event, Welcome Dinner, JTI Got Talent, Inspired By You. */
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

/**
 * The room's division split, for everyone scanned in and for each of the
 * three doors on its own — "who is in the room" depends on which room.
 */
export type RoomView = {
  id: string;
  /** What the filter calls it. */
  label: string;
  /** How many were in that room. */
  present: number;
  divisions: Slice[];
};

export type Talent = {
  id: string;
  name: string;
  act: string;
  votes: number;
};

/**
 * Inspired By You, counted as participation. Everyone registered is on the
 * ballot and may vote once in each category, so `eligible` is the roster.
 */
export type Inspired = {
  categories: { id: string; label: string; voters: number }[];
  /** Sent a ballot in at least one category. */
  any: number;
  /**
   * How the roster splits — both categories, one only, or none. The four
   * groups are exclusive and add up to `eligible`, and they are the same four
   * the detail page's Ballot filter offers.
   */
  mix: { label: string; value: number }[];
  eligible: number;
  /**
   * The standings the committee reads the winners from, per category: the
   * leader first, then the two behind them. The microsite shows no tally, so
   * this never leaves the dashboard.
   */
  standings: {
    id: string;
    label: string;
    /** How many colleagues stood in this category. */
    onBallot: number;
    /** How many of them took at least one vote. */
    named: number;
    /** Everyone who was named, ranked — the panel pages through them. */
    nominees: AwardStanding[];
  }[];
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
  missions: Mission[];
  checklist: Checklist;
  /** The whole room first, then each door. */
  room: RoomView[];
  /** JTI Got Talent's final standings — the ballot closed before the event. */
  talents: Talent[];
  /** Inspired By You — the other ballot, also closed before the event. */
  inspired: Inspired;
  gallery: { photos: number; likes: number; contributors: number; topMoment: string };
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

/*
 * Everything with a detail page is counted from PARTICIPANTS, so a panel and
 * its "See all" table can never disagree. Each day shows
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

/** Both ballots closed before the event, so the award's numbers are final on every day. */
const INSPIRED: Inspired = (() => {
  const [field, nonField] = INSPIRE_CATEGORY_META;
  const sent = (p: Participant, id: string) => p.inspire.some((v) => v.category === id);
  const inField = (p: Participant) => sent(p, field!.id);
  const inNonField = (p: Participant) => sent(p, nonField!.id);
  return {
    categories: INSPIRE_CATEGORY_META.map((c) => ({
      id: c.id,
      label: c.name,
      voters: count((p) => sent(p, c.id)),
    })),
    any: count((p) => p.inspire.length > 0),
    mix: [
      { label: "Both categories", value: count((p) => inField(p) && inNonField(p)) },
      { label: `${field!.id} only`, value: count((p) => inField(p) && !inNonField(p)) },
      { label: `${nonField!.id} only`, value: count((p) => !inField(p) && inNonField(p)) },
      { label: "No ballot", value: count((p) => p.inspire.length === 0) },
    ],
    eligible: PARTICIPANTS.length,
    standings: INSPIRE_CATEGORY_META.map((c) => {
      const rows = INSPIRE_STANDINGS.filter((row) => row.category === c.id);
      return {
        id: c.id,
        label: c.name,
        onBallot: count((p) => p.klass === c.id),
        named: rows.length,
        nominees: rows,
      };
    }),
  };
})();

/** Every tick is settled by the end of Day 1, so the checklist reads the same from then on. */
const CHECKLIST: Checklist = {
  preEvent: TICKS.filter((t) => t.preEvent).length,
  welcomeDinner: TICKS.filter((t) => t.welcomeDinner).length,
  talent: TICKS.filter((t) => t.talent).length,
  award: TICKS.filter((t) => t.award).length,
  complete: TICKS.filter((t) => t.preEvent && t.welcomeDinner && t.talent && t.award).length,
};

/** The one surface with no records behind it: the Gallery, held back for now. */
const AMBIENT: Record<DayKey, Pick<DayData, "gallery">> = {
  day1: {
    gallery: {
      photos: 612,
      likes: 1840,
      contributors: 246,
      topMoment: "Welcome Dinner · Infinite Night gate",
    },
  },
  day2: {
    gallery: {
      photos: 1284,
      likes: 4720,
      contributors: 318,
      topMoment: "Infinite Gala · Got Talent finale",
    },
  },
  day3: {
    gallery: {
      photos: 1502,
      likes: 6180,
      contributors: 329,
      topMoment: "Collective Time Capsule reveal",
    },
  },
};

function dayData(day: DayKey): DayData {
  const end = END_OF[day];
  const here = (p: Participant) => p.checkinAt !== null && p.checkinAt <= end;
  const asked = PARTICIPANTS.map((p) => p.questions.filter((t) => t <= end).length);
  return {
    ...AMBIENT[day],
    kpis: {
      registered: PARTICIPANTS.length,
      checkedIn: count(here),
      complete: CHECKLIST.complete,
      questions: asked.reduce((s, n) => s + n, 0),
      askers: asked.filter((n) => n > 0).length,
    },
    missions: MISSIONS,
    checklist: CHECKLIST,
    inspired: INSPIRED,
    room: [
      { id: "all", label: "All", present: count(here), test: here },
      ...CHECK_IN_EVENTS.map((e) => {
        const at = (p: Participant) => {
          const t = p.stamps[e.id];
          return t !== undefined && t <= end;
        };
        return { id: e.id, label: e.name, present: count(at), test: at };
      }),
    ].map(({ test, ...view }) => ({
      ...view,
      divisions: FUNCTIONS.map((f) => ({
        label: f,
        value: count((p) => p.fn === f && test(p)),
      })),
    })),
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
