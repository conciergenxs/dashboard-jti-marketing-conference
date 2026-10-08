import { useEffect, useMemo, useState } from "react";
import { DATA, FEED_NAMES, FEED_TEMPLATES, type DayKey } from "@/lib/dashboard-data";

export type FeedItem = {
  id: number;
  name: string;
  kind: string;
  text: string;
  text2?: string;
  minutesAgo: number;
};

const ORDER: DayKey[] = ["day1", "day2", "day3"];

/** Only what can happen that day: no votes (both closed before the event), no missions after Day 1. */
function templatesFor(day: DayKey) {
  const at = ORDER.indexOf(day);
  return FEED_TEMPLATES.filter(
    (t) => (!t.from || ORDER.indexOf(t.from) <= at) && (!t.until || ORDER.indexOf(t.until) >= at),
  );
}

/**
 * The demo snapshot is generated once per day shown and never drifts while
 * the page is open, so numbers only change when the dashboard is reloaded.
 */
function buildFeed(day: DayKey): FeedItem[] {
  const pool = templatesFor(day);
  if (!pool.length) return [];
  return Array.from({ length: 7 }, (_, i) => {
    const t = pool[Math.floor(Math.random() * pool.length)]!;
    return {
      id: i,
      name: FEED_NAMES[Math.floor(Math.random() * FEED_NAMES.length)]!,
      kind: t.kind,
      text: t.text,
      minutesAgo: i * 2 + 1,
    };
  });
}

export function useLiveDashboard(day: DayKey) {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    setFeed(buildFeed(day));
    setUpdatedAt(new Date());
  }, [day]);

  const data = useMemo(() => DATA[day], [day]);
  // Known from the day alone, so the quiet state never flashes in on load.
  const quiet = useMemo(() => templatesFor(day).length === 0, [day]);

  return { data, feed, quiet, updatedAt };
}
