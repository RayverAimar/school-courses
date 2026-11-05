// Figures of "Evolución y biodiversidad". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, chain, R } from "../../platform/build/figkit.mjs";

const W = 360;
const dot = (x, y, cls, r = 7) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;

// ── El árbol de la vida ──
const leaf = (x, t, e) => `<rect class="d-box" x="${x}" y="8" width="70" height="58" rx="${R.box}"/><text class="d-s" x="${x + 35}" y="33" text-anchor="middle">${t}</text><text class="d-s" x="${x + 35}" y="52" text-anchor="middle" opacity="0.7">${e}</text>`;
const arbol = {
  caption: "Todos los seres vivos descienden de un **ancestro común**. Cada rama que se separa da un grupo nuevo.",
  svg: fig("f-13-arb", "Árbol de la vida: del ancestro común salen las bacterias, que no tienen núcleo, y los eucariotas, de los que salen protistas, hongos, plantas y animales", 268, `
    <path class="d-flow" d="M37 66V170H180"/>
    <path class="d-flow" d="M109 96H325M109 66V96M181 66V96M253 66V96M325 66V96"/>
    <path class="d-flow" d="M217 96V132L180 170"/>
    <path class="d-flow" d="M180 170V206"/>
    ${leaf(2, "Monera", "bacterias")}
    ${leaf(74, "Protistas", "ameba")}
    ${leaf(146, "Hongos", "levadura")}
    ${leaf(218, "Plantas", "quinua")}
    ${leaf(290, "Animales", "vicuña")}
    ${note(46, 124, "Procariotas: sin núcleo", 100, "d-s")}
    ${note(226, 128, "Eucariotas: con núcleo", 130, "d-s")}
    ${box(60, 208, 240, 52, "Ancestro común", ["de todos los seres vivos"], "d-acc")}`, W),
};

// ── Los cuatro pasos de la selección natural ──
const pasos = (() => {
  const c = chain("f-13-ps", [
    ["1. Variación", "los individuos no son iguales"],
    ["2. Herencia", "los hijos se parecen a sus padres"],
    ["3. Supervivencia", "sobreviven más los mejor adaptados", "d-acc"],
    ["4. Reproducción", "dejan más crías con ese rasgo", "d-acc"],
  ], { per: 2, ch: 92, gap: 34, m: 6, W, closing: true });
  return {
    caption: "La **selección natural** se repite generación tras generación: el rasgo útil se vuelve cada vez más común.",
    svg: fig("f-13-ps", "Los cuatro pasos de la selección natural: variación, herencia, supervivencia y reproducción, que se repiten", c.h, c.svg, W),
  };
})();

// ── Bacterias resistentes ──
const bacterias = (() => {
  const panel = (x, title, sub, inner) =>
    `<rect class="d-box-line" x="${x}" y="10" width="108" height="108" rx="${R.box}"/>${inner}<text class="d-t" x="${x + 54}" y="140" text-anchor="middle">${title}</text><text class="d-s" x="${x + 54}" y="158" text-anchor="middle">${sub}</text>`;
  const slots = (x0) => [[22, 34], [54, 30], [84, 36], [34, 62], [68, 60], [92, 74], [22, 90], [50, 92], [78, 100], [96, 50]].map(([dx, dy]) => [x0 + dx, dy + 6]);
  const pos1 = slots(6), pos2 = slots(126), pos3 = slots(246);
  const red = 4;
  const p1 = pos1.map(([x, y], i) => dot(x, y, i === red ? "d-fill-5" : "d-fill-1")).join("");
  const p2 = pos2.map(([x, y], i) => (i === red ? dot(x, y, "d-fill-5") : `<circle class="d-stroke-1" style="fill:none;stroke-dasharray:3 3" cx="${x}" cy="${y}" r="7"/>`)).join("");
  const p3 = pos3.map(([x, y]) => dot(x, y, "d-fill-5")).join("");
  return {
    caption: "Con el antibiótico mueren casi todas las bacterias, pero la que **ya era resistente** sobrevive y se multiplica.",
    svg: fig("f-13-bac", "Tres cuadros: antes hay muchas bacterias sensibles y una resistente; con el antibiótico solo queda la resistente; después, todas las bacterias son resistentes", 232,
      panel(6, "Antes", "1 resistente", p1) + panel(126, "Antibiótico", "mueren las sensibles", p2) + panel(246, "Después", "todas resistentes", p3) + `
      ${dot(60, 196, "d-fill-1", 7)}${note(74, 201, "sensible", 70)}${dot(176, 196, "d-fill-5", 7)}${note(190, 201, "resistente", 80)}`, W),
  };
})();

