// La prueba de entrada (docs/diagnostico.md): #/diagnostico/<curso> runs every module that has one, in
// order, and can be paused; #/diagnostico/<curso>/<modulo> runs (or shows the result of) one module.
// Per module: a self-rating of each lesson ("No la he visto" skips its questions), then per lesson 2 basic questions, 2 medium if both are right, 2 advanced
// if those are right too; "No sé" counts as wrong and the first level with a miss ends the lesson.
// Nothing is graded until the end. State and effects: placement.js.
import { esc, icon } from "../platform/web/core/dom.js";
import { md } from "../platform/web/core/inline.js";
import { t, tn, date } from "../platform/web/core/i18n.js";
import { ROOT } from "../platform/web/core/paths.js";
import * as P from "../platform/web/core/progress.js";
import { setSection } from "../platform/web/core/shell.js";
import { go } from "../platform/web/core/router.js";
import { button, sheet, toast } from "../platform/web/core/ui.js";
import { state, edit, clear, reconcile, savedMinutes, outcome } from "./placement.js";

export const diagRoute = /^diagnostico\/([\w-]+)(?:\/([\w-]+))?$/;
const L = "ABCD";
const LEVELS = ["b", "m", "a"];
const RATINGS = ["r0", "r1", "r2"];
const DUNNO = -1;

const files = new Map();
const load = (m) => {
  if (!files.has(m.diag)) files.set(m.diag, fetch(ROOT + m.diag).then((r) => (r.ok ? r.json() : null)).catch(() => null));
  return files.get(m.diag);
};
const withDiag = (c) => c.modules.filter((m) => m.diag);
const href = (c, m) => `#/diagnostico/${c.id}${m ? `/${m.slug}` : ""}`;
const modBySlug = (c, s) => c.modules.find((m) => m.slug === s);
const lessonOf = (m, slug) => m.lessons.find((l) => l.slug === slug);
const modLabel = (m) => t("dg.module", { n: m.n });
const minutes = (n) => t("time.min", { n });

// ── Numbers for a module result ──
function summary(m, res) {
  const rows = Object.entries(res.lessons).map(([slug, e]) => ({ l: lessonOf(m, slug), e })).filter((x) => x.l);
  const known = rows.filter((x) => x.e.r === "known" && !x.e.back).length;
  const later = rows.filter((x) => (x.e.r === "medio" || x.e.r === "avanzado") && !x.e.back).length;
  const saved = rows.reduce((a, x) => a + savedMinutes(x.l, x.e), 0);
  const mastered = rows.filter((x) => x.e.r === "known").length;
  return { rows, known, later, saved, mastered, n: rows.length };
}
// What was said against what was shown, per lesson: "Marcaste «La sé bien» en 3 y dominas 2".
function calibration(res, s) {
  const said = res.ratings || {};
  const sure = s.rows.filter((x) => said[x.l.slug] === "r2");
  const unseen = s.rows.filter((x) => said[x.l.slug] === "r0").length;
  const parts = [];
  if (sure.length) parts.push(t("dg.calSure", { n: sure.length, k: sure.filter((x) => x.e.r === "known").length }));
  if (unseen) parts.push(tn("dg.calUnseen", unseen));
  return parts.join(" ");
}

const outcomeText = (l, e) => {
  if (e.back) return t("dg.back");
  if (e.r === "known") return t("dg.known");
  if (e.r === "full") return t("dg.full");
  return t("dg.startAt", { step: e.stepTitle || "" });
};
const outcomeCls = (e) => (e.back ? "full" : e.r === "known" ? "known" : e.r === "full" ? "full" : "later");

