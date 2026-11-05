// What Compass adds to the platform: lessons with self-grading quizzes, the review (Repaso) and the
// timed exams (Simulacros).
import { esc, icon } from "../platform/web/core/dom.js";
import { t, tn } from "../platform/web/core/i18n.js";
import * as P from "../platform/web/core/progress.js";
import { addRoute } from "../platform/web/core/router.js";
import { searchIndex } from "../platform/web/core/search.js";
import { button } from "../platform/web/core/ui.js";
import { mcq } from "./mcq.js";
import { mountSteps } from "./steps.js";
import { dueCount } from "./bank.js";
import { reviewScreen } from "./review.js";
import { examsScreen, examScreen, examRoute, resultRoute, resultScreen } from "./exam.js";
import { diagScreen, diagRoute, homeCards, courseTop, mountCourse } from "./diagnostico.js";
import { isKnown } from "./placement.js";

const section = (id, title, body, cls = "") => `<section class="lsec${cls ? " " + cls : ""}" id="${id}" data-anchor="${esc(title)}"><h2 class="lsec-h">${esc(title)}</h2>${body}</section>`;

export const adapter = {
  id: "school-courses",
  nav: [
    { id: "review", href: "#/repaso", icon: "rotate-ccw", key: "nav.review" },
    { id: "exams", href: "#/simulacros", icon: "timer", key: "nav.exams" },
  ],
  screens: { repaso: reviewScreen, simulacros: examsScreen, examen: examScreen, resultado: resultScreen, diagnostico: diagScreen },

  // The placement test: lessons it hid count as done; its cards on Inicio and the course page.
  lessonKnown: isKnown,
  courseTop,
  mountCourse,

  homeTop() {
    const dg = homeCards();
    const n = dueCount();
    if (!n) return dg;
    return dg + `<section class="card card-pad review-card"><div><p class="kick">${esc(t("review.card"))}</p><h2>${esc(tn("review.due", n))}</h2><p>${esc(t("review.cardSub"))}</p></div>${button({ label: t("review.start"), href: "#/repaso", kind: "primary", icon: "rotate-ccw" })}</section>`;
  },

  mountLesson(host, { lesson, data }) {
    if (data.v === 2) return mountSteps(host, { lesson, data });
    const test = data.tipo === "prueba";
    host.innerHTML = `${data.html}${data.quiz.length ? section(test ? "prueba" : "comprueba", t(test ? "quiz.test" : "quiz.title"), `<div class="quiz-score" aria-live="polite"></div>${data.quiz.map((q) => `<div data-q="${esc(q.id)}"></div>`).join("")}`, "quiz") : ""}`;
    const score = host.querySelector(".quiz-score");
    const paintScore = () => {
      if (!score) return;
      const answered = data.quiz.map((q) => P.checkAnswer(q.id)).filter(Boolean);
      score.textContent = answered.length === data.quiz.length ? t("quiz.score", { ok: answered.filter((a) => a.correct).length, n: data.quiz.length }) : "";
    };
    data.quiz.forEach((q, i) => {
      const el = host.querySelector(`[data-q="${CSS.escape(q.id)}"]`);
      const prev = P.checkAnswer(q.id);
      mcq(el, {
        kicker: t("quiz.of", { i: i + 1, n: data.quiz.length }),
        question: q.q, options: q.o, answer: q.a, why: q.why,
        picked: prev ? Number(prev.answer) : null,
        missNote: t("quiz.toReview"),
        onAnswer: (pick, ok) => {
          P.saveCheckAnswer(q.id, lesson.id, pick, ok);
          P.recordAttempt(q.id, ok, { detail: JSON.stringify({ src: "leccion", pick }) });
          paintScore();
        },
      });
    });
    paintScore();
    return {};
  },

  mountWorkshop() {
    return {};
  },

  search: searchIndex(),
};

addRoute(/^repaso$/, "repaso");
addRoute(/^simulacros$/, "simulacros");
addRoute(examRoute, "examen");
addRoute(resultRoute, "resultado");
addRoute(diagRoute, "diagnostico");

// icon names used in templates (the icon plugin collects names it sees in the source)
void icon;
