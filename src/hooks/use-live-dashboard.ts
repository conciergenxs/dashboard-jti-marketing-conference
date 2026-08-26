import { useEffect, useMemo, useRef, useState } from "react";
import {
  DATA,
  FEED_NAMES,
  FEED_TEMPLATES,
  type DayData,
  type DayKey,
} from "@/lib/dashboard-data";

const CAPACITY = 350;

export type FeedItem = {
  id: number;
  name: string;
  kind: string;
  text: string;
  at: number;
};

let feedId = 0;

function nextFeedItem(): FeedItem {
  const t = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)]!;
  return {
    id: feedId++,
    name: FEED_NAMES[Math.floor(Math.random() * FEED_NAMES.length)]!,
    kind: t.kind,
    text: t.text,
    at: Date.now(),
  };
}

/** Points are earned only from verified missions: 100 + 250 + 500 = 850 max. */
function pointsFromMissions(missions: DayData["missions"]) {
  return missions.reduce((sum, m) => sum + m.points * m.submissions, 0);
}

function drift(data: DayData, tick: number): DayData {
  if (tick === 0) {
    return { ...data, kpis: { ...data.kpis, points: pointsFromMissions(data.missions) } };
  }
  const j = (n: number, amp: number) =>
    Math.max(0, Math.round(n + Math.sin(tick * 0.7 + n) * amp + Math.random() * amp));

  const registered = Math.min(CAPACITY, data.kpis.registered + Math.floor(tick / 6));
  const checkedIn = Math.min(registered, data.kpis.checkedIn + Math.floor(tick / 3));

  // one vote per checked-in participant is the hard ceiling
  const voteBudget = Math.max(0, checkedIn - data.talents.reduce((s, t) => s + t.votes, 0));
  let voteUsed = 0;
  const talents = data.talents.map((t, i) => {
    const want = Math.max(0, Math.floor(tick * (0.5 - i * 0.09)));
    const inc = Math.min(want, voteBudget - voteUsed);
    voteUsed += inc;
    return { ...t, votes: t.votes + inc };
  });

  const missions = data.missions.map((m, i) => ({
    ...m,
    submissions: Math.min(checkedIn, m.submissions + Math.floor(tick / (2 + i))),
  }));

  return {
    ...data,
    kpis: {
      registered,
      checkedIn,
      points: pointsFromMissions(missions),
      engagement: Math.min(99, data.kpis.engagement + (tick % 4 === 0 ? 1 : 0)),
    },
    pulse: data.pulse.map((p, i) => ({
      ...p,
      checkins: i === data.pulse.length - 1 ? j(p.checkins, 6) : p.checkins,
      activity: i >= data.pulse.length - 2 ? j(p.activity, 10) : p.activity,
    })),
    missions,
    talents,
    gallery: {
      ...data.gallery,
      photos: data.gallery.photos + tick * 2,
      likes: data.gallery.likes + tick * 9,
      contributors: Math.min(checkedIn, data.gallery.contributors + Math.floor(tick / 8)),
    },
  };
}

export function useLiveDashboard(day: DayKey) {
  const [tick, setTick] = useState(0);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const started = useRef(false);

  useEffect(() => {
    setFeed(Array.from({ length: 6 }, nextFeedItem));
    setUpdatedAt(new Date());
    started.current = true;
    const interval = window.setInterval(() => {
      setTick((t) => t + 1);
      setUpdatedAt(new Date());
      setFeed((f) => [nextFeedItem(), ...f].slice(0, 8));
    }, 3500);
    return () => window.clearInterval(interval);
  }, []);

  const data = useMemo(() => drift(DATA[day], tick), [day, tick]);

  return { data, feed, updatedAt, tick };
}
