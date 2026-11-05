// Figures of "La materia y sus estados". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../../platform/build/figkit.mjs";

const W = 360;
const dot = (x, y, cls, r = 7) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
const arrow = (id, x1, y1, x2, y2, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x1} ${y1}L${x2} ${y2}"/>`;
const f1 = (n) => Math.round(n * 10) / 10;

// Measuring the volume of a stone by water displacement.
const desplazamiento = {
  caption: "El agua que **sube** es el volumen de la piedra: 65 − 50 = 15 mL = **15 cm³**.",
  svg: fig("f-02-des", "Una probeta con 50 mililitros de agua y la misma probeta con una piedra dentro, donde el agua sube a 65 mililitros", 262, `
    <rect class="d-acc" x="40" y="95" width="70" height="75"/>
    <rect class="d-box-line" x="40" y="20" width="70" height="150" rx="${R.cell}"/>
    ${note(118, 99, "50 mL", 60, "d-n")}
    <rect class="d-acc" x="220" y="72" width="70" height="98"/>
    ${dot(255, 154, "d-fill-acc", 15)}
    <rect class="d-box-line" x="220" y="20" width="70" height="150" rx="${R.cell}"/>
    ${note(298, 76, "65 mL", 60, "d-n")}
    ${note(75, 194, "1. Sin la piedra", 130, "d-t", "middle")}
    ${note(255, 194, "2. Con la piedra", 130, "d-t", "middle")}
    ${arrow("f-02-des", 128, 130, 206, 130, true)}
    ${box(60, 212, 240, 40, "Volumen de la piedra: 15 mL", "", "d-acc")}`, W),
};

const solidoLiquidoGas = (() => {
  const panel = (x, title, sub, inner) =>
    `<rect class="d-box-line" x="${x}" y="10" width="108" height="108" rx="${R.box}"/>${inner}<text class="d-t" x="${x + 54}" y="140" text-anchor="middle">${title}</text><text class="d-s" x="${x + 54}" y="158" text-anchor="middle">${sub}</text>`;
  const grid = (x0, f) => [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => f(x0 + 22 + c * 32, 32 + r * 32, r, c))).join("");
  const sol = grid(6, (x, y) => dot(x, y, "d-fill-acc", 13));
  const liqPos = [[146, 78], [172, 62], [198, 80], [152, 100], [180, 98], [206, 102], [140, 56], [200, 50], [168, 80]];
  const liq = liqPos.map(([x, y]) => dot(x, y, "d-fill-acc", 11)).join("");
  const gasPos = [[268, 32], [336, 44], [296, 66], [262, 96], [320, 100], [338, 76], [280, 40]];
  const gas = gasPos.map(([x, y]) => dot(x, y, "d-fill-acc", 7)).join("");
  return {
    caption: "Son las mismas partículas: lo que cambia es **qué tan juntas** están y **cuánto se mueven**.",
    svg: fig("f-02-part", "Partículas de un sólido ordenadas y juntas, de un líquido juntas pero desordenadas y de un gas muy separadas", 172,
      panel(6, "Sólido", "juntas, vibran", sol) + panel(126, "Líquido", "juntas, resbalan", liq) + panel(246, "Gas", "lejos, libres", gas), W),
  };
})();

// The six changes of state as arrows between the three states.
const cambiosEstado = {
  caption: "Las flechas que **suben** absorben energía (calor); las que **bajan**, la liberan.",
  svg: fig("f-02-cam", "Los seis cambios de estado entre sólido, líquido y gas", 270, `
    ${box(135, 8, 90, 46, "Gas", "", "d-acc")}
    ${box(135, 108, 90, 46, "Líquido")}
    ${box(135, 208, 90, 46, "Sólido")}
    <path class="d-flow-acc" marker-end="url(#f-02-cama)" d="M165 108V56"/>
    <path class="d-flow" marker-end="url(#f-02-cam)" d="M195 56V106"/>
    ${note(155, 86, "Vaporización", 110, "d-s", "end")}
    ${note(205, 86, "Condensación", 110, "d-s", "start")}
    <path class="d-flow-acc" marker-end="url(#f-02-cama)" d="M165 208V156"/>
    <path class="d-flow" marker-end="url(#f-02-cam)" d="M195 156V206"/>
    ${note(155, 186, "Fusión", 110, "d-s", "end")}
    ${note(205, 186, "Solidificación", 130, "d-s", "start")}
    <path class="d-flow-acc" marker-end="url(#f-02-cama)" d="M135 242H20V31H131"/>
    <path class="d-flow" marker-end="url(#f-02-cam)" d="M225 31H340V242H229"/>
    ${note(28, 134, "Sublimación", 100, "d-s", "start")}
    ${note(242, 128, "Sublimación", 100, "d-s", "start")}
    ${note(242, 144, "inversa", 100, "d-s", "start")}`, W),
};

