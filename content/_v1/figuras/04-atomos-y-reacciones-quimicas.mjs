// Figures of "Átomos y reacciones químicas". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../../platform/build/figkit.mjs";

const W = 360;
const arrow = (id, x1, y1, x2, y2, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x1} ${y1}L${x2} ${y2}"/>`;
const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
const electron = (x, y, r = 5) => `<circle class="d-flow-acc" cx="${x}" cy="${y}" r="${r}"/>`;
// An atom with its letter: oxygen (accent) and the rest (grey).
const atom = (x, y, sym, r = 11) => `${circ(x, y, r, sym === "O" ? "d-acc" : "d-box")}<text class="${sym === "O" ? "d-a" : "d-t"}" x="${x}" y="${y + 5}" text-anchor="middle">${sym}</text>`;
const pt = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

const atomo = (() => {
  const cx = 100, cy = 116;
  const nuc = [[-8, -8, "p"], [8, -8, "n"], [0, 4, "p"], [-11, 8, "n"], [10, 10, "p"], [0, -18, "n"]]
    .map(([dx, dy, k]) => circ(cx + dx, cy + dy, 8, k === "p" ? "d-fill-acc" : "d-fill-hair")).join("");
  const els = [-50, 100, 215].map((a) => { const [x, y] = pt(cx, cy, 82, a); return electron(x, y, 6); }).join("");
  const row = (y, mark, title, sub) => `${mark(212, y)}<text class="d-t" x="230" y="${y + 5}">${title}</text>${note(230, y + 22, sub, 124)}`;
  return {
    caption: "En el centro está el **núcleo**, con protones y neutrones; los **electrones** se mueven alrededor.",
    svg: fig("f-04-atomo", "Un átomo con su núcleo de protones y neutrones y electrones alrededor", 236, `
      ${circ(cx, cy, 82, "d-line")}${nuc}${els}
      <text class="d-a" x="${cx}" y="${cy + 50}" text-anchor="middle">Núcleo</text>
      ${row(58, (x, y) => circ(x, y, 8, "d-fill-acc"), "Protón", "carga positiva (+), en el núcleo")}
      ${row(120, (x, y) => circ(x, y, 8, "d-fill-hair"), "Neutrón", "sin carga, en el núcleo")}
      ${row(182, (x, y) => electron(x, y, 7), "Electrón", "carga negativa (−), fuera del núcleo")}`, W),
  };
})();

const modelos = (() => {
  const panel = (x, y, title, sub, inner) => `<rect class="d-box-line" x="${x}" y="${y}" width="168" height="134" rx="${R.box}"/>
    <text class="d-t" x="${x + 84}" y="${y + 22}" text-anchor="middle">${title}</text>${inner}
    <text class="d-s" x="${x + 84}" y="${y + 124}" text-anchor="middle">${sub}</text>`;
  const X1 = 6, X2 = 186, Y1 = 6, Y2 = 146;
  const dalton = circ(X1 + 84, Y1 + 70, 28, "d-fill-hair");
  const th = [[-12, -10], [10, -14], [-4, 6], [14, 6], [-16, 14], [2, -2]];
  const thomson = circ(X2 + 84, Y1 + 70, 32, "d-box") + th.map(([dx, dy]) => circ(X2 + 84 + dx, Y1 + 70 + dy, 4, "d-fill-acc")).join("");
  const rx = X1 + 84, ry = Y2 + 70;
  const ruth = `${circ(rx, ry, 32, "d-dash")}${circ(rx, ry, 5, "d-fill-acc")}` + [30, 120, 200, 300].map((a) => { const [x, y] = pt(rx, ry, 32, a); return electron(x, y, 4); }).join("");
  const bx = X2 + 84, by = Y2 + 70;
  const bohr = [12, 22, 32].map((r) => circ(bx, by, r, "d-line")).join("") + circ(bx, by, 5, "d-fill-acc") + [[12, 60], [22, 200], [32, 320], [32, 130]].map(([r, a]) => { const [x, y] = pt(bx, by, r, a); return electron(x, y, 3.5); }).join("");
  return {
    caption: "Cada modelo explicó lo que el anterior no podía: del bloque sólido al átomo con núcleo y niveles de energía.",
    svg: fig("f-04-mod", "Los modelos atómicos de Dalton, Thomson, Rutherford y Bohr", 288,
      panel(X1, Y1, "Dalton · 1803", "esfera sólida", dalton) + panel(X2, Y1, "Thomson · 1897", "budín de pasas", thomson) +
      panel(X1, Y2, "Rutherford · 1911", "núcleo y vacío", ruth) + panel(X2, Y2, "Bohr · 1913", "órbitas con niveles", bohr), W),
  };
})();

