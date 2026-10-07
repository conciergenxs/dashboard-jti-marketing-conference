import { ACTIVITIES, DATA } from "@/lib/dashboard-data";

/**
 * Deterministic participant-level simulation for the 350 Market Conference
 * attendees. Drives the "See all" detail pages (search / filter / pagination).
 */

const FIRST = [
  "Dimas",
  "Ayu",
  "Rangga",
  "Nadia",
  "Bagus",
  "Sinta",
  "Fajar",
  "Melati",
  "Yoga",
  "Prita",
  "Arif",
  "Tania",
  "Bayu",
  "Gita",
  "Hendra",
  "Intan",
  "Joko",
  "Kirana",
  "Lukman",
  "Maya",
  "Nugroho",
  "Oki",
  "Putri",
  "Rizky",
  "Sari",
  "Teguh",
  "Umi",
  "Vino",
  "Wulan",
  "Yudha",
];

const LAST = [
  "Pratama",
  "Rahmawati",
  "Saputra",
  "Hakim",
  "Wibowo",
  "Lestari",
  "Anggara",
  "Kusuma",
  "Nugraha",
  "Maharani",
  "Budiman",
  "Dewanti",
  "Firmansyah",
  "Halim",
  "Iskandar",
  "Jayadi",
];

export const FUNCTIONS = [
  "Sales & Distribution",
  "Marketing",
  "Operations",
  "Finance",
  "People & Culture",
  "Corporate Affairs",
] as const;

const FUNCTION_WEIGHTS = [116, 63, 56, 41, 36, 29];

/** The microsite's three pre-event Infinity Missions — sent or not. */
export const MISSIONS_META = [
  { code: "01", name: "Connect to Win" },
  { code: "02", name: "Infinity Quiz" },
  { code: "03", name: "Win Together" },
];

/** The only two states the microsite shows for a mission or a ballot (client, 6 Oct). */
export const SUBMITTED = "Submitted";
export const NOT_SUBMITTED = "Not Submitted";
const submission = (on: boolean) => (on ? SUBMITTED : NOT_SUBMITTED);

/** The approved acts, as the microsite's Got Talent line-up names them. */
export const TALENT_ACTS = [
  "The Infinity Sound · Music & Band",
  "Nada Beyond Limits · Music & Band",
  "Gerak Infinity · Contemporary Dance",
  "Langkah Tanpa Batas · Contemporary Dance",
  "Beyond The Runway · Entertainment & Fashion",
  "Grow Squad · Entertainment & Fashion",
];

/**
 * What the Redemption Corner hands out — the microsite's catalogue
 * (`src/lib/redemption.ts`): Sunglasses and the Multifunction Bag from JTI,
 * and AYÊM Studio's Handcrafted Leather Journal, made to each person's picks.
 */
export const PRIZES = ["Sunglasses", "Multifunction Bag", "Handcrafted Leather Journal"] as const;
export type Prize = (typeof PRIZES)[number];

/** The journal card's options, as the Redemption Checker offers them. */
const JOURNAL_LEATHERS = [
  "Synthetic Black",
  "Synthetic Light",
  "Synthetic Dark",
  "Grain Navy",
  "Grain Red",
  "Grain Blue",
  "Glow Brown",
  "Glow Maroon",
  "Matte Tan",
  "Croco Tan",
  "Croco Black",
  "Vegetan Blue",
  "Vegetan Pink",
  "Crazy Horse Red",
  "Crazy Horse Navy",
];
const JOURNAL_CORDS = [
  "Black",
  "Brown",
  "Navy",
  "Maroon",
  "Fuchsia",
  "Tosca",
  "Olive",
  "Red",
  "Cream",
  "Pink",
  "Peach",
  "Blue",
];
const JOURNAL_GROMMETS = ["Silver", "Gold"];
/** The crew logins at the Redemption Corner. */
const REDEEM_CREW = ["crew.redemption1", "crew.redemption2", "crew.redemption3"];

export type JournalPicks = { leather: string; cord: string; grommet: string; engraving: string };

