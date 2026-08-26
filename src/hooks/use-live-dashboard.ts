import { useEffect, useMemo, useRef, useState } from "react";
import {
  DATA,
  FEED_NAMES,
  FEED_TEMPLATES,
  type DayData,
  type DayKey,
} from "@/lib/dashboard-data";

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

function drift(data: DayData, tick: number): DayData {
  const j = (n: number, amp: number) =>
    Math.max(0, Math.round(n + Math.sin(tick * 0.7 + n) * amp + Math.random() * amp));
  return {
    ...data,
    kpis: {
      registered: data.kpis.registered + Math.floor(tick / 6),
      checkedIn: Math.min(data.kpis.registered, data.kpis.checkedIn + Math.floor(tick / 3)),
      points: data.kpis.points + tick * 135,
      engagement: Math.min(99, data.kpis.engagement + (tick % 4 === 0 ? 1 : 0)),
    },
    pulse: data.pulse.map((p, i) => ({
      ...p,
      checkins: i === data.pulse.length - 1 ? j(p.checkins, 6) : p.checkins,
      activity: i >= data.pulse.length - 2 ? j(p.activity, 10) : p.activity,
    })),
    missions: data.missions.map((m, i) => ({
      ...m,
      submissions: m.submissions + Math.floor(tick / (2 + i)),
    })),
    talents: data.talents.map((t, i) => ({
      ...t,
      votes: t.votes + Math.floor(tick * (0.6 + ((i * 7) % 5) / 6)),
    })),
    gallery: {
      ...data.gallery,
      photos: data.gallery.photos + tick * 2,
      likes: data.gallery.likes + tick * 9,
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