function answersHtml(D, e) {
  if (!e.asked || !e.asked.length) return `<p class="muted small">${esc(t("dg.noQuestions"))}</p>`;
  const all = new Map(D.lessons.flatMap((x) => LEVELS.flatMap((k) => x.q[k].map((q, i) => [q.id, { q, k, i }]))));
  return e.asked.map(({ id, pick }) => {
    const x = all.get(id);
    if (!x) return "";
    const { q } = x;
    const st = pick === q.a ? "right" : pick === DUNNO ? "blank" : "wrong";
    return `<article class="res-q dg-rq is-${st}">
      <p class="kick">${esc(t(`dg.lvl.${x.k}`))} · ${x.i + 1}</p>
      <div class="mcq-q${q.q.includes('class="mcq-ref"') ? " dg-has-ref" : ""}">${q.q}</div>
      <ul class="res-opts">${q.o.map((o, i) => `<li class="${i === q.a ? "right" : i === pick ? "wrong" : ""}"><span class="mcq-l">${L[i]}</span><span>${o}</span>${i === q.a ? `<em>${esc(t("exam.correct"))}</em>` : i === pick ? `<em>${esc(t("exam.yours"))}</em>` : ""}</li>`).join("")}</ul>
      ${pick === DUNNO ? `<p class="dg-dunno-note">${icon("circle-help", "ic-s")}${esc(t("dg.youDunno"))}</p>` : ""}
      <p class="res-why"><b>${esc(t("exam.why"))}:</b> ${q.why}</p></article>`;
  }).join("");
}

function resultHtml(c, m, res, D) {
  const s = summary(m, res);
  const line = [t(`dg.sub.${s.known ? "k" : ""}${s.later ? "l" : ""}`, { k: s.known, later: s.later, n: s.n }).replace(/\.$/, ""), s.saved ? t("dg.savedLine", { min: s.saved }) : ""].filter(Boolean).join(" · ");
  return `<section class="card card-pad dg-res-top">
      <p class="dg-res-line">${esc(line)}</p>
      <p class="muted small dg-res-cal">${esc([calibration(res, s), s.known ? t("dg.safety") : ""].filter(Boolean).join(" "))}</p>
    </section>
    <div class="dg-lessons">${s.rows.map(({ l, e }) => `<details class="card dg-lrow is-${outcomeCls(e)}">
      <summary><span class="dg-ln">${l.module.n}.${l.n}</span><span class="dg-lt"><b>${md(l.title)}</b><span class="dg-badge is-${outcomeCls(e)}">${esc(outcomeText(l, e))}</span></span>
        <span class="dg-lq">${res.ratings?.[l.slug] ? `${esc(t(`dg.${res.ratings[l.slug]}`))} · ` : ""}${esc(tn("dg.asked", (e.asked || []).length))}</span>${icon("chevron-down", "ic-s dg-chev")}</summary>
      <div class="dg-ans">${answersHtml(D, e)}<p><a class="link" href="${esc(P.lessonHref(l))}">${esc(t("dg.openLesson"))} ${icon("arrow-right", "ic-s")}</a></p></div>
    </details>`).join("")}</div>`;
}

// ── #/diagnostico/<curso>[/<modulo>] ──
export const diagScreen = {
  async render(view, route) {
    const c = P.course(route.match[1]);
    if (!c) return void go("#/", true);
    const m = route.match[2] ? modBySlug(c, route.match[2]) : null;
    if (route.match[2] && !m) return void go(href(c), true);
    reconcile(c);
    const st = state(c.id);
    const run = st && st.run;
    if (run && (m ? run.scope === "module" && run.queue[0] === m.slug : run.scope === "course")) return sitting(view, c, route);
    setSection("courses");
    if (m) return moduleScreen(view, c, m, route);
    return courseScreen(view, c, route);
  },
};

const rules = () => `<ul class="exam-rules">
  <li>${icon("gauge")}${esc(t("dg.rule1"))}</li>
  <li>${icon("list-checks")}${esc(t("dg.rule2"))}</li>
  <li>${icon("circle-help")}${esc(t("dg.rule3"))}</li>
  <li>${icon("eye-off")}${esc(t("dg.rule4"))}</li>
  <li>${icon("pause")}${esc(t("dg.rule5"))}</li></ul>`;

function startRun(c, scope, queue) {
  edit(c.id, (s) => { s.run = { scope, queue, mi: 0, phase: "rate", at: Date.now(), answers: {}, out: {} }; });
}

