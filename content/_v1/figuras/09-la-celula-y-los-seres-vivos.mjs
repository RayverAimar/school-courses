// Figures of "La célula y los seres vivos". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../../platform/build/figkit.mjs";

const W = 360;
const arrow = (id, x1, y1, x2, y2, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x1} ${y1}L${x2} ${y2}"/>`;
const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
const ell = (x, y, rx, ry, cls, rot = 0) => `<ellipse class="${cls}" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ""}/>`;
const lead = (x1, y1, x2, y2) => `<path class="d-line" d="M${x1} ${y1}L${x2} ${y2}"/>`;
// A label at the left (text ends at x) or right (text starts at x) of a cell, with a leader line to the part.
const left = (y, text, tx, ty) => `${note(76, y + 4, text, 76, "d-s", "end")}${lead(82, y, tx, ty)}`;
const right = (y, text, tx, ty) => `${note(284, y + 4, text, 76, "d-s", "start")}${lead(278, y, tx, ty)}`;
const left2 = (y, lines, tx, ty) => `<text class="d-s" x="76" y="${y - 4}" text-anchor="end"><tspan x="76">${lines[0]}</tspan><tspan x="76" dy="16">${lines[1]}</tspan></text>${lead(82, y, tx, ty)}`;
const right2 = (y, lines, tx, ty) => `<text class="d-s" x="284" y="${y - 4}" text-anchor="start"><tspan x="284">${lines[0]}</tspan><tspan x="284" dy="16">${lines[1]}</tspan></text>${lead(278, y, tx, ty)}`;
const dots = (pts, r = 2.5) => pts.map(([x, y]) => circ(x, y, r, "d-fill-acc")).join("");
const mito = (x, y, rot) => `${ell(x, y, 15, 8, "d-flow", rot)}<path class="d-line" transform="rotate(${rot} ${x} ${y})" d="M${x - 9} ${y}Q${x - 5} ${y - 5} ${x - 3} ${y}T${x + 3} ${y}T${x + 9} ${y}"/>`;
const cloro = (x, y, rot) => `${ell(x, y, 12, 6.5, "d-acc", rot)}${ell(x, y, 12, 6.5, "d-flow", rot)}<path class="d-line" transform="rotate(${rot} ${x} ${y})" d="M${x - 6} ${y - 2}h12M${x - 6} ${y + 2}h12"/>`;
const golgi = (x, y) => [0, 1, 2, 3].map((i) => `<path class="d-flow" d="M${x - 18 + i * 2} ${y + i * 8}Q${x} ${y - 5 + i * 8} ${x + 18 - i * 2} ${y + i * 8}"/>`).join("");
const reticulo = (x, y) => `<path class="d-flow" d="M${x} ${y}q14 -6 28 0t28 0M${x} ${y + 9}q14 -6 28 0t28 0M${x} ${y + 18}q14 -6 28 0t28 0"/>${dots([[x + 6, y - 3], [x + 20, y + 5], [x + 34, y - 3], [x + 48, y + 5], [x + 12, y + 14], [x + 40, y + 14]], 2)}`;

