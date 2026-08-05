# FitPlan Changelog

---

## v123 — 2026-08-05
- Chore: import the `component-lib` design system into a Claude Design project (18 components, all previews authored and verified)
- Fix: `component-lib` now builds a real library dist — ESM entry with React external, plus a `.d.ts` tree. It previously emitted a self-contained IIFE with React inlined and no declarations at all
- Docs: correct every colour claim in `conventions.md` and the component JSDoc — they described the pre-redesign palette. `--accent` is lime `#a8e635` (was documented as blue), `--accent2` is blue `#72b4ea` (was documented as green), `--bg` is `#000000`, `--radius` is `20px`
- Docs: `FitTheme` claimed to inject the `:root` variables; `styles.css` does
- No app-facing change — the PWA itself is untouched by this release

## v122 — 2026-08-03
- Fix: stop reserving `env(safe-area-inset-bottom)` when the viewport doesn't reach the bottom of the screen. Device diagnostics showed `innerHeight` 812 vs `screen.height` 874 — the home indicator sits outside the paintable area entirely, so that 32 pt was dead space
- Remove: the v117 VisualViewport `--vvh` machinery, which was built on a theory the diagnostics disproved

## v121 — 2026-08-03
- Fix: service worker install now fetches with `cache: 'reload'`. Without it `addAll` populated each new cache from the browser HTTP cache, so the SW version advanced while the JS behind it stayed stale — meaning v118–v120 may never have actually run on-device
- Feat: "Force update" row in Settings — drops all caches, unregisters the SW, and reloads. Leaves `localStorage` (history, settings) alone

## v120 — 2026-08-03
- Revert: the speculative viewport overrides from v117 and v119
- Feat: layout diagnostics in Settings — display mode, viewport/screen heights, and resolved safe-area insets, so the device can report its own numbers instead of being guessed at

## v119 — 2026-08-03
- Fix: bottom safe-area inset was applied twice — once on `.screen` and again on the sticky CTA wrapper — stacking ~94 pt of untappable dead space at the bottom of every screen
- Feat: enlarge the home masthead (26 px wordmark, larger date line) and give the cogwheel room so it is no longer squished
- Feat: pin "Start Workout" to the bottom of the screen instead of leaving it at mid-page height

## v118 — 2026-08-03
- Feat: import design handoff v2 and apply it to Home and Workout. The token layer already matched, so this is a density and type-scale pass only
- Feat: activity ring 104 px → 66 px, streak dots 28 px → 20 px, tighter card gaps and "Next Up" spacing
- Feat: surface each exercise's set target (e.g. "4×15") beside the muscles line — the data existed in `data.js` but had never been rendered
- Feat: Home becomes a flex column so the CTA pins to the bottom edge

## v117 — 2026-08-02
- Fix: black gap in the installed iOS PWA, attempt 2 — measure `visualViewport.height` into a `--vvh` custom property and use it for every full-bleed fixed element
- *This did not fix it either; reverted in v120.*

## v116 — 2026-07-28
- CI: SW cache bump now parses the current `vNNN` and increments it, replacing the commit-SHA stamp introduced while fixing the workflow
- CI: fix the cache-bump workflow, which had been failing with a 403 since before v115 — the default `GITHUB_TOKEN` was read-only, so `sw.js` stayed pinned at `fitplan-v115` no matter what shipped
- Remove: "Install on iPhone" card and its `isIos()` / `isInStandaloneMode()` helpers
- Remove: last-workout card from Home — tapping a date in History already shows the same detail
- Feat: top safe-area padding on the workout header so the Home button isn't flush to the edge
- Fix: black gap in the installed iOS PWA, attempt 1 — pin all four edges of `html`/`body` instead of using percentage heights
- *Because the bump workflow was broken, the first three changes above shipped to users under the stale `fitplan-v115` cache name.*

## v115 — 2026-07-21
- Feat: replace machine-based exercises with home / bodyweight alternatives

## v114 — 2026-07-07
- Fix: drop duplicate elapsed time from the cardio Done button label

## v113 — 2026-07-07
- Feat: sets unlock one at a time instead of all being open at once

## v112 — 2026-07-07
- Feat: tapping an exercise chip in the last-workout dropdown opens its History detail

## v111 — 2026-07-07
- Fix: gray out the cardio Done button more clearly once disabled

## v110 — 2026-07-07
- Fix: disable the cardio Done button and drop its green tint

## v109 — 2026-07-07
- Fix: lock outer page bounce/scroll when installed as a standalone web app

## v108 — 2026-07-04
- Feat: skipping the last set of an exercise advances straight to the next one