// ── Pinzones: un ancestro, picos distintos ──
const picos = (() => {
  const col = (cx, beak, title, sub) =>
    `${dot(cx - 20, 118, "d-obj", 20)}<path class="d-fill-2" d="${beak}"/>${box(cx - 54, 150, 108, 76, title, sub)}`;
  return {
    caption: "Un pinzón ancestro llegó a las islas. Con el tiempo, cada grupo se adaptó al alimento de su isla y formó **especies distintas**.",
    svg: fig("f-13-pic", "Un pinzón ancestro da origen a tres tipos de pinzones: de pico grueso para semillas duras, de pico fino para insectos y de pico largo para flores de cactus", 240, `
      ${box(60, 4, 240, 46, "Un pinzón ancestro", ["llegó a las islas"], "d-acc")}
      <path class="d-flow" marker-end="url(#f-13-pic)" d="M130 50L70 92"/><path class="d-flow" marker-end="url(#f-13-pic)" d="M180 50V92"/><path class="d-flow" marker-end="url(#f-13-pic)" d="M230 50L290 92"/>
      ${col(70, "M52 106L78 118L52 132Z", "Pico grueso", ["semillas duras"])}
      ${col(180, "M162 113L222 118L162 123Z", "Pico fino", ["insectos"])}
      ${col(290, "M272 112Q300 112 318 134Q298 122 272 124Z", "Pico largo", ["flores de cactus"])}`, W),
  };
})();

// ── Selección artificial: elegir los mejores, generación tras generación ──
const artificial = (() => {
  const rows = [
    ["Generación 1", [6, 9, 7, 11, 8, 12, 7, 10], [3, 5]],
    ["Generación 2", [9, 11, 10, 13, 12, 14, 10, 12], [3, 5]],
    ["Generación 3", [13, 14, 15, 16, 14, 17, 15, 16], []],
  ];
  const out = rows.map(([t, rs, pick], k) => {
    const y = 16 + k * 76;
    const dots = rs.map((r, i) => dot(28 + i * 44, y + 40, pick.includes(i) ? "d-fill-3" : "d-obj", r)).join("");
    return `${note(8, y + 4, t, 150, "d-t")}${dots}`;
  }).join("");
  return {
    caption: "Cada generación el agricultor siembra solo lo **más grande** (verde): sin que nadie lo planee, el tamaño medio sube.",
    svg: fig("f-13-art", "Tres filas de granos: en cada generación se eligen los más grandes para sembrarlos y los granos de la siguiente fila son más grandes", 258, out + `${dot(28, 244, "d-fill-3", 6)}${note(42, 249, "elegidos para sembrar", 160)}`, W),
  };
})();

// ── Perfil del Perú ──
const perfil = {
  caption: "En pocos cientos de kilómetros, de oeste a este, el Perú pasa del mar a la costa desértica, los Andes y la selva.",
  svg: fig("f-13-pf", "Perfil del Perú de oeste a este: el mar frío, la costa desértica, los Andes con el Huascarán de 6 768 metros, la selva alta y la selva baja", 292, `
    <rect class="d-water" x="4" y="224" width="70" height="26" rx="4"/>
    <path class="d-obj" d="M74 224L92 221L110 203L132 150L158 92L185 66L212 98L232 130L258 132L276 172L290 205L298 220V250H74Z"/>
    <rect class="d-fill-3" x="298" y="220" width="56" height="30" rx="4"/>
    <text class="d-t" x="185" y="52" text-anchor="middle">Huascarán 6 768 m</text>
    <text class="d-s" x="39" y="270" text-anchor="middle">Mar</text>
    <text class="d-s" x="104" y="270" text-anchor="middle">Costa</text>
    <text class="d-s" x="178" y="270" text-anchor="middle">Sierra y puna</text>
    <text class="d-s" x="262" y="286" text-anchor="middle">Selva alta</text>
    <text class="d-s" x="326" y="270" text-anchor="middle">Selva baja</text>`, W),
};

// ── Datos de las polillas de Manchester ──
const polillas = (() => {
  const X = 74, B = 90, TOP = 20, SC = 1.9;
  const bar = (x, v, lab) => `<rect class="d-fill-acc" x="${x}" y="${TOP + (100 - v) * SC}" width="70" height="${v * SC}" rx="${R.bar}"/>${note(x + 35, TOP + (100 - v) * SC - 6, v + " %", 60, "d-n", "middle")}${note(x + 35, TOP + 100 * SC + 22, lab, 90, "d-s", "middle")}`;
  const ticks = [0, 50, 100].map((v) => `${note(X - 8, TOP + (100 - v) * SC + 5, String(v), 30, "d-n", "end")}<path class="d-line" d="M${X} ${TOP + (100 - v) * SC}H${X + 8}"/>`).join("");
  return {
    caption: "Porcentaje de polillas oscuras en Manchester (Inglaterra) cuando las fábricas llenaron de hollín los troncos.",
    svg: fig("f-13-pol", "Gráfica de barras: las polillas oscuras eran alrededor del 2 por ciento en 1848 y el 98 por ciento en 1895", 250, `
      <path class="d-line" d="M${X} ${TOP - 6}V${TOP + 100 * SC}H${W - 20}"/>${ticks}
      ${note(84, 12, "% de polillas oscuras", 170, "d-s")}
      ${bar(B + 30, 2, "1848")}${bar(B + 150, 98, "1895")}`, W),
  };
})();

export default {
  "13-arbol-vida": arbol,
  "13-pasos-seleccion": pasos,
  "13-bacterias-resistentes": bacterias,
  "13-picos-pinzones": picos,
  "13-seleccion-artificial": artificial,
  "13-perfil-peru": perfil,
  "13-polillas-datos": polillas,
};
