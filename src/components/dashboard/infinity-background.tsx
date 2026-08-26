export function InfinityBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="grid-fade absolute inset-0" />
      <div className="animate-drift absolute -top-40 -left-32 size-[36rem] rounded-full bg-primary/18 blur-[120px]" />
      <div
        className="animate-drift absolute top-1/3 -right-40 size-[32rem] rounded-full bg-accent/25 blur-[130px]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="animate-drift absolute bottom-0 left-1/4 size-[28rem] rounded-full bg-glow/20 blur-[140px]"
        style={{ animationDelay: "-12s" }}
      />
      <svg
        className="absolute inset-x-0 top-24 h-[60vh] w-full opacity-45"
        viewBox="0 0 1200 400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="infline" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M-100 ${200 + i * 26} C 200 ${80 + i * 40}, 400 ${320 - i * 30}, 600 ${200 + i * 10} S 1000 ${90 + i * 30}, 1300 ${210 - i * 20}`}
            stroke="url(#infline)"
            strokeWidth={1.2}
            fill="none"
            strokeDasharray="14 10"
            className="animate-dash-flow"
            style={{ animationDelay: `${i * -4}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