## v107 — 2026-07-04
- Fix: match set-number size to the kg / reps pill numbers

## v106 — 2026-07-04
- Fix: enlarge the set weight/reps number so it better fills its pill

## v105 — 2026-07-04
- Fix: tapping the tick with unset weight/reps now opens the picker instead of only shaking

## v104 — 2026-07-04
- Fix: dedupe the workout click listener so re-entering the workout screen doesn't stack duplicate handlers

## v103 — 2026-07-04
- Feat: replace the cardio notes field with a start/stop timer that saves elapsed time to history

## v102 — 2026-07-04
- Feat: home title logo badge, centred cogwheel, even card spacing
- Fix: rest-blocking silently ate skip/tick taps

## v101 — 2026-07-04
- Feat: Apple-style progress header, elapsed timer, and spring transitions in the workout carousel

## v100 — 2026-07-02
- Feat: remove the Next Exercise button; navigation now lives in the rest timer

## v99 — 2026-07-02
- Feat: skip the intro page — Start Workout goes straight into the active workout

## v98 — 2026-07-02
- Rework: remove rest-timer auto-navigation; the user taps Next Exercise to proceed

## v97 — 2026-07-02
- Feat: red shake on "Mark as Done" when Next Exercise is tapped without marking

## v96 — 2026-07-02
- Fix: brighten the cardio "Mark as Done" button so it reads as enabled

## v95 — 2026-07-02
- Fix: clear rest-blocking on render, back, and finish
- Revert: the cardio bypass from v92

## v94 — 2026-07-02
- Fix: remove the sets label from the exercise card header

## v93 — 2026-07-02
- Fix: use `--accent2` blue for the exercise meta sets label instead of `--accent` lime

## v92 — 2026-07-02
- Fix: match skip button height to the tick button on phone
- Fix: allow Next Exercise on cardio without requiring "Mark as Done" *(reverted in v95)*

## v91 — 2026-07-02
- Feat: collapsible last-workout section on the home screen

## v90 — 2026-07-01
- Fix: show all exercises in last-workout; capitalise "Skipped"

## v89 — 2026-07-01
- Fix: show "skipped" instead of question marks in last-workout chips

## v88 — 2026-07-01
- Fix: remove prev/next arrows from the workout footer

## v87 — 2026-07-01
- Feat: block Next Exercise until all sets are done or skipped

## v86 — 2026-07-01
- Fix: block next-exercise navigation during the rest timer; hide the chevron on phone

## v85 — 2026-07-01
- Fix: add horizontal padding to the last-workout section inside the week card

## v84 — 2026-07-01
- Feat: block set logging while the rest timer is active

## v83 — 2026-07-01
- Feat: History page becomes a single-month calendar with navigation

## v82 — 2026-06-30
- Feat: add a full-page History screen

## v81 — 2026-06-30
- Feat: merged history card, date detail sheet, reset button, safe areas, sticky CTA

## v80 — 2026-06-30
- Fix: `doneToday` checks the current day match so Test Mode day-switching works

## v79 — 2026-06-30
- Fix: kg label after the decimal wheel; lime check-circle in last workout

## v78 — 2026-06-30
- Feat: show the day label in the overview header
- Feat: block marking a set done with zero weight or reps

## v77 — 2026-06-30
- Fix: fold the overview card into the header; rest timer sits above the footer; complete circle stays lime

## v76 — 2026-06-30
- Fix: event delegation for skip/tick; kg label between wheels; remove the workout title

## v75 — 2026-06-30
- Fix: set collapse uses a JS height animation; centre the kg wheels; remove hint text

## v74 — 2026-06-30
- Feat: set rows collapse to a summary on done/skip
- Fix: drum picker vignette

## v73 — 2026-06-30
- Feat: slim the workout header to a Home button only — day label, timer, and progress bar removed

## v72 — 2026-06-30
- Remove: warm-up callout card from the workout overview screen

## v71 — 2026-06-30
- Fix: cogwheel button uses `--surface` instead of white

## v70 — 2026-06-30
- Feat: add blue to progress indicators; fix the meta number colour

## v69 — 2026-06-30
- Fix: rest timer +30 s no longer resets the arc — the total grows with the remaining time

## v68 — 2026-06-30
- Fix: set rows stay neutral after done/skip — only the check button tints lime

## v66 – v67 — 2026-06-27 … 06-30
- *Not recorded. These versions predate the earliest commit in the current clone (the repository is checked out shallow, truncated at v68), so their contents could not be reconstructed from history.*

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