/** Sample questions for the Live Q&A detail page — the real ones come from the microsite. */
const QUESTION_BANK = [
  "Apa prioritas utama JTI Indonesia untuk tahun depan?",
  "Bagaimana tim lapangan bisa berbagi praktik terbaik lintas region?",
  "What does Grow Beyond Limits mean for trade marketing next year?",
  "Bagaimana kita mengukur keberhasilan konferensi ini?",
  "Apa satu kebiasaan yang ingin Bapak/Ibu lihat dari tim kita?",
  "How will we keep the momentum going after Yogyakarta?",
  "Apa tantangan terbesar pasar kita di 2027?",
  "Bagaimana fungsi non-lapangan bisa lebih dekat dengan konsumen?",
  "What is one thing every team should start doing on Monday?",
  "Apakah akan ada program pengembangan untuk talenta muda?",
];

/** Small deterministic PRNG so server and client render identical rows. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export type Participant = {
  id: string;
  name: string;
  fn: string;
  checkedIn: boolean;
  checkinAt: string;
  /** Times each mission was sent — 0 is not yet. The first send ticks Pre-event. */
  sends: number[];
  firstSentAt: string;
  /** The act they voted for in JTI Got Talent — one vote, once the window opens. */
  vote: string | null;
  /** Both Employee Award picks in. */
  awardVote: boolean;
  /** Played at least one Welcome Dinner game booth. */
  dinnerGames: boolean;
  photos: number;
  /** What they took home from the Redemption Corner, in hand-over order. */
  prizes: Prize[];
  /** The leather journal as they ordered it; null without one. */
  journal: JournalPicks | null;
  redeemBy: string;
  rewardAt: string;
  /** Questions sent from the microsite's Live Q&A page. */
  questions: number;
};

/**
 * The passport's four ticks: Pre-event, Welcome Dinner, JTI Got Talent,
 * Employee Award. The dinner ticks on taking part at a booth, the same
 * "one is enough" rule the microsite uses for its stamps.
 */
export function checklistOf(p: Participant) {
  return {
    preEvent: p.sends.some((n) => n > 0),
    welcomeDinner: p.dinnerGames,
    talent: p.vote !== null,
    award: p.awardVote,
  };
}

function buildFunctionPool() {
  const pool: string[] = [];
  FUNCTIONS.forEach((f, i) => {
    for (let n = 0; n < FUNCTION_WEIGHTS[i]!; n++) pool.push(f);
  });
  return pool;
}

/**
 * Missions or a dinner game earns the sunglasses, both the bag as well; about
 * one in five of those served also orders the leather journal.
 */
function redemption(
  atCorner: boolean,
  preEvent: boolean,
  dinnerGames: boolean,
  name: string,
  r: () => number,
) {
  const prizes: Prize[] = [];
  if (!atCorner) return { prizes, journal: null, redeemBy: "—" };
  if (preEvent || dinnerGames) prizes.push("Sunglasses");
  if (preEvent && dinnerGames) prizes.push("Multifunction Bag");
  let journal: JournalPicks | null = null;
  if (prizes.length && r() < 0.22) {
    prizes.push("Handcrafted Leather Journal");
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join(".");
    journal = {
      leather: JOURNAL_LEATHERS[Math.floor(r() * JOURNAL_LEATHERS.length)]!,
      cord: JOURNAL_CORDS[Math.floor(r() * JOURNAL_CORDS.length)]!,
      grommet: JOURNAL_GROMMETS[Math.floor(r() * JOURNAL_GROMMETS.length)]!,
      engraving: r() < 0.3 ? "" : r() < 0.5 ? `${initials}.` : name.split(" ")[0]!,
    };
  }
  return { prizes, journal, redeemBy: REDEEM_CREW[Math.floor(r() * REDEEM_CREW.length)]! };
}

