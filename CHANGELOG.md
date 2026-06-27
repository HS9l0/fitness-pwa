# FitPlan Changelog

---

## v65 — 2026-06-27
- Fix: "Begin Workout" button was broken (passed deleted variable `nextDay` instead of `todayDay`)
- Fix: YouTube tutorial link icon now uses `--text-muted` instead of hardcoded red
- Fix: developer debug info (version, date, session count) hidden unless Test Mode is on

## v64 — 2026-06-27
- Fix: white screen caused by duplicate `streakDays` declaration crashing the JS module
- Fix: bump SW cache to force-evict broken JS from all open tabs
- Feat: lock workouts to Mon = Day 1, Wed = Day 2, Fri = Day 3 — no access on other days
- Feat: Test Mode in Settings — bypass day lock, pick any test day, view debug info
- Feat: merge "This Week" activity ring and streak-dot calendar into one card
- Feat: prevent starting a second workout if one was already completed today

## v63 — 2026-06-26
- Feat: merge "This Week" ring and calendar (first pass)
- Fix: remove duplicate `streakDays` variable (initial crash fix)

## v62 — 2026-06-25
- Feat: port full iOS HIG light-mode redesign into the PWA (SF Pro font, Energy Orange `#ff5a3c`, system grey palette, 18 px radius)
- Feat: four-level HIG button hierarchy (Primary / Gray / Tinted / Plain)
- Feat: replace YouTube red CTA with a plain text link row
- CI: GitHub Actions workflow to auto-bump SW cache version on every push
- Fix: rest timer +30 s now immediately grows the blue arc
- Fix: hide cogwheel settings button during workout

## v61 — 2026-06-22
- Revert to stable v62 baseline after design experiments
- Fix: `ICO_CLOCK` and `ICO_DUMBBELL` constants were missing in workout.js
- Fix: reset container styles on workout entry; clear active session when navigating back
- Fix: hide cogwheel via CSS class (not inline style) during workout
- Feat: add workout summary card to the pre-workout overview screen

## v60 — 2026-06-22
- Feat: redesign all buttons following Apple HIG prominence guidelines
- Feat: replace all emoji and arrow chars with SF Symbol-style SVG icons
- Remove: header badge, tagline, and stats from the home screen
- Remove: weekday badge and text from all workout headers

## v59 — 2026-06-22
- Remove: Plan, Progress, and Nutrition tabs from the app entirely
- Fix: make home pill buttons clearly visible with white border

## v58 — 2026-06-22
- Remove: bottom tab bar — navigation now uses a sidebar + cogwheel
- Feat: cogwheel settings panel with weight unit toggle (kg / lbs)
- Feat: admin toggle to enable/disable Plan and Progress tabs

## v57 — 2026-06-22
- Feat: separate weight and reps drum pickers with redesigned personal records display
- Fix: always use `env(safe-area-inset-top)` for header padding on notched devices
- Fix: remove top gap and phantom URL-bar space in standalone PWA mode

## v56 — 2026-06-22
- Feat: auto-reload all open tabs when a new service worker activates
- Fix: three-part iOS ghost-screen fix (z-index layering, `display:none`, strip slide classes)
- Fix: solid background on all screens to prevent bleed-through

## v55 — 2026-06-22
- Feat: add 0.5 kg fraction wheel to the weight picker
- Feat: phone-optimised workout — one exercise at a time with slide navigation
- Feat: weight and reps wheels go 0–200 in steps of 1

## v54 — 2026-06-22
- Feat: replace number inputs with iOS-style drum picker wheels
- Redesign: set input as iPhone grouped-list UI
- Fix: add vertical padding to set rows; move checkmark below bubbles as full-width button

## v53 — 2026-06-22
- Remove: Firebase authentication, water tracker, and "Today's Thought" card
- Fix: disable double-tap zoom on iOS; fix tap highlight and keyboard dismiss

## v52 — 2026-06-22
- Fix: match body background to nav colour (removes iOS bottom-bar bleed)
- Fix: rework all transitions to simple fade (eliminates ghost artefacts)
- Feat: add Skip Set button; hide Finish Workout until all sets are ticked or skipped

