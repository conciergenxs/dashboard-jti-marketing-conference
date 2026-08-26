/**
 * Deterministic participant-level simulation for the 350 Market Conference
 * attendees. Drives the "See all" detail pages (search / filter / pagination).
 */

const FIRST = [
  "Dimas", "Ayu", "Rangga", "Nadia", "Bagus", "Sinta", "Fajar", "Melati", "Yoga", "Prita",
  "Arif", "Tania", "Bayu", "Gita", "Hendra", "Intan", "Joko", "Kirana", "Lukman", "Maya",
  "Nugroho", "Oki", "Putri", "Rizky", "Sari", "Teguh", "Umi", "Vino", "Wulan", "Yudha",
];

const LAST = [
  "Pratama", "Rahmawati", "Saputra", "Hakim", "Wibowo", "Lestari", "Anggara", "Kusuma",
  "Nugraha", "Maharani", "Budiman", "Dewanti", "Firmansyah", "Halim", "Iskandar", "Jayadi",
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

export const MISSIONS_META = [
  { code: "01", name: "Connect to Win", points: 100 },
  { code: "02", name: "Make More Possible", points: 250 },
  { code: "03", name: "Win Together", points: 500 },
];

export const TALENT_ACTS = [
  "Infinite Voices · Music / Band",
  "Beyond Motion · Contemporary Dance",
  "Runaway Spirit · Runway Fashion",
  "Jingle Reimagined · Music / Band",
  "Langkah Bersama · Contemporary Dance",
];

export const REWARDS_META = ["GBL Enamel Pin", "Coffee Tumbler", "GBL Reflective Sticker", "GBL Desk Lamp"];

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
  missions: boolean[];
  points: number;
  vote: string | null;
  photos: number;
  reward: string | null;
  rewardAt: string;
};

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
  const pool = buildFunctionPool();
  return Array.from({ length: 350 }, (_, i) => {
    const first = FIRST[Math.floor(r() * FIRST.length)]!;
    const last = LAST[Math.floor(r() * LAST.length)]!;
    const fn = pool[i % pool.length]!;
    const checkedIn = r() > 0.026;
    const m1 = checkedIn && r() > 0.06;
    const m2 = m1 && r() > 0.2;
    const m3 = m2 && r() > 0.24;
    const missions = [m1, m2, m3];
    const points = MISSIONS_META.reduce((s, m, k) => s + (missions[k] ? m.points : 0), 0);
    return {
      id: `JTI-${String(1001 + i)}`,
      name: `${first} ${last}`,
      fn,
      checkedIn,
      checkinAt: checkedIn ? clock(8, Math.floor(r() * 300)) : "—",
      missions,
      points,
      vote: checkedIn && r() > 0.14 ? TALENT_ACTS[Math.floor(r() * TALENT_ACTS.length)]! : null,
      photos: checkedIn ? Math.floor(r() * 9) : 0,
      reward: m3 ? REWARDS_META[Math.floor(r() * REWARDS_META.length)]! : null,
      rewardAt: clock(13, Math.floor(r() * 420)),
    };
  });
})();

export type Column = { key: string; label: string; align?: "right"; primary?: boolean };
export type DetailRow = {
  id: string;
  group: string;
  search: string;
  cells: Record<string, string | number>;
};

export type MetricKey = "checkins" | "missions" | "talent" | "rewards" | "points";

export type MetricConfig = {
  key: MetricKey;
  eyebrow: string;
  title: string;
  description: string;
  filterLabel: string;
  filterOptions: string[];
  columns: Column[];
  rows: DetailRow[];
  summary: { label: string; value: string }[];
};

const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);

function checkinsConfig(): MetricConfig {
  const rows = PARTICIPANTS.map((p) => ({
    id: p.id,
    group: p.fn,
    search: `${p.name} ${p.id} ${p.fn}`.toLowerCase(),
    cells: {
      name: p.name,
      id: p.id,
      fn: p.fn,
      checkinAt: p.checkinAt,
      status: p.checkedIn ? "Checked in" : "No show",
    },
  }));
  const checked = PARTICIPANTS.filter((p) => p.checkedIn).length;
  return {
    key: "checkins",
    eyebrow: "Infinity Pass",
    title: "Check-in Detail",
    description: "Every registered participant and their Infinity Pass scan at Hotel Tentrem.",
    filterLabel: "Function",
    filterOptions: [...FUNCTIONS],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "id", label: "Pass ID" },
      { key: "fn", label: "Function" },
      { key: "checkinAt", label: "Scan time" },
      { key: "status", label: "Status" },
    ],
    rows,
    summary: [
      { label: "Registered", value: fmt(PARTICIPANTS.length) },
      { label: "Checked in", value: fmt(checked) },
      { label: "Attendance", value: `${Math.round((checked / PARTICIPANTS.length) * 100)}%` },
    ],
  };
}