// ── El microscopio ──
const microscopio = (() => {
  const o = -8;
  const X = (x) => x + o;
  const left3 = (y, text, tx) => `${note(88, y + 4, text, 88, "d-s", "end")}${lead(94, y, X(tx), y)}`;
  const right3 = (y, text, tx, lines = 1) => `${lines === 1 ? note(272, y + 4, text, 88, "d-s", "start") : note(272, y - 4, text, 88, "d-s", "start")}${lead(X(tx), y, 266, y)}`;
  return {
    caption: "Las partes de un microscopio óptico. Arriba, el **ocular**; abajo, los **objetivos**; en medio, la **platina** con la muestra.",
    svg: fig("f-09-mic", "Un microscopio óptico con sus partes: ocular, tubo, revólver, objetivo, platina, diafragma, fuente de luz, brazo, tornillos macrométrico y micrométrico, y base", 316, `
      <rect class="d-box" x="${X(120)}" y="296" width="124" height="12" rx="4"/>
      <path class="d-box" d="M${X(214)} 86L${X(236)} 86C${X(276)} 140 ${X(278)} 240 ${X(236)} 296L${X(206)} 296C${X(240)} 240 ${X(238)} 150 ${X(214)} 100Z"/>
      <rect class="d-box" x="${X(150)}" y="62" width="34" height="86" rx="3"/>
      <rect class="d-box" x="${X(180)}" y="82" width="42" height="14" rx="3"/>
      <rect class="d-acc" x="${X(156)}" y="34" width="22" height="30" rx="3"/>
      <rect class="d-box-line" x="${X(144)}" y="148" width="46" height="10" rx="3"/>
      <rect class="d-acc" x="${X(158)}" y="158" width="18" height="32" rx="3"/>
      <rect class="d-box" x="${X(110)}" y="214" width="118" height="8" rx="2"/>
      <rect class="d-fill-hair" x="${X(134)}" y="209" width="50" height="5" rx="1"/>
      <rect class="d-box-line" x="${X(152)}" y="230" width="30" height="10" rx="3"/>
      <rect class="d-acc" x="${X(148)}" y="266" width="38" height="24" rx="5"/>
      ${circ(X(250), 186, 10, "d-box-line")}${circ(X(250), 186, 4, "d-fill-hair")}
      ${circ(X(250), 214, 6, "d-box-line")}${circ(X(250), 214, 2.5, "d-fill-acc")}
      ${left3(48, "Ocular", 156)}${left3(104, "Tubo", 150)}${left3(153, "Revólver", 144)}${left3(176, "Objetivo", 158)}${left3(218, "Platina", 110)}${left3(235, "Diafragma", 152)}${left3(278, "Fuente de luz", 148)}
      ${right3(112, "Brazo", 232)}
      <text class="d-s" x="272" y="182" text-anchor="start"><tspan x="272">Tornillo</tspan><tspan x="272" dy="16">macro-</tspan><tspan x="272" dy="16">métrico</tspan></text>${lead(X(262), 186, 266, 186)}
      ${note(272, 232, "Tornillo micrométrico", 88, "d-s", "start")}${lead(X(257), 214, 266, 214)}
      ${right3(302, "Base", 244)}`, W),
  };
})();

const aumento = {
  caption: "El **aumento total** se calcula multiplicando el aumento del ocular por el del objetivo.",
  svg: fig("f-09-aum", "Aumento total igual a ocular por objetivo: 10 por 40 es 400 aumentos, y 10 por 100 es 1000 aumentos", 214, `
    ${box(6, 10, 82, 62, "Ocular", "10×")}
    ${note(99, 48, "×", 20, "d-t", "middle")}
    ${box(110, 10, 82, 62, "Objetivo", "40×")}
    ${note(204, 48, "=", 20, "d-t", "middle")}
    ${box(216, 10, 138, 62, "Aumento total", "400×", "d-acc")}
    ${box(6, 100, 82, 62, "Ocular", "10×")}
    ${note(99, 138, "×", 20, "d-t", "middle")}
    ${box(110, 100, 82, 62, "Objetivo", "100×")}
    ${note(204, 138, "=", 20, "d-t", "middle")}
    ${box(216, 100, 138, 62, "Aumento total", "1000×", "d-acc")}
    ${note(180, 196, "Con 400× ves la muestra 400 veces más grande", 330, "d-s", "middle")}`, W),
};

// ── Procariota y eucariota ──
const procEuc = (() => {
  const panel = (x, title, inner, l1, l2, l3) => `<rect class="d-box-line" x="${x}" y="6" width="170" height="272" rx="${R.box}"/>
    <text class="d-t" x="${x + 85}" y="28" text-anchor="middle">${title}</text>${inner}
    <text class="d-s" x="${x + 85}" y="206" text-anchor="middle">${l1}</text>
    <text class="d-s" x="${x + 85}" y="226" text-anchor="middle">${l2}</text>
    <text class="d-s" x="${x + 85}" y="246" text-anchor="middle">${l3}</text>`;
  const bx = 100, by = 108;
  const proc = `<rect class="d-box" x="${bx - 58}" y="${by - 38}" width="116" height="76" rx="38"/><rect class="d-flow-acc" x="${bx - 58}" y="${by - 38}" width="116" height="76" rx="38"/>
    <path class="d-flow" d="M${bx - 22} ${by}q8 -22 16 -6t16 -8t12 12t-10 12t-14 -6t-16 6"/>
    ${dots([[bx - 36, by - 14], [bx - 38, by + 14], [bx + 38, by - 12], [bx + 36, by + 16], [bx + 20, by + 22]], 2.5)}
`;
  const ex = 270, ey = 108;
  const euc = `${circ(ex, ey, 62, "d-box")}${circ(ex, ey, 62, "d-flow-acc")}${circ(ex - 8, ey - 4, 26, "d-acc")}${circ(ex - 8, ey - 4, 26, "d-flow")}
    <path class="d-flow" d="M${ex - 18} ${ey - 4}q6 -12 12 -2t12 0"/>
    ${mito(ex + 28, ey + 28, -25)}${mito(ex - 34, ey + 34, 20)}${dots([[ex + 30, ey - 30], [ex + 38, ey - 8], [ex - 40, ey - 36], [ex - 4, ey + 40]], 2.5)}`;
  return {
    caption: "La célula **procariota** no tiene núcleo; la **eucariota** guarda su ADN en un núcleo y tiene organelos con membrana. Los puntos son ribosomas.",
    svg: fig("f-09-pe", "Dos células: la procariota, alargada y con el ADN suelto en el interior, y la eucariota, redonda y con un núcleo", 290, `
      ${panel(6, "Procariota", proc, "Sin núcleo", "ADN suelto, sin envoltura", "Tamaño: 1 a 10 µm")}
      ${panel(184, "Eucariota", euc, "Con núcleo", "ADN dentro del núcleo", "Tamaño: 10 a 100 µm")}`, W),
  };
})();

