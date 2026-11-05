// Figures of "Tecnología y sociedad" (module 16). Drawn 360 wide so their text reads on a phone.
import { box, note, fig, chain } from "../../platform/build/figkit.mjs";

const W = 360;

// The design cycle, six steps and the loop back.
const ciclo = (() => {
  const c = chain("f-16-ciclo", [
    ["1. Determinar el problema", "¿Qué necesidad hay y para quién?"],
    ["2. Buscar alternativas", "Varias ideas, no solo una"],
    ["3. Diseñar la solución", "Dibujo, materiales y criterios"],
    ["4. Construir el prototipo", "Una primera versión que funcione"],
    ["5. Probar y evaluar", "Medir con datos si resuelve el problema", "d-acc"],
    ["6. Comunicar y mejorar", "Mostrar el resultado y corregir"],
  ], { per: 1, ch: 52, gap: 20, m: 26, closing: true, W });
  return fig("f-16-ciclo", "Ciclo de seis pasos del diseño tecnológico: determinar el problema, buscar alternativas, diseñar, construir el prototipo, probar y evaluar, comunicar y mejorar, y volver a empezar", c.h, c.svg, W);
})();

// Home water filter: layers in a bottle.
const filtro = fig("f-16-filtro", "Botella cortada con capas de grava, arena, carbón y algodón; arriba entra agua turbia y abajo sale agua más clara", 340, `
  <path class="d-flow" fill="none" d="M40 20V240L60 266H130L150 240V20"/>
  <rect class="d-water" x="41" y="22" width="108" height="34"/>
  <rect class="d-obj" x="41" y="56" width="108" height="44"/>
  <rect class="d-fill-6" x="41" y="100" width="108" height="44"/>
  <rect class="d-fill-4" x="41" y="144" width="108" height="44"/>
  <rect class="d-fill-1" x="41" y="188" width="108" height="34"/>
  <path class="d-flow" marker-end="url(#f-16-filtro)" d="M95 2V20"/>
  ${note(160, 44, "Agua turbia", 190, "d-s")}
  ${note(160, 76, "Grava", 190, "d-t")}${note(160, 92, "detiene lo más grande", 190, "d-s")}
  ${note(160, 120, "Arena", 190, "d-t")}${note(160, 136, "detiene la tierra fina", 190, "d-s")}
  ${note(160, 164, "Carbón", 190, "d-t")}${note(160, 180, "atrapa olor y sabor", 190, "d-s")}
  ${note(160, 208, "Algodón o tela", 190, "d-t")}
  <path class="d-flow-acc" marker-end="url(#f-16-filtroa)" d="M95 268V296"/>
  ${note(110, 292, "Agua más clara, pero no potable", 240, "d-a")}
  ${note(180, 330, "Hay que hervirla o clorarla", 330, "d-a", "middle")}`, W);

// Solar cooker: a box with a glass lid, a reflector and a black pot.
const cocina = fig("f-16-cocina", "Cocina solar de caja: un rayo rebota en el reflector y otros entran por la tapa de vidrio hasta una olla negra dentro de una caja aislada", 290, `
  <rect class="d-obj" x="80" y="110" width="200" height="110"/>
  <path class="d-flow" fill="none" d="M80 110V220H280V110"/>
  <path class="d-flow-acc" d="M80 110H280"/>
  <path class="d-flow" d="M80 110L36 40"/>
  <rect class="d-obj" style="fill:#16161a" x="150" y="158" width="60" height="42" rx="6"/>
  <path class="d-flow-acc" marker-end="url(#f-16-cocinaa)" d="M300 8L215 156"/>
  <path class="d-flow-acc" marker-end="url(#f-16-cocinaa)" d="M250 4L190 156"/>
  <path class="d-flow-acc" marker-end="url(#f-16-cocinaa)" d="M170 6L56 65"/>
  <path class="d-flow-acc" marker-end="url(#f-16-cocinaa)" d="M54 66L148 164"/>
  ${note(306, 20, "Sol", 40, "d-a")}
  ${note(6, 22, "Reflector", 80, "d-t")}
  ${note(286, 106, "Vidrio", 60, "d-s")}
  ${note(180, 242, "Olla negra: absorbe la luz y se calienta", 300, "d-s", "middle")}
  ${note(180, 262, "Paredes aisladas: el calor no se escapa", 300, "d-s", "middle")}`, W);

