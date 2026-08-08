# Animation plans

Produced by `improve-animations` against commit `0f05706`. Each plan is self-contained: it names
exact files, line numbers, current-code excerpts and target values, and assumes the executor has no
context from the conversation that produced it.

**These plans describe changes; they do not make them.** Nothing under `plans/` is loaded by the
app.

## Status

| # | Plan | Severity | Files | Status |
|---|---|---|---|---|
| 001 | [Extend `prefers-reduced-motion` to cover the keyframe animations](001-reduced-motion-coverage.md) | HIGH | `styles.css` | TODO |
| 002 | [Move the iOS toggle knob with `transform`, not `left`](002-toggle-knob-transform.md) | MEDIUM | `styles.css` | TODO |
| 003 | [Replace `transition: all` on the segmented control](003-segmented-control-transition-all.md) | MEDIUM | `styles.css` | TODO |
| 004 | [Sweep the activity ring on workout completion](004-ring-sweep-on-workout-completion.md) | Additive | `js/screens/workout.js`, `js/screens/home.js`, `styles.css` | TODO |

## Recommended order

**001 → 003 → 002 → 004.**

- **001 first.** It is the only genuine defect in the set — 24 keyframe animations run unguarded
  under `prefers-reduced-motion`, one of them (`cardio-timing-pulse`, `styles.css:498`) looping
  forever. It is also the largest and most delicate edit, because several animations supply their
  element's resting state via `both`/`forwards` fill modes; getting it wrong leaves the drum picker
  off-screen. Land it alone.
- **003 before 002.** 003 edits the shared press-feedback transition list at `styles.css:1345`,
  which several selectors depend on. Doing it while that block is otherwise untouched keeps the
  diff readable.
- **002** is independent and self-contained.
- **004 last.** It is the only plan that touches JavaScript and the only additive one; everything
  before it is corrective. It is also the only plan that is safe to abandon — if the feel-check on
  device says the sweep drags, drop it entirely and nothing else regresses.

## Dependencies and interactions

- **001 ↔ 004.** Plan 004 adds its own `prefers-reduced-motion` guard for the ring sweep, so the two
  are independent. If 001 lands first, re-run 004's reduced-motion verification afterwards to
  confirm the two blocks do not fight.
- **002 ↔ 003.** Both edit `styles.css` within ~10 lines of each other (1045-1054). They do not
  overlap, but land them as separate commits so a bisect can tell them apart.
- **003 modifies a shared rule.** Step 2 of 003 adds `color` to the transition list at
  `styles.css:1345`, which is shared by nine selectors. The addition is inert for the other eight,
  but any later plan touching that block should read 003 first.

## Not planned

Three findings from the audit were deliberately left without plans:

- **Easing fragmentation** — `cubic-bezier(0.16,1,0.3,1)` is hardcoded at 13 sites while
  `var(--e)` is used at 10. Consolidating is mechanical, but the older curve is springier and is
  carrying the celebration moments (`finish-flash`, `check-pop`). Flattening them onto `--e` may
  drain intended bounce. This needs a device feel-check and possibly a second `--e-bounce` token
  before it is worth specifying.
- **Carousel keyframes are non-interruptible** (`styles.css:667-670`) — converting to transitions is
  a real refactor complicated by the `display: block !important` on the slide-out rules.
- **Progress fills animate `width`** (`styles.css:290`, `:638`) — correct in principle to move to
  `transform: scaleX()`, but both bars are ≤4px tall so the layout cost is negligible. Low payoff.

Two further opportunities from the sweep were not selected for planning: press feedback on
`.last-session-row` (`styles.css:1445`, the only row-like control missing the v3 treatment) and the
teleporting calendar month swap (`js/screens/history.js:144,150`).

## Executing

Any agent can run a plan from its file alone. To have this skill dispatch and then review the
result: `improve-animations execute plans/001-reduced-motion-coverage.md`.

To re-check these against changed code later: `improve-animations reconcile`.
