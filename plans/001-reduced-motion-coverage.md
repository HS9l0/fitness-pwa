# 001 — Extend `prefers-reduced-motion` to cover the keyframe animations

- **Severity:** HIGH
- **Category:** Accessibility
- **Base commit:** `0f05706`
- **Files touched:** `styles.css` only
- **Status:** TODO

## Problem

`styles.css` defines 24 `@keyframes` sets and applies them through 24 `animation:` rules. The
`@media (prefers-reduced-motion: reduce)` block at `styles.css:1378` guards **only nine `:active`
transform rules** — it does not disable a single keyframe animation.

The worst case is `styles.css:498`, which runs **forever**:

```css
  animation: cardio-timing-pulse 1.4s ease-in-out infinite;
```

A user who has asked their OS for reduced motion currently still gets: an indefinitely pulsing
cardio button, a scale-and-glow celebration on finish (`finish-flash`, peaks at `scale(1.1)`), two
bottom sheets sliding up, the exercise carousel sliding sideways, and eight assorted pop/shake/nudge
animations.

## Current code (verbatim, `styles.css:1377-1389`)

```css
/* Reduced motion keeps opacity and colour, drops movement — gentler, not zero. */
@media (prefers-reduced-motion: reduce) {
  .hig-btn-primary:active,
  .btn-primary:active,
  #cogwheel-btn:active,
  .settings-row:active,
  .week-dots-row:active,
  .set-check-btn:active,
  .set-skip-btn:active,
  .yt-search-btn:active,
  .unit-seg-btn:active { transform: none; }
}
```

The comment already states the intended policy — "gentler, not zero". Keep that policy. Do not
strip opacity and colour transitions; only remove **movement and looping**.

## Complete inventory of animation rules to handle

Every `animation:` rule in the file, with its line number, so nothing is missed.

| Line | Selector | Animation | Disposition |
|---|---|---|---|
| 78 | `.screen.fade-in` | `screen-fade-in` (opacity only) | **KEEP** — opacity-only, no movement |
| 186 | `#finish-btn.finishing` | `finish-flash` | Disable |
| 320 | `.set-row.row-nudge` | `set-row-nudge` | Disable |
| 376 | (field shake rule) | `field-shake` | Disable |
| 414 | `.set-skip-btn.pop` | `check-pop` | Disable |
| 420 | `.finish-reveal` | `finish-appear` | Disable |
| 430 | `.set-check-btn.pop` | `check-pop` | Disable |
| 448 | (ex-num rule) | `ex-num-pop` | Disable |
| 452 | (ex-header rule) | `ex-header-flash` (background only) | **KEEP** — colour-only, no movement |
| 485 | (cardio done rule) | `cardio-done-pop` | Disable |
| 498 | (cardio timing rule) | `cardio-timing-pulse` **infinite** | Disable — highest priority |
| 517 | (cardio nudge rule) | `cardio-nudge` | Disable |
| 667 | `.pwkt-stage .exercise-card.pwkt-slide-in-right` | `pwkt-in-from-right` | Disable |
| 668 | `.pwkt-stage .exercise-card.pwkt-slide-in-left` | `pwkt-in-from-left` | Disable |
| 669 | `.pwkt-stage .exercise-card.pwkt-slide-out-left` | `pwkt-out-to-left` | Disable |
| 670 | `.pwkt-stage .exercise-card.pwkt-slide-out-right` | `pwkt-out-to-right` | Disable |
| 738 | `.rest-overlay` | `rest-appear` | Disable |
| 782 | `.rest-card.rest-done` | `rest-done` | Disable |
| 791 | `.rest-card.rest-nudge` | `rest-nudge` | Disable |
| 800 | `.btn-nudge` | `btn-nudge` | Disable |
| 811 | `.drum-sheet .drum-backdrop` | `drum-fade-in` (opacity only) | **KEEP** |
| 813 | `.drum-sheet.drum-leaving .drum-backdrop` | `drum-fade-out` (opacity only) | **KEEP** |
| 822 | `.drum-panel` | `drum-rise` | Disable |
| 825 | `.drum-sheet.drum-leaving .drum-panel` | `drum-fall` | Disable |

Four animations are opacity- or colour-only and must be **kept** — removing them would make surfaces
appear and vanish abruptly, which is worse for the same users.

## Critical correctness constraint

Several disabled animations use `both` or `forwards` fill modes and are the **only** thing putting
the element in its final visual state:

- `.pwkt-slide-in-right` / `-left` (lines 667-668) use `both` — the carousel card relies on the
  animation's end state to be at `opacity: 1; transform: none`.
