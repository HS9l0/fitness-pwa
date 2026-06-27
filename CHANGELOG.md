# FitPlan Changelog

---

## v65 — 2026-06-27
- Fix: "Begin Workout" button was broken (used deleted variable `nextDay`)
- Fix: YouTube tutorial link icon now uses theme colour instead of hardcoded red
- Fix: developer debug info (version, date, session count) hidden unless Test Mode is on
- Bump SW cache to evict all clients to v65

## v64 — 2026-06-26
- Fix: white screen caused by duplicate `streakDays` declaration crashing the JS module
- Fix: bump SW cache to force eviction of broken JS from all open tabs
- Feat: lock workouts to calendar schedule — Day 1 on Monday, Day 2 on Wednesday, Day 3 on Friday only
- Feat: Test Mode in Settings — bypass Mon/Wed/Fri lock, pick any test day, view version and session debug info
- Feat: merge "This Week" activity ring and streak-dot calendar into one card
- Feat: prevent starting a second workout if one was already completed today

## v63 — 2026-06-25
- Fix: define missing `ICO_CLOCK` and `ICO_DUMBBELL` constants in workout.js after revert
- Fix: reset container styles on workout entry; clear active session when navigating back
- Fix: hide cogwheel settings button during workout via CSS class

## v62 — 2026-06-24
- Feat: port full iOS HIG light-mode redesign into the PWA
  - SF Pro font, Energy Orange accent (`#ff5a3c`), system grey palette
  - 18 px card radius, all CSS variables replaced with HIG tokens
- Feat: four-level HIG button hierarchy (Primary / Gray / Tinted / Plain)
- Feat: replace YouTube red CTA with plain text link row
- Feat: add workout summary card to pre-workout overview screen
- CI: add GitHub Actions workflow to auto-bump SW cache version on every push
- Fix: rest timer +30 s now immediately grows the blue arc
- Fix: hide cogwheel settings button during workout

## v61 — 2026-06-23
- Fix: remove weekday text / badges from all workout screen headers
- Remove: "Next day" label from Home "Next Up" card (redundant)
- Force SW cache clear to ensure all clients pick up redesign

## v60 — 2026-06-22
- Feat: redesign all buttons to follow Apple HIG prominence guidelines
- Feat: replace all emoji and arrow characters with SF Symbol-style SVG icons
- Remove: header badge, tagline, and stats from the home screen

## v59 — 2026-06-21
- Remove: Plan, Progress, and Nutrition tabs from the app entirely
- Fix: make home pill buttons clearly visible with white border on gradient backgrounds

## v58 — 2026-06-20
- Remove: bottom tab bar — navigation now lives in a sidebar / cogwheel
- Feat: cogwheel settings panel accessible from home screen header
- Feat: weight unit setting (kg / lbs) stored in localStorage

## v57 — 2026-06-19
- Feat: toggle Plan and Progress tabs on/off from the Admin Dashboard
- Feat: separate weight and reps drum pickers; redesigned personal records display

## v56 — 2026-06-18
- Fix: always use `env(safe-area-inset-top)` for header padding on notched devices
- Fix: remove top gap in standalone PWA mode
- Fix: remove phantom URL-bar space in standalone PWA mode

## v55 — 2026-06-17
- Feat: add 0.5 kg fraction wheel to the weight picker

## v54 — 2026-06-16
- Fix: iOS ghost screen — decouple display from animation via z-index layering
- Fix: iOS ghost screen — use `display:none` on inactive screens instead of `opacity:0`
- Fix: iOS ghost screen — strip slide classes from leaving screen immediately

## v53 — 2026-06-15
- Feat: auto-reload all open tabs when a new service worker activates
- Fix: match body background to nav colour (removes iOS bottom bar bleed)
- Fix: solid background on all screens to prevent bleed-through between transitions

## v52 — 2026-06-14
- Feat: add Skip Set button; hide Finish Workout until all sets are ticked or skipped
- Fix: hide leaving screen instantly, only fade in the entering screen
- Remove: timer pulse animation (too distracting)
- Rework: all screen transitions to simple fade (removes slide ghost artefacts)

## v51 — 2026-06-13
- Feat: phone-optimised workout — one exercise at a time with slide navigation
- Feat: weight wheel shows 0–200 in steps of 1 (same as reps)
- Feat: increase max reps input to 200
- Fix: smooth dropdown animation using CSS grid-rows trick

