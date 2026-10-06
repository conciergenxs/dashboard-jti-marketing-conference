import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { DashboardHeader } from "@/components/dashboard/header";
import { ContourField } from "@/components/dashboard/contour-field";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { PulseChart } from "@/components/dashboard/pulse-chart";
import { Missions } from "@/components/dashboard/missions";
import { FunctionBars } from "@/components/dashboard/function-bars";
import { TalentBoard } from "@/components/dashboard/talent-board";
import { GalleryPulse } from "@/components/dashboard/gallery-pulse";
import { HubDonut } from "@/components/dashboard/hub-donut";
import { LiveFeed } from "@/components/dashboard/live-feed";
import { Rewards } from "@/components/dashboard/rewards";
import { Checklist } from "@/components/dashboard/checklist";
import { ActivityQuota } from "@/components/dashboard/activity-quota";
import { Reveal } from "@/components/dashboard/primitives";
import { useLiveDashboard } from "@/hooks/use-live-dashboard";
import { EVENT, GALLERY_ENABLED, type DayKey } from "@/lib/dashboard-data";

const TITLE = "Grow Beyond Limits — Market Conference 2026 Live Analytics";
const DESCRIPTION =
  "Live analytics for JTI Indonesia Market Conference 2026: check-ins, the passport checklist, Infinity Missions, JTI Got Talent voting and Live Q&A in real time.";

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
  const { data, feed } = useLiveDashboard(day);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <ContourField />
      {/* 1152px is a reading measure, not a dashboard measure — widen it only
          on screens that actually have the room. */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 xl:max-w-7xl xl:px-10 2xl:max-w-[88rem]">
        <DashboardHeader day={day} onDayChange={setDay} kpis={data.kpis} />

        {/* At >=1280px the page stops being one column of full-width bands: the
            chart takes two thirds and the live feed becomes a rail beside it,
            instead of sitting ~2,400px below the fold on the one surface that
            is actually live. */}
        <motion.div
          key={day}
          id="day-panel"
          role="tabpanel"
          aria-labelledby={`day-tab-${day}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 min-w-0 space-y-5 sm:mt-10 sm:space-y-6 xl:grid xl:grid-cols-12 xl:gap-6 xl:space-y-0"
        >
          <KpiStrip kpis={data.kpis} />

          <Reveal className="xl:col-span-8 xl:row-start-2">
            <PulseChart points={data.pulse} />
          </Reveal>

          {/* Who is in the room, stamp by stamp — the spec's hero breakdown. */}
          <Reveal className="xl:col-span-12 xl:row-start-3">
            <ActivityQuota stamps={data.activities} checkedIn={data.kpis.checkedIn} />
          </Reveal>

          {/* Panel carries h-full, so cards in a row bottom out together rather
              than leaving ragged gaps. No `order` utilities: they would desync
              the visual order from the DOM/tab order. */}
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 sm:gap-6 lg:grid-cols-2 xl:col-span-12 xl:row-start-4 xl:grid-cols-3">
            <Reveal>
              <Missions missions={data.missions} preEvent={data.checklist.preEvent} />
            </Reveal>
            <Reveal delay={0.08}>
              <TalentBoard talents={data.talents} votingOpen={data.votingOpen} />
            </Reveal>
            <Reveal>
              <FunctionBars functions={data.functions} />
            </Reveal>
            <Reveal delay={0.08}>
              <HubDonut hub={data.hub} />
            </Reveal>
            <Reveal>
              {GALLERY_ENABLED ? (
                <GalleryPulse gallery={data.gallery} />
              ) : (
                <Checklist checklist={data.checklist} checkedIn={data.kpis.checkedIn} />
              )}
            </Reveal>
            <Reveal delay={0.08}>
              <Rewards rewards={data.rewards} />
            </Reveal>
          </div>

          {/* Stays last in the DOM — mobile order is unchanged. At >=1280px the
              explicit grid coordinates lift it into the rail beside the chart,
              which CSS grid placement does independently of source order. */}
          <Reveal className="xl:col-span-4 xl:col-start-9 xl:row-start-2">
            <LiveFeed feed={feed} />
          </Reveal>
        </motion.div>

        <footer className="mt-14 border-t border-border pt-8 text-center">
          <p className="display text-title font-bold uppercase">
            <span className="text-gradient">{EVENT.tagline}</span>
          </p>
          <p className="mt-2 text-label tracking-[0.22em] text-muted-foreground uppercase">
            Grow Beyond Limits · Market Conference 2026
          </p>
        </footer>
      </div>
    </main>
  );
}
