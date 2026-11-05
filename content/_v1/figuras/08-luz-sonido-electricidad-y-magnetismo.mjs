// Figures of "Luz, sonido, electricidad y magnetismo". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, chain } from "../../../platform/build/figkit.mjs";

const W = 360;
const arrow = (id, x1, y1, x2, y2, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x1} ${y1}L${x2} ${y2}"/>`;
const sine = (x0, y0, A, wl, x1, step = 3) => {
  let d = "";
  for (let x = x0; x <= x1; x += step) d += `${d ? "L" : "M"}${x} ${(y0 - A * Math.sin((2 * Math.PI * (x - x0)) / wl)).toFixed(1)}`;
  return d;
};
const txt = (x, y, s, cls = "d-s", anchor = "middle") => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const person = (x, y) => `<circle class="d-box-line" cx="${x}" cy="${y}" r="9"/><path class="d-line" d="M${x} ${y + 9}V${y + 40}M${x - 14} ${y + 22}H${x + 14}M${x} ${y + 40}L${x - 10} ${y + 62}M${x} ${y + 40}L${x + 10} ${y + 62}"/>`;
const bulb = (x, y, r = 13) => `<circle class="d-box" cx="${x}" cy="${y}" r="${r}"/><path class="d-line" d="M${x - r * 0.7} ${y - r * 0.7}L${x + r * 0.7} ${y + r * 0.7}M${x + r * 0.7} ${y - r * 0.7}L${x - r * 0.7} ${y + r * 0.7}"/>`;
// Battery symbol on a vertical wire at x, centred on y: long plate (+) on top, short plate (-) below.
const battery = (x, y) => `<path class="d-flow" d="M${x - 14} ${y - 6}H${x + 14}"/><path class="d-flow" stroke-width="5" d="M${x - 8} ${y + 6}H${x + 8}"/>`;

const onda = {
  caption: "En una onda, la **longitud de onda** (λ) es lo que mide un ciclo completo y la **amplitud** (A) es qué tan alta es.",
  svg: fig("f-08-onda", "Una onda con su cresta, su valle, su longitud de onda y su amplitud", 215, `
    <path class="d-dash" d="M10 100H350"/>
    <path class="d-flow-acc" d="${sine(20, 100, 36, 120, 340)}"/>
    ${txt(290, 50, "cresta")}
    ${txt(110, 150, "valle")}
    <path class="d-flow" marker-end="url(#f-08-onda)" d="M110 36H53"/>
    <path class="d-flow" marker-end="url(#f-08-onda)" d="M110 36H167"/>
    ${txt(110, 28, "λ", "d-a")}
    <path class="d-dash" d="M50 36V64M170 36V64"/>
    <path class="d-flow" marker-end="url(#f-08-onda)" d="M290 100V68"/>
    ${txt(284, 92, "A", "d-a", "end")}
    ${note(180, 184, "λ: distancia entre dos crestas seguidas", 330, "d-s", "middle")}
    ${note(180, 202, "A: altura de la cresta desde el centro", 330, "d-s", "middle")}`, W),
};

const tiposOnda = (() => {
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23, x = 24 + t * 312 + 10 * Math.sin(t * 6 * Math.PI) * -1;
    return `<path class="d-flow" d="M${x.toFixed(1)} 168V196"/>`;
  }).join("");
  return {
    caption: "En una onda **transversal** las partículas vibran de lado; en una **longitudinal**, hacia adelante y hacia atrás.",
    svg: fig("f-08-tipos", "Onda transversal y onda longitudinal", 268, `
      ${txt(180, 18, "Transversal (una cuerda)", "d-t")}
      <path class="d-flow-acc" d="${sine(24, 66, 22, 104, 336)}"/>
      <path class="d-flow" marker-end="url(#f-08-tipos)" d="M24 108H104"/>
      ${txt(180, 112, "la onda avanza →", "d-s", "start")}
      ${txt(180, 144, "Longitudinal (un resorte)", "d-t")}
      ${ticks}
      <path class="d-flow" marker-end="url(#f-08-tipos)" d="M24 218H104"/>
      ${txt(112, 222, "la onda avanza →", "d-s", "start")}
      ${txt(180, 250, "Apretado y estirado, una y otra vez", "d-s")}`, W),
  };
})();

