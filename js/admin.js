import { auth, db } from './firebase.js';
import {
  signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  collection, getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const ADMIN_EMAILS = ['lusi.genova@gmail.com', 'ranov.insta@gmail.com'];
const DAY_LABELS   = { 1: 'Cardio', 2: 'Legs', 3: 'Arms' };

const authEl  = document.getElementById('auth-screen');
const denyEl  = document.getElementById('deny-screen');
const adminEl = document.getElementById('admin-screen');
const mainEl  = document.getElementById('main-content');
const loadEl  = document.getElementById('loading');

function show(el) { el.style.display = 'flex'; }
function hide(el) { el.style.display = 'none'; }

document.getElementById('google-btn').addEventListener('click', () =>
  signInWithPopup(auth, new GoogleAuthProvider()).catch(e => alert(e.message))
);
document.getElementById('signout-btn').addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, async user => {
  if (!user) { show(authEl); hide(denyEl); hide(adminEl); return; }
  hide(authEl);
  if (!ADMIN_EMAILS.includes(user.email)) {
    show(denyEl); hide(adminEl);
    document.getElementById('deny-email').textContent = user.email;
    return;
  }
  hide(denyEl); show(adminEl);
  document.getElementById('admin-user').textContent = user.displayName ?? user.email;
  loadAndRender();
});

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
    renderUserList(users);
  } catch (e) {
    loadEl.innerHTML = `<span style="color:#e94560">⚠ ${e.message}</span>`;
  }
}

/* ── User list ─────────────────────────────────────────── */
function renderUserList(users) {
  const totalSessions = users.reduce((n, u) => n + u.sessions.length, 0);
  const today         = new Date().toISOString().slice(0, 10);
  const weekAgo       = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  const activeToday   = users.filter(u => u.sessions.some(s => s.date === today)).length;
  const activeWeek    = users.filter(u => u.sessions.some(s => s.date >= weekAgo)).length;

  mainEl.innerHTML = `
    <div class="stats-row">
      <div class="stat-card"><div class="stat-num">${users.length}</div><div class="stat-lbl">Users</div></div>
      <div class="stat-card"><div class="stat-num">${totalSessions}</div><div class="stat-lbl">Total Sessions</div></div>
      <div class="stat-card"><div class="stat-num">${activeToday}</div><div class="stat-lbl">Active Today</div></div>
      <div class="stat-card"><div class="stat-num">${activeWeek}</div><div class="stat-lbl">Active This Week</div></div>
    </div>

    <div class="card">
      ${users.length === 0
        ? `<p class="empty">No users yet — users appear here after they sign in to the app at least once.</p>`
        : `<table class="user-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Sessions</th>
                <th>Last Workout</th>
                <th>Water Days</th>
                <th>Last Seen</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
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
                  <td class="tc">${u.sessions.length}</td>
                  <td class="tc">${u.sessions[0]?.date ?? '—'}</td>
                  <td class="tc">${Object.keys(u.water).length}</td>
                  <td class="tc">${u.lastSeen ? u.lastSeen.slice(0, 10) : '—'}</td>
                  <td class="tc"><button class="view-btn" data-uid="${u.uid}">View →</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>`}
    </div>
  `;

  window._adminUsers = users;
  mainEl.querySelectorAll('.view-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      const u = users.find(x => x.uid === btn.dataset.uid);
      if (u) renderUserDetail(u);
    })
  );
}

/* ── User detail ───────────────────────────────────────── */
function renderUserDetail(user) {
  const waterDays  = Object.keys(user.water).length;
  const totalWater = Object.values(user.water).reduce((s, v) => s + v, 0);
  const avgWater   = waterDays ? Math.round(totalWater / waterDays) : 0;
  const lastSess   = user.sessions[0];

  mainEl.innerHTML = `
    <button class="back-btn" id="back-btn">← All Users</button>

    <div class="card profile-card">
      ${user.photoURL
        ? `<img src="${user.photoURL}" class="avatar-lg" onerror="this.style.display='none'" />`
        : `<div class="avatar-ph avatar-lg-ph">${(user.displayName ?? user.email ?? '?')[0].toUpperCase()}</div>`}
      <div>
        <h2 class="profile-name">${user.displayName ?? 'Unknown'}</h2>
        <div class="user-email">${user.email ?? '—'}</div>
        <div class="muted" style="margin-top:6px">Last seen: ${user.lastSeen ? new Date(user.lastSeen).toLocaleString() : 'never'}</div>
        <div class="muted"><code style="font-size:0.68rem;color:var(--text-dim)">${user.uid}</code></div>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card"><div class="stat-num">${user.sessions.length}</div><div class="stat-lbl">Workouts</div></div>
      <div class="stat-card"><div class="stat-num">${waterDays}</div><div class="stat-lbl">Water Days</div></div>
      <div class="stat-card"><div class="stat-num">${avgWater}</div><div class="stat-lbl">Avg ml/day</div></div>
      <div class="stat-card"><div class="stat-num">${lastSess ? lastSess.durationMin + 'm' : '—'}</div><div class="stat-lbl">Last Duration</div></div>
    </div>

    <h3 class="sec-title">Workout Sessions (${user.sessions.length})</h3>
    ${user.sessions.length === 0
      ? '<p class="empty">No sessions logged yet.</p>'
      : user.sessions.map(s => renderSession(s)).join('')}

    <h3 class="sec-title">Water Intake (last 30 days)</h3>
    ${renderWater(user.water)}
  `;

  document.getElementById('back-btn').addEventListener('click', () =>
    renderUserList(window._adminUsers)
  );
}

function renderSession(s) {
  const exs = s.exercises ?? [];
  return `
    <div class="card session-card">
      <div class="sess-header">
        <div style="display:flex;align-items:center;gap:10px">
          <span class="day-badge">Day ${s.day}</span>
          <span style="font-weight:700">${DAY_LABELS[s.day] ?? 'Workout'}</span>
        </div>
        <span class="muted">${s.date} · ${s.durationMin ?? '?'} min</span>
      </div>
      ${exs.map(ex => {
        const done = (ex.sets ?? []).filter(s => s.done);
        return `<div class="ex-row">
          <span class="ex-name">${ex.name}</span>
          <span>
            ${done.length === 0
              ? '<em class="muted">skipped</em>'
              : done.map((st, i) => ex.isCardio
                  ? `<span class="set-pill">${st.note || 'done'}</span>`
                  : `<span class="set-pill">${st.weight ?? '?'} kg × ${st.reps ?? '?'}</span>`
                ).join('')}
          </span>
        </div>`;
      }).join('')}
    </div>
  `;
}

function renderWater(water) {
  const entries = Object.entries(water).sort(([a], [b]) => b.localeCompare(a)).slice(0, 30);
  if (!entries.length) return '<p class="empty">No water data yet.</p>';
  return `<div class="card">
    <table class="water-table">
      <thead><tr><th>Date</th><th>Amount</th><th>vs 2 L goal</th></tr></thead>
      <tbody>
        ${entries.map(([date, ml]) => {
          const pct   = Math.min(100, Math.round((ml / 2000) * 100));
          const color = pct >= 100 ? '#22c55e' : pct >= 50 ? '#3d8ef8' : '#e94560';
          return `<tr>
            <td>${date}</td>
            <td>${ml} ml</td>
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div style="flex:1;height:6px;background:#1a1a28;border-radius:3px;overflow:hidden">
                  <div style="width:${pct}%;height:100%;background:${color};border-radius:3px;transition:width 0.4s"></div>
                </div>
                <span style="width:32px;font-size:0.72rem;color:${color}">${pct}%</span>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}
