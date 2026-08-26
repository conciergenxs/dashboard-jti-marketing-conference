import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricKey } from "@/lib/detail-data";

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
        "group inline-flex shrink-0 items-center gap-1 text-label font-semibold tracking-[0.12em] text-primary uppercase transition-colors",
        variant === "pill"
          ? "rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 hover:border-primary/50 hover:bg-primary/10"
          : "hover:text-accent",
      )}
    >
      {label}
      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("min-w-0", className)}
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
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 70, damping: 22, mass: 0.8 });
  const text = useTransform(spring, (v) =>
    v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

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
    <div className={cn("glass-card card-lift min-w-0 p-5 sm:p-6", className)}>
      {(title || eyebrow) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {eyebrow && (
              <p className="text-label font-semibold tracking-[0.22em] text-primary uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="display mt-1 text-title font-bold uppercase">
                {title}
              </h2>
            )}
          </div>
          {action}
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
