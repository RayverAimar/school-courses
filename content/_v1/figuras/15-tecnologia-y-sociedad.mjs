// Figures of "Tecnología y sociedad". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, chain } from "../../../platform/build/figkit.mjs";

const W = 360;

// Ciencia, técnica y tecnología: the question each one answers.
const tres = fig("f-15-tres", "Tres cajas: la ciencia responde por qué pasa, la técnica responde cómo se hace y la tecnología responde cómo resolver una necesidad", 330, `
  ${box(20, 10, 320, 86, "Ciencia: ¿por qué pasa?", ["Explica el mundo con observaciones y datos", "Ej.: el agua líquida se evapora con el calor"], "d-box")}
  ${box(20, 120, 320, 86, "Técnica: ¿cómo se hace?", ["Saber hacer algo, con práctica y oficio", "Ej.: el tejido de una manta o cocinar un ceviche"], "d-box-line")}
  ${box(20, 230, 320, 86, "Tecnología: ¿cómo resuelvo esto?", ["Usa ciencia y técnica para resolver una necesidad", "Ej.: una cocina solar para zonas sin gas"], "d-acc")}`, W);

// The design cycle, six steps and the loop back.
const ciclo = (() => {
  const c = chain("f-15-ciclo", [
    ["1. Determinar el problema", "¿Qué necesidad hay y para quién?"],
    ["2. Buscar alternativas", "Varias ideas, no solo una"],
    ["3. Diseñar la solución", "Dibujo, materiales y criterios"],
    ["4. Construir el prototipo", "Una primera versión que funcione"],
    ["5. Probar y evaluar", "Medir con datos si resuelve el problema", "d-acc"],
    ["6. Comunicar y mejorar", "Mostrar el resultado y corregir"],
  ], { per: 1, ch: 52, gap: 20, m: 26, closing: true, W });
  return fig("f-15-ciclo", "Ciclo de seis pasos del diseño tecnológico: determinar el problema, buscar alternativas, diseñar, construir el prototipo, probar y evaluar, comunicar y mejorar, y volver a empezar", c.h, c.svg, W);
})();

// Fog collector: fog + wind -> mesh -> gutter -> tank.
const drops = (xs, y) => xs.map((x, i) => `<circle class="d-fill-acc" cx="${x}" cy="${y + (i % 2) * 9}" r="3"/>`).join("");
const atrapanieblas = fig("f-15-atrapa", "Esquema de un atrapanieblas: el viento lleva la neblina contra una malla vertical, las gotas se juntan, bajan a una canaleta y llegan a un tanque", 330, `
  ${drops([20, 46, 72, 98, 124], 40)}${drops([30, 56, 82, 108, 134], 90)}${drops([20, 46, 72, 98, 124], 140)}
  <path class="d-flow-acc" marker-end="url(#f-15-atrapaa)" d="M14 70H150"/>
  <path class="d-flow-acc" marker-end="url(#f-15-atrapaa)" d="M14 120H150"/>
  ${note(14, 18, "Neblina con el viento", 150, "d-a")}
  <rect class="d-fill-hair" x="164" y="28" width="72" height="172"/>
  <path class="d-line" fill="none" d="M164 28V200M236 28V200M164 28H236M170 38L230 190M230 38L170 190M200 28V200"/>
  ${note(200, 18, "Malla", 80, "d-t", "middle")}
  <path class="d-flow" fill="none" d="M156 206H244"/>
  <path class="d-flow" marker-end="url(#f-15-atrapa)" d="M200 208V246H282"/>
  ${note(14, 226, "Las gotitas chocan con la malla, se juntan y resbalan hacia abajo", 140, "d-s")}
  ${box(284, 222, 62, 50, "Tanque", "", "d-acc")}
  ${note(214, 238, "Canaleta", 66, "d-s")}
  ${note(180, 296, "Un panel: de 200 a 400 L de agua al día", 330, "d-s", "middle")}`, W);

// Home water filter: layers in a bottle.
const filtro = fig("f-15-filtro", "Botella cortada con capas de grava, arena, carbón y algodón; arriba entra agua turbia y abajo sale agua más clara", 340, `
  <path class="d-flow" fill="none" d="M40 20V240L60 266H130L150 240V20"/>
  <rect class="d-fill-hair" x="41" y="22" width="108" height="34"/>
  <rect class="d-box" x="41" y="56" width="108" height="44"/>
  <rect class="d-fill-hair" x="41" y="100" width="108" height="44"/>
  <rect class="d-fill-acc" x="41" y="144" width="108" height="44"/>
  <rect class="d-box" x="41" y="188" width="108" height="34"/>
  <path class="d-flow" marker-end="url(#f-15-filtro)" d="M95 2V20"/>
  ${note(160, 44, "Agua turbia", 190, "d-s")}
  ${note(160, 76, "Grava", 190, "d-t")}${note(160, 92, "detiene lo más grande", 190, "d-s")}
  ${note(160, 120, "Arena", 190, "d-t")}${note(160, 136, "detiene la tierra fina", 190, "d-s")}
  ${note(160, 164, "Carbón", 190, "d-t")}${note(160, 180, "atrapa olor y sabor", 190, "d-s")}
  ${note(160, 208, "Algodón o tela", 190, "d-t")}
  <path class="d-flow-acc" marker-end="url(#f-15-filtroa)" d="M95 268V296"/>
  ${note(110, 292, "Agua más clara, pero no potable", 240, "d-a")}
  ${note(180, 330, "Hay que hervirla o clorarla", 330, "d-a", "middle")}`, W);

