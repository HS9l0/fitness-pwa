import { auth, db } from './firebase.js';
import {
  signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  collection, getDocs, deleteDoc, doc, updateDoc, writeBatch
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const BASE_ADMINS = ['lusi.genova@gmail.com', 'ranov.insta@gmail.com'];
const DAY_LABELS  = { 1: 'Cardio', 2: 'Legs', 3: 'Arms' };

function getAdminEmails() {
  try {
    const s = JSON.parse(localStorage.getItem('fit_admin_emails') ?? 'null');
    return Array.isArray(s) && s.length ? s : [...BASE_ADMINS];
  } catch { return [...BASE_ADMINS]; }
}
function saveAdminEmails(list) {
  localStorage.setItem('fit_admin_emails', JSON.stringify(list));
}
const STATUS_META  = {
  active:   { label: 'Active',   color: '#22c55e' },
  flagged:  { label: 'Flagged',  color: '#e94560' },
  inactive: { label: 'Inactive', color: '#7a8299' }
};

const loadingEl = document.getElementById('auth-loading');
const adminEl   = document.getElementById('admin-screen');
const mainEl    = document.getElementById('main-content');
const loadEl    = document.getElementById('loading');

document.getElementById('signout-btn').addEventListener('click', () => signOut(auth));

// ── Auth gate ─────────────────────────────────────────────
onAuthStateChanged(auth, user => {
  loadingEl.style.display = 'none';
  if (!user || !getAdminEmails().includes(user.email)) {
    window.location.href = './index.html';
    return;
  }
  adminEl.style.display = 'flex';
  document.getElementById('admin-user').textContent = user.displayName ?? user.email;
  loadAndRender();
});

// ── Utilities ─────────────────────────────────────────────
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('toast-show'));
  setTimeout(() => { el.classList.remove('toast-show'); setTimeout(() => el.remove(), 300); }, 2500);
}

