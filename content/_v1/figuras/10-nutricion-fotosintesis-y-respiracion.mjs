// Figures of "Nutrición: fotosíntesis y respiración". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../../platform/build/figkit.mjs";

const W = 360;
const text = (x, y, s, cls = "d-s", anchor = "middle") => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const dot = (x, y, cls = "d-fill-acc", r = 5) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;

// ── 1. Who makes its food and who eats it ──
const autotrofos = {
  caption: "Los **autótrofos** fabrican su alimento con la luz del Sol; los **heterótrofos** lo consiguen comiendo a otros seres vivos.",
  svg: fig("f-10-aut", "Cadena de alimentos: el Sol da energía a una planta, que es comida por una llama, que a su vez es comida por un puma", 236, `
    ${box(6, 8, 108, 54, "Sol", ["energía"], "d-box-line")}
    ${box(126, 8, 108, 54, "Planta", ["autótrofo"], "d-acc")}
    ${box(246, 8, 108, 54, "Llama", ["heterótrofo"])}
    <path class="d-flow" marker-end="url(#f-10-aut)" d="M114 35H124"/>
    <path class="d-flow" marker-end="url(#f-10-aut)" d="M234 35H244"/>
    ${box(246, 96, 108, 54, "Puma", ["heterótrofo"])}
    <path class="d-flow" marker-end="url(#f-10-aut)" d="M300 62V94"/>
    ${note(10, 100, "La planta fabrica su alimento.", 190, "d-a")}
    ${note(10, 138, "La llama y el puma no pueden fabricarlo: lo obtienen comiendo.", 200, "d-s")}
    <path class="d-dash" d="M10 176H350"/>
    ${note(180, 202, "Toda la energía de la cadena viene, al inicio, de la luz del Sol.", 330, "d-t", "middle")}`, W),
};

// ── 2. Photosynthesis equation ──
const ecuacion = {
  caption: "En la fotosíntesis entran **dióxido de carbono**, **agua** y **luz**; salen **glucosa** y **oxígeno**.",
  svg: fig("f-10-ec", "Esquema de la fotosíntesis: entran dióxido de carbono, agua y luz a una hoja con cloroplastos y salen glucosa y oxígeno", 300, `
    ${box(6, 8, 110, 46, "CO₂", ["del aire"])}
    ${box(6, 66, 110, 46, "H₂O", ["de la raíz"])}
    ${box(6, 124, 110, 46, "Luz", ["del Sol"], "d-box-line")}
    <path class="d-flow" marker-end="url(#f-10-ec)" d="M116 31L144 70"/>
    <path class="d-flow" marker-end="url(#f-10-ec)" d="M116 89L142 92"/>
    <path class="d-flow" marker-end="url(#f-10-ec)" d="M116 147L144 114"/>
    <rect class="d-box-line" x="146" y="48" width="74" height="86" rx="${R.box}"/>
    ${dot(166, 76, "d-fill-acc", 6)}${dot(196, 92, "d-fill-acc", 6)}${dot(170, 112, "d-fill-acc", 6)}
    ${text(183, 40, "Hoja", "d-t")}
    <path class="d-flow-acc" marker-end="url(#f-10-eca)" d="M220 76L244 46"/>
    <path class="d-flow-acc" marker-end="url(#f-10-eca)" d="M220 106L244 132"/>
    ${box(246, 8, 108, 54, "Glucosa", ["C₆H₁₂O₆"], "d-acc")}
    ${box(246, 112, 108, 54, "Oxígeno", ["O₂"], "d-acc")}
    ${note(180, 204, "6 CO₂ + 6 H₂O + luz  →  C₆H₁₂O₆ + 6 O₂", 340, "d-t", "middle")}
    ${note(180, 232, "Se lee: seis de dióxido de carbono más seis de agua, con luz, dan una de glucosa y seis de oxígeno.", 330, "d-s", "middle")}
    ${dot(176, 266, "d-fill-acc", 6)}
    ${note(190, 270, "= cloroplastos con clorofila", 160, "d-s")}`, W),
};