const cualidades = (() => {
  const cell = (x, y, wl, A, title, sub) =>
    `<rect class="d-box-line" x="${x}" y="${y}" width="170" height="118" rx="10"/><path class="d-flow-acc" d="${sine(x + 10, y + 44, A, wl, x + 160, 2)}"/>${txt(x + 85, y + 92, title, "d-t")}${txt(x + 85, y + 110, sub, "d-s")}`;
  return {
    caption: "El **tono** depende de la frecuencia (ondas juntas = agudo); la **intensidad**, de la amplitud (ondas altas = fuerte).",
    svg: fig("f-08-cual", "Sonido grave y agudo, débil y fuerte", 262, `
      ${cell(6, 6, 70, 20, "Grave", "pocas vibraciones")}
      ${cell(184, 6, 24, 20, "Agudo", "muchas vibraciones")}
      ${cell(6, 136, 50, 9, "Débil", "amplitud pequeña")}
      ${cell(184, 136, 50, 28, "Fuerte", "amplitud grande")}`, W),
  };
})();

const eco = {
  caption: "El eco es el sonido que **va y vuelve**: la distancia a la pared es la mitad de lo que recorrió el sonido.",
  svg: fig("f-08-eco", "Una persona grita y el sonido rebota en una pared", 150, `
    ${person(40, 20)}
    <path class="d-line" stroke-width="5" d="M300 10V120"/>
    ${arrow("f-08-eco", 62, 48, 288, 48)}
    ${arrow("f-08-eco", 288, 78, 62, 78, true)}
    ${txt(175, 40, "ida", "d-s")}
    ${txt(175, 100, "vuelta", "d-a")}
    ${txt(300, 140, "pared", "d-s")}
    ${txt(40, 112, "tú", "d-s")}`, W),
};

const trueno = {
  caption: "La luz del rayo llega casi al instante; el sonido tarda. Ese **retraso** te dice a qué distancia cayó.",
  svg: fig("f-08-trueno", "Cálculo de la distancia a un rayo con el tiempo que tarda el trueno", 228, `
    <path class="d-flow-acc" d="M50 8L36 40L52 44L34 84"/>
    ${person(310, 22)}
    <path class="d-dash" d="M60 95H300"/>
    ${txt(50, 118, "rayo", "d-s", "start")}
    ${txt(300, 118, "tú", "d-s", "end")}
    ${note(180, 24, "Luz: casi al instante", 150, "d-a", "middle")}
    ${note(180, 60, "Sonido: 340 m cada segundo", 150, "d-s", "middle")}
    ${box(40, 126, 280, 84, "distancia = 340 m/s × tiempo", ["Si el trueno llega 3 s después:", "340 × 3 = 1 020 m, cerca de 1 km"], "d-acc")}`, W),
};

const espectro = (() => {
  const items = [
    ["Ondas de radio", "radio, televisión"],
    ["Microondas", "horno, celular"],
    ["Infrarrojo", "control remoto, calor"],
    ["Luz visible", "lo que ven tus ojos"],
    ["Ultravioleta", "el sol que broncea"],
    ["Rayos X", "radiografías"],
    ["Rayos gamma", "medicina nuclear"],
  ];
  const rows = items.map(([t, u], i) => `${box(10, 40 + i * 44, 140, 36, t, "", i === 3 ? "d-acc" : "d-box")}${note(162, 62 + i * 44, u, 190, "d-s", "start")}`).join("");
  return {
    caption: "Todas son **ondas electromagnéticas** y viajan a la velocidad de la luz; solo una pequeña parte la ven tus ojos.",
    svg: fig("f-08-esp", "Espectro electromagnético, de las ondas de radio a los rayos gamma", 356, `
      ${txt(10, 22, "Ondas más largas", "d-s", "start")}${rows}${txt(10, 352, "Ondas más cortas y más energía", "d-s", "start")}`, W),
  };
})();

const reflexion = {
  caption: "Ley de la reflexión: el ángulo con que llega el rayo es **igual** al ángulo con que sale.",
  svg: fig("f-08-ref", "Un rayo de luz que se refleja en un espejo plano", 215, `
    <path class="d-line" stroke-width="5" d="M30 150H330"/>
    <path class="d-dash" d="M180 40V150"/>
    ${arrow("f-08-ref", 70, 60, 178, 148)}
    ${arrow("f-08-ref", 182, 148, 290, 60, true)}
    ${txt(70, 52, "rayo incidente", "d-s", "start")}
    ${txt(290, 52, "rayo reflejado", "d-a", "end")}
    ${txt(180, 32, "normal", "d-s")}
    ${txt(180, 176, "espejo", "d-s")}
    ${note(180, 198, "ángulo de incidencia = ángulo de reflexión", 320, "d-s", "middle")}`, W),
};