function confirmDialog(msg, danger = false) {
  return new Promise(resolve => {
    const ov = document.createElement('div');
    ov.className = 'modal-overlay';
    ov.innerHTML = `
      <div class="modal">
        <p class="modal-msg">${msg}</p>
        <div class="modal-btns">
          <button class="modal-cancel">Cancel</button>
          <button class="modal-ok${danger ? ' modal-danger' : ''}">${danger ? 'Delete' : 'OK'}</button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    ov.querySelector('.modal-cancel').onclick = () => { ov.remove(); resolve(false); };
    ov.querySelector('.modal-ok').onclick     = () => { ov.remove(); resolve(true); };
  });
}

function exportJSON(user) {
  const data = {
    profile: { uid: user.uid, email: user.email, displayName: user.displayName, lastSeen: user.lastSeen },
    sessions: user.sessions,
    water: user.water,
    exportedAt: new Date().toISOString()
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = `fitplan-${(user.email ?? user.uid).replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
}

function calcStreak(sessions) {
  const dates = new Set(sessions.map(s => s.date));
  let streak = 0;
  const d = new Date();
  const today = d.toISOString().slice(0, 10);
  if (!dates.has(today)) d.setDate(d.getDate() - 1);
  while (dates.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function favDay(sessions) {
  if (!sessions.length) return '—';
  const c = {};
  sessions.forEach(s => { c[s.day] = (c[s.day] ?? 0) + 1; });
  const top = Object.entries(c).sort(([, a], [, b]) => b - a)[0];
  return DAY_LABELS[top[0]] ?? '—';
}

function totalTime(sessions) {
  const m = sessions.reduce((s, x) => s + (x.durationMin ?? 0), 0);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

function statusBadge(status) {
  const s = STATUS_META[status] ?? STATUS_META.active;
  return `<span class="status-badge" style="background:${s.color}22;color:${s.color};border-color:${s.color}55">${s.label}</span>`;
}

// ── Data loading ──────────────────────────────────────────
async function loadAndRender() {
  loadEl.style.display = 'block';
  mainEl.innerHTML = '';
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    const users = await Promise.all(usersSnap.docs.map(async d => {
      const [sessSnap, waterSnap] = await Promise.all([
        getDocs(collection(db, 'users', d.id, 'sessions')),
        getDocs(collection(db, 'users', d.id, 'water'))
      ]);
      const sessions = sessSnap.docs.map(s => s.data())
        .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
      const water = {};
      waterSnap.docs.forEach(w => { water[w.id] = w.data().ml ?? 0; });
      return { uid: d.id, ...d.data(), sessions, water };
    }));
    users.sort((a, b) => (b.lastSeen ?? '').localeCompare(a.lastSeen ?? ''));
    loadEl.style.display = 'none';
    window._adminUsers = users;
    renderUserList(users);
  } catch (e) {
    loadEl.style.display = 'none';
    if (e.code === 'permission-denied') showRulesError();
    else mainEl.innerHTML = `<div class="card"><p style="color:var(--accent)">⚠ ${e.message}</p></div>`;
  }
}

function showRulesError() {
  const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
        request.auth.token.email in [
          'lusi.genova@gmail.com',
          'ranov.insta@gmail.com'
        ];
    }
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid || isAdmin();
      match /sessions/{id} {
        allow read, write: if request.auth.uid == uid || isAdmin();
      }
      match /water/{id} {
        allow read, write: if request.auth.uid == uid || isAdmin();
      }
    }
  }
}`;
  mainEl.innerHTML = `
    <div class="card rules-card">
      <div class="rules-icon">🔒</div>
      <h3>One more step — update Firestore rules</h3>
      <p class="muted">Copy these rules into Firebase Console → Firestore → Rules → Publish.</p>
      <ol class="steps">
        <li>Go to <a href="https://console.firebase.google.com" target="_blank">console.firebase.google.com</a></li>
        <li>Select project <strong>fitness-pwa-5af52</strong></li>
        <li>Left menu → <strong>Firestore Database</strong> → <strong>Rules</strong></li>
        <li>Replace everything, click <strong>Publish</strong></li>
      </ol>
      <div class="rules-wrap">
        <pre class="rules-pre">${rules}</pre>
        <button class="copy-btn" id="copy-btn">Copy</button>
      </div>
      <button class="retry-btn" id="retry-btn">Retry →</button>
    </div>`;
  document.getElementById('copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(rules).then(() => {
      const b = document.getElementById('copy-btn');
      b.textContent = '✓ Copied';
      setTimeout(() => { b.textContent = 'Copy'; }, 2000);
    });
  });
  document.getElementById('retry-btn').addEventListener('click', loadAndRender);
}

// ── User list ─────────────────────────────────────────────
function renderUserList(users) {
  const totalSessions = users.reduce((n, u) => n + u.sessions.length, 0);
  const today   = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  const activeToday = users.filter(u => u.sessions.some(s => s.date === today)).length;
  const activeWeek  = users.filter(u => u.sessions.some(s => s.date >= weekAgo)).length;

  mainEl.innerHTML = `
    <div class="stats-row">
      <div class="stat-card"><div class="stat-num">${users.length}</div><div class="stat-lbl">Users</div></div>
      <div class="stat-card"><div class="stat-num">${totalSessions}</div><div class="stat-lbl">Sessions</div></div>
      <div class="stat-card"><div class="stat-num">${activeToday}</div><div class="stat-lbl">Active Today</div></div>
      <div class="stat-card"><div class="stat-num">${activeWeek}</div><div class="stat-lbl">Active This Week</div></div>
    </div>

    <div class="list-controls">
      <input id="search" class="search-input" type="text" placeholder="Search by name or email…" />
      <button class="refresh-btn" id="refresh-btn">↻ Refresh</button>
    </div>

    <div class="card">
      ${users.length === 0
        ? `<p class="empty">No users yet — they appear after signing into the app.</p>`
        : `<table class="user-table">
            <thead>
              <tr><th>User</th><th>Status</th><th>Sessions</th><th>Streak</th><th>Last Seen</th><th></th></tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr class="user-row" data-name="${(u.displayName ?? '').toLowerCase()}" data-email="${(u.email ?? '').toLowerCase()}">
                  <td>
                    <div class="user-cell">
                      ${u.photoURL
                        ? `<img src="${u.photoURL}" class="avatar" onerror="this.style.display='none'" />`
                        : `<div class="avatar-ph">${(u.displayName ?? u.email ?? '?')[0].toUpperCase()}</div>`}
                      <div>
                        <div class="user-name">${u.displayName ?? 'Unknown'}</div>
                        <div class="user-email">${u.email ?? u.uid.slice(0, 16) + '…'}</div>
                      </div>
                    </div>
                  </td>
                  <td>${statusBadge(u.status)}</td>
                  <td class="tc">${u.sessions.length}</td>
                  <td class="tc">${calcStreak(u.sessions)} 🔥</td>
                  <td class="tc">${u.lastSeen ? u.lastSeen.slice(0, 10) : '—'}</td>
                  <td class="tc"><button class="view-btn" data-uid="${u.uid}">View →</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>`}
    </div>

    ${renderAdminPanel()}
    ${renderSettingsPanel()}`;

  document.getElementById('search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.user-row').forEach(row => {
      row.style.display = (row.dataset.name.includes(q) || row.dataset.email.includes(q)) ? '' : 'none';
    });
  });
  document.getElementById('refresh-btn').addEventListener('click', loadAndRender);
  mainEl.querySelectorAll('.view-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      const u = users.find(x => x.uid === btn.dataset.uid);
      if (u) renderUserDetail(u);
    })
  );

  document.getElementById('save-settings-btn').addEventListener('click', () => {
    const cal  = parseInt(document.getElementById('s-calorie-goal').value) || 2000;
    const wat  = parseInt(document.getElementById('s-water-goal').value)   || 2000;
    const unit = document.querySelector('input[name="weight-unit"]:checked')?.value ?? 'kg';
    let cfg = {};
    try { cfg = JSON.parse(localStorage.getItem('fit_settings') ?? '{}'); } catch {}
    cfg.calorieGoalKcal = cal;
    cfg.waterGoalMl     = wat;
    cfg.weightUnit      = unit;
    localStorage.setItem('fit_settings', JSON.stringify(cfg));
    const savedEl = document.getElementById('settings-saved-msg');
    if (savedEl) { savedEl.style.opacity = '1'; setTimeout(() => { savedEl.style.opacity = '0'; }, 2200); }
    toast('Settings saved');
  });

  // ── Admin adder events ───────────────────────────────────
  document.getElementById('add-admin-btn').addEventListener('click', () => {
    const input = document.getElementById('new-admin-email');
    const email = input.value.trim().toLowerCase();
    if (!email || !email.includes('@')) { toast('Enter a valid email', 'error'); return; }
    const list = getAdminEmails();
    if (list.includes(email)) { toast('Already an admin', 'error'); return; }
    list.push(email);
    saveAdminEmails(list);
    input.value = '';
    toast(`${email} added as admin`);
    renderUserList(window._adminUsers);
  });

  mainEl.querySelectorAll('.remove-admin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.dataset.email;
      const list  = getAdminEmails().filter(e => e !== email);
      if (!list.length) { toast('Cannot remove the only admin', 'error'); return; }
      saveAdminEmails(list);
      toast(`${email} removed`);
      renderUserList(window._adminUsers);
    });
  });
}

function renderAdminPanel() {
  const admins = getAdminEmails();
  const me     = auth.currentUser?.email ?? '';
  return `
    <h3 class="sec-title" style="margin-top:28px">Admin Access</h3>
    <div class="card">
      <div class="admin-emails-list">
        ${admins.map(email => `
          <div class="admin-email-row">
            <div class="admin-email-info">
              <span class="admin-email-addr">${email}</span>
              ${email === me ? '<span class="admin-you-badge">you</span>' : ''}
            </div>
            ${email === me
              ? '<span class="muted" style="font-size:0.72rem">cannot remove self</span>'
              : `<button class="action-btn action-danger remove-admin-btn" data-email="${email}" style="padding:4px 10px;font-size:0.72rem">Remove</button>`}
          </div>
        `).join('')}
      </div>
      <div class="add-admin-row">
        <input id="new-admin-email" class="ctrl-input" type="email" placeholder="Email address to add as admin…" style="flex:1"/>
        <button class="action-btn" id="add-admin-btn">Add Admin</button>
      </div>
      <p style="font-size:0.68rem;color:var(--text-dim);margin-top:10px">
        ⚠ Admins can view, edit, and delete all user data from this dashboard.
      </p>
    </div>
  `;
}

function renderSettingsPanel() {
  let cfg    = {};
  try { cfg = JSON.parse(localStorage.getItem('fit_settings') ?? '{}'); } catch {}
  const cal  = cfg.calorieGoalKcal ?? 2000;
  const wat  = cfg.waterGoalMl     ?? 2000;
  const unit = cfg.weightUnit       ?? 'kg';

  return `
    <h3 class="sec-title" style="margin-top:28px">App Settings</h3>
    <div class="card">
      <div class="settings-grid">
        <div class="ctrl-group">
          <label class="ctrl-label">Daily calorie goal (kcal)</label>
          <input id="s-calorie-goal" class="ctrl-input" type="number" value="${cal}" min="500" max="10000" step="50"/>
        </div>
        <div class="ctrl-group">
          <label class="ctrl-label">Daily water goal (ml)</label>
          <input id="s-water-goal" class="ctrl-input" type="number" value="${wat}" min="500" max="5000" step="100"/>
        </div>
        <div class="ctrl-group">
          <label class="ctrl-label">Weight unit</label>
          <div class="unit-toggle">
            <label class="unit-opt"><input type="radio" name="weight-unit" value="kg"  ${unit === 'kg'  ? 'checked' : ''}/> kg</label>
            <label class="unit-opt"><input type="radio" name="weight-unit" value="lbs" ${unit === 'lbs' ? 'checked' : ''}/> lbs</label>
          </div>
        </div>
      </div>
      <div style="margin-top:18px;display:flex;align-items:center;gap:12px">
        <button class="action-btn" id="save-settings-btn">Save settings</button>
        <span id="settings-saved-msg" style="font-size:0.75rem;color:var(--accent-2);opacity:0;transition:opacity 0.3s">✓ Saved</span>
      </div>
    </div>
  `;
}

// ── User detail ───────────────────────────────────────────
function renderUserDetail(user) {
  const waterEntries = Object.entries(user.water).sort(([a], [b]) => b.localeCompare(a)).slice(0, 30);
  const totalWater   = Object.values(user.water).reduce((s, v) => s + v, 0);
  const avgWater     = waterEntries.length ? Math.round(totalWater / waterEntries.length) : 0;

  mainEl.innerHTML = `
    <button class="back-btn" id="back-btn">← All Users</button>

    <div class="card profile-card">
      ${user.photoURL
        ? `<img src="${user.photoURL}" class="avatar-lg" onerror="this.style.display='none'" />`
        : `<div class="avatar-ph avatar-lg-ph">${(user.displayName ?? user.email ?? '?')[0].toUpperCase()}</div>`}
      <div class="profile-info">
        <div class="profile-name-row">
          <h2 class="profile-name">${user.displayName ?? 'Unknown'}</h2>
          ${statusBadge(user.status)}
        </div>
        <div class="user-email">${user.email ?? '—'}</div>
        <div class="muted">Last seen: ${user.lastSeen ? new Date(user.lastSeen).toLocaleString() : 'never'}</div>
        <code class="uid-text">${user.uid}</code>
      </div>
      <div class="profile-actions">
        <button class="action-btn" id="export-btn">📥 Export</button>
        <button class="action-btn action-danger" id="delete-all-btn">🗑 Delete All</button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card"><div class="stat-num">${user.sessions.length}</div><div class="stat-lbl">Workouts</div></div>
      <div class="stat-card"><div class="stat-num">${calcStreak(user.sessions)}</div><div class="stat-lbl">Streak 🔥</div></div>
      <div class="stat-card"><div class="stat-num">${totalTime(user.sessions)}</div><div class="stat-lbl">Total Time</div></div>
      <div class="stat-card"><div class="stat-num">${favDay(user.sessions)}</div><div class="stat-lbl">Fav Day</div></div>
      <div class="stat-card"><div class="stat-num">${avgWater}</div><div class="stat-lbl">Avg ml/day</div></div>
      <div class="stat-card"><div class="stat-num">${waterEntries.length}</div><div class="stat-lbl">Water Days</div></div>
    </div>

    <div class="card">
      <div class="ctrl-row">
        <div class="ctrl-group">
          <label class="ctrl-label">Status</label>
          <select class="ctrl-select" id="status-select">
            <option value="active"   ${(user.status ?? 'active') === 'active'   ? 'selected' : ''}>Active</option>
            <option value="inactive" ${(user.status ?? '')       === 'inactive' ? 'selected' : ''}>Inactive</option>
            <option value="flagged"  ${(user.status ?? '')       === 'flagged'  ? 'selected' : ''}>Flagged</option>
          </select>
        </div>
        <div class="ctrl-group ctrl-group-grow">
          <label class="ctrl-label">Admin note</label>
          <input id="note-input" class="ctrl-input" type="text" placeholder="Private note about this user…" value="${user.note ?? ''}" />
        </div>
        <button class="action-btn" id="save-meta-btn">Save</button>
      </div>
    </div>

    <h3 class="sec-title">Workout Sessions (${user.sessions.length})</h3>
    <div id="sessions-list">
      ${user.sessions.length === 0
        ? '<p class="empty">No sessions logged yet.</p>'
        : user.sessions.map(s => renderSessionCard(s)).join('')}
    </div>

    <h3 class="sec-title">Water Intake (last 30 days)</h3>
    <div id="water-section">${renderWaterTable(user.water)}</div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => renderUserList(window._adminUsers));
  document.getElementById('export-btn').addEventListener('click', () => exportJSON(user));

  document.getElementById('save-meta-btn').addEventListener('click', async () => {
    const status = document.getElementById('status-select').value;
    const note   = document.getElementById('note-input').value.trim();
    try {
      await updateDoc(doc(db, 'users', user.uid), { status, note });
      user.status = status;
      user.note   = note;
      const cached = window._adminUsers?.find(u => u.uid === user.uid);
      if (cached) { cached.status = status; cached.note = note; }
      toast('Saved');
      mainEl.querySelectorAll('.status-badge').forEach(el => {
        const s = STATUS_META[status] ?? STATUS_META.active;
        el.textContent   = s.label;
        el.style.background  = s.color + '22';
        el.style.color       = s.color;
        el.style.borderColor = s.color + '55';
      });
    } catch (e) { toast(e.message, 'error'); }
  });

  document.getElementById('delete-all-btn').addEventListener('click', async () => {
    const ok = await confirmDialog(
      `Delete ALL workouts and water data for <strong>${user.displayName ?? user.email}</strong>? This cannot be undone.`, true
    );
    if (!ok) return;
    try {
      const batch = writeBatch(db);
      const [ss, ws] = await Promise.all([
        getDocs(collection(db, 'users', user.uid, 'sessions')),
        getDocs(collection(db, 'users', user.uid, 'water'))
      ]);
      ss.docs.forEach(d => batch.delete(d.ref));
      ws.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();
      user.sessions = [];
      user.water    = {};
      const cached = window._adminUsers?.find(u => u.uid === user.uid);
      if (cached) { cached.sessions = []; cached.water = {}; }
      toast('All data deleted');
      renderUserDetail(user);
    } catch (e) { toast(e.message, 'error'); }
  });

  mainEl.querySelectorAll('.delete-session-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const ok = await confirmDialog('Delete this session?', true);
      if (!ok) return;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'sessions', id));
        user.sessions = user.sessions.filter(s => `${s.date}-${s.day}` !== id);
        const cached = window._adminUsers?.find(u => u.uid === user.uid);
        if (cached) cached.sessions = user.sessions;
        toast('Session deleted');
        renderUserDetail(user);
      } catch (e) { toast(e.message, 'error'); }
    });
  });

  mainEl.querySelectorAll('.delete-water-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const date = btn.dataset.date;
      const ok = await confirmDialog(`Delete water entry for ${date}?`, true);
      if (!ok) return;
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'water', date));
        delete user.water[date];
        const cached = window._adminUsers?.find(u => u.uid === user.uid);
        if (cached) cached.water = user.water;
        toast('Entry deleted');
        renderUserDetail(user);
      } catch (e) { toast(e.message, 'error'); }
    });
  });
}