// Qocha: rain, pond, infiltration, spring downhill.
const qocha = fig("f-16-qocha", "Corte de una ladera: la lluvia llena una qocha en la parte alta, el agua se infiltra por el suelo y reaparece más abajo en un manantial", 280, `
  <path class="d-fill-6" d="M0 80L130 100H200L360 220V260H0Z"/>
  <path class="d-water" d="M135 100Q165 128 195 100Z"/>
  ${note(165, 90, "Qocha", 60, "d-a", "middle")}
  <path class="d-flow-acc" marker-end="url(#f-16-qochaa)" d="M50 24V60"/>
  <path class="d-flow-acc" marker-end="url(#f-16-qochaa)" d="M110 30V70"/>
  <path class="d-flow-acc" marker-end="url(#f-16-qochaa)" d="M250 70V126"/>
  ${note(10, 16, "Lluvia", 60, "d-s")}
  <path class="d-flow-acc" fill="none" stroke-dasharray="6 4" marker-end="url(#f-16-qochaa)" d="M165 128C175 180 240 196 286 180"/>
  ${note(10, 170, "Suelo: el agua se infiltra y baja despacio", 130, "d-t")}
  <circle class="d-water" cx="296" cy="177" r="7"/>
  ${note(268, 140, "Manantial", 80, "d-t")}`, W);

// Data chart: two solar water-heater prototypes.
const X0 = 54, YT = 20, YB = 190, X1 = 340;
const py = (v) => YB - ((YB - YT) * (v - 10)) / 50; // axis 10..60 °C
const px = (m) => X0 + ((X1 - X0) * m) / 120;
let ax = `<path class="d-line" d="M${X0} ${YT}V${YB}H${X1}"/>`;
for (let v = 10; v <= 60; v += 10) ax += `<path class="d-line" d="M${X0 - 4} ${py(v)}H${X0}"/><text class="d-n" x="${X0 - 8}" y="${py(v) + 4}" text-anchor="end">${v}</text>`;
for (let m = 0; m <= 120; m += 30) ax += `<path class="d-line" d="M${px(m)} ${YB}v4"/><text class="d-n" x="${px(m)}" y="${YB + 18}" text-anchor="middle">${m}</text>`;
const serieA = [18, 29, 38, 45, 50], serieB = [18, 23, 27, 30, 32];
const pts = (s) => s.map((v, i) => `${px(i * 30)} ${py(v)}`).join("L");
const terma = fig("f-16-terma", "Gráfica de temperatura del agua contra el tiempo en dos termas solares caseras: la botella pintada de negro llega a 50 grados y la clara a 32 grados en 120 minutos", 262, `
  ${ax}
  <text class="d-s" x="${(X0 + X1) / 2}" y="${YB + 40}" text-anchor="middle">Tiempo al sol (minutos)</text>
  <text class="d-s" transform="rotate(-90 12 105)" x="12" y="105" text-anchor="middle">Temperatura (°C)</text>
  <path class="d-flow-acc" fill="none" d="M${pts(serieA)}"/>
  <path class="d-flow" fill="none" d="M${pts(serieB)}"/>
  <text class="d-a" x="${px(120) - 6}" y="${py(50) - 8}" text-anchor="end">A: botella negra</text>
  <text class="d-s" x="${px(120) - 6}" y="${py(32) + 32}" text-anchor="end">B: botella clara</text>
  `, W);


// Problem tree: the problem, its causes and the alternative that answers them.
const causas = fig("f-16-causas", "Esquema: el problema es la falta de agua en las lomas de Lima; sus causas son poca lluvia, ningún río ni tubería y camión cisterna caro; la alternativa es el atrapanieblas", 360, `
  ${box(20, 6, 320, 52, "Problema", ["Poca agua para regar en un cerro de Lima"], "d-acc")}
  <path class="d-flow" marker-end="url(#f-16-causas)" d="M180 100V62"/>
  ${box(20, 104, 320, 46, "Causa 1", ["Casi no llueve en la costa"])}
  ${box(20, 156, 320, 46, "Causa 2", ["No hay río ni tubería en el cerro"])}
  ${box(20, 208, 320, 46, "Causa 3", ["El camión cisterna es caro"])}
  <path class="d-flow-acc" marker-end="url(#f-16-causasa)" d="M180 306V258"/>
  ${box(20, 310, 320, 46, "Alternativa", ["Juntar el agua de la neblina con mallas"], "d-box-line")}`, W);

