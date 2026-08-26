import { AnimatePresence, motion } from "motion/react";
import { Gift, Heart, ScanLine, Sparkles, Vote } from "lucide-react";
import { LivePill, Panel } from "./primitives";
import type { FeedItem } from "@/hooks/use-live-dashboard";

const ICONS: Record<string, typeof ScanLine> = {
  checkin: ScanLine,
  mission: Sparkles,
  photo: Heart,
  vote: Vote,
  reward: Gift,
};

function ago(at: number) {
  const s = Math.max(1, Math.round((Date.now() - at) / 1000));
  if (s < 60) return `${s}s ago`;
  return `${Math.round(s / 60)}m ago`;
}

export function LiveFeed({ feed }: { feed: FeedItem[] }) {
  return (
    <Panel eyebrow="Real time" title="Activity Feed" action={<LivePill label="Streaming" />}>
      <ul className="space-y-2">
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
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/60 px-3 py-2.5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4 text-primary" strokeWidth={1.9} />
                </span>
                <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                  <b className="font-semibold text-foreground">{f.name}</b> {f.text}
                </p>
                <span className="shrink-0 text-label text-muted-foreground tabular-nums">
                  {ago(f.at)}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </Panel>
  );
}
