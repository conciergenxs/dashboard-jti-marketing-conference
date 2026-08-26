/**
 * Deck-accurate background: bundles of very fine hairlines sweeping across the
 * white page like contour ribbons, plus one diagonal gradient accent edge.
 */

type BundleProps = {
  count: number;
  spread: number;
  amp: number;
  baseY: number;
  phase: number;
  opacity: number;
  width: number;
};

/** One coherent ribbon: many parallel strokes generated from a single spine. */
function bundlePaths({ count, spread, amp, baseY, phase }: BundleProps) {
  const paths: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const off = (t - 0.5) * spread;
    // Slight per-stroke amplitude change keeps the bundle woven, not cloned.
    const a = amp * (1 + (t - 0.5) * 0.32);
    const y = (x: number) =>
      baseY +
      off +
      Math.sin(x / 260 + phase + t * 0.5) * a +
      Math.sin(x / 95 + phase * 1.7 + t * 0.9) * (a * 0.18);
    const pts: string[] = [];
    for (let x = -80; x <= 1480; x += 40) pts.push(`${x} ${y(x).toFixed(2)}`);
    paths.push(`M${pts.join(" L")}`);
  }
  return paths;
}

function Ribbon(props: BundleProps & { id: string; duration: number; delay?: number }) {
  const paths = bundlePaths(props);
  return (
    <g className="contour-drift" style={{ animationDuration: `${props.duration}s`, animationDelay: `${props.delay ?? 0}s` }}>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={`url(#${props.id})`}
          strokeWidth={props.width}
          strokeOpacity={props.opacity * (0.45 + 0.55 * Math.sin((i / paths.length) * Math.PI))}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  );
}

export function ContourField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      {/* soft luminous wash */}
      <div className="animate-drift absolute -top-48 -left-32 size-[38rem] rounded-full bg-primary/12 blur-[140px]" />
      <div
        className="animate-drift absolute top-1/3 -right-44 size-[34rem] rounded-full bg-accent/14 blur-[150px]"
        style={{ animationDelay: "-8s" }}
      />

      {/* diagonal violet→blue accent edge bleeding off the left margin */}
      <div className="absolute -top-24 -left-24 h-[130%] w-40 origin-top-left -rotate-12 bg-gradient-to-b from-chart-3/45 via-primary/30 to-transparent blur-[2px] sm:w-24" />
      <div className="absolute -top-24 -left-16 h-[130%] w-[2px] origin-top-left -rotate-12 bg-gradient-to-b from-chart-3 via-accent to-transparent opacity-60" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="contour-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="28%" stopColor="var(--color-primary)" stopOpacity="0.75" />
            <stop offset="62%" stopColor="var(--color-accent)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="contour-b" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--color-chart-3)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <Ribbon
          id="contour-a"
          count={20}
          spread={120}
          amp={58}
          baseY={230}
          phase={0.4}
          opacity={0.5}
          width={0.6}
          duration={46}
        />
        <Ribbon
          id="contour-b"
          count={16}
          spread={90}
          amp={44}
          baseY={690}
          phase={2.1}
          opacity={0.38}
          width={0.55}
          duration={62}
          delay={-14}
        />
      </svg>

      {/* single beam of light travelling along the ribbons */}
      <div className="contour-beam absolute top-[12%] h-[26rem] w-[22rem] rounded-full bg-accent/25 blur-[90px]" />
    </div>
  );
}
