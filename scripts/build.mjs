// Builds Compass: the platform's shell (platform/build/site.mjs) plus the courses as data.
// A course is content/<nivel>/<curso>/curso.json and one Markdown file per module; each "## " is a
// lesson. Exams are content/examenes/<id>.json. Format: docs/contenido.md.
import { readFileSync, readdirSync, existsSync, writeFileSync, statSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { marked } from "marked";
import { buildSite, strings, searchSections as sections } from "../platform/build/site.mjs";
import { photoFigure, photoUnit, copyPhotos, isOwnWork, OWN_CREDIT } from "../platform/build/photos.mjs";
import { injectSteps } from "../platform/build/steps.mjs";
import { checkSvg } from "../platform/build/figkit.mjs";
import { formulaBlock, mathify } from "./lib/formula.mjs";

marked.setOptions({ gfm: true, breaks: false });

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "content");
const SRC = join(ROOT, "src");
const read = (p) => readFileSync(p, "utf8");
const LANG = "es";
const CONFIG = JSON.parse(read(join(ROOT, "site.config.json")));
const PKG = JSON.parse(read(join(ROOT, "package.json")));
const UI = strings(JSON.parse(read(join(SRC, "ui.json"))));
const ui = (k) => {
  const v = UI[LANG][k];
  if (v === undefined) throw new Error(`Missing UI string "${k}"`);
  return v;
};
const LEVELS = ["primaria", "secundaria"];

export const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const inline = (s) => marked.parseInline(mathify(s.trim()));

// ── Figures drawn by us: src/figuras/*.mjs export { id: { caption, svg, narrow? } } ──
const FIG_DIR = join(SRC, "figuras");
const FIGURES = {};
if (existsSync(FIG_DIR))
  for (const f of readdirSync(FIG_DIR).filter((f) => f.endsWith(".mjs")).sort())
    for (const [k, v] of Object.entries((await import(pathToFileURL(join(FIG_DIR, f)).href)).default)) FIGURES[k] = { ...v, file: f };
const usedFigures = new Set();
// again: the same figure a second time on the page (a question reusing a lesson's graph) gets its own ids.
const figUses = new Map();
const figureHtml = (id) => {
  const f = FIGURES[id];
  if (!f) throw new Error(`Unknown figure "${id}" (src/figuras/)`);
  usedFigures.add(id);
  const k = (figUses.get(id) || 0) + 1;
  figUses.set(id, k);
  const sfx = k > 1 ? `-${k}` : "";
  const re = (svg, x) => (x ? svg.replace(/id="([^"]+)"/g, `id="$1${x}"`).replace(/#([\w-]+)\)/g, `#$1${x})`) : svg);
  const body = f.narrow ? `<div class="fig-wide">${re(f.svg, sfx)}</div><div class="fig-narrow">${re(f.narrow, `${sfx}-n`)}</div>` : re(f.svg, sfx);
  return `<figure class="figure fig">${body.replace(/\n\s*/g, " ")}${f.caption ? `<figcaption class="figure-cap">${inline(f.caption)}</figcaption>` : ""}</figure>`;
};

// Photos still being written (alt or caption "TODO", or missing files) don't break the build for
// the other modules; a lesson that uses one fails with the reason.
const PHOTO_PROBLEMS = {};
const PHOTOS = (() => {
  const all = existsSync(join(CONTENT, "img", "photos.json")) ? JSON.parse(read(join(CONTENT, "img", "photos.json"))) : {};
  const ok = {};
  for (const [id, p] of Object.entries(all)) {
    try { loadPhotosOne(id, p); ok[id] = p; } catch (e) { PHOTO_PROBLEMS[id] = e.message; }
  }
  return ok;
})();
function loadPhotosOne(id, p) {
  for (const f of [`${p.file}.webp`, `${p.file}-sm.webp`]) if (!existsSync(join(CONTENT, "img", f))) throw new Error(`photo ${id}: missing content/img/${f}`);
  for (const k of ["alt", "caption"]) if (!p[k] || !p[k].es || !p[k].en || /^TODO$/.test(p[k].es) || /^TODO$/.test(p[k].en)) throw new Error(`photo ${id}: write its ${k} (es, en)`);
  if (!p.w || !p.h || !p.credit || (!p.credit.url && !isOwnWork(p.credit))) throw new Error(`photo ${id}: needs w, h and credit.url`);
}
const usedPhotos = new Set();
const photoOpts = { lang: LANG, root: "", zoom: ui("photo.zoom") };

