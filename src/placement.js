// The placement test's effects (docs/diagnostico.md), read by the syllabus, the lessons and the review.
// Everything lives in pref "placement.<course>":
//   { run, modules: { <module slug>: { at, ratings: { <lesson slug>: r0|r1|r2 }, lessons: { <lesson slug>: { r, start, asked, check, prueba, items, back } } } },
//     notices: [{ lesson, at, where }], offer }
// r is "known" (hidden: counts as done), "avanzado" / "medio" (opens at step `start` the first time) or
// "full". A miss after the test on a question of a hidden lesson (its own, or a mapped question of the
// module test) sets `back` and the lesson returns as a full one.
import * as P from "../platform/web/core/progress.js";

export const key = (cid) => `placement.${cid}`;
const cache = new Map();

export function state(cid) {
  const raw = P.store().value("SELECT value FROM pref WHERE key = ?", [key(cid)]);
  const hit = cache.get(cid);
  if (hit && hit.raw === raw) return hit.val;
  const val = raw ? JSON.parse(raw) : null;
  cache.set(cid, { raw, val });
  return val;
}
export const blank = () => ({ v: 1, run: null, modules: {}, notices: [], offer: null });
export const edit = (cid, fn) => {
  const st = structuredClone(state(cid) || blank());
  fn(st);
  P.setPref(key(cid), st);
  return st;
};
export const clear = (cid) => P.store().run("DELETE FROM pref WHERE key = ?", [key(cid)]);

const entry = (l) => state(l.course.id)?.modules?.[l.module.slug]?.lessons?.[l.slug] || null;
export const isKnown = (l) => { const e = entry(l); return !!e && e.r === "known" && !e.back; };
export function startStep(l) {
  const e = entry(l);
  return e && !e.back && (e.r === "avanzado" || e.r === "medio") ? e.start : null;
}
export const outcome = (l) => entry(l);

// Minutes the test saves: hidden lessons whole, and the steps skipped in the others.
export function savedMinutes(l, e = entry(l)) {
  if (!e || e.back) return 0;
  if (e.r === "known") return l.minutes;
  if (e.start) return Math.round((l.minutes * e.start) / Math.max(1, e.steps || 1));
  return 0;
}

// The Compruébalo questions of every hidden lesson enter the review, first due 3 days after the test
// (as if answered right once: level 1 of the 1/3/7/14 boxes).
export function reviewSeeds() {
  const out = new Map();
  for (const c of P.courses()) {
    const st = state(c.id);
    if (!st) continue;
    for (const m of Object.values(st.modules || {}))
      for (const e of Object.values(m.lessons || {}))
        if (e.r === "known" && !e.back) for (const id of e.check || []) out.set(id, m.at);
  }
  return out;
}

// A miss since the test on any question of a hidden lesson (in the review, in the lesson itself) or on
// a question of the module test mapped to it brings the lesson back. Returns the lessons restored.
export function reconcile(c) {
  const st = state(c.id);
  if (!st) return [];
  const back = [];
  for (const [ms, m] of Object.entries(st.modules || {}))
    for (const [ls, e] of Object.entries(m.lessons || {})) {
      if (e.r !== "known" || e.back) continue;
      const ids = [...(e.items || []), ...(e.prueba || [])];
      if (!ids.length) continue;
      const miss = P.store().one(`SELECT item_id, at, detail FROM attempt WHERE ok = 0 AND at > ? AND item_id IN (${ids.map(() => "?").join(",")}) ORDER BY at LIMIT 1`, [m.at, ...ids]);
      if (!miss) continue;
      let src = null;
      try { src = JSON.parse(miss.detail || "{}").src; } catch { /* old rows */ }
      const where = (e.prueba || []).includes(miss.item_id) ? "prueba" : src === "repaso" ? "repaso" : "leccion";
      back.push({ ms, ls, at: miss.at, where, id: miss.item_id });
    }
  if (!back.length) return [];
  edit(c.id, (s) => {
    for (const b of back) {
      s.modules[b.ms].lessons[b.ls].back = { at: b.at, where: b.where, id: b.id };
      s.notices.push({ lesson: `${c.id}/${b.ms}/${b.ls}`, at: b.at, where: b.where });
    }
  });
  return back.map((b) => P.lesson(`${c.id}/${b.ms}/${b.ls}`)).filter(Boolean);
}
