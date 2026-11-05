// Figures of "Nutrición de los seres vivos". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../platform/build/figkit.mjs";

const W = 360;
const text = (x, y, s, cls = "d-s", anchor = "middle") => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const dot = (x, y, cls = "d-fill-acc", r = 5) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;

// ── 1. Who makes its food and who eats it ──
const autotrofos = {
  caption: "Los **autótrofos** fabrican su alimento con la luz del Sol; los **heterótrofos** lo consiguen comiendo a otros seres vivos.",
  svg: fig("f-11-aut", "Cadena de alimentos: el Sol da energía a una planta, que es comida por una llama, que a su vez es comida por un puma", 236, `
    ${box(6, 8, 108, 54, "Sol", ["energía"], "d-box-line")}
    ${box(126, 8, 108, 54, "Planta", ["autótrofo"], "d-acc")}
    ${box(246, 8, 108, 54, "Llama", ["heterótrofo"])}
    <path class="d-flow" marker-end="url(#f-11-aut)" d="M114 35H124"/>
    <path class="d-flow" marker-end="url(#f-11-aut)" d="M234 35H244"/>
    ${box(246, 96, 108, 54, "Puma", ["heterótrofo"])}
    <path class="d-flow" marker-end="url(#f-11-aut)" d="M300 62V94"/>
    ${note(10, 100, "La planta fabrica su alimento.", 190, "d-a")}
    ${note(10, 138, "La llama y el puma no pueden fabricarlo: lo obtienen comiendo.", 200, "d-s")}
    <path class="d-dash" d="M10 176H350"/>
    ${note(180, 202, "Toda la energía de la cadena viene, al inicio, de la luz del Sol.", 330, "d-t", "middle")}`, W),
};

// ── 2. Photosynthesis equation ──
const ecuacion = {
  caption: "En la fotosíntesis entran **dióxido de carbono**, **agua** y **luz**; salen **glucosa** y **oxígeno**.",
  svg: fig("f-11-ec", "Esquema de la fotosíntesis: entran dióxido de carbono, agua y luz a una hoja con cloroplastos y salen glucosa y oxígeno", 236, `
    ${box(6, 8, 110, 46, "CO₂", ["del aire"])}
    ${box(6, 66, 110, 46, "H₂O", ["de la raíz"])}
    ${box(6, 124, 110, 46, "Luz", ["del Sol"], "d-box-line")}
    <path class="d-flow" marker-end="url(#f-11-ec)" d="M116 31L144 70"/>
    <path class="d-flow" marker-end="url(#f-11-ec)" d="M116 89L142 92"/>
    <path class="d-flow" marker-end="url(#f-11-ec)" d="M116 147L144 114"/>
    <rect class="d-box-line" x="146" y="48" width="74" height="86" rx="${R.box}"/>
    ${dot(166, 76, "d-fill-acc", 6)}${dot(196, 92, "d-fill-acc", 6)}${dot(170, 112, "d-fill-acc", 6)}
    ${text(183, 40, "Hoja", "d-t")}
    <path class="d-flow-acc" marker-end="url(#f-11-eca)" d="M220 76L244 46"/>
    <path class="d-flow-acc" marker-end="url(#f-11-eca)" d="M220 106L244 132"/>
    ${box(246, 8, 108, 54, "Glucosa", ["C₆H₁₂O₆"], "d-acc")}
    ${box(246, 112, 108, 54, "Oxígeno", ["O₂"], "d-acc")}
    ${dot(110, 212, "d-fill-acc", 6)}
    ${note(124, 216, "= cloroplastos con clorofila", 200, "d-s")}`, W),
};