// ── Célula animal ──
const animal = {
  caption: "Célula animal (eucariota). Casi todos sus organelos están también en la célula vegetal.",
  svg: fig("f-09-an", "Una célula animal con su membrana, citoplasma, núcleo, mitocondrias, retículo endoplasmático, aparato de Golgi, ribosomas, lisosoma y vacuola", 270, `
    ${ell(180, 136, 94, 100, "d-box")}${ell(180, 136, 94, 100, "d-flow-acc")}
    ${circ(168, 104, 28, "d-acc")}${circ(168, 104, 28, "d-flow")}${circ(172, 108, 8, "d-fill-acc")}
    ${reticulo(200, 84)}
    ${mito(214, 160, -20)}${mito(144, 196, 25)}
    ${golgi(206, 190)}
    ${circ(126, 152, 7, "d-fill-hair")}${circ(126, 152, 7, "d-flow")}
    ${circ(134, 120, 9, "d-box-line")}
    ${dots([[150, 150], [158, 168], [190, 140], [172, 158], [232, 134], [150, 138]], 2.5)}
    ${left(52, "Membrana", 112, 64)}
    ${left(104, "Núcleo", 144, 104)}
    ${left(122, "Vacuola", 125, 120)}
    ${left(156, "Lisosoma", 119, 154)}
    ${left(180, "Ribosomas", 150, 150)}
    ${right(62, "Citoplasma", 252, 74)}
    ${right(98, "Retículo", 256, 98)}
    ${right(158, "Mitocondria", 229, 158)}
    ${right2(204, ["Aparato", "de Golgi"], 224, 198)}`, W),
};

// ── Célula vegetal ──
const vegetal = {
  caption: "Célula vegetal. Además de lo que tiene la animal, tiene **pared celular**, **cloroplastos** y una **vacuola grande**.",
  svg: fig("f-09-ve", "Una célula vegetal rectangular con pared celular, membrana, vacuola grande en el centro, núcleo, cloroplastos y mitocondrias", 270, `
    <rect class="d-box" x="96" y="20" width="168" height="232" rx="12"/>
    <rect class="d-flow-acc" x="96" y="20" width="168" height="232" rx="12" style="stroke-width:5"/>
    <rect class="d-flow" x="104" y="28" width="152" height="216" rx="8"/>
    <rect class="d-box-line" x="136" y="82" width="86" height="116" rx="26"/>
    ${circ(124, 66, 17, "d-acc")}${circ(124, 66, 17, "d-flow")}${circ(124, 66, 5, "d-fill-acc")}
    ${cloro(122, 128, 70)}
    ${cloro(124, 176, 110)}
    ${cloro(238, 120, 100)}
    ${cloro(236, 174, 60)}
    ${mito(190, 224, 0)}${mito(230, 60, -20)}
    ${left(26, "Pared celular", 98, 36)}
    ${left(66, "Núcleo", 106, 66)}
    ${left(128, "Cloroplasto", 114, 128)}
    ${left(222, "Mitocondria", 175, 224)}
    ${right(44, "Membrana", 255, 40)}
    ${right2(150, ["Vacuola", "grande"], 223, 148)}
    ${right(240, "Citoplasma", 252, 236)}`, W),
};