const cambios = {
  caption: "La pregunta clave: ¿al final hay una **sustancia nueva**?",
  svg: fig("f-04-cam", "Cambio físico y cambio químico", 252, `
    <text class="d-t" x="90" y="20" text-anchor="middle">Cambio físico</text>
    <text class="d-a" x="270" y="20" text-anchor="middle">Cambio químico</text>
    <path class="d-dash" d="M180 8V242"/>
    ${box(16, 34, 148, 56, "Hielo", ["agua sólida"])}
    ${arrow("f-04-cam", 90, 90, 90, 122)}
    ${box(16, 126, 148, 56, "Agua líquida", ["la misma sustancia"])}
    ${box(196, 34, 148, 56, "Hierro", ["clavo nuevo"])}
    ${arrow("f-04-cam", 270, 90, 270, 122, true)}
    ${box(196, 126, 148, 56, "Óxido", ["sustancia nueva"], "d-acc")}
    ${note(90, 206, "Se puede revertir: si lo enfrías, vuelve a ser hielo", 160, "d-s", "middle")}
    ${note(270, 206, "No vuelve a ser hierro: cambió su composición", 160, "d-s", "middle")}`, W),
};

const formulas = (() => {
  const water = (x, y, dx = 16, r = 9) => atom(x, y - 6, "O") + atom(x - dx, y + 10, "H", r) + atom(x + dx, y + 10, "H", r);
  const card = (i, formula, sub, draw) => {
    const x = 6 + (i % 3) * 120, y = 6 + Math.floor(i / 3) * 156, cx = x + 54;
    return `<rect class="d-box-line" x="${x}" y="${y}" width="108" height="150" rx="${R.box}"/>${draw(cx, y + 38)}
      <text class="d-t" x="${cx}" y="${y + 86}" text-anchor="middle">${formula}</text>${sub.map((t) => note(cx, y + 104, t, 94, "d-s", "middle")).reduce((a, n, k) => a + n.replace(`y="${y + 104}"`, `y="${y + 104 + k * 16}"`), "")}`;
  };
  const cards = [
    card(0, "O₂", ["oxígeno", "2 O"], (x, y) => atom(x - 12.5, y, "O") + atom(x + 12.5, y, "O")),
    card(1, "H₂O", ["agua", "2 H y 1 O"], (x, y) => water(x, y)),
    card(2, "CO₂", ["dióxido de", "carbono", "1 C y 2 O"], (x, y) => atom(x - 24, y, "O") + atom(x, y, "C") + atom(x + 24, y, "O")),
    card(3, "CH₄", ["metano", "1 C y 4 H"], (x, y) => atom(x, y, "C") + [[-20, -15], [20, -15], [-20, 15], [20, 15]].map(([dx, dy]) => atom(x + dx, y + dy, "H", 9)).join("")),
    card(4, "NaCl", ["sal de mesa", "1 Na y 1 Cl"], (x, y) => atom(x - 14, y, "Na", 13) + atom(x + 14, y, "Cl", 13)),
    card(5, "2 H₂O", ["dos moléculas", "de agua", "4 H y 2 O"], (x, y) => water(x - 27, y, 13, 8) + water(x + 27, y, 13, 8)),
  ].join("");
  return {
    caption: "La letra es el elemento; el número pequeño dice **cuántos átomos** hay de él; el número grande de adelante, cuántas moléculas.",
    svg: fig("f-04-for", "Moléculas de oxígeno, agua, dióxido de carbono, metano, sal y dos de agua", 318, cards, W),
  };
})();