// ── 3. Leaf cross-section with stoma ──
const estoma = {
  caption: "Por el **estoma** entra el CO₂ y salen el O₂ y el vapor de agua. Las células guardianas lo abren y lo cierran.",
  svg: fig("f-11-est", "Corte de una hoja: el CO₂ entra por un estoma de la parte de abajo y el O₂ y el vapor de agua salen; dentro hay células con cloroplastos", 280, `
    <rect class="d-box" x="14" y="40" width="332" height="14" rx="4"/>
    <rect class="d-box-line" x="14" y="54" width="332" height="96" rx="4"/>
    ${[[40, 80], [80, 112], [120, 78], [226, 84], [266, 116], [306, 80], [60, 132], [250, 134], [100, 138], [320, 130]].map(([x, y]) => dot(x, y, "d-fill-acc", 6)).join("")}
    <rect class="d-box" x="14" y="150" width="140" height="14" rx="4"/>
    <rect class="d-box" x="206" y="150" width="140" height="14" rx="4"/>
    <ellipse class="d-fill-3" cx="158" cy="157" rx="11" ry="9"/>
    <ellipse class="d-fill-3" cx="202" cy="157" rx="11" ry="9"/>
    ${text(180, 32, "Arriba: capa de protección", "d-s")}
    ${text(180, 106, "Células con cloroplastos", "d-s", "middle")}
    ${text(14, 186, "Abajo: están los estomas", "d-s", "start")}
    <path class="d-flow-acc" marker-end="url(#f-11-esta)" d="M174 250V160"/>
    <path class="d-flow" marker-end="url(#f-11-est)" d="M186 164L226 250"/>
    <path class="d-flow" marker-end="url(#f-11-est)" d="M190 162L300 222"/>
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
  return fig("f-11-gr", "Gráfica de la distancia de la lámpara contra las burbujas por minuto: 30 a 10 centímetros, 20 a 20, 12 a 30, 6 a 40 y 3 a 50", 262, out, W);
}
const grafica = {
  caption: "Cuanto más lejos está la lámpara, **menos burbujas** de oxígeno salen de la planta acuática.",
  svg: graficaElodea(),
};

// ── 5. Starch test with lugol ──
const lugol = {
  caption: "Con lugol, la parte de la hoja que recibió luz se pone **azul oscuro** (hay almidón); la tapada con papel aluminio, **café** (no hay almidón).",
  svg: fig("f-11-lug", "Dos dibujos de una hoja: a la izquierda con una franja de papel aluminio, a la derecha después del lugol con la franja de color café y el resto azul oscuro", 226, `
    ${text(90, 18, "1. Hoja con luz", "d-t")}
    <ellipse class="d-fill-3" cx="90" cy="88" rx="78" ry="48"/>
    <rect class="d-obj" x="50" y="48" width="80" height="80" rx="4"/>
    ${text(90, 84, "papel", "d-t")}
    ${text(90, 100, "aluminio", "d-t")}
    ${text(270, 18, "2. Con lugol", "d-t")}
    <ellipse class="d-fill-acc" cx="270" cy="88" rx="78" ry="48"/>
    <rect class="d-fill-2" x="230" y="48" width="80" height="80" rx="4"/>
    ${text(270, 92, "café", "d-t")}
    ${note(180, 168, "Azul oscuro: hay almidón, hubo fotosíntesis.", 340, "d-a", "middle")}
    ${note(180, 196, "Café (sin cambio): no hay almidón, no hubo luz.", 340, "d-s", "middle")}`, W),
};

// ── 6. Cell respiration ──
const respiracion = {
  caption: "En la **mitocondria**, la glucosa y el oxígeno se transforman en CO₂, agua y energía.",
  svg: fig("f-11-res", "Una mitocondria: entran glucosa y oxígeno; salen dióxido de carbono, agua y energía", 214, `
    ${box(6, 14, 100, 48, "Glucosa", ["C₆H₁₂O₆"])}
    ${box(6, 90, 100, 48, "Oxígeno", ["O₂"])}
    <path class="d-flow" marker-end="url(#f-11-res)" d="M106 38L140 66"/>
    <path class="d-flow" marker-end="url(#f-11-res)" d="M106 114L140 96"/>
    <ellipse class="d-fill-2" cx="196" cy="82" rx="54" ry="38"/>
    <path class="d-flow" d="M158 82Q170 60 182 82Q194 104 206 82Q218 60 232 82"/>
    ${text(196, 34, "Mitocondria", "d-t")}
    <path class="d-flow-acc" marker-end="url(#f-11-resa)" d="M250 66L276 38"/>
    <path class="d-flow-acc" marker-end="url(#f-11-resa)" d="M252 82H280"/>
    <path class="d-flow-acc" marker-end="url(#f-11-resa)" d="M250 98L276 126"/>
    ${box(282, 14, 72, 44, "CO₂", "", "d-acc")}
    ${box(282, 64, 72, 36, "H₂O", "", "d-acc")}
    ${box(282, 106, 72, 44, "Energía", "", "d-acc")}
    ${note(180, 184, "La energía sirve para moverte, crecer y mantener el calor del cuerpo.", 320, "d-s", "middle")}`, W),
};

// ── 7. Photosynthesis vs respiration, a cycle ──
const ciclo = {
  caption: "Lo que sale de una es lo que entra en la otra: **fotosíntesis** y **respiración** se complementan.",
  svg: fig("f-11-ci", "Dos procesos unidos: la fotosíntesis produce glucosa y oxígeno que usa la respiración, y la respiración produce dióxido de carbono y agua que usa la fotosíntesis", 332, `
    ${box(90, 8, 180, 56, "Fotosíntesis", ["cloroplasto · con luz"], "d-acc")}
    ${box(90, 228, 180, 56, "Respiración celular", ["mitocondria · siempre"])}
    <path class="d-flow-acc" marker-end="url(#f-11-cia)" d="M90 40H40V256H88"/>
    <path class="d-flow-acc" marker-end="url(#f-11-cia)" d="M270 256H320V40H272"/>
    ${note(48, 148, "Glucosa + O₂", 80, "d-s", "start")}
    ${note(312, 148, "CO₂ + H₂O", 80, "d-s", "end")}
    ${note(180, 316, "Energía: de la luz a la química y a la célula", 330, "d-s", "middle")}`, W),
};

// ── 8. Day and night in a plant ──
const diaNoche = {
  caption: "De **día** la planta hace fotosíntesis y respiración; de **noche** solo respiración.",
  svg: fig("f-11-dn", "Dos paneles: de día la planta hace fotosíntesis y respiración y libera más oxígeno del que usa; de noche solo respira y toma oxígeno", 250, `
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
  svg: fig("f-11-fer", "Fermentación: la glucosa sin oxígeno da alcohol y dióxido de carbono en la levadura, o ácido láctico en las bacterias del yogur y en el músculo", 262, `
    ${box(112, 8, 136, 46, "Glucosa", ["sin oxígeno"])}
    <path class="d-flow-acc" marker-end="url(#f-11-fera)" d="M150 54L90 96"/>
    <path class="d-flow-acc" marker-end="url(#f-11-fera)" d="M210 54L270 96"/>
    ${note(84, 80, "Levadura", 80, "d-t", "end")}
    ${note(276, 62, "Bacterias o músculo", 90, "d-t", "start")}
    ${box(6, 100, 168, 64, "Alcohol + CO₂", ["+ poca energía"], "d-acc")}
    ${box(186, 100, 168, 64, "Ácido láctico", ["+ poca energía"], "d-acc")}
    ${note(90, 190, "Pan, chicha de jora, cerveza", 160, "d-s", "middle")}
    ${note(270, 190, "Yogur, y músculos en esfuerzo intenso", 160, "d-s", "middle")}
    ${note(180, 236, "Con oxígeno se obtiene mucha más energía que sin él.", 330, "d-t", "middle")}`, W),
};

// ── 11. Matter and energy from food ──
const materiaEnergia = {
  caption: "Todo ser vivo se nutre para conseguir **materia** (con qué construir su cuerpo) y **energía** (con qué funcionar).",
  svg: fig("f-11-me", "Esquema: el alimento da materia para construir y reparar el cuerpo, y energía para moverse, crecer y mantener el calor", 214, `
    ${box(90, 8, 180, 46, "Nutrición", ["conseguir alimento"], "d-acc")}
    <path class="d-flow" marker-end="url(#f-11-me)" d="M140 54L96 92"/>
    <path class="d-flow" marker-end="url(#f-11-me)" d="M220 54L264 92"/>
    ${box(8, 96, 164, 54, "Materia", ["para construir"])}
    ${box(188, 96, 164, 54, "Energía", ["para funcionar"])}
    ${note(90, 172, "Crecer, reparar, fabricar sustancias orgánicas", 160, "d-s", "middle")}
    ${note(270, 172, "Moverse, mantener el calor, hacer todo lo vivo", 160, "d-s", "middle")}`, W),
};

// ── 12. Unicellular vs multicellular: who touches the outside ──
const cells = [];
for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
  const edge = r === 0 || c === 0 || r === 3 || c === 3;
  cells.push(`<rect class="${edge ? "d-obj" : "d-fill-acc"}" x="${206 + c * 30}" y="${56 + r * 30}" width="28" height="28" rx="4"/>`);
}
const superficie = {
  caption: "En un **unicelular** toda la célula toca el exterior. En un **pluricelular**, la mayoría de las células quedan adentro y necesitan que algo les lleve lo que necesitan.",
  svg: fig("f-11-su", "A la izquierda, una ameba rodeada de agua con flechas que entran por todos lados; a la derecha, un bloque de células en el que las del centro no tocan el exterior", 250, `
    ${note(86, 22, "Unicelular", 150, "d-t", "middle")}
    ${note(265, 22, "Pluricelular", 150, "d-t", "middle")}
    <ellipse class="d-obj" cx="86" cy="100" rx="52" ry="42"/>
    <circle class="d-fill-4" cx="76" cy="96" r="9"/>
    <path class="d-flow-acc" marker-end="url(#f-11-sua)" d="M12 50L40 72"/>
    <path class="d-flow-acc" marker-end="url(#f-11-sua)" d="M160 50L132 72"/>
    <path class="d-flow-acc" marker-end="url(#f-11-sua)" d="M12 152L40 130"/>
    <path class="d-flow-acc" marker-end="url(#f-11-sua)" d="M160 152L132 130"/>
    ${cells.join("")}
    <path class="d-flow-acc" marker-end="url(#f-11-sua)" d="M164 100H202"/>
    <path class="d-flow-acc" marker-end="url(#f-11-sua)" d="M265 32V52"/>
    <path class="d-flow-acc" marker-end="url(#f-11-sua)" d="M356 100H328"/>
    ${note(86, 192, "Todo entra y sale por la superficie de la célula.", 160, "d-s", "middle")}
    ${note(265, 206, "Las células del centro (de color) están lejos del exterior.", 150, "d-s", "middle")}`, W),
};

