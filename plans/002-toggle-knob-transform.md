# 002 — Move the iOS toggle knob with `transform`, not `left`

- **Severity:** MEDIUM
- **Category:** Performance / Physicality
- **Base commit:** `0f05706`
- **Files touched:** `styles.css` only
- **Status:** TODO

## Problem

The Settings toggle knob animates the `left` property. `left` is a layout property: every frame of
the 200ms slide forces the browser to recalculate layout and repaint, rather than handing a
composited transform to the GPU. The correct property for moving an element is `transform`.

## Current code (verbatim, `styles.css:1040-1052`)

```css
.ios-track {
  position: absolute; inset: 0;
  background: var(--border); border-radius: 15.5px;
  cursor: pointer; transition: background 0.2s;
}
.ios-track::after {
  content: ''; position: absolute; top: 2px; left: 2px;
  width: 27px; height: 27px; border-radius: 50%;
  background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.35);
  transition: left 0.2s;
}
.ios-toggle input:checked + .ios-track { background: var(--green); }
.ios-toggle input:checked + .ios-track::after { left: 22px; }
```

## Geometry (already verified — do not recompute)

- `.ios-toggle` is `51px` wide (`styles.css:1037`).
- The knob is `27px` wide, inset `2px` from the left when off.
- Checked position is `left: 22px`, i.e. `51 − 27 − 2 = 22`, flush against the right inset.
- **Travel distance is therefore exactly `20px`** (`22 − 2`).

## Steps

1. In `styles.css`, in the `.ios-track::after` rule at line 1045, change the transition property
   from `left` to `transform`, and adopt the file's easing token. Replace:

```css
  transition: left 0.2s;
```

   with:

```css
  transition: transform 0.2s var(--e);
```

   Leave `top: 2px; left: 2px;` exactly as they are — the knob's *resting* position stays defined
   by `left`. Only the movement changes.

2. Replace the checked rule at line 1052:

```css
.ios-toggle input:checked + .ios-track::after { left: 22px; }
```

   with:

```css
.ios-toggle input:checked + .ios-track::after { transform: translateX(20px); }
```

3. Do not change `.ios-toggle input:checked + .ios-track { background: var(--green); }` at line
   1051. The track's colour transition is already correct.

## Convention exemplar

`var(--e)` is `cubic-bezier(0.32,0.72,0,1)`, defined at `styles.css:36`. The file's newer rules use
it directly — for example `styles.css:1353`:

```css
  transition: transform 260ms var(--e), background 200ms var(--e), opacity 200ms var(--e);
```

Follow that form: name the property explicitly, then duration, then `var(--e)`.

## Scope boundaries

- **Only** the two rules named in steps 1 and 2. Do not touch any other `.ios-*` rule.
- Do **not** change the `0.2s` duration. It is inside the 100–250ms budget for a control of this
  kind and is not what this plan is fixing.
- Do **not** convert `top: 2px; left: 2px;` to a transform. The resting offset is layout, set once,
  and costs nothing.
- Do **not** touch `styles.css:1053` (`.unit-seg-btn`) — that is plan 003's job. If you are doing
  both plans, do them as separate commits.

## Verification

1. **Visual parity.** Serve the app
   (`node /opt/node22/lib/node_modules/http-server/bin/http-server -p 8099 -s .`), open Settings via
   the cogwheel, and toggle **Test Mode** on and off. In both end states the knob must sit in
   *exactly* the same pixel position as before the change. Take a screenshot before and after the
   edit and compare — a 2px drift means the travel distance was miscalculated.

2. **Performance.** DevTools → Performance → record while toggling several times. Before the change
   the frames show "Layout" work; after, the knob movement should appear under compositing with no
   layout on the toggle frames.

3. **Feel-check.** Toggle rapidly, five or six times in a row. The knob must track each tap and
   reverse smoothly mid-flight. Because this is a CSS transition (not keyframes) it retargets
   correctly; if it instead snaps or stutters, the `transition` line was applied to the wrong
   selector.

4. **Regression check — reduced motion.** If plan 001 has already landed, re-test with
   `prefers-reduced-motion: reduce` emulated. The knob should still reach both end positions.