function courseScreen(view, c, route) {
  const st = state(c.id) || {};
  const mods = withDiag(c);
  const done = mods.filter((m) => st.modules?.[m.slug]);
  const pending = mods.filter((m) => !st.modules?.[m.slug]);
  const run = st.run;
  const runMod = run && run.scope === "module" ? modBySlug(c, run.queue[0]) : null;
  const totals = done.reduce((a, m) => { const s = summary(m, st.modules[m.slug]); return { known: a.known + s.known, saved: a.saved + s.saved }; }, { known: 0, saved: 0 });
  view.innerHTML = `<div class="wrap dg enter">
    <a class="back" href="${esc(P.courseHref(c))}">${icon("arrow-left")}<span>${md(c.title)}</span></a>
    <header class="page-h"><p class="kick">${md(c.title)}</p><h1>${esc(t("dg.title"))}</h1><p class="lead">${esc(t("dg.lead"))}</p></header>
    ${runMod ? `<section class="card card-pad dg-cta"><div><h3>${esc(t("dg.halfModule", { label: modLabel(runMod) }))}</h3></div>${button({ label: t("dg.continue"), href: href(c, runMod), kind: "primary", iconEnd: "arrow-right" })}</section>` : ""}
    ${done.length ? `<section class="card card-pad dg-cta"><div><p class="kick">${esc(t("dg.soFar"))}</p><h3>${esc(t("dg.totals", { k: totals.known, min: totals.saved }))}</h3></div></section>` : ""}
    <section class="card card-pad"><h3>${esc(t("dg.how"))}</h3>${rules()}
      <div class="btns">${pending.length ? button({ label: done.length ? tn("dg.goOn", pending.length) : t("dg.start"), kind: "primary", icon: "play", cls: "dg-go" }) : `<p class="muted">${esc(t("dg.allDone"))}</p>`}</div></section>
    <div class="sec-h"><h2>${esc(t("dg.modules"))}</h2></div>
    <div class="lrows card dg-mods">${c.modules.map((m) => {
      const res = st.modules?.[m.slug];
      const s = res ? summary(m, res) : null;
      const side = !m.diag ? `<span class="muted small">${esc(t("dg.notYet"))}</span>`
        : s ? `<span class="small">${esc(t("dg.modDone", { k: s.known, n: s.n, min: s.saved }))}</span>`
        : `<span class="muted small">${esc(t("dg.modTime", { n: m.lessons.filter((l) => l.type !== "prueba").length * 3 }))}</span>`;
      const st2 = s ? "done" : "none";
      const inner = `<span class="st st-${st2}">${s ? icon("check") : ""}</span><span class="t">${esc(modLabel(m))} · ${md(m.title)}</span><span class="r">${side}${m.diag ? icon("arrow-right", "ic-s") : ""}</span>`;
      return m.diag ? `<a class="lrow" href="${esc(href(c, m))}">${inner}</a>` : `<div class="lrow dg-off">${inner}</div>`;
    }).join("")}</div>
    ${done.length ? `<div class="btns dg-foot">${button({ label: t("dg.clear"), icon: "trash-2", kind: "ghost", attrs: { "data-dg": "clear", "data-c": c.id } })}</div>` : ""}
  </div>`;
  view.querySelector(".dg-go")?.addEventListener("click", () => {
    startRun(c, "course", pending.map((m) => m.slug));
    diagScreen.render(view, route);
  });
}

