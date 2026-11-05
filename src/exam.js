// Simulacros: a full exam under exam conditions (one clock, no answers until you hand it in), then
// the result by area and every question with its explanation. A run in progress lives in pref
// "exam.run.<id>" (so closing the app does not lose it, and the clock keeps running); each result
// in "exam.result.<id>.<run>". Every answer is also an attempt, so misses feed the review.
import { esc, icon } from "../platform/web/core/dom.js";
import { t, date } from "../platform/web/core/i18n.js";
import { ROOT } from "../platform/web/core/paths.js";
import * as P from "../platform/web/core/progress.js";
import { setSection } from "../platform/web/core/shell.js";
import { go } from "../platform/web/core/router.js";
import { button, sheet, empty, toast, seg, onSeg } from "../platform/web/core/ui.js";

export const examRoute = /^examen\/([\w-]+)$/;
export const resultRoute = /^resultado\/([\w-]+)\/([\w-]+)$/;
const L = "ABCDEFG";
const PASS = 26;

let LIST = null;
const list = () => (LIST ||= fetch(`${ROOT}data/es/examenes.json`).then((r) => r.json()));
const cache = new Map();
const exam = (id) => {
  if (!cache.has(id)) cache.set(id, fetch(`${ROOT}data/es/examenes/${id}.json`).then((r) => (r.ok ? r.json() : null)));
  return cache.get(id);
};

const runKey = (id) => `exam.run.${id}`;
const getRun = (id) => P.pref(runKey(id), null);
const setRun = (id, run) => P.setPref(runKey(id), run);
const results = (id) =>
  P.store()
    .all("SELECT value FROM pref WHERE key LIKE ? ORDER BY key", [`exam.result.${id}.%`])
    .map((r) => JSON.parse(r.value))
    .filter(Boolean)
    .sort((a, b) => b.ended - a.ended);

