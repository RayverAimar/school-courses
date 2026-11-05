// The question bank and the review schedule. Every answered question (lesson quiz, review, exam) is
// an attempt in the platform's database (recordAttempt); the schedule is derived from them, so it
// travels with export/import and merges across devices with no table of its own.
//
// A question enters the review once it is missed. Each right answer since the last miss moves it up
// one level; it comes back after 1, 3, 7 and 14 days, and after four right answers in a row it is
// mastered. A miss sends it back to level 0 (tomorrow).
import { ROOT } from "../platform/web/core/paths.js";
import * as P from "../platform/web/core/progress.js";
import { reviewSeeds } from "./placement.js";

export const INTERVALS = [1, 3, 7, 14];
const DAY = 86400000;

let BANK = null;
export async function bank() {
  if (!BANK) BANK = fetch(`${ROOT}data/es/banco.json`).then((r) => r.json()).then((list) => new Map(list.map((q) => [q.id, q])));
  return BANK;
}

const startOfDay = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };

// For each question ever missed: { id, level, last, due, mastered }.
// A placement test seeds the check questions of the lessons it hid (placement.js): they start at
// level 1 on the day of the test, unless the question was already in the review.
export function schedule() {
  const rows = P.store().all("SELECT item_id, ok, at FROM attempt ORDER BY at");
  const seeds = [...reviewSeeds()].map(([item_id, at]) => ({ item_id, at, seed: true }));
  if (seeds.length) rows.push(...seeds), rows.sort((a, b) => a.at - b.at);
  const by = new Map();
  for (const r of rows) {
    let s = by.get(r.item_id);
    if (r.seed) { if (!s) by.set(r.item_id, { id: r.item_id, level: 1, last: r.at, missed: 0, seen: true, seeded: true }); continue; }
    if (!s) { if (r.ok) continue; s = { id: r.item_id, level: 0, last: r.at, missed: 0 }; by.set(r.item_id, s); }
    // Several answers on the same day count once: the first one that day decides.
    const sameDay = startOfDay(r.at) === startOfDay(s.last) && s.seen;
    if (!sameDay) {
      if (r.ok) s.level = Math.min(s.level + 1, INTERVALS.length);
      else { s.level = 0; s.missed++; }
    } else if (!r.ok && s.level > 0) { s.level = 0; s.missed++; }
    s.last = r.at;
    s.seen = true;
  }
  const today = startOfDay(Date.now());
  return [...by.values()].map((s) => {
    const mastered = s.level >= INTERVALS.length;
    const due = mastered ? null : startOfDay(s.last) + INTERVALS[s.level] * DAY;
    return { ...s, mastered, due, isDue: !mastered && due <= today };
  });
}

export const dueToday = () => schedule().filter((s) => s.isDue);
export const dueCount = () => dueToday().length;
export const daysUntil = (due) => Math.round((due - startOfDay(Date.now())) / DAY);