function clock(base: number, minutes: number) {
  const total = base * 60 + minutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export const PARTICIPANTS: Participant[] = (() => {
  const r = rng(20260826);
  // A stream of its own for everything added after the first cut, so names,
  // check-ins and votes stay exactly where they were.
  const rx = rng(20261006);
  const pool = buildFunctionPool();
  return Array.from({ length: 350 }, (_, i) => {
    const first = FIRST[Math.floor(r() * FIRST.length)]!;
    const last = LAST[Math.floor(r() * LAST.length)]!;
    const fn = pool[i % pool.length]!;
    const checkedIn = r() > 0.026;
    const m1 = checkedIn && r() > 0.06;
    const m2 = checkedIn && r() > 0.25;
    const m3 = checkedIn && r() > 0.42;
    const sends = [m1, m2, m3].map((sent) =>
      sent ? 1 + (rx() < 0.18 ? 1 : 0) + (rx() < 0.05 ? 1 : 0) : 0,
    );
    const vote =
      checkedIn && r() > 0.14 ? TALENT_ACTS[Math.floor(r() * TALENT_ACTS.length)]! : null;
    const awardVote = checkedIn && rx() > 0.12;
    const dinnerGames = checkedIn && rx() > 0.28;
    const preEvent = sends.some((n) => n > 0);
    return {
      id: `JTI-${String(1001 + i)}`,
      name: `${first} ${last}`,
      fn,
      checkedIn,
      checkinAt: checkedIn ? clock(8, Math.floor(r() * 300)) : "—",
      sends,
      firstSentAt: preEvent ? clock(7, Math.floor(rx() * 900)) : "—",
      vote,
      awardVote,
      dinnerGames,
      photos: checkedIn ? Math.floor(r() * 9) : 0,
      // Not everyone eligible makes it to the corner on the night.
      ...redemption(checkedIn && rx() < 0.86, preEvent, dinnerGames, `${first} ${last}`, rx),
      rewardAt: clock(19, Math.floor(rx() * 150)),
      questions: checkedIn && rx() > 0.66 ? 1 + (rx() < 0.2 ? 1 : 0) : 0,
    };
  });
})();

export type Column = {
  key: string;
  label: string;
  align?: "right";
  primary?: boolean;
  /** The column the row adds up to: given room and weight of its own. */
  total?: boolean;
  /** Submitted / Not Submitted, drawn as the microsite's badge. */
  badge?: boolean;
  /** Short values (IDs, times) that read wrong when they break. */
  nowrap?: boolean;
};
export type Filter = { key: string; label: string; options: string[] };
export type DetailRow = {
  id: string;
  search: string;
  facets: Record<string, string>;
  cells: Record<string, string | number>;
};

export type MetricKey =
  | "checkins"
  | "activities"
  | "checklist"
  | "log"
  | "missions"
  | "talent"
  | "rewards"
  | "qa"
  | "stories";

export type MetricConfig = {
  key: MetricKey;
  title: string;
  description: string;
  filters: Filter[];
  columns: Column[];
  rows: DetailRow[];
};

function checkinsConfig(): MetricConfig {
  const rows = PARTICIPANTS.map((p) => ({
    id: p.id,
    search: `${p.name} ${p.id} ${p.fn}`.toLowerCase(),
    facets: { fn: p.fn, status: p.checkedIn ? "Checked in" : "Not yet" },
    cells: {
      name: p.name,
      id: p.id,
      fn: p.fn,
      checkinAt: p.checkinAt,
      status: p.checkedIn ? "Checked in" : "Not yet",
    },
  }));
  return {
    key: "checkins",
    title: "Check-ins",
    description: "Everyone registered, and who has scanned their pass at the door.",
    filters: [
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
      { key: "status", label: "Status", options: ["Checked in", "Not yet"] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "id", label: "Pass ID" },
      { key: "fn", label: "Function" },
      { key: "checkinAt", label: "Scan time" },
      { key: "status", label: "Status" },
    ],
    rows,
  };
}

function missionsConfig(): MetricConfig {
  const rows: DetailRow[] = [];
  PARTICIPANTS.forEach((p) => {
    p.sends.forEach((sends, k) => {
      const m = MISSIONS_META[k]!;
      const status = submission(sends > 0);
      rows.push({
        id: `${p.id}-${m.code}`,
        search: `${p.name} ${p.fn} ${m.name} ${m.code}`.toLowerCase(),
        facets: {
          mission: `${m.code} · ${m.name}`,
          fn: p.fn,
          status,
          resent: sends === 0 ? "Not sent" : sends > 1 ? "Re-sent" : "Sent once",
        },
        cells: {
          name: p.name,
          fn: p.fn,
          mission: `${m.code} · ${m.name}`,
          first: sends > 0 ? p.firstSentAt : "—",
          sends,
          status,
        },
      });
    });
  });
  return {
    key: "missions",
    title: "Mission Submissions",
    description:
      "Every participant's three Infinity Missions, Submitted or Not Submitted. A mission can be sent again until the deadline; only the first send ticks Pre-event, re-sends are counted here.",
    filters: [
      {
        key: "mission",
        label: "Mission",
        options: MISSIONS_META.map((m) => `${m.code} · ${m.name}`),
      },
      { key: "status", label: "Status", options: [SUBMITTED, NOT_SUBMITTED] },
      { key: "resent", label: "Sends", options: ["Not sent", "Sent once", "Re-sent"] },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "fn", label: "Function" },
      { key: "mission", label: "Mission" },
      { key: "first", label: "First sent" },
      { key: "sends", label: "Sends", align: "right" },
      { key: "status", label: "Status", badge: true },
    ],
    rows,
  };
}

