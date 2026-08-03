# Handoff: FitPlan — Apple Fitness Web App UI

## Overview
FitPlan is a fitness app UI: a member-facing Home/Workout/Settings flow plus a staff Admin dashboard, styled to match Apple's native HIG conventions (SF Pro, true-black dark theme, lime accent). Simulated in a 430×932 phone frame.

## About the Design Files
The files in this bundle are **design references built in HTML** — prototypes showing intended look, layout, and behavior, not production code to copy directly. Recreate these designs in the target codebase's existing environment (React, SwiftUI, native, etc.), or choose the most appropriate framework if none exists yet, using the codebase's own component patterns.

## Fidelity
**High-fidelity.** Colors, type, spacing, and radii below are final — recreate pixel-perfectly with the target stack's own primitives.

## Screen simulation & safe area
All screens render inside a 430×932 phone frame (`FitPlan.dc.html` is the shell; it swaps in `FitHome`/`FitWorkout`/`FitSettings`/`FitAdmin` via a `screen` state).

- Frame content area is inset with **padding: 54px top / 8px sides / 8px bottom**, background `#000`, so nothing sits under the iOS status bar / Dynamic Island, and there's an even black safe-area border on all sides. Inner content area has `border-radius: 22px; overflow: hidden`.
- Build this as the actual OS safe-area in the real app (`env(safe-area-inset-*)` on web, `safeAreaInsets` on native) rather than a hardcoded 54px — 54px was tuned to this specific simulated frame/notch.

## Screens / Views

### FitHome
- Purpose: landing screen — masthead, "Next Up" workout card, week overview, Start Workout CTA.
- Layout: full-height flex column, no internal scroll. Masthead (28px accent icon + wordmark) → gradient "Next Up" card → week strip → sticky-style Start Workout button pinned near bottom.
- Nav: tapping into workout/settings/admin swaps the whole screen via parent state (`goWorkout`, `goSettings`, `goAdmin`).

### FitWorkout
- Purpose: in-workout exercise flow.
- Layout: compact top nav bar (Home back button, "Exercise 2 of 6" label, running timer "12:45"), hero exercise title, then exercise detail/rep content, and a secondary "Watch tutorial" outline button (HIG gray secondary style, 40px min height).

### FitSettings
- Purpose: settings, presented as an iOS-style modal sheet.
- Layout: dimmed/blurred backdrop over the app (`rgba(0,0,0,.55)` + 2px blur) with a bottom-anchored sheet (`border-radius:18px 18px 0 0`, max-height 88%, own scroll). Sheet header is sticky with title + "Done" button (44px hit target).

### FitAdmin
- Purpose: staff-only dashboard — member roster and stats.
- Layout: sticky 54px header (logo, "Staff" pill badge, coach email) over a scrollable data table. Table headers: uppercase, 10px, letter-spacing 1px, dim color.

## Design Tokens
Defined as CSS custom properties on the phone-frame wrapper in `FitPlan.dc.html`:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#000000` | App background (true black) |
| `--surface` | `#0f1115` | Cards, headers |
| `--surface2` | `#181b21` | Secondary surface |
| `--border` | `rgba(255,255,255,.10)` | Hairlines |
| `--text` | `#f2f5fa` | Primary text |
| `--muted` | `rgba(232,238,247,.62)` | Secondary text |
| `--dim` | `rgba(232,238,247,.38)` | Tertiary/disabled text |
| `--accent` | `#a8e635` | Primary (lime) — CTAs, active states |
| `--accentSoft` | `rgba(168,230,53,.16)` | Accent tints/badges |
| `--accent2` | `#72b4ea` | Secondary (blue) |
| `--accent3` | `#a78bfa` | Tertiary (purple) accents |
| `--onAccent` | `#16230b` | Text/icons on accent fill |
| `--grad` | `linear-gradient(135deg,#6a9e1c 0%,#2f6db0 100%)` | "Next Up" hero card |
| `--field` | `rgba(255,255,255,.05)` | Input/field fill |
| `--seg` | `#22262e` | Segmented control track |

Typography: `-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif`. Sizes range 10px (table labels/uppercase) to 17px (sheet titles); body copy 13–15px. Buttons: 44px min-height for primary tap targets per HIG (secondary/inline buttons may be 40px, e.g. "Watch tutorial").

Radii: cards 18px, buttons 10–13px, phone frame 44px (outer), 22px (safe-area inner content).

## Interactions & Behavior
- Bottom nav / screen switching is managed by `FitPlan`'s logic class (`state.screen`, one of `home | workout | settings | admin`); each target screen is a separate DC swapped via conditional render.
- No page scrolling on Home/Workout (content fit to viewport); Settings sheet and Admin table scroll internally.
- No animated transitions are implemented in the prototype — add screen-transition motion (slide/fade) as appropriate for the target platform.

## State Management
- `screen`: current view (`home`/`workout`/`settings`/`admin`).
- Navigation handlers (`goHome`, `goWorkout`, `goSettings`, `goAdmin`) are passed down as callbacks — replace with real router/navigation in the target app.
- No live data wiring in the prototype (workout list, member table, etc. are static placeholder content) — connect to real data sources during implementation.

## Assets
No external image assets — all icons are inline SVG (stroke-based, Apple SF Symbols–style: 2–2.5px stroke, round caps/joins).

## Files
- `FitPlan.dc.html` — shell/phone-frame + screen switcher (source of truth for tokens + safe-area insets)
- `FitHome.dc.html` — Home screen
- `FitWorkout.dc.html` — Workout screen
- `FitSettings.dc.html` — Settings sheet
- `FitAdmin.dc.html` — Admin dashboard
- `support.js` — internal runtime, not needed by the target app