// ── 13. Plant structures for nutrition ──
const planta = {
  caption: "En la planta, cada parte tiene su trabajo: la **raíz** absorbe, el **tallo** transporta y la **hoja** fabrica el alimento.",
  svg: fig("f-11-pl", "Esquema de una planta: las hojas fabrican glucosa y toman CO₂ por los estomas, el tallo lleva el agua hacia arriba y la glucosa hacia abajo, y la raíz absorbe agua y minerales del suelo", 372, `
    <rect class="d-water" x="8" y="214" width="344" height="150" rx="6"/>
    <path class="d-stroke-3" d="M180 206V90" style="stroke-width:7;fill:none"/>
    <ellipse class="d-fill-3" cx="132" cy="84" rx="48" ry="22"/>
    <ellipse class="d-fill-3" cx="228" cy="84" rx="48" ry="22"/>
    <ellipse class="d-fill-3" cx="180" cy="52" rx="24" ry="30"/>
    <path class="d-stroke-2" d="M180 206V270M180 250L140 296M180 250L220 296M180 270V332M158 280L128 322M202 280L222 322" style="stroke-width:4;fill:none"/>
    ${note(6, 24, "Hoja", 100, "d-t")}
    ${note(6, 40, "fabrica glucosa", 110, "d-s")}
    ${note(354, 24, "Estomas", 100, "d-t", "end")}
    ${note(354, 40, "entra CO₂, sale O₂", 140, "d-s", "end")}
    <path class="d-flow-acc" marker-end="url(#f-11-pla)" d="M152 116V150"/>
    <path class="d-flow" marker-end="url(#f-11-pl)" d="M208 150V116"/>
    ${note(144, 170, "glucosa baja", 120, "d-a", "end")}
    ${note(216, 170, "agua y minerales suben", 130, "d-s")}
    ${note(244, 238, "Raíz", 104, "d-t")}
    ${note(244, 256, "absorbe agua y minerales del suelo", 106, "d-s")}`, W),
};

