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
  { code: "01", name: "Connect to Win", reviewed: true },
  { code: "02", name: "Infinity Quiz", reviewed: false },
  { code: "03", name: "Win Together", reviewed: true },
];

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
 * What the Redemption Corner hands out: Infinity Missions *or* a Welcome
 * Dinner game earns the sunglasses; both earn the bag as well.
 */
export const REWARDS_META = ["Sunglasses", "Sunglasses + Multifunction Bag"];

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
  reward: string | null;
  rewardAt: string;
  /** Questions sent from the microsite's Live Q&A page. */
  questions: number;
};

/** Pre-event, JTI Got Talent, Employee Award — the passport's three ticks. */
export function checklistOf(p: Participant) {
  return {
    preEvent: p.sends.some((n) => n > 0),
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
      reward:
        preEvent && dinnerGames
          ? REWARDS_META[1]!
          : preEvent || dinnerGames
            ? REWARDS_META[0]!
            : null,
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
};
export type Filter = { key: string; label: string; options: string[] };
export type DetailRow = {
  id: string;
  search: string;
  facets: Record<string, string>;
  cells: Record<string, string | number>;
};

export type MetricKey =
  "checkins" | "checklist" | "missions" | "talent" | "rewards" | "qa" | "stories";

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
  const r = rng(20261007);
  PARTICIPANTS.forEach((p) => {
    p.sends.forEach((sends, k) => {
      if (!sends) return;
      const m = MISSIONS_META[k]!;
      const status = !m.reviewed || r() > 0.38 ? "Verified" : "Waiting";
      rows.push({
        id: `${p.id}-${m.code}`,
        search: `${p.name} ${p.fn} ${m.name} ${m.code}`.toLowerCase(),
        facets: {
          mission: `${m.code} · ${m.name}`,
          fn: p.fn,
          status,
          resent: sends > 1 ? "Re-sent" : "Sent once",
        },
        cells: {
          name: p.name,
          fn: p.fn,
          mission: `${m.code} · ${m.name}`,
          first: p.firstSentAt,
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
      "Every Infinity Mission sent from the microsite. A mission can be sent again until the deadline; only the first send ticks Pre-event, re-sends are counted here.",
    filters: [
      {
        key: "mission",
        label: "Mission",
        options: MISSIONS_META.map((m) => `${m.code} · ${m.name}`),
      },
      { key: "status", label: "Status", options: ["Verified", "Waiting"] },
      { key: "resent", label: "Sends", options: ["Sent once", "Re-sent"] },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "fn", label: "Function" },
      { key: "mission", label: "Mission" },
      { key: "first", label: "First sent" },
      { key: "sends", label: "Sends", align: "right" },
      { key: "status", label: "Status" },
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

function rewardsConfig(): MetricConfig {
  const rows = PARTICIPANTS.filter((p) => p.reward).map((p) => ({
    id: `${p.id}-reward`,
    search: `${p.name} ${p.fn} ${p.reward}`.toLowerCase(),
    facets: { reward: p.reward!, fn: p.fn },
    cells: { name: p.name, fn: p.fn, reward: p.reward!, at: p.rewardAt },
  }));
  return {
    key: "rewards",
    title: "Prizes Claimed",
    description:
      "Claimed at the Redemption Corner: Infinity Missions or a Welcome Dinner game earns the sunglasses; both earn the multifunction bag as well.",
    filters: [
      { key: "reward", label: "Prize", options: [...REWARDS_META] },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "fn", label: "Function" },
      { key: "reward", label: "Prize" },
      { key: "at", label: "Claimed" },
    ],
    rows,
  };
}

function checklistConfig(): MetricConfig {
  const tick = (on: boolean) => (on ? "✓" : "—");
  const rows = PARTICIPANTS.filter((p) => p.checkedIn).map((p) => {
    const c = checklistOf(p);
    const checked = `${[c.preEvent, c.talent, c.award].filter(Boolean).length}/3`;
    return {
      id: `${p.id}-checklist`,
      search: `${p.name} ${p.id} ${p.fn}`.toLowerCase(),
      facets: { fn: p.fn, checked },
      cells: {
        name: p.name,
        id: p.id,
        fn: p.fn,
        preEvent: tick(c.preEvent),
        talent: tick(c.talent),
        award: tick(c.award),
        checked,
      },
    };
  });
  return {
    key: "checklist",
    title: "Participation Checklist",
    description:
      "The passport's three ticks: Pre-event (at least one Infinity Mission sent), JTI Got Talent (voted) and Employee Award (voted).",
    filters: [
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
      { key: "checked", label: "Checked", options: ["0/3", "1/3", "2/3", "3/3"] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "id", label: "Pass ID" },
      { key: "fn", label: "Function" },
      { key: "preEvent", label: "Pre-event" },
      { key: "talent", label: "JTI Got Talent" },
      { key: "award", label: "Employee Award" },
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

export const METRICS: Record<MetricKey, MetricConfig> = {
  checkins: checkinsConfig(),
  checklist: checklistConfig(),
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
