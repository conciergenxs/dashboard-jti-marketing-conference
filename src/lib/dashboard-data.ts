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
    kpis: { registered: 342, checkedIn: 318, points: 98600, engagement: 84 },
    pulse: pulse(10, 96, 210, 9),
    missions: missionBase.map((m, i) => ({ ...m, submissions: [268, 179, 104][i]! })),
    functions: [
      { label: "Sales & Distribution", value: 108 },
      { label: "Marketing", value: 58 },
      { label: "Operations", value: 52 },
      { label: "Finance", value: 38 },
      { label: "People & Culture", value: 34 },
      { label: "Corporate Affairs", value: 28 },
    ],
    talents: talentBase.map((t, i) => ({ ...t, votes: [96, 84, 58, 44, 30][i]! })),
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
    rewards: [
      { name: "GBL Enamel Pin", redeemed: 84 },
      { name: "Coffee Tumbler", redeemed: 66 },
      { name: "Reflective Sticker", redeemed: 102 },
      { name: "GBL Desk Lamp", redeemed: 41 },
    ],
  },
  day2: {
    kpis: { registered: 350, checkedIn: 341, points: 144900, engagement: 93 },
    pulse: pulse(11, 128, 340, 8),
    missions: missionBase.map((m, i) => ({ ...m, submissions: [322, 259, 198][i]! })),
    functions: [
      { label: "Sales & Distribution", value: 116 },
      { label: "Marketing", value: 63 },
      { label: "Operations", value: 56 },
      { label: "Finance", value: 41 },
      { label: "People & Culture", value: 36 },
      { label: "Corporate Affairs", value: 29 },
    ],
    talents: talentBase.map((t, i) => ({ ...t, votes: [112, 96, 64, 42, 25][i]! })),
    gallery: {
      photos: 1284,
      likes: 4720,
      contributors: 318,
      topMoment: "Gala Dinner · Jingle grand finale",
    },
    hub: [
      { label: "Personal Journey", value: 21 },
      { label: "Live Interaction", value: 34 },
      { label: "Engagement Hub", value: 28 },
      { label: "Content & Memories", value: 17 },
    ],
    rewards: [
      { name: "GBL Enamel Pin", redeemed: 128 },
      { name: "Coffee Tumbler", redeemed: 104 },
      { name: "Reflective Sticker", redeemed: 146 },
      { name: "GBL Desk Lamp", redeemed: 63 },
    ],
  },
  day3: {
    kpis: { registered: 350, checkedIn: 336, points: 172000, engagement: 89 },
    pulse: pulse(8, 74, 180, 7),
    missions: missionBase.map((m, i) => ({ ...m, submissions: [331, 288, 241][i]! })),
    functions: [
      { label: "Sales & Distribution", value: 114 },
      { label: "Marketing", value: 62 },
      { label: "Operations", value: 55 },
      { label: "Finance", value: 40 },
      { label: "People & Culture", value: 35 },
      { label: "Corporate Affairs", value: 30 },
    ],
    talents: talentBase.map((t, i) => ({ ...t, votes: [118, 101, 66, 32, 18][i]! })),
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
    rewards: [
      { name: "GBL Enamel Pin", redeemed: 149 },
      { name: "Coffee Tumbler", redeemed: 121 },
      { name: "Reflective Sticker", redeemed: 168 },
      { name: "GBL Desk Lamp", redeemed: 77 },
    ],
  },
};

export const FEED_TEMPLATES = [
  { kind: "checkin", text: "just checked in at the main hall" },
  { kind: "mission", text: "finished Mission 01 · Connect to Win" },
  { kind: "mission", text: "sent proof for Mission 02 · Make More Possible" },
  { kind: "mission", text: "cleared Mission 03 · Win Together" },
  { kind: "photo", text: "posted a photo to the Growing Together wall" },
  { kind: "vote", text: "cast a vote for JTI Got Talent" },
  { kind: "reward", text: "spun the Infinity Wheel and claimed a reward" },
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

export function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
