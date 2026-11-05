// Figures of "Ondas, luz y sonido". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, chain } from "../../platform/build/figkit.mjs";

const W = 360;
const arrow = (id, x1, y1, x2, y2, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x1} ${y1}L${x2} ${y2}"/>`;
const sine = (x0, y0, A, wl, x1, step = 3) => {
  let d = "";
  for (let x = x0; x <= x1; x += step) d += `${d ? "L" : "M"}${x} ${(y0 - A * Math.sin((2 * Math.PI * (x - x0)) / wl)).toFixed(1)}`;
  return d;
};
const txt = (x, y, s, cls = "d-s", anchor = "middle") => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const person = (x, y) => `<circle class="d-obj" cx="${x}" cy="${y}" r="9"/><path class="d-flow" d="M${x} ${y + 9}V${y + 40}M${x - 14} ${y + 22}H${x + 14}M${x} ${y + 40}L${x - 10} ${y + 62}M${x} ${y + 40}L${x + 10} ${y + 62}"/>`;

const onda = {
  caption: "En una onda, la **longitud de onda** (λ) es lo que mide un ciclo completo y la **amplitud** (A) es qué tan alta es.",
  svg: fig("f-09-onda", "Una onda con su cresta, su valle, su longitud de onda y su amplitud", 215, `
    <path class="d-dash" d="M10 100H350"/>
    <path class="d-flow-acc" d="${sine(20, 100, 36, 120, 340)}"/>
    ${txt(290, 50, "cresta")}
    ${txt(110, 150, "valle")}
    <path class="d-flow" marker-end="url(#f-09-onda)" d="M110 36H53"/>
    <path class="d-flow" marker-end="url(#f-09-onda)" d="M110 36H167"/>
    ${txt(110, 28, "λ", "d-a")}
    <path class="d-dash" d="M50 36V64M170 36V64"/>
    <path class="d-flow" marker-end="url(#f-09-onda)" d="M290 100V68"/>
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
    svg: fig("f-09-tipos", "Onda transversal y onda longitudinal", 268, `
      ${txt(180, 18, "Transversal (una cuerda)", "d-t")}
      <path class="d-flow-acc" d="${sine(24, 66, 22, 104, 336)}"/>
      <path class="d-flow" marker-end="url(#f-09-tipos)" d="M24 108H104"/>
      ${txt(180, 112, "la onda avanza →", "d-s", "start")}
      ${txt(180, 144, "Longitudinal (un resorte)", "d-t")}
      ${ticks}
      <path class="d-flow" marker-end="url(#f-09-tipos)" d="M24 218H104"/>
      ${txt(112, 222, "la onda avanza →", "d-s", "start")}
      ${txt(180, 250, "Apretado y estirado, una y otra vez", "d-s")}`, W),
  };
})();

const cualidades = (() => {
  const cell = (x, y, wl, A, title, sub) =>
    `<rect class="d-box-line" x="${x}" y="${y}" width="170" height="118" rx="10"/><path class="d-flow-acc" d="${sine(x + 10, y + 44, A, wl, x + 160, 2)}"/>${txt(x + 85, y + 92, title, "d-t")}${txt(x + 85, y + 110, sub, "d-s")}`;
  return {
    caption: "El **tono** depende de la frecuencia (ondas juntas = agudo); la **intensidad**, de la amplitud (ondas altas = fuerte).",
    svg: fig("f-09-cual", "Sonido grave y agudo, débil y fuerte", 262, `
      ${cell(6, 6, 70, 20, "Grave", "pocas vibraciones")}
      ${cell(184, 6, 24, 20, "Agudo", "muchas vibraciones")}
      ${cell(6, 136, 50, 9, "Débil", "amplitud pequeña")}
      ${cell(184, 136, 50, 28, "Fuerte", "amplitud grande")}`, W),
  };
})();

const eco = {
  caption: "El eco es el sonido que **va y vuelve**: la distancia a la pared es la mitad de lo que recorrió el sonido.",
  svg: fig("f-09-eco", "Una persona grita y el sonido rebota en una pared", 150, `
    ${person(40, 20)}
    <path class="d-line" stroke-width="5" d="M300 10V120"/>
    ${arrow("f-09-eco", 62, 48, 288, 48)}
    ${arrow("f-09-eco", 288, 78, 62, 78, true)}
    ${txt(175, 40, "ida", "d-s")}
    ${txt(175, 100, "vuelta", "d-a")}
    ${txt(300, 140, "pared", "d-s")}
    ${txt(40, 112, "tú", "d-s")}`, W),
};

const trueno = {
  caption: "La luz del rayo llega casi al instante; el sonido tarda. Ese **retraso** te dice a qué distancia cayó.",
  svg: fig("f-09-trueno", "Cálculo de la distancia a un rayo con el tiempo que tarda el trueno", 228, `
    <path class="d-flow-acc" d="M50 8L36 40L52 44L34 84"/>
    ${person(310, 22)}
    <path class="d-dash" d="M60 95H300"/>
    ${txt(50, 118, "rayo", "d-s", "start")}
    ${txt(300, 118, "tú", "d-s", "end")}
    ${note(180, 24, "Luz: casi al instante", 150, "d-a", "middle")}
    ${note(180, 60, "Sonido: 340 m cada segundo", 150, "d-s", "middle")}
    ${box(40, 126, 280, 84, "distancia = 340 m/s × tiempo", ["Si el trueno llega 3 s después:", "340 × 3 = 1 020 m, cerca de 1 km"], "d-acc")}`, W),
};

const reflexion = {
  caption: "Ley de la reflexión: el ángulo con que llega el rayo es **igual** al ángulo con que sale.",
  svg: fig("f-09-ref", "Un rayo de luz que se refleja en un espejo plano", 215, `
    <path class="d-line" stroke-width="5" d="M30 150H330"/>
    <path class="d-dash" d="M180 40V150"/>
    ${arrow("f-09-ref", 70, 60, 178, 148)}
    ${arrow("f-09-ref", 182, 148, 290, 60, true)}
    ${txt(70, 52, "rayo incidente", "d-s", "start")}
    ${txt(290, 52, "rayo reflejado", "d-a", "end")}
    ${txt(180, 32, "normal", "d-s")}
    ${txt(180, 176, "espejo", "d-s")}
    ${note(180, 198, "ángulo de incidencia = ángulo de reflexión", 320, "d-s", "middle")}`, W),
};

const refraccion = {
  caption: "Al pasar del aire al agua la luz **va más lento** y su rayo se desvía hacia la normal.",
  svg: fig("f-09-refr", "Un rayo de luz que se desvía al pasar del aire al agua", 224, `
    <rect class="d-water" x="6" y="108" width="348" height="108" rx="6"/>
    ${txt(344, 30, "Aire", "d-t", "end")}
    ${txt(344, 132, "Agua", "d-t", "end")}
    <path class="d-dash" d="M130 10V216"/>
    ${arrow("f-09-refr", 50, 20, 130, 108)}
    ${arrow("f-09-refr", 130, 108, 184, 200, true)}
    ${txt(136, 24, "normal", "d-s", "start")}
    ${note(192, 160, "rayo desviado", 90, "d-a", "start")}`, W),
};

const lentes = {
  caption: "Una lente **convexa** junta los rayos en un punto; una **cóncava** los separa.",
  svg: fig("f-09-len", "Lente convexa que une los rayos y lente cóncava que los separa", 232, `
    <path class="d-water" d="M85 20Q108 80 85 140Q62 80 85 20Z"/>
    <path class="d-water" d="M260 20H300Q285 80 300 140H260Q275 80 260 20Z"/>
    <path class="d-flow-acc" d="M8 40H80L168 80M8 80H168M8 120H80L168 80"/>
    <path class="d-flow-acc" d="M186 40H270L346 18M186 80H346M186 120H270L346 142"/>
    ${txt(90, 172, "Convexa", "d-t")}
    ${txt(270, 172, "Cóncava", "d-t")}
    ${note(90, 192, "lupa, microscopio", 160, "d-s", "middle")}
    ${note(270, 192, "lentes para la miopía", 160, "d-s", "middle")}`, W),
};

const colorCh = chain("f-09-col", [
      ["Luz blanca", "todos los colores juntos"],
      ["Polera roja", "refleja el rojo y absorbe los demás", "d-acc"],
      ["Tus ojos", "reciben solo luz roja y ven rojo"],
    ], { per: 1, ch: 70, gap: 30, y0: 6, W, m: 40 });
const colorObjeto = {
  caption: "Ves el color que el objeto **refleja**; los demás los absorbe.",
  svg: fig("f-09-col", "Por qué una polera roja se ve roja", colorCh.h, colorCh.svg, W),
};


const frecuencia = {
  caption: "En el mismo **1 segundo**: más ciclos es más **frecuencia** y una **longitud de onda** más corta.",
  svg: fig("f-09-frec", "Dos ondas en un segundo: una con 2 ciclos y otra con 4 ciclos", 252, `
    ${txt(180, 16, "Frecuencia baja: 2 ciclos en 1 s = 2 Hz", "d-t")}
    <path class="d-flow-acc" d="${sine(30, 66, 24, 150, 330)}"/>
    ${txt(180, 112, "ondas largas (λ grande)", "d-s")}
    ${txt(180, 144, "Frecuencia alta: 4 ciclos en 1 s = 4 Hz", "d-t")}
    <path class="d-flow-acc" d="${sine(30, 194, 24, 75, 330)}"/>
    ${txt(180, 240, "ondas cortas (λ pequeña)", "d-s")}`, W),
};

const espectro = (() => {
  const rows = [
    ["Radio", "metros o más", "radio, televisión"],
    ["Microondas", "centímetros", "horno, celular, wifi"],
    ["Infrarrojo", "0,01 mm", "control remoto, calor"],
    ["Luz visible", "400 a 700 nm", "lo que ven tus ojos"],
    ["Ultravioleta", "menos de 400 nm", "el sol que broncea"],
    ["Rayos X", "menos de 10 nm", "radiografías"],
  ];
  const body = rows
    .map(([t, wl, u], i) => `${box(40, 34 + i * 48, 120, 38, t, "", i === 3 ? "d-acc" : "d-box")}${txt(172, 50 + i * 48, `λ: ${wl}`, "d-s", "start")}${txt(172, 67 + i * 48, u, "d-s", "start")}`)
    .join("");
  return {
    caption: "Todas son **ondas electromagnéticas**. De arriba abajo, la longitud de onda baja y la frecuencia sube. (nm = nanómetro, una milmillonésima de metro).",
    svg: fig("f-09-esp", "Espectro electromagnético, de las ondas de radio a los rayos X", 360, `
      ${txt(40, 18, "λ larga, frecuencia baja", "d-a", "start")}
      <path class="d-flow-acc" marker-end="url(#f-09-espa)" d="M18 28V332"/>
      ${body}
      ${txt(40, 352, "λ corta, frecuencia alta", "d-a", "start")}`, W),
  };
})();

const visible = (() => {
  const cols = [["Rojo", "d-fill-5"], ["Naranja", "d-fill-2"], ["Amarillo", "d-fill-6"], ["Verde", "d-fill-3"], ["Azul", "d-fill-1"], ["Violeta", "d-fill-4"]];
  const bars = cols.map(([n, c], i) => `<rect class="${c}" x="${24 + i * 52}" y="30" width="52" height="44"/>`).join("");
  const labels = cols.map(([n], i) => txt(50 + i * 52, 94 + (i % 2) * 18, n, "d-s")).join("");
  return {
    caption: "Cada color de la luz visible es una onda de distinta **longitud de onda**: el rojo la tiene más larga y el violeta, más corta.",
    svg: fig("f-09-vis", "Los colores de la luz visible ordenados por longitud de onda, del rojo al violeta", 186, `
      ${txt(180, 18, "Luz visible", "d-t")}
      ${bars}${labels}
      <path class="d-flow-acc" marker-end="url(#f-09-visa)" d="M24 136H336"/>
      ${txt(24, 158, "700 nm: λ mayor, f menor", "d-s", "start")}
      ${txt(336, 176, "400 nm: λ menor, f mayor", "d-s", "end")}`, W),
  };
})();

const especularDifusa = {
  caption: "En una superficie **lisa** los rayos rebotan ordenados; en una **rugosa** rebotan en todas direcciones.",
  svg: fig("f-09-esd", "Reflexión en una superficie lisa y en una rugosa", 200, `
    ${txt(90, 18, "Lisa (espejo)", "d-t")}${txt(270, 18, "Rugosa (pared)", "d-t")}
    <path class="d-line" stroke-width="5" d="M10 140H170"/>
    <path class="d-line" stroke-width="5" d="M190 140L205 134L220 142L235 133L250 142L265 134L280 142L295 133L310 142L325 134L340 140L350 140"/>
    ${arrow("f-09-esd", 30, 50, 60, 138)}${arrow("f-09-esd", 100, 50, 130, 138)}
    ${arrow("f-09-esd", 60, 138, 90, 50, true)}${arrow("f-09-esd", 130, 138, 160, 50, true)}
    ${arrow("f-09-esd", 210, 50, 232, 134)}${arrow("f-09-esd", 265, 50, 280, 134)}${arrow("f-09-esd", 320, 50, 325, 134)}
    ${arrow("f-09-esd", 232, 134, 200, 66, true)}${arrow("f-09-esd", 280, 134, 288, 60, true)}${arrow("f-09-esd", 325, 134, 346, 92, true)}
    ${note(90, 168, "Se forma una imagen nítida", 160, "d-s", "middle")}
    ${note(270, 168, "Se ve el objeto, no una imagen", 160, "d-s", "middle")}`, W),
};

const sorbete = {
  caption: "Al salir del agua el rayo se **aleja de la normal**. Tu ojo lo sigue en línea recta y ve el objeto **más arriba** de donde está.",
  svg: fig("f-09-sor", "Por qué un objeto dentro del agua se ve más arriba de lo que está", 262, `
    <rect class="d-water" x="6" y="110" width="348" height="146" rx="6"/>
    ${txt(344, 130, "Agua", "d-t", "end")}${txt(344, 100, "Aire", "d-t", "end")}
    <path class="d-dash" d="M150 30V250"/>
    ${txt(156, 44, "normal", "d-s", "start")}
    <circle class="d-fill-2" cx="90" cy="214" r="9"/>
    ${arrow("f-09-sor", 94, 206, 148, 112)}
    ${arrow("f-09-sor", 150, 110, 268, 38, true)}
    <path class="d-dash" d="M150 110L98 140"/>
    <circle class="d-stroke-2" stroke-dasharray="4 3" cx="94" cy="142" r="9"/>
    <circle class="d-fill-acc" cx="276" cy="34" r="6"/>
    ${txt(284, 56, "tu ojo", "d-s", "start")}
    ${txt(40, 240, "objeto real", "d-s", "start")}
    ${note(28, 164, "dónde lo ves", 80, "d-a", "start")}`, W),
};

const dispersion = (() => {
  const cols = [["d-stroke-5", 164], ["d-stroke-2", 176], ["d-stroke-6", 188], ["d-stroke-3", 200], ["d-stroke-1", 212], ["d-stroke-4", 224]];
  const rays = cols.map(([c, y]) => `<path class="${c}" stroke-width="3" d="M194 128L286 ${y}"/>`).join("");
  return {
    caption: "Un **prisma** separa la luz blanca en colores: el violeta se desvía más que el rojo.",
    svg: fig("f-09-pri", "Un prisma separa la luz blanca en los colores del arcoíris", 262, `
      <path class="d-obj" d="M150 40L95 150L205 150Z"/>
      <path class="d-flow" marker-end="url(#f-09-pri)" d="M20 116L108 120"/>
      <path class="d-flow" d="M111 120L194 128"/>
      ${txt(20, 104, "luz blanca", "d-s", "start")}
      ${rays}
      ${txt(292, 168, "rojo", "d-s", "start")}${txt(292, 232, "violeta", "d-s", "start")}
      ${note(180, 250, "Cada color se refracta con un ángulo distinto", 340, "d-s", "middle")}`, W),
  };
})();

const arcoiris = (() => {
  const c = { x: 210, y: 100 }, r = 56, rad = (d) => (d * Math.PI) / 180;
  const pt = (a) => [c.x + r * Math.cos(rad(a)), c.y + r * Math.sin(rad(a))];
  const [x1, y1] = pt(250), [x2, y2] = pt(350), [x3, y3] = pt(90);
  const ex = (deg, cls) => `<path class="${cls}" stroke-width="3" d="M${x3.toFixed(1)} ${y3.toFixed(1)}L${(x3 + 130 * Math.cos(rad(deg))).toFixed(1)} ${(y3 + 130 * Math.sin(rad(deg))).toFixed(1)}"/>`;
  return {
    caption: "Dentro de cada gota la luz **se refracta, se refleja y se refracta otra vez**: sale separada en colores.",
    svg: fig("f-09-arc", "Un rayo de sol entra en una gota de lluvia, rebota por dentro y sale separado en colores", 296, `
      <circle class="d-water" cx="${c.x}" cy="${c.y}" r="${r}"/>
      <path class="d-flow" marker-end="url(#f-09-arc)" d="M16 ${y1.toFixed(1)}L${x1.toFixed(1)} ${y1.toFixed(1)}"/>
      <path class="d-flow" d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${x3.toFixed(1)} ${y3.toFixed(1)}"/>
      ${ex(132, "d-stroke-5")}${ex(146, "d-stroke-4")}
      ${txt(16, 22, "Luz del Sol", "d-s", "start")}
      ${txt(x1 - 8, y1 - 10, "1", "d-a")}${txt(x2 + 12, y2 + 4, "2", "d-a")}${txt(x3 + 12, y3 + 16, "3", "d-a")}
      ${txt(122, 274, "rojo", "d-s", "end")}${txt(94, 232, "violeta", "d-s", "end")}
      ${note(254, 186, "1 y 3: se refracta", 100, "d-s", "start")}
      ${note(254, 232, "2: se refleja", 100, "d-s", "start")}`, W),
  };
})();

export default {
  "09-onda": onda, "09-tipos-onda": tiposOnda, "09-frecuencia": frecuencia, "09-espectro": espectro, "09-visible": visible,
  "09-reflexion": reflexion, "09-especular-difusa": especularDifusa, "09-color-objeto": colorObjeto,
  "09-refraccion": refraccion, "09-sorbete": sorbete, "09-lentes": lentes, "09-dispersion": dispersion, "09-arcoiris": arcoiris,
  "09-cualidades": cualidades, "09-eco": eco, "09-trueno": trueno,
};
