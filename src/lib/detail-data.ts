import type { DayKey } from "@/lib/dashboard-data";

/**
 * Deterministic participant-level simulation for the 350 Market Conference
 * attendees. Every number on the dashboard that has a "See all" page is
 * counted from these records — the panels and their detail tables read the
 * same rows, so they always agree.
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
 * Both ballots run before the event (client, 7 Oct), so on every event day
 * they are closed and their numbers are final.
 * JTI Got Talent: one vote, Mon 26 Oct – Mon 2 Nov; the Top 3 are announced
 * Thu 5 Nov.
 */
export const TALENT_VOTE = { opens: "Mon, 26 Oct", closes: "Mon, 2 Nov", announced: "Thu, 5 Nov" };

/**
 * Inspired By You, the peer award ("Inspire Awards" until the client renamed
 * it, 20 Oct): Mon 26 Oct – Fri 6 Nov, a vote in Field, Non-Field or both,
 * each final. Every registered participant is on the ballot and may vote in
 * each category once, so the eligible population is the whole roster.
 */
export const INSPIRE_VOTE = { opens: "Mon, 26 Oct", closes: "Fri, 6 Nov" };
export const INSPIRE_CATEGORIES = ["Field", "Non-Field"] as const;
export type InspireCategory = (typeof INSPIRE_CATEGORIES)[number];

/** The two categories as the microsite's ballot names them. */
export const INSPIRE_CATEGORY_META: { id: InspireCategory; name: string }[] = [
  { id: "Field", name: "Field Employee" },
  { id: "Non-Field", name: "Non-Field Employee" },
];

/**
 * What the Redemption Corner hands out — the microsite's catalogue
 * (`src/lib/redemption.ts`): Sunglasses and the Multifunction Bag from JTI,
 * and AYÊM Studio's Handcrafted Leather Journal. The journal is handed over
 * like the others; nothing is customised at the corner.
 */
export const PRIZES = ["Sunglasses", "Multifunction Bag", "Handcrafted Leather Journal"] as const;
export type Prize = (typeof PRIZES)[number];

/** The crew logins at the Redemption Corner. */
const REDEEM_CREW = ["crew.redemption1", "crew.redemption2", "crew.redemption3"];

/**
 * The passport's Activity Quota, as the client approved it on 7 Oct: eight
 * stamps, one each. The crew scans the participant's QR everywhere except The
 * Infinite Race, where participants scan the venue QR themselves — one stamp
 * for the whole race, no phases.
 */
export const ACTIVITIES = [
  { id: "welcome-arrival", name: "Welcome Dinner Arrival", day: "day1", scan: "Crew scan" },
  { id: "infinity-crossing", name: "Infinity Crossing", day: "day1", scan: "Crew scan" },
  { id: "infinity-link", name: "Infinity Link", day: "day1", scan: "Crew scan" },
  { id: "move-beyond", name: "Move Beyond", day: "day1", scan: "Crew scan" },
  { id: "redemption-corner", name: "Redemption Corner", day: "day1", scan: "Crew scan" },
  { id: "conference-arrival", name: "Morning Market Conference", day: "day2", scan: "Crew scan" },
  { id: "infinite-race", name: "The Infinite Race", day: "day2", scan: "Self scan" },
  { id: "gala-check-in", name: "Infinite Gala", day: "day2", scan: "Crew scan" },
] as const satisfies readonly { id: string; name: string; day: DayKey; scan: string }[];
export type ActivityId = (typeof ACTIVITIES)[number]["id"];

export const ACTIVITY_DAYS = [
  { day: "day1", label: "Day 1", caption: "17 Nov · Welcome Dinner" },
  { day: "day2", label: "Day 2", caption: "18 Nov · Conference, Race & Gala" },
] as const;

/** The Welcome Dinner's three game booths. */
const BOOTHS: ActivityId[] = ["infinity-crossing", "infinity-link", "move-beyond"];
const BOOTH_ODDS = [0.72, 0.6, 0.68];

