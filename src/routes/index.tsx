import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { DashboardHeader } from "@/components/dashboard/header";
import { ContourField } from "@/components/dashboard/contour-field";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { Missions } from "@/components/dashboard/missions";
import { FunctionBars } from "@/components/dashboard/function-bars";
import { TalentBoard } from "@/components/dashboard/talent-board";
import { GalleryPulse } from "@/components/dashboard/gallery-pulse";
import { InspiredByYou } from "@/components/dashboard/inspired-by-you";
import { Rewards } from "@/components/dashboard/rewards";
import { Checklist } from "@/components/dashboard/checklist";
import { ActivityQuota } from "@/components/dashboard/activity-quota";
import { Reveal } from "@/components/dashboard/primitives";
import { DATA, EVENT, GALLERY_ENABLED, type DayKey } from "@/lib/dashboard-data";

const TITLE = "Grow Beyond Limits — Market Conference 2026 Live Analytics";
const DESCRIPTION =
  "Live analytics for JTI Indonesia Market Conference 2026: check-ins, the passport checklist, Infinity Missions, the Inspired By You and JTI Got Talent ballots, and Q&A.";

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
  const data = DATA[day];

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <ContourField />
      {/* 1152px is a reading measure, not a dashboard measure — widen it only
          on screens that actually have the room. */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 xl:max-w-7xl xl:px-10 2xl:max-w-[88rem]">
        <DashboardHeader day={day} onDayChange={setDay} kpis={data.kpis} />

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

          {/* Who is in the room, stamp by stamp — the spec's hero breakdown. */}
          <Reveal className="xl:col-span-12 xl:row-start-2">
            <ActivityQuota stamps={data.activities} checkedIn={data.kpis.checkedIn} />
          </Reveal>

          {/* The spec's reading order, left to right then down: who is here,
              what they sent, what they ticked, then the two ballots and the
              Redemption Corner. Panel carries h-full, so cards in a row bottom
              out together rather than leaving ragged gaps. No `order`
              utilities: they would desync the visual order from the DOM/tab
              order. */}
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 sm:gap-6 lg:grid-cols-2 xl:col-span-12 xl:row-start-3 xl:grid-cols-3">
            <Reveal>
              <FunctionBars functions={data.functions} />
            </Reveal>
            <Reveal delay={0.08}>
              <Missions missions={data.missions} preEvent={data.checklist.preEvent} />
            </Reveal>
            <Reveal>
              <Checklist checklist={data.checklist} checkedIn={data.kpis.checkedIn} />
            </Reveal>
            <Reveal delay={0.08}>
              <InspiredByYou inspired={data.inspired} />
            </Reveal>
            <Reveal>
              <TalentBoard talents={data.talents} />
            </Reveal>
            <Reveal delay={0.08}>
              <Rewards />
            </Reveal>
            {/* The Gallery follows the microsite, where it is still held back. */}
            {GALLERY_ENABLED && (
              <Reveal>
                <GalleryPulse gallery={data.gallery} />
              </Reveal>
            )}
          </div>
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
