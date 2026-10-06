import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Gift, Heart, MessageCircleQuestion, ScanLine, Sparkles, Vote } from "lucide-react";
import { Panel, SeeAll } from "./primitives";
import type { FeedItem } from "@/hooks/use-live-dashboard";

const ICONS: Record<string, typeof ScanLine> = {
  checkin: ScanLine,
  mission: Sparkles,
  photo: Heart,
  vote: Vote,
  reward: Gift,
  question: MessageCircleQuestion,
};

export function LiveFeed({ feed }: { feed: FeedItem[] }) {
  const reduce = useReducedMotion();
  return (
    <Panel eyebrow="Activity log" title="What Is Happening Now" action={<SeeAll metric="log" />}>
      {/* lg:space-y-0 is required: the row exit animation drives marginBottom,
          which would otherwise fight the grid gap. */}
      <ul className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0 xl:block xl:max-h-[21rem] xl:space-y-2 xl:overflow-y-auto">
        <AnimatePresence initial={false}>
          {feed.map((f) => {
            const Icon = ICONS[f.kind] ?? Sparkles;
            return (
              <motion.li
                key={f.id}
                layout
                initial={{ opacity: 0, y: -14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }
                }
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/60 px-3 py-2.5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" strokeWidth={1.9} />
                </span>
                <p className="min-w-0 flex-1 truncate text-label text-muted-foreground">
                  <b className="font-semibold text-foreground">{f.name}</b> {f.text}
                </p>
                <span className="shrink-0 text-label text-muted-foreground tabular-nums">
                  {f.minutesAgo}m ago
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </Panel>
  );
}