async function moduleScreen(view, c, m, route) {
  const st = state(c.id) || {};
  const res = st.modules?.[m.slug];
  const D = m.diag ? await load(m) : null;
  const head = `<a class="back" href="${esc(href(c))}">${icon("arrow-left")}<span>${esc(t("dg.title"))}</span></a>
    <header class="page-h"><p class="kick">${esc(t("dg.title"))}${res ? ` · ${esc(date(res.at))}` : ""}</p><h1>${esc(modLabel(m))} · ${md(m.title)}</h1>${m.subtitle ? `<p class="lead">${md(m.subtitle)}</p>` : ""}</header>`;
  if (!D) {
    view.innerHTML = `<div class="wrap dg enter">${head}<section class="card card-pad"><p>${esc(t("dg.notYetLong"))}</p><div class="btns">${button({ label: t("dg.toSyllabus"), href: P.courseHref(c) })}</div></section></div>`;
    return;
  }
  if (res) {
    view.innerHTML = `<div class="wrap dg enter">${head}${resultHtml(c, m, res, D)}
      <div class="btns dg-foot">${button({ label: t("dg.toSyllabus"), href: P.courseHref(c), kind: "primary", iconEnd: "arrow-right" })}${button({ label: t("dg.retake"), icon: "rotate-ccw", cls: "dg-again" })}</div></div>`;
    view.querySelector(".dg-again").addEventListener("click", () => {
      const s = sheet({ title: t("dg.retakeTitle"), body: `<p>${esc(t("dg.retakeBody"))}</p><div class="btns">${button({ label: t("dg.retakeYes"), kind: "primary", cls: "c-yes" })}${button({ label: t("exam.confirmNo"), cls: "c-no" })}</div>` });
      s.el.querySelector(".c-no").addEventListener("click", s.close);
      s.el.querySelector(".c-yes").addEventListener("click", () => { s.close(); startRun(c, "module", [m.slug]); diagScreen.render(view, route); });
    });
    return;
  }
  view.innerHTML = `<div class="wrap dg enter">${head}
    <section class="card card-pad"><h3>${esc(t("dg.how"))}</h3>${rules()}
      <p class="muted">${esc(t("dg.modTime", { n: D.lessons.length * 3 }))} · ${esc(tn("dg.lessons", D.lessons.length))}</p>
      <div class="btns">${button({ label: t("dg.start"), kind: "primary", icon: "play", cls: "dg-go" })}</div></section></div>`;
  view.querySelector(".dg-go").addEventListener("click", () => { startRun(c, "module", [m.slug]); diagScreen.render(view, route); });
}

