// A lesson in the Bedrock form: one "## " step per screen, numbered dots on top, Previous / Next
// fixed at the bottom (and ← →). Questions sit inside the steps; content after "<!-- después -->"
// shows once the questions before it in that step are answered. The last step's Next marks the
// lesson read and opens the next one.
import { esc, icon } from "../platform/web/core/dom.js";
import { t } from "../platform/web/core/i18n.js";
import * as P from "../platform/web/core/progress.js";
import { button } from "../platform/web/core/ui.js";
import { mdPlain } from "../platform/web/core/inline.js";
import { mcq } from "./mcq.js";
import { startStep, isKnown } from "./placement.js";

export function mountSteps(host, { lesson, data }) {
  const steps = data.steps;
  const N = steps.length;
  const test = data.tipo === "prueba";
  const byId = new Map(data.quiz.map((q, i) => [q.id, { ...q, i }]));
  const main = host.closest(".lmain");
  main?.classList.add("steps-mode");
  const next = P.nextInCourse(lesson);
  // A placement test may open the lesson further on, the first time only; the steps before stay
  // marked "saltado" until visited.
  const saved = P.position(lesson);
  const fresh = !(saved && Number.isInteger(saved.step));
  const start = startStep(lesson);
  const skipFrom = Number.isInteger(start) && start > 0 && start < N ? start : 0;
  const known = isKnown(lesson);

  host.innerHTML = `
    ${data.summary ? `<p class="ls-summary">${esc(data.summary)}</p>` : ""}
    ${known ? `<p class="ls-placed">${icon("circle-check", "ic-s")}<span>${esc(t("dg.lessonKnown"))}</span></p>` : skipFrom && fresh ? `<p class="ls-placed">${icon("skip-forward", "ic-s")}<span>${esc(t("dg.lessonStart", { n: skipFrom + 1 }))}</span></p>` : ""}
    <div class="ls-head"><ol class="ls-dots">${steps.map((s, i) => `<li><button type="button" data-i="${i}" aria-label="${esc(t("steps.goto", { n: i + 1, title: mdPlain(s.plain) }))}${i < skipFrom ? ` · ${esc(t("dg.skipped"))}` : ""}" data-tip="${esc(s.plain)}${i < skipFrom ? ` · ${esc(t("dg.skipped"))}` : ""}">${i + 1}</button></li>`).join("")}</ol><span class="ls-count" aria-live="polite"></span></div>
    ${steps.map((s, i) => `<section class="lstep" data-i="${i}" id="${esc(s.id)}" hidden><h2 class="ls-h">${s.title}</h2>${s.html}</section>`).join("")}
    <nav class="ls-nav">
      ${button({ label: t("steps.prev"), icon: "arrow-left", cls: "ls-prev" })}
      <span class="ls-hint">${esc(t("steps.keys"))}</span>
      ${button({ label: t("steps.next"), iconEnd: "arrow-right", kind: "primary", cls: "ls-next" })}
    </nav>`;

  // Questions.
  const answered = (id) => !!P.checkAnswer(id);
  for (const slot of host.querySelectorAll(".q-slot")) {
    const q = byId.get(slot.dataset.q);
    const prev = P.checkAnswer(q.id);
    mcq(slot, {
      kicker: test ? t("quiz.of", { i: q.i + 1, n: data.quiz.length }) : "",
      question: q.q, options: q.o, answer: q.a, why: q.why,
      picked: prev ? Number(prev.answer) : null,
      missNote: t("quiz.toReview"),
      onAnswer: (pick, ok) => {
        P.saveCheckAnswer(q.id, lesson.id, pick, ok);
        P.recordAttempt(q.id, ok, { detail: JSON.stringify({ src: "leccion", pick }) });
        reveal(slot.closest(".lstep"));
        paintDots();
      },
    });
  }

  // "<!-- después -->": what follows waits for the questions before it.
  for (const mark of host.querySelectorAll(".after-mark")) {
    const wrap = document.createElement("div");
    wrap.className = "ls-after";
    while (mark.nextSibling) wrap.append(mark.nextSibling);
    mark.replaceWith(wrap);
  }
  const reveal = (sec) => {
    for (const w of sec.querySelectorAll(".ls-after")) {
      const before = [...sec.querySelectorAll(".q-slot")].filter((s) => w.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_PRECEDING);
      const open = before.every((s) => answered(s.dataset.q));
      w.classList.toggle("open", open);
    }
  };
  host.querySelectorAll(".lstep").forEach(reveal);

  // Navigation.
  const dots = [...host.querySelectorAll(".ls-dots button")];
  const secs = [...host.querySelectorAll(".lstep")];
  const prevBtn = host.querySelector(".ls-prev");
  const nextBtn = host.querySelector(".ls-next");
  const count = host.querySelector(".ls-count");
  const stepDone = (i) => [...secs[i].querySelectorAll(".q-slot")].every((s) => answered(s.dataset.q));
  let cur = 0;
  const paintDots = () => dots.forEach((d, i) => {
    const skipped = i < skipFrom && !seen.has(i);
    d.classList.toggle("is-cur", i === cur);
    d.classList.toggle("is-skip", skipped && i !== cur);
    d.classList.toggle("is-seen", !skipped && (i < cur || (i !== cur && seen.has(i))));
    d.setAttribute("aria-current", i === cur ? "step" : "false");
  });
  const seen = new Set((P.position(lesson) || {}).seen || []);
  const show = (i, scroll = true) => {
    cur = Math.max(0, Math.min(N - 1, i));
    seen.add(cur);
    secs.forEach((s, k) => (s.hidden = k !== cur));
    count.textContent = t("steps.of", { i: cur + 1, n: N });
    prevBtn.disabled = cur === 0;
    const last = cur === N - 1;
    main?.classList.toggle("on-last", last);
    nextBtn.querySelector("span").textContent = last ? (next ? t("steps.nextLesson") : t("steps.finish")) : t("steps.next");
    paintDots();
    P.savePosition(lesson, { step: cur, seen: [...seen] });
    if (scroll) host.closest(".lmain")?.scrollIntoView({ block: "start" });
  };
  prevBtn.addEventListener("click", () => show(cur - 1));
  nextBtn.addEventListener("click", () => {
    if (cur < N - 1) return show(cur + 1);
    P.markRead(lesson, true);
    location.hash = next ? P.lessonHref(next) : P.courseHref(lesson.course);
  });
  host.querySelector(".ls-dots").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (b) show(Number(b.dataset.i));
  });
  // ← → move between steps (before the platform's own keys, which change lesson).
  const key = (e) => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowRight" && cur < N - 1) { e.stopImmediatePropagation(); e.preventDefault(); show(cur + 1); }
    else if (e.key === "ArrowLeft" && cur > 0) { e.stopImmediatePropagation(); e.preventDefault(); show(cur - 1); }
  };
  window.addEventListener("keydown", key, true);

  show(fresh ? skipFrom : saved.step, false);
  void stepDone; void icon;
  return { cleanup: () => window.removeEventListener("keydown", key, true) };
}
