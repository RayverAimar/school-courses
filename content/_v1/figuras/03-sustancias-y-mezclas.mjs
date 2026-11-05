// Figures of "Sustancias y mezclas". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../../platform/build/figkit.mjs";

const W = 360;
const dot = (x, y, cls, r = 7) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
const arrow = (id, x1, y1, x2, y2, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x1} ${y1}L${x2} ${y2}"/>`;

const particulas = (() => {
  const panel = (x, title, sub, inner) =>
    `<rect class="d-box-line" x="${x}" y="10" width="108" height="108" rx="${R.box}"/>${inner}<text class="d-t" x="${x + 54}" y="140" text-anchor="middle">${title}</text><text class="d-s" x="${x + 54}" y="158" text-anchor="middle">${sub}</text>`;
  const grid = (x0, f) => [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => f(x0 + 22 + c * 32, 32 + r * 32, r, c))).join("");
  const el = grid(6, (x, y) => dot(x, y, "d-fill-acc"));
  const co = grid(126, (x, y) => `${dot(x - 5, y, "d-fill-acc", 6)}${dot(x + 6, y, "d-fill-hair", 5)}`);
  const mx = grid(246, (x, y, r, c) => ((r + c) % 2 ? dot(x + (c % 2 ? 4 : -3), y + (r % 2 ? -4 : 3), "d-fill-hair", 6) : dot(x, y, "d-fill-acc", 7)));
  return {
    caption: "Un **elemento** tiene un solo tipo de átomo; en un **compuesto** los átomos están unidos; en una **mezcla** las partículas solo están juntas.",
    svg: fig("f-03-part", "Partículas de un elemento, un compuesto y una mezcla", 170,
      panel(6, "Elemento", "un tipo de átomo", el) + panel(126, "Compuesto", "átomos unidos", co) + panel(246, "Mezcla", "solo juntas", mx), W),
  };
})();

const separar = {
  caption: "Antes de elegir el método, pregúntate si el sólido está **disuelto**.",
  svg: fig("f-03-sep", "Cómo elegir el método para separar un sólido de un líquido", 250, `
    ${box(70, 8, 220, 50, "¿El sólido está disuelto?", "", "d-acc")}
    ${arrow("f-03-sep", 130, 58, 80, 104)}${arrow("f-03-sep", 230, 58, 280, 104, true)}
    <text class="d-s" x="88" y="84" text-anchor="end">No</text><text class="d-a" x="272" y="84">Sí</text>
    ${box(6, 108, 160, 70, "Filtrar o decantar", ["arena, tierra, aceite"])}
    ${box(194, 108, 160, 70, "Evaporar o destilar", ["sal, azúcar"], "d-acc")}
    ${note(86, 206, "Los granos no pasan el filtro", 150, "d-s", "middle")}
    ${note(274, 206, "Lo disuelto atraviesa cualquier filtro", 150, "d-s", "middle")}`, W),
};


const clasificacion = {
  caption: "La materia se clasifica en **sustancias puras** y **mezclas**; cada grupo tiene dos tipos.",
  svg: fig("f-03-cla", "Clasificación de la materia en sustancias puras y mezclas", 282, `
    ${box(115, 6, 130, 38, "Materia", "")}
    ${arrow("f-03-cla", 150, 44, 92, 78)}${arrow("f-03-cla", 210, 44, 268, 78, true)}
    ${box(4, 82, 172, 40, "Sustancia pura", "")}
    ${box(184, 82, 172, 40, "Mezcla", "", "d-acc")}
    ${arrow("f-03-cla", 90, 122, 90, 142)}${arrow("f-03-cla", 270, 122, 270, 142, true)}
    ${box(4, 146, 172, 58, "Elemento", ["oro, oxígeno, hierro"])}
    ${box(4, 214, 172, 58, "Compuesto", ["agua, sal, azúcar"])}
    ${box(184, 146, 172, 58, "Homogénea", ["agua de mar, aire"], "d-box-line")}
    ${box(184, 214, 172, 58, "Heterogénea", ["ensalada, agua y aceite"], "d-box-line")}`, W),
};

const soluciones = (() => {
  const panel = (x, title, sub, n, pile) => {
    const pts = [[20,40],[50,52],[78,36],[34,68],[64,74],[88,60],[28,92],[56,100],[84,88]].slice(0, n);
    const dots = pts.map(([px, py]) => `<circle class="d-fill-acc" cx="${x + px}" cy="${py + 6}" r="3.5"/>`).join("");
    const heap = pile ? [18,34,50,66,82].map((px, i) => `<circle class="d-fill-acc" cx="${x + 12 + px}" cy="${118 - (i % 2) * 6}" r="5"/>`).join("") : "";
    return `<rect class="d-acc" x="${x + 4}" y="26" width="100" height="94" rx="6"/><rect class="d-box-line" x="${x + 4}" y="14" width="100" height="106" rx="8"/>${dots}${heap}<text class="d-t" x="${x + 54}" y="146" text-anchor="middle">${title}</text><text class="d-s" x="${x + 54}" y="164" text-anchor="middle">${sub}</text>`;
  };
  return {
    caption: "Misma cantidad de agua: la **diluida** tiene poco soluto, la **concentrada** mucho y la **saturada** ya no admite más.",
    svg: fig("f-03-sol", "Tres vasos con agua: solución diluida, concentrada y saturada", 176,
      panel(0, "Diluida", "poco soluto", 3, false) + panel(124, "Concentrada", "mucho soluto", 9, false) + panel(248, "Saturada", "sobra en el fondo", 9, true), W),
  };
})();