// ── The sitting: one screen at a time, full-screen like a Simulacro ──
async function sitting(view, c, route) {
  setSection("courses", { focus: true, tabs: false });
  let onKey = null;
  const key = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.querySelector(".sheet")) return;
    if (onKey) onKey(e);
  };
  document.addEventListener("keydown", key);
  const save = (fn) => edit(c.id, (s) => fn(s.run, s));

  const paint = async () => {
    onKey = null;
    const run = state(c.id)?.run;
    if (!run) return void diagScreen.render(view, route);
    const m = modBySlug(c, run.queue[run.mi]);
    const D = m && (await load(m));
    if (!D) { save((r) => { r.mi++; r.phase = "rate"; if (r.mi >= r.queue.length) r.phase = "end"; }); return paint(); }
    const top = (sub) => `<header class="exam-bar"><div class="exam-bar-t"><b>${esc(t("dg.title"))} · ${esc(modLabel(m))}</b><span>${md(m.title)}${sub ? ` · ${esc(sub)}` : ""}</span></div>
      ${run.queue.length > 1 ? `<span class="dg-of">${esc(t("dg.modOf", { i: run.mi + 1, n: run.queue.length }))}</span>` : ""}
      ${button({ label: t("dg.pause"), icon: "pause", cls: "dg-pause", small: true })}</header>`;
    const wirePause = () => view.querySelector(".dg-pause")?.addEventListener("click", () => {
      toast(t("dg.paused"), { icon: "pause" });
      go(P.courseHref(c));
    });

    if (run.phase === "rate") {
      const said = { ...(run.ratings || {}) };
      view.innerHTML = `<div class="exam-run dg-run">${top("")}
        <div class="exam-body dg-body dg-wide enter"><header class="dg-rh"><span class="dg-mn">${esc(modLabel(m))}</span><h1 class="dg-h">${md(m.title)}</h1>
          <p class="dg-ask">${esc(t("dg.rateQ"))}</p><p class="muted">${esc(t("dg.rateLead"))}</p></header>
          <ol class="dg-rl">${D.lessons.map((x, k) => `<li class="dg-rlr${said[x.slug] ? " is-set" : ""}" data-s="${esc(x.slug)}"><div class="dg-rlt"><span class="dg-ln">${m.n}.${k + 1}</span><div><b>${md(x.title)}</b>${x.summary ? `<small>${md(x.summary)}</small>` : ""}</div></div>
            <div class="dg-seg" role="radiogroup" aria-label="${esc(x.title)}">${RATINGS.map((r) => `<button type="button" role="radio" aria-checked="${said[x.slug] === r}" data-r="${r}">${esc(t(`dg.${r}`))}</button>`).join("")}</div></li>`).join("")}</ol>
          <p class="muted small dg-note">${icon("info", "ic-s")}${esc(t("dg.rateNote"))}</p></div>
        <footer class="exam-foot"><div class="dg-foot-in"><span class="muted small dg-left"></span>${button({ label: t("dg.rateGo"), iconEnd: "arrow-right", kind: "primary", cls: "dg-rgo", disabled: true })}</div></footer></div>`;
      wirePause();
      const go2 = view.querySelector(".dg-rgo");
      const left = view.querySelector(".dg-left");
      const sync = () => {
        const n = D.lessons.filter((x) => !said[x.slug]).length;
        go2.disabled = n > 0;
        left.textContent = n ? tn("dg.rateLeft", n) : t("dg.rateReady");
        save((x) => { x.ratings = { ...said }; });
      };
      view.querySelector(".dg-rl").addEventListener("click", (e) => {
        const b = e.target.closest(".dg-seg button");
        if (!b) return;
        const row = b.closest(".dg-rlr");
        said[row.dataset.s] = b.dataset.r;
        row.querySelectorAll(".dg-seg button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
        row.classList.add("is-set");
        sync();
      });
      sync();
      go2.addEventListener("click", () => {
        const first = D.lessons.findIndex((x) => said[x.slug] !== "r0");
        save((x) => { x.ratings = { ...said }; for (const l of D.lessons) if (said[l.slug] === "r0") x.out[l.slug] = "full"; x.phase = "ask"; x.li = first; x.lvl = 0; x.qi = 0; });
        if (first < 0) finishModule(m, D);
        window.scrollTo(0, 0);
        paint();
      });
      return;
    }

    if (run.phase === "ask") {
      const Ls = D.lessons[run.li];
      const lvl = LEVELS[run.lvl];
      const q = Ls.q[lvl][run.qi];
      const ref = q.q.includes('class="mcq-ref"');
      view.innerHTML = `<div class="exam-run dg-run">${top(t("dg.lessonOf", { i: run.li + 1, n: D.lessons.length }))}
        <div class="dg-bar" aria-hidden="true"><i style="width:${(run.li / D.lessons.length) * 100}%"></i></div>
        <div class="exam-body dg-body enter">
          <p class="kick dg-qk"><span>${esc(t("dg.lessonOf", { i: run.li + 1, n: D.lessons.length }))} · ${md(Ls.title)}</span><span class="dg-lvl is-${lvl}">${esc(t(`dg.lvl.${lvl}`))} · ${run.qi + 1}/2</span></p>
          <div class="mcq dg-q${ref ? " mcq-has-ref" : ""}"><div class="mcq-q">${q.q}</div>
            <div class="exam-opts" role="radiogroup">${q.o.map((o, i) => `<button type="button" class="exam-opt" role="radio" aria-checked="false" data-i="${i}"><span class="mcq-l">${L[i]}</span><span>${o}</span></button>`).join("")}
            <button type="button" class="exam-opt dg-dunno" role="radio" aria-checked="false" data-i="${DUNNO}"><span class="mcq-l">?</span><span>${esc(t("dg.dunno"))}</span></button></div></div>
          <p class="muted small dg-note">${icon("eye-off", "ic-s")}${esc(t("dg.noFeedback"))}</p>
        </div>
        <footer class="exam-foot">${button({ label: t("dg.next"), iconEnd: "arrow-right", kind: "primary", cls: "dg-next", disabled: true })}</footer></div>`;
      wirePause();
      let sel = null;
      const opts = [...view.querySelectorAll(".dg-q .exam-opt")];
      const next = view.querySelector(".dg-next");
      const choose = (i) => {
        sel = i;
        opts.forEach((b) => b.setAttribute("aria-checked", String(Number(b.dataset.i) === i)));
        next.disabled = false;
      };
      view.querySelector(".dg-q .exam-opts").addEventListener("click", (e) => { const b = e.target.closest(".exam-opt"); if (b) choose(Number(b.dataset.i)); });
      const answer = () => {
        if (sel === null) return;
        const right = sel === q.a;
        save((x) => {
          (x.answers[Ls.slug] ||= []).push({ id: q.id, pick: sel });
          let end = null;
          if (!right) end = ["full", "medio", "avanzado"][x.lvl];
          else if (x.qi === 0) x.qi = 1;
          else { x.qi = 0; x.lvl++; if (x.lvl === 3) end = "known"; }
          if (end) { x.out[Ls.slug] = end; x.li++; while (x.li < D.lessons.length && x.ratings?.[D.lessons[x.li].slug] === "r0") x.li++; x.lvl = 0; x.qi = 0; }
        });
        const r = state(c.id).run;
        if (r.li >= D.lessons.length) finishModule(m, D);
        window.scrollTo(0, 0);
        paint();
      };
      next.addEventListener("click", answer);
      onKey = (e) => {
        const k = e.key.toLowerCase();
        const i = "abcd".indexOf(k) >= 0 ? "abcd".indexOf(k) : "1234".indexOf(k);
        if (i >= 0 && i < q.o.length) choose(i);
        else if (k === "n" || k === "5" || k === "?") choose(DUNNO);
        else if (e.key === "Enter" && sel !== null && !e.target.closest?.("button")) { e.preventDefault(); answer(); }
      };
      return;
    }

    if (run.phase === "between") {
      const res = state(c.id).modules[m.slug];
      const nm = modBySlug(c, run.queue[run.mi + 1]);
      view.innerHTML = `<div class="exam-run dg-run">${top(t("dg.modDoneShort"))}
        <div class="exam-body dg-body dg-wide enter"><p class="kick">${esc(t("dg.resultOf", { label: modLabel(m) }))}</p><h1 class="dg-h">${md(m.title)}</h1>${resultHtml(c, m, res, D)}</div>
        <footer class="exam-foot">${button({ label: t("dg.stopHere"), icon: "pause", cls: "dg-stop" })}${button({ label: t("dg.nextModule", { label: modLabel(nm) }), iconEnd: "arrow-right", kind: "primary", cls: "dg-nextmod" })}</footer></div>`;
      wirePause();
      view.querySelector(".dg-stop").addEventListener("click", () => { save((x) => { x.mi++; x.phase = "rate"; x.answers = {}; x.out = {}; x.ratings = {}; }); go(P.courseHref(c)); });
      view.querySelector(".dg-nextmod").addEventListener("click", () => { save((x) => { x.mi++; x.phase = "rate"; x.answers = {}; x.out = {}; x.ratings = {}; }); window.scrollTo(0, 0); paint(); });
      return;
    }

    // "end": the run is over.
    edit(c.id, (s) => { s.run = null; });
    go(run.scope === "module" ? href(c, m) : href(c), true);
  };

  // Writes the module's result (replacing an earlier one) and moves the run on.
  function finishModule(m, D) {
    edit(c.id, (s) => {
      const r = s.run;
      const lessons = {};
      for (const x of D.lessons) {
        const res = r.out[x.slug] || "full";
        const start = res === "medio" ? x.medio : res === "avanzado" ? (x.avanzado ?? x.medio) : null;
        lessons[x.slug] = { r: res, start, stepTitle: start !== null ? x.steps[start] : null, steps: x.steps.length, asked: r.answers[x.slug] || [], check: x.check, prueba: x.prueba, items: x.items, back: null };
      }
      s.modules[m.slug] = { at: Date.now(), ratings: r.ratings || {}, lessons };
      s.notices = (s.notices || []).filter((n) => !n.lesson.startsWith(`${c.id}/${m.slug}/`));
      r.phase = r.scope === "course" && r.mi + 1 < r.queue.length ? "between" : "end";
    });
  }

  await paint();
  return { cleanup: () => document.removeEventListener("keydown", key) };
}

