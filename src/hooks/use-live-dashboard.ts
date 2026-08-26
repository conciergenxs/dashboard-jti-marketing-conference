import { useEffect, useMemo, useState } from "react";
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
  text2?: string;
  minutesAgo: number;
};

/**
 * The demo snapshot is generated once per page load and never drifts while the
 * page is open, so numbers only change when the dashboard is reloaded.
 */
function buildFeed(): FeedItem[] {
  return Array.from({ length: 7 }, (_, i) => {
    const t = FEED_TEMPLATES[Math.floor(Math.random() * FEED_TEMPLATES.length)]!;
    return {
      id: i,
      name: FEED_NAMES[Math.floor(Math.random() * FEED_NAMES.length)]!,
      kind: t.kind,
      text: t.text,
      minutesAgo: i * 2 + 1,
    };
  });
}

/** Points are earned only from verified missions: 100 + 250 + 500 = 850 max. */
function pointsFromMissions(missions: DayData["missions"]) {
  return missions.reduce((sum, m) => sum + m.points * m.submissions, 0);
}

export function useLiveDashboard(day: DayKey) {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    setFeed(buildFeed());
    setUpdatedAt(new Date());
  }, []);

  const data = useMemo(() => {
    const base = DATA[day];
    return { ...base, kpis: { ...base.kpis, points: pointsFromMissions(base.missions) } };
  }, [day]);

  return { data, feed, updatedAt };
}