/** Sample questions for the Q&A detail page — the real ones come from the microsite. */
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

/* ── Time ─────────────────────────────────────────────────────────────── */

export const EVENT_DATES = { day1: "2026-11-17", day2: "2026-11-18" } as const;
/** Mon 26 Oct 2026, when both ballots open. */
const BALLOTS_OPEN = Date.UTC(2026, 9, 26);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

/** A sortable moment, "2026-11-17 18:42:10". Minutes may run past the hour. */
function moment(date: string, hour: number, minutes: number, seconds: number) {
  const total = hour * 60 + Math.floor(minutes);
  return `${date} ${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}:${pad(Math.floor(seconds))}`;
}

/** A moment inside the ballot window: at most `days` after 26 Oct, 07.00–23.00. */
function ballotMoment(days: number, r: () => number) {
  const date = new Date(BALLOTS_OPEN + Math.floor(r() * (days + 1)) * 86_400_000);
  return moment(date.toISOString().slice(0, 10), 7, r() * 960, r() * 60);
}

/** "17 Nov" */
const shortDate = (t: string) => `${Number(t.slice(8, 10))} ${MONTHS[Number(t.slice(5, 7)) - 1]}`;
/** "18:42" */
const hhmm = (t: string) => t.slice(11, 16);
/** "17 Nov · 18:42" — the one way a table shows a moment. */
export const when = (t: string | null) => (t ? `${shortDate(t)} · ${hhmm(t)}` : "—");

/* ── Participants ─────────────────────────────────────────────────────── */

export type Participant = {
  id: string;
  name: string;
  fn: string;
  checkedIn: boolean;
  /**
   * The first time the crew scanned them in: at the Welcome Dinner door on
   * Day 1, or at the Morning Market Conference for the few who arrive on Day 2.
   */
  checkinAt: string | null;
  /** Times each mission was sent — 0 is not yet. The first send ticks Pre-event. */
  sends: number[];
  /** When each mission was first sent. */
  sentAt: (string | null)[];
  /** The last re-send of each mission, if there was one. */
  resentAt: (string | null)[];
  /** The act they voted for in JTI Got Talent — one vote, cast before the event. */
  vote: string | null;
  voteAt: string | null;
  /** Inspired By You ballots: Field, Non-Field or both, cast before the event. */
  inspire: { category: InspireCategory; at: string }[];
  /** Played at least one Welcome Dinner game booth. */
  dinnerGames: boolean;
  /** Activity Quota stamps, keyed by activity, with when each landed. */
  stamps: Partial<Record<ActivityId, string>>;
  photos: number;
  storyAt: string | null;
  /** What they took home from the Redemption Corner, in hand-over order. */
  prizes: Prize[];
  redeemBy: string;
  rewardAt: string | null;
  /** When each question was sent from the microsite's Q&A page. */
  questions: string[];
};

/**
 * The passport's four ticks: Pre-event, Welcome Dinner, JTI Got Talent,
 * Inspired By You. The dinner ticks on taking part at a booth, the award on a
 * vote in at least one category — the same "one is enough" rule the microsite
 * uses. All four are settled by the end of Day 1.
 */
