import { useEffect, useMemo, useState } from "react";
import { PARTICIPANTS } from "@/lib/detail-data";
import { DATA, FEED_NAMES, FEED_TEMPLATES, type DayData, type DayKey } from "@/lib/dashboard-data";

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

/** Points from verified missions: 100 + 250 + 500 = 850 max per person. */
function pointsFromMissions(missions: DayData["missions"]) {
  return missions.reduce((sum, m) => sum + m.points * m.submissions, 0);
}

/**
 * Points from activity stamps. Day 1 only has its own activities and the
 * first run of the two-day ones behind it; by Day 2 the full set is open.
 */
const ACTIVITY_SHARE: Record<DayKey, number> = { day1: 0.4, day2: 1, day3: 1 };
const AVG_ACTIVITY_POINTS =
  PARTICIPANTS.filter((p) => p.checkedIn).reduce((s, p) => s + p.activityPoints, 0) /
  Math.max(1, PARTICIPANTS.filter((p) => p.checkedIn).length);

function pointsFromActivities(day: DayKey, checkedIn: number) {
  return Math.round(AVG_ACTIVITY_POINTS * ACTIVITY_SHARE[day] * checkedIn);
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
    const points =
      pointsFromMissions(base.missions) + pointsFromActivities(day, base.kpis.checkedIn);
    return { ...base, kpis: { ...base.kpis, points } };
  }, [day]);

  return { data, feed, updatedAt };
}
