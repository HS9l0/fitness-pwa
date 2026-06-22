const KEYS = { sessions: 'fit_sessions', settings: 'fit_settings' };

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

export function getSettings() {
  return { weightUnit: 'kg', ...read(KEYS.settings, {}) };
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