export function checklistOf(p: Participant) {
  return {
    preEvent: p.sends.some((n) => n > 0),
    welcomeDinner: p.dinnerGames,
    talent: p.vote !== null,
    award: p.inspire.length > 0,
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
 * one in five of those served also takes the leather journal.
 */
function redemption(atCorner: boolean, preEvent: boolean, dinnerGames: boolean, r: () => number) {
  const prizes: Prize[] = [];
  if (!atCorner) return { prizes, redeemBy: "—" };
  if (preEvent || dinnerGames) prizes.push("Sunglasses");
  if (preEvent && dinnerGames) prizes.push("Multifunction Bag");
  if (prizes.length && r() < 0.22) prizes.push("Handcrafted Leather Journal");
  return { prizes, redeemBy: REDEEM_CREW[Math.floor(r() * REDEEM_CREW.length)]! };
}

/** Missions are sent from 07.00 on Day 1 and close at 23.59: minutes after 07.00. */
const MISSIONS_CLOSE = 16 * 60 + 59;

export const PARTICIPANTS: Participant[] = (() => {
  const r = rng(20260826);
  // A stream of its own for everything added after the first cut, so names,
  // check-ins and votes stay exactly where they were.
  const rx = rng(20261006);
  // And one for the 7 Oct model: arrival day, stamps, ballot dates and times.
  const rs = rng(20261007);
  const pool = buildFunctionPool();
  const d1 = EVENT_DATES.day1;
  const d2 = EVENT_DATES.day2;

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
    const inspireVoter = checkedIn && rx() > 0.12;
    // Most arrive for the Welcome Dinner; a few are first scanned in on Day 2.
    const day1 = checkedIn && rs() > 0.07;
    const dinnerGames = checkedIn && rx() > 0.28 && day1;
    const preEvent = sends.some((n) => n > 0);

    // Day 1 runs in minutes after 18.00, Day 2's door in minutes after 07.00.
    const arrival = checkedIn ? r() : 0;
    const arrivedAt = day1 ? arrival * 75 : 30 + arrival * 75;
    const checkinAt = !checkedIn
      ? null
      : day1
        ? moment(d1, 18, arrivedAt, rs() * 60)
        : moment(d2, 7, arrivedAt, rs() * 60);

    const firstSend = preEvent ? Math.floor(rx() * 900) : 0;
    const sentMin = sends.map((n, k) => (n ? Math.min(900, firstSend + k * rs() * 50) : null));
    const sentAt = sentMin.map((m) => (m === null ? null : moment(d1, 7, m, rs() * 60)));
    const resentAt = sentMin.map((m, k) =>
      m !== null && sends[k]! > 1
        ? moment(d1, 7, m + 5 + rs() * (MISSIONS_CLOSE - m - 5), rs() * 60)
        : null,
    );

    const photos = checkedIn ? Math.floor(r() * 9) : 0;
    const { prizes, redeemBy } = redemption(
      // Not everyone eligible makes it to the corner on the night.
      checkedIn && rx() < 0.86 && day1,
      preEvent,
      dinnerGames,
      rx,
    );
    const rewardRoll = rx();
    const questionCount = checkedIn && rx() > 0.66 ? 1 + (rx() < 0.2 ? 1 : 0) : 0;

    // ── Activity Quota ──
    const stamps: Partial<Record<ActivityId, string>> = {};
    let lastOnDay1 = arrivedAt;
    if (day1 && checkinAt) {
      stamps["welcome-arrival"] = checkinAt;
      if (dinnerGames) {
        const played = BOOTHS.filter((_, k) => rs() < BOOTH_ODDS[k]!);
        if (!played.length) played.push(BOOTHS[Math.floor(rs() * BOOTHS.length)]!);
        played.forEach((b) => {
          const m = 75 + rs() * 105;
          lastOnDay1 = Math.max(lastOnDay1, m);
          stamps[b] = moment(d1, 18, m, rs() * 60);
        });
      }
    }
    // The first hand-over stamps the Redemption Corner, after the games.
    const rewardAt = prizes.length
      ? moment(d1, 18, Math.min(270, lastOnDay1 + 5 + rewardRoll * 45), rs() * 60)
      : null;
    if (rewardAt) stamps["redemption-corner"] = rewardAt;

    if (checkinAt) {
      const atConference = !day1 || rs() < 0.97;
      if (atConference)
        stamps["conference-arrival"] = day1 ? moment(d2, 7, 30 + rs() * 75, rs() * 60) : checkinAt;
      if (atConference && rs() < 0.95)
        stamps["infinite-race"] = moment(d2, 13, rs() * 120, rs() * 60);
      if (rs() < 0.96) stamps["gala-check-in"] = moment(d2, 18, 30 + rs() * 90, rs() * 60);
    }

    // ── Ballots, cast before the event ──
    const voteAt = vote ? ballotMoment(7, rs) : null;
    const inspire: Participant["inspire"] = [];
    if (inspireVoter) {
      const roll = rs();
      const cats: InspireCategory[] =
        roll < 0.6 ? [...INSPIRE_CATEGORIES] : roll < 0.82 ? ["Field"] : ["Non-Field"];
      cats.forEach((category) => inspire.push({ category, at: ballotMoment(11, rs) }));
    }

    const questions = Array.from({ length: questionCount }, () =>
      day1 && rs() < 0.1
        ? moment(d1, 19, rs() * 180, rs() * 60)
        : moment(d2, 9, rs() * 210, rs() * 60),
    );

    return {
      id: `JTI-${String(1001 + i)}`,
      name: `${first} ${last}`,
      fn,
      checkedIn,
      checkinAt,
      sends,
      sentAt,
      resentAt,
      vote,
      voteAt,
      inspire,
      dinnerGames,
      stamps,
      photos,
      storyAt: photos > 0 ? moment(d2, 13, rs() * 240, rs() * 60) : null,
      prizes,
      redeemBy,
      rewardAt,
      questions,
    };
  });
})();