// ── Blocks inside a lesson ──
// ```pregunta: the question (Markdown) on the first lines, "- [x]" the right option, "- [ ]" the
// others, "> " the explanation.
function parseQuestion(body, where) {
  const q = [], opts = [], why = [];
  let a = -1;
  for (const line of body.split("\n")) {
    const o = line.match(/^- \[( |x)\] (.+)$/);
    if (o) { if (o[1] === "x") a = opts.length; opts.push(inline(o[2])); }
    else if (/^>\s?/.test(line)) why.push(line.replace(/^>\s?/, ""));
    else if (!opts.length) q.push(line);
    else if (line.trim()) throw new Error(`${where}: stray line after the options: ${line}`);
  }
  if (opts.length < 2 || a < 0) throw new Error(`${where}: a question needs options and one "- [x]"`);
  if (!why.length) throw new Error(`${where}: a question needs its explanation ("> …")`);
  let ref = "";
  const stem = q.join("\n").trim()
    .replace(/^<!--\s*photo:\s*([\w-]+)\s*-->\s*$/gm, (_m, id) => void (ref = questionPhoto(id, where)) || "")
    .replace(/^<!--\s*figura:\s*([\w-]+)\s*-->\s*$/gm, (_m, id) => `\n${figureHtml(id, true)}\n`);
  return { q: ref + marked.parse(mathify(stem)), o: opts, a, why: inline(why.join(" ")) };
}

// "<!-- photo: id -->" in a question's stem: a small reference picture beside it, with its caption;
// the credit goes in the tooltip.
function questionPhoto(id, where) {
  const p = usePhoto(id, where);
  const c = p.credit;
  const loc = (v) => (v && typeof v === "object" ? v[LANG] : v);
  const credit = isOwnWork(c) ? OWN_CREDIT[LANG] || OWN_CREDIT.es : [loc(c.author), loc(c.license), c.source || "Wikimedia Commons"].filter(Boolean).join(" · ");
  return `<figure class="mcq-ref" title="${esc(credit)}"><button type="button" class="photo-zoom" data-full="img/${p.file}.webp" aria-label="${esc(ui("photo.zoom"))}: ${esc(p.alt[LANG])}"><img src="img/${p.file}-sm.webp" width="${p.w}" height="${p.h}" alt="${esc(p.alt[LANG])}" loading="lazy" decoding="async"></button><figcaption>${p.caption[LANG]}</figcaption></figure>`;
}

// ```video: one YouTube video we watched, with what to look at.
//   id: <YouTube id>  · titulo: … · canal: … · duracion: 6:12 · desde: 1:05 · hasta: 4:30
//   - point to watch for (Markdown)
function videoHtml(body, where) {
  const v = {}, points = [];
  for (const line of body.split("\n")) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) v[kv[1]] = kv[2].trim();
    else if (/^- /.test(line)) points.push(inline(line.slice(2)));
  }
  if (!v.id || !v.titulo || !v.canal) throw new Error(`${where}: a video needs id, titulo and canal`);
  const secs = (t) => (t ? t.split(":").reduce((a, x) => a * 60 + Number(x), 0) : 0);
  const href = `https://www.youtube.com/watch?v=${v.id}${v.desde ? `&t=${secs(v.desde)}s` : ""}`;
  const thumb = `img/videos/${v.id}.jpg`;
  if (!existsSync(join(CONTENT, thumb))) throw new Error(`${where}: missing content/${thumb} (scripts/video-thumb.mjs ${v.id})`);
  usedVideos.add(v.id);
  const span = v.desde || v.hasta ? `${ui("video.from")} ${v.desde || "0:00"}${v.hasta ? ` ${ui("video.to")} ${v.hasta}` : ""}` : ui("video.all");
  // The standard card: the thumbnail on top (16:9, play button, duration), then what to watch.
  return `<aside class="video" data-anchor="${esc(ui("video.kicker"))}"><a class="video-thumb" href="${esc(href)}" target="_blank" rel="noopener" aria-label="${esc(v.titulo)}"><img src="${thumb}" alt="" loading="lazy" width="480" height="270"><span class="video-play" aria-hidden="true"></span>${v.duracion ? `<span class="video-len">${esc(v.duracion)}</span>` : ""}</a>` +
    `<div class="video-t"><p class="kick">${esc(ui("video.kicker"))} · ${esc(span)}</p><h3><a href="${esc(href)}" target="_blank" rel="noopener">${esc(v.titulo)}</a></h3><p class="video-ch">${esc(v.canal)}</p>` +
    (points.length ? `<p class="video-mira">${esc(ui("video.watch"))}</p><ul>${points.map((p) => `<li>${p}</li>`).join("")}</ul>` : "") + `</div></aside>`;
}
const usedVideos = new Set();

// ```conecta: where this comes from and where it leads.  "antes: …" / "despues: …"
function connectHtml(body) {
  const rows = body.split("\n").map((l) => l.match(/^(antes|despues|después):\s*(.+)$/)).filter(Boolean);
  return `<aside class="conecta">${rows.map(([, k, v]) => `<p><span class="kick">${esc(ui(k === "antes" ? "connect.before" : "connect.after"))}</span>${inline(v)}</p>`).join("")}</aside>`;
}