- `.finish-reveal` (line 420) uses `both`.
- `.rest-overlay` (line 738) uses `both`.
- `.drum-panel` (line 822) uses `forwards` — without it the panel stays at `translateY(100%)`,
  i.e. **completely off screen**.

Setting `animation: none` on these alone would leave the element stuck in its *pre-animation*
state. Each therefore needs its resting state restated explicitly. This is the one place where a
careless edit makes the app unusable under reduced motion — the drum picker would simply never
appear.

## Steps

1. Open `styles.css` and locate the block at line 1377-1389 shown above.

2. Leave that block's existing nine `:active` selectors exactly as they are.

3. Inside the same `@media (prefers-reduced-motion: reduce) { … }` block, append the following.
   Do not create a second media block.

```css
  /* Keyframes: drop movement and looping. Opacity/colour-only animations
     (screen-fade-in, ex-header-flash, drum-fade-in/out) are deliberately left
     running — removing those makes surfaces appear and vanish abruptly. */
  #finish-btn.finishing,
  .set-row.row-nudge,
  .set-skip-btn.pop,
  .set-check-btn.pop,
  .btn-nudge,
  .rest-card.rest-nudge,
  .rest-card.rest-done { animation: none; }

  /* Fill-mode dependents: these animations were also supplying the element's
     resting state, so it has to be restated or the element stays stuck in its
     pre-animation position. */
  .finish-reveal { animation: none; opacity: 1; transform: none; }
  .rest-overlay  { animation: none; opacity: 1; transform: translateX(-50%); }
  .pwkt-stage .exercise-card.pwkt-slide-in-right,
  .pwkt-stage .exercise-card.pwkt-slide-in-left {
    animation: none; opacity: 1; transform: none;
  }
  .pwkt-stage .exercise-card.pwkt-slide-out-left,
  .pwkt-stage .exercise-card.pwkt-slide-out-right {
    animation: none; opacity: 0;
  }
  .drum-panel { animation: none; transform: none; }
  .drum-sheet.drum-leaving .drum-panel { animation: none; transform: translateY(100%); }
```

4. The infinite pulse and the remaining pop/shake rules are matched by class in the app's markup.
   Add these too, in the same block:

```css
  .cardio-done-btn[data-timer-state="running"],
  .cardio-nudge,
  .ex-num-pop,
  .field-shake { animation: none; }
```

   **Before writing step 4**, read `styles.css` lines 376, 448, 485, 498 and 517 and replace the
   four selectors above with the *actual* selectors those rules use. The table gives line numbers;
   the selectors were not fully captured when this plan was written and must be read from the file.
   Do not guess them.

5. Verify `.rest-overlay`'s resting transform. Read `styles.css:714-720`. The rule sets
   `left: 50%; transform: translateX(-50%)`. If that is still true, step 3's
   `transform: translateX(-50%)` is correct. If it has changed, use whatever the base rule uses.

## Scope boundaries

- **Only** `styles.css`. No JS changes.
- Do **not** touch the nine existing `:active` rules.
- Do **not** add `transition: none` anywhere — transitions on opacity, colour and background are
  explicitly in scope to keep.
- Do **not** add a global `* { animation: none !important }` sledgehammer. It would kill the four
  opacity-only animations that must survive, and `!important` would be unremovable later.
- Do **not** change any duration or easing outside the media block.

## Verification

1. **Automated:** no build step in this repo. Confirm the file still parses by loading the app —
   `node /opt/node22/lib/node_modules/http-server/bin/http-server -p 8099 -s .` then open
   `http://127.0.0.1:8099/index.html` and check the console is clean.

2. **Functional, reduced motion ON.** In Chrome DevTools: Rendering panel →
   "Emulate CSS media feature prefers-reduced-motion" → `reduce`. Then walk the app and confirm
   **every one of these still works**:
   - Settings sheet opens and is fully visible (not stuck off-screen).
   - Tapping a weight field opens the drum picker and it is **fully on screen**. This is the
     highest-risk regression in this plan.
   - Start a workout; the exercise card is visible, not stuck translated or at `opacity: 0`.
   - Complete a set; the rest timer overlay appears centred and readable.
   - Finish a workout; the Finish button reaches its "Saved" state.

3. **Functional, reduced motion OFF.** Toggle the emulation back to "no-preference" and repeat the
   same walk. Nothing should have changed from today's behaviour — this plan must be a no-op when
   the media query does not match.

4. **Feel-check.** With reduced motion ON, start a cardio exercise and watch the Done button for a
   full 10 seconds. It must be completely still. The infinite pulse at `styles.css:498` is the
   single most important thing this plan removes; if it is still breathing, step 4 targeted the
   wrong selector.