// ── Cards: Inicio, the course page and its modules ──
const ratio = (c) => P.courseProgress(c).ratio;

function notices() {
  const out = [];
  for (const c of P.courses()) {
    const st = state(c.id);
    (st?.notices || []).forEach((n, i) => {
      const l = P.lesson(n.lesson);
      if (!l) return;
      out.push(`<section class="card card-pad dg-notice"><div>${icon("undo-2")}<div><p class="kick">${esc(t("dg.noticeKick"))}</p><h3>${md(l.title)}</h3><p>${esc(t(`dg.where.${n.where}`))}</p></div></div>
        <div class="btns">${button({ label: t("dg.openLesson"), href: P.lessonHref(l), kind: "primary", small: true, iconEnd: "arrow-right" })}${button({ label: t("dg.gotIt"), small: true, kind: "ghost", attrs: { "data-dg": "notice-off", "data-c": c.id, "data-i": String(i) } })}</div></section>`);
    });
  }
  return out.join("");
}

function offerCard(c, { home }) {
  const st = state(c.id);
  if (!withDiag(c).length) return "";
  if (st?.run) {
    const m = modBySlug(c, st.run.queue[st.run.mi]);
    const to = st.run.scope === "module" ? href(c, m) : href(c);
    return `<section class="card card-pad dg-cta dg-offer"><div><p class="kick">${esc(t("dg.title"))}${home ? ` · ${md(c.title)}` : ""}</p><h3>${esc(t("dg.halfModule", { label: m ? modLabel(m) : "" }))}</h3><p>${esc(t("dg.halfSub"))}</p></div>${button({ label: t("dg.continue"), href: to, kind: "primary", iconEnd: "arrow-right" })}</section>`;
  }
  const taken = Object.keys(st?.modules || {}).length;
  if (taken) {
    if (home) return "";
    const mods = withDiag(c).filter((m) => st.modules[m.slug]);
    const tot = mods.reduce((a, m) => { const s = summary(m, st.modules[m.slug]); return { k: a.k + s.known, l: a.l + s.later, min: a.min + s.saved }; }, { k: 0, l: 0, min: 0 });
    const pending = withDiag(c).length - mods.length;
    return `<section class="card card-pad dg-cta dg-done"><div><p class="kick">${esc(t("dg.title"))}</p><h3>${esc(t(`dg.sum.${tot.k ? "k" : ""}${tot.l ? "l" : ""}`, { k: tot.k, l: tot.l, min: tot.min }))}</h3>${pending ? `<p>${esc(tn("dg.pendingMods", pending))}</p>` : ""}</div>
      <div class="btns">${button({ label: pending ? tn("dg.goOn", pending) : t("dg.seeResult"), href: href(c), kind: pending ? "primary" : "secondary", small: true })}${button({ label: t("dg.clear"), icon: "trash-2", kind: "ghost", small: true, attrs: { "data-dg": "clear", "data-c": c.id } })}</div></section>`;
  }
  if (home && (st?.offer === "dismissed" || ratio(c) >= 0.5)) return "";
  return `<section class="card card-pad dg-cta dg-offer"><div><p class="kick">${esc(t("dg.title"))}${home ? ` · ${md(c.title)}` : ""}</p><h3>${esc(t("dg.offer"))}</h3><p>${esc(t("dg.offerSub"))}</p></div>
    <div class="btns">${button({ label: t("dg.offerGo"), href: href(c), kind: "primary", icon: "compass" })}${home ? button({ label: t("dg.notNow"), kind: "ghost", attrs: { "data-dg": "offer-off", "data-c": c.id } }) : ""}</div></section>`;
}

