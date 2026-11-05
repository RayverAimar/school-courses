// A multiple-choice question that grades itself: letters A–D like the exams, the explanation once
// answered. Used by the lesson quizzes and the review.
import { esc, icon } from "../platform/web/core/dom.js";
import { t } from "../platform/web/core/i18n.js";

const L = "ABCDEFG";

export function mcq(host, { kicker = "", question, options, answer, why, picked = null, onAnswer, missNote = "" }) {
  host.classList.add("mcq");
  // A reference photo in the stem ("<!-- photo: id -->"): beside the question, above it on a phone.
  host.classList.toggle("mcq-has-ref", question.includes('class="mcq-ref"'));
  host.innerHTML = `${kicker ? `<p class="mcq-k">${esc(kicker)}</p>` : ""}<div class="mcq-q">${question}</div>
    <div class="mcq-opts" role="group">${options.map((o, i) => `<button type="button" class="mcq-opt" data-i="${i}" aria-pressed="false"><span class="mcq-l">${L[i]}</span><span class="mcq-t">${o}</span></button>`).join("")}</div>
    <div class="mcq-why" aria-live="polite"></div>`;
  const paint = (i, fresh) => {
    const ok = i === answer;
    host.classList.add("answered", ok ? "is-right" : "is-wrong");
    host.querySelectorAll(".mcq-opt").forEach((b) => {
      const j = Number(b.dataset.i);
      b.classList.toggle("right", j === answer);
      b.classList.toggle("wrong", j === i && !ok);
      b.setAttribute("aria-pressed", String(j === i));
      b.disabled = true;
    });
    host.querySelector(".mcq-why").innerHTML = `<p class="mcq-verdict">${icon(ok ? "circle-check" : "circle-x")}<b>${esc(ok ? t("quiz.right") : t("quiz.wrong"))}</b></p><p>${why}</p>${!ok && missNote ? `<p class="mcq-note">${icon("rotate-ccw", "ic-s")}${esc(missNote)}</p>` : ""}`;
    if (fresh && onAnswer) onAnswer(i, ok);
  };
  host.querySelector(".mcq-opts").addEventListener("click", (e) => {
    const b = e.target.closest(".mcq-opt");
    if (b && !host.classList.contains("answered")) paint(Number(b.dataset.i), true);
  });
  if (picked !== null && picked !== undefined) paint(picked, false);
}