// Solar cooker: a box with a glass lid, a reflector and a black pot.
const cocina = fig("f-15-cocina", "Cocina solar de caja: un rayo rebota en el reflector y otros entran por la tapa de vidrio hasta una olla negra dentro de una caja aislada", 290, `
  <rect class="d-fill-hair" x="80" y="110" width="200" height="110"/>
  <path class="d-flow" fill="none" d="M80 110V220H280V110"/>
  <path class="d-flow-acc" d="M80 110H280"/>
  <path class="d-flow" d="M80 110L36 40"/>
  <rect class="d-fill-acc" x="150" y="158" width="60" height="42" rx="6"/>
  <path class="d-flow-acc" marker-end="url(#f-15-cocinaa)" d="M300 8L215 156"/>
  <path class="d-flow-acc" marker-end="url(#f-15-cocinaa)" d="M250 4L190 156"/>
  <path class="d-flow-acc" d="M170 6L54 66"/>
  <path class="d-flow-acc" marker-end="url(#f-15-cocinaa)" d="M54 66L148 164"/>
  ${note(306, 20, "Sol", 40, "d-a")}
  ${note(6, 22, "Reflector", 80, "d-t")}
  ${note(286, 106, "Vidrio", 60, "d-s")}
  ${note(180, 242, "Olla negra: absorbe la luz y se calienta", 300, "d-s", "middle")}
  ${note(180, 262, "Paredes aisladas: el calor no se escapa", 300, "d-s", "middle")}`, W);

// Qocha: rain, pond, infiltration, spring downhill.
const qocha = fig("f-15-qocha", "Corte de una ladera: la lluvia llena una qocha en la parte alta, el agua se infiltra por el suelo y reaparece más abajo en un manantial", 280, `
  <path class="d-fill-hair" d="M0 80L130 100H200L360 220V260H0Z"/>
  <path class="d-fill-acc" d="M135 100Q165 128 195 100Z"/>
  ${note(165, 90, "Qocha", 60, "d-a", "middle")}
  <path class="d-flow-acc" marker-end="url(#f-15-qochaa)" d="M50 24V60"/>
  <path class="d-flow-acc" marker-end="url(#f-15-qochaa)" d="M110 30V70"/>
  <path class="d-flow-acc" marker-end="url(#f-15-qochaa)" d="M250 70V126"/>
  ${note(10, 16, "Lluvia", 60, "d-s")}
  <path class="d-flow-acc" fill="none" stroke-dasharray="6 4" marker-end="url(#f-15-qochaa)" d="M165 128C175 180 240 196 286 180"/>
  ${note(10, 170, "Suelo: el agua se infiltra y baja despacio", 130, "d-s")}
  <circle class="d-fill-acc" cx="296" cy="177" r="6"/>
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
const terma = fig("f-15-terma", "Gráfica de temperatura del agua contra el tiempo en dos termas solares caseras: la botella pintada de negro llega a 50 grados y la clara a 32 grados en 120 minutos", 262, `
  ${ax}
  <text class="d-s" x="${(X0 + X1) / 2}" y="${YB + 40}" text-anchor="middle">Tiempo al sol (minutos)</text>
  <text class="d-s" transform="rotate(-90 12 105)" x="12" y="105" text-anchor="middle">Temperatura (°C)</text>
  <path class="d-flow-acc" fill="none" d="M${pts(serieA)}"/>
  <path class="d-flow" fill="none" d="M${pts(serieB)}"/>
  <text class="d-a" x="${px(120) - 6}" y="${py(50) - 8}" text-anchor="end">A: botella negra</text>
  <text class="d-s" x="${px(120) - 6}" y="${py(32) + 32}" text-anchor="end">B: botella clara</text>
  `, W);

export default {
  "15-ciencia-tecnica-tecnologia": { caption: "Ciencia, técnica y tecnología responden preguntas distintas, pero se ayudan entre sí.", svg: tres },
  "15-ciclo-diseno": { caption: "El diseño tecnológico es un **ciclo**: si la prueba muestra fallas, se vuelve a un paso anterior.", svg: ciclo },
  "15-atrapanieblas": { caption: "Un atrapanieblas no fabrica agua: **junta** las gotitas que ya estaban en la neblina.", svg: atrapanieblas },
  "15-filtro-casero": { caption: "Cada capa detiene algo distinto, pero el agua que sale **todavía no es potable**.", svg: filtro },
  "15-cocina-solar": { caption: "Reflector, vidrio, superficie negra y paredes aisladas: cada parte tiene una función.", svg: cocina },
  "15-qocha": { caption: "La qocha no guarda el agua para siempre: la deja **infiltrarse** para que alimente manantiales más abajo.", svg: qocha },
  "15-grafica-terma": { caption: "Dos prototipos de terma solar probados bajo las mismas condiciones.", svg: terma },
};