const usePhoto = (id, where) => {
  if (PHOTO_PROBLEMS[id]) throw new Error(`${where}: ${PHOTO_PROBLEMS[id]}`);
  const p = PHOTOS[id];
  if (!p) throw new Error(`${where}: unknown photo "${id}"`);
  usedPhotos.add(id);
  return p;
};

// A photo floats beside text, like a printed book (right unless "left"):
// - the paragraphs, lists, ### sub-headings and quotes after its marker, up to a block that needs the
//   whole width (code fence, figure, table, HTML block, question, another photo), "<!-- /photo -->"
//   or the end of the step; a ### heading right after the marker stays above, full width;
// - with nothing after it, the paragraphs right before it (up to a heading or a wide block);
// - beside a short text (under ~70 words) it floats narrower (photo-compact).
// Only with no text on either side does it stand alone, centred.
const SHORT_TEXT = 70;
const WIDE_BLOCK = (l) => /^\s*(```|~~~)/.test(l) || /^\s*<(?!\/?(strong|em|b|i|a|code|sub|sup|br|span)\b)/.test(l) || /^\s*\|/.test(l) || /^#{1,2} /.test(l) || /^---\s*$/.test(l);
const words = (md) => md.replace(/<[^>]+>/g, " ").replace(/[#*_>`|-]/g, " ").split(/\s+/).filter(Boolean).length;
function floatPhotos(md, where) {
  const lines = md.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*<!--\s*photo:\s*([\w-]+)(\s+left)?\s*-->\s*$/);
    if (!m) { out.push(lines[i]); continue; }
    const p = usePhoto(m[1], where);
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    // A sub-heading right after the marker: it stays above, the photo floats beside its paragraphs.
    const head = [];
    const textEnd = (from) => {
      let e = from;
      while (e < lines.length && !WIDE_BLOCK(lines[e]) && !/<!--\s*\/?photo\b/.test(lines[e])) e++;
      return e;
    };
    if (j < lines.length && /^#{3,6} /.test(lines[j])) {
      let h = j + 1;
      while (h < lines.length && !lines[h].trim()) h++;
      // Only when text follows the heading; otherwise the heading belongs to what comes next.
      if (lines.slice(h, textEnd(h)).join("").trim()) { head.push(lines[j]); j = h; }
    }
    const k = !head.length && /^#{3,6} /.test(lines[j] || "") ? j : textEnd(j);
    let text = lines.slice(j, k).join("\n");
    if (!text.trim()) {
      // Nothing after it: the paragraphs before it in this step, back to a heading or a wide block.
      let s = out.length;
      while (s > 0 && !WIDE_BLOCK(out[s - 1]) && !/^#{3,6} /.test(out[s - 1]) && !/^\s*<div class="photo-/.test(out[s - 1])) s--;
      while (s < out.length && !out[s].trim()) s++;
      const before = out.slice(s).join("\n");
      if (before.trim()) { out.length = s; text = before; }
    }
    const fig = photoFigure(p, photoOpts);
    if (!text.trim()) out.push("", ...head, "", `<div class="photo-alone">${fig}</div>`, "");
    else {
      const unit = photoUnit(text, fig, !!m[2]);
      out.push("", ...head, "", words(text) < SHORT_TEXT ? unit.replace('class="photo-unit', 'class="photo-unit photo-compact') : unit, "");
    }
    i = k < lines.length && /<!--\s*\/photo\s*-->/.test(lines[k]) ? k : k - 1;
  }
  return out.join("\n");
}

