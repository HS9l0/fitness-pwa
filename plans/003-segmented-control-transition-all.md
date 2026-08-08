# 003 — Replace `transition: all` on the segmented control with named properties

- **Severity:** MEDIUM
- **Category:** Performance / Easing
- **Base commit:** `0f05706`
- **Files touched:** `styles.css` only
- **Status:** TODO

## Problem

`transition: all` transitions every animatable property, including layout ones the author never
intended to animate. Here it also silently contradicts the file's easing convention: `all 0.15s`
uses the CSS default `ease`, while the rest of the app moves on `var(--e)`.

The segmented control is used for the kg/lbs unit switch and the four-way Test Day picker, so it is
tapped occasionally rather than constantly — this is a correctness cleanup, not a hot-path fix.

## Current code (verbatim, `styles.css:1053-1054`)

```css
.unit-seg-btn { padding: 5px 14px; border-radius: 6px; font-size: 0.82rem; font-weight: 600; color: var(--text-muted); transition: all 0.15s; }
.unit-seg-btn.active { background: var(--border); color: var(--text); }
```

The only properties that actually change between the default and `.active` states are
**`background`** and **`color`**. Everything else `all` is watching is dead weight.

## Interaction with the existing motion layer

`.unit-seg-btn` is **already listed** in the v3 press-feedback block at `styles.css:1345-1355`:

```css
.hig-btn-primary,
.btn-primary,
#cogwheel-btn,
.settings-row,
.week-dots-row,
.set-check-btn,
.set-skip-btn,
.yt-search-btn,
.unit-seg-btn {
  transition: transform 260ms var(--e), background 200ms var(--e), opacity 200ms var(--e);
}
```

and gets a press scale at `styles.css:1363`:

```css
.set-check-btn:active,
.set-skip-btn:active,
.unit-seg-btn:active { transform: scale(0.96); transition: transform 90ms var(--e); }
```

**This is the actual bug.** Both blocks set `transition` on the same element. `styles.css:1053`
(`transition: all 0.15s`) and `styles.css:1345` (the transform/background/opacity list) are
competing declarations — the later one in source order wins, so the press-feedback block currently
overrides the `0.15s` transition entirely. The `all` declaration is not just wasteful, it is
misleading: it looks like it governs the active-state colour change, and it does not.

## Steps

1. In `styles.css:1053`, replace `transition: all 0.15s;` with an explicit list that names only what
   changes, on the file's token:

```css
.unit-seg-btn { padding: 5px 14px; border-radius: 6px; font-size: 0.82rem; font-weight: 600; color: var(--text-muted); transition: background 150ms var(--e), color 150ms var(--e); }
```

2. Now resolve the duplicate-declaration problem. The block at `styles.css:1345` re-declares
   `transition` for `.unit-seg-btn` and will still win. Add `color` to that shared list so the
   colour change is not dropped:

```css
  transition: transform 260ms var(--e), background 200ms var(--e), opacity 200ms var(--e), color 200ms var(--e);
```

   Adding `color` to the shared list is safe for the other eight selectors in it — none of them
   change `color` between states, so the extra entry is inert for them.

3. Leave `styles.css:1054` (`.unit-seg-btn.active`) unchanged.

## Convention exemplar

`var(--e)` is `cubic-bezier(0.32,0.72,0,1)`, defined at `styles.css:36`. Name properties explicitly
and put duration before easing, as at `styles.css:1353`.

## Scope boundaries

- **Only** `styles.css` lines 1053 and 1345. Do not touch `.unit-seg`, `.unit-seg-wide`, or
  `.unit-seg-btn.active`.
- Do **not** remove `.unit-seg-btn` from the press-feedback block — the `scale(0.96)` press is
  intentional and matches the design handoff's per-element scale for set-action-sized controls.
- Do **not** search-and-replace other `transition: all` occurrences. There is exactly one in this
  file and this plan covers it.
- Do **not** change the `0.96` press scale or the `90ms` press duration.

## Verification

1. **Confirm the duplicate is gone.** After editing, run:
   `grep -n "transition" styles.css | grep "unit-seg-btn"` — you should see the rule from step 1,
   and `.unit-seg-btn` should still appear in the shared selector list at ~line 1345. There must be
   no remaining `transition: all` anywhere: `grep -c "transition: *all" styles.css` must return `0`.

2. **Functional.** Serve the app, open Settings, and tap between **kg** and **lbs**. The active
   segment's background and text colour must both animate rather than snap. Then enable Test Mode
   and tap through Day 1 / Day 2 / Day 3 / Rest — same behaviour across four segments.

3. **Feel-check.** The colour crossfade at 150–200ms is short enough that it is genuinely hard to
   judge from a single tap. Record a screen capture and step through it frame by frame, or
   temporarily raise both durations to `1000ms`, confirm background and colour move together with
   no stagger between them, then put the real values back. **Do not ship the 1000ms values.**

4. **Regression.** Press and hold a segment: it must still scale to `0.96` and spring back. If the
   press feedback disappeared, step 2 damaged the shared transition list.
