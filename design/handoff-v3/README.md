# Handoff: FitPlan — Apple-native fitness app

## Overview
FitPlan is a fitness app: a member-facing Home → Workout → Settings flow plus a staff Admin roster. The design follows Apple's Human Interface Guidelines — SF type scale, iOS system grays on true black, translucent chrome, and iOS presentation motion.

## About the design files
These are **design references built in HTML** — prototypes showing intended look, layout, and motion, not production code to copy. Recreate them in the target codebase's own environment (SwiftUI, React Native, React, etc.) using its component patterns. If the target is native iOS, most of what follows maps to system primitives directly (`.systemGroupedBackground`, `UIVisualEffectView`, `.sheet`) — prefer those over reimplementing.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, and timings below are final.

## Device frame & safe area
Each screen renders in a simulated 430×932 phone frame (iPhone 15/16 Pro Max logical size) that scales to fit the viewport. The frame is a **presentation device for the prototype only** — do not build it.

What *is* real: the content is inset **54px top / 8px sides / 8px bottom** so nothing sits under the status bar or Dynamic Island. In the real app use the OS safe area (`env(safe-area-inset-*)` on web, `safeAreaInsets` / `.safeAreaInset` on native) rather than the hardcoded 54px, which was tuned to this specific mock.

## Design tokens
Declared as CSS custom properties on the frame element in every screen file.

| Token | Value | Role | iOS equivalent |
|---|---|---|---|
| `--bg` | `#000000` | App background | `.systemBackground` (dark) |
| `--fill1` | `#1C1C1E` | Cards, grouped list rows | `.secondarySystemGroupedBackground` |
| `--fill2` | `#2C2C2E` | Nested fills, inputs, avatars | `.tertiarySystemFill` |
| `--fill3` | `#3A3A3C` | Segmented-control thumb, track | `.quaternarySystemFill` |
| `--sep` | `rgba(84,84,88,.5)` | Hairlines | `.separator` |
| `--label` | `#FFFFFF` | Primary text | `.label` |
| `--label2` | `rgba(235,235,245,.60)` | Secondary text | `.secondaryLabel` |
| `--label3` | `rgba(235,235,245,.32)` | Tertiary text, chevrons | `.tertiaryLabel` |
| `--accent` | `#A8E635` | Brand lime — primary action, progress, completion | tint color |
| `--onAccent` | `#182A04` | Text/icons on accent fill | — |
| `--blue` | `#0A84FF` | System blue, reserved | `.systemBlue` |
| `--e` | `cubic-bezier(0.32, 0.72, 0, 1)` | Standard easing curve | iOS presentation curve |

Additional literal values used inline: `#30D158` (system green, toggle on), `rgba(118,118,128,.24)` (segmented-control / search-field track), `rgba(168,230,53,.16–.18)` (accent tint fills).

**Accent discipline:** lime appears only on the single primary action per screen, progress indicators, completion states, and bar-button labels. It is never used for chrome, borders, or decoration. Keep this rule — it is what makes the primary action unmistakable.

## Typography
System font stack: `-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif`. On native, use the system font and Dynamic Type text styles.

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Large title | 34px | 700 | −0.9px |
| Title (exercise name) | 32px | 700 | −0.9px |
| Title 2 (sheet, section) | 22px | 700 | −0.5px |
| Title 3 (card heading) | 20px | 700 | −0.4px |
| Stat numeral | 26–30px | 700 | −0.5 to −0.7px |
| Body | 17px | 400–600 | −0.2px or 0 |
| Subhead | 15px | 400–600 | 0 |
| Footnote | 13px | 400–600 | 0 / +0.7px if uppercase |
| Caption (min size) | 12px | 600 | +0.8 to +1.3px if uppercase |

Rules: **tracking is size-specific** — tighten as type grows, leave body near zero. Nothing below 12px. All numerals that change (weights, reps, counts, timers) use `font-variant-numeric: tabular-nums` so they don't jitter. Respect Dynamic Type: scale layout with the text, don't pin it to fixed px.

## Materials & depth
- **Nav bars and the Home action bar are translucent layers** — `backdrop-filter: blur(24px) saturate(180%)` over a `rgba(20,20,22,.72)` background, with content passing underneath. Not opaque bars. On native this is a `UIVisualEffectView` / `.toolbarBackground`.
- **Hairlines are 0.5px shadows** (`box-shadow: 0 0.5px 0 var(--sep)`), not 1px borders — 1px borders read as heavy at 3× density.
- **The Settings sheet is a real iOS sheet:** grabber, sticky translucent header, and the parent screen dimmed, scaled to 0.94, and pushed up 12px behind it, so the layer relationship is legible.
- Radii: 52px frame, 24px screen content, 22px large cards, 20px sets card, 16px cards/grouped lists, 12–14px controls, 10px segmented controls.

## Motion
One curve for everything: `--e: cubic-bezier(0.32, 0.72, 0, 1)`.

