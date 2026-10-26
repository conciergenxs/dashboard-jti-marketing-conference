import { motion } from "motion/react";
import { EVENT } from "@/lib/dashboard-data";
import { LivePill } from "./primitives";

export function DashboardHeader() {
  return (
    <header className="pt-5 sm:pt-10">
      {/*
        Two columns from 1024px up — identity on the left, who is watching on
        the right — so the masthead stays short enough to leave the headline
        figures inside the fold on a 1440x900 laptop.
      */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-12 lg:gap-y-5"
      >
        <div className="flex items-center justify-between gap-4 lg:col-span-2 lg:row-start-1">
          <LivePill />
          <JtiLogo className="h-6 w-auto shrink-0 text-foreground sm:h-8 lg:h-9" />
        </div>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <h1 className="display text-display font-extrabold text-balance uppercase">
            <span className="text-gradient">Grow Beyond</span> Limits
          </h1>
          <p className="mt-2.5 max-w-none text-body text-muted-foreground lg:max-w-[34rem]">
            {EVENT.subtitle}.
            <br />
            Check-ins, missions and ballots, day by day.
          </p>
        </div>

        <div className="lg:col-start-2 lg:row-start-2 lg:justify-self-end">
          <Viewer />
        </div>

        <div className="border-t border-border/70 lg:col-span-2 lg:row-start-3" />
      </motion.div>
    </header>
  );
}

/**
 * Who the dashboard is open for. This build has one audience and no sign-in,
 * so it states the role rather than offering a menu that would lead nowhere.
 */
function Viewer() {
  return (
    <div className="glass-card flex w-full items-center gap-3 px-3.5 py-2.5 lg:w-auto">
      <span className="display grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-body font-bold text-primary-foreground shadow-[0_6px_16px_-8px_var(--color-primary)]">
        H
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          Viewing as
        </span>
        <span className="display block truncate text-body font-semibold">Host</span>
      </span>
    </div>
  );
}

/** The JTI mark from the client's final KV, drawn in the dashboard's navy ink. */
function JtiLogo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="JTI"
      viewBox="0 0 195.25 140.92"
      fill="currentColor"
      className={`aspect-[195.25/140.92] ${className ?? ""}`}
    >
      <path d="M22.32 27.05C19.47 27.05 17.15 24.73 17.15 21.88L17.15 21.85C17.15 19.08 19.35 16.79 22.10 16.70L71.32 16.70C73.75 16.70 75.15 15.26 75.67 13.48C75.99 12.32 77.94 9.79 81.86 9.79L157.70 9.79C160.15 9.79 160.72 8.79 160.72 4.81C160.72 2.07 163.23 0.00 166.00 0.00L189.64 0.00C192.74 0.00 195.25 2.52 195.25 5.61L195.25 76.92C195.25 80.05 193.79 82.36 190.86 84.30C190.86 84.30 170.69 97.68 168.19 99.43C167.09 100.11 164.56 100.76 162.37 99.11C160.86 97.94 160.68 95.42 160.68 94.58L160.68 20.17L137.96 20.17C135.46 20.17 133.29 22.01 133.29 24.56L133.29 93.17C133.29 96.30 131.83 98.62 128.89 100.55C128.89 100.55 108.73 113.93 106.22 115.68C105.11 116.43 102.64 117.25 100.45 115.70C98.84 114.53 98.72 111.81 98.72 111.81L98.72 25.72C98.72 21.44 96.22 20.17 93.17 20.17L83.28 20.17C80.10 20.17 79.04 21.85 78.48 23.71C78.14 24.87 76.63 27.05 72.49 27.05L69.44 27.05C67.49 27.05 65.87 28.60 65.87 30.67L65.87 100.52C65.87 100.52 65.98 106.26 62.82 110.84C60.90 113.73 54.45 117.95 54.45 117.95L30.43 134.12C30.43 134.12 20.62 140.92 9.56 136.84C1.29 133.73 0.00 128.17 0.86 123.19C1.74 118.24 7.61 115.33 11.31 115.50C15.75 115.70 19.36 117.25 21.52 122.61C23.27 126.99 24.67 128.46 26.95 128.65C29.23 128.74 31.31 125.71 31.31 120.19L31.31 30.67C31.31 28.70 29.66 27.05 27.72 27.05L22.32 27.05L22.32 27.05Z" />
    </svg>
  );
}
