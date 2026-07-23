// src/utils/stats.js
// Wird von Glücksrad.jsx aufgerufen um Spins zu tracken

const KEY = "rad-stats-v1";

export function getStats() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); }
  catch { return {}; }
}

export function trackSpin(mode, winner) {
  const s   = getStats();
  const day = new Date().toISOString().slice(0, 10);

  s.total         = (s.total ?? 0) + 1;
  s.byMode        = s.byMode ?? {};
  s.byMode[mode]  = s.byMode[mode] ?? { count: 0, winners: {} };
  s.byMode[mode].count++;
  s.byMode[mode].winners[winner] = (s.byMode[mode].winners[winner] ?? 0) + 1;
  s.daily         = s.daily ?? {};
  s.daily[day]    = (s.daily[day] ?? 0) + 1;
  s.lastSpin      = new Date().toISOString();

  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}