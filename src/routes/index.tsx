import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { DashboardHeader, Ticker } from "@/components/dashboard/header";
import { InfinityBackground } from "@/components/dashboard/infinity-background";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { PulseChart } from "@/components/dashboard/pulse-chart";
import { Missions } from "@/components/dashboard/missions";
import { FunctionBars } from "@/components/dashboard/function-bars";
import { TalentBoard } from "@/components/dashboard/talent-board";
import { GalleryPulse } from "@/components/dashboard/gallery-pulse";
import { HubDonut } from "@/components/dashboard/hub-donut";
import { LiveFeed } from "@/components/dashboard/live-feed";
import { Rewards } from "@/components/dashboard/rewards";
import { Reveal } from "@/components/dashboard/primitives";
import { useLiveDashboard } from "@/hooks/use-live-dashboard";
import { EVENT, type DayKey } from "@/lib/dashboard-data";

const TITLE = "Grow Beyond Limits — Market Conference 2026 Live Analytics";
const DESCRIPTION =
  "Live analytics for JTI Indonesia Market Conference 2026 in Yogyakarta: check-ins, Infinity Missions, JTI Got Talent voting and Infinity Hub engagement in real time.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [day, setDay] = useState<DayKey>("day2");
  const { data, feed, updatedAt } = useLiveDashboard(day);

  const tickerItems = [
    `${data.kpis.checkedIn} participants checked in`,
    "Infinity Missions live",
    `${data.gallery.photos} moments shared`,
    EVENT.tagline,
    "JTI Got Talent voting open",
    "Bersama, Pasti Menang!",
  ];

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <InfinityBackground />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <DashboardHeader day={day} onDayChange={setDay} updatedAt={updatedAt} />

        <motion.div
          key={day}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 min-w-0 space-y-5 sm:mt-10 sm:space-y-6"
        >
          <KpiStrip kpis={data.kpis} />

          <Ticker items={tickerItems} />

          <Reveal>
            <PulseChart points={data.pulse} />
          </Reveal>

          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 sm:gap-6 lg:grid-cols-2">
            <Reveal>
              <Missions missions={data.missions} />
            </Reveal>
            <Reveal delay={0.08}>
              <TalentBoard talents={data.talents} />
            </Reveal>
            <Reveal>
              <FunctionBars functions={data.functions} />
            </Reveal>
            <Reveal delay={0.08}>
              <HubDonut hub={data.hub} />
            </Reveal>
            <Reveal>
              <GalleryPulse gallery={data.gallery} />
            </Reveal>
            <Reveal delay={0.08}>
              <LiveFeed feed={feed} />
            </Reveal>
          </div>

          <Reveal>
            <Rewards rewards={data.rewards} />
          </Reveal>
        </motion.div>

        <footer className="mt-14 border-t border-border pt-8 text-center">
          <p className="display text-2xl font-bold tracking-tight uppercase sm:text-3xl">
            <span className="text-gradient">{EVENT.tagline}</span>
          </p>
          <p className="mt-2 text-xs tracking-[0.22em] text-muted-foreground uppercase">
            Grow Beyond Limits · Market Conference 2026 · Yogyakarta
          </p>
        </footer>
      </div>
    </main>
  );
}
