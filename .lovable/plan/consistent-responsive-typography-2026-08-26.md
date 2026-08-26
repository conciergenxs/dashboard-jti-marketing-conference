# Consistent, responsive typography

The size scale is already normalized into five fluid steps (labels 11px → display 44px on mobile, up to 76px on desktop, no overflow). What is still inconsistent is **font weight**: 17 different places use Bold, 6 use SemiBold, 1 uses Medium, with no rule for which is which. Small badges, ranked numbers and mission counters are all Bold at 11–14px, which reads heavy and noisy on a phone.

## Weight system (Open Sauce One only)

| Role | Weight | Where |
| --- | --- | --- |
| Display / hero headline | 800 | Page title only |
| Panel titles, big metrics | 700 | Panel `h2`, KPI numbers, hub donut center |
| Secondary numbers, names, day tabs | 600 | Talent names, mission titles, reward counts, gallery stats |
| Uppercase eyebrows, pills, chips | 600 | Eyebrows, LIVE pill, points badges, ticker |
| Body copy, table rows, hints | 400 / 500 | Descriptions, feed text, legends, axis labels |

Rule: nothing below 14px gets Bold — small text carries emphasis through uppercase, letter-spacing and colour instead of weight.

## Mobile readability pass

- Keep the smallest text at 11px minimum, body at 14px, hero at 44px on a 390px viewport.
- Reduce Bold density inside cards so each card has one clear focal number.
- Verify line-height on the two-line mission titles and KPI hints so they don't crowd.

## Technical notes

- Add `--font-weight-*` semantic aliases in `src/styles.css` `@theme` and drive weights through them instead of ad-hoc `font-bold`.
- Sweep `src/components/dashboard/*.tsx` and `src/routes/index.tsx`, replacing each `font-bold` with the weight its role calls for.
- Re-verify with a headless render at 390px and 1280px: capture the distribution of computed font-size/weight pairs and confirm the set stays small (5 sizes, 4 weights) and that no horizontal overflow appears.
