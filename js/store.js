const KEYS = { sessions: 'fit_sessions', water: 'fit_water', settings: 'fit_settings' };

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

export function getSessions() { return read(KEYS.sessions, []); }
export function saveSession(session) {
  const sessions = getSessions().filter(s => s.date !== session.date || s.day !== session.day);
  write(KEYS.sessions, [session, ...sessions]);
}

export function getWater(date) { return (read(KEYS.water, {}))[date] ?? 0; }
export function addWater(date, ml) {
  const water = read(KEYS.water, {});
  water[date] = Math.max(0, (water[date] ?? 0) + ml);
  write(KEYS.water, water);
  return water[date];
}

export function getSettings() {
  return { waterGoalMl: 2000, weightUnit: 'kg', ...read(KEYS.settings, {}) };
}
export function saveSettings(patch) {
  write(KEYS.settings, { ...getSettings(), ...patch });
}

export function getLastWeights(exerciseName) {
  const sessions = getSessions();
  for (const s of sessions) {
    const ex = s.exercises?.find(e => e.name === exerciseName);
    if (ex) {
      const done = ex.sets?.find(set => set.done);
      if (done) return { reps: done.reps, weight: done.weight, note: done.note };
    }
  }
  return null;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getSessionsForMonth(year, month) {
  return getSessions().filter(s => {
    const d = new Date(s.date + 'T12:00:00');
    return d.getFullYear() === year && d.getMonth() === month;
  });
}