function missionsConfig(): MetricConfig {
  const rows: DetailRow[] = [];
  PARTICIPANTS.forEach((p) => {
    p.missions.forEach((done, k) => {
      if (!done) return;
      const m = MISSIONS_META[k]!;
      rows.push({
        id: `${p.id}-${m.code}`,
        group: `${m.code} · ${m.name}`,
        search: `${p.name} ${p.fn} ${m.name} ${m.code}`.toLowerCase(),
        cells: {
          name: p.name,
          fn: p.fn,
          mission: `${m.code} · ${m.name}`,
          points: m.points,
          status: "Verified",
        },
      });
    });
  });
  return {
    key: "missions",
    eyebrow: "Infinity Missions",
    title: "Mission Submissions",
    description: "Every verified mission proof submitted through the Infinity Hub.",
    filterLabel: "Mission",
    filterOptions: MISSIONS_META.map((m) => `${m.code} · ${m.name}`),
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "fn", label: "Function" },
      { key: "mission", label: "Mission" },
      { key: "points", label: "Points", align: "right" },
      { key: "status", label: "Status" },
    ],
    rows,
    summary: [
      { label: "Submissions", value: fmt(rows.length) },
      {
        label: "Points awarded",
        value: fmt(rows.reduce((s, r) => s + Number(r.cells['points']), 0)),
      },
      {
        label: "All 3 complete",
        value: fmt(PARTICIPANTS.filter((p) => p.missions.every(Boolean)).length),
      },
    ],
  };
}

function talentConfig(): MetricConfig {
  const rows = PARTICIPANTS.filter((p) => p.vote).map((p) => ({
    id: `${p.id}-vote`,
    group: p.vote!,
    search: `${p.name} ${p.fn} ${p.vote}`.toLowerCase(),
    cells: { name: p.name, fn: p.fn, act: p.vote!, at: p.checkinAt },
  }));
  return {
    key: "talent",
    eyebrow: "JTI Got Talent",
    title: "Voting Detail",
    description: "One vote per checked-in participant across the three talent categories.",
    filterLabel: "Act",
    filterOptions: [...TALENT_ACTS],
    columns: [
      { key: "name", label: "Voter", primary: true },
      { key: "fn", label: "Function" },
      { key: "act", label: "Act" },
      { key: "at", label: "Time" },
    ],
    rows,
    summary: [
      { label: "Votes cast", value: fmt(rows.length) },
      {
        label: "Turnout",
        value: `${Math.round((rows.length / PARTICIPANTS.filter((p) => p.checkedIn).length) * 100)}%`,
      },
      { label: "Acts", value: String(TALENT_ACTS.length) },
    ],
  };
}

function rewardsConfig(): MetricConfig {
  const rows = PARTICIPANTS.filter((p) => p.reward).map((p) => ({
    id: `${p.id}-reward`,
    group: p.reward!,
    search: `${p.name} ${p.fn} ${p.reward}`.toLowerCase(),
    cells: { name: p.name, fn: p.fn, reward: p.reward!, at: p.rewardAt },
  }));
  return {
    key: "rewards",
    eyebrow: "Infinity Wheel",
    title: "Reward Redemptions",
    description: "Unlocked after all three Infinity Missions are verified.",
    filterLabel: "Reward",
    filterOptions: [...REWARDS_META],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "fn", label: "Function" },
      { key: "reward", label: "Reward" },
      { key: "at", label: "Redeemed" },
    ],
    rows,
    summary: [
      { label: "Redemptions", value: fmt(rows.length) },
      { label: "Reward types", value: String(REWARDS_META.length) },
      {
        label: "Eligible",
        value: fmt(PARTICIPANTS.filter((p) => p.missions.every(Boolean)).length),
      },
    ],
  };
}

function pointsConfig(): MetricConfig {
  const rows = PARTICIPANTS.filter((p) => p.checkedIn).map((p) => ({
    id: `${p.id}-pts`,
    group: p.fn,
    search: `${p.name} ${p.id} ${p.fn}`.toLowerCase(),
    cells: {
      name: p.name,
      id: p.id,
      fn: p.fn,
      done: `${p.missions.filter(Boolean).length}/3`,
      points: p.points,
    },
  }));
  const total = rows.reduce((s, r) => s + Number(r.cells['points']), 0);
  return {
    key: "points",
    eyebrow: "Infinity Points",
    title: "Points per Participant",
    description: "Points come only from verified missions — 100 + 250 + 500 = 850 maximum.",
    filterLabel: "Function",
    filterOptions: [...FUNCTIONS],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "id", label: "Pass ID" },
      { key: "fn", label: "Function" },
      { key: "done", label: "Missions" },
      { key: "points", label: "Points", align: "right" },
    ],
    rows,
    summary: [
      { label: "Total points", value: fmt(total) },
      { label: "Average", value: `${fmt(Math.round(total / Math.max(1, rows.length)))} / 850` },
      { label: "Perfect 850", value: fmt(rows.filter((r) => r.cells['points'] === 850).length) },
    ],
  };
}

export const METRICS: Record<MetricKey, MetricConfig> = {
  checkins: checkinsConfig(),
  points: pointsConfig(),
  missions: missionsConfig(),
  talent: talentConfig(),
  rewards: rewardsConfig(),
};

export const METRIC_KEYS = Object.keys(METRICS) as MetricKey[];

/** Aggregate truth used by the dashboard KPI cards so numbers stay consistent. */
export const AGGREGATES = {
  registered: PARTICIPANTS.length,
  checkedIn: PARTICIPANTS.filter((p) => p.checkedIn).length,
  totalPoints: PARTICIPANTS.reduce((s, p) => s + p.points, 0),
  maxPoints: 850,
};
