# FitPlan — iOS HIG Redesign · Handoff for Claude

## What this is
A complete visual + interaction redesign of the `HS9l0/fitness-pwa` GUI, rebuilt to follow Apple's Human Interface Guidelines (SF system type, grouped inset cards, large titles, segmented controls, an iOS wheel/drum picker, a circular rest timer, sheet modals, and scroll-edge fade masks).

It is delivered as ONE file: `FitPlan.dc.html`. It is fully interactive and self-contained except for a small runtime (`support.js`) that renders the template + logic. The file uses a lightweight template format:
- Markup lives between `<x-dc>`…`</x-dc>`.
- `{{ path }}` holes are filled by the `renderVals()` method of the `class Component` script at the bottom.
- `<sc-if>` / `<sc-for>` are conditional / loop blocks.
- Styling is inline; theme colors come from CSS vars (`--accent`, `--label`, `--card`, etc).

## Screens & features
1. **Summary (home)** — large title, weekly activity ring, 7-day strip, "Next Up" gradient workout card, "Last Workout" chips, settings gear.
2. **Workout overview** — translucent nav bar, duration/exercise stat cards, amber warm-up callout, grouped exercise list, sticky "Begin Workout" CTA.
3. **Active workout** — collapsible exercise cards, per-set weight×reps fields, check/skip, live progress bar + elapsed timer; separate strength vs cardio layouts; "Finish Workout" when all done.
4. **Drum picker** — iOS wheel for weight & reps (snap scrolling).
5. **Rest timer** — circular countdown modal; +30s; "Skip/Done" rapidly winds the ring to 0, flashes a check, then dismisses.
6. **Settings sheet** — kg/lbs segmented control + Admin Dashboard row.

Tweakable props (declared in the `data-props` JSON on the script tag): `accent` (Energy Orange / System Blue / Move Pink / Activity Green), `defaultUnit` (kg/lbs), `restSeconds` (30–180).

## How to integrate into the real repo
The original repo is a vanilla-JS PWA:
- `index.html`, `styles.css`, `manifest.json`, `sw.js`
- `js/app.js` (router), `js/store.js` (localStorage), `js/data.js` (WORKOUTS), `js/drum-picker.js`, `js/screens/home.js`, `js/screens/workout.js`

This redesign is a standalone reference — it is NOT yet wired to `js/store.js` (localStorage) or `js/data.js`. To ship it for real, port the markup + styles below into the existing screen renderers and replace the seeded demo data (`WORKOUTS`, `LAST`, `WEEKDONE`) with the live store. Match the HIG visual language captured here: SF font stack, the color vars, 18–22px card radii, 1px hairline separators, segmented controls, and the circular SVG timers/rings.

