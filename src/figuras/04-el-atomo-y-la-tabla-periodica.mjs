// Figures of "El átomo y la tabla periódica". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../platform/build/figkit.mjs";

const W = 360;
const arrow = (id, x1, y1, x2, y2, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x1} ${y1}L${x2} ${y2}"/>`;
const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
const electron = (x, y, r = 5) => `<circle class="d-flow-acc" cx="${x}" cy="${y}" r="${r}"/>`;
// An atom with its letter: oxygen (accent) and the rest (grey).
const pt = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

const atomo = (() => {
  const cx = 100, cy = 116;
  const nuc = [[-8, -8, "p"], [8, -8, "n"], [0, 4, "p"], [-11, 8, "n"], [10, 10, "p"], [0, -18, "n"]]
    .map(([dx, dy, k]) => circ(cx + dx, cy + dy, 8, k === "p" ? "d-fill-acc" : "d-obj")).join("");
  const els = [-50, 100, 215].map((a) => { const [x, y] = pt(cx, cy, 82, a); return electron(x, y, 6); }).join("");
  const row = (y, mark, title, sub) => `${mark(212, y)}<text class="d-t" x="230" y="${y + 5}">${title}</text>${note(230, y + 22, sub, 124)}`;
  return {
    caption: "En el centro está el **núcleo**, con protones y neutrones; los **electrones** se mueven alrededor.",
    svg: fig("f-04-atomo", "Un átomo con su núcleo de protones y neutrones y electrones alrededor", 236, `
      ${circ(cx, cy, 82, "d-line")}${nuc}${els}
      <text class="d-a" x="${cx}" y="${cy + 50}" text-anchor="middle">Núcleo</text>
      ${row(58, (x, y) => circ(x, y, 8, "d-fill-acc"), "Protón", "carga positiva (+), en el núcleo")}
      ${row(120, (x, y) => circ(x, y, 8, "d-obj"), "Neutrón", "sin carga, en el núcleo")}
      ${row(182, (x, y) => electron(x, y, 7), "Electrón", "carga negativa (−), fuera del núcleo")}`, W),
  };
})();