function talentConfig(): MetricConfig {
  const rows = PARTICIPANTS.filter((p) => p.vote).map((p) => ({
    id: `${p.id}-vote`,
    search: `${p.name} ${p.fn} ${p.vote}`.toLowerCase(),
    facets: { act: p.vote!, fn: p.fn },
    cells: { name: p.name, fn: p.fn, act: p.vote!, at: p.checkinAt },
  }));
  return {
    key: "talent",
    title: "Talent Votes",
    description:
      "One vote per account. The ballot stays hidden on the microsite until it opens — Wed, 18 Nov, 20.30 to 22.00.",
    filters: [
      { key: "act", label: "Act", options: [...TALENT_ACTS] },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Voter", primary: true },
      { key: "fn", label: "Function" },
      { key: "act", label: "Act" },
      { key: "at", label: "Time" },
    ],
    rows,
  };
}

export const REDEEMERS = PARTICIPANTS.filter((p) => p.prizes.length);

/** Pieces handed out per prize, from the same records the detail page lists. */
export const PRIZE_TOTALS = PRIZES.map((name) => ({
  name,
  redeemed: REDEEMERS.filter((p) => p.prizes.includes(name)).length,
}));

export const SHORT: Record<Prize, string> = {
  Sunglasses: "Sunglasses",
  "Multifunction Bag": "Bag",
  "Handcrafted Leather Journal": "Journal",
};

function journalLabel(j: JournalPicks | null) {
  if (!j) return "—";
  return [
    j.leather,
    `${j.cord} cord`,
    `${j.grommet} grommets`,
    j.engraving ? `“${j.engraving}”` : "no engraving",
  ].join(" · ");
}

function rewardsConfig(): MetricConfig {
  const rows = REDEEMERS.map((p) => {
    const set = p.prizes.map((x) => SHORT[x]).join(" + ");
    return {
      id: `${p.id}-reward`,
      search:
        `${p.name} ${p.id} ${p.fn} ${p.prizes.join(" ")} ${journalLabel(p.journal)}`.toLowerCase(),
      facets: { set, fn: p.fn, crew: p.redeemBy },
      cells: {
        name: p.name,
        id: p.id,
        fn: p.fn,
        prizes: p.prizes.map((x) => SHORT[x]).join(" · "),
        journal: journalLabel(p.journal),
        crew: p.redeemBy,
        at: p.rewardAt,
        count: `${p.prizes.length}/${PRIZES.length}`,
      },
    };
  });
  const sets = [...new Set(rows.map((r) => r.facets.set))].sort((a, b) => a.length - b.length);
  return {
    key: "rewards",
    title: "Prizes Claimed",
    description:
      "Who took what from the Redemption Corner, one row per person: Sunglasses, the Multifunction Bag and AYÊM Studio's Handcrafted Leather Journal, with the journal as ordered and the crew who handed it over.",
    filters: [
      { key: "set", label: "Prizes", options: sets },
      { key: "crew", label: "Crew", options: [...REDEEM_CREW] },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "id", label: "Pass ID", nowrap: true },
      { key: "fn", label: "Function" },
      { key: "prizes", label: "Prizes" },
      { key: "journal", label: "Leather Journal" },
      { key: "crew", label: "Crew", nowrap: true },
      { key: "at", label: "Time", nowrap: true },
      { key: "count", label: "Taken", align: "right", total: true },
    ],
    rows,
  };
}

