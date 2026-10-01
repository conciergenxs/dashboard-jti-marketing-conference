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

export const MISSIONS_META = [
  { code: "01", name: "Connect to Win", points: 100 },
  { code: "02", name: "Make More Possible", points: 250 },
  { code: "03", name: "Win Together", points: 500 },
];

/**
 * The on-site activities, as the microsite passport runs them: each stamp is
 * worth `points`, up to `quota` stamps per person.
 */
export const ACTIVITIES_META = [
  { name: "Writing Photobooth", points: 100, quota: 1 },
  { name: "Infinity Link", points: 150, quota: 1 },
  { name: "Infinity Crossing", points: 200, quota: 2 },
  { name: "Collective Maze Move", points: 250, quota: 2 },
  { name: "Move Beyond", points: 250, quota: 2 },
  { name: "Infinite Race · M1", points: 300, quota: 1 },
  { name: "Infinite Race · M2", points: 300, quota: 1 },
  { name: "Infinite Race · M3", points: 300, quota: 1 },
  { name: "Infinite Race · M4", points: 300, quota: 1 },
];

export const MISSION_MAX_POINTS = MISSIONS_META.reduce((s, m) => s + m.points, 0);
export const ACTIVITY_MAX_POINTS = ACTIVITIES_META.reduce((s, a) => s + a.points * a.quota, 0);

export const TALENT_ACTS = [
  "Infinite Voices · Music / Band",
  "Beyond Motion · Contemporary Dance",
  "Runaway Spirit · Runway Fashion",
  "Jingle Reimagined · Music / Band",
  "Langkah Bersama · Contemporary Dance",
];

export const REWARDS_META = [
  "GBL Enamel Pin",
  "Coffee Tumbler",
  "GBL Reflective Sticker",
  "GBL Desk Lamp",
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
  missions: boolean[];
  /** From approved Infinity Missions. */
  missionPoints: number;
  /** From activity stamps at the venue. */
  activityPoints: number;
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
  // A stream of its own, so adding activity stamps left every other number
  // (names, check-ins, missions, votes) exactly where it was.
  const ra = rng(20261117);
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
    const missionPoints = MISSIONS_META.reduce((s, m, k) => s + (missions[k] ? m.points : 0), 0);
    const activityPoints = checkedIn
      ? ACTIVITIES_META.reduce((s, a) => {
          const stamps = Math.floor(ra() * (a.quota + 1.6));
          return s + Math.min(stamps, a.quota) * a.points;
        }, 0)
      : 0;
    return {
      id: `JTI-${String(1001 + i)}`,
      name: `${first} ${last}`,
      fn,
      checkedIn,
      checkinAt: checkedIn ? clock(8, Math.floor(r() * 300)) : "—",
      missions,
      missionPoints,
      activityPoints,
      points: missionPoints + activityPoints,
      vote: checkedIn && r() > 0.14 ? TALENT_ACTS[Math.floor(r() * TALENT_ACTS.length)]! : null,
      photos: checkedIn ? Math.floor(r() * 9) : 0,
      reward: m3 ? REWARDS_META[Math.floor(r() * REWARDS_META.length)]! : null,
      rewardAt: clock(13, Math.floor(r() * 420)),
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

export type MetricKey = "checkins" | "missions" | "talent" | "rewards" | "points" | "stories";

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
    p.missions.forEach((done, k) => {
      if (!done) return;
      const m = MISSIONS_META[k]!;
      rows.push({
        id: `${p.id}-${m.code}`,
        search: `${p.name} ${p.fn} ${m.name} ${m.code}`.toLowerCase(),
        facets: { mission: `${m.code} · ${m.name}`, fn: p.fn },
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
    title: "Mission Submissions",
    description: "Every mission proof the crew has approved in the app.",
    filters: [
      {
        key: "mission",
        label: "Mission",
        options: MISSIONS_META.map((m) => `${m.code} · ${m.name}`),
      },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "fn", label: "Function" },
      { key: "mission", label: "Mission" },
      { key: "points", label: "Points", align: "right" },
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
    description: "One vote per colleague who has checked in.",
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
    title: "Reward Redemptions",
    description: "Rewards claimed on the Infinity Wheel after all three missions are approved.",
    filters: [
      { key: "reward", label: "Reward", options: [...REWARDS_META] },
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "fn", label: "Function" },
      { key: "reward", label: "Reward" },
      { key: "at", label: "Redeemed" },
    ],
    rows,
  };
}

function pointsConfig(): MetricConfig {
  const rows = PARTICIPANTS.filter((p) => p.checkedIn).map((p) => {
    const done = `${p.missions.filter(Boolean).length}/3`;
    return {
      id: `${p.id}-pts`,
      search: `${p.name} ${p.id} ${p.fn}`.toLowerCase(),
      facets: { fn: p.fn, done },
      cells: {
        name: p.name,
        id: p.id,
        fn: p.fn,
        done,
        missionPoints: p.missionPoints.toLocaleString("en-US"),
        activityPoints: p.activityPoints.toLocaleString("en-US"),
        points: p.points.toLocaleString("en-US"),
      },
    };
  });
  return {
    key: "points",
    title: "Points per Person",
    description: `Points from approved Infinity Missions (up to ${MISSION_MAX_POINTS.toLocaleString("en-US")}) and activity stamps at the venue (up to ${ACTIVITY_MAX_POINTS.toLocaleString("en-US")}).`,
    filters: [
      { key: "fn", label: "Function", options: [...FUNCTIONS] },
      { key: "done", label: "Missions done", options: ["0/3", "1/3", "2/3", "3/3"] },
    ],
    columns: [
      { key: "name", label: "Participant", primary: true },
      { key: "id", label: "Pass ID" },
      { key: "fn", label: "Function" },
      { key: "done", label: "Missions" },
      { key: "missionPoints", label: "Mission pts", align: "right" },
      { key: "activityPoints", label: "Activity pts", align: "right" },
      { key: "points", label: "Total", align: "right", total: true },
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
  points: pointsConfig(),
  missions: missionsConfig(),
  talent: talentConfig(),
  rewards: rewardsConfig(),
  stories: storiesConfig(),
};

export const METRIC_KEYS = Object.keys(METRICS) as MetricKey[];

export const STORY_TOTALS = {
  stories: STORYTELLERS.reduce((s, p) => s + p.stories, 0),
  contributors: STORYTELLERS.length,
  moments: STORY_MOMENTS.length,
};

/** Aggregate truth used by the dashboard KPI cards so numbers stay consistent. */
export const AGGREGATES = {
  registered: PARTICIPANTS.length,
  checkedIn: PARTICIPANTS.filter((p) => p.checkedIn).length,
  totalPoints: PARTICIPANTS.reduce((s, p) => s + p.points, 0),
  maxPoints: MISSION_MAX_POINTS + ACTIVITY_MAX_POINTS,
};