// ── 14. Compact digestive tube ──
const rows = [
  ["Boca", "Mastica; la saliva empieza a digerir el almidón.", "d-box"],
  ["Esófago", "Empuja el alimento hacia abajo.", "d-box"],
  ["Estómago", "Lo bate y digiere proteínas. Casi no absorbe.", "d-box"],
  ["Intestino delgado", "Termina de digerir y ABSORBE los nutrientes.", "d-acc"],
  ["Intestino grueso", "Absorbe el agua que sobra.", "d-box"],
  ["Recto y ano", "Eliminan lo que no se digiere.", "d-box"],
];
const camino = {
  caption: "El alimento recorre el tubo digestivo. Digerir es hacerlo pequeño; **absorber** es pasarlo a la sangre, y eso ocurre sobre todo en el intestino delgado.",
  svg: fig("f-11-ca", "Camino del alimento: boca, esófago, estómago, intestino delgado, intestino grueso y ano; el intestino delgado es el que absorbe los nutrientes", 6 * 58 + 8, `
    ${rows.map((r, i) => {
      const y = 6 + i * 58;
      return `${box(6, y, 128, 44, r[0], "", r[2])}${note(146, y + 17, r[1], 208, "d-s")}${i < 5 ? `<path class="d-flow${i === 2 ? "-acc" : ""}" marker-end="url(#f-11-ca${i === 2 ? "a" : ""})" d="M70 ${y + 44}V${y + 58}"/>` : ""}`;
    }).join("")}`, W),
};