/** Final standings: each act's votes, most first. */
export const TALENT_STANDINGS = TALENT_ACTS.map((act) => ({
  act,
  votes: PARTICIPANTS.filter((p) => p.vote === act).length,
})).sort((a, b) => b.votes - a.votes);
const TOP_3 = new Set(TALENT_STANDINGS.slice(0, 3).map((s) => s.act));

/* ── Detail pages ─────────────────────────────────────────────────────── */

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
  | "missions"
  | "talent"
  | "inspire"
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

const FIRST_SCAN = ["Welcome Dinner", "Morning Market Conference"];

function checkinsConfig(): MetricConfig {
  const rows = PARTICIPANTS.map((p) => {
    const status = p.checkedIn ? "Checked in" : "Not yet";
    const where = !p.checkedIn
      ? "—"
      : p.stamps["welcome-arrival"]
        ? FIRST_SCAN[0]!
        : FIRST_SCAN[1]!;
    return {
      id: p.id,
      search: `${p.name} ${p.id} ${p.fn}`.toLowerCase(),
      facets: { fn: p.fn, where, status },
      cells: {
        name: p.name,
        id: p.id,
        fn: p.fn,
        where,
        checkinAt: when(p.checkinAt),
        status,
      },
    };
  });
  return {
    key: "checkins",
    title: "Check-ins",
    description:
      "Everyone registered, and where the crew first scanned them in: the Welcome Dinner on 17 Nov, or the Morning Market Conference for those arriving on 18 Nov.",
    filters: [
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
      { key: "where", label: "First scan", options: FIRST_SCAN },
      { key: "status", label: "Status", options: ["Checked in", "Not yet"] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "id", label: "Pass ID", nowrap: true },
      { key: "fn", label: "Function" },
      { key: "where", label: "First scan" },
      { key: "checkinAt", label: "Scan time", nowrap: true },
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
          first: when(p.sentAt[k] ?? null),
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
      { key: "first", label: "First sent", nowrap: true },
      { key: "sends", label: "Sends", align: "right" },
      { key: "status", label: "Status", badge: true },
    ],
    rows,
  };
}

const STANDING = ["Top 3", "Rest of the line-up"];

function talentConfig(): MetricConfig {
  const rows = PARTICIPANTS.filter((p) => p.vote).map((p) => ({
    id: `${p.id}-vote`,
    search: `${p.name} ${p.fn} ${p.vote}`.toLowerCase(),
    facets: { act: p.vote!, standing: STANDING[TOP_3.has(p.vote!) ? 0 : 1]!, fn: p.fn },
    cells: { name: p.name, fn: p.fn, act: p.vote!, at: when(p.voteAt) },
  }));
  return {
    key: "talent",
    title: "Talent Votes",
    description: `One vote per account, final once cast. Voting ran ${TALENT_VOTE.opens} – ${TALENT_VOTE.closes}, before the event; the Top 3 were announced ${TALENT_VOTE.announced}.`,
    filters: [
      { key: "act", label: "Act", options: TALENT_STANDINGS.map((s) => s.act) },
      { key: "standing", label: "Standing", options: STANDING },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Voter", primary: true },
      { key: "fn", label: "Function" },
      { key: "act", label: "Act" },
      { key: "at", label: "Voted", nowrap: true },
    ],
    rows,
  };
}