const refraccion = {
  caption: "Al pasar del aire al agua la luz **va más lento** y su rayo se desvía hacia la normal.",
  svg: fig("f-08-refr", "Un rayo de luz que se desvía al pasar del aire al agua", 224, `
    <rect class="d-box" x="6" y="108" width="348" height="108" rx="6"/>
    ${txt(344, 30, "Aire", "d-t", "end")}
    ${txt(344, 132, "Agua", "d-t", "end")}
    <path class="d-dash" d="M130 10V216"/>
    ${arrow("f-08-refr", 50, 20, 130, 108)}
    ${arrow("f-08-refr", 130, 108, 184, 200, true)}
    ${txt(136, 24, "normal", "d-s", "start")}
    ${note(192, 160, "rayo desviado", 90, "d-a", "start")}`, W),
};

const lentes = {
  caption: "Una lente **convexa** junta los rayos en un punto; una **cóncava** los separa.",
  svg: fig("f-08-len", "Lente convexa que une los rayos y lente cóncava que los separa", 232, `
    <path class="d-box" d="M85 20Q108 80 85 140Q62 80 85 20Z"/>
    <path class="d-box" d="M260 20H300Q285 80 300 140H260Q275 80 260 20Z"/>
    <path class="d-flow-acc" d="M8 40H80L168 80M8 80H168M8 120H80L168 80"/>
    <path class="d-flow-acc" d="M186 40H270L346 18M186 80H346M186 120H270L346 142"/>
    ${txt(90, 172, "Convexa", "d-t")}
    ${txt(270, 172, "Cóncava", "d-t")}
    ${note(90, 192, "lupa, microscopio", 160, "d-s", "middle")}
    ${note(270, 192, "lentes para la miopía", 160, "d-s", "middle")}`, W),
};

const colorCh = chain("f-08-col", [
      ["Luz blanca", "todos los colores juntos"],
      ["Polera roja", "refleja el rojo y absorbe los demás", "d-acc"],
      ["Tus ojos", "reciben solo luz roja y ven rojo"],
    ], { per: 1, ch: 70, gap: 30, y0: 6, W, m: 40 });
const colorObjeto = {
  caption: "Ves el color que el objeto **refleja**; los demás los absorbe.",
  svg: fig("f-08-col", "Por qué una polera roja se ve roja", colorCh.h, colorCh.svg, W),
};

const cargas = (() => {
  const signs = (x, y, plus, minus) => {
    let s = "";
    for (let i = 0; i < plus; i++) s += txt(x + 18 + i * 22, y, "+", "d-n");
    for (let i = 0; i < minus; i++) s += txt(x + 18 + i * 22, y + 20, "−", "d-a");
    return s;
  };
  return {
    caption: "Al frotar, los **electrones** pasan de un objeto a otro: quien los gana queda negativo, quien los pierde, positivo.",
    svg: fig("f-08-car", "Electrización por frotamiento entre el cabello y un globo", 298, `
      ${txt(180, 18, "Antes de frotar: neutros", "d-t")}
      ${box(10, 28, 150, 82, "", "")}${txt(85, 50, "Cabello", "d-t")}${signs(10, 70, 3, 3)}
      ${box(200, 28, 150, 82, "", "")}${txt(275, 50, "Globo", "d-t")}${signs(200, 70, 3, 3)}
      ${txt(180, 136, "Después de frotar", "d-t")}
      <path class="d-flow-acc" marker-end="url(#f-08-cara)" d="M160 187H200"/>
      ${txt(180, 177, "e⁻", "d-a")}
      ${box(10, 146, 150, 82, "", "")}${txt(85, 168, "Cabello", "d-t")}${signs(10, 188, 3, 1)}
      ${box(200, 146, 150, 82, "", "")}${txt(275, 168, "Globo", "d-t")}${signs(200, 188, 3, 5)}
      ${txt(85, 250, "positivo", "d-n")}${txt(275, 250, "negativo", "d-a")}
      ${note(180, 278, "Cargas opuestas se atraen: el globo jala el cabello", 330, "d-s", "middle")}`, W),
  };
})();

const circuito = {
  caption: "Un circuito simple: la **pila** empuja las cargas, los **cables** las llevan y el **foco** las aprovecha. El interruptor abre o cierra el paso.",
  svg: fig("f-08-cir", "Circuito eléctrico simple con pila, interruptor, foco y cables", 210, `
    <path class="d-flow" d="M40 40H150M210 40H320V84M320 116V160H40V112M40 88V40"/>
    <path class="d-flow" d="M150 40L198 22"/>
    <circle class="d-fill-acc" cx="150" cy="40" r="3"/><circle class="d-fill-acc" cx="210" cy="40" r="3"/>
    ${battery(40, 100)}
    ${bulb(320, 100, 16)}
    <path class="d-flow-acc" marker-end="url(#f-08-cira)" d="M236 40H282"/>
    <path class="d-flow-acc" marker-end="url(#f-08-cira)" d="M200 160H146"/>
    ${txt(62, 106, "Pila", "d-s", "start")}
    ${txt(300, 106, "Foco", "d-s", "end")}
    ${txt(180, 68, "Interruptor", "d-s")}
    ${txt(180, 184, "Cables (conductores)", "d-s")}`, W),
};

