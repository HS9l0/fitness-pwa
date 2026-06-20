import { today, getFoodLog, addFoodEntry, removeFoodEntry, getSettings, saveSettings } from '../store.js';

const CIRC  = 314.16; // 2π × r50
const MODEL = 'gemini-1.5-flash';

function getKey() { return localStorage.getItem('fit_gemini_key') ?? ''; }
function setKey(k) { localStorage.setItem('fit_gemini_key', k.trim()); }
function nowTime() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function renderNutrition(container) {
  const date     = today();
  const log      = getFoodLog(date);
  const goal     = getSettings().calorieGoalKcal ?? 2000;
  const consumed = log.reduce((s, e) => s + (e.calories ?? 0), 0);
  const pct      = Math.min(1, consumed / goal);
  const offset   = CIRC * (1 - pct);
  const hasKey   = !!getKey();
  const over     = consumed > goal;
  const ringClr  = over ? '#e06040' : 'var(--accent)';

  container.innerHTML = `
    <div class="screen-header">
      <div class="badge">AI · Camera</div>
      <h1>Nutrition</h1>
      <p>Point your camera at food to log calories</p>
    </div>

    <div class="section">

      <div class="cal-ring-wrap">
        <svg class="cal-ring-svg" viewBox="0 0 120 120" aria-hidden="true">
          <circle class="cal-ring-bg" cx="60" cy="60" r="50"/>
          <circle class="cal-ring-fill" cx="60" cy="60" r="50"
            stroke-dasharray="${CIRC}" stroke-dashoffset="${offset}"
            style="stroke:${ringClr}" transform="rotate(-90 60 60)"/>
        </svg>
        <div class="cal-ring-text">
          <div class="cal-ring-num">${consumed.toLocaleString()}</div>
          <div class="cal-ring-sub">/ ${goal.toLocaleString()} kcal</div>
          <div class="cal-ring-lbl">${over ? 'over goal' : 'today'}</div>
        </div>
      </div>

      <div class="cal-meta-row">
        <div class="cal-meta-item">
          <span class="cal-meta-num" style="color:var(--accent-2)">${Math.max(0, goal - consumed).toLocaleString()}</span>
          <span class="cal-meta-lbl">remaining</span>
        </div>
        <div class="cal-meta-sep"></div>
        <div class="cal-meta-item">
          <span class="cal-meta-num">${log.length}</span>
          <span class="cal-meta-lbl">${log.length === 1 ? 'entry' : 'entries'}</span>
        </div>
        <div class="cal-meta-sep"></div>
        <div class="cal-meta-item">
          <span class="cal-meta-num" style="color:var(--text-muted)">${goal.toLocaleString()}</span>
          <span class="cal-meta-lbl">goal</span>
        </div>
      </div>

      <div class="nutri-actions">
        <button class="nutri-scan-btn" id="scan-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          Scan Food
        </button>
        <button class="nutri-manual-btn" id="manual-btn">✏️ Manual</button>
      </div>

      <input type="file" id="food-camera" accept="image/*" capture="environment" style="display:none"/>

      <div id="ai-result"></div>

      <div id="manual-form" class="card" style="display:none;margin-top:8px">
        <div class="section-title" style="margin-bottom:10px">Manual Entry</div>
        <input type="text" id="manual-name" placeholder="Food name (e.g. Chicken breast)" style="margin-bottom:8px"/>
        <input type="number" id="manual-cal" placeholder="Calories (kcal)" min="1" max="9999" style="margin-bottom:12px"/>
        <div style="display:flex;gap:8px">
          <button class="btn-primary" id="manual-submit" style="flex:1">Add to Log</button>
          <button id="manual-cancel" style="padding:0 16px;border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-muted)">Cancel</button>
        </div>
      </div>

      ${log.length ? `
        <div class="section-title" style="margin-top:20px">Today's Meals</div>
        <div class="food-log">
          ${log.map(e => `
            <div class="food-entry-card card">
              <div class="food-entry-main">
                <div class="food-entry-icon">${e.source === 'ai' ? '📸' : '✏️'}</div>
                <div class="food-entry-info">
                  <div class="food-entry-name">${e.name}</div>
                  <div class="food-entry-meta">${[e.portion, e.time].filter(Boolean).join(' · ')}</div>
                </div>
              </div>
              <div class="food-entry-right">
                <span class="food-entry-cal">${e.calories}</span>
                <span class="food-entry-unit">kcal</span>
                <button class="food-del-btn" data-id="${e.id}">×</button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="food-empty">
          <div class="food-empty-icon">🍽️</div>
          <div class="food-empty-text">No meals logged today</div>
          <div class="food-empty-sub">Scan food with your camera or tap Manual to start</div>
        </div>
      `}

      <details class="card nutri-settings" style="margin-top:20px" ${!hasKey ? 'open' : ''}>
        <summary class="nutri-settings-summary">⚙ Settings</summary>
        <div class="nutri-settings-body">
          <div class="ctrl-label-nut">Daily calorie goal</div>
          <div class="nutri-goal-row">
            <input type="number" id="goal-input" value="${goal}" min="500" max="10000" step="50"/>
            <button class="btn-ghost" id="save-goal-btn">Save</button>
          </div>
          <div class="ctrl-label-nut" style="margin-top:14px">Gemini AI API key</div>
          <input type="password" id="api-key-input" value="${getKey()}" placeholder="Paste your key here…" style="margin-bottom:6px"/>
          <div class="nutri-key-hint">
            Get a free key at <a href="https://aistudio.google.com" target="_blank" rel="noopener" style="color:var(--accent-blue)">aistudio.google.com</a> · stored on device only
          </div>
          <button class="btn-ghost" id="save-key-btn" style="margin-top:10px">Save key</button>
        </div>
      </details>

    </div>
  `;

  // ── Events ──────────────────────────────────────────────
  const scanBtn    = container.querySelector('#scan-btn');
  const cameraIn   = container.querySelector('#food-camera');
  const manualBtn  = container.querySelector('#manual-btn');
  const manualForm = container.querySelector('#manual-form');

  scanBtn.addEventListener('click', () => {
    if (!getKey()) {
      container.querySelector('.nutri-settings').setAttribute('open', '');
      container.querySelector('#api-key-input').focus();
      showToast(container, 'Enter your Gemini API key first');
      return;
    }
    cameraIn.click();
  });

  cameraIn.addEventListener('change', () => {
    const file = cameraIn.files[0];
    if (!file) return;
    handleScan(container, file, date);
    cameraIn.value = '';
  });

  manualBtn.addEventListener('click', () => {
    const shown = manualForm.style.display !== 'none';
    manualForm.style.display = shown ? 'none' : 'block';
    if (!shown) container.querySelector('#manual-name').focus();
  });

  container.querySelector('#manual-cancel').addEventListener('click', () => {
    manualForm.style.display = 'none';
  });

  container.querySelector('#manual-submit').addEventListener('click', () => {
    const name = container.querySelector('#manual-name').value.trim();
    const cal  = parseInt(container.querySelector('#manual-cal').value);
    if (!name || !(cal > 0)) return;
    addFoodEntry(date, { id: uid(), name, calories: cal, portion: '', time: nowTime(), source: 'manual' });
    renderNutrition(container);
  });

  container.querySelectorAll('.food-del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFoodEntry(date, btn.dataset.id);
      renderNutrition(container);
    });
  });

  container.querySelector('#save-goal-btn').addEventListener('click', () => {
    const val = parseInt(container.querySelector('#goal-input').value);
    if (val >= 500 && val <= 10000) { saveSettings({ calorieGoalKcal: val }); renderNutrition(container); }
  });

  container.querySelector('#save-key-btn').addEventListener('click', () => {
    const k = container.querySelector('#api-key-input').value.trim();
    setKey(k);
    showToast(container, k ? 'API key saved' : 'API key cleared');
  });
}

// ── AI scan ──────────────────────────────────────────────
async function handleScan(container, file, date) {
  const resultEl = container.querySelector('#ai-result');
  resultEl.innerHTML = `
    <div class="ai-loading card">
      <div class="ai-spinner"></div>
      <span class="ai-loading-txt">Analyzing your meal…</span>
    </div>
  `;
  try {
    const { base64, mimeType } = await compress(file);
    const analysis = await queryGemini(base64, mimeType, getKey());
    showAnalysis(container, resultEl, analysis, date);
  } catch (err) {
    resultEl.innerHTML = `
      <div class="card ai-error-card">
        <div class="ai-error-title">⚠️ Could not analyze</div>
        <div class="ai-error-msg">${err.message}</div>
        <button class="btn-ghost" style="margin-top:12px" id="ai-dismiss">Dismiss</button>
      </div>
    `;
    container.querySelector('#ai-dismiss').addEventListener('click', () => { resultEl.innerHTML = ''; });
  }
}

function showAnalysis(container, resultEl, analysis, date) {
  resultEl.innerHTML = `
    <div class="card ai-result-card">
      <div class="ai-result-hdr">📸 AI spotted ${analysis.foods.length} item${analysis.foods.length !== 1 ? 's' : ''}</div>
      <div class="ai-foods-list">
        ${analysis.foods.map((f, i) => `
          <div class="ai-food-row">
            <div class="ai-food-left">
              <input class="ai-food-name-inp" id="ai-name-${i}" value="${escHtml(f.name)}"/>
              <div class="ai-food-portion">${escHtml(f.portion)}</div>
            </div>
            <div class="ai-food-cal-wrap">
              <input class="ai-food-cal-inp" id="ai-cal-${i}" type="number" value="${f.calories}" min="0" max="9999"/>
              <span class="ai-food-unit">kcal</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="ai-result-total">
        Total estimate: <strong>${analysis.totalCalories}</strong> kcal
        <span class="ai-conf ai-conf-${analysis.confidence}">${analysis.confidence}</span>
      </div>
      <div class="ai-result-actions">
        <button class="btn-primary" id="ai-confirm" style="flex:1">Add to Log</button>
        <button id="ai-dismiss" style="padding:0 14px;border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-muted)">Dismiss</button>
      </div>
    </div>
  `;

  container.querySelector('#ai-confirm').addEventListener('click', () => {
    analysis.foods.forEach((f, i) => {
      const name = container.querySelector(`#ai-name-${i}`)?.value.trim() ?? f.name;
      const cal  = parseInt(container.querySelector(`#ai-cal-${i}`)?.value) || f.calories;
      if (!name || !(cal > 0)) return;
      addFoodEntry(date, { id: uid(), name, calories: cal, portion: f.portion, time: nowTime(), source: 'ai' });
    });
    renderNutrition(container);
  });

  container.querySelector('#ai-dismiss').addEventListener('click', () => { resultEl.innerHTML = ''; });
}

// ── Compress image before sending ───────────────────────
function compress(file) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1024;
      let [w, h] = [img.width, img.height];
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else       { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          URL.revokeObjectURL(img.src);
          resolve({ base64: reader.result.split(',')[1], mimeType: 'image/jpeg' });
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.82);
    };
    img.src = URL.createObjectURL(file);
  });
}