/** Only what the committee may see before the Gala: whether a ballot was sent. */
const INSPIRE_SENT = ["Both", "Field only", "Non-Field only", "None"];

/**
 * Inspired By You, as participation. The microsite keeps the peer award's
 * tally sealed until The Infinity Gala on purpose — a running scoreboard of
 * who is ahead in an award about colleagues invites the wrong behaviour — so
 * this page reports who sent a ballot in each category and never who they
 * picked.
 */
function inspiredConfig(): MetricConfig {
  const rows = PARTICIPANTS.map((p) => {
    const cast = new Set(p.inspire.map((v) => v.category));
    const field = cast.has("Field");
    const nonField = cast.has("Non-Field");
    const sent =
      field && nonField
        ? INSPIRE_SENT[0]!
        : field
          ? INSPIRE_SENT[1]!
          : nonField
            ? INSPIRE_SENT[2]!
            : INSPIRE_SENT[3]!;
    const first = p.inspire.map((v) => v.at).sort()[0] ?? null;
    return {
      id: `${p.id}-inspired`,
      search: `${p.name} ${p.id} ${p.fn}`.toLowerCase(),
      facets: { fn: p.fn, sent },
      cells: {
        name: p.name,
        id: p.id,
        fn: p.fn,
        field: submission(field),
        nonField: submission(nonField),
        at: when(first),
        ballots: `${cast.size}/${INSPIRE_CATEGORIES.length}`,
      },
    };
  });
  return {
    key: "inspire",
    title: "Inspired By You",
    description: `Who sent a ballot in each category, Submitted or Not Submitted — everyone registered is eligible for both. One vote per category and one is enough; voting ran ${INSPIRE_VOTE.opens} – ${INSPIRE_VOTE.closes}, before the event. Who each person picked stays sealed until The Infinity Gala.`,
    filters: [
      { key: "sent", label: "Ballot", options: INSPIRE_SENT },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "id", label: "Pass ID", nowrap: true },
      { key: "fn", label: "Function" },
      { key: "field", label: "Field Employee", badge: true },
      { key: "nonField", label: "Non-Field Employee", badge: true },
      { key: "at", label: "First sent", nowrap: true },
      { key: "ballots", label: "Ballots", align: "right", total: true },
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

function rewardsConfig(): MetricConfig {
  const rows = REDEEMERS.map((p) => {
    const set = p.prizes.map((x) => SHORT[x]).join(" + ");
    return {
      id: `${p.id}-reward`,
      search: `${p.name} ${p.id} ${p.fn} ${p.prizes.join(" ")}`.toLowerCase(),
      facets: { set, fn: p.fn, crew: p.redeemBy },
      cells: {
        name: p.name,
        id: p.id,
        fn: p.fn,
        prizes: p.prizes.map((x) => SHORT[x]).join(" · "),
        crew: p.redeemBy,
        at: when(p.rewardAt),
        count: `${p.prizes.length}/${PRIZES.length}`,
      },
    };
  });
  const sets = [...new Set(rows.map((r) => r.facets.set))].sort((a, b) => a.length - b.length);
  return {
    key: "rewards",
    title: "Prizes Claimed",
    description:
      "Who took what from the Redemption Corner on 17 Nov, one row per person — Sunglasses, the Multifunction Bag and the Handcrafted Leather Journal — and the crew who handed it over.",
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
      { key: "crew", label: "Crew", nowrap: true },
      { key: "at", label: "Time", nowrap: true },
      { key: "count", label: "Taken", align: "right", total: true },
    ],
    rows,
  };
}

function activitiesConfig(): MetricConfig {
  const rows: DetailRow[] = [];
  ACTIVITIES.forEach((a) => {
    const day = a.day === "day1" ? "Day 1" : "Day 2";
    PARTICIPANTS.forEach((p) => {
      const t = p.stamps[a.id];
      if (!t) return;
      rows.push({
        id: `${p.id}-${a.id}`,
        search: `${p.name} ${p.fn} ${a.name}`.toLowerCase(),
        facets: { activity: a.name, day, scan: a.scan, fn: p.fn },
        cells: { name: p.name, fn: p.fn, activity: a.name, day, scan: a.scan, at: hhmm(t) },
      });
    });
  });
  return {
    key: "activities",
    title: "Activity Quota",
    description: `Every stamp on the passport's Activity Quota: ${ACTIVITIES.length} activities, one stamp each. The crew scans the participant's QR everywhere except The Infinite Race, where participants scan the venue QR themselves — one stamp for the whole race.`,
    filters: [
      { key: "activity", label: "Activity", options: ACTIVITIES.map((a) => a.name) },
      { key: "day", label: "Day", options: ["Day 1", "Day 2"] },
      { key: "scan", label: "Scan", options: ["Crew scan", "Self scan"] },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "fn", label: "Function" },
      { key: "activity", label: "Activity" },
      { key: "day", label: "Day" },
      { key: "scan", label: "Scan" },
      { key: "at", label: "Time", nowrap: true },
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
      "The passport's four badges, Submitted or Not Submitted: Pre-event (at least one Infinity Mission sent), Welcome Dinner (took part at a booth), JTI Got Talent (voted) and Inspired By You (voted in Field, Non-Field or both).",
    filters: [
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
      { key: "checked", label: "Checked", options: ["0/4", "1/4", "2/4", "3/4", "4/4"] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "id", label: "Pass ID", nowrap: true },
      { key: "fn", label: "Function" },
      { key: "preEvent", label: "Pre-event", badge: true },
      { key: "welcomeDinner", label: "Welcome Dinner", badge: true },
      { key: "talent", label: "JTI Got Talent", badge: true },
      { key: "award", label: "Inspired By You", badge: true },
      { key: "checked", label: "Checked", align: "right", total: true },
    ],
    rows,
  };
}

function qaConfig(): MetricConfig {
  const r = rng(20261008);
  const rows: DetailRow[] = [];
  PARTICIPANTS.forEach((p) => {
    p.questions.forEach((sentAt, q) => {
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
          at: when(sentAt),
          status,
        },
      });
    });
  });
  return {
    key: "qa",
    title: "Q&A Questions",
    description:
      "Questions sent from the microsite's Q&A page to the stage's Audience tab, one row per question.",
    filters: [
      { key: "status", label: "Status", options: ["On stage", "Queued", "Removed"] },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Asked by", primary: true },
      { key: "fn", label: "Function" },
      { key: "question", label: "Question" },
      { key: "at", label: "Sent", nowrap: true },
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

/** "17 Nov" never breaks across a line in a description. */
const keepDates = (c: MetricConfig): MetricConfig => ({
  ...c,
  description: c.description.replace(/\b(\d{1,2}) (Oct|Nov)\b/g, "$1\u00a0$2"),
});

export const METRICS: Record<MetricKey, MetricConfig> = {
  checkins: keepDates(checkinsConfig()),
  activities: keepDates(activitiesConfig()),
  checklist: keepDates(checklistConfig()),
  missions: keepDates(missionsConfig()),
  talent: keepDates(talentConfig()),
  inspire: keepDates(inspiredConfig()),
  rewards: keepDates(rewardsConfig()),
  qa: keepDates(qaConfig()),
  stories: keepDates(storiesConfig()),
};

export const METRIC_KEYS = Object.keys(METRICS) as MetricKey[];

export const STORY_TOTALS = {
  stories: STORYTELLERS.reduce((s, p) => s + p.stories, 0),
  contributors: STORYTELLERS.length,
  moments: STORY_MOMENTS.length,
};