const ecuacion = (() => {
  const cy = 60;
  const h2 = (x) => atom(x, cy, "H", 9) + atom(x + 18, cy, "H", 9);
  const water = (x) => atom(x, cy - 6, "O") + atom(x - 16, cy + 10, "H", 9) + atom(x + 16, cy + 10, "H", 9);
  return {
    caption: "Reactivos y productos tienen los **mismos átomos**, solo reacomodados: la ecuación está balanceada.",
    svg: fig("f-04-ecu", "Ecuación balanceada: dos moléculas de hidrógeno y una de oxígeno forman dos de agua", 160, `
      <text class="d-t" x="86" y="22" text-anchor="middle">Reactivos</text><text class="d-t" x="270" y="22" text-anchor="middle">Productos</text>
      ${h2(22)}${h2(66)}<text class="d-t" x="101" y="${cy + 5}" text-anchor="middle">+</text>${atom(124, cy, "O")}${atom(146, cy, "O")}
      ${arrow("f-04-ecu", 172, cy, 206, cy, true)}
      ${water(240)}${water(304)}
      <text class="d-t" x="180" y="112" text-anchor="middle">2 H₂ + O₂ → 2 H₂O</text>
      <text class="d-s" x="86" y="138" text-anchor="middle">4 H y 2 O</text><text class="d-a" x="180" y="138" text-anchor="middle">=</text><text class="d-s" x="270" y="138" text-anchor="middle">4 H y 2 O</text>`, W),
  };
})();

const conservacion = (() => {
  const panel = (x, title, after, nota, acc) => `<text class="d-t" x="${x + 84}" y="20" text-anchor="middle">${title}</text>
    ${box(x + 10, 34, 148, 46, "Antes", ["100 g"])}${arrow("f-04-con", x + 84, 80, x + 84, 112, acc)}
    ${box(x + 10, 114, 148, 46, "Después", [after], acc ? "d-acc" : "d-box")}
    ${note(x + 84, 186, nota, 150, "d-s", "middle")}`;
  return {
    caption: "Si nada entra ni sale, la masa total no cambia; si un gas escapa, parece que \"desapareció\" masa.",
    svg: fig("f-04-con", "Masa antes y después de una reacción en un sistema cerrado y en uno abierto", 226,
      panel(6, "Sistema cerrado", "100 g", "El gas se queda dentro del globo", true) + `<path class="d-dash" d="M180 8V216"/>` + panel(186, "Sistema abierto", "96 g", "El gas escapa al aire: parece que se perdió masa", false), W),
  };
})();

const ph = (() => {
  const x0 = 15, cw = 22, y0 = 50, ch = 26;
  const cx = (n) => x0 + n * cw + cw / 2;
  const cells = Array.from({ length: 15 }, (_, n) => {
    const cls = n < 7 ? "d-acc" : n === 7 ? "d-box-line" : "d-box";
    return `<path class="${cls}" d="M${x0 + n * cw} ${y0}h${cw}v${ch}h${-cw}z"/><text class="d-n" x="${cx(n)}" y="${y0 + 18}" text-anchor="middle">${n}</text>`;
  }).join("");
  const up = (n, t) => `<path class="d-line" d="M${cx(n)} 36V${y0}"/>${note(cx(n), 14, t, 70, "d-s", "middle")}`;
  const down = (n, t) => `<path class="d-line" d="M${cx(n)} ${y0 + ch}V${y0 + ch + 14}"/>${note(cx(n), y0 + ch + 28, t, 80, "d-s", "middle")}`;
  return {
    caption: "Cuanto menor es el pH, más ácida es la sustancia; cuanto mayor, más básica. El agua pura está en el medio, en 7.",
    svg: fig("f-04-ph", "Escala de pH de 0 a 14 con ejemplos de la vida diaria", 160, `
      ${cells}${up(2, "limón")}${up(7, "agua")}${up(10, ["leche de", "magnesia"].join(" "))}
      ${down(3, "vinagre")}${down(8, "bicarbonato")}${down(13, "lejía")}
      <text class="d-a" x="15" y="148">Ácido</text><text class="d-s" x="180" y="148" text-anchor="middle">Neutro</text><text class="d-a" x="345" y="148" text-anchor="end">Básico</text>`, W),
  };
})();

export default { "04-atomo": atomo, "04-modelos": modelos, "04-cambios": cambios, "04-formulas": formulas, "04-ecuacion": ecuacion, "04-conservacion": conservacion, "04-ph": ph };