## v51 — 2026-06-21
- Fix: close completed exercise dropdown when rest timer opens next exercise
- Fix: append rest overlay to `document.body` (was trapped in screen element)
- Fix: add rest timer to the cardio "Mark as Done" handler

## v50 — 2026-06-21
- Feat: rest timer automatically opens the next exercise on finish or skip
- Overhaul: phone workout UI — full-screen cards, swipe-friendly layout
- Overhaul: all animations for smoother transitions

## v49 — 2026-06-21
- Fix: mobile touch — tap highlight, 300 ms delay, JS pop animation, keyboard dismiss
- Polish: rounder corners, nav pill, card shadows, header gradient, SVG chevrons
- Redesign: deep blue theme (navy background, electric blue accent)

## v48 — 2026-06-21
- Feat: full-width YouTube search button per exercise (replaces embedded video)
- Remove: History screen and nav entry

## v47 — 2026-06-21
- Feat: TDEE macro calculator inside goal customiser
- Fix: tighten UX spacing and fix PWA bottom safe-area black hole

## v46 — 2026-06-21
- Feat: customisable kcal, protein, and fat goals in admin settings
- Feat: inline goal editor button on the nutrition screen

## v45 — 2026-06-21
- Feat: protein and fat progress rings alongside calorie ring
- Feat: protein and fat tracking on nutrition screen

## v44 — 2026-06-21
- Fix: set-logging UI redesigned for better aesthetics

## v43 — 2026-06-21
- Feat: admin toggle to enable/disable the Nutrition tab for all users
- Feat: progress screen, barcode scanner, rest timer, body-weight log

## v42 — 2026-06-21
- Switch: food AI back to direct Gemini API (OpenRouter removed)

## v41 — 2026-06-21
- Switch: food AI scanner to OpenRouter (meta-llama/llama-4-maverick:free)

## v40 — 2026-06-21
- Switch: food AI model to Gemini 2.5 Flash for higher rate limits

## v39 — 2026-06-21 *(v16)*
- Switch: food AI model to Gemini 2.5 Pro

## v38 — 2026-06-21 *(v15)*
- Revert: food AI back to direct Gemini API (1.5-flash removed upstream)

## v37 — 2026-06-21
- Fix: auto-retry AI scan on rate limit with countdown UI
- Fix: AI scan error handling and image compression

## v36 — 2026-06-21
- Feat: add AI food calorie tracker with camera scan

## v35 — 2026-06-20
- Feat: exercise videos + richer UI on all screens
- Feat: restore Gemini API key field; sync key via Firestore to all devices

## v34 — 2026-06-20
- Feat: remember-me login; fix cardio video IDs and broken exercise video IDs

## v33 — 2026-06-20
- Feat: admin controls panel for staff management

## v32 — 2026-06-20
- Feat: move all app settings to admin dashboard; admin adder UI

## v31 — 2026-06-20
- Redesign: warm palette; merge staff login into main sign-in

## v30 — 2026-06-20
- Feat: unified login with two buttons; graceful Firestore error handling
- Feat: admin.html doubles as login page for all users

## v29 — 2026-06-20
- Fix: remove stale `denyEl` reference causing blank screen

## v28 — 2026-06-20
- Feat: add admin controls to staff panel

## v27 — 2026-06-20 *(v12)*
- Bump SW cache to v12 to force nutrition.js refresh

## v26 — 2026-06-20
- Feat: admin dashboard at `/admin.html`

## v25 — 2026-06-20
- Feat: add animations and screen transitions
- Fix: proper page transitions and water animations
- Fix: blank screen — remove `opacity` from slide keyframes

## v24 — 2026-06-20
- Feat: desktop layout, Firebase Firestore sync, Google Sign-In

## v23 — 2026-06-20
- Fix: use relative paths for GitHub Pages `/fitness-pwa/` subdirectory

## v22 — 2026-06-20 *(v5)*
- Bump SW cache to v5

## v21 — 2026-06-20
- Initial: FitPlan PWA — workout tracking (Day 1/2/3 programme), water logging, session history, service worker offline cache

---

*Versions v1–v20 cover internal development before the first public GitHub commit on 2026-06-20.*