// ── 3. Leaf cross-section with stoma ──
const estoma = {
  caption: "Por el **estoma** entra el CO₂ y salen el O₂ y el vapor de agua. Las células guardianas lo abren y lo cierran.",
  svg: fig("f-10-est", "Corte de una hoja: el CO₂ entra por un estoma de la parte de abajo y el O₂ y el vapor de agua salen; dentro hay células con cloroplastos", 280, `
    <rect class="d-box" x="14" y="40" width="332" height="14" rx="4"/>
    <rect class="d-box-line" x="14" y="54" width="332" height="96" rx="4"/>
    ${[[40, 80], [80, 112], [120, 78], [226, 84], [266, 116], [306, 80], [60, 132], [250, 134], [100, 138], [320, 130], [150, 110]].map(([x, y]) => dot(x, y, "d-fill-acc", 6)).join("")}
    <rect class="d-box" x="14" y="150" width="140" height="14" rx="4"/>
    <rect class="d-box" x="206" y="150" width="140" height="14" rx="4"/>
    <ellipse class="d-fill-hair" cx="165" cy="157" rx="11" ry="9"/>
    <ellipse class="d-fill-hair" cx="195" cy="157" rx="11" ry="9"/>
    ${text(180, 32, "Arriba: capa de protección", "d-s")}
    ${text(120, 100, "Células con cloroplastos", "d-s", "start")}
    ${text(14, 186, "Abajo: están los estomas", "d-s", "start")}
    <path class="d-flow-acc" marker-end="url(#f-10-esta)" d="M170 250V172"/>
    <path class="d-flow" marker-end="url(#f-10-est)" d="M192 170L226 250"/>
    <path class="d-flow" marker-end="url(#f-10-est)" d="M200 168L300 222"/>
    ${text(160, 270, "entra CO₂", "d-a", "end")}
    ${text(226, 270, "sale O₂", "d-s", "start")}
    ${text(346, 244, "vapor de agua", "d-s", "end")}`, W),
};

