// src/components/FitTheme.tsx
import { jsx } from "react/jsx-runtime";
function FitTheme({ children }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        fontFamily: "system-ui, 'Segoe UI', sans-serif",
        background: "var(--bg, #000000)",
        color: "var(--text, #f2f5fa)",
        minHeight: "100%"
      },
      children
    }
  );
}

// src/components/Button.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function Button({
  variant = "primary",
  children,
  onClick,
  disabled,
  pulsing,
  type = "button",
  className = ""
}) {
  const base = variant === "primary" ? "btn-primary" : "btn-ghost";
  const pulseClass = pulsing ? "btn-pulse" : "";
  return /* @__PURE__ */ jsx2(
    "button",
    {
      type,
      className: [base, pulseClass, className].filter(Boolean).join(" "),
      onClick,
      disabled,
      style: pulsing ? { animation: "btn-pulse 1.8s ease-in-out infinite" } : void 0,
      children
    }
  );
}

// src/components/Card.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function Card({ children, className = "", style }) {
  return /* @__PURE__ */ jsx3("div", { className: ["card", className].filter(Boolean).join(" "), style, children });
}

// src/components/Badge.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function Badge({ children }) {
  return /* @__PURE__ */ jsx4("span", { className: "badge", children });
}

// src/components/ScreenHeader.tsx
import { jsx as jsx5, jsxs } from "react/jsx-runtime";
function ScreenHeader({ badge, title, subtitle }) {
  return /* @__PURE__ */ jsxs("div", { className: "screen-header", children: [
    badge && /* @__PURE__ */ jsx5(Badge, { children: badge }),
    /* @__PURE__ */ jsx5("h1", { children: title }),
    subtitle && /* @__PURE__ */ jsx5("p", { children: subtitle })
  ] });
}

// src/components/StatStrip.tsx
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
function StatStrip({ stats }) {
  return /* @__PURE__ */ jsx6("div", { className: "home-stats", children: stats.map((s, i) => /* @__PURE__ */ jsxs2("div", { className: "home-stat", children: [
    /* @__PURE__ */ jsx6("div", { className: "home-stat-num", children: s.value }),
    /* @__PURE__ */ jsx6("div", { className: "home-stat-lbl", children: s.label })
  ] }, i)) });
}

// src/components/StreakWeek.tsx
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
function StreakWeek({ days }) {
  return /* @__PURE__ */ jsx7("div", { className: "streak-row", children: days.map((d, i) => /* @__PURE__ */ jsxs3("div", { className: ["streak-dot", d.state === "done" ? "done" : d.state === "today" ? "today" : ""].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ jsx7("div", { className: "dot", children: d.state === "done" ? "\u2713" : "" }),
    /* @__PURE__ */ jsx7("div", { className: "day-lbl", children: d.label })
  ] }, i)) });
}

// src/components/ProgressBar.tsx
import { jsx as jsx8, jsxs as jsxs4 } from "react/jsx-runtime";
function ProgressBar({ current, total, label }) {
  const pct = total > 0 ? Math.min(100, current / total * 100) : 0;
  return /* @__PURE__ */ jsxs4("div", { className: "sets-progress", children: [
    /* @__PURE__ */ jsx8("div", { className: "sets-progress-bar", children: /* @__PURE__ */ jsx8("div", { className: "sets-progress-fill", style: { width: `${pct}%` } }) }),
    /* @__PURE__ */ jsxs4("div", { className: "sets-progress-txt", children: [
      current,
      " / ",
      total,
      label ? ` ${label}` : ""
    ] })
  ] });
}

