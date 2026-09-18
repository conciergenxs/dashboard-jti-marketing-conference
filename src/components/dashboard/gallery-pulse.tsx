import { Image as ImageIcon, Users } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Counter, Panel, SeeAll, useEntrance } from "./primitives";
import { STORYTELLERS, STORY_MOMENTS } from "@/lib/detail-data";
import type { DayData } from "@/lib/dashboard-data";

const TOP = (() => {
  const sorted = [...STORYTELLERS].sort(
    (a, b) => b.stories - a.stories || a.name.localeCompare(b.name),
  );
  const seen = new Set<string>();
  const picks = sorted.filter((p) => !seen.has(p.fn) && seen.add(p.fn));
  return [...picks, ...sorted].slice(0, 4);
})();

export function GalleryPulse({ gallery }: { gallery: DayData["gallery"] }) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();
  const stats = [
    { label: "Stories shared", value: gallery.photos, icon: ImageIcon },
    { label: "People posting", value: gallery.contributors, icon: Users },
  ];

  return (
    <Panel eyebrow="Growing Together" title="Story Wall" action={<SeeAll metric="stories" />}>
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.94 }}
            {...entrance({ opacity: 1, scale: 1 })}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.08 }}
            className="rounded-xl border border-border/70 bg-surface/60 p-3"
          >
            <s.icon className="size-4 text-primary" strokeWidth={1.8} />
            <p className="display mt-2 text-title font-semibold tabular-nums">
              <Counter value={s.value} />
            </p>
            <p className="mt-1 text-label leading-tight text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* moment thumbnails */}
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {STORY_MOMENTS.map((m, i) => (
          <motion.div
            key={m}
            initial={{ opacity: 0, y: 12 }}
            {...entrance({ opacity: 1, y: 0 })}
            transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : i * 0.06 }}
            title={m}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-primary/15 bg-gradient-to-br from-primary/25 via-accent/15 to-surface"
          >
            <span className="absolute inset-x-1.5 bottom-1.5 line-clamp-2 text-[0.62rem] leading-[1.15] font-semibold text-primary/85 uppercase">
              {m.split(" · ").at(-1)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* contributor leaderboard */}
      <div className="mt-4 space-y-1.5">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          Top storytellers
        </p>
        {TOP.map((p, i) => (
          <motion.div
            key={p.name + i}
            initial={{ opacity: 0, x: -12 }}
            {...entrance({ opacity: 1, x: 0 })}
            transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : i * 0.06 }}
            className="hover-warm flex items-center gap-3 rounded-xl border border-border/70 bg-surface/60 px-3 py-2"
          >
            <span className="display w-4 shrink-0 text-label font-bold text-primary/50 tabular-nums">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body font-semibold">{p.name}</span>
              <span className="block truncate text-label text-muted-foreground">{p.fn}</span>
            </span>
            <span className="shrink-0 rounded-full border border-primary/25 px-2.5 py-1 text-label font-medium text-primary/90 tabular-nums">
              {p.stories} stories
            </span>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}
