import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type TargetAndTransition,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/use-desktop";
import type { MetricKey } from "@/lib/detail-data";

type EntranceProps =
  | { animate: TargetAndTransition }
  | { whileInView: TargetAndTransition; viewport: { once: boolean } };

/**
 * Entrance props for content *inside* a panel.
 *
 * On a phone the approved behaviour is a scroll reveal. On a laptop or
 * projector the dashboard is often never scrolled, and IntersectionObserver is
 * purely geometric — a parent fading itself in does not make a below-the-fold
 * child intersect. Without this, every panel below the fold animates its chrome
 * in and then sits there with empty rows, reading as "no data" on a live event
 * screen. Desktop therefore animates on mount.
 *
 * Returns a factory rather than the props directly so a component can build a
 * per-item target inside a map without calling a hook in a loop.
 */
export function useEntrance() {
  const isDesktop = useIsDesktop();
  return (target: TargetAndTransition): EntranceProps =>
    isDesktop ? { animate: target } : { whileInView: target, viewport: { once: true } };
}

export function SeeAll({
  metric,
  label = "See all",
  variant = "pill",
}: {
  metric: MetricKey;
  label?: string;
  variant?: "pill" | "text";
}) {
  return (
    <Link
      to="/details/$metric"
      params={{ metric }}
      className={cn(
        // The group is named so an ancestor card can never trigger the arrow.
        "group/seeall inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold tracking-[0.1em] text-primary uppercase",
        variant === "pill" &&
          "hover-warm rounded-full border border-primary/20 bg-primary/5 px-2 py-1",
      )}
    >
      {label}
      <ArrowUpRight className="size-3 transition-transform duration-300 group-hover/seeall:translate-x-0.5 group-hover/seeall:-translate-y-0.5" />
    </Link>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const isDesktop = useIsDesktop();
  const reduce = useReducedMotion();

  // On a laptop/projector the whole dashboard is the point: a scroll-triggered
  // reveal would leave every panel below the fold sitting at opacity 0 on a
  // screen nobody scrolls. Desktop therefore plays one entrance on mount.
  // Below 1024px the original scroll reveal is kept exactly as approved.
  if (isDesktop) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduce ? 0 : 0.45,
          delay: reduce ? 0 : delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn("h-full min-w-0", className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("h-full min-w-0", className)}
    >
      {children}
    </motion.div>
  );
}

export function Counter({
  value,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isDesktop = useIsDesktop();
  const inViewOnScroll = useInView(ref, { once: true, margin: "-40px" });
  const inView = isDesktop || inViewOnScroll;
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 70, damping: 22, mass: 0.8 });
  const text = useTransform(spring, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  useEffect(() => {
    if (!inView) return;
    mv.set(value);
    // Motion's JS animations sit outside the CSS reduced-motion guard, so the
    // count-up has to be short-circuited explicitly.
    if (reduce) spring.jump(value);
  }, [inView, value, mv, spring, reduce]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}

export function Panel({
  children,
  className,
  title,
  eyebrow,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn("glass-card h-full min-w-0 p-5 sm:p-6", className)}>
      {(title || eyebrow) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-semibold tracking-[0.22em] text-primary uppercase">
                {eyebrow}
              </p>
            )}
            {title && <h2 className="display mt-1 text-title font-bold uppercase">{title}</h2>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function LivePill({ label = "Live" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-label font-semibold tracking-[0.16em] text-primary uppercase">
      <span className="relative flex size-2">
        <span className="animate-glow-pulse absolute inline-flex size-2 rounded-full bg-primary" />
        <span className="relative inline-flex size-2 rounded-full bg-primary" />
      </span>
      {label}
    </span>
  );
}
