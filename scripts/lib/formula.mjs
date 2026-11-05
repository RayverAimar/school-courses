// Formulas typeset as HTML (no MathJax): the ```formula block and inline $…$ (docs/contenido.md).
//   d = m / V          "a / b" with spaces is a stacked fraction of the nearest operands (a token, a
//                      number with its unit, or a parenthesised group, whose parentheses are dropped)
//   x^2 · v^{n-1}      superscripts; x_0, E_{p} subscripts
//   ΔT ≈ 2,5 °C        single letters are variables (italic); words, numbers and units are upright
//   "masa"             quotes force upright text
//   6 CO₂ → C₆H₁₂O₆    chemical formulas (element symbols with ₀–₉ subscripts) are upright
// Operators: = + − · × ≈ ≤ ≥ < > →, and the ASCII forms - * ~= <= >= -> for them.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Units recognised right after a number ("54 g", "2,7 g/cm³", "36 km/h").
const UNIT = new Set("g kg mg t cm m km mm µm nm L mL cL dL s min h d año años °C °F K J kJ cal kcal Cal N kN Pa kPa hPa atm mmHg W kW kWh V A mA Ω Hz kHz mol % ° m² cm² km² m³ cm³ dm³ mm³ m/s km/h m/s² g/cm³ kg/m³ g/mL kg/L J/s".split(" "));
const isUnit = (u) => UNIT.has(u) || u.split(/[/·]/).every((p) => UNIT.has(p.replace(/[²³]$/, "")) || UNIT.has(p));

const OPS = [["~=", "≈"], ["<=", "≤"], [">=", "≥"], ["->", "→"], ["*", "·"], ["-", "−"], ["−", "−"], ["=", "="], ["+", "+"], ["·", "·"], ["×", "×"], ["≈", "≈"], ["≤", "≤"], ["≥", "≥"], ["<", "<"], [">", ">"], ["→", "→"], ["±", "±"], [",", ","], [";", ";"], [":", ":"]];
const LETTERS = "A-Za-zÁÉÍÓÚáéíóúñÑα-ωΑ-Ω";
const SUPCH = { "²": "2", "³": "3", "¹": "1", "⁰": "0" };

