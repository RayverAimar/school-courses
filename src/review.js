// Repaso de hoy: the questions due today, one at a time, then what comes next.
import { esc, icon } from "../platform/web/core/dom.js";
import { t, tn } from "../platform/web/core/i18n.js";
import { ROOT } from "../platform/web/core/paths.js";
import * as P from "../platform/web/core/progress.js";
import { setSection } from "../platform/web/core/shell.js";
import { button, empty, confetti } from "../platform/web/core/ui.js";
import { mcq } from "./mcq.js";
import { bank, schedule, daysUntil, INTERVALS } from "./bank.js";

const SESSION = 15; // questions per sitting; the rest stay due for the next one
const exams = new Map();
const examData = (id) => {
  if (!exams.has(id)) exams.set(id, fetch(`${ROOT}data/es/examenes/${id}.json`).then((r) => r.json()));
  return exams.get(id);
};

function summary(all, B) {
  const upcoming = all.filter((s) => !s.mastered && !s.isDue && B.has(s.id)).sort((a, b) => a.due - b.due);
  const groups = new Map();
  for (const s of upcoming) {
    const d = daysUntil(s.due);
    groups.set(d, (groups.get(d) || 0) + 1);
  }
  const mastered = all.filter((s) => s.mastered && B.has(s.id)).length;
  if (!groups.size && !mastered) return "";
  return `<section class="card card-pad rv-next"><h3>${esc(t("review.upcoming"))}</h3>
    <ul class="rv-days">${[...groups].map(([d, n]) => `<li><span>${esc(d === 1 ? t("review.tomorrow") : t("review.inDays", { n: d }))}</span><b>${n}</b></li>`).join("")}</ul>
    ${mastered ? `<p class="rv-master">${icon("trophy", "ic-s")}${esc(tn("review.mastered", mastered))}</p>` : ""}</section>`;
}

export const reviewScreen = {
  async render(view) {
    setSection("review");
    const B = await bank();
    const all = schedule();
    const due = all.filter((s) => s.isDue && B.has(s.id)).sort((a, b) => a.due - b.due);
    const head = `<header class="page-h"><h1>${esc(t("review.title"))}</h1><p class="lead">${esc(t("review.lead"))}</p></header>`;
    if (!due.length) {
      view.innerHTML = `<div class="wrap rv enter">${head}${empty("rotate-ccw", t("review.none"), t("review.noneBody"))}${summary(all, B)}</div>`;
      return;
    }
    view.innerHTML = `<div class="wrap rv enter">${head}
      <section class="card card-pad rv-start"><h2>${esc(tn("review.due", due.length))}</h2>${button({ label: t("review.start"), kind: "primary", icon: "play", cls: "rv-go" })}</section>
      ${summary(all, B)}</div>`;
    view.querySelector(".rv-go").addEventListener("click", () => run(view, due.slice(0, SESSION), B));
  },
};

async function run(view, due, B) {
  let i = 0, ok = 0;
  const show = async () => {
    const s = due[i];
    const q = B.get(s.id);
    const ctx = q.exam && q.ctx ? (await examData(q.exam)).contexts[q.ctx] : null;
    view.innerHTML = `<div class="wrap rv rv-run enter">
      <div class="rv-top"><div class="rv-bar"><i style="width:${(i / due.length) * 100}%"></i></div><span>${i + 1} / ${due.length}</span></div>
      <p class="rv-from">${esc(t("review.from", { from: `${q.topic} · ${q.from}` }))} · ${esc(t("review.box", { n: Math.min(s.level, INTERVALS.length - 1) + 1 }))}</p>
      ${ctx ? `<details class="rv-ctx"><summary>${esc(t("review.context"))}: ${esc(ctx.title)}</summary><div class="exam-ctx exam-paper">${ctx.html}</div></details>` : ""}
      <div class="rv-q"></div>
      <div class="btns rv-btns" hidden>${button({ label: i + 1 < due.length ? t("review.next") : t("review.finish"), kind: "primary", iconEnd: "arrow-right", cls: "rv-nx" })}</div>
    </div>`;
    mcq(view.querySelector(".rv-q"), {
      question: q.q, options: q.o, answer: q.a, why: q.why,
      onAnswer: (pick, right) => {
        if (right) ok++;
        P.recordAttempt(q.id, right, { detail: JSON.stringify({ src: "repaso", pick }) });
        view.querySelector(".rv-btns").hidden = false;
        view.querySelector(".rv-nx").focus();
      },
    });
    view.querySelector(".rv-nx").addEventListener("click", () => {
      i++;
      if (i < due.length) show();
      else finish();
    });
    window.scrollTo(0, 0);
  };
  const finish = () => {
    view.innerHTML = `<div class="wrap rv enter"><section class="card card-pad rv-done">${icon("party-popper")}<h1>${esc(t("review.done"))}</h1><p>${esc(t("review.doneBody", { ok, n: due.length }))}</p>${button({ label: t("nav.home"), href: "#/", kind: "secondary" })}</section>${summary(schedule(), B)}</div>`;
    if (ok === due.length) confetti();
  };
  show();
}