/** When each stamp tends to land, by activity (hour of its own day). */
const STAMP_HOUR: Record<string, number> = {
  "hotel-arrival": 13,
  "welcome-arrival": 18,
  "writing-photobooth": 19,
  "move-beyond": 19,
  "infinity-crossing": 19,
  "infinity-link": 20,
  "redemption-corner": 20,
  "conference-arrival": 8,
  "infinite-race": 13,
  "gala-check-in": 18,
  "slow-motion-photobooth": 19,
};

function activitiesConfig(): MetricConfig {
  const r = rng(20261009);
  const here = PARTICIPANTS.filter((p) => p.checkedIn);
  const final = DATA.day3.activities;
  const rows: DetailRow[] = [];
  ACTIVITIES.forEach((a, k) => {
    const share = (final[k] ?? 0) / Math.max(1, here.length);
    const day = a.day === "day1" ? "Day 1" : "Day 2";
    here.forEach((p) => {
      if (r() >= share) return;
      rows.push({
        id: `${p.id}-${a.id}`,
        search: `${p.name} ${p.fn} ${a.name}`.toLowerCase(),
        facets: { activity: a.name, day, scan: a.scan, fn: p.fn },
        cells: {
          name: p.name,
          fn: p.fn,
          activity: a.name,
          day,
          scan: a.scan,
          at: clock(STAMP_HOUR[a.id] ?? 12, Math.floor(r() * 150)),
        },
      });
    });
  });
  return {
    key: "activities",
    title: "Activity Quota",
    description:
      "Every stamp on the passport's Activity Quota, self-scanned at a venue QR or scanned by the crew. The Infinite Race is one stamp for the whole race.",
    filters: [
      { key: "activity", label: "Activity", options: ACTIVITIES.map((a) => a.name) },
      { key: "day", label: "Day", options: ["Day 1", "Day 2"] },
      { key: "scan", label: "Scan", options: ["Self scan", "Crew scan"] },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "fn", label: "Function" },
      { key: "activity", label: "Activity" },
      { key: "day", label: "Day" },
      { key: "scan", label: "Scan" },
      { key: "at", label: "Time" },
    ],
    rows,
  };
}

function checklistConfig(): MetricConfig {
  const rows = PARTICIPANTS.filter((p) => p.checkedIn).map((p) => {
    const c = checklistOf(p);
    const checked = `${[c.preEvent, c.welcomeDinner, c.talent, c.award].filter(Boolean).length}/4`;
    return {
      id: `${p.id}-checklist`,
      search: `${p.name} ${p.id} ${p.fn}`.toLowerCase(),
      facets: { fn: p.fn, checked },
      cells: {
        name: p.name,
        id: p.id,
        fn: p.fn,
        preEvent: submission(c.preEvent),
        welcomeDinner: submission(c.welcomeDinner),
        talent: submission(c.talent),
        award: submission(c.award),
        checked,
      },
    };
  });
  return {
    key: "checklist",
    title: "Participation Checklist",
    description:
      "The passport's four badges, Submitted or Not Submitted: Pre-event (at least one Infinity Mission sent), Welcome Dinner (took part at a booth), JTI Got Talent (voted) and Employee Award (voted).",
    filters: [
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
      { key: "checked", label: "Checked", options: ["0/4", "1/4", "2/4", "3/4", "4/4"] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "id", label: "Pass ID" },
      { key: "fn", label: "Function" },
      { key: "preEvent", label: "Pre-event", badge: true },
      { key: "welcomeDinner", label: "Welcome Dinner", badge: true },
      { key: "talent", label: "JTI Got Talent", badge: true },
      { key: "award", label: "Employee Award", badge: true },
      { key: "checked", label: "Checked", align: "right", total: true },
    ],
    rows,
  };
}