const clock = (ms) => {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(h ? 2 : 1, "0")}:${String(x).padStart(2, "0")}`;
};
const mins = (ms) => `${Math.round(ms / 60000)} min`;

// ── #/simulacros ──
export const examsScreen = {
  async render(view) {
    setSection("exams");
    const all = await list();
    view.innerHTML = `<div class="wrap exams enter">
      <header class="page-h"><h1>${esc(t("exam.list"))}</h1><p class="lead">${esc(t("exam.listLead"))}</p></header>
      <div class="exam-cards">${all.map((e) => {
        const rs = results(e.id);
        const run = getRun(e.id);
        return `<a class="card card-pad exam-card" href="#/examen/${esc(e.id)}">
          <p class="kick">${esc(e.goal)} · ${esc(e.kicker)}</p><h2>${esc(e.title)}</h2>
          <p class="exam-meta">${icon("list-checks", "ic-s")}${esc(t("exam.questions", { n: e.n }))}<span>·</span>${icon("timer", "ic-s")}${esc(t("exam.minutes", { n: e.minutes }))}</p>
          <p class="exam-areas">${e.areas.map((a) => `${esc(a.title)} ${a.n}`).join(" · ")}</p>
          ${run ? `<p class="exam-live">${icon("circle-dot", "ic-s")}${esc(t("exam.resume"))}</p>` : rs.length ? `<p class="exam-best">${rs.slice(0, 4).map((r) => `<span>${esc(t("exam.when", { date: date(r.ended, { day: "numeric", month: "short" }), ok: r.ok, n: r.n }))}</span>`).join("")}</p>` : `<p class="exam-none">${esc(t("exam.noAttempts"))}</p>`}
        </a>`;
      }).join("")}</div></div>`;
  },
};

// ── #/examen/<id>: the rules and your attempts, or the exam itself while a run is open ──
export const examScreen = {
  async render(view, route) {
    const id = route.match[1];
    const e = await exam(id);
    if (!e) return void go("#/simulacros", true);
    const run = getRun(id);
    if (run) return sitting(view, e, run);
    setSection("exams", { focus: false });
    const rs = results(id);
    view.innerHTML = `<div class="wrap exam-intro enter">
      <a class="back" href="#/simulacros">${icon("arrow-left")}<span>${esc(t("exam.back"))}</span></a>
      <header class="page-h"><p class="kick">${esc(e.goal)} · ${esc(e.kicker)}</p><h1>${esc(e.title)}</h1>
        <p class="exam-meta">${icon("list-checks", "ic-s")}${esc(t("exam.questions", { n: e.questions.length }))}<span>·</span>${icon("timer", "ic-s")}${esc(t("exam.minutes", { n: e.minutes }))}</p></header>
      <section class="card card-pad"><h3>${esc(t("exam.rules"))}</h3><ul class="exam-rules">
        <li>${icon("timer")}${esc(t("exam.rule1", { min: e.minutes }))}</li>
        <li>${icon("flag")}${esc(t("exam.rule2"))}</li>
        <li>${icon("eye-off")}${esc(t("exam.rule3"))}</li>
        <li>${icon("pencil")}${esc(t("exam.rule4"))}</li></ul>
        <div class="btns">${button({ label: t("exam.start"), kind: "primary", icon: "play", cls: "exam-go" })}</div></section>
      <section class="card card-pad"><h3>${esc(t("exam.attempts"))}</h3>${rs.length ? `<ul class="exam-hist">${rs.map((r) => `<li><a class="link" href="#/resultado/${esc(id)}/${esc(r.run)}">${esc(date(r.ended))}</a><span>${esc(e.areas.map((a) => `${a.title.split(" ")[0]} ${r.byArea[a.id].ok}/${r.byArea[a.id].n}`).join(" · "))}</span><b>${r.ok}/${r.n}</b></li>`).join("")}</ul>` : `<p class="muted">${esc(t("exam.noAttempts"))}</p>`}</section>
    </div>`;
    view.querySelector(".exam-go").addEventListener("click", () => {
      setRun(id, { run: Date.now().toString(36), started: Date.now(), answers: {}, flags: [], cur: 1 });
      examScreen.render(view, route);
    });
  },
};

function sitting(view, e, run) {
  setSection("exams", { focus: true, tabs: false });
  const N = e.questions.length;
  const end = run.started + e.minutes * 60000;
  if (Date.now() >= end) return void submit(e, run, true);
  const save = () => setRun(e.id, run);
  view.innerHTML = `<div class="exam-run">
    <header class="exam-bar"><div class="exam-bar-t"><b>${esc(e.title)}</b><span>${esc(e.goal)}</span></div>
      <div class="exam-clock" role="timer" aria-label="${esc(t("exam.left"))}">${icon("timer")}<span></span></div>
      ${button({ label: t("exam.grid"), icon: "layout-grid", cls: "exam-gridbtn", small: true })}
      ${button({ label: t("exam.submit"), kind: "primary", icon: "send", cls: "exam-submit", small: true })}</header>
    <div class="exam-body"><div class="exam-ctxpane" hidden></div><div class="exam-qpane"></div></div>
    <footer class="exam-foot">${button({ label: t("exam.prev"), icon: "arrow-left", cls: "exam-prev" })}
      ${button({ label: t("exam.flag"), icon: "flag", cls: "exam-flag" })}
      ${button({ label: t("exam.next"), iconEnd: "arrow-right", kind: "primary", cls: "exam-next" })}</footer>
  </div>`;
  const clockEl = view.querySelector(".exam-clock span");
  const tick = () => {
    const left = end - Date.now();
    clockEl.textContent = clock(left);
    view.querySelector(".exam-clock").classList.toggle("low", left < 10 * 60000);
    if (left <= 0) { stop(); submit(e, run, true); }
  };
  const timer = setInterval(tick, 1000);
  const stop = () => clearInterval(timer);
  tick();

  const show = (n) => {
    run.cur = n;
    save();
    const q = e.questions[n - 1];
    const ctxPane = view.querySelector(".exam-ctxpane");
    if (q.ctx) {
      if (ctxPane.dataset.ctx !== q.ctx) {
        ctxPane.innerHTML = `<p class="kick">${esc(e.contexts[q.ctx].title)}</p><div class="exam-ctx exam-paper">${e.contexts[q.ctx].html}</div>`;
        ctxPane.dataset.ctx = q.ctx;
        ctxPane.scrollTop = 0;
      }
      ctxPane.hidden = false;
    } else { ctxPane.hidden = true; ctxPane.dataset.ctx = ""; }
    view.querySelector(".exam-body").classList.toggle("has-ctx", !!q.ctx);
    const area = e.areas.find((a) => a.id === q.area);
    const pick = run.answers[n];
    view.querySelector(".exam-qpane").innerHTML = `<p class="kick">${esc(area.title)} · ${n} / ${N}</p>
      <div class="exam-q"><span class="exam-qn">${n}.</span><div class="exam-stem exam-paper">${q.stem}</div></div>
      <div class="exam-opts" role="radiogroup">${q.opts.map((o, i) => `<button type="button" class="exam-opt" role="radio" aria-checked="${pick === i}" data-i="${i}"><span class="mcq-l">${L[i]}</span><span>${o}</span></button>`).join("")}</div>`;
    view.querySelector(".exam-prev").disabled = n === 1;
    const next = view.querySelector(".exam-next");
    next.disabled = n === N;
    const fl = view.querySelector(".exam-flag");
    const flagged = run.flags.includes(n);
    fl.setAttribute("aria-pressed", String(flagged));
    fl.querySelector("span").textContent = flagged ? t("exam.flagged") : t("exam.flag");
    view.querySelector(".exam-qpane").scrollTop = 0;
    window.scrollTo(0, 0);
  };
  view.querySelector(".exam-qpane").addEventListener("click", (ev) => {
    const b = ev.target.closest(".exam-opt");
    if (!b) return;
    const i = Number(b.dataset.i);
    if (run.answers[run.cur] === i) delete run.answers[run.cur];
    else run.answers[run.cur] = i;
    save();
    view.querySelectorAll(".exam-opt").forEach((x) => x.setAttribute("aria-checked", String(run.answers[run.cur] === Number(x.dataset.i))));
  });
  view.querySelector(".exam-prev").addEventListener("click", () => show(run.cur - 1));
  view.querySelector(".exam-next").addEventListener("click", () => show(run.cur + 1));
  view.querySelector(".exam-flag").addEventListener("click", () => {
    run.flags = run.flags.includes(run.cur) ? run.flags.filter((x) => x !== run.cur) : [...run.flags, run.cur];
    save();
    show(run.cur);
  });
  view.querySelector(".exam-gridbtn").addEventListener("click", () => {
    const body = `<div class="exam-grid">${e.areas.map((a) => `<p class="kick">${esc(a.title)}</p><div class="exam-cells">${e.questions.filter((q) => q.area === a.id).map((q) => `<button type="button" class="exam-cell${run.answers[q.n] !== undefined ? " is-done" : ""}${run.flags.includes(q.n) ? " is-flag" : ""}" data-n="${q.n}"${q.n === run.cur ? ' aria-current="true"' : ""}>${q.n}</button>`).join("")}</div>`).join("")}</div>`;
    const s = sheet({ title: t("exam.grid"), body });
    s.el.querySelector(".exam-grid").addEventListener("click", (ev) => {
      const c = ev.target.closest(".exam-cell");
      if (c) { s.close(); show(Number(c.dataset.n)); }
    });
  });
  view.querySelector(".exam-submit").addEventListener("click", () => {
    const a = Object.keys(run.answers).length;
    const body = `<p>${esc(t("exam.confirmBody", { a, n: N, left: clock(end - Date.now()) }))}</p>${a < N ? `<p class="muted">${esc(t("exam.confirmBlank"))}</p>` : ""}<div class="btns">${button({ label: t("exam.confirmYes"), kind: "primary", cls: "c-yes" })}${button({ label: t("exam.confirmNo"), cls: "c-no" })}</div>`;
    const s = sheet({ title: t("exam.confirmTitle"), body });
    s.el.querySelector(".c-no").addEventListener("click", s.close);
    s.el.querySelector(".c-yes").addEventListener("click", () => { s.close(); stop(); submit(e, run, false); });
  });
  show(run.cur || 1);
  return { cleanup: stop };
}

function submit(e, run, timeUp) {
  const ended = Math.min(Date.now(), run.started + e.minutes * 60000);
  const byArea = Object.fromEntries(e.areas.map((a) => [a.id, { ok: 0, n: 0 }]));
  let ok = 0;
  for (const q of e.questions) {
    const pick = run.answers[q.n];
    const right = pick === q.a;
    byArea[q.area].n++;
    if (right) { ok++; byArea[q.area].ok++; }
    P.recordAttempt(`exam/${e.id}/q${q.n}`, right, { detail: JSON.stringify({ src: "examen", run: run.run, pick: pick ?? null }) });
  }
  P.setPref(`exam.result.${e.id}.${run.run}`, { run: run.run, started: run.started, ended, answers: run.answers, flags: run.flags, ok, n: e.questions.length, byArea });
  P.store().run("DELETE FROM pref WHERE key = ?", [runKey(e.id)]);
  if (timeUp) toast(t("exam.timeUp"), { icon: "timer" });
  go(`#/resultado/${e.id}/${run.run}`, true);
}

