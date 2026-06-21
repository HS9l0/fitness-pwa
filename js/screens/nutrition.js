import { today, getFoodLog, addFoodEntry, removeFoodEntry, getSettings } from '../store.js';

const CIRC  = 314.16; // 2π × r50
const MODEL = 'gemini-2.0-flash';

function getKey() { return localStorage.getItem('fit_gemini_key') ?? ''; }
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
          AI Scan
        </button>
        <button class="nutri-barcode-btn" id="barcode-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M3 5v14M7 5v14M11 5v14M15 5v8M19 5v8M15 17v2M19 17v2M3 3h4M17 3h4M3 21h4"/>
          </svg>
          Barcode
        </button>
        <button class="nutri-manual-btn" id="manual-btn">✏️</button>
      </div>

      <input type="file" id="food-camera"    accept="image/*" capture="environment" style="display:none"/>
      <input type="file" id="barcode-camera" accept="image/*" capture="environment" style="display:none"/>

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

      ${!hasKey ? `
        <div class="nutri-setup-notice">
          <div class="nutri-setup-title">Setup required</div>
          <div class="nutri-setup-body">
            Add your Gemini API key and calorie goal in the
            <a href="./admin.html" style="color:var(--accent-blue)">admin dashboard</a>
            to enable AI food scanning.
          </div>
        </div>
      ` : ''}

    </div>
  `;

  // ── Events ──────────────────────────────────────────────
  const scanBtn     = container.querySelector('#scan-btn');
  const cameraIn    = container.querySelector('#food-camera');
  const barcodeBtn  = container.querySelector('#barcode-btn');
  const barcodeIn   = container.querySelector('#barcode-camera');
  const manualBtn   = container.querySelector('#manual-btn');
  const manualForm  = container.querySelector('#manual-form');

  scanBtn.addEventListener('click', () => {
    if (!getKey()) {
      container.querySelector('.nutri-setup-notice')?.scrollIntoView({ behavior: 'smooth' });
      showToast(container, 'Set up your API key in the admin dashboard');
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

  barcodeBtn.addEventListener('click', () => { barcodeIn.click(); });
  barcodeIn.addEventListener('change', () => {
    const file = barcodeIn.files[0];
    if (!file) return;
    handleBarcode(container, file, date);
    barcodeIn.value = '';
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
}

// ── Barcode scan ─────────────────────────────────────────
async function handleBarcode(container, file, date) {
  const resultEl = container.querySelector('#ai-result');
  resultEl.innerHTML = `<div class="ai-loading card"><div class="ai-spinner"></div><span class="ai-loading-txt">Reading barcode…</span></div>`;

  try {
    let code = null;

    if ('BarcodeDetector' in window) {
      const bitmap   = await createImageBitmap(file);
      const detector = new BarcodeDetector({ formats: ['ean_13','ean_8','upc_a','upc_e','code_128','code_39'] });
      const results  = await detector.detect(bitmap);
      if (results.length) code = results[0].rawValue;
    }

    if (!code) {
      resultEl.innerHTML = `
        <div class="card">
          <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:10px">Enter barcode manually:</div>
          <div style="display:flex;gap:8px">
            <input type="number" id="manual-barcode" placeholder="e.g. 5000112548167" style="flex:1"/>
            <button class="btn-primary" id="lookup-bc" style="width:auto;padding:10px 14px">Look up</button>
          </div>
        </div>`;
      container.querySelector('#lookup-bc').addEventListener('click', async () => {
        const val = container.querySelector('#manual-barcode').value.trim();
        if (val.length < 6) return;
        await lookupBarcode(container, resultEl, val, date);
      });
      return;
    }

    await lookupBarcode(container, resultEl, code, date);
  } catch (err) {
    resultEl.innerHTML = `<div class="card ai-error-card"><div class="ai-error-title">⚠️ Error</div><div class="ai-error-msg">${err.message}</div><button class="btn-ghost" style="margin-top:10px" id="ai-dismiss">Dismiss</button></div>`;
    container.querySelector('#ai-dismiss').addEventListener('click', () => { resultEl.innerHTML = ''; });
  }
}

async function lookupBarcode(container, resultEl, code, date) {
  resultEl.innerHTML = `<div class="ai-loading card"><div class="ai-spinner"></div><span class="ai-loading-txt">Looking up ${code}…</span></div>`;
  const res  = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
  const data = await res.json();

  if (data.status === 0 || !data.product) {
    resultEl.innerHTML = `<div class="card ai-error-card"><div class="ai-error-title">⚠️ Not found</div><div class="ai-error-msg">Barcode ${code} not found. Try manual entry.</div><button class="btn-ghost" style="margin-top:10px" id="ai-dismiss">Dismiss</button></div>`;
    container.querySelector('#ai-dismiss').addEventListener('click', () => { resultEl.innerHTML = ''; });
    return;
  }

  const p          = data.product;
  const name       = p.product_name || p.abbreviated_product_name || 'Unknown product';
  const cal100     = p.nutriments?.['energy-kcal_100g'];
  const calServing = p.nutriments?.['energy-kcal_serving'];
  const servingQty = parseFloat(p.serving_quantity) || 100;
  const serving    = p.serving_size || '100 g';
  const calories   = calServing != null ? Math.round(calServing)
                   : cal100     != null ? Math.round(cal100 * servingQty / 100)
                   : 0;

  resultEl.innerHTML = `
    <div class="card ai-result-card">
      <div class="ai-result-hdr">🔍 Product found</div>
      <div class="ai-foods-list">
        <div class="ai-food-row">
          <div class="ai-food-left">
            <input class="ai-food-name-inp" id="bc-name" value="${escHtml(name)}"/>
            <div class="ai-food-portion">${escHtml(serving)}</div>
          </div>
          <div class="ai-food-cal-wrap">
            <input class="ai-food-cal-inp" id="bc-cal" type="number" value="${calories}" min="0" max="9999"/>
            <span class="ai-food-unit">kcal</span>
          </div>
        </div>
      </div>
      <div class="ai-result-actions">
        <button class="btn-primary" id="bc-confirm" style="flex:1">Add to Log</button>
        <button id="bc-dismiss" style="padding:0 14px;border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-muted)">Dismiss</button>
      </div>
    </div>`;

  container.querySelector('#bc-confirm').addEventListener('click', () => {
    const n = container.querySelector('#bc-name').value.trim();
    const c = parseInt(container.querySelector('#bc-cal').value) || 0;
    if (!n) return;
    addFoodEntry(date, { id: uid(), name: n, calories: c, portion: serving, time: nowTime(), source: 'barcode' });
    renderNutrition(container);
  });
  container.querySelector('#bc-dismiss').addEventListener('click', () => { resultEl.innerHTML = ''; });
}

// ── AI scan ──────────────────────────────────────────────
async function handleScan(container, file, date) {
  const resultEl = container.querySelector('#ai-result');
  resultEl.innerHTML = `<div class="ai-loading card"><div class="ai-spinner"></div><span class="ai-loading-txt">Analyzing your meal…</span></div>`;
  try {
    const { base64, mimeType } = await compress(file);
    const analysis = await queryGeminiWithRetry(base64, mimeType, getKey(), resultEl);
    showAnalysis(container, resultEl, analysis, date);
  } catch (err) {
    resultEl.innerHTML = `
      <div class="card ai-error-card">
        <div class="ai-error-title">⚠️ Could not analyze</div>
        <div class="ai-error-msg">${err.message}</div>
        <button class="btn-ghost" style="margin-top:12px" id="ai-dismiss">Dismiss</button>
      </div>`;
    container.querySelector('#ai-dismiss').addEventListener('click', () => { resultEl.innerHTML = ''; });
  }
}

async function queryGeminiWithRetry(base64, mimeType, key, resultEl, attempt = 0) {
  try {
    return await queryGemini(base64, mimeType, key);
  } catch (err) {
    if (err.retryAfter && attempt < 2) {
      await countdown(resultEl, err.retryAfter);
      resultEl.innerHTML = `<div class="ai-loading card"><div class="ai-spinner"></div><span class="ai-loading-txt">Retrying…</span></div>`;
      return queryGeminiWithRetry(base64, mimeType, key, resultEl, attempt + 1);
    }
    throw err;
  }
}

function countdown(resultEl, seconds) {
  return new Promise(resolve => {
    let remaining = seconds;
    const render = () => {
      resultEl.innerHTML = `
        <div class="ai-loading card">
          <div class="ai-retry-ring">
            <svg viewBox="0 0 36 36" width="40" height="40">
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--surface-raised)" stroke-width="3"/>
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--accent)" stroke-width="3"
                stroke-dasharray="${(2*Math.PI*14).toFixed(1)}"
                stroke-dashoffset="${(2*Math.PI*14*(1-remaining/seconds)).toFixed(1)}"
                transform="rotate(-90 18 18)" stroke-linecap="round"/>
            </svg>
            <span class="ai-retry-count">${remaining}</span>
          </div>
          <span class="ai-loading-txt">Rate limit — retrying in ${remaining}s</span>
        </div>`;
    };
    render();
    const iv = setInterval(() => {
      remaining--;
      if (remaining <= 0) { clearInterval(iv); resolve(); return; }
      render();
    }, 1000);
  });
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
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error('Could not load image')); };
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
        if (!blob) { reject(new Error('Image compression failed')); return; }
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read image'));
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
    if (res.status === 401 || msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('api_key'))
      throw new Error('Invalid API key — check your key in the admin dashboard');
    if (res.status === 429) {
      const retryDelay = body.error?.details?.find(d => d.retryDelay)?.retryDelay;
      const seconds = retryDelay ? Math.ceil(parseInt(retryDelay)) : 30;
      const err = new Error(`Rate limit — retrying in ${seconds}s`);
      err.retryAfter = seconds;
      throw err;
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  // Strip markdown code fences if present
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No food detected in image — try a clearer photo');
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