// Heating curve of 30 g of ice at -20 C heated with 100 W (ideal, no losses):
// ice warms 12.5 s, melts 100 s, water warms 125 s, then boils.
const curva = (() => {
  const x = (t) => f1(46 + t * 37.5);
  const y = (T) => f1(205 - (T + 25) * 1.35);
  const pts = [[0, -20], [0.21, 0], [1.88, 0], [3.96, 100], [8, 100]];
  const d = pts.map(([t, T], i) => `${i ? "L" : "M"}${x(t)} ${y(T)}`).join("");
  const xt = [0, 2, 4, 6, 8].map((t) => `<text class="d-n" x="${x(t)}" y="222" text-anchor="middle">${t}</text>`).join("");
  return {
    caption: "Mientras el agua **cambia de estado**, la temperatura **no sube**: la curva se queda plana (0 °C y 100 °C).",
    svg: fig("f-02-curva", "Gráfica de calentamiento del agua: la temperatura sube de menos 20 a 0 grados, se queda en 0 mientras el hielo se funde, sube hasta 100 grados y se queda en 100 mientras hierve", 252, `
      <text class="d-s" x="6" y="14">Temperatura (°C)</text>
      <path class="d-line" d="M46 22V205H350"/>
      <path class="d-dash" d="M46 ${y(0)}H346M46 ${y(100)}H346"/>
      <text class="d-n" x="40" y="${y(-20) + 4}" text-anchor="end">−20</text>
      <text class="d-n" x="40" y="${y(0) + 4}" text-anchor="end">0</text>
      <text class="d-n" x="40" y="${y(50) + 4}" text-anchor="end">50</text>
      <text class="d-n" x="40" y="${y(100) + 4}" text-anchor="end">100</text>
      ${xt}
      <text class="d-s" x="346" y="242" text-anchor="end">Tiempo (min)</text>
      <path class="d-flow-acc" d="${d}"/>
      ${note(100, 186, "Fusión", 80, "d-a", "middle")}
      ${note(100, 199, "hielo + agua", 80, "d-s", "middle")}
      ${note(162, 132, "Agua líquida", 100, "d-s", "start")}
      ${note(270, 60, "Ebullición", 100, "d-a", "middle")}
      ${note(270, 76, "agua + vapor", 100, "d-s", "middle")}
      ${note(340, y(0) - 5, "punto de fusión", 110, "d-s", "end")}
      ${note(340, y(100) - 8, "punto de ebullición", 130, "d-s", "end")}`, W),
  };
})();

const flotar = {
  caption: "Flota lo que es **menos denso** que el agua (1 g/cm³); se hunde lo que es **más denso**.",
  svg: fig("f-02-flota", "Un bloque de madera y un cubo de hielo que flotan en el agua y un bloque de hierro que se hunde", 232, `
    <rect class="d-water" x="30" y="50" width="300" height="130"/>
    <rect class="d-fill-2" x="50" y="33" width="50" height="34" rx="${R.cell}"/>
    <rect class="d-fill-1" x="140" y="47" width="50" height="34" rx="${R.cell}"/>
    <rect class="d-obj" x="250" y="144" width="50" height="34" rx="${R.cell}"/>
    <rect class="d-box-line" x="30" y="10" width="300" height="170" rx="${R.cell}"/>
    ${note(180, 130, "Agua: 1 g/cm³", 150, "d-a", "middle")}
    ${note(75, 204, "Madera", 90, "d-t", "middle")}
    ${note(75, 220, "≈ 0,5 g/cm³", 90, "d-s", "middle")}
    ${note(165, 204, "Hielo", 90, "d-t", "middle")}
    ${note(165, 220, "0,92 g/cm³", 90, "d-s", "middle")}
    ${note(275, 204, "Hierro", 90, "d-t", "middle")}
    ${note(275, 220, "7,87 g/cm³", 90, "d-s", "middle")}`, W),
};

const presion = {
  caption: "Con menos aire encima hay **menos presión**, y el agua hierve a **menos temperatura**.",
  svg: fig("f-02-pres", "Lima hierve el agua a 100 grados, Cusco a unos 89 y Puno a unos 87", 180, `
    ${box(6, 8, 104, 104, "Lima", ["≈ 150 m", "≈ 100 kPa", "→ 100 °C"])}
    ${box(130, 8, 104, 104, "Cusco", ["3 399 m", "≈ 67 kPa", "→ 89 °C"], "d-acc")}
    ${box(254, 8, 104, 104, "Puno", ["3 827 m", "≈ 63 kPa", "→ 87 °C"], "d-acc")}
    ${note(180, 142, "Más altura: menos aire encima, menos presión y menos temperatura de ebullición", 330, "d-t", "middle", 18)}`, W),
};

export default { "02-desplazamiento": desplazamiento, "02-particulas": solidoLiquidoGas, "02-cambios": cambiosEstado, "02-curva": curva, "02-flotar": flotar, "02-presion": presion };