function qaConfig(): MetricConfig {
  const r = rng(20261008);
  const rows: DetailRow[] = [];
  PARTICIPANTS.forEach((p) => {
    for (let q = 0; q < p.questions; q++) {
      const anonymous = r() < 0.3;
      const question = QUESTION_BANK[Math.floor(r() * QUESTION_BANK.length)]!;
      const roll = r();
      const status = roll < 0.22 ? "On stage" : roll < 0.9 ? "Queued" : "Removed";
      const asker = anonymous ? "Anonymous" : p.name;
      rows.push({
        id: `${p.id}-q${q}`,
        search: `${asker} ${p.fn} ${question}`.toLowerCase(),
        facets: { status, fn: anonymous ? "—" : p.fn },
        cells: {
          name: asker,
          fn: anonymous ? "—" : p.fn,
          question,
          at: clock(9, Math.floor(r() * 210)),
          status,
        },
      });
    }
  });
  return {
    key: "qa",
    title: "Live Q&A Questions",
    description:
      "Questions sent from the microsite's Live Q&A page to the stage's Audience tab. Sample rows until the event.",
    filters: [
      { key: "status", label: "Status", options: ["On stage", "Queued", "Removed"] },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Asked by", primary: true },
      { key: "fn", label: "Function" },
      { key: "question", label: "Question" },
      { key: "at", label: "Sent" },
      { key: "status", label: "Status" },
    ],
    rows,
  };
}

export const STORY_MOMENTS = [
  "Opening · Infinite Gate",
  "Breakout · Grow Beyond Session",
  "Welcome Dinner",
  "JTI Got Talent",
  "Gala Dinner",
];

export type Storyteller = { name: string; fn: string; stories: number; moment: string };

/** People who posted at least one photo story on the Growing Together wall. */
export const STORYTELLERS: Storyteller[] = PARTICIPANTS.filter((p) => p.photos > 0).map((p, i) => ({
  name: p.name,
  fn: p.fn,
  stories: p.photos,
  moment: STORY_MOMENTS[(p.name.length + i) % STORY_MOMENTS.length]!,
}));

function storiesConfig(): MetricConfig {
  const rows = STORYTELLERS.map((s, i) => ({
    id: `story-${i}`,
    search: `${s.name} ${s.fn} ${s.moment}`.toLowerCase(),
    facets: { fn: s.fn, moment: s.moment },
    cells: { name: s.name, fn: s.fn, moment: s.moment, stories: s.stories },
  }));
  return {
    key: "stories",
    title: "Stories Shared",
    description: "Photo stories posted to the Growing Together wall from the app.",
    filters: [
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
      { key: "moment", label: "Moment", options: [...STORY_MOMENTS] },
    ],
    columns: [
      { key: "name", label: "Contributor", primary: true },
      { key: "fn", label: "Function" },
      { key: "moment", label: "Latest moment" },
      { key: "stories", label: "Stories", align: "right" },
    ],
    rows,
  };
}

/** Every logged moment, newest first: the live feed with nothing left out. */
const LOG_TYPES = ["Check-in", "Stamp", "Mission", "Vote", "Reward", "Story", "Q&A"];
const LOG_DAYS = ["Day 1 · 17 Nov", "Day 2 · 18 Nov"];