## Full source — FitPlan.dc.html

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <style>
    * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
    body { margin: 0; }
    @keyframes fp-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    @keyframes fp-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes fp-pop { 0% { transform: scale(1); } 45% { transform: scale(0.86); } 100% { transform: scale(1); } }
    @keyframes fp-ring-done { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
    .fp-scroll::-webkit-scrollbar { display: none; }
    .fp-wheel::-webkit-scrollbar { display: none; }
  </style>
</helmet>
<div style="{{ rootStyle }}min-height:100vh;width:100%;display:flex;align-items:center;justify-content:center;padding:40px 20px;font-family:-apple-system,'SF Pro Text','SF Pro Display',system-ui,'Segoe UI',sans-serif;background:radial-gradient(120% 120% at 50% 0%,#e9e9ef 0%,#d7d7df 100%);">

  <!-- iPhone -->
  <div style="position:relative;width:390px;height:844px;border-radius:55px;background:#0b0b0d;padding:11px;box-shadow:0 2px 6px rgba(0,0,0,.18),0 30px 70px rgba(0,0,0,.34);flex-shrink:0;">
    <div style="position:absolute;inset:11px;border-radius:46px;overflow:hidden;background:var(--bg,#f2f2f7);display:flex;flex-direction:column;">

      <!-- Status bar -->
      <div style="position:absolute;top:0;left:0;right:0;height:54px;z-index:30;display:flex;align-items:flex-end;justify-content:space-between;padding:0 30px 8px;pointer-events:none;">
        <span style="font-size:15px;font-weight:600;letter-spacing:.2px;color:var(--label,#000);font-variant-numeric:tabular-nums;">9:41</span>
        <span style="display:flex;align-items:center;gap:7px;color:var(--label,#000);">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4.5" width="3" height="7.5" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><path d="M8.5 2.3c2.3 0 4.4.9 6 2.4l1.2-1.3C13.8 1.5 11.3.5 8.5.5S3.2 1.5 1.3 3.4L2.5 4.7c1.6-1.5 3.7-2.4 6-2.4Zm0 3.4c1.3 0 2.6.5 3.5 1.5l1.2-1.3C12 7.6 10.3 6.9 8.5 6.9S5 7.6 3.8 5.9L5 7.2C5.9 6.2 7.2 5.7 8.5 5.7Zm0 3.3c.6 0 1.2.3 1.6.7l-1.6 1.7-1.6-1.7c.4-.4 1-.7 1.6-.7Z"/></svg>
          <span style="display:inline-flex;align-items:center;gap:2px;"><span style="position:relative;display:inline-block;width:24px;height:12px;border:1px solid color-mix(in srgb,var(--label,#000) 38%,transparent);border-radius:3.5px;"><span style="position:absolute;inset:1.5px;width:16px;background:var(--label,#000);border-radius:1.5px;"></span></span><span style="display:inline-block;width:1.5px;height:4px;background:color-mix(in srgb,var(--label,#000) 38%,transparent);border-radius:0 1px 1px 0;"></span></span>
        </span>
      </div>

      <!-- ===================== HOME ===================== -->
      <sc-if value="{{ isHome }}" hint-placeholder-val="{{ true }}">
        <div class="fp-scroll" style="flex:1;overflow-y:auto;animation:fp-fade .35s ease;-webkit-mask-image:linear-gradient(180deg,transparent 12px,#000 76px);mask-image:linear-gradient(180deg,transparent 12px,#000 76px);">
          <div style="padding:62px 20px 40px;">
            <div style="font-size:15px;font-weight:600;color:var(--label2,rgba(60,60,67,.6));margin-bottom:2px;">{{ todayLabel }}</div>
            <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:22px;">
              <h1 style="font-size:34px;font-weight:700;letter-spacing:-.5px;margin:0;color:var(--label,#000);">Summary</h1>
              <button onClick="{{ openSettings }}" style="border:none;background:none;padding:0;cursor:pointer;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--accent,#ff5a3c);">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9.4 4 .9-2.6-2.1-1.7.3-2.7-2.7-.4-1.3-2.4L14 3.3 12 2 10 3.3 7.4 2.2 6.1 4.6l-2.7.4.3 2.7-2.1 1.7L2.5 12l-.9 2.6 2.1 1.7-.3 2.7 2.7.4 1.3 2.4L10 20.7 12 22l2-1.3 2.6 1.1 1.3-2.4 2.7-.4-.3-2.7 2.1-1.7L21.4 12Zm-9.4 3.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z" opacity="0"/><path d="M19.4 13a7.5 7.5 0 0 0 .1-1 7.5 7.5 0 0 0-.1-1l2-1.6a.5.5 0 0 0 .1-.6l-1.9-3.3a.5.5 0 0 0-.6-.2l-2.4 1a7 7 0 0 0-1.6-1l-.4-2.5a.5.5 0 0 0-.5-.4h-3.8a.5.5 0 0 0-.5.4l-.4 2.5a7 7 0 0 0-1.6 1l-2.4-1a.5.5 0 0 0-.6.2L2.4 8.8a.5.5 0 0 0 .1.6L4.6 11a7.5 7.5 0 0 0 0 2l-2 1.6a.5.5 0 0 0-.1.6l1.9 3.3a.5.5 0 0 0 .6.2l2.4-1a7 7 0 0 0 1.6 1l.4 2.5a.5.5 0 0 0 .5.4h3.8a.5.5 0 0 0 .5-.4l.4-2.5a7 7 0 0 0 1.6-1l2.4 1a.5.5 0 0 0 .6-.2l1.9-3.3a.5.5 0 0 0-.1-.6L19.4 13ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/></svg>
              </button>
            </div>

            <!-- Activity hero -->
            <div style="background:var(--card,#fff);border-radius:22px;padding:22px;margin-bottom:18px;box-shadow:0 1px 2px rgba(0,0,0,.04);display:flex;align-items:center;gap:22px;">
              <div style="position:relative;width:104px;height:104px;flex-shrink:0;">
                <svg width="104" height="104" viewBox="0 0 104 104">
                  <circle cx="52" cy="52" r="44" fill="none" stroke="color-mix(in srgb,var(--accent,#ff5a3c) 16%,transparent)" stroke-width="13"/>
                  <circle cx="52" cy="52" r="44" fill="none" stroke="var(--accent,#ff5a3c)" stroke-width="13" stroke-linecap="round" stroke-dasharray="{{ ringDash }}" transform="rotate(-90 52 52)"/>
                </svg>
                <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                  <span style="font-size:26px;font-weight:700;color:var(--label,#000);line-height:1;">{{ weekDone }}</span>
                  <span style="font-size:11px;font-weight:600;color:var(--label2,rgba(60,60,67,.6));">of {{ weekGoal }}</span>
                </div>
              </div>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:600;color:var(--label2,rgba(60,60,67,.6));text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px;">This Week</div>
                <div style="font-size:20px;font-weight:700;color:var(--label,#000);letter-spacing:-.3px;line-height:1.2;margin-bottom:10px;">{{ weekMsg }}</div>
                <div style="display:flex;gap:7px;">
                  <sc-for list="{{ week }}" as="d" hint-placeholder-count="7">
                    <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
                      <div style="width:21px;height:21px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:1.5px solid {{ d.ringColor }};background:{{ d.fill }};color:{{ d.txtColor }};">{{ d.mark }}</div>
                      <span style="font-size:9px;font-weight:600;color:var(--label3,rgba(60,60,67,.3));">{{ d.lbl }}</span>
                    </div>
                  </sc-for>
                </div>
              </div>
            </div>

            <!-- Next Up -->
            <div style="font-size:21px;font-weight:700;letter-spacing:-.3px;color:var(--label,#000);margin:0 4px 10px;">Next Up</div>
            <div style="background:var(--card,#fff);border-radius:22px;overflow:hidden;margin-bottom:18px;box-shadow:0 1px 2px rgba(0,0,0,.04);">
              <div style="height:120px;background:linear-gradient(135deg,var(--accent,#ff5a3c),var(--accent2,#ff2d55));position:relative;display:flex;flex-direction:column;justify-content:flex-end;padding:18px 20px;">
                <svg viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="position:absolute;top:16px;right:18px;"><path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4"/><line x1="6" y1="12" x2="18" y2="12"/></svg>
                <div style="font-size:13px;font-weight:600;color:rgba(255,255,255,.85);letter-spacing:.3px;">{{ nextWhen }}</div>
                <div style="font-size:25px;font-weight:700;color:#fff;letter-spacing:-.4px;line-height:1.1;">{{ nextTitle }}</div>
              </div>
              <div style="padding:16px 20px 20px;">
                <div style="font-size:14px;color:var(--label2,rgba(60,60,67,.6));line-height:1.4;margin-bottom:14px;">{{ nextFocus }}</div>
                <div style="display:flex;gap:18px;margin-bottom:18px;">
                  <div style="display:flex;align-items:center;gap:6px;font-size:14px;color:var(--label,#000);font-weight:600;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--label2,rgba(60,60,67,.6))" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 14.5 14.5"/></svg>~{{ nextDuration }} min</div>
                  <div style="display:flex;align-items:center;gap:6px;font-size:14px;color:var(--label,#000);font-weight:600;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--label2,rgba(60,60,67,.6))" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7v10M7 5v14M17 5v14M20 7v10"/><line x1="7" y1="12" x2="17" y2="12"/></svg>{{ nextCount }} exercises</div>
                </div>
                <button onClick="{{ goOverview }}" style="width:100%;height:50px;border:none;border-radius:14px;background:linear-gradient(135deg,var(--accent,#ff5a3c),var(--accent2,#ff2d55));color:#fff;font-size:17px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 14px color-mix(in srgb,var(--accent,#ff5a3c) 38%,transparent);">Start Workout<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            </div>

            <!-- Last Workout -->
            <sc-if value="{{ hasLast }}" hint-placeholder-val="{{ true }}">
              <div style="font-size:21px;font-weight:700;letter-spacing:-.3px;color:var(--label,#000);margin:0 4px 10px;">Last Workout</div>
              <div style="background:var(--card,#fff);border-radius:22px;padding:18px 20px;box-shadow:0 1px 2px rgba(0,0,0,.04);">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                  <div>
                    <div style="font-size:17px;font-weight:700;color:var(--label,#000);letter-spacing:-.2px;">{{ lastTitle }}</div>
                    <div style="font-size:13px;color:var(--label2,rgba(60,60,67,.6));margin-top:2px;">{{ lastMeta }}</div>
                  </div>
                  <span style="color:#34c759;display:flex;"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg></span>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:7px;">
                  <sc-for list="{{ lastChips }}" as="c" hint-placeholder-count="4">
                    <span style="display:inline-flex;align-items:center;gap:6px;background:var(--field,#f2f2f7);border-radius:9px;padding:6px 10px;font-size:12px;font-weight:600;color:var(--label,#000);">{{ c.name }}<span style="color:var(--label2,rgba(60,60,67,.6));font-weight:500;">{{ c.val }}</span></span>
                  </sc-for>
                </div>
              </div>
            </sc-if>
          </div>
        </div>
      </sc-if>

      <!-- ===================== OVERVIEW ===================== -->
      <sc-if value="{{ isOverview }}" hint-placeholder-val="{{ true }}">
        <div style="flex:1;display:flex;flex-direction:column;animation:fp-fade .35s ease;overflow:hidden;">
          <!-- Nav bar -->
          <div style="position:relative;z-index:20;padding:62px 12px 8px;background:color-mix(in srgb,var(--bg,#f2f2f7) 80%,transparent);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);">
            <button onClick="{{ goHome }}" style="display:flex;align-items:center;gap:1px;border:none;background:none;color:var(--accent,#ff5a3c);font-size:17px;cursor:pointer;padding:4px 6px;"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>Summary</button>
          </div>
          <div class="fp-scroll" style="flex:1;overflow-y:auto;padding:6px 20px 120px;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 40px);mask-image:linear-gradient(180deg,transparent 0,#000 40px);">
            <h1 style="font-size:32px;font-weight:700;letter-spacing:-.5px;margin:6px 4px 4px;color:var(--label,#000);">{{ nextTitle }}</h1>
            <div style="font-size:15px;color:var(--label2,rgba(60,60,67,.6));margin:0 4px 20px;">{{ nextFocus }}</div>

            <div style="display:flex;gap:12px;margin-bottom:16px;">
              <div style="flex:1;background:var(--card,#fff);border-radius:18px;padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.04);">
                <div style="font-size:26px;font-weight:700;color:var(--label,#000);letter-spacing:-.4px;">~{{ nextDuration }}</div>
                <div style="font-size:12px;font-weight:600;color:var(--label2,rgba(60,60,67,.6));text-transform:uppercase;letter-spacing:.4px;">minutes</div>
              </div>
              <div style="flex:1;background:var(--card,#fff);border-radius:18px;padding:16px;box-shadow:0 1px 2px rgba(0,0,0,.04);">
                <div style="font-size:26px;font-weight:700;color:var(--label,#000);letter-spacing:-.4px;">{{ nextCount }}</div>
                <div style="font-size:12px;font-weight:600;color:var(--label2,rgba(60,60,67,.6));text-transform:uppercase;letter-spacing:.4px;">exercises</div>
              </div>
            </div>

            <!-- Warm up -->
            <div style="background:color-mix(in srgb,#ff9f0a 9%,var(--card,#fff));border:1px solid color-mix(in srgb,#ff9f0a 26%,transparent);border-radius:18px;padding:16px;margin-bottom:24px;display:flex;gap:12px;">
              <span style="flex-shrink:0;"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ff9500" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C10 6 7 9 7 13a5 5 0 0 0 10 0c0-4-2.5-7-5-11Z"/><path d="M12 13c-1.1.8-2 2-2 3a2 2 0 0 0 4 0c0-1-.9-2.2-2-3Z" fill="#ff9500" stroke="none"/></svg></span>
              <div>
                <div style="font-size:14px;font-weight:700;color:#c77800;margin-bottom:4px;">Warm-Up First</div>
                <div style="font-size:13px;color:var(--label2,rgba(60,60,67,.6));line-height:1.5;">{{ warmup }}</div>
              </div>
            </div>

            <div style="font-size:13px;font-weight:600;color:var(--label2,rgba(60,60,67,.6));text-transform:uppercase;letter-spacing:.4px;margin:0 4px 8px;">Exercises Today</div>
            <div style="background:var(--card,#fff);border-radius:18px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.04);">
              <sc-for list="{{ ovExercises }}" as="ex" hint-placeholder-count="5">
                <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:{{ ex.border }};">
                  <div style="width:28px;height:28px;flex-shrink:0;border-radius:8px;background:color-mix(in srgb,var(--accent,#ff5a3c) 12%,transparent);color:var(--accent,#ff5a3c);font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;">{{ ex.num }}</div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:15px;font-weight:600;color:var(--label,#000);">{{ ex.name }}</div>
                    <div style="font-size:12px;color:var(--label2,rgba(60,60,67,.6));margin-top:1px;">{{ ex.muscles }}</div>
                  </div>
                  <div style="font-size:13px;font-weight:600;color:var(--label3,rgba(60,60,67,.3));flex-shrink:0;">{{ ex.setsLabel }}</div>
                </div>
              </sc-for>
            </div>
          </div>
          <!-- Sticky begin -->
          <div style="position:absolute;left:0;right:0;bottom:0;padding:16px 20px 28px;background:linear-gradient(to top,var(--bg,#f2f2f7) 55%,transparent);">
            <button onClick="{{ beginWorkout }}" style="width:100%;height:52px;border:none;border-radius:15px;background:linear-gradient(135deg,var(--accent,#ff5a3c),var(--accent2,#ff2d55));color:#fff;font-size:17px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 6px 18px color-mix(in srgb,var(--accent,#ff5a3c) 40%,transparent);">Begin Workout<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      </sc-if>

      <!-- ===================== ACTIVE ===================== -->
      <sc-if value="{{ isActive }}" hint-placeholder-val="{{ true }}">
        <div style="flex:1;display:flex;flex-direction:column;animation:fp-fade .35s ease;overflow:hidden;">
          <!-- Active header -->
          <div style="position:relative;z-index:20;padding:58px 18px 12px;background:color-mix(in srgb,var(--bg,#f2f2f7) 82%,transparent);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--sep,rgba(60,60,67,.1));">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <button onClick="{{ goHome }}" style="border:none;background:var(--field,#e8e8ed);width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--label2,rgba(60,60,67,.6));"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              <div style="text-align:center;">
                <div style="font-size:15px;font-weight:700;color:var(--label,#000);">{{ nextTitle }}</div>
                <div style="font-size:12px;color:var(--label2,rgba(60,60,67,.6));">{{ activeProgress }}</div>
              </div>
              <div style="min-width:54px;text-align:right;">
                <div style="font-size:17px;font-weight:700;color:var(--accent,#ff5a3c);font-variant-numeric:tabular-nums;letter-spacing:.3px;">{{ elapsedStr }}</div>
              </div>
            </div>
            <div style="height:5px;border-radius:3px;background:var(--field,#e2e2e7);margin-top:12px;overflow:hidden;">
              <div style="height:100%;border-radius:3px;background:linear-gradient(90deg,var(--accent,#ff5a3c),var(--accent2,#ff2d55));width:{{ activePct }};transition:width .4s cubic-bezier(.4,0,.2,1);"></div>
            </div>
          </div>

          <div class="fp-scroll" style="flex:1;overflow-y:auto;padding:14px 16px 40px;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 36px);mask-image:linear-gradient(180deg,transparent 0,#000 36px);">
            <sc-for list="{{ acExercises }}" as="ex" hint-placeholder-count="3">
              <div style="background:var(--card,#fff);border-radius:18px;margin-bottom:12px;box-shadow:0 1px 2px rgba(0,0,0,.04);overflow:hidden;border:{{ ex.cardBorder }};">
                <button onClick="{{ ex.toggle }}" style="width:100%;display:flex;align-items:center;gap:13px;padding:15px 16px;border:none;background:none;cursor:pointer;text-align:left;">
                  <div style="width:30px;height:30px;flex-shrink:0;border-radius:9px;background:{{ ex.numBg }};color:{{ ex.numColor }};font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;">{{ ex.numMark }}</div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:15px;font-weight:700;color:var(--label,#000);">{{ ex.name }}</div>
                    <div style="font-size:12px;color:var(--label2,rgba(60,60,67,.6));margin-top:1px;">{{ ex.muscles }}</div>
                  </div>
                  <div style="font-size:13px;font-weight:600;color:var(--label3,rgba(60,60,67,.3));flex-shrink:0;">{{ ex.setsLabel }}</div>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--label3,rgba(60,60,67,.3))" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;transform:{{ ex.chevron }};transition:transform .3s;"><polyline points="9 18 15 12 9 6"/></svg>
                </button>

                <sc-if value="{{ ex.open }}" hint-placeholder-val="{{ true }}">
                  <div style="padding:0 16px 16px;">
                    <div style="font-size:12px;color:var(--label3,rgba(60,60,67,.3));margin-bottom:12px;font-weight:600;">{{ ex.lastHint }}</div>

                    <!-- strength -->
                    <sc-if value="{{ ex.isStrength }}" hint-placeholder-val="{{ true }}">
                      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                        <div style="flex:1;height:5px;border-radius:3px;background:var(--field,#e8e8ed);overflow:hidden;"><div style="height:100%;background:#34c759;width:{{ ex.progPct }};transition:width .4s;"></div></div>
                        <span style="font-size:12px;font-weight:700;color:var(--label2,rgba(60,60,67,.6));font-variant-numeric:tabular-nums;">{{ ex.progTxt }}</span>
                      </div>
                      <div style="display:flex;flex-direction:column;gap:8px;">
                        <sc-for list="{{ ex.sets }}" as="s" hint-placeholder-count="3">
                          <div style="display:flex;align-items:center;gap:12px;background:{{ s.rowBg }};border-radius:13px;padding:11px 13px;transition:background .2s;">
                            <span style="width:22px;height:22px;flex-shrink:0;border-radius:50%;background:{{ s.numBg }};color:{{ s.numColor }};font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;">{{ s.num }}</span>
                            <div style="flex:1;display:flex;align-items:center;gap:10px;{{ s.fieldOpacity }}">
                              <button onClick="{{ onWeightTap }}" data-ex="{{ s.exIdx }}" data-set="{{ s.setIdx }}" style="flex:1;display:flex;align-items:baseline;justify-content:center;gap:4px;border:none;background:var(--card,#fff);border-radius:9px;padding:8px 6px;cursor:pointer;box-shadow:0 0 0 1px var(--sep,rgba(60,60,67,.1));"><span style="font-size:19px;font-weight:700;color:{{ s.wColor }};font-variant-numeric:tabular-nums;">{{ s.weight }}</span><span style="font-size:11px;font-weight:600;color:var(--label3,rgba(60,60,67,.3));">{{ unitLbl }}</span></button>
                              <span style="font-size:14px;color:var(--label3,rgba(60,60,67,.3));font-weight:600;">×</span>
                              <button onClick="{{ onRepsTap }}" data-ex="{{ s.exIdx }}" data-set="{{ s.setIdx }}" style="flex:1;display:flex;align-items:baseline;justify-content:center;gap:4px;border:none;background:var(--card,#fff);border-radius:9px;padding:8px 6px;cursor:pointer;box-shadow:0 0 0 1px var(--sep,rgba(60,60,67,.1));"><span style="font-size:19px;font-weight:700;color:{{ s.rColor }};font-variant-numeric:tabular-nums;">{{ s.reps }}</span><span style="font-size:11px;font-weight:600;color:var(--label3,rgba(60,60,67,.3));">reps</span></button>
                            </div>
                            <button onClick="{{ onSkip }}" data-ex="{{ s.exIdx }}" data-set="{{ s.setIdx }}" style="display:{{ s.skipDisplay }};border:none;background:none;color:var(--label3,rgba(60,60,67,.3));font-size:13px;font-weight:600;cursor:pointer;padding:6px;">Skip</button>
                            <button onClick="{{ onCheck }}" data-ex="{{ s.exIdx }}" data-set="{{ s.setIdx }}" style="width:34px;height:34px;flex-shrink:0;border:none;border-radius:50%;background:{{ s.checkBg }};color:{{ s.checkColor }};cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></button>
                          </div>
                        </sc-for>
                      </div>
                    </sc-if>

                    <!-- cardio -->
                    <sc-if value="{{ ex.isCardio }}" hint-placeholder-val="{{ true }}">
                      <input data-ex="{{ ex.exIdx }}" onInput="{{ onCardioNote }}" placeholder="Notes (e.g. 10 min, 11 km/h)" style="width:100%;border:none;background:var(--field,#f2f2f7);border-radius:11px;padding:12px 14px;font-size:14px;color:var(--label,#000);margin-bottom:10px;font-family:inherit;" />
                      <button onClick="{{ onCardioDone }}" data-ex="{{ ex.exIdx }}" style="width:100%;height:46px;border:none;border-radius:12px;background:{{ ex.cardioBg }};color:{{ ex.cardioColor }};font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{{ ex.cardioLabel }}</button>
                    </sc-if>
                  </div>
                </sc-if>
              </div>
            </sc-for>

            <sc-if value="{{ allDone }}" hint-placeholder-val="{{ false }}">
              <button onClick="{{ finishWorkout }}" style="width:100%;height:52px;border:none;border-radius:15px;background:#34c759;color:#fff;font-size:17px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:6px;box-shadow:0 6px 18px rgba(52,199,89,.36);animation:fp-fade .4s ease;"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Finish Workout</button>
            </sc-if>
          </div>
        </div>
      </sc-if>

      <!-- Home indicator -->
      <div style="position:absolute;bottom:8px;left:0;right:0;display:flex;justify-content:center;z-index:25;pointer-events:none;"><div style="width:134px;height:5px;border-radius:3px;background:var(--label,#000);opacity:.85;"></div></div>

      <!-- ===================== REST TIMER ===================== -->
      <sc-if value="{{ restOpen }}" hint-placeholder-val="{{ false }}">
        <div style="position:absolute;inset:0;z-index:50;background:rgba(0,0,0,.45);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fp-fade .25s ease;">
          <div style="background:var(--card,#fff);border-radius:28px;padding:30px 34px;display:flex;flex-direction:column;align-items:center;box-shadow:0 20px 60px rgba(0,0,0,.4);transform:{{ restScale }};transition:transform .4s cubic-bezier(.2,.8,.2,1);">
            <div style="font-size:13px;font-weight:700;color:var(--label2,rgba(60,60,67,.6));text-transform:uppercase;letter-spacing:.6px;margin-bottom:18px;">{{ restLabel }}</div>
            <div style="position:relative;width:170px;height:170px;margin-bottom:24px;">
              <svg width="170" height="170" viewBox="0 0 170 170">
                <circle cx="85" cy="85" r="74" fill="none" stroke="var(--field,#eee)" stroke-width="11"/>
                <circle cx="85" cy="85" r="74" fill="none" stroke="var(--accent,#ff5a3c)" stroke-width="11" stroke-linecap="round" stroke-dasharray="{{ restCirc }}" stroke-dashoffset="{{ restOffset }}" transform="rotate(-90 85 85)" style="transition:stroke-dashoffset {{ restTransition }};"/>
              </svg>
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:700;color:var(--label,#000);font-variant-numeric:tabular-nums;letter-spacing:-1px;">{{ restCount }}</div>
            </div>
            <div style="display:flex;gap:12px;">
              <button onClick="{{ restAdd }}" style="height:46px;padding:0 24px;border:none;border-radius:14px;background:var(--field,#f2f2f7);color:var(--label,#000);font-size:15px;font-weight:600;cursor:pointer;">+30s</button>
              <button onClick="{{ restSkip }}" style="height:46px;padding:0 24px;border:none;border-radius:14px;background:var(--accent,#ff5a3c);color:#fff;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:4px;">{{ restSkipLbl }}<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
            </div>
          </div>
        </div>
      </sc-if>

      <!-- ===================== DRUM PICKER ===================== -->
      <sc-if value="{{ pickerOpen }}" hint-placeholder-val="{{ false }}">
        <div style="position:absolute;inset:0;z-index:55;display:flex;flex-direction:column;justify-content:flex-end;">
          <div onClick="{{ pickerCancel }}" style="position:absolute;inset:0;background:rgba(0,0,0,.35);animation:fp-fade .25s ease;"></div>
          <div style="position:relative;background:var(--card,#fff);border-radius:22px 22px 0 0;padding-bottom:30px;animation:fp-sheet-up .32s cubic-bezier(.2,.8,.2,1);">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--sep,rgba(60,60,67,.1));">
              <button onClick="{{ pickerCancel }}" style="border:none;background:none;color:var(--label2,rgba(60,60,67,.6));font-size:17px;cursor:pointer;">Cancel</button>
              <span style="font-size:14px;font-weight:600;color:var(--label,#000);">{{ pickerTitle }}</span>
              <button onClick="{{ pickerDone }}" style="border:none;background:none;color:var(--accent,#ff5a3c);font-size:17px;font-weight:600;cursor:pointer;">Done</button>
            </div>
            <div style="position:relative;height:220px;">
              <div style="position:absolute;left:0;right:0;top:88px;height:44px;background:var(--field,#f2f2f7);border-radius:10px;margin:0 40px;pointer-events:none;"></div>
              <div ref="{{ wheelRef }}" class="fp-wheel" style="height:220px;overflow-y:scroll;scroll-snap-type:y mandatory;text-align:center;-webkit-mask-image:linear-gradient(180deg,transparent,#000 35%,#000 65%,transparent);mask-image:linear-gradient(180deg,transparent,#000 35%,#000 65%,transparent);">
                <div style="height:88px;"></div>
                <sc-for list="{{ pickerItems }}" as="it" hint-placeholder-count="9">
                  <div style="height:44px;line-height:44px;scroll-snap-align:center;font-size:22px;font-weight:600;color:var(--label,#000);font-variant-numeric:tabular-nums;">{{ it.label }}</div>
                </sc-for>
                <div style="height:88px;"></div>
              </div>
              <div style="position:absolute;right:64px;top:0;bottom:0;display:flex;align-items:center;pointer-events:none;font-size:14px;font-weight:600;color:var(--label2,rgba(60,60,67,.6));">{{ pickerUnit }}</div>
            </div>
          </div>
        </div>
      </sc-if>

      <!-- ===================== SETTINGS ===================== -->
      <sc-if value="{{ settingsOpen }}" hint-placeholder-val="{{ false }}">
        <div style="position:absolute;inset:0;z-index:55;display:flex;flex-direction:column;justify-content:flex-end;">
          <div onClick="{{ closeSettings }}" style="position:absolute;inset:0;background:rgba(0,0,0,.35);animation:fp-fade .25s ease;"></div>
          <div style="position:relative;background:var(--bg,#f2f2f7);border-radius:22px 22px 0 0;padding:0 0 34px;animation:fp-sheet-up .32s cubic-bezier(.2,.8,.2,1);max-height:80%;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;">
              <span style="font-size:20px;font-weight:700;color:var(--label,#000);">Settings</span>
              <button onClick="{{ closeSettings }}" style="border:none;background:none;color:var(--accent,#ff5a3c);font-size:17px;font-weight:600;cursor:pointer;">Done</button>
            </div>
            <div style="padding:0 16px;">
              <div style="font-size:13px;font-weight:600;color:var(--label2,rgba(60,60,67,.6));text-transform:uppercase;letter-spacing:.4px;margin:0 8px 8px;">Units</div>
              <div style="background:var(--card,#fff);border-radius:14px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;">
                <span style="font-size:16px;color:var(--label,#000);">Weight</span>
                <div style="display:flex;background:var(--field,#e8e8ed);border-radius:9px;padding:2px;">
                  <button onClick="{{ setKg }}" style="border:none;border-radius:7px;padding:6px 18px;font-size:14px;font-weight:600;cursor:pointer;background:{{ kgBg }};color:{{ kgColor }};box-shadow:{{ kgShadow }};">kg</button>
                  <button onClick="{{ setLbs }}" style="border:none;border-radius:7px;padding:6px 18px;font-size:14px;font-weight:600;cursor:pointer;background:{{ lbsBg }};color:{{ lbsColor }};box-shadow:{{ lbsShadow }};">lbs</button>
                </div>
              </div>
              <div style="background:var(--card,#fff);border-radius:14px;overflow:hidden;">
                <button style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:15px 16px;border:none;background:none;cursor:pointer;">
                  <span style="font-size:16px;color:var(--label,#000);">Admin Dashboard</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--label3,rgba(60,60,67,.3))" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </sc-if>

    </div>
  </div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props="{&quot;$preview&quot;:{&quot;width&quot;:470,&quot;height&quot;:924},&quot;accent&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;Energy Orange&quot;,&quot;System Blue&quot;,&quot;Move Pink&quot;,&quot;Activity Green&quot;],&quot;default&quot;:&quot;Energy Orange&quot;,&quot;tsType&quot;:&quot;string&quot;},&quot;defaultUnit&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;kg&quot;,&quot;lbs&quot;],&quot;default&quot;:&quot;kg&quot;,&quot;tsType&quot;:&quot;string&quot;},&quot;restSeconds&quot;:{&quot;editor&quot;:&quot;int&quot;,&quot;default&quot;:90,&quot;min&quot;:30,&quot;max&quot;:180,&quot;step&quot;:15,&quot;tsType&quot;:&quot;number&quot;}}">
class Component extends DCLogic {
  WORKOUTS = [
    {
      label: 'Cardio', when: 'Monday', durationMin: 40,
      focus: 'Treadmill · Bike · Rowing · Elliptical · Stair Climber',
      warmup: 'Start on the treadmill at a slow walk (4–5 km/h) for 5 minutes to ease your heart rate up and loosen the joints before the real effort begins.',
      exercises: [
        { name: 'Treadmill', muscles: 'Heart · Legs · Endurance', setsLabel: '10 min', defaultSets: 1, isCardio: true },
        { name: 'Stationary Bike', muscles: 'Quads · Glutes · Cardio', setsLabel: '8 min', defaultSets: 1, isCardio: true },
        { name: 'Rowing Machine', muscles: 'Full Body · Back · Core', setsLabel: '2×3 min', defaultSets: 2, isCardio: true },
        { name: 'Elliptical Trainer', muscles: 'Full Body · Low Impact', setsLabel: '8 min', defaultSets: 1, isCardio: true },
        { name: 'Stair Climber', muscles: 'Glutes · Quads · Calves', setsLabel: '5 min', defaultSets: 1, isCardio: true },
      ],
    },
    {
      label: 'Leg Day', when: 'Wednesday', durationMin: 50,
      focus: 'Quads · Glutes · Hamstrings · Calves',
      warmup: '5 minutes on the stationary bike at low resistance, then 10 bodyweight squats and leg swings to warm joints and muscles before loading them.',
      exercises: [
        { name: 'Leg Press Machine', muscles: 'Quads · Glutes · Hamstrings', setsLabel: '4×12', defaultSets: 4, isCardio: false },
        { name: 'Leg Extension', muscles: 'Quads (front of thigh)', setsLabel: '3×12', defaultSets: 3, isCardio: false },
        { name: 'Leg Curl', muscles: 'Hamstrings', setsLabel: '3×12', defaultSets: 3, isCardio: false },
        { name: 'Hip Abductor', muscles: 'Outer Glutes · Hips', setsLabel: '3×15', defaultSets: 3, isCardio: false },
        { name: 'Hip Adductor', muscles: 'Inner Thighs · Groin', setsLabel: '3×15', defaultSets: 3, isCardio: false },
        { name: 'Seated Calf Raise', muscles: 'Calves — Soleus', setsLabel: '4×15', defaultSets: 4, isCardio: false },
      ],
    },
    {
      label: 'Arms', when: 'Friday', durationMin: 45,
      focus: 'Biceps · Triceps · Forearms · Grip',
      warmup: '5 minutes of light cardio, then arm circles, wrist rotations and shoulder rolls. Warm the elbow joints gently — arm day stresses them.',
      exercises: [
        { name: 'Cable Bicep Curl', muscles: 'Biceps · Forearms', setsLabel: '3×12', defaultSets: 3, isCardio: false },
        { name: 'Preacher Curl', muscles: 'Biceps Peak', setsLabel: '3×10', defaultSets: 3, isCardio: false },
        { name: 'Tricep Pushdown', muscles: 'Triceps — all 3 heads', setsLabel: '3×12', defaultSets: 3, isCardio: false },
        { name: 'Tricep Extension', muscles: 'Triceps — Long Head', setsLabel: '3×12', defaultSets: 3, isCardio: false },
        { name: 'Cable Hammer Curl', muscles: 'Brachialis · Forearms', setsLabel: '3×12', defaultSets: 3, isCardio: false },
        { name: 'Cable Face Pull', muscles: 'Rear Delts · Rotator Cuff', setsLabel: '3×15', defaultSets: 3, isCardio: false },
      ],
    },
  ];

  ACCENTS = {
    'Energy Orange': ['#ff5a3c', '#ff2d55'],
    'System Blue':   ['#0a84ff', '#0a63ff'],
    'Move Pink':     ['#ff375f', '#ff2d55'],
    'Activity Green':['#30d158', '#24b04a'],
  };

  state = {
    screen: 'home',     // home | overview | active
    dayIdx: 1,          // 0..2 (default to Leg Day for a richer demo)
    session: null,
    openEx: 0,
    elapsed: 0,
    rest: null,         // { remaining, total, hasNext, done }
    picker: null,       // { type, exIdx, setIdx, items, start, unit }
    settings: false,
    unit: 'kg',
    lastHints: {},      // name -> {weight,reps}
  };

  wheelRef = React.createRef();

  componentDidMount() {
    this.setState({ unit: this.props.defaultUnit ?? 'kg' });
    this._tick = setInterval(() => {
      if (this.state.session && this._start) {
        this.setState({ elapsed: Math.floor((Date.now() - this._start) / 1000) });
      }
    }, 1000);
  }
  componentWillUnmount() { clearInterval(this._tick); clearInterval(this._rest); clearInterval(this._wind); }

  // seeded "last workout" for the home screen
  LAST = {
    label: 'Cardio', date: 'Yesterday', durationMin: 38,
    chips: [
      { name: 'Treadmill', val: '10 min' },
      { name: 'Bike', val: '8 min' },
      { name: 'Rowing', val: '2×3' },
      { name: 'Elliptical', val: '8 min' },
    ],
  };
  WEEKDONE = [false, true, false, true, false, false, false]; // last 7 days, today = idx 5 (Fri)

  fmt(s) {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }
  fmtRest(s) {
    const m = Math.floor(s / 60), sec = s % 60;
    return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${s}`;
  }

  go(screen) { this.setState({ screen }); }

  beginWorkout = () => {
    const w = this.WORKOUTS[this.state.dayIdx];
    this._start = Date.now();
    const session = {
      exercises: w.exercises.map(ex => ({
        name: ex.name, isCardio: ex.isCardio, note: '',
        sets: Array.from({ length: ex.defaultSets }, () => ({
          done: false, skipped: false,
          weight: ex.isCardio ? null : (this.state.unit === 'lbs' ? 45 : 20),
          reps: ex.isCardio ? null : 10,
        })),
      })),
    };
    this.setState({ session, screen: 'active', openEx: 0, elapsed: 0 });
  };

  toggleEx(i) { this.setState(s => ({ openEx: s.openEx === i ? -1 : i })); }

  buzz(ms) { if ('vibrate' in navigator) navigator.vibrate(ms); }

  exAllDone(ex) {
    return ex.isCardio ? ex.sets.some(s => s.done) : ex.sets.every(s => s.done);
  }
  sessionAllDone() {
    const s = this.state.session;
    return s && s.exercises.every(ex => this.exAllDone(ex));
  }

  advanceAfter(exIdx) {
    const s = this.state.session;
    const next = s.exercises.findIndex((ex, i) => i > exIdx && !this.exAllDone(ex));
    return next;
  }

  checkSet = (e) => {
    const exIdx = +e.currentTarget.dataset.ex, setIdx = +e.currentTarget.dataset.set;
    const session = structuredClone(this.state.session);
    session.exercises[exIdx].sets[setIdx].done = true;
    session.exercises[exIdx].sets[setIdx].skipped = false;
    this.buzz(40);
    const ex = session.exercises[exIdx];
    const lastHints = { ...this.state.lastHints };
    lastHints[ex.name] = { weight: ex.sets[setIdx].weight, reps: ex.sets[setIdx].reps };
    const exDone = ex.sets.every(st => st.done);
    this.setState({ session, lastHints });
    if (exDone) {
      const next = this.advanceAfter(exIdx);
      this.startRest(next >= 0, next);
    } else {
      this.startRest(false, -1);
    }
  };

  skipSet = (e) => {
    const exIdx = +e.currentTarget.dataset.ex, setIdx = +e.currentTarget.dataset.set;
    const session = structuredClone(this.state.session);
    session.exercises[exIdx].sets[setIdx] = { done: true, skipped: true, weight: null, reps: null };
    this.buzz(20);
    this.setState({ session });
  };

  cardioDone = (e) => {
    const exIdx = +e.currentTarget.dataset.ex;
    const session = structuredClone(this.state.session);
    const ex = session.exercises[exIdx];
    const nowDone = !ex.sets[0].done;
    ex.sets[0].done = nowDone;
    this.buzz(nowDone ? 40 : 20);
    this.setState({ session });
    if (nowDone) {
      const next = this.advanceAfter(exIdx);
      this.startRest(next >= 0, next);
    }
  };

  cardioNote = (e) => {
    const exIdx = +e.currentTarget.dataset.ex;
    const session = structuredClone(this.state.session);
    session.exercises[exIdx].note = e.target.value;
    this.setState({ session });
  };

  // ── Rest timer ──
  startRest(hasNext, nextIdx) {
    clearInterval(this._rest);
    const secs = this.props.restSeconds ?? 90;
    this._nextIdx = nextIdx;
    this.setState({ rest: { remaining: secs, total: secs, hasNext, done: false } });
    this._rest = setInterval(() => {
      this.setState(st => {
        if (!st.rest) return {};
        const r = st.rest.remaining - 1;
        if (r <= 0) { this.finishRest(); return { rest: { ...st.rest, remaining: 0 } }; }
        return { rest: { ...st.rest, remaining: r } };
      });
    }, 1000);
  }
  finishRest() {
    clearInterval(this._rest);
    this.buzz([160, 70, 160]);
    this.setState(st => ({ rest: st.rest ? { ...st.rest, done: true } : null }));
    setTimeout(() => {
      const nextIdx = this._nextIdx;
      this.setState(st => ({ rest: null, openEx: nextIdx >= 0 ? nextIdx : st.openEx }));
    }, 900);
  }
  restAdd = () => this.setState(st => (st.rest && !st.rest.winding) ? ({ rest: { ...st.rest, remaining: st.rest.remaining + 30, total: st.rest.total + 30 } }) : {});
  // Wind the timer rapidly down to 0, flash the check, then dismiss.
  restSkip = () => {
    if (this._winding || !this.state.rest) return;
    this._winding = true;
    clearInterval(this._rest);
    this.setState(st => st.rest ? ({ rest: { ...st.rest, winding: true } }) : {});
    this._wind = setInterval(() => {
      this.setState(st => {
        if (!st.rest) return {};
        const r = st.rest.remaining - Math.max(1, Math.ceil(st.rest.remaining / 5));
        if (r <= 0) {
          clearInterval(this._wind);
          this.buzz(40);
          setTimeout(() => {
            const nextIdx = this._nextIdx;
            this._winding = false;
            this.setState(s2 => ({ rest: null, openEx: nextIdx >= 0 ? nextIdx : s2.openEx }));
          }, 360);
          return { rest: { ...st.rest, remaining: 0, done: true } };
        }
        return { rest: { ...st.rest, remaining: r } };
      });
    }, 55);
  };

  finishWorkout = () => {
    clearInterval(this._rest);
    this.setState({ session: null, rest: null, screen: 'home' });
  };

  // ── Picker ──
  openWeight = (e) => {
    const exIdx = +e.currentTarget.dataset.ex, setIdx = +e.currentTarget.dataset.set;
    const cur = this.state.session.exercises[exIdx].sets[setIdx].weight ?? 0;
    const step = this.state.unit === 'lbs' ? 2.5 : 0.5;
    const max = this.state.unit === 'lbs' ? 440 : 200;
    const items = [];
    for (let v = 0; v <= max; v += step) items.push(v);
    const start = items.findIndex(v => v >= cur);
    this.openPicker({ type: 'weight', exIdx, setIdx, items, start: start < 0 ? 0 : start, unit: this.state.unit });
  };
  openReps = (e) => {
    const exIdx = +e.currentTarget.dataset.ex, setIdx = +e.currentTarget.dataset.set;
    const cur = this.state.session.exercises[exIdx].sets[setIdx].reps ?? 10;
    const items = Array.from({ length: 50 }, (_, i) => i + 1);
    this.openPicker({ type: 'reps', exIdx, setIdx, items, start: Math.max(0, cur - 1), unit: 'reps' });
  };
  openPicker(picker) {
    this.setState({ picker });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (this.wheelRef.current) this.wheelRef.current.scrollTop = picker.start * 44;
    }));
  }
  pickerCancel = () => this.setState({ picker: null });
  pickerDone = () => {
    const p = this.state.picker;
    const idx = Math.max(0, Math.min(Math.round(this.wheelRef.current.scrollTop / 44), p.items.length - 1));
    const val = p.items[idx];
    const session = structuredClone(this.state.session);
    if (p.type === 'weight') session.exercises[p.exIdx].sets[p.setIdx].weight = val;
    else session.exercises[p.exIdx].sets[p.setIdx].reps = val;
    this.setState({ session, picker: null });
  };

  openSettings = () => this.setState({ settings: true });
  closeSettings = () => this.setState({ settings: false });
  setUnit = (u) => this.setState({ unit: u });

  // ───────────────────────────────────────────────
  renderVals() {
    const st = this.state;
    const accent = this.ACCENTS[this.props.accent] ?? this.ACCENTS['Energy Orange'];
    const dark = false;
    const rootStyle = `--accent:${accent[0]};--accent2:${accent[1]};`;
    const w = this.WORKOUTS[st.dayIdx];
    const unit = st.unit;

    // week ring
    const dayLbls = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const todayIdx = 4; // Friday in this 7-slot demo (Mon..Sun)
    const week = this.WEEKDONE.map((done, i) => ({
      lbl: dayLbls[i],
      mark: done ? '✓' : '',
      fill: done ? accent[0] : 'transparent',
      ringColor: done ? accent[0] : (i === todayIdx ? accent[0] : 'color-mix(in srgb,var(--label2,rgba(60,60,67,.6)) 30%,transparent)'),
      txtColor: done ? '#fff' : 'var(--label3,rgba(60,60,67,.3))',
    }));
    const weekDone = this.WEEKDONE.filter(Boolean).length;
    const weekGoal = 3;
    const ringR = 44, ringC = 2 * Math.PI * ringR;
    const ringPct = Math.min(1, weekDone / weekGoal);
    const ringDash = `${(ringC * ringPct).toFixed(1)} ${ringC.toFixed(1)}`;

    const vals = {
      rootStyle,
      isHome: st.screen === 'home',
      isOverview: st.screen === 'overview',
      isActive: st.screen === 'active',
      unitLbl: unit,
      todayLabel: 'Friday, June 5',

      // home
      week, weekDone, weekGoal, ringDash,
      weekMsg: weekDone >= weekGoal ? 'Goal reached! 🎉' : `${weekGoal - weekDone} workout${weekGoal - weekDone === 1 ? '' : 's'} to go`,
      nextWhen: `Up next · ${w.when}`,
      nextTitle: w.label,
      nextFocus: w.focus,
      nextDuration: w.durationMin,
      nextCount: w.exercises.length,
      warmup: w.warmup,
      hasLast: true,
      lastTitle: this.LAST.label,
      lastMeta: `${this.LAST.date} · ${this.LAST.durationMin} min · ${this.LAST.chips.length} exercises`,
      lastChips: this.LAST.chips,

      // overview
      ovExercises: w.exercises.map((ex, i) => ({
        num: i + 1, name: ex.name, muscles: ex.muscles, setsLabel: ex.setsLabel,
        border: i < w.exercises.length - 1 ? '1px solid var(--sep,rgba(60,60,67,.08))' : 'none',
      })),

      // handlers
      goOverview: () => this.go('overview'),
      goHome: () => { this.setState({ session: null, screen: 'home', rest: null }); },
      beginWorkout: this.beginWorkout,
      openSettings: this.openSettings,
      closeSettings: this.closeSettings,
      finishWorkout: this.finishWorkout,
      onWeightTap: this.openWeight,
      onRepsTap: this.openReps,
      onCheck: this.checkSet,
      onSkip: this.skipSet,
      onCardioDone: this.cardioDone,
      onCardioNote: this.cardioNote,
      restAdd: this.restAdd,
      restSkip: this.restSkip,
      pickerCancel: this.pickerCancel,
      pickerDone: this.pickerDone,
      wheelRef: this.wheelRef,
      setKg: () => this.setUnit('kg'),
      setLbs: () => this.setUnit('lbs'),
    };

    // active
    if (st.session) {
      const totalSets = st.session.exercises.filter(e => !e.isCardio).reduce((a, e) => a + e.sets.length, 0);
      const doneSets = st.session.exercises.filter(e => !e.isCardio).reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
      vals.elapsedStr = this.fmt(st.elapsed);
      vals.activeProgress = `${doneSets} / ${totalSets} sets`;
      vals.activePct = totalSets ? `${(doneSets / totalSets) * 100}%` : '0%';
      vals.allDone = this.sessionAllDone();

      vals.acExercises = st.session.exercises.map((ex, i) => {
        const open = st.openEx === i;
        const done = this.exAllDone(ex);
        const last = st.lastHints[ex.name];
        const setsDone = ex.sets.filter(s => s.done).length;
        const lastHint = ex.isCardio
          ? (last ? 'Done before ✓' : 'First time — ease in')
          : (last ? `Last: ${last.weight ?? '?'} ${unit} × ${last.reps ?? '?'} reps` : 'First time — start light');
        return {
          exIdx: i, name: ex.name, muscles: ex.muscles,
          setsLabel: this.WORKOUTS[st.dayIdx].exercises[i].setsLabel,
          open, isCardio: ex.isCardio, isStrength: !ex.isCardio,
          toggle: () => this.toggleEx(i),
          chevron: open ? 'rotate(90deg)' : 'rotate(0deg)',
          cardBorder: done ? '1px solid color-mix(in srgb,#34c759 45%,transparent)' : '1px solid transparent',
          numBg: done ? '#34c759' : 'color-mix(in srgb,var(--accent,#ff5a3c) 12%,transparent)',
          numColor: done ? '#fff' : 'var(--accent,#ff5a3c)',
          numMark: done ? '✓' : (i + 1),
          lastHint,
          progPct: ex.sets.length ? `${(setsDone / ex.sets.length) * 100}%` : '0%',
          progTxt: `${setsDone} / ${ex.sets.length}`,
          sets: ex.sets.map((s, j) => ({
            exIdx: i, setIdx: j, num: j + 1,
            weight: s.skipped ? '—' : (s.weight ?? 0),
            reps: s.skipped ? '—' : (s.reps ?? 0),
            wColor: s.done ? 'var(--label2,rgba(60,60,67,.6))' : 'var(--label,#000)',
            rColor: s.done ? 'var(--label2,rgba(60,60,67,.6))' : 'var(--label,#000)',
            rowBg: s.done ? 'color-mix(in srgb,#34c759 9%,var(--field,#f7f7fa))' : 'var(--field,#f5f5f8)',
            numBg: s.done ? '#34c759' : 'color-mix(in srgb,var(--label2,rgba(60,60,67,.6)) 18%,transparent)',
            numColor: s.done ? '#fff' : 'var(--label2,rgba(60,60,67,.6))',
            checkBg: s.done ? '#34c759' : 'color-mix(in srgb,var(--label2,rgba(60,60,67,.6)) 14%,transparent)',
            checkColor: s.done ? '#fff' : 'var(--label2,rgba(60,60,67,.6))',
            skipDisplay: s.done ? 'none' : 'block',
            fieldOpacity: s.done ? 'opacity:.55;pointer-events:none;' : '',
          })),
          cardioBg: ex.sets[0].done ? '#34c759' : 'color-mix(in srgb,var(--accent,#ff5a3c) 12%,transparent)',
          cardioColor: ex.sets[0].done ? '#fff' : 'var(--accent,#ff5a3c)',
          cardioLabel: ex.sets[0].done ? 'Completed' : 'Mark as Done',
        };
      });
    } else {
      vals.elapsedStr = '0:00'; vals.activeProgress = ''; vals.activePct = '0%';
      vals.allDone = false; vals.acExercises = [];
    }

    // rest
    if (st.rest) {
      const r = st.rest;
      const C = 2 * Math.PI * 74;
      vals.restOpen = true;
      vals.restLabel = r.hasNext ? 'Rest · Next up' : 'Rest';
      vals.restCount = r.done ? '✓' : this.fmtRest(r.remaining);
      vals.restCirc = C.toFixed(1);
      vals.restOffset = (C * (1 - r.remaining / r.total)).toFixed(1);
      vals.restScale = r.done ? 'scale(1.06)' : 'scale(1)';
      vals.restTransition = r.winding ? '0.05s linear' : '1s linear';
      vals.restSkipLbl = r.hasNext ? 'Skip' : 'Done';
    } else {
      vals.restOpen = false; vals.restLabel = ''; vals.restCount = ''; vals.restCirc = '0';
      vals.restOffset = '0'; vals.restScale = 'scale(1)'; vals.restTransition = '1s linear'; vals.restSkipLbl = 'Skip';
    }

    // picker
    if (st.picker) {
      vals.pickerOpen = true;
      vals.pickerTitle = st.picker.type === 'weight' ? 'Weight' : 'Reps';
      vals.pickerUnit = st.picker.unit;
      vals.pickerItems = st.picker.items.map(v => ({ label: Number.isInteger(v) ? String(v) : v.toFixed(1) }));
    } else {
      vals.pickerOpen = false; vals.pickerTitle = ''; vals.pickerUnit = ''; vals.pickerItems = [];
    }

    // settings
    vals.settingsOpen = st.settings;
    vals.kgBg = unit === 'kg' ? 'var(--card,#fff)' : 'transparent';
    vals.kgColor = unit === 'kg' ? 'var(--label,#000)' : 'var(--label2,rgba(60,60,67,.6))';
    vals.kgShadow = unit === 'kg' ? '0 1px 3px rgba(0,0,0,.16)' : 'none';
    vals.lbsBg = unit === 'lbs' ? 'var(--card,#fff)' : 'transparent';
    vals.lbsColor = unit === 'lbs' ? 'var(--label,#000)' : 'var(--label2,rgba(60,60,67,.6))';
    vals.lbsShadow = unit === 'lbs' ? '0 1px 3px rgba(0,0,0,.16)' : 'none';

    return vals;
  }
}
</script>
</body>
</html>

```

## Notes
- To run as-is, this file needs the `support.js` runtime in the same folder.
- The design is built at a fixed 390×844 iPhone frame; the real app should drop the outer `.iPhone` bezel and let the screen fill the viewport.
- All interactivity (state, timers, picker scroll math, vibration) is in the `class Component` block at the bottom of the file.