// ── #/resultado/<id>/<run> ──
export const resultScreen = {
  async render(view, route) {
    const [, id, runId] = route.match;
    const e = await exam(id);
    const r = e && P.pref(`exam.result.${id}.${runId}`, null);
    if (!r) return void go("#/simulacros", true);
    setSection("exams");
    const pass = r.ok >= PASS;
    const status = (q) => (r.answers[q.n] === undefined ? "blank" : r.answers[q.n] === q.a ? "right" : "wrong");
    view.innerHTML = `<div class="wrap exam-res enter">
      <a class="back" href="#/examen/${esc(id)}">${icon("arrow-left")}<span>${esc(e.title)}</span></a>
      <header class="page-h"><p class="kick">${esc(t("exam.result"))} · ${esc(date(r.ended))}</p><h1>${esc(e.title)}</h1></header>
      <div class="res-top">
        <section class="card card-pad res-score"><p class="res-big">${r.ok}<span>/${r.n}</span></p>
          <p class="res-pass ${pass ? "ok" : "no"}">${icon(pass ? "circle-check" : "circle-alert", "ic-s")}${esc(pass ? t("exam.passOk") : t("exam.passNo"))}</p>
          <p class="muted">${esc(t("exam.minPass"))}</p><p class="muted">${esc(t("exam.time"))}: ${esc(mins(r.ended - r.started))} / ${e.minutes} min</p></section>
        <section class="card card-pad res-areas"><h3>${esc(t("exam.byArea"))}</h3>${e.areas.map((a) => {
          const x = r.byArea[a.id];
          return `<div class="res-area"><span>${esc(a.title)}</span><div class="res-bar"><i style="width:${(x.ok / x.n) * 100}%"></i></div><b>${x.ok}/${x.n}</b></div>`;
        }).join("")}<p class="muted res-note">${icon("rotate-ccw", "ic-s")}${esc(t("exam.toReview"))}</p></section>
      </div>
      <div class="sec-h"><h2>${esc(t("exam.review"))}</h2>${seg("f", [{ value: "wrong", label: t("exam.filter.wrong") }, { value: "flag", label: t("exam.filter.flag") }, { value: "blank", label: t("exam.filter.blank") }, { value: "all", label: t("exam.filter.all") }], "wrong")}</div>
      <div class="res-list">${e.questions.map((q) => {
        const st = status(q);
        const pick = r.answers[q.n];
        return `<article class="card card-pad res-q is-${st}" data-st="${st}" data-flag="${r.flags.includes(q.n)}">
          <p class="kick">${esc(e.areas.find((a) => a.id === q.area).title)} · ${q.n}${r.flags.includes(q.n) ? ` · ${icon("flag", "ic-s")}${esc(t("exam.flagged"))}` : ""}</p>
          ${q.ctx ? `<details class="rv-ctx"><summary>${esc(t("review.context"))}: ${esc(e.contexts[q.ctx].title)}</summary><div class="exam-ctx exam-paper">${e.contexts[q.ctx].html}</div></details>` : ""}
          <div class="exam-q"><span class="exam-qn">${q.n}.</span><div class="exam-stem exam-paper">${q.stem}</div></div>
          <ul class="res-opts">${q.opts.map((o, i) => `<li class="${i === q.a ? "right" : i === pick ? "wrong" : ""}"><span class="mcq-l">${L[i]}</span><span>${o}</span>${i === q.a ? `<em>${esc(t("exam.correct"))}</em>` : i === pick ? `<em>${esc(t("exam.yours"))}</em>` : ""}</li>`).join("")}</ul>
          ${pick === undefined ? `<p class="muted">${esc(t("exam.blank"))}</p>` : ""}
          <p class="res-why"><b>${esc(t("exam.why"))}:</b> ${q.why}</p></article>`;
      }).join("")}</div>
      <div class="btns">${button({ label: t("exam.again"), href: `#/examen/${id}`, icon: "rotate-ccw" })}</div>
    </div>`;
    const filter = (f) => view.querySelectorAll(".res-q").forEach((el) => {
      el.hidden = !(f === "all" || (f === "flag" ? el.dataset.flag === "true" : f === "wrong" ? el.dataset.st !== "right" : el.dataset.st === f));
    });
    onSeg(view, "f", filter);
    filter("wrong");
  },
};

void empty;