const modelos = (() => {
  const panel = (x, y, title, sub, inner) => `<rect class="d-box-line" x="${x}" y="${y}" width="168" height="134" rx="${R.box}"/>
    <text class="d-t" x="${x + 84}" y="${y + 22}" text-anchor="middle">${title}</text>${inner}
    <text class="d-s" x="${x + 84}" y="${y + 124}" text-anchor="middle">${sub}</text>`;
  const X1 = 6, X2 = 186, Y1 = 6, Y2 = 146;
  const dalton = circ(X1 + 84, Y1 + 70, 28, "d-obj");
  const th = [[-12, -10], [10, -14], [-4, 6], [14, 6], [-16, 14], [2, -2]];
  const thomson = circ(X2 + 84, Y1 + 70, 32, "d-obj") + th.map(([dx, dy]) => circ(X2 + 84 + dx, Y1 + 70 + dy, 4, "d-fill-acc")).join("");
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



const nube = (() => {
  const panel = (x, title, sub, inner) => `<rect class="d-box-line" x="${x}" y="6" width="168" height="170" rx="${R.box}"/>
    <text class="d-t" x="${x + 84}" y="28" text-anchor="middle">${title}</text>${inner}
    <text class="d-s" x="${x + 84}" y="164" text-anchor="middle">${sub}</text>`;
  const bx = 90, by = 90;
  const bohr = [18, 32, 46].map((r) => circ(bx, by, r, "d-line")).join("") + circ(bx, by, 6, "d-fill-acc") + [[18, 60], [32, 200], [46, 320]].map(([r, a]) => { const [x, y] = pt(bx, by, r, a); return electron(x, y, 4); }).join("");
  const nx = 270, ny = 90;
  const cloud = [52, 42, 32, 22].map((r, i) => `<circle class="d-fill-acc" opacity="${0.12 + i * 0.1}" stroke="none" cx="${nx}" cy="${ny}" r="${r}"/>`).join("") + circ(nx, ny, 6, "d-fill-acc");
  return {
    caption: "Bohr dibujó órbitas exactas; el modelo actual habla de una **nube electrónica**: la zona donde es más probable encontrar a los electrones.",
    svg: fig("f-04-nub", "Modelo de Bohr con órbitas y modelo actual con nube de electrones", 184, panel(6, "Bohr", "órbitas fijas", bohr) + panel(186, "Modelo actual", "nube de electrones", cloud), W),
  };
})();

const niveles = (() => {
  const cx = 100, cy = 112, rs = [28, 58, 88];
  const rings = rs.map((r) => circ(cx, cy, r, "d-line")).join("");
  const els = [[28, 2, 20], [58, 8, 10], [88, 1, 250]].flatMap(([r, n, off]) => Array.from({ length: n }, (_, i) => { const [x, y] = pt(cx, cy, r, off + (360 / n) * i); return electron(x, y, 5); })).join("");
  const row = (y, n, a, b) => `${circ(222, y, 11, "d-box-line")}<text class="d-a" x="222" y="${y + 5}" text-anchor="middle">${n}</text><text class="d-t" x="242" y="${y + 5}">${a}</text>${note(242, y + 21, b, 112)}`;
  return {
    caption: "Los electrones se reparten en **niveles de energía**. El sodio (Z = 11) tiene 2 + 8 + 1 electrones.",
    svg: fig("f-04-niv", "Átomo de sodio con sus 11 electrones repartidos en tres niveles de energía", 226, `
      ${rings}${circ(cx, cy, 10, "d-fill-acc")}${els}
      ${row(52, 1, "Nivel 1", "el más cercano: caben 2")}
      ${row(120, 2, "Nivel 2", "caben hasta 8")}
      ${row(188, 3, "Nivel 3", "hay 1 electrón")}`, W),
  };
})();

const salto = (() => {
  const y1 = 206, y2 = 136, y3 = 66;
  const lv = (y, n) => `<path class="d-line" d="M20 ${y}H340"/><text class="d-t" x="22" y="${y - 8}">Nivel ${n}</text>`;
  const wave = (x, ya, yb, cls) => {
    const pts = [];
    for (let k = 0; k <= 36; k++) { const t = k / 36; pts.push(`${(x + 6 * Math.sin(t * 20)).toFixed(1)} ${(ya + (yb - ya) * t).toFixed(1)}`); }
    return `<path class="${cls}" d="M${pts.join("L")}"/>`;
  };
  return {
    caption: "El electrón **sube** al absorber energía y, al **bajar**, la devuelve como luz. Cuanto más grande la caída, más energía tiene la luz.",
    svg: fig("f-04-sal", "Un electrón absorbe energía y sube de nivel; al caer emite luz de un color", 284, `
      ${lv(y1, 1)}${lv(y2, 2)}${lv(y3, 3)}
      <path class="d-flow-acc" marker-end="url(#f-04-sala)" d="M100 ${y1 - 4}V${y2 + 6}"/>
      ${note(114, y2 + 28, "Absorbe energía y sube", 100, "d-a")}
      ${wave(238, y2 + 8, y1 - 8, "d-stroke-3")}
      ${note(250, y2 + 28, "Cae y emite luz verde", 70, "d-s")}
      ${wave(336, y3 + 8, y1 - 8, "d-stroke-1")}
      ${note(318, y3 + 26, "Caída grande: luz azul", 110, "d-s", "end")}
      ${note(180, 260, "Cada metal tiene sus saltos: por eso su color.", 340, "d-s", "middle")}`, W),
  };
})();

const metal = (() => {
  const panel = (x, title, sub, inner) => `<rect class="d-box-line" x="${x}" y="8" width="170" height="214" rx="${R.box}"/>
    <text class="d-t" x="${x + 85}" y="30" text-anchor="middle">${title}</text>${inner}
    ${note(x + 85, 178, sub, 150, "d-s", "middle")}`;
  const ions = [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => `${circ(41 + c * 50, 62 + r * 32, 9, "d-fill-acc")}`)).join("");
  const free = [[66, 62], [116, 94], [66, 126], [116, 62], [66, 94], [116, 126]].map(([x, y]) => electron(x, y, 5)).join("");
  const flow = `<path class="d-flow-acc" marker-end="url(#f-04-meta)" d="M40 152H146"/>`;
  const bound = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([c, r]) => {
    const x = 190 + 42 + c * 86, y = 66 + r * 50;
    return `${circ(x, y, 15, "d-line")}${circ(x, y, 7, "d-fill-acc")}${electron(x + 15, y, 4)}`;
  }).join("");
  return {
    caption: "En un **metal** los electrones externos se sueltan y se mueven entre los átomos: por eso conduce la electricidad y el calor.",
    svg: fig("f-04-met", "Un metal con electrones libres y un no metal con electrones sujetos a sus átomos", 230,
      panel(6, "Metal", "Electrones libres: llevan la electricidad y el calor", ions + free + flow) +
      panel(184, "No metal", "Electrones sujetos a su átomo: no pasan de uno a otro", bound), W),
  };
})();