// ── Renderers ─────────────────────────────────────────────
function renderSessionCard(s) {
  const id  = `${s.date}-${s.day}`;
  const exs = s.exercises ?? [];
  return `
    <div class="card session-card">
      <div class="sess-header">
        <div class="sess-title">
          <span class="day-badge">Day ${s.day}</span>
          <span class="sess-name">${DAY_LABELS[s.day] ?? 'Workout'}</span>
        </div>
        <div class="sess-meta">
          <span class="muted">${s.date} · ${s.durationMin ?? '?'} min</span>
          <button class="icon-btn delete-session-btn" data-id="${id}" title="Delete session">🗑</button>
        </div>
      </div>
      ${exs.map(ex => {
        const done = (ex.sets ?? []).filter(st => st.done);
        return `<div class="ex-row">
          <span class="ex-name">${ex.name}</span>
          <span class="ex-sets">
            ${done.length === 0
              ? '<em class="muted">skipped</em>'
              : done.map(st => ex.isCardio
                  ? `<span class="set-pill">${st.note || 'done'}</span>`
                  : `<span class="set-pill">${st.weight ?? '?'} kg × ${st.reps ?? '?'}</span>`
                ).join('')}
          </span>
        </div>`;
      }).join('')}
    </div>`;
}

function renderWaterTable(water) {
  const entries = Object.entries(water).sort(([a], [b]) => b.localeCompare(a)).slice(0, 30);
  if (!entries.length) return '<p class="empty">No water data yet.</p>';
  return `<div class="card">
    <table class="water-table">
      <thead><tr><th>Date</th><th>Amount</th><th>vs 2 L goal</th><th></th></tr></thead>
      <tbody>
        ${entries.map(([date, ml]) => {
          const pct   = Math.min(100, Math.round((ml / 2000) * 100));
          const color = pct >= 100 ? '#22c55e' : pct >= 50 ? '#3d8ef8' : '#e94560';
          return `<tr>
            <td>${date}</td>
            <td>${ml} ml</td>
            <td>
              <div class="progress-wrap">
                <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${color}"></div></div>
                <span class="progress-pct" style="color:${color}">${pct}%</span>
              </div>
            </td>
            <td><button class="icon-btn delete-water-btn" data-date="${date}" title="Delete">🗑</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}
