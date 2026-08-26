import { Heart, Image as ImageIcon, Users } from "lucide-react";
import { motion } from "motion/react";
import { Counter, Panel } from "./primitives";
import type { DayData } from "@/lib/dashboard-data";

export function GalleryPulse({ gallery }: { gallery: DayData["gallery"] }) {
  const stats = [
    { label: "Moments uploaded", value: gallery.photos, icon: ImageIcon },
    { label: "Likes given", value: gallery.likes, icon: Heart },
    { label: "Contributors", value: gallery.contributors, icon: Users },
  ];

  return (
    <Panel eyebrow="Growing Together" title="Shared Memories">
      <div className="grid grid-cols-3 gap-2.5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className="rounded-xl border border-border/70 bg-surface/60 p-3 text-center"
          >
            <s.icon className="mx-auto size-4 text-primary" strokeWidth={1.8} />
            <p className="display mt-2 text-xl font-bold tabular-nums">
              <Counter value={s.value} />
            </p>
            <p className="mt-1 text-label leading-tight text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-br from-primary/10 to-accent/10 p-4">
        <p className="text-label font-semibold tracking-[0.18em] text-primary uppercase">
          Most loved moment
        </p>
        <p className="display mt-1.5 text-base font-bold uppercase">{gallery.topMoment}</p>
      </div>
    </Panel>
  );
}