## v50 — 2026-06-12
- Feat: move set checkmark below the kg × reps bubbles as a full-width button
- Fix: add vertical padding to set rows for easier tapping
- Fix: increase gap between weight and reps fields

## v49 — 2026-06-11
- Feat: replace number inputs with iOS-style drum picker wheels for weight and reps
- Redesign: set input as iPhone grouped-list UI

## v48 — 2026-06-10
- Remove: Firebase authentication, water tracker, and "Today's Thought" card
- Fix: disable double-tap zoom on iOS
- Fix: mobile touch — tap highlight, 300 ms delay, JS-triggered pop animation, keyboard dismiss

## v47 — 2026-06-09
- Fix: close completed exercise dropdown when rest timer opens the next exercise
- Fix: append rest overlay to `document.body` to avoid containment by screen element
- Fix: add rest timer to the cardio "Mark as Done" handler

## v46 — 2026-06-08
- Feat: rest timer automatically opens the next exercise on finish or skip

## v45 — 2026-06-07
- Fix: remove `opacity` from slide-in keyframe to stop inactive screens ghosting through

## v44 — 2026-06-06
- Overhaul: phone workout UI (full-screen cards, swipe-friendly layout)
- Overhaul: all animations for smoother feel

## v43 — 2026-06-05
- Redesign: deep blue theme — navy background, electric blue accent, cool text tones
- Polish: rounder corners, nav pill, card shadows, header gradient, SVG chevrons

## v42 — 2026-06-04
- Replace: exercise video embed → YouTube search link (avoids embed quota limits)
- Feat: full-width YouTube button per exercise

## v41 — 2026-06-03
- Remove: History screen and its nav entry entirely
- Fix: tighten UX spacing; fix PWA bottom safe-area black hole

## v40 — 2026-06-02
- Feat: set-logging UI redesign for better aesthetics
- Feat: TDEE macro calculator inside goal customiser

## v39 — 2026-06-01
- Feat: customisable kcal, protein, and fat goals in admin settings
- Feat: inline goal editor button on the nutrition screen

## v38 — 2026-05-31
- Feat: protein and fat progress rings alongside calorie ring
- Feat: protein and fat tracking added to nutrition screen

## v37 — 2026-05-30
- Feat: progress screen, barcode scanner, rest timer, body-weight log
- Fix: AI scan error handling and image compression
- Fix: auto-retry AI scan on rate limit with countdown UI

## v36 — 2026-05-29
- Switch: food AI scanner to OpenRouter API (meta-llama/llama-4-maverick)

## v35 — 2026-05-28
- Fix: admin toggle to enable/disable the Nutrition tab for all users

## v34 — 2026-05-27
- Feat: broadcast Gemini API key to all user profiles on save via Firestore

## v33 — 2026-05-26
- Feat: sync Gemini API key via Firestore so it works on all devices
- Feat: restore Gemini API key field to admin settings panel

## v32 — 2026-05-25
- Fix: replace broken exercise video IDs (Arms, Leg Day)

## v31 — 2026-05-24
- Feat: exercise videos + richer UI on all screens
- Feat: add AI food calorie tracker with camera scan

## v30 — 2026-05-23
- Feat: remember-me login; fix cardio video IDs

## v29 — 2026-05-22
- Feat: admin controls panel for staff management

## v28 — 2026-05-21
- Feat: move all app settings to the admin dashboard
- Feat: admin adder UI

## v27 — 2026-05-20
- Redesign: warm palette; merge staff login into main sign-in

## v26 — 2026-05-19
- Feat: unified login with two buttons; graceful Firestore error handling
- Feat: admin.html doubles as login for all users

## v25 — 2026-05-18
- Fix: remove stale `denyEl` reference causing blank screen

## v24 — 2026-05-17
- Feat: admin dashboard at `/admin.html`

## v23 — 2026-05-16
- Fix: remove `opacity` from slide keyframes; bump SW cache to clear blank screen

## v22 — 2026-05-15
- Feat: page transitions and water-tracker animations

## v21 — 2026-05-14
- Feat: desktop layout, Firebase Firestore sync, Google Sign-In

## v20 — 2026-05-13
- Fix: use relative paths for GitHub Pages `/fitness-pwa/` subdirectory

## v19 — 2026-05-12
- Feat: initial FitPlan PWA — workout tracking with Day 1/2/3 programme, water logging, session history, service worker offline cache

---

*Versions v1–v18 cover internal alpha development before the first GitHub push.*