// One lesson: Markdown → { html, goals, recap, quiz, minutes }.
function buildLesson(md, lessonId, where, { slots = false, quiz = [] } = {}) {
  const goals = [], recap = [];
  let text = md.replace(/^<!--\s*(min|tipo):[^>]*-->\s*$/gm, "");
  text = text.replace(/^```(\w+)[^\n]*\n([\s\S]*?)^```[ \t]*$/gm, (m, kind, body) => {
    body = body.replace(/\s+$/, "");
    if (kind === "goals") return void goals.push(...body.split("\n").filter((l) => /^- /.test(l)).map((l) => inline(l.slice(2)))), "";
    if (kind === "recap") return void recap.push(...body.split("\n").filter((l) => /^- /.test(l)).map((l) => inline(l.slice(2)))), "";
    if (kind === "idea") return `\n<p class="keyidea">${inline(body)}</p>\n`;
    if (kind === "pregunta") {
      const q = { id: `${lessonId}:q${quiz.length + 1}`, ...parseQuestion(body, `${where} pregunta ${quiz.length + 1}`) };
      quiz.push(q);
      return slots ? `\n<div class="q-slot" data-q="${q.id}"></div>\n` : "";
    }
    if (kind === "video") return `\n${videoHtml(body, where)}\n`;
    if (kind === "conecta") return `\n${connectHtml(body)}\n`;
    if (kind === "formula") return `\n${formulaBlock(body, inline, where)}\n`;
    return m;
  });
  text = text.replace(/^<!--\s*figura:\s*([\w-]+)\s*-->\s*$/gm, (_m, id) => `\n${figureHtml(id)}\n`);
  text = injectSteps(text, { labels: { step: ui("steps.step"), prev: ui("steps.prev"), next: ui("steps.next") } });
  text = floatPhotos(text, where);
  let html = marked.parse(mathify(text));
  // Headings get ids for the section rail.
  html = html.replace(/<h3>(.*?)<\/h3>/g, (_m, h) => `<h3 id="${slugify(h.replace(/<[^>]+>/g, ""))}">${h}</h3>`);
  html = html.replace(/<table>/g, '<div class="tbl"><table>').replace(/<\/table>/g, "</table></div>");
  // Callouts: a quote that opens with a bold label ("Para llevarte:", "Ojo:", "Historia:", "Dato:").
  html = html.replace(/<blockquote>\s*<p><strong>([^<]{2,24}):<\/strong>/g, (_m, label) => `<blockquote class="callout callout-${slugify(label)}"><p><strong class="callout-l">${label}</strong>`);
  html = html.replace(/<p>\s*<!--\s*después\s*-->\s*<\/p>|<!--\s*después\s*-->/g, '<div class="after-mark"></div>');
  return { html, goals, recap, quiz };
}