// ── 15. Stomach digests, small intestine absorbs ──
const estomagoIntestino = {
  caption: "El estómago **digiere** (prepara); el intestino delgado **absorbe** (pasa a la sangre). No son lo mismo.",
  svg: fig("f-11-ei", "Comparación: el estómago mezcla el alimento y digiere proteínas con jugo gástrico; el intestino delgado termina la digestión y absorbe los nutrientes hacia la sangre con sus vellosidades", 280, `
    ${box(6, 8, 170, 46, "Estómago", "DIGIERE")}
    ${box(184, 8, 170, 46, "Intestino delgado", "ABSORBE", "d-acc")}
    ${note(91, 78, "Bate el alimento con jugo gástrico", 160, "d-s", "middle")}
    ${note(91, 126, "Empieza a digerir las proteínas", 160, "d-s", "middle")}
    ${note(91, 176, "Casi nada pasa a la sangre", 160, "d-a", "middle")}
    ${note(269, 78, "Termina de digerir (bilis y jugo pancreático)", 160, "d-s", "middle")}
    ${note(269, 126, "Vellosidades: mucha superficie con capilares", 160, "d-s", "middle")}
    ${note(269, 176, "Casi todos los nutrientes pasan a la sangre", 164, "d-a", "middle")}
    <path class="d-dash" d="M180 70V216"/>
    ${note(180, 256, "Digerir = hacer pequeño. Absorber = pasar a la sangre.", 330, "d-t", "middle")}`, W),
};

// ── 16. The common thread of the human body ──
const hilo = {
  caption: "Tres sistemas, un mismo viaje: el digestivo trae la glucosa, el respiratorio trae el O₂ y el circulatorio los reparte a todas las células.",
  svg: fig("f-11-hi", "Esquema: el sistema digestivo aporta glucosa y el respiratorio oxígeno; el circulatorio los reparte a todas las células, que hacen la respiración celular; el respiratorio saca el CO₂", 340, `
    ${box(6, 8, 164, 56, "Digestivo", ["absorbe la glucosa"])}
    ${box(190, 8, 164, 56, "Respiratorio", ["trae el O₂"])}
    <path class="d-flow" marker-end="url(#f-11-hi)" d="M88 64V102"/>
    <path class="d-flow" marker-end="url(#f-11-hi)" d="M272 64V102"/>
    ${box(6, 106, 348, 56, "Circulatorio", ["la sangre lo reparte"], "d-acc")}
    <path class="d-flow-acc" marker-end="url(#f-11-hia)" d="M180 162V198"/>
    ${box(6, 202, 348, 56, "Todas las células", ["respiración celular: energía"])}
    <path class="d-flow" marker-end="url(#f-11-hi)" d="M180 258V292"/>
    ${box(6, 294, 348, 40, "El CO₂ sale por los pulmones", "")}`, W),
};


export default {
  "11-autotrofos": autotrofos,
  "11-ecuacion": ecuacion,
  "11-estoma": estoma,
  "11-grafica-elodea": grafica,
  "11-lugol": lugol,
  "11-respiracion": respiracion,
  "11-ciclo": ciclo,
  "11-dia-noche": diaNoche,
  "11-fermentacion": fermentacion,
  "11-materia-energia": materiaEnergia,
  "11-superficie": superficie,
  "11-planta": planta,
  "11-camino-digestivo": camino,
  "11-estomago-intestino": estomagoIntestino,
  "11-hilo": hilo,
};