const seriePar = {
  caption: "En **serie** hay un solo camino; en **paralelo**, un camino para cada foco.",
  svg: fig("f-08-sp", "Dos focos conectados en serie y en paralelo", 330, `
    ${txt(180, 16, "En serie", "d-t")}
    <path class="d-flow" d="M40 34H112M148 34H212M248 34H320V100H40V70M40 34V50"/>
    ${battery(40, 60)}
    ${bulb(130, 34)}${bulb(230, 34)}
    ${txt(180, 128, "Si un foco se funde, se apagan los dos", "d-s")}
    ${txt(180, 184, "En paralelo", "d-t")}
    <path class="d-flow" d="M40 202H250M40 202V230M40 270V290H250M120 202V215M120 247V290M250 202V215M250 247V290"/>
    ${battery(40, 250)}
    ${bulb(120, 232)}${bulb(250, 232)}
    ${note(180, 318, "Si uno se funde, el otro sigue encendido", 340, "d-s", "middle")}`, W),
};

const imanPolos = (() => {
  const bar = (x, y, left, right) => `${box(x, y, 46, 40, left, "", left === "N" ? "d-acc" : "d-box")}${box(x + 46, y, 46, 40, right, "", right === "N" ? "d-acc" : "d-box")}`;
  return {
    caption: "Polos **distintos** se atraen; polos **iguales** se repelen.",
    svg: fig("f-08-pol", "Dos imanes que se atraen y dos que se repelen", 220, `
      ${bar(24, 16, "S", "N")}${bar(244, 16, "S", "N")}
      ${arrow("f-08-pol", 124, 36, 150, 36, true)}${arrow("f-08-pol", 238, 36, 212, 36, true)}
      ${txt(180, 82, "Atracción: N con S", "d-a")}
      ${bar(24, 116, "S", "N")}${bar(244, 116, "N", "S")}
      ${arrow("f-08-pol", 150, 136, 124, 136)}${arrow("f-08-pol", 212, 136, 238, 136)}
      ${txt(180, 182, "Repulsión: N con N", "d-t")}`, W),
  };
})();

const tierra = {
  caption: "La Tierra se comporta como un **imán gigante**: por eso la aguja de la brújula siempre se orienta hacia el norte.",
  svg: fig("f-08-tie", "La Tierra como un imán con sus líneas de campo magnético", 262, `
    <circle class="d-box" cx="180" cy="126" r="64"/>
    <rect class="d-box-line" x="168" y="76" width="24" height="100" rx="4"/>
    ${txt(180, 100, "S", "d-n")}${txt(180, 156, "N", "d-a")}
    <path class="d-flow" marker-end="url(#f-08-tie)" d="M192 194C290 204 290 58 192 58"/>
    <path class="d-flow" marker-end="url(#f-08-tie)" d="M168 194C70 204 70 58 168 58"/>
    <path class="d-flow" marker-end="url(#f-08-tie)" d="M196 204C336 222 336 34 196 48"/>
    <path class="d-flow" marker-end="url(#f-08-tie)" d="M164 204C24 222 24 34 164 48"/>
    ${txt(180, 18, "Norte geográfico", "d-t")}
    ${txt(180, 250, "Sur geográfico", "d-t")}`, W),
};

const hidroCh = chain("f-08-hid", [
      ["El agua cae", "desde la presa"],
      ["La turbina gira", "el agua empuja sus aspas"],
      ["Imanes giran", "frente a bobinas de cobre"],
      ["Sale corriente", "por inducción"],
      ["Líneas de alta tensión", "llevan la energía"],
      ["Tu casa", "tomacorriente de 220 V", "d-acc"],
    ], { per: 2, ch: 70, gap: 40, y0: 8, W, m: 20 });
const hidro = {
  caption: "Una central hidroeléctrica usa el **magnetismo** para transformar la energía del agua en electricidad.",
  svg: fig("f-08-hid", "Pasos para generar electricidad en una central hidroeléctrica", hidroCh.h, hidroCh.svg, W),
};

export default { "08-onda": onda, "08-tipos-onda": tiposOnda, "08-cualidades": cualidades, "08-eco": eco, "08-trueno": trueno, "08-espectro": espectro, "08-reflexion": reflexion, "08-refraccion": refraccion, "08-lentes": lentes, "08-color-objeto": colorObjeto, "08-cargas": cargas, "08-circuito": circuito, "08-serie-paralelo": seriePar, "08-iman-polos": imanPolos, "08-tierra": tierra, "08-hidro": hidro };