// ── 4. Elodea experiment graph (distance vs bubbles) ──
function graficaElodea() {
  const ox = 56, oy = 216, sx = 5.6, sy = 6;
  const pts = [[10, 30], [20, 20], [30, 12], [40, 6], [50, 3]];
  let out = `<path class="d-line" d="M${ox} ${oy}H${ox + 50 * sx + 10}"/><path class="d-line" d="M${ox} ${oy}V${oy - 30 * sy - 12}"/>`;
  for (const x of [10, 20, 30, 40, 50]) {
    out += text(ox + x * sx, oy + 18, x, "d-n");
    out += `<rect class="d-fill-hair" x="${ox + x * sx - 0.5}" y="${oy - 30 * sy}" width="1" height="${30 * sy}"/>`;
  }
  for (const y of [10, 20, 30]) {
    out += text(ox - 8, oy - y * sy + 4, y, "d-n", "end");
    out += `<rect class="d-fill-hair" x="${ox}" y="${oy - y * sy - 0.5}" width="${50 * sx}" height="1"/>`;
  }
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${ox + x * sx} ${oy - y * sy}`).join("");
  out += `<path class="d-flow-acc" d="${d}"/>`;
  out += pts.map(([x, y]) => dot(ox + x * sx, oy - y * sy, "d-fill-acc", 5)).join("");
  out += text(ox - 44, 16, "Burbujas por minuto", "d-s", "start");
  out += text(350, oy + 40, "Distancia de la lámpara a la planta (cm)", "d-s", "end");
  return fig("f-10-gr", "Gráfica de la distancia de la lámpara contra las burbujas por minuto: 30 a 10 centímetros, 20 a 20, 12 a 30, 6 a 40 y 3 a 50", 262, out, W);
}
const grafica = {
  caption: "Cuanto más lejos está la lámpara, **menos burbujas** de oxígeno salen de la planta acuática.",
  svg: graficaElodea(),
};

// ── 5. Starch test with lugol ──
const lugol = {
  caption: "Con lugol, la parte de la hoja que recibió luz se pone **azul oscuro** (hay almidón); la tapada con papel aluminio, **café** (no hay almidón).",
  svg: fig("f-10-lug", "Dos dibujos de una hoja: a la izquierda con una franja de papel aluminio, a la derecha después del lugol con la franja de color café y el resto azul oscuro", 226, `
    ${text(90, 18, "1. Hoja con luz", "d-t")}
    <ellipse class="d-box-line" cx="90" cy="88" rx="78" ry="48"/>
    <rect class="d-box" x="58" y="48" width="64" height="80" rx="4"/>
    ${text(90, 92, "papel", "d-s")}
    ${text(90, 108, "aluminio", "d-s")}
    ${text(270, 18, "2. Con lugol", "d-t")}
    <ellipse class="d-fill-acc" cx="270" cy="88" rx="78" ry="48"/>
    <rect class="d-box" x="238" y="48" width="64" height="80" rx="4"/>
    ${text(270, 100, "café", "d-s")}
    ${note(180, 168, "Azul oscuro: hay almidón, hubo fotosíntesis.", 340, "d-a", "middle")}
    ${note(180, 196, "Café (sin cambio): no hay almidón, no hubo luz.", 340, "d-s", "middle")}`, W),
};

// ── 6. Cell respiration ──
const respiracion = {
  caption: "En la **mitocondria**, la glucosa y el oxígeno se transforman en CO₂, agua y energía.",
  svg: fig("f-10-res", "Una mitocondria: entran glucosa y oxígeno; salen dióxido de carbono, agua y energía", 250, `
    ${box(6, 14, 100, 48, "Glucosa", ["C₆H₁₂O₆"])}
    ${box(6, 90, 100, 48, "Oxígeno", ["O₂"])}
    <path class="d-flow" marker-end="url(#f-10-res)" d="M106 38L140 66"/>
    <path class="d-flow" marker-end="url(#f-10-res)" d="M106 114L140 96"/>
    <ellipse class="d-box-line" cx="196" cy="82" rx="54" ry="38"/>
    <path class="d-line" d="M158 82Q170 60 182 82Q194 104 206 82Q218 60 232 82"/>
    ${text(196, 34, "Mitocondria", "d-t")}
    <path class="d-flow-acc" marker-end="url(#f-10-resa)" d="M250 66L276 38"/>
    <path class="d-flow-acc" marker-end="url(#f-10-resa)" d="M252 82H280"/>
    <path class="d-flow-acc" marker-end="url(#f-10-resa)" d="M250 98L276 126"/>
    ${box(282, 14, 72, 44, "CO₂", "", "d-acc")}
    ${box(282, 64, 72, 36, "H₂O", "", "d-acc")}
    ${box(282, 106, 72, 44, "Energía", "", "d-acc")}
    ${note(180, 184, "C₆H₁₂O₆ + 6 O₂  →  6 CO₂ + 6 H₂O + energía", 340, "d-t", "middle")}
    ${note(180, 212, "La energía sirve para moverte, crecer y mantener el calor del cuerpo.", 320, "d-s", "middle")}`, W),
};

// ── 7. Photosynthesis vs respiration, a cycle ──
const ciclo = {
  caption: "Lo que sale de una es lo que entra en la otra: **fotosíntesis** y **respiración** se complementan.",
  svg: fig("f-10-ci", "Dos procesos unidos: la fotosíntesis produce glucosa y oxígeno que usa la respiración, y la respiración produce dióxido de carbono y agua que usa la fotosíntesis", 332, `
    ${box(90, 8, 180, 56, "Fotosíntesis", ["cloroplasto · con luz"], "d-acc")}
    ${box(90, 228, 180, 56, "Respiración celular", ["mitocondria · siempre"])}
    <path class="d-flow-acc" marker-end="url(#f-10-cia)" d="M90 40H40V256H88"/>
    <path class="d-flow-acc" marker-end="url(#f-10-cia)" d="M270 256H320V40H272"/>
    ${note(48, 148, "Glucosa + O₂", 80, "d-s", "start")}
    ${note(312, 148, "CO₂ + H₂O", 80, "d-s", "end")}
    ${note(180, 316, "Energía: de la luz a la química y a la célula", 330, "d-s", "middle")}`, W),
};

// ── 8. Day and night in a plant ──
const diaNoche = {
  caption: "De **día** la planta hace fotosíntesis y respiración; de **noche** solo respiración.",
  svg: fig("f-10-dn", "Dos paneles: de día la planta hace fotosíntesis y respiración y libera más oxígeno del que usa; de noche solo respira y toma oxígeno", 250, `
    ${box(6, 8, 170, 44, "De día", "", "d-acc")}
    ${box(184, 8, 170, 44, "De noche", "")}
    ${note(91, 80, "Fotosíntesis: sí", 160, "d-a", "middle")}
    ${note(91, 102, "Respiración: sí", 160, "d-s", "middle")}
    ${note(91, 134, "Gana más O₂ del que usa: libera O₂", 150, "d-s", "middle")}
    ${note(269, 80, "Fotosíntesis: no", 160, "d-s", "middle")}
    ${note(269, 102, "Respiración: sí", 160, "d-a", "middle")}
    ${note(269, 134, "Solo usa O₂ y libera CO₂", 150, "d-s", "middle")}
    <path class="d-dash" d="M180 64V176"/>
    ${note(180, 214, "La planta respira las 24 horas del día.", 330, "d-t", "middle")}`, W),
};

// ── 9. Fermentation ──
const fermentacion = {
  caption: "Sin oxígeno, la glucosa se transforma por **fermentación**: la levadura da alcohol y CO₂; en el músculo se forma ácido láctico.",
  svg: fig("f-10-fer", "Fermentación: la glucosa sin oxígeno da alcohol y dióxido de carbono en la levadura, o ácido láctico en las bacterias del yogur y en el músculo", 262, `
    ${box(112, 8, 136, 46, "Glucosa", ["sin oxígeno"])}
    <path class="d-flow-acc" marker-end="url(#f-10-fera)" d="M150 54L90 96"/>
    <path class="d-flow-acc" marker-end="url(#f-10-fera)" d="M210 54L270 96"/>
    ${note(84, 80, "Levadura", 80, "d-t", "end")}
    ${note(276, 62, "Bacterias o músculo", 90, "d-t", "start")}
    ${box(6, 100, 168, 64, "Alcohol + CO₂", ["+ poca energía"], "d-acc")}
    ${box(186, 100, 168, 64, "Ácido láctico", ["+ poca energía"], "d-acc")}
    ${note(90, 190, "Pan, chicha de jora, cerveza", 160, "d-s", "middle")}
    ${note(270, 190, "Yogur, y el dolor muscular", 160, "d-s", "middle")}
    ${note(180, 236, "Con oxígeno se obtiene mucha más energía que sin él.", 330, "d-t", "middle")}`, W),
};

// ── 10. Iron absorption ──
const hierro = {
  caption: "El hierro de las menestras se absorbe mejor si lo acompañas con **vitamina C** (limón, naranja, ají).",
  svg: fig("f-10-hi", "Lentejas con limón: la vitamina C ayuda al cuerpo a absorber el hierro de las menestras", 190, `
    ${box(6, 8, 104, 64, "Menestras", ["hierro"])}
    ${box(124, 8, 112, 64, "Limón o naranja", ["vitamina C"], "d-acc")}
    <path class="d-flow" marker-end="url(#f-10-hi)" d="M58 72L100 106"/>
    <path class="d-flow-acc" marker-end="url(#f-10-hia)" d="M180 72L140 106"/>
    ${box(60, 108, 160, 54, "Más hierro", ["pasa a la sangre"], "d-acc")}
    ${box(246, 8, 108, 64, "Té o café", ["con la comida"], "d-box-line")}
    <path class="d-flow" marker-end="url(#f-10-hi)" d="M300 72V108"/>
    ${note(300, 130, "Menos hierro", 100, "d-s", "middle")}
    ${note(300, 148, "se absorbe", 100, "d-s", "middle")}`, W),
};

export default {
  "10-autotrofos": autotrofos,
  "10-ecuacion": ecuacion,
  "10-estoma": estoma,
  "10-grafica-elodea": grafica,
  "10-lugol": lugol,
  "10-respiracion": respiracion,
  "10-ciclo": ciclo,
  "10-dia-noche": diaNoche,
  "10-fermentacion": fermentacion,
  "10-hierro": hierro,
};