export function homeCards() {
  for (const c of P.courses()) if (c.ready) reconcile(c);
  return notices() + P.courses().filter((c) => c.ready).map((c) => offerCard(c, { home: true })).join("");
}

export function courseTop(c) {
  reconcile(c);
  return offerCard(c, { home: false });
}

// The syllabus: a "Prueba de entrada" link in every module that has one, hidden lessons folded under
// "Ya lo sabes", and where the others start.
export function mountCourse(view, c) {
  const st = state(c.id);
  for (const box of view.querySelectorAll("details.mod[data-module]")) {
    const m = P.module(box.dataset.module);
    if (!m || !m.diag) continue;
    const taken = !!st?.modules?.[m.slug];
    box.querySelector(".mod-t")?.insertAdjacentHTML("beforeend", `<a class="dg-modlink" href="${esc(href(c, m))}">${icon(taken ? "circle-check" : "compass", "ic-s")}${esc(taken ? t("dg.modTaken") : t("dg.modTest"))}</a>`);
    const rows = [...box.querySelectorAll(".lrows > .lrow")];
    let group = null;
    for (const row of rows) {
      const l = m.lessons.find((x) => row.getAttribute("href") === P.lessonHref(x));
      const e = l && outcome(l);
      if (e && e.r === "known" && !e.back) {
        if (!group) {
          group = document.createElement("details");
          group.className = "dg-fold";
          row.before(group);
        }
        row.querySelector(".chips")?.insertAdjacentHTML("afterbegin", `<span class="chip chip-done">${esc(t("dg.known"))}</span>`);
        group.append(row);
        continue;
      }
      group = null;
      if (e && !e.back && (e.r === "medio" || e.r === "avanzado") && e.start) row.querySelector(".chips")?.insertAdjacentHTML("afterbegin", `<span class="chip chip-figure" data-tip="${esc(e.stepTitle || "")}">${icon("skip-forward")}${esc(t("dg.chipStart", { n: e.start + 1 }))}</span>`);
    }
    for (const g of box.querySelectorAll(".dg-fold")) {
      const n = g.children.length;
      const mins = [...g.children].reduce((a, r) => a + (m.lessons.find((x) => r.getAttribute("href") === P.lessonHref(x))?.minutes || 0), 0);
      g.insertAdjacentHTML("afterbegin", `<summary class="lrow">${icon("check", "ic-s dg-fold-i")}<span class="t">${esc(tn("dg.foldTitle", n))}<small>${esc(t("dg.foldSub", { min: mins }))}</small></span><span class="r">${icon("chevron-down", "ic-s dg-chev")}</span></summary>`);
    }
  }
}