// ── Niveles de organización ──
const niveles = (() => {
  const rows = [
    ["Átomo", "el carbono, el oxígeno"],
    ["Molécula", "agua, glucosa, ADN"],
    ["Célula", "una célula muscular"],
    ["Tejido", "el tejido muscular"],
    ["Órgano", "el corazón"],
    ["Sistema", "el sistema circulatorio"],
    ["Organismo", "una persona, una vicuña"],
    ["Población", "las vicuñas de una reserva"],
    ["Comunidad", "vicuñas, ichu, cóndores y zorros"],
    ["Ecosistema", "la puna con su clima y suelo"],
    ["Biósfera", "toda la vida de la Tierra"],
  ];
  const H0 = 32, G = 10;
  const body = rows.map(([t, e], i) => {
    const y = 8 + i * (H0 + G);
    const cls = t === "Organismo" ? "d-acc" : "d-box";
    return `${box(6, y, 112, H0, t, "", cls)}${note(132, y + 20, e, 222, "d-s")}${i < rows.length - 1 ? arrow("f-09-niv", 62, y + H0 + 1, 62, y + H0 + G - 1) : ""}`;
  }).join("");
  return {
    caption: "Cada nivel está formado por los de abajo. Del **organismo** hacia arriba se estudian en **ecología**.",
    svg: fig("f-09-niv", "Escalera de los niveles de organización: átomo, molécula, célula, tejido, órgano, sistema, organismo, población, comunidad, ecosistema y biósfera, con un ejemplo de cada uno", 8 + rows.length * (H0 + G), body, W),
  };
})();

// ── Los reinos ──
const reinos = {
  caption: "Los seres vivos se agrupan primero por su tipo de célula y luego en cinco **reinos**.",
  svg: fig("f-09-rei", "Los seres vivos se dividen en procariotas, con el reino Monera, y eucariotas, con los reinos Protista, Hongos, Plantas y Animales", 270, `
    ${box(110, 6, 140, 38, "Seres vivos", "")}
    ${arrow("f-09-rei", 150, 45, 71, 78)}${arrow("f-09-rei", 210, 45, 252, 78)}
    <rect class="d-box-line" x="6" y="80" width="130" height="184" rx="${R.box}"/>
    ${note(71, 102, "Procariotas", 120, "d-t", "middle")}
    ${box(14, 114, 114, 70, "Monera", ["bacterias"], "d-acc")}
    ${note(71, 214, "sin núcleo", 110, "d-s", "middle")}
    <rect class="d-box-line" x="148" y="80" width="208" height="184" rx="${R.box}"/>
    ${note(252, 102, "Eucariotas (con núcleo)", 200, "d-t", "middle")}
    ${box(156, 114, 94, 68, "Protistas", ["paramecio"], "d-box")}
    ${box(254, 114, 94, 68, "Hongos", ["champiñón"], "d-box")}
    ${box(156, 190, 94, 66, "Plantas", ["quinua"], "d-acc")}
    ${box(254, 190, 94, 66, "Animales", ["vicuña"], "d-acc")}`, W),
};

// ── De qué está hecha una célula ──
const composicion = (() => {
  const data = [["Agua", 70], ["Proteínas", 15], ["Ácidos nucleicos", 7], ["Sales y otras", 5], ["Lípidos", 2], ["Carbohidratos", 1]];
  const X0 = 138, SC = 1.9;
  const rows = data.map(([n, v], i) => {
    const y = 12 + i * 34;
    return `${note(130, y + 16, n, 128, "d-s", "end")}<rect class="${i === 0 ? "d-fill-acc" : "d-fill-hair"}" x="${X0}" y="${y}" width="${v * SC}" height="22" rx="${R.bar}"/>${note(X0 + v * SC + 6, y + 16, v + " %", 40, "d-n")}`;
  }).join("");
  return {
    caption: "Más o menos, así se reparte la masa de una célula (valores aproximados). La mayor parte es **agua**.",
    svg: fig("f-09-comp", "Gráfica de barras de lo que contiene una célula: agua 70 por ciento, proteínas 15, ácidos nucleicos 7, sales y otras sustancias 5, lípidos 2 y carbohidratos 1", 218, rows, W),
  };
})();

export default {
  "09-microscopio": microscopio,
  "09-aumento": aumento,
  "09-proc-euc": procEuc,
  "09-celula-animal": animal,
  "09-celula-vegetal": vegetal,
  "09-niveles": niveles,
  "09-reinos": reinos,
  "09-composicion": composicion,
};