**Press feedback is asymmetric** — this is the detail that makes it feel Apple. Press snaps in, release eases back:

```css
/* base (release) */  transition: transform 260ms var(--e), background 200ms var(--e);
/* :active (press) */ transform: scale(0.96); transition: transform 90ms var(--e);
```

Press scale by element: 0.94 (icon buttons), 0.96 (set actions), 0.975 (primary CTA), 0.985 (full-width rows and cards). Bar-button labels dim to `opacity: .4` in 60ms and fade back over 240ms instead of scaling.

**Sheet presentation** — 460ms on `--e`: sheet translates up from `translateY(100%)`, scrim fades in, parent scales back to 0.94 simultaneously. This exceeds the 300ms UI budget deliberately; a large deliberate surface earns it.

**Rules to preserve:**
- Animate `transform` and `opacity` only. Never `filter`, `width`, `height`, or layout properties.
- Feedback fires on pointer-**down**, not on release.
- `prefers-reduced-motion` keeps opacity and color transitions but drops movement — gentler, not zero.
- Hover states carry **no movement** (background/opacity only). In the real app, gate them behind `@media (hover: hover) and (pointer: fine)`.

**If you add drag-to-dismiss on the sheet** (recommended), the keyframe entrance must become a spring: 1:1 finger tracking, release velocity handed to the spring, momentum-projected landing point, and interruptible mid-flight. Keyframes cannot be grabbed and reversed.

## Screens

### FitHome — `FitHome.dc.html`
Large-title header (`Wednesday, July 1` / **Today**) with a 44px settings button. Then three cards: **Today's Session** (gradient masthead `linear-gradient(140deg,#5E8F14,#2C6AAE)`, name, and two meta pills for duration and exercise count), **This Week** (84px progress ring, 2 of 3, plus a seven-day strip — filled lime for complete, ring-outlined for today, gray for the rest), and a **last session** row that pushes to history. Fixed translucent action bar at the bottom holds the only primary button, Start Workout.

### FitWorkout — `FitWorkout.dc.html`
Translucent nav bar: Home back-button, `Exercise 2 of 6`, live timer, and a 3px lime progress bar beneath. Exercise name as a 32px title with muscle group and `3 × 12`. Then the sets card, which fills the remaining column height:
- **Completed and upcoming sets collapse to one quiet summary line** (`40 kg × 12 reps` + a check circle) — completed in accent tint, upcoming in gray. They expand to absorb spare vertical space so the card fills the column with no dead zone.
- **The active set is the only row with editable inputs** — large tabular numerals in bordered fields with kg/reps captions, a lime left-edge marker, a raised background tint, and a Skip / confirm (✓) button pair.

Below: a full-width Watch Tutorial secondary button, then an **Up Next** peek row for wayfinding.

### FitSettings — `FitSettings.dc.html`
iOS sheet over the dimmed app. Grabber, sticky header with title and a lime Done button. Grouped inset sections — **Units** (kg/lbs segmented control), **Developer** (Test Mode toggle, Test Day 4-way segmented control), **Info** (four read-only value rows), and an **Admin Dashboard** disclosure row. All rows are min 52px.

### FitAdmin — `FitAdmin.dc.html`
Staff-only. Translucent nav bar with a Settings back-button and Sign Out. Large title **Members** with a Staff badge and the signed-in coach's email, a search field, a 2×2 stat grid (total members, active this week, workouts logged, average per week), then the roster as a **grouped list** — 42px initials avatar, name, a lime dot for active members, `N workouts · last active`, and a chevron. Deliberately not a table: a horizontally-scrolling table is wrong on a phone.

## Interactions & state
- Navigation is a single `screen` value (`home` | `workout` | `settings` | `admin`); each screen is a separate component swapped by conditional render. Replace with the target's real router/navigation.
- Screen transitions are **not** implemented — add them per platform. Enter and exit must follow the same path (a screen that pushes in from the right dismisses to the right).
- Home and Workout are designed to fit the viewport without scrolling. Settings and Admin scroll.
- The `scale`-to-fit logic in each file's component class serves the prototype frame only. Do not port it.

## Data
All content is static placeholder — workout plan, sets, member roster, and stats. Wire to real sources during implementation. The Workout screen needs live state for the timer, per-set weight/reps values, and set completion.

## Assets
No external images. All icons are inline stroke SVG, ~2–2.6px stroke with round caps and joins, in the SF Symbols idiom. On native, substitute real SF Symbols.

## Files
- `FitPlan.dc.html` — screen switcher / router shell
- `FitHome.dc.html` — Home
- `FitWorkout.dc.html` — Workout
- `FitSettings.dc.html` — Settings sheet
- `FitAdmin.dc.html` — Admin roster
- `support.js` — prototype runtime, not needed by the target app

Each screen file is self-contained: it declares the full token set and can be opened on its own.