// Mesh data: water collected by three meshes (bars).
const bars = [["A", 5, 120], ["B", 1, 410], ["C", 0.2, 150]];
const MX0 = 54, MYB = 190, MYT = 24, MX1 = 340;
const my = (v) => MYB - ((MYB - MYT) * v) / 500;
let bx = `<path class="d-line" d="M${MX0} ${MYT}V${MYB}H${MX1}"/>`;
for (let v = 0; v <= 500; v += 100) bx += `<path class="d-line" d="M${MX0 - 4} ${my(v)}H${MX0}"/><text class="d-n" x="${MX0 - 8}" y="${my(v) + 4}" text-anchor="end">${v}</text>`;
bars.forEach(([n, h, v], i) => {
  const x = MX0 + 24 + i * 90;
  bx += `<rect class="${i === 1 ? "d-fill-3" : "d-fill-1"}" x="${x}" y="${my(v)}" width="54" height="${MYB - my(v)}"/><text class="d-n" x="${x + 27}" y="${my(v) - 6}" text-anchor="middle">${v}</text><text class="d-s" x="${x + 27}" y="${MYB + 16}" text-anchor="middle">${n}</text><text class="d-n" x="${x + 27}" y="${MYB + 32}" text-anchor="middle">${String(h).replace(".", ",")} mm</text>`;
});
const malla = fig("f-16-malla", "Gráfica de barras del agua que juntó cada malla en una noche: la malla A con huecos de 5 milímetros juntó 120 mililitros, la B de 1 milímetro 410 y la C de 0,2 milímetros 150", 262, `
  ${bx}
  <text class="d-s" x="${(MX0 + MX1) / 2}" y="${MYB + 54}" text-anchor="middle">Malla y tamaño de sus huecos</text>
  <text class="d-s" transform="rotate(-90 12 107)" x="12" y="107" text-anchor="middle">Agua juntada (mL)</text>`, W);

// The five questions to take a position.
const posicion = (() => {
  const c = chain("f-16-pos", [
    ["1. ¿Qué se propone y para qué?", "Qué hace y qué problema resuelve"],
    ["2. ¿Qué evidencia hay?", "Datos medidos y fuentes con nombre"],
    ["3. ¿Quién gana y quién pierde?", "Personas y ambiente, hoy y mañana"],
    ["4. ¿Hay alternativas? ¿Se puede revertir?", "Comparar y pensar si el daño se deshace", "d-acc"],
    ["5. Decide y explica", "Tu posición, con evidencia"],
  ], { per: 1, ch: 52, gap: 18, m: 26, closing: false, W });
  return fig("f-16-pos", "Cinco preguntas para fundamentar una posición: qué se propone, qué evidencia hay, quién gana y quién pierde, qué alternativas hay y si se puede revertir, y decidir explicando con evidencia", c.h, c.svg, W);
})();

export default {
  "16-ciclo-diseno": { caption: "El diseño tecnológico es un **ciclo**: si la prueba muestra fallas, se vuelve a un paso anterior.", svg: ciclo },
  "16-filtro-casero": { caption: "Cada capa detiene algo distinto, pero el agua que sale **todavía no es potable**.", svg: filtro },
  "16-cocina-solar": { caption: "Reflector, vidrio, superficie negra y paredes aisladas: cada parte tiene una función.", svg: cocina },
  "16-qocha": { caption: "La qocha no guarda el agua para siempre: la deja **infiltrarse** para que alimente manantiales más abajo.", svg: qocha },
  "16-causas": { caption: "Describir el problema es separar **qué pasa** de **por qué pasa**: la solución ataca las causas.", svg: causas },
  "16-grafica-malla": { caption: "Tres mallas colgadas la misma noche en el mismo cerro: lo único distinto es el tamaño de los huecos.", svg: malla },
  "16-posicion": { caption: "Cinco preguntas para tomar una posición con evidencia, no solo con opinión.", svg: posicion },
  "16-grafica-terma": { caption: "Dos prototipos de terma solar probados bajo las mismas condiciones.", svg: terma },
};