// ── Gemini API call ──────────────────────────────────────
async function queryGemini(base64, mimeType, key) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            { text: `You are a nutrition expert. Look at this food image and identify every food and drink item visible.

For each item estimate: its name, approximate portion size, and calories (kcal).
Be realistic — a standard home-cooked meal is usually 400–800 kcal total.

Respond with ONLY valid JSON (no markdown, no explanation):
{"foods":[{"name":"string","portion":"e.g. 1 cup (200g)","calories":300}],"totalCalories":600,"confidence":"high"}` }
          ]
        }],
        generationConfig: { temperature: 0.1 }
      })
    }
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg  = body.error?.message ?? `HTTP ${res.status}`;
    if (res.status === 400 || msg.toLowerCase().includes('api_key'))
      throw new Error('Invalid API key — check your key in Settings');
    if (res.status === 429)
      throw new Error('Rate limit hit — wait a moment and try again');
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No food detected in image');
  try { return JSON.parse(match[0]); }
  catch { throw new Error('Could not parse AI response'); }
}

// ── Utilities ────────────────────────────────────────────
function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

function escHtml(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(container, msg) {
  const el = document.createElement('div');
  el.className = 'nutri-toast';
  el.textContent = msg;
  container.appendChild(el);
  requestAnimationFrame(() => el.classList.add('nutri-toast-in'));
  setTimeout(() => {
    el.classList.remove('nutri-toast-in');
    setTimeout(() => el.remove(), 280);
  }, 2200);
}