function tokenize(s) {
  const out = [];
  let i = 0, sp = false;
  const push = (t) => { out.push({ ...t, sp }); sp = false; };
  while (i < s.length) {
    const r = s.slice(i);
    let m;
    if (/^\s/.test(r)) { sp = true; i++; continue; }
    if ((m = r.match(/^"([^"]*)"/))) { push({ t: "word", v: m[1] }); i += m[0].length; continue; }
    if ((m = r.match(/^\d+(?:[.,]\d+)*/))) {
      i += m[0].length;
      const u = s.slice(i).match(new RegExp(`^(\\s?)([${LETTERS}°%µΩ][${LETTERS}°µΩ²³/·]*|%)`));
      if (u && isUnit(u[2])) { push({ t: "qty", v: m[0], u: u[2] }); i += u[0].length; }
      else push({ t: "num", v: m[0] });
      continue;
    }
    if ((m = r.match(/^(?:[A-Z][a-z]?[₀-₉]*)+/)) && /[₀-₉]/.test(m[0])) { push({ t: "chem", v: m[0] }); i += m[0].length; continue; }
    if (r[0] === "Δ" || r[0] === "∆") { push({ t: "sym", v: "Δ", glue: true }); i++; continue; }
    if ((m = r.match(new RegExp(`^[${LETTERS}]+`)))) { push({ t: m[0].length === 1 ? "var" : "word", v: m[0] }); i += m[0].length; continue; }
    if (r[0] === "^" || r[0] === "_") {
      const kind = r[0] === "^" ? "sup" : "sub";
      i++;
      let arg;
      if (s[i] === "{") {
        let depth = 0, j = i;
        for (; j < s.length; j++) { if (s[j] === "{") depth++; else if (s[j] === "}" && !--depth) break; }
        arg = s.slice(i + 1, j);
        i = j + 1;
      } else {
        const a = s.slice(i).match(new RegExp(`^(?:[-−]?\\d+(?:[.,]\\d+)?|[${LETTERS}]+|.)`));
        arg = a[0];
        i += a[0].length;
      }
      push({ t: kind, v: arg });
      continue;
    }
    if (SUPCH[r[0]]) { push({ t: "sup", v: SUPCH[r[0]] }); i++; continue; }
    if ("([{".includes(r[0])) { push({ t: "open", v: r[0] }); i++; continue; }
    if (")]}".includes(r[0])) { push({ t: "close", v: r[0] }); i++; continue; }
    if (r[0] === "/") { push({ t: "slash", spaced: sp && /^\/\s/.test(r) }); i++; continue; }
    const op = OPS.find(([a]) => r.startsWith(a));
    if (op) { push({ t: "op", v: op[1] }); i += op[0].length; continue; }
    push({ t: "sym", v: r[0] });
    i++;
  }
  return out;
}

// Tokens → nodes: groups nest, scripts attach to the atom before them, spaced slashes make fractions.
function parse(tokens) {
  let i = 0;
  const seq = (close) => {
    const list = [];
    while (i < tokens.length) {
      const tk = tokens[i++];
      if (tk.t === "close") { if (close) break; list.push({ t: "sym", v: tk.v }); continue; }
      if (tk.t === "open") { list.push({ t: "group", open: tk.v, close: { "(": ")", "[": "]", "{": "}" }[tk.v], kids: seq(true) }); continue; }
      if (tk.t === "sup" || tk.t === "sub") {
        const prev = list[list.length - 1];
        const node = parse(tokenize(tk.v));
        if (prev && prev.t !== "op" && prev.t !== "slash") prev[tk.t] = node;
        else list.push({ t: "sym", v: "", [tk.t]: node });
        continue;
      }
      list.push(tk);
    }
    // A fraction takes the atom on each side of " / " (Δ glues to the letter after it).
    for (let k = 0; k < list.length; k++) {
      if (list[k].t !== "slash" || !list[k].spaced) continue;
      let a = k - 1, b = k + 1;
      if (a < 0 || b >= list.length) continue;
      if (a > 0 && list[a - 1].glue) a--;
      const bEnd = list[b].glue && b + 1 < list.length ? b + 1 : b;
      const unwrap = (ns) => (ns.length === 1 && ns[0].t === "group" && ns[0].open === "(" && !ns[0].sup && !ns[0].sub ? ns[0].kids : ns);
      const frac = { t: "frac", num: unwrap(list.slice(a, k)), den: unwrap(list.slice(b, bEnd + 1)) };
      list.splice(a, bEnd - a + 1, frac);
      k = a;
    }
    return list;
  };
  return seq(false);
}

const REL = new Set(["=", "≈", "≤", "≥", "<", ">", "→"]);
function render(nodes) {
  let out = "";
  nodes.forEach((n, k) => {
    const prev = nodes[k - 1];
    let h;
    switch (n.t) {
      case "var": h = `<i class="fx-v">${esc(n.v)}</i>`; break;
      case "num": h = `<span class="fx-n">${esc(n.v)}</span>`; break;
      case "word": h = `<span class="fx-w">${esc(n.v)}</span>`; break;
      case "chem": h = `${prev && (prev.t === "num" || prev.t === "qty") ? "\u2009" : ""}<span class="fx-w">${esc(n.v).replace(/[₀-₉]+/g, (d) => `<sub class="fx-sub">${[...d].map((c) => c.charCodeAt(0) - 0x2080).join("")}</sub>`)}</span>`; break;
      case "qty": h = `<span class="fx-n">${esc(n.v)}</span><span class="fx-u">${esc(n.u)}</span>`; break;
      case "sym": h = n.v ? `<span class="fx-s">${esc(n.v)}</span>` : ""; break;
      case "slash": h = `<span class="fx-sl">/</span>`; break;
      case "group": h = `<span class="fx-p">${esc(n.open)}</span>${render(n.kids)}<span class="fx-p">${esc(n.close)}</span>`; break;
      case "frac": h = `<span class="fx-f"><span class="fx-fn">${render(n.num)}</span><span class="fx-fd">${render(n.den)}</span></span>`; break;
      case "op": {
        const unary = (n.v === "−" || n.v === "+") && (!prev || prev.t === "op" || prev.t === "open");
        const cls = [",", ";", ":"].includes(n.v) ? "fx-pu" : unary ? "fx-un" : REL.has(n.v) ? "fx-rel" : "fx-bin";
        h = `<span class="fx-o ${cls}">${esc(n.v)}</span>`;
        break;
      }
      default: h = esc(n.v || "");
    }
    if (n.sup) h += `<sup class="fx-sup">${render(n.sup)}</sup>`;
    if (n.sub) h += `<sub class="fx-sub">${render(n.sub)}</sub>`;
    out += h;
  });
  return out;
}

// One expression as inline HTML (a single line, so Markdown keeps it whole).
export function formula(src, { display = false } = {}) {
  const s = src.trim();
  const nodes = parse(tokenize(s));
  // A displayed equation breaks only after its → (each side stays whole on a phone).
  const body = display && nodes.some((n) => n.t === "op" && n.v === "→")
    ? nodes.reduce((g, n) => (g[g.length - 1].push(n), n.t === "op" && n.v === "→" && g.push([]), g), [[]]).map((g) => `<span class="fx-side">${render(g)}</span>`).join("<wbr>")
    : render(nodes);
  return `<span class="fx${display ? " fx-d" : ""}" role="math" aria-label="${esc(s.replace(/[{}]/g, "").replace(/\^/g, " elevado a ").replace(/_/g, " sub "))}">${body}</span>`;
}

// ```formula: expressions, one per line (or separated by "---"), then "símbolo: descripción" lines
// for the legend. `inline` renders the descriptions' Markdown.
export function formulaBlock(body, inline, where = "formula") {
  const exprs = [], legend = [];
  for (const line of body.split("\n").map((l) => l.trim()).filter(Boolean)) {
    if (/^-{3,}$/.test(line)) continue;
    const m = line.match(/^([^:=]{1,16}?):\s+(.+)$/);
    if (m && exprs.length) legend.push([m[1], m[2]]);
    else exprs.push(line);
  }
  if (!exprs.length) throw new Error(`${where}: a formula block needs an expression on its first line`);
  return `<div class="fx-block"><div class="fx-row">${exprs.map((e) => formula(e, { display: true })).join("")}</div>` +
    (legend.length ? `<dl class="fx-leg">${legend.map(([s, d]) => `<div><dt>${formula(s)}</dt><dd>${inline(d)}</dd></div>`).join("")}</dl>` : "") + `</div>`;
}

// Inline $…$ in Markdown, outside code spans and fences: "$Q = m · c · ΔT$".
export function mathify(md) {
  let fence = false;
  return md.split("\n").map((line) => {
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return line; }
    if (fence || !line.includes("$")) return line;
    return line.split(/(`[^`]*`)/).map((part, i) => (i % 2 ? part : part.replace(/(^|[^\\$\w])\$(?=\S)([^$\n]+?)(?<=\S)\$(?![\w$])/g, (_m, pre, e) => pre + formula(e)))).join("");
  }).join("\n");
}