function buildModule(course, file, n, level) {
  const raw = read(join(CONTENT, level, course.dir, file));
  const id = file.replace(/\.md$/, "");
  const title = (raw.match(/^# (.+)$/m) || [])[1];
  if (!title) throw new Error(`${file}: needs a "# " title`);
  const subtitle = (raw.match(/^# .+\n+> (.+)$/m) || [])[1] || "";
  // Lessons start at "## " outside code fences (a steps block has its own "## " steps).
  const parts = [];
  let fence = false;
  for (const line of raw.split("\n")) {
    if (/^(```|~~~)/.test(line)) fence = !fence;
    if (!fence && /^## /.test(line)) parts.push(line.slice(3));
    else if (parts.length) parts[parts.length - 1] += "\n" + line;
  }
  const payload = { lessons: {} };
  const search = [];
  const bank = [];
  const lessons = parts.map((part, i) => {
    const [head, ...rest] = part.split("\n");
    const ltitle = head.trim();
    const body = rest.join("\n");
    const slug = slugify(ltitle);
    const lid = `${course.id}/${id}/${slug}`;
    const minutes = Number((body.match(/<!--\s*min:\s*(\d+)/) || [])[1] || 10);
    const tipo = (body.match(/<!--\s*tipo:\s*(\w+)/) || [])[1] || "leccion";
    const L = buildLesson(body, lid, `${file} › ${ltitle}`);
    payload.lessons[slug] = { html: L.html, goals: L.goals, recap: L.recap, quiz: L.quiz, tipo };
    const href = `#/c/${course.id}/${id}/${slug}`;
    search.push({ h: href, t: ltitle, w: `${course.title} · ${title}`, s: sections(L.html) });
    for (const q of L.quiz) bank.push({ id: q.id, q: q.q, o: q.o, a: q.a, why: q.why, area: course.area, topic: title, from: ltitle, href });
    const activities = [{ type: "reading", n: 1 }];
    if (L.html.includes('class="figure')) activities.push({ type: "figure", n: (L.html.match(/class="figure fig"/g) || []).length });
    if (L.quiz.length) activities.push({ type: "check", n: L.quiz.length });
    return {
      id: lid, slug, n: i + 1, title: ltitle, minutes, kind: "lesson", type: tipo, activities,
      items: L.quiz.map((q, k) => ({ id: q.id, type: "check", graded: false, title: `${ltitle} · pregunta ${k + 1}`, plainTitle: `${ltitle} · pregunta ${k + 1}` })),
    };
  });
  return {
    module: {
      id: `${course.id}/${id}`, slug: id, n, title, subtitle, minutes: lessons.reduce((a, l) => a + l.minutes, 0),
      file: `data/${LANG}/${course.id}/${id}.json`,
      counts: [{ key: "count.lessons", n: lessons.length }],
      lessons,
    },
    payload, search, bank,
  };
}


// ── Modules as folders (the Bedrock form): content/<nivel>/<curso>/NN-slug/_modulo.md ("# Título",
// "> subtítulo") and one file per lesson, NN-slug.md, with front matter (title, minutes, summary,
// tipo) and one "## " per step: one screen at a time.
const frontMatter = (raw, where) => {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) throw new Error(`${where}: needs front matter (title, minutes, summary)`);
  const meta = Object.fromEntries(m[1].split("\n").map((l) => l.match(/^(\w+):\s*(.*)$/)).filter(Boolean).map(([, k, v]) => [k, v.trim()]));
  return { meta, body: raw.slice(m[0].length) };
};
const splitSteps = (body) => {
  const steps = [];
  let fence = false;
  for (const line of body.split("\n")) {
    if (/^(```|~~~)/.test(line)) fence = !fence;
    if (!fence && /^## /.test(line)) steps.push({ title: line.slice(3).trim(), md: "" });
    else if (steps.length) steps[steps.length - 1].md += line + "\n";
    else if (line.trim()) throw new Error(`text before the first "## " step: ${line.slice(0, 60)}`);
  }
  return steps;
};
function buildModuleDir(course, dirName, n, level) {
  const dir = join(CONTENT, level, course.dir, dirName);
  const head = read(join(dir, "_modulo.md"));
  const title = (head.match(/^# (.+)$/m) || [])[1];
  if (!title) throw new Error(`${dirName}/_modulo.md: needs a "# " title`);
  const subtitle = (head.match(/^> (.+)$/m) || [])[1] || "";
  const payload = { lessons: {} };
  const search = [];
  const bank = [];
  const files = readdirSync(dir).filter((f) => /^\d.*\.md$/.test(f)).sort();
  const info = [];
  const lessons = files.map((f, i) => {
    const where = `${dirName}/${f}`;
    const { meta, body } = frontMatter(read(join(dir, f)), where);
    if (!meta.title) throw new Error(`${where}: front matter needs a title`);
    const slug = f.replace(/^\d+-/, "").replace(/\.md$/, "");
    const lid = `${course.id}/${dirName}/${slug}`;
    const tipo = meta.tipo || "leccion";
    const quiz = [];
    const steps = splitSteps(body).map((st, k) => {
      const L = buildLesson(st.md, lid, `${where} › ${st.title}`, { slots: true, quiz });
      return { title: inline(st.title), plain: st.title, id: slugify(st.title) || `paso-${k + 1}`, html: L.html };
    });
    if (!steps.length) throw new Error(`${where}: no "## " steps`);
    const minutes = Number(meta.minutes) || 10;
    payload.lessons[slug] = { v: 2, steps, quiz, tipo, summary: meta.summary || "" };
    info.push({ slug, lid, tipo, title: meta.title, summary: meta.summary || "", minutes: Number(meta.minutes) || 10, steps: steps.map((x) => x.plain), quiz: quiz.map((q) => q.id),
      check: steps.filter((x) => x.plain === "Compruébalo").flatMap((x) => [...x.html.matchAll(/data-q="([^"]+)"/g)].map((m) => m[1])) });
    const href = `#/c/${course.id}/${dirName}/${slug}`;
    search.push({ h: href, t: meta.title, w: `${course.title} · ${title}`, s: steps.flatMap((st) => sections(`<h2 id="${st.id}">${st.plain}</h2>${st.html}`)) });
    for (const q of quiz) bank.push({ id: q.id, q: q.q, o: q.o, a: q.a, why: q.why, area: course.area, topic: title, from: meta.title, href });
    const all = steps.map((x) => x.html).join("");
    const activities = [{ type: "reading", n: steps.length }];
    const figs = (all.match(/class="figure fig"/g) || []).length;
    if (figs) activities.push({ type: "figure", n: figs });
    if (quiz.length) activities.push({ type: "check", n: quiz.length });
    return {
      id: lid, slug, n: i + 1, title: meta.title, minutes, kind: "lesson", type: tipo, activities,
      items: quiz.map((q, k) => ({ id: q.id, type: "check", graded: false, title: `${meta.title} · pregunta ${k + 1}`, plainTitle: `${meta.title} · pregunta ${k + 1}` })),
    };
  });
  const diag = buildDiag(course, dirName, dir, info);
  return {
    module: {
      id: `${course.id}/${dirName}`, slug: dirName, n, title, subtitle, minutes: lessons.reduce((a, l) => a + l.minutes, 0),
      file: `data/${LANG}/${course.id}/${dirName}.json`,
      ...(diag ? { diag: `data/${LANG}/${course.id}/diagnostico/${dirName}.json` } : {}),
      counts: [{ key: "count.lessons", n: lessons.length }],
      lessons,
    },
    payload, search, bank, diag,
  };
}

// ── The placement test (docs/diagnostico.md): NN-slug/_diagnostico.md, one "## <lesson slug>" per
// lesson (not the module test), in order, with "<!-- medio: <step> -->", an optional
// "<!-- avanzado: <step> -->" and "### Básico", "### Medio", "### Avanzado" with 2 questions each.
// Its questions go to their own lazy file, never to banco.json.
const DIAG_LEVELS = { basico: "b", medio: "m", avanzado: "a" };
const NOT_A_START = ["La pregunta", "Compruébalo", "Resumen"];
const plainText = (html) => html.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, " ").trim();
function buildDiag(course, dirName, dir, info) {
  const file = join(dir, "_diagnostico.md");
  if (!existsSync(file)) {
    console.warn(`⚠ ${dirName}: falta _diagnostico.md (la prueba de entrada salta este módulo)`);
    return null;
  }
  const where = `${dirName}/_diagnostico.md`;
  const err = (msg) => { throw new Error(`${where}: ${msg}`); };
  let sections;
  try { sections = splitSteps(read(file)); } catch (e) { err(e.message); }
  const lessons = info.filter((l) => l.tipo !== "prueba");
  const test = info.find((l) => l.tipo === "prueba");
  const names = sections.map((s) => s.title);
  const extra = names.filter((x) => !lessons.some((l) => l.slug === x));
  if (extra.length) err(`sobra la sección "## ${extra.join('", "## ')}" (cada "## " es el nombre del archivo de una lección, sin número ni .md)`);
  const missing = lessons.filter((l) => !names.includes(l.slug));
  if (missing.length) err(`falta la sección "## ${missing.map((l) => l.slug).join('", "## ')}"`);
  if (names.join() !== lessons.map((l) => l.slug).join()) err(`las secciones van en el orden del módulo: ${lessons.map((l) => l.slug).join(", ")}`);
  const keys = [];
  const longest = [];
  const out = lessons.map((l) => {
    const s = sections.find((x) => x.title === l.slug);
    const at = `${where} › ${l.slug}`;
    const comment = (k) => (s.md.match(new RegExp(`^<!--\\s*${k}:\\s*(.+?)\\s*-->\\s*$`, "m")) || [])[1] || null;
    const step = (k, title) => {
      const i = l.steps.indexOf(title);
      if (i < 0) err(`${l.slug}: "${k}: ${title}" no es un paso de la lección (pasos: ${l.steps.join(" · ")})`);
      if (NOT_A_START.includes(title)) err(`${l.slug}: "${k}" no puede ser "${title}"`);
      return i;
    };
    const medioT = comment("medio");
    if (!medioT) err(`${l.slug}: falta "<!-- medio: <título exacto de un paso> -->"`);
    const medio = step("medio", medioT);
    const avanzadoT = comment("avanzado");
    const avanzado = avanzadoT ? step("avanzado", avanzadoT) : null;
    if (avanzado !== null && avanzado <= medio) err(`${l.slug}: "avanzado" (${avanzadoT}) va después de "medio" (${medioT})`);
    // Optional: the module test's questions (by number) that check this lesson; a miss there
    // brings the lesson back if it was hidden.
    const pruebaN = comment("prueba");
    const prueba = pruebaN ? pruebaN.split(/[,\s]+/).filter(Boolean).map((x) => {
      const k = Number(x);
      if (!test || !Number.isInteger(k) || k < 1 || k > test.quiz.length) err(`${l.slug}: "prueba: ${pruebaN}": la prueba del módulo tiene ${test ? test.quiz.length : 0} preguntas`);
      return test.quiz[k - 1];
    }) : [];
    const qs = { b: [], m: [], a: [] };
    let level = null, fence = false, block = null;
    for (const line of s.md.split("\n")) {
      if (!fence && /^### /.test(line)) {
        const k = slugify(line.slice(4));
        level = DIAG_LEVELS[k];
        if (!level) err(`${l.slug}: "${line}" (los niveles son ### Básico, ### Medio y ### Avanzado)`);
        continue;
      }
      if (/^```pregunta\s*$/.test(line) && !fence) { if (!level) err(`${l.slug}: una pregunta antes de "### Básico"`); fence = true; block = []; continue; }
      if (/^(```|~~~)/.test(line)) {
        if (block) { qs[level].push(block.join("\n").replace(/\s+$/, "")); block = null; fence = false; continue; }
        fence = !fence;
        continue;
      }
      if (block) block.push(line);
      else if (!fence && line.trim() && !/^<!--.*-->\s*$/.test(line)) err(`${l.slug}: texto suelto fuera de una pregunta: ${line.slice(0, 60)}`);
    }
    for (const [k, name] of [["b", "Básico"], ["m", "Medio"], ["a", "Avanzado"]])
      if (qs[k].length !== 2) err(`${l.slug}: "### ${name}" necesita 2 preguntas (tiene ${qs[k].length})`);
    const parsed = {};
    for (const k of ["b", "m", "a"])
      parsed[k] = qs[k].map((body, i) => {
        const q = { id: `diag/${dirName}/${l.slug}/${k}${i + 1}`, ...parseQuestion(body, `${at} ${k}${i + 1}`) };
        if (q.o.length !== 4) err(`${l.slug} ${k}${i + 1}: 4 alternativas`);
        keys.push("ABCD"[q.a]);
        const len = q.o.map((o) => plainText(o).length);
        if (len[q.a] > 20 && len[q.a] > 1.15 * Math.max(...len.filter((_, j) => j !== q.a))) longest.push(`${l.slug} ${k}${i + 1}`);
        return q;
      });
    return { slug: l.slug, title: l.title, summary: l.summary, minutes: l.minutes, steps: l.steps, medio, avanzado, check: l.check, prueba, items: l.quiz, q: parsed };
  });
  // Content rules that only warn: keys spread evenly, never three equal in a row, the right option not the longest.
  const count = Object.fromEntries("ABCD".split("").map((x) => [x, keys.filter((k) => k === x).length]));
  if (Math.max(...Object.values(count)) - Math.min(...Object.values(count)) > 3) console.warn(`⚠ ${where}: claves desparejas (${Object.entries(count).map(([k, v]) => `${k} ${v}`).join(", ")})`);
  const runs = keys.map((k, i) => (i >= 2 && k === keys[i - 1] && k === keys[i - 2] ? i + 1 : 0)).filter(Boolean);
  if (runs.length) console.warn(`⚠ ${where}: tres claves iguales seguidas (pregunta ${runs.join(", ")} del archivo)`);
  if (longest.length) console.warn(`⚠ ${where}: la correcta es claramente la más larga en ${longest.join(", ")}`);
  return { module: dirName, lessons: out };
}

// ── Exams ──
const EXAMS = {};
const examDir = join(CONTENT, "examenes");
for (const f of existsSync(examDir) ? readdirSync(examDir).filter((f) => f.endsWith(".json")) : []) {
  const e = JSON.parse(read(join(examDir, f)));
  if (e.id !== f.replace(/\.json$/, "")) throw new Error(`${f}: id must be the file name`);
  e.questions.forEach((q, i) => {
    if (q.n !== i + 1) throw new Error(`${f}: question ${i + 1} has n=${q.n}`);
    if (!(q.a >= 0 && q.a < q.opts.length)) throw new Error(`${f} q${q.n}: bad answer`);
    if (q.ctx && !e.contexts[q.ctx]) throw new Error(`${f} q${q.n}: unknown context ${q.ctx}`);
  });
  EXAMS[e.id] = e;
}

// ── Courses ──
const data = {};
const courses = [];
const search = [];
const bank = [];
for (const level of LEVELS) {
  const dir = join(CONTENT, level);
  if (!existsSync(dir)) continue;
  for (const cdir of readdirSync(dir).filter((d) => existsSync(join(dir, d, "curso.json"))).sort()) {
    const c = { ...JSON.parse(read(join(dir, cdir, "curso.json"))), dir: cdir };
    // --module <file>: build only that module (to check one module while others are being written).
    const only = process.argv.includes("--module") ? process.argv[process.argv.indexOf("--module") + 1] : null;
    const files = c.modules.filter((f) => (only ? f === only : existsSync(join(dir, cdir, f))));
    const missing = c.modules.filter((f) => !existsSync(join(dir, cdir, f)));
    if (missing.length && !only) console.warn(`⚠ ${cdir}: módulos que aún no existen: ${missing.join(", ")}`);
    const built = files.map((f) => (f.endsWith(".md") ? buildModule : buildModuleDir)(c, f, c.modules.indexOf(f) + 1, level));
    for (const b of built) {
      data[`${LANG}/${c.id}/${b.module.slug}.json`] = b.payload;
      if (b.diag) data[`${LANG}/${c.id}/diagnostico/${b.module.slug}.json`] = b.diag;
      search.push(...b.search);
      bank.push(...b.bank);
    }
    const modules = built.map((b) => b.module);
    const lessonCount = modules.reduce((a, m) => a + m.lessons.length, 0);
    const extras = [
      { href: "#/repaso", title: ui("review.navTitle"), blurb: ui("review.blurb"), icon: "rotate-ccw" },
      ...(c.exams || []).map((x) => {
        if (!EXAMS[x]) throw new Error(`${cdir}: unknown exam ${x}`);
        return { href: `#/examen/${x}`, title: `${EXAMS[x].title} · ${EXAMS[x].goal}`, blurb: `${EXAMS[x].questions.length} preguntas · ${EXAMS[x].minutes} min`, icon: "timer" };
      }),
    ];
    courses.push({
      id: c.id, title: c.title, tagline: c.tagline, description: c.tagline, kicker: `${c.level} · ${c.grades}`, tagType: "reading",
      ready: true, gated: false, outcomes: c.outcomes,
      facts: [{ key: "count.modules", n: modules.length }, { key: "count.lessons", n: lessonCount }],
      minutes: modules.reduce((a, m) => a + m.minutes, 0),
      extras, modules,
    });
  }
}

for (const e of Object.values(EXAMS)) {
  data[`${LANG}/examenes/${e.id}.json`] = e;
  for (const q of e.questions)
    bank.push({ id: `exam/${e.id}/q${q.n}`, q: q.stem, o: q.opts, a: q.a, why: q.why, area: q.area, topic: e.areas.find((x) => x.id === q.area).title, from: `${e.title} · pregunta ${q.n}`, href: `#/examen/${e.id}`, exam: e.id, ctx: q.ctx || null });
}
data[`${LANG}/examenes.json`] = Object.values(EXAMS).map((e) => ({ id: e.id, title: e.title, goal: e.goal, kicker: e.kicker, minutes: e.minutes, n: e.questions.length, areas: e.areas.map((a) => ({ ...a, n: e.questions.filter((q) => q.area === a.id).length })) }));
data[`${LANG}/banco.json`] = bank;
data[`${LANG}/search.json`] = search;

const unused = process.argv.includes("--module") ? [] : Object.keys(FIGURES).filter((k) => !usedFigures.has(k));
if (unused.length) console.warn(`⚠ figuras sin usar: ${unused.join(", ")}`);
const ONLY = process.argv.includes("--module") ? process.argv[process.argv.indexOf("--module") + 1].replace(/\.md$/, "").replace(/\/$/, "") + ".mjs" : null;
const crowded = Object.entries(FIGURES).filter(([, f]) => !ONLY || f.file === ONLY).flatMap(([k, f]) => [...checkSvg(f.svg), ...(f.narrow ? checkSvg(f.narrow) : [])].map((x) => `${k}: ${x}`));
if (crowded.length) throw new Error(`Figure text that does not fit:\n  ${crowded.join("\n  ")}`);

const a = CONFIG.artifact;
data[`${LANG}/site.json`] = {
  lang: LANG,
  site: {
    id: CONFIG.id, name: CONFIG.name, prefix: CONFIG.prefix, repo: CONFIG.repo, mark: CONFIG.mark, langs: CONFIG.langs, defaultLang: CONFIG.defaultLang, version: PKG.version, envCheck: false,
    downloads: [
      { os: "darwin", kind: "dmg-arm64", file: `${a}-mac-arm64.dmg` },
      { os: "darwin", kind: "dmg-x64", file: `${a}-mac-x64.dmg` },
      { os: "win32", kind: "setup", file: `${a}-win-x64-setup.exe` },
      { os: "win32", kind: "portable", file: `${a}-win-x64-portable.exe` },
      { os: "linux", kind: "appimage", file: `${a}-linux-x86_64.AppImage` },
      { os: "linux", kind: "deb", file: `${a}-linux-amd64.deb` },
    ],
  },
  ui: UI[LANG],
  courses,
};

// --check: validate the content (what the build would refuse) without writing dist/.
if (process.argv.includes("--check")) {
  console.log(`ok: ${courses.reduce((x, c) => x + c.modules.reduce((y, m) => y + m.lessons.length, 0), 0)} lecciones, ${bank.length} preguntas, ${usedPhotos.size} fotos, ${usedVideos.size} videos, ${usedFigures.size} figuras`);
  process.exit(0);
}

const site = await buildSite({
  root: ROOT,
  config: { ...CONFIG, iconSvg: join(ROOT, "build", "icon.svg") },
  ui: UI,
  entry: join(SRC, "main.js"),
  css: [join(SRC, "course.css")],
  data,
  scan: [SRC, join(ROOT, "scripts")],
});
copyPhotos(CONTENT, site.dist, PHOTOS, usedPhotos);
for (const id of usedVideos) {
  const to = join(site.dist, "img", "videos", `${id}.jpg`);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(join(CONTENT, "img", "videos", `${id}.jpg`), to);
}
writeFileSync(join(site.dist, "robots.txt"), "User-agent: *\nDisallow: /\n");
const kb = (p) => (statSync(p).size / 1024).toFixed(0);
console.log(`${courses.length} cursos, ${courses.reduce((x, c) => x + c.modules.length, 0)} módulos, ${courses.reduce((x, c) => x + c.modules.reduce((y, m) => y + m.lessons.length, 0), 0)} lecciones, ${bank.length} preguntas, ${Object.keys(EXAMS).length} exámenes, ${usedPhotos.size} fotos, ${usedVideos.size} videos · app.js ${kb(join(site.dist, "assets", "app.js"))} KB`);
