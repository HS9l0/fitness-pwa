# design-sync notes — fitness-pwa

Repo-specific gotchas for future syncs. Read this before running anything.

## Shape and layout

- Shape is **package**, not storybook — there is no `.storybook/` and no `*.stories.*` anywhere in the repo.
- The design system is `component-lib/` (package name `fitness-pwa-ds`), a React mirror of the vanilla-JS PWA at the repo root. The PWA itself is not React and is not synced.
- `component-lib/src/components/*.tsx` are the sources; `component-lib/dist/` is the built entry the converter consumes.
- Run every converter command **from the repo root**. The shell's working directory persists between commands, so a stray `cd component-lib` earlier in a session will make `node .ds-sync/...` fail with `MODULE_NOT_FOUND`.

## Build

- `cd component-lib && npm ci && npm run build` (`cfg.buildCmd`).
- `build.mjs` emits three things the converter needs: `dist/index.es.js` (ESM, **React external**), `dist/types/**` (via `tsc --emitDeclarationOnly`), and `dist/styles.css` (copied from the repo-root `styles.css`).
- **Do not re-bundle React into the entry.** An earlier version of `build.mjs` produced a self-contained IIFE with React inlined and no `.d.ts` tree at all — the converter then had nothing to extract props from, and a second React copy breaks hooks at render time. The converter supplies React via `_vendor/`.
- Converter invocation:
  ```sh
  node .ds-sync/package-build.mjs --config .design-sync/config.json \
    --node-modules ./component-lib/node_modules \
    --entry ./component-lib/dist/index.es.js --out ./ds-bundle
  ```

## Playwright

Playwright is **already installed globally** at `/opt/node22/lib/node_modules/playwright` (v1.56.1) and the chromium build it pins (1194) is already cached at `/opt/pw-browsers`. Do not `npm i playwright` and do not run `playwright install`. Just make it resolvable from the staged scripts:

```sh
cd .ds-sync/node_modules
ln -sfn /opt/node22/lib/node_modules/playwright playwright
ln -sfn /opt/node22/lib/node_modules/playwright/node_modules/playwright-core playwright-core
```

## Fonts

`styles.css` uses `-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif`. SF Pro is Apple-proprietary and licensed only for Apple platforms — it cannot ship as woff2, and the stack already degrades to `system-ui`. Handled with `cfg.runtimeFontPrefixes: ["SF Pro"]`, which suppresses `[FONT_MISSING]`. This is not a substitution the user needs to approve; the host OS supplies the family.

## Previews: the dark-surface wrapper

The preview card harness hard-sets `body { background: #fff }` *after* the stylesheets. This DS is dark-only, and `FitTheme` is `minHeight: 100%` — inside the harness's auto-height `#root` that resolves to `auto`, so the dark canvas collapses to content height and cards render on white.

Every authored preview therefore wraps its story in its own surface:

```tsx
const surface: React.CSSProperties = {
  background: 'var(--bg, #000000)', padding: 16, borderRadius: 14,
};
```

Keep this when adding previews. It is composition, not a workaround — a real design sets its own page background from `styles.css`.

## Known render warns

These are triaged and benign. A warn **not** in this list is new — look at it.

- `[RENDER_THIN] SettingsSheet` — "rendered height is 0px". `.settings-sheet` is `position: fixed`, so the preview root measures zero. The screenshot is correct and complete.
- `[RENDER_THIN] DrumPicker` — same cause (`.drum-sheet` is `position: fixed`).

`RestTimer` used to trip `[RENDER_BLANK]` for a related but *different* reason and is now fixed: unlike the other two overlays, `.rest-overlay` is `bottom`-anchored with no height of its own, so the capture cropped to nothing. Its preview supplies a `height: 100dvh` stage. Do not "simplify" that away.

## Deliberate story omissions

- **Button** has no `disabled` story: `.btn-primary` has no `:disabled` rule, so it is pixel-identical to the default. Nor a `pulsing` one — that variant is animation-only and static capture shows no difference.
- **SetRow** has no `skipped` story: since v68 a skipped row stays visually neutral (only the check button tints), so it is identical to `Pending`.

If those states ever get real styling, add the stories back.

## Grouping

The components carry no real docs, so `component-lib/docs/<Name>.md` holds a frontmatter-only stub per component whose sole job is `category:` — that is what produces the foundation / workout / controls / navigation / home groups instead of dumping all 18 into `general`. `.prompt.md` content is still synthesized from the `.d.ts` and previews; the stubs do not blank it.

`cfg.guidelinesGlob` is `[]` on purpose. The default globs match `docs/*.md`, which would ship those 18 frontmatter-only stubs as "design guidelines" — pure noise.

## Source-of-truth drift found on the first sync (2026-08)

The prior aborted run authored `conventions.md` and the component JSDoc against the **pre-redesign palette**. The PWA has since moved to a lime-on-black identity, and every colour claim was stale and inverted. Corrected in this sync:

- `conventions.md`: the entire token table. `--accent` is `#a8e635` (lime), not `#3b82f6` (blue); `--accent2` is `#72b4ea` (blue), not `#22c55e` (green); `--bg` is `#000000`, not `#080d14`; `--radius` is `20px`, not `14px`. All 29 tokens now match `:root`.
- JSDoc in `Button` ("filled blue" → lime), `Badge` ("accent-blue tinted" → lime), `ExerciseCard` ("blue circle" → lime), `ProgressBar` ("green fill" → blue), `IosToggle` ("green when on" → blue).
- `FitTheme`: claimed to inject the `:root` variables. It does not — `styles.css` does. Its hardcoded fallbacks were stale too.

This matters more than it looks: `conventions.md` is inlined into the design agent's system prompt and the JSDoc rides in every `.prompt.md`, so a wrong colour claim biases *every* design built from this system.

## Re-sync risks — what can silently go stale

- **The token table in `conventions.md` is a hand-maintained copy of `:root` in the repo-root `styles.css`.** That file is edited by ordinary PWA work with no connection to this sync, so it drifts silently. Re-verify it every sync — `grep -o 'var(--[a-z0-9-]*)' .design-sync/conventions.md` against `ds-bundle/_ds_bundle.css` catches missing names, but **not** a value that changed. Spot-check `--accent`, `--bg` and `--radius` by eye.
- **Component JSDoc describes colours in prose.** Same drift risk, same blast radius. `grep -n "blue\|green\|lime\|violet" component-lib/src/components/*.tsx` before shipping.
- **`component-lib` can fall behind the PWA.** It mirrors the app's markup and class names by hand; if the PWA's `styles.css` renames a class, the React component still emits the old one and renders unstyled with no error. Worth a visual pass over `.review.html` on any sync that follows PWA redesign work.
- **`dist/` is committed.** If someone edits `src/` without rebuilding, the converter consumes a stale entry. Always run `cfg.buildCmd` first.
- **The category stubs are an enumeration.** A new component added to `src/index.ts` without a matching `component-lib/docs/<Name>.md` silently lands in `general`.
- Only verified against Node 22 / esbuild 0.24 / TypeScript 5.