const tabla = (() => {
  const x0 = 28, y0 = 36, c = 17;
  const metaloid = new Set(["2,13", "3,14", "4,14", "4,15", "5,15", "5,16", "6,17"]);
  const nonmetal = new Set(["1,1", "2,14", "2,15", "2,16", "2,17", "3,15", "3,16", "3,17", "4,16", "4,17", "5,17"]);
  const cells = [];
  for (let p = 1; p <= 7; p++) for (let g = 1; g <= 18; g++) {
    if (p === 1 && g > 1 && g < 18) continue;
    if ((p === 2 || p === 3) && g > 2 && g < 13) continue;
    const k = `${p},${g}`;
    const cls = g === 18 ? "d-fill-4" : nonmetal.has(k) ? "d-fill-3" : metaloid.has(k) ? "d-fill-6" : "d-fill-1";
    cells.push(`<rect class="${cls}" x="${x0 + (g - 1) * c}" y="${y0 + (p - 1) * c}" width="${c - 1}" height="${c - 1}" rx="2"/>`);
  }
  const rows = Array.from({ length: 7 }, (_, i) => `<text class="d-n" x="${x0 - 6}" y="${y0 + i * c + 13}" text-anchor="end">${i + 1}</text>`).join("");
  const leg = (x, y, cls, t) => `<rect class="${cls}" x="${x}" y="${y}" width="14" height="14" rx="2"/><text class="d-s" x="${x + 20}" y="${y + 12}">${t}</text>`;
  return {
    caption: "Las **filas** son los periodos (1 a 7) y las **columnas** son los grupos (1 a 18). Casi todos los elementos son metales.",
    svg: fig("f-04-tab", "Tabla periódica simplificada con metales, no metales, metaloides y gases nobles de colores", 214, `
      <text class="d-s" x="${x0}" y="14">Grupo 1</text><text class="d-s" x="${x0 + 18 * c - 1}" y="14" text-anchor="end">Grupo 18</text>
      <text class="d-s" x="6" y="${y0 - 8}">Periodo</text>
      ${rows}${cells.join("")}
      ${leg(28, 168, "d-fill-1", "Metales")}${leg(130, 168, "d-fill-3", "No metales")}
      ${leg(28, 190, "d-fill-6", "Metaloides")}${leg(130, 190, "d-fill-4", "Gases nobles (grupo 18)")}`, W),
  };
})();

export default { "04-atomo": atomo, "04-modelos": modelos, "04-nube": nube, "04-niveles": niveles, "04-salto": salto, "04-metal": metal, "04-tabla": tabla };