const filtro = (() => {
  const funnel = (ox) => `<path class="d-line" d="M${ox + 25} 28L${ox + 75} 92L${ox + 75} 108M${ox + 145} 28L${ox + 95} 92L${ox + 95} 108"/><path class="d-dash" d="M${ox + 25} 28L${ox + 145} 28"/>
    <path class="d-line" d="M${ox + 62} 124L${ox + 62} 168L${ox + 108} 168L${ox + 108} 124"/>`;
  const small = (ox, pts) => pts.map(([x, y]) => `<circle class="d-fill-acc" cx="${ox + x}" cy="${y}" r="2.6"/>`).join("");
  const grains = [[78,84],[90,86],[84,78],[96,80],[72,80]].map(([x, y]) => `<circle class="d-fill-hair" cx="${x}" cy="${y}" r="5.5"/>`).join("");
  const sal = [[50,40],[70,48],[92,38],[112,46],[80,62],[104,66],[66,76],[92,80],[120,34],[58,58]];
  const sal2 = [[72,140],[88,152],[98,138],[80,160],[96,160],[70,152]];
  return {
    caption: "La arena son granos grandes y **se queda** en el papel. La sal disuelta son partículas diminutas que **pasan** con el agua.",
    svg: fig("f-03-fil", "Un filtro retiene la arena pero deja pasar la sal disuelta", 232, `
      ${funnel(0)}${grains}
      ${funnel(180)}${small(180, sal)}${small(180, sal2)}
      <text class="d-t" x="85" y="196" text-anchor="middle">Agua con arena</text>
      <text class="d-s" x="85" y="214" text-anchor="middle">la arena queda en el filtro</text>
      <text class="d-t" x="265" y="196" text-anchor="middle">Agua con sal</text>
      <text class="d-s" x="265" y="214" text-anchor="middle">la sal pasa con el agua</text>`, W),
  };
})();

const destilacion = {
  caption: "En la **destilación** el líquido hierve, el vapor se enfría en el condensador y vuelve a ser líquido en otro recipiente.",
  svg: fig("f-03-des", "Esquema de una destilación: matraz, condensador y recipiente", 252, `
    <circle class="d-acc" cx="58" cy="132" r="32"/><path class="d-line" d="M50 102L50 70M66 102L66 70"/>
    ${arrow("f-03-des", 58, 200, 58, 172, true)}
    <path class="d-flow" marker-end="url(#f-03-des)" d="M58 70L58 44L132 44"/>
    <path class="d-box-line" d="M132 30L268 84L260 104L124 50Z"/>
    ${arrow("f-03-des", 264, 104, 284, 150)}
    <path class="d-line" d="M266 156L266 214L336 214L336 156"/>
    <rect class="d-acc" x="268" y="196" width="66" height="16" rx="3"/>
    ${note(58, 220, "La mezcla se calienta", 112, "d-s", "middle")}
    ${note(84, 22, "Vapor", 60, "d-a", "middle")}
    ${note(222, 20, "Condensador", 100, "d-t", "middle")}
    ${note(176, 130, "se enfría con agua fría", 120, "d-s", "middle")}
    ${note(301, 240, "Destilado", 80, "d-t", "middle")}`, W),
};

const porcentaje = {
  caption: "10 g de azúcar en 90 g de agua: la solución pesa **100 g** y el azúcar es el **10 %**.",
  svg: fig("f-03-por", "Barra de 100 g de solución: 10 g de soluto y 90 g de solvente", 138, `
    <rect class="d-fill-acc" x="30" y="44" width="30" height="34" rx="4"/>
    <rect class="d-box" x="60" y="44" width="270" height="34" rx="4"/>
    ${note(45, 36, "soluto", 60, "d-a", "middle")}
    ${note(195, 36, "solvente", 80, "d-t", "middle")}
    <text class="d-a" x="45" y="100" text-anchor="middle">10 g</text>
    <text class="d-t" x="195" y="100" text-anchor="middle">90 g</text>
    <path class="d-line" d="M30 112L330 112M30 106L30 118M330 106L330 118"/>
    <text class="d-n" x="180" y="132" text-anchor="middle">100 g de solución = 100 %</text>`, W),
};

export default { "03-particulas": particulas, "03-clasificacion": clasificacion, "03-soluciones": soluciones, "03-filtro": filtro, "03-separar": separar, "03-destilacion": destilacion, "03-porcentaje": porcentaje };