// src/components/SetRow.tsx
import { jsx as jsx9, jsxs as jsxs5 } from "react/jsx-runtime";
var CheckIcon = () => /* @__PURE__ */ jsx9("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx9("polyline", { points: "20 6 9 17 4 12" }) });
function SetRow({
  setNumber,
  reps = "",
  weight = "",
  unit = "kg",
  done = false,
  skipped = false,
  onCheck,
  onSkip,
  onRepsChange,
  onWeightChange,
  lastHint
}) {
  const rowClass = ["set-row", done ? "done" : "", skipped ? "skipped" : ""].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs5("div", { className: rowClass, children: [
    lastHint && /* @__PURE__ */ jsx9("div", { className: "set-last-hint", children: lastHint }),
    /* @__PURE__ */ jsxs5("div", { className: "set-row-top", children: [
      /* @__PURE__ */ jsx9("div", { className: "set-num", children: setNumber }),
      /* @__PURE__ */ jsxs5("div", { className: "set-fields", children: [
        /* @__PURE__ */ jsxs5("div", { className: "set-field", children: [
          /* @__PURE__ */ jsx9(
            "div",
            {
              className: ["set-val", weight === "" ? "empty" : ""].filter(Boolean).join(" "),
              onClick: () => !done && !skipped && onWeightChange?.(""),
              children: weight !== "" ? weight : unit
            }
          ),
          /* @__PURE__ */ jsx9("div", { className: "set-field-lbl", children: unit })
        ] }),
        /* @__PURE__ */ jsx9("div", { className: "set-sep", children: "\xD7" }),
        /* @__PURE__ */ jsxs5("div", { className: "set-field", children: [
          /* @__PURE__ */ jsx9(
            "div",
            {
              className: ["set-val", reps === "" ? "empty" : ""].filter(Boolean).join(" "),
              onClick: () => !done && !skipped && onRepsChange?.(""),
              children: reps !== "" ? reps : "reps"
            }
          ),
          /* @__PURE__ */ jsx9("div", { className: "set-field-lbl", children: "reps" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs5("div", { className: "set-row-foot", children: [
      /* @__PURE__ */ jsx9("button", { className: "set-skip-btn", onClick: onSkip, disabled: done || skipped, children: "Skip" }),
      /* @__PURE__ */ jsx9("button", { className: "set-check-btn", onClick: onCheck, disabled: done || skipped, children: /* @__PURE__ */ jsx9(CheckIcon, {}) })
    ] })
  ] });
}

// src/components/ExerciseCard.tsx
import { useState } from "react";
import { jsx as jsx10, jsxs as jsxs6 } from "react/jsx-runtime";
var ChevronIcon = () => /* @__PURE__ */ jsx10("svg", { className: "ex-chevron", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx10("polyline", { points: "9 18 15 12 9 6" }) });
function ExerciseCard({
  number,
  name,
  muscles,
  meta,
  defaultOpen = false,
  complete = false,
  children
}) {
  const [open, setOpen] = useState(defaultOpen);
  const cardClass = [
    "exercise-card",
    open ? "open" : "",
    complete ? "ex-complete" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs6("div", { className: cardClass, children: [
    /* @__PURE__ */ jsxs6("div", { className: "ex-header", onClick: () => setOpen((o) => !o), children: [
      /* @__PURE__ */ jsx10("div", { className: "ex-num", children: number }),
      /* @__PURE__ */ jsxs6("div", { className: "ex-info", children: [
        /* @__PURE__ */ jsx10("div", { className: "ex-name", children: name }),
        /* @__PURE__ */ jsx10("div", { className: "ex-muscles", children: muscles })
      ] }),
      /* @__PURE__ */ jsx10("div", { className: "ex-meta", children: meta }),
      /* @__PURE__ */ jsx10(ChevronIcon, {})
    ] }),
    /* @__PURE__ */ jsx10("div", { className: "ex-body-outer", children: /* @__PURE__ */ jsx10("div", { className: "ex-body", children }) })
  ] });
}

// src/components/WorkoutHeader.tsx
import { jsx as jsx11, jsxs as jsxs7 } from "react/jsx-runtime";
var BackIcon = () => /* @__PURE__ */ jsx11("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx11("polyline", { points: "15 18 9 12 15 6" }) });
function WorkoutHeader({ title, subtitle, elapsed, onBack }) {
  return /* @__PURE__ */ jsxs7("div", { className: "workout-header", children: [
    /* @__PURE__ */ jsxs7("div", { className: "workout-header-left", children: [
      onBack && /* @__PURE__ */ jsxs7("button", { className: "wkt-back-btn", onClick: onBack, children: [
        /* @__PURE__ */ jsx11(BackIcon, {}),
        " Back"
      ] }),
      /* @__PURE__ */ jsx11("h2", { children: title }),
      subtitle && /* @__PURE__ */ jsx11("p", { children: subtitle })
    ] }),
    elapsed !== void 0 && /* @__PURE__ */ jsxs7("div", { className: "wkt-timer-wrap", children: [
      /* @__PURE__ */ jsx11("div", { className: "timer", children: elapsed }),
      /* @__PURE__ */ jsx11("div", { className: "timer-lbl", children: "elapsed" })
    ] })
  ] });
}

// src/components/RestTimer.tsx
import { jsx as jsx12, jsxs as jsxs8 } from "react/jsx-runtime";
var RADIUS = 35;
var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
function RestTimer({
  seconds,
  totalSeconds,
  onSkip,
  onAdd,
  addIncrement = 30
}) {
  const progress = totalSeconds > 0 ? seconds / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${mins > 0 ? `${mins}:` : ""}${String(secs).padStart(mins > 0 ? 2 : 1, "0")}`;
  return /* @__PURE__ */ jsx12("div", { className: "rest-overlay", children: /* @__PURE__ */ jsxs8("div", { className: "rest-card", children: [
    /* @__PURE__ */ jsx12("div", { className: "rest-lbl", children: "REST" }),
    /* @__PURE__ */ jsxs8("div", { className: "rest-arc-wrap", children: [
      /* @__PURE__ */ jsxs8("svg", { className: "rest-arc-svg", viewBox: "0 0 80 80", children: [
        /* @__PURE__ */ jsx12("circle", { className: "rest-arc-bg", cx: "40", cy: "40", r: RADIUS }),
        /* @__PURE__ */ jsx12(
          "circle",
          {
            className: "rest-arc-fill",
            cx: "40",
            cy: "40",
            r: RADIUS,
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: dashOffset,
            transform: "rotate(-90 40 40)",
            style: { transition: "stroke-dashoffset 0.95s linear" }
          }
        )
      ] }),
      /* @__PURE__ */ jsx12("div", { className: "rest-arc-inner", children: /* @__PURE__ */ jsx12("span", { className: "rest-count", children: display }) })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "rest-btns", children: [
      onAdd && /* @__PURE__ */ jsxs8("button", { className: "rest-btn-add", onClick: () => onAdd(addIncrement), children: [
        "+",
        addIncrement,
        "s"
      ] }),
      onSkip && /* @__PURE__ */ jsx12("button", { className: "rest-btn-skip", onClick: onSkip, children: "Skip" })
    ] })
  ] }) });
}

// src/components/BottomNav.tsx
import { jsx as jsx13, jsxs as jsxs9 } from "react/jsx-runtime";
function BottomNav({ items, onSelect }) {
  return /* @__PURE__ */ jsx13(
    "nav",
    {
      id: "bottom-nav",
      style: {
        display: "flex",
        background: "#0c1520",
        borderTop: "1px solid var(--border)",
        height: "calc(var(--nav-h) + var(--safe-bottom, 0px))",
        paddingBottom: "var(--safe-bottom, 0px)",
        flexShrink: 0
      },
      children: items.map((item) => /* @__PURE__ */ jsxs9(
        "button",
        {
          className: ["nav-btn", item.active ? "active" : ""].filter(Boolean).join(" "),
          onClick: () => onSelect?.(item.id),
          children: [
            item.icon,
            /* @__PURE__ */ jsx13("span", { children: item.label })
          ]
        },
        item.id
      ))
    }
  );
}

// src/components/IosToggle.tsx
import { useId } from "react";
import { jsx as jsx14, jsxs as jsxs10 } from "react/jsx-runtime";
function IosToggle({ checked, onChange, label }) {
  const id = useId();
  return /* @__PURE__ */ jsxs10("label", { className: "ios-toggle", htmlFor: id, "aria-label": label, children: [
    /* @__PURE__ */ jsx14(
      "input",
      {
        id,
        type: "checkbox",
        checked,
        onChange: (e) => onChange(e.target.checked)
      }
    ),
    /* @__PURE__ */ jsx14("span", { className: "ios-track" })
  ] });
}

// src/components/SegmentedControl.tsx
import { jsx as jsx15 } from "react/jsx-runtime";
function SegmentedControl({ options, value, onChange }) {
  return /* @__PURE__ */ jsx15("div", { className: "unit-seg", children: options.map((opt) => /* @__PURE__ */ jsx15(
    "button",
    {
      className: ["unit-seg-btn", opt === value ? "active" : ""].filter(Boolean).join(" "),
      onClick: () => onChange(opt),
      children: opt
    },
    opt
  )) });
}

// src/components/DrumPicker.tsx
import { useRef, useEffect } from "react";
import { jsx as jsx16, jsxs as jsxs11 } from "react/jsx-runtime";
function DrumPicker({ title, columns, onChange, onDone, onCancel }) {
  const scrollRefs = useRef([]);
  useEffect(() => {
    columns.forEach((col, ci) => {
      const el = scrollRefs.current[ci];
      if (!el) return;
      const idx = col.items.indexOf(col.value);
      if (idx < 0) return;
      el.scrollTop = idx * 44;
    });
  }, []);
  const handleScroll = (ci) => {
    const el = scrollRefs.current[ci];
    if (!el) return;
    const idx = Math.round(el.scrollTop / 44);
    const val = columns[ci].items[Math.min(idx, columns[ci].items.length - 1)];
    if (val !== void 0) onChange(ci, val);
  };
  return /* @__PURE__ */ jsxs11("div", { className: "drum-sheet", children: [
    /* @__PURE__ */ jsx16("div", { className: "drum-backdrop", onClick: onCancel }),
    /* @__PURE__ */ jsxs11("div", { className: "drum-panel", children: [
      /* @__PURE__ */ jsxs11("div", { className: "drum-hdr", children: [
        /* @__PURE__ */ jsx16("button", { className: "drum-cancel-btn", onClick: onCancel, children: "Cancel" }),
        title && /* @__PURE__ */ jsx16("span", { className: "drum-hdr-title", children: title }),
        /* @__PURE__ */ jsx16("button", { className: "drum-done-btn", onClick: onDone, children: "Done" })
      ] }),
      /* @__PURE__ */ jsxs11("div", { className: ["drum-body", columns.length === 1 ? "drum-body-single" : ""].filter(Boolean).join(" "), children: [
        /* @__PURE__ */ jsx16("div", { className: "drum-band" }),
        /* @__PURE__ */ jsx16("div", { className: "drum-fade" }),
        columns.map((col, ci) => /* @__PURE__ */ jsx16("div", { className: ["drum-col", col.narrow ? "drum-col-frac" : ""].filter(Boolean).join(" "), children: /* @__PURE__ */ jsx16(
          "div",
          {
            className: "drum-scroll",
            ref: (el) => {
              scrollRefs.current[ci] = el;
            },
            onScroll: () => handleScroll(ci),
            children: col.items.map((item, ii) => /* @__PURE__ */ jsx16("div", { className: "drum-item", children: item }, ii))
          }
        ) }, ci))
      ] }),
      columns.some((c) => c.label) && /* @__PURE__ */ jsx16("div", { className: "drum-lbl-row", children: columns.map((col, ci) => /* @__PURE__ */ jsx16("div", { className: "drum-col-lbl", children: col.label ?? "" }, ci)) })
    ] })
  ] });
}

// src/components/SettingsSheet.tsx
import { Fragment, jsx as jsx17, jsxs as jsxs12 } from "react/jsx-runtime";
function SettingsRow({ label, children, onClick }) {
  return /* @__PURE__ */ jsxs12("div", { className: "settings-row", onClick, children: [
    /* @__PURE__ */ jsx17("span", { className: "settings-row-label", children: label }),
    children
  ] });
}
function SettingsSection({ label, children }) {
  return /* @__PURE__ */ jsxs12(Fragment, { children: [
    /* @__PURE__ */ jsx17("div", { className: "settings-section-label", children: label }),
    children
  ] });
}
function SettingsSheet({ open, title = "Settings", onClose, children }) {
  return /* @__PURE__ */ jsxs12("div", { className: ["settings-sheet", open ? "open" : ""].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ jsx17("div", { className: "settings-backdrop", onClick: onClose }),
    /* @__PURE__ */ jsxs12("div", { className: "settings-panel", children: [
      /* @__PURE__ */ jsxs12("div", { className: "settings-panel-hdr", children: [
        /* @__PURE__ */ jsx17("span", { className: "settings-panel-title", children: title }),
        /* @__PURE__ */ jsx17("button", { className: "settings-done-btn", onClick: onClose, children: "Done" })
      ] }),
      /* @__PURE__ */ jsx17("div", { className: "settings-body", children })
    ] })
  ] });
}

// src/tokens.ts
var tokens = {
  bg: "var(--bg)",
  surface: "var(--surface)",
  surfaceRaised: "var(--surface-raised)",
  border: "var(--border)",
  accent: "var(--accent)",
  accent2: "var(--accent-2)",
  accentBlue: "var(--accent-blue)",
  text: "var(--text)",
  textMuted: "var(--text-muted)",
  textDim: "var(--text-dim)",
  radius: "var(--radius)",
  radiusSm: "var(--radius-sm)"
};
export {
  Badge,
  BottomNav,
  Button,
  Card,
  DrumPicker,
  ExerciseCard,
  FitTheme,
  IosToggle,
  ProgressBar,
  RestTimer,
  ScreenHeader,
  SegmentedControl,
  SetRow,
  SettingsRow,
  SettingsSection,
  SettingsSheet,
  StatStrip,
  StreakWeek,
  WorkoutHeader,
  tokens
};