function logConfig(): MetricConfig {
  const r = rng(20261106);
  /** HH:MM:SS — the seconds are what stop the newest page repeating one time. */
  const stamp = (hhmm: string) => `${hhmm}:${String(Math.floor(r() * 60)).padStart(2, "0")}`;
  // Sorted on the real values rather than read back out of the cells map.
  const entries: { row: DetailRow; day: string; at: string }[] = [];

  const add = (
    p: Participant,
    key: string,
    type: string,
    day: string,
    at: string,
    what: string,
  ) => {
    const ts = at.length === 5 ? stamp(at) : at;
    entries.push({
      day,
      at: ts,
      row: {
        id: `${p.id}-${key}`,
        search: `${p.name} ${p.id} ${p.fn} ${what}`.toLowerCase(),
        facets: { type, day, fn: p.fn },
        cells: { at: ts, name: p.name, fn: p.fn, what, type, day },
      },
    });
  };

  PARTICIPANTS.forEach((p) => {
    if (!p.checkedIn) return;
    const d1 = LOG_DAYS[0]!;
    const d2 = LOG_DAYS[1]!;

    add(p, "checkin", "Check-in", d1, p.checkinAt, "Checked in at the venue");

    p.sends.forEach((n, i) => {
      if (n === 0) return;
      const m = MISSIONS_META[i]!;
      add(p, `m${i}`, "Mission", d1, p.firstSentAt, `Sent Mission ${m.code} · ${m.name}`);
      if (n > 1)
        add(
          p,
          `m${i}-again`,
          "Mission",
          d1,
          clock(20, Math.floor(r() * 180)),
          `Re-sent Mission ${m.code} · ${m.name} (${n}×)`,
        );
    });

    if (p.dinnerGames)
      add(
        p,
        "dinner",
        "Stamp",
        d1,
        clock(19, Math.floor(r() * 150)),
        "Stamped at a Welcome Dinner booth",
      );

    if (p.prizes.length)
      add(p, "reward", "Reward", d1, p.rewardAt, `Redeemed ${p.prizes.join(", ")}`);

    if (p.vote)
      add(p, "talent", "Vote", d2, clock(20, 30 + Math.floor(r() * 85)), `Voted for ${p.vote}`);
    if (p.awardVote)
      add(
        p,
        "award",
        "Vote",
        d2,
        clock(20, 30 + Math.floor(r() * 85)),
        "Voted in the Employee Award",
      );

    if (p.photos > 0)
      add(
        p,
        "story",
        "Story",
        d2,
        clock(13, Math.floor(r() * 240)),
        `Shared ${p.photos} ${p.photos === 1 ? "story" : "stories"} to the Story Wall`,
      );

    for (let q = 0; q < p.questions; q++)
      add(p, `q${q}`, "Q&A", d2, clock(9, Math.floor(r() * 210)), "Sent a question to Live Q&A");
  });

  // Newest first, the way a log is read.
  entries.sort((a, b) => b.day.localeCompare(a.day) || b.at.localeCompare(a.at));
  const rows = entries.map((e) => e.row);

  return {
    key: "log",
    title: "Activity Log",
    description:
      "Every moment the passport recorded, newest first — check-ins, stamps, missions, votes, rewards, stories and Live Q&A. Sample rows until the event.",
    filters: [
      { key: "type", label: "Type", options: LOG_TYPES },
      { key: "day", label: "Day", options: LOG_DAYS },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "at", label: "Time" },
      { key: "name", label: "Participant", primary: true },
      { key: "fn", label: "Function" },
      { key: "what", label: "Activity" },
      { key: "type", label: "Type" },
      { key: "day", label: "Day" },
    ],
    rows,
  };
}

export const METRICS: Record<MetricKey, MetricConfig> = {
  checkins: checkinsConfig(),
  activities: activitiesConfig(),
  checklist: checklistConfig(),
  log: logConfig(),
  missions: missionsConfig(),
  talent: talentConfig(),
  rewards: rewardsConfig(),
  qa: qaConfig(),
  stories: storiesConfig(),
};

export const METRIC_KEYS = Object.keys(METRICS) as MetricKey[];

export const STORY_TOTALS = {
  stories: STORYTELLERS.reduce((s, p) => s + p.stories, 0),
  contributors: STORYTELLERS.length,
  moments: STORY_MOMENTS.length,
};

/** Aggregate truth used by the dashboard KPI cards so numbers stay consistent. */
export const AGGREGATES = (() => {
  const ticks = PARTICIPANTS.map(checklistOf);
  return {
    registered: PARTICIPANTS.length,
    checkedIn: PARTICIPANTS.filter((p) => p.checkedIn).length,
    preEvent: ticks.filter((t) => t.preEvent).length,
    talent: ticks.filter((t) => t.talent).length,
    award: ticks.filter((t) => t.award).length,
    complete: ticks.filter((t) => t.preEvent && t.talent && t.award).length,
    questions: PARTICIPANTS.reduce((s, p) => s + p.questions, 0),
    askers: PARTICIPANTS.filter((p) => p.questions > 0).length,
  };
})();
