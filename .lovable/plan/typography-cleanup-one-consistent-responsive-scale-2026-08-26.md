# Typography Cleanup: One Consistent, Responsive Scale

Right now the dashboard mixes ad-hoc sizes — eight uses of `0.68rem`, six of `0.62rem`, plus `0.6rem`, `0.65rem`, `0.7rem` — and five different letter-spacing values, with weights split between bold and semibold with no rule. Some labels drop below 10px, which is too small to read on a phone.

## The scale

Replace every one-off size with five named steps, each fluid so it adapts between mobile and desktop instead of jumping at breakpoints:

| Step | Use | Mobile → Desktop |
|---|---|---|
| Display | Hero title | 40px → 76px |
| Title | Panel titles | 20px → 26px |
| Metric | Big KPI numbers | 30px → 38px |
| Body | Descriptions, list rows | 14px → 15px |
| Label | Eyebrows, axis ticks, chips | 11px → 12px |

Nothing renders below 11px anywhere, on any screen. The hero stops dominating the phone screen; small labels stop disappearing.

## Weight and spacing rules

- Display and Metric: Bold (700). Titles: SemiBold (600).
- Body copy: Regular (400); the value inside a row is Medium (500) so numbers read as data without shouting.
- Labels/eyebrows: Medium (500), uppercase, single tracking value (0.14em) — replacing the five different values used today.
- Two tracking values total: tight negative on Display/Metric, the label tracking above. Nothing else.

## Mobile fit

- Line-height loosened slightly for Body on small screens so wrapped rows breathe.
- Long labels (department names, talent acts) truncate on one line at phone width with the full text still available via the row's own layout rather than shrinking the text.
- Numbers use tabular figures so counters don't jitter as they tick up.

## Technical notes

- Add `--text-display / --text-title / --text-metric / --text-body / --text-label` (with paired line-height and letter-spacing) to `@theme` in `src/styles.css` using `clamp()` for fluid scaling; Tailwind then generates `text-display`, `text-label`, etc.
- Sweep `src/components/dashboard/*.tsx` and `src/routes/index.tsx`, replacing every arbitrary `text-[…]`, ad-hoc `tracking-[…]`, and inconsistent weight with the token classes.
- Add `font-variant-numeric: tabular-nums` on the counter/metric utility.
- No layout or content changes; typography only.