// Actions from cards rendered as strings (Inicio, the course page).
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-dg]");
  if (!b) return;
  const cid = b.dataset.c;
  const refresh = () => dispatchEvent(new HashChangeEvent("hashchange"));
  if (b.dataset.dg === "offer-off") { edit(cid, (s) => { s.offer = "dismissed"; }); refresh(); }
  if (b.dataset.dg === "notice-off") { edit(cid, (s) => { s.notices.splice(Number(b.dataset.i), 1); }); refresh(); }
  if (b.dataset.dg === "clear") {
    const s = sheet({ title: t("dg.clearTitle"), body: `<p>${esc(t("dg.clearBody"))}</p><div class="btns">${button({ label: t("dg.clearYes"), kind: "primary", cls: "c-yes" })}${button({ label: t("exam.confirmNo"), cls: "c-no" })}</div>` });
    s.el.querySelector(".c-no").addEventListener("click", s.close);
    s.el.querySelector(".c-yes").addEventListener("click", () => {
      s.close();
      clear(cid);
      toast(t("dg.cleared"), { icon: "trash-2" });
      if (/^#\/diagnostico\//.test(location.hash)) go(P.courseHref(P.course(cid)));
      else refresh();
    });
  }
});

// A miss on a question of a hidden lesson brings it back at once.
P.onProgress((ev) => {
  if (ev.type !== "attempt") return;
  const it = P.item(ev.id);
  const c = it ? it.lesson.course : null;
  if (!c) return;
  for (const l of reconcile(c)) toast(t("dg.backToast", { title: l.title }), { icon: "undo-2" });
});
