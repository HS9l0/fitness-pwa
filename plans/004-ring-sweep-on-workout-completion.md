# 004 — Sweep the activity ring when arriving from a completed workout

- **Severity:** Missed opportunity (additive, not corrective)
- **Category:** Purpose & frequency — delight budget
- **Base commit:** `0f05706`
- **Files touched:** `js/screens/workout.js`, `js/screens/home.js`, `styles.css`
- **Status:** TODO

## Problem

Finishing a workout is the only rare, high-emotion moment in this app. Today it resolves into
nothing: `finishWorkout` saves the session, waits 600ms, and navigates Home, where the ring renders
already at its new value. The user never sees their progress *increase* — they just arrive and it
has silently changed.

## The one rule that must not be broken

**The sweep fires only on arrival from a just-completed workout. Never on an ordinary Home mount.**

Home is opened many times a day. An animated ring on every mount stops being a reward and becomes
latency the user waits through. If you cannot make the one-shot flag work, ship nothing rather than
animating unconditionally.

## Why a `sessionStorage` flag

`js/app.js:14` declares `navigateTo(name, data)`, but both call sites render Home without
forwarding `data`:

```js
    if (name === 'home') renderHome(screens.home, navigateTo);
```

(`js/app.js:16` and again at `js/app.js:39`.)

Passing the flag as an argument would mean changing `navigateTo`'s contract and both call sites.
A one-shot `sessionStorage` key is smaller, survives the existing 600ms `setTimeout`, and touches
neither. Use it.

## Current code

**`js/screens/workout.js:652-663`** — the finish handler:

```js
function finishWorkout(container, session, navigate) {
  clearInterval(timerInterval); timerInterval = null;
  clearInterval(restInterval);  restInterval  = null;
  document.querySelector('.rest-overlay')?.remove();
  container.classList.remove('rest-blocking');
  session.durationMin = Math.max(1, Math.round((Date.now() - startTime) / 60000));
  saveSession(session);
  const btn = container.querySelector('#finish-btn');
  if (btn) { btn.classList.add('finishing'); btn.innerHTML = `${ICO_CHECK} Saved`; }
  setTimeout(() => { activeSession = null; navigate('home'); }, 600);
}
```

**`js/screens/home.js:36-38`** — the ring maths:

```js
  const weekGoal = 3;
  const ringC = 2 * Math.PI * 44;
  const ringFill = Math.min(weekDone / weekGoal, 1) * ringC;
```

**`js/screens/home.js:166-174`** — the ring markup:

```js
          <div class="ring-wrap">
            <svg width="84" height="84" viewBox="0 0 104 104">
              <circle cx="52" cy="52" r="44" fill="none" stroke="var(--accentSoft)" stroke-width="13"/>
              <circle cx="52" cy="52" r="44" fill="none" stroke="var(--accent)" stroke-width="13"
                stroke-linecap="round"
                stroke-dasharray="${ringFill.toFixed(1)} ${ringC.toFixed(1)}"
                transform="rotate(-90 52 52)"/>
            </svg>
```

Note the SVG is drawn in a `104×104` viewBox and displayed at `84px`. All dash maths is in viewBox
units, so `ringC = 2π×44 ≈ 276.5` is correct as written. **Do not rescale it to 84.**

## Technique: animate `stroke-dashoffset`, not `stroke-dasharray`

The target is iOS Safari. `stroke-dashoffset` is reliably transitionable there; transitioning the
two-value `stroke-dasharray` list is not dependable. Switch the progress circle to a fixed
`stroke-dasharray` of `ringC ringC` and drive `stroke-dashoffset`:

- offset `ringC` → nothing drawn
- offset `ringC − fill` → `fill` length drawn

## Steps

### Step 1 — set the flag on finish (`js/screens/workout.js`)

In `finishWorkout`, immediately after the existing `saveSession(session);` line, add:

```js
  // One-shot flag consumed by renderHome to play the ring sweep. sessionStorage
  // rather than a navigate() argument because navigateTo does not forward data
  // to renderHome (js/app.js:16).
  try { sessionStorage.setItem('fit_celebrate_ring', '1'); } catch (_) { /* private mode */ }
```

Change nothing else in this function.

### Step 2 — consume the flag and compute the start value (`js/screens/home.js`)

Directly after the `ringFill` line at `js/screens/home.js:38`, add:

```js
  // Read-and-clear: the sweep must never repeat on a subsequent Home render.
  let celebrate = false;
  try {
    celebrate = sessionStorage.getItem('fit_celebrate_ring') === '1';
    if (celebrate) sessionStorage.removeItem('fit_celebrate_ring');
  } catch (_) { celebrate = false; }
  const prevDone = Math.max(0, weekDone - 1);
  const ringStart = celebrate
    ? Math.min(prevDone / weekGoal, 1) * ringC
    : ringFill;
```

`prevDone` is `weekDone - 1` because the session that triggered the flag has already been saved and
is therefore already counted in `weekDone`.

### Step 3 — rewrite the ring markup (`js/screens/home.js:166-174`)

Replace the `ring-wrap` opening and its `<svg>` with:

```js
          <div class="ring-wrap${celebrate ? ' is-celebrating' : ''}">
            <svg width="84" height="84" viewBox="0 0 104 104">
              <circle cx="52" cy="52" r="44" fill="none" stroke="var(--accentSoft)" stroke-width="13"/>
              <circle class="ring-progress" cx="52" cy="52" r="44" fill="none" stroke="var(--accent)" stroke-width="13"
                stroke-linecap="round"
                stroke-dasharray="${ringC.toFixed(1)} ${ringC.toFixed(1)}"
                stroke-dashoffset="${(ringC - ringStart).toFixed(1)}"
                transform="rotate(-90 52 52)"/>
            </svg>
```

When `celebrate` is false, `ringStart === ringFill`, so the circle renders at its final value with
no class and no transition — byte-for-byte the same visual result as today.

### Step 4 — drive the sweep after paint (`js/screens/home.js`)

Find the existing listener wiring near the end of `renderHome`:

```js
  container.querySelector('#start-workout-btn')?.addEventListener('click', () => navigate('workout'));
```

Immediately **above** that line, add:

```js
  if (celebrate) {
    const ring = container.querySelector('.ring-progress');
    if (ring) {
      // Two frames: one for the browser to commit the start offset, one to
      // change it. A single rAF can coalesce both and skip the transition.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ring.style.strokeDashoffset = (ringC - ringFill).toFixed(1);
      }));
    }
    container.querySelector('.ring-wrap')?.classList.add('celebrate-dot');
  }
```

### Step 5 — the CSS (`styles.css`)

Append at the end of the file:

```css
/* ── Post-workout ring sweep (plan 004) ─────────────────── */
/* Only present when Home was reached from a completed workout — the
   .is-celebrating class is not emitted on ordinary mounts, so an everyday
   Home open has no transition attached at all. */
.ring-wrap.is-celebrating .ring-progress {
  transition: stroke-dashoffset 600ms var(--e);
}

/* Today's day-strip circle pops once, 150ms behind the sweep. */
@keyframes ring-day-pop {
  0%   { transform: scale(0.8); }
  100% { transform: scale(1); }
}
.ring-wrap.celebrate-dot ~ .ring-info { /* no-op anchor, see note below */ }

@media (prefers-reduced-motion: reduce) {
  .ring-wrap.is-celebrating .ring-progress { transition: none; }
}
```

**Note on the day-strip pop:** the day strip lives in `.week-dots-row`, a sibling of `.ring-card`,
not a descendant of `.ring-wrap`, so it cannot be reached by a CSS sibling selector from the ring.
Implement the pop by having step 4 also add a class to today's dot element directly, or **omit the
pop entirely**. The ring sweep is the substance of this plan; the pop is garnish. If wiring it
cleanly takes more than a few lines, drop it and delete the unused `@keyframes ring-day-pop` and
the no-op anchor rule rather than leaving dead CSS behind.

## Budget justification

600ms exceeds the 300ms budget for everyday UI. That is deliberate and permitted here: this is the
rare/celebration tier, fires roughly three times a week, and is consistent with the app's existing
celebration vocabulary (`rest-done` is `1s`, `finish-flash` is `0.65s`, both at `styles.css:186`
and `:782`).

## Scope boundaries

- Touch **only** the three files named. Do not modify `js/app.js` or `navigateTo`'s signature.
- Do **not** animate the ring on any other code path — no Home mount, no navigation from History,
  no Test Mode day switch.
- Do **not** change `weekGoal`, `ringC`, the `104` viewBox, the `84px` display size, or the
  `rotate(-90 52 52)` start angle.
- Do **not** animate `.ring-count` (the "2 of 3" numeral). Counting numerals up is a separate idea
  and is not in this plan.
- Every `sessionStorage` access must stay inside `try/catch` — iOS private browsing throws.

## Verification

1. **The negative case first — this is the one that matters.** Serve the app, open Home, and reload
   it five times. The ring must appear instantly at its final value every time, with no sweep. Then
   navigate Home → History → Home. Still no sweep. If the ring animates on any of these, the flag
   is not being cleared and the change must not ship.

2. **The positive case.** Enable Test Mode (cogwheel → Test Mode on → pick a workout day), start a
   workout, complete or skip every set, and press Finish. On arrival at Home the ring should sweep
   from the previous count to the new one. Then reload Home — it must **not** sweep again.

3. **Zero-to-one edge.** Clear history (Settings → Test Mode → Reset All Data), then complete one
   workout. The sweep should run from empty to one-third. Confirm `prevDone` clamping at zero did
   not produce a negative offset or a full-circle flash.

4. **Reduced motion.** Emulate `prefers-reduced-motion: reduce` and finish a workout. The ring must
   land on its final value with no sweep, and the number must still read correctly.

5. **Feel-check — required, cannot be judged from code.** Whether 600ms reads as celebratory or as
   waiting is a device judgment. Run it on a real phone. If it drags, try 450ms before trying
   anything else; if it feels insubstantial, 750ms. Change only the single duration in
   `.ring-wrap.is-celebrating .ring-progress` — do not compensate by adding bounce or a second
   animation.
