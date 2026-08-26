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
  points: number;
  engagement: number;
};

export type Mission = {
  id: string;
  index: string;
  name: string;
  promise: string;
  points: number;
  submissions: number;
};

export type Slice = { label: string; value: number };

export type Talent = {
  id: string;
  name: string;
  act: string;
  votes: number;
};

export type DayData = {
  kpis: Kpis;
  pulse: { label: string; checkins: number; activity: number }[];
  missions: Mission[];
  functions: Slice[];
  talents: Talent[];
  gallery: { photos: number; likes: number; contributors: number; topMoment: string };
  hub: Slice[];
  rewards: { name: string; redeemed: number }[];
};

const missionBase: Omit<Mission, "submissions">[] = [
  {
    id: "m1",
    index: "01",
    name: "Connect to Win",
    promise: "Connect beyond your usual circle",
    points: 100,
  },
  {
    id: "m2",
    index: "02",
    name: "Make More Possible",
    promise: "Bring one idea to the conference floor",
    points: 250,
  },
  {
    id: "m3",
    index: "03",
    name: "Win Together",
    promise: "Turn connection into action",
    points: 500,
  },
];

const talentBase = [
  { id: "t1", name: "Infinite Voices", act: "Music · Band" },
  { id: "t2", name: "Beyond Motion", act: "Contemporary Dance" },
  { id: "t3", name: "Runaway Spirit", act: "Runway Fashion Group" },
  { id: "t4", name: "Jingle Reimagined", act: "Music · Acoustic" },
  { id: "t5", name: "Langkah Bersama", act: "Traditional Dance" },
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

export const DATA: Record<DayKey, DayData> = {
  day1: {
    kpis: { registered: 361, checkedIn: 328, points: 74250, engagement: 87 },
    pulse: pulse(10, 96, 210, 9),
    missions: missionBase.map((m, i) => ({ ...m, submissions: [287, 196, 118][i] })),
    functions: [
      { label: "Sales & Distribution", value: 118 },
      { label: "Marketing", value: 64 },
      { label: "Operations", value: 57 },
      { label: "Finance", value: 38 },
      { label: "People & Culture", value: 29 },
      { label: "Corporate Affairs", value: 22 },
    ],
    talents: talentBase.map((t, i) => ({ ...t, votes: [412, 376, 298, 241, 187][i] })),
    gallery: {
      photos: 946,
      likes: 5124,
      contributors: 274,
      topMoment: "Welcome Dinner · Infinite Night gate",
    },
    hub: [
      { label: "Personal Journey", value: 32 },
      { label: "Live Interaction", value: 27 },
      { label: "Engagement Hub", value: 24 },
      { label: "Content & Memories", value: 17 },
    ],
    rewards: [
      { name: "GBL Enamel Pin", redeemed: 164 },
      { name: "Coffee Tumbler", redeemed: 122 },
      { name: "Reflective Sticker", redeemed: 208 },
      { name: "GBL Desk Lamp", redeemed: 61 },
    ],
  },
  day2: {
    kpis: { registered: 368, checkedIn: 351, points: 148900, engagement: 93 },
    pulse: pulse(11, 128, 340, 8),
    missions: missionBase.map((m, i) => ({ ...m, submissions: [341, 268, 214][i] })),
    functions: [
      { label: "Sales & Distribution", value: 126 },
      { label: "Marketing", value: 69 },
      { label: "Operations", value: 61 },
      { label: "Finance", value: 41 },
      { label: "People & Culture", value: 31 },
      { label: "Corporate Affairs", value: 23 },
    ],
    talents: talentBase.map((t, i) => ({ ...t, votes: [688, 731, 522, 470, 388][i] })),
    gallery: {
      photos: 2184,
      likes: 13470,
      contributors: 331,
      topMoment: "Gala Dinner · Jingle grand finale",
    },
    hub: [
      { label: "Personal Journey", value: 21 },
      { label: "Live Interaction", value: 34 },
      { label: "Engagement Hub", value: 28 },
      { label: "Content & Memories", value: 17 },
    ],
    rewards: [
      { name: "GBL Enamel Pin", redeemed: 248 },
      { name: "Coffee Tumbler", redeemed: 219 },
      { name: "Reflective Sticker", redeemed: 302 },
      { name: "GBL Desk Lamp", redeemed: 137 },
    ],
  },
  day3: {
    kpis: { registered: 368, checkedIn: 344, points: 172400, engagement: 89 },
    pulse: pulse(8, 74, 180, 7),
    missions: missionBase.map((m, i) => ({ ...m, submissions: [352, 291, 246][i] })),
    functions: [
      { label: "Sales & Distribution", value: 124 },
      { label: "Marketing", value: 68 },
      { label: "Operations", value: 59 },
      { label: "Finance", value: 40 },
      { label: "People & Culture", value: 30 },
      { label: "Corporate Affairs", value: 23 },
    ],
    talents: talentBase.map((t, i) => ({ ...t, votes: [742, 809, 566, 498, 402][i] })),
    gallery: {
      photos: 2461,
      likes: 15980,
      contributors: 344,
      topMoment: "Collective Time Capsule reveal",
    },
    hub: [
      { label: "Personal Journey", value: 18 },
      { label: "Live Interaction", value: 22 },
      { label: "Engagement Hub", value: 24 },
      { label: "Content & Memories", value: 36 },
    ],
    rewards: [
      { name: "GBL Enamel Pin", redeemed: 271 },
      { name: "Coffee Tumbler", redeemed: 244 },
      { name: "Reflective Sticker", redeemed: 318 },
      { name: "GBL Desk Lamp", redeemed: 158 },
    ],
  },
};

export const FEED_TEMPLATES = [
  { kind: "checkin", text: "scanned their Infinity Pass at the main hall" },
  { kind: "mission", text: "completed Mission 01 · Connect to Win" },
  { kind: "mission", text: "submitted Mission 02 · Make More Possible" },
  { kind: "mission", text: "unlocked Mission 03 · Win Together" },
  { kind: "photo", text: "uploaded a moment to Growing Together" },
  { kind: "vote", text: "voted in JTI Got Talent" },
  { kind: "reward", text: "redeemed a reward from the Infinity Wheel" },
] as const;

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
