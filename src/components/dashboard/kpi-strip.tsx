import { motion, useReducedMotion } from "motion/react";
import { ListChecks, MessageCircleQuestion, Users } from "lucide-react";
import { Counter, SeeAll } from "./primitives";
import type { MetricKey } from "@/lib/detail-data";
import { EVENT, type Kpis } from "@/lib/dashboard-data";

/**
 * The event's headline figures. Registered leads, and the other two are cut
 * the same way — the mark on the left, the number, what it counts under it.
 * No rings: a ring drawn against an unstated whole said less than the line of
 * text beneath it already does.
 */
export function KpiStrip({ kpis }: { kpis: Kpis }) {
  const reduce = useReducedMotion();
  const cards: {
    key: string;
    label: string;
    value: number;
    /** Sits beside the number, in the number's own line. */
    suffix?: string;
    hint?: string;
    icon: typeof Users;
    metric?: MetricKey;
  }[] = [
    {
      key: "registered",
      label: "Registered",
      value: kpis.registered,
      hint: `of ${EVENT.target.toLocaleString("en-US")} invited`,
      icon: Users,
    },
    {
      key: "checklist",
      label: "Checklist complete",
      value: kpis.complete,
      hint: `all four ticked · of ${kpis.checkedIn.toLocaleString("en-US")}`,
      icon: ListChecks,
      metric: "checklist",
    },
    {
      key: "qa",
      label: "Q&A",
      value: kpis.questions,
      hint: `questions from ${kpis.askers.toLocaleString("en-US")} people`,
      icon: MessageCircleQuestion,
      metric: "qa",
    },
  ];

  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:grid lg:grid-cols-3 lg:gap-6 xl:col-span-12 xl:row-start-1">
      {cards.map((c, i) => (
        <motion.article
          key={c.key}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.6,
            delay: reduce ? 0 : i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="glass-card relative flex w-full items-center gap-4 overflow-hidden p-4 sm:p-5"
        >
          <div className="absolute -top-16 -right-12 size-32 rounded-full bg-accent/15 blur-2xl sm:opacity-60" />
          <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <c.icon className="size-5" strokeWidth={1.8} aria-hidden />
          </span>
          <div className="relative min-w-0 flex-1">
            <p className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              {c.label}
            </p>
            <p className="display mt-1.5 text-metric font-bold text-foreground tabular-nums">
              <Counter value={c.value} />
              {c.suffix && (
                <span className="ml-2 text-label font-normal tracking-normal text-muted-foreground normal-case">
                  {c.suffix}
                </span>
              )}
            </p>
            {c.hint && <p className="mt-1.5 text-label text-muted-foreground">{c.hint}</p>}
          </div>
          {c.metric && (
            <div className="relative shrink-0 self-start">
              <SeeAll metric={c.metric} label="Detail" variant="text" />
            </div>
          )}
        </motion.article>
      ))}
    </div>
  );
}
