import { box, note, fig, chain } from "../../../platform/build/figkit.mjs";

const W = 360;

// Pulse (beats per minute) of a student at rest, then exercising, then recovering.
const MIN = [0, 2, 3, 4, 5, 6, 7, 8, 10];
const BPM = [70, 70, 120, 150, 125, 100, 85, 75, 70];

function pulso() {
  const X0 = 46, Y0 = 20, PW = 290, PH = 200, XMAX = 10, YMAX = 180;
  const px = (t) => X0 + (t / XMAX) * PW;
  const py = (v) => Y0 + PH - (v / YMAX) * PH;
  let s = `<path class="d-line" d="M${X0} ${Y0}V${Y0 + PH}H${X0 + PW}"/>`;
  for (let v = 0; v <= YMAX; v += 30) s += `<text class="d-n" x="${X0 - 6}" y="${py(v) + 4}" text-anchor="end">${v}</text><path class="d-line" d="M${X0 - 3} ${py(v)}H${X0}"/>`;
  for (let t = 0; t <= XMAX; t += 2) s += `<text class="d-n" x="${px(t)}" y="${Y0 + PH + 18}" text-anchor="middle">${t}</text><path class="d-line" d="M${px(t)} ${Y0 + PH}V${Y0 + PH + 3}"/>`;
  s += `<text class="d-s" x="${X0 + PW / 2}" y="${Y0 + PH + 38}" text-anchor="middle">Tiempo (minutos)</text>`;
  s += `<text class="d-s" transform="rotate(-90 12 ${Y0 + PH / 2})" x="12" y="${Y0 + PH / 2}" text-anchor="middle">Pulso (latidos por minuto)</text>`;
  const pts = MIN.map((t, i) => [px(t), py(BPM[i])]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
  const dots = pts.map((p) => `<circle class="d-fill-acc" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5"/>`).join("");
  return fig("f-11-pu", "Gráfica del pulso de una estudiante: 70 latidos por minuto en reposo, sube a 150 al hacer ejercicio hasta el minuto 4 y baja a 70 hacia el minuto 10", 280, `
    ${s}
    <path class="d-flow-acc" d="${d}"/>${dots}
    ${note(px(4) + 10, py(150) + 4, "150: el pico", 80, "d-a")}
    ${note(px(0) + 10, py(70) + 22, "Reposo: 70", 90, "d-s")}`, W);
}

export default {
  "11-hilo": {
    caption: "Cada sistema del cuerpo tiene un trabajo en el mismo viaje: llevar glucosa y oxígeno a cada célula y sacar el CO₂ y los desechos.",
    svg: fig("f-11-hi", "Esquema: el sistema digestivo aporta glucosa y el respiratorio oxígeno; el circulatorio los reparte a todas las células; el respiratorio saca el dióxido de carbono y el excretor los desechos", 392, `
      ${box(10, 8, 160, 56, "Digestivo", "trae la glucosa")}
      ${box(190, 8, 160, 56, "Respiratorio", "trae el O₂")}
      <path class="d-flow" marker-end="url(#f-11-hi)" d="M90 64V102"/>
      <path class="d-flow" marker-end="url(#f-11-hi)" d="M270 64V102"/>
      ${box(10, 106, 340, 56, "Sistema circulatorio", "la sangre lo reparte a todo el cuerpo", "d-acc")}
      <path class="d-flow-acc" marker-end="url(#f-11-hia)" d="M180 162V198"/>
      ${box(10, 202, 340, 56, "Todas las células", "glucosa + O₂ dan la energía")}
      <path class="d-flow" marker-end="url(#f-11-hi)" d="M90 258V296"/>
      <path class="d-flow" marker-end="url(#f-11-hi)" d="M270 258V296"/>
      ${box(10, 300, 160, 56, "Respiratorio", "saca el CO₂")}
      ${box(190, 300, 160, 56, "Excretor", "saca los desechos")}
      ${note(180, 382, "El nervioso y el endocrino coordinan todo.", 330, "d-s", "middle")}`, W),
  },

  "11-camino-digestivo": {
    caption: "El alimento recorre un tubo largo, el tubo digestivo. En cada tramo ocurre algo distinto.",
    svg: fig("f-11-ca", "Esquema del camino del alimento: boca, esófago, estómago, intestino delgado, intestino grueso y ano, con lo que ocurre en cada uno; hígado, vesícula y páncreas ayudan aparte", 524, `
      ${[
        ["Boca", "Los dientes trituran y la saliva empieza a digerir el almidón.", "d-box"],
        ["Esófago", "Empuja el bolo hacia abajo con ondas de músculo.", "d-box"],
        ["Estómago", "El jugo gástrico digiere las proteínas.", "d-box"],
        ["Intestino delgado", "Termina la digestión y absorbe los nutrientes.", "d-acc"],
        ["Intestino grueso", "Absorbe el agua que sobra.", "d-box"],
        ["Recto y ano", "Eliminan lo que no se digiere (heces).", "d-box"],
      ].map((r, i) => {
        const y = 8 + i * 66;
        return `${box(8, y, 124, 50, r[0], "", r[2])}${note(144, y + 20, r[1], 208, "d-s")}${i < 5 ? `<path class="d-flow${i === 2 ? "-acc" : ""}" marker-end="url(#f-11-ca${i === 2 ? "a" : ""})" d="M70 ${y + 50}V${y + 66}"/>` : ""}`;
      }).join("")}
      ${box(8, 408, 344, 104, "Ayudan sin que el alimento pase por ellos", ["Hígado: fabrica la bilis, que separa las grasas en gotitas.", "Páncreas: jugo pancreático con enzimas para todos los nutrientes."], "d-box-line")}`, W),
  },

  "11-respirar": {
    caption: "El diafragma es un músculo con forma de cúpula bajo los pulmones. Al contraerse baja y entra el aire; al relajarse sube y sale.",
    svg: fig("f-11-re", "Dos dibujos del pecho: al inspirar el diafragma baja y los pulmones se agrandan; al espirar el diafragma sube y los pulmones se achican", 290, `
      ${note(90, 18, "Inspirar", 160, "d-t", "middle")}
      ${note(270, 18, "Espirar", 160, "d-t", "middle")}
      <rect class="d-box-line" x="14" y="30" width="152" height="170" rx="14"/>
      <rect class="d-box-line" x="194" y="30" width="152" height="170" rx="14"/>
      <ellipse class="d-fill-hair" cx="90" cy="108" rx="58" ry="62"/>
      <ellipse class="d-fill-hair" cx="270" cy="100" rx="42" ry="46"/>
      ${note(90, 112, "Pulmones", 80, "d-s", "middle")}${note(270, 104, "Pulmones", 80, "d-s", "middle")}
      <path class="d-flow-acc" d="M22 192Q90 200 158 192"/>
      <path class="d-flow-acc" d="M202 192Q270 142 338 192"/>
      <path class="d-flow-acc" marker-end="url(#f-11-rea)" d="M90 206V224"/>
      <path class="d-flow-acc" marker-end="url(#f-11-rea)" d="M270 224V206"/>
      ${note(90, 244, "El diafragma baja; los pulmones se llenan de aire.", 160, "d-s", "middle")}
      ${note(270, 244, "El diafragma sube; el aire sale con el CO₂.", 160, "d-s", "middle")}`, W),
  },

  "11-circulacion": {
    caption: "Doble circulación: la menor va del corazón a los pulmones y vuelve; la mayor va del corazón al cuerpo y vuelve.",
    svg: fig("f-11-ci", "Esquema de la doble circulación: el cuerpo envía sangre sin oxígeno a la aurícula derecha, el ventrículo derecho la manda a los pulmones, vuelve con oxígeno a la aurícula izquierda y el ventrículo izquierdo la manda a todo el cuerpo", 400, `
      ${box(130, 12, 100, 50, "Pulmones", "", "d-acc")}
      ${box(8, 96, 112, 50, "Ventrículo", "derecho")}
      ${box(8, 206, 112, 50, "Aurícula", "derecha")}
      ${box(240, 96, 112, 50, "Aurícula", "izquierda", "d-acc")}
      ${box(240, 206, 112, 50, "Ventrículo", "izquierdo", "d-acc")}
      ${box(130, 290, 100, 50, "Cuerpo", "", "d-acc")}
      <path class="d-flow" marker-end="url(#f-11-ci)" d="M64 206V146"/>
      <path class="d-flow" marker-end="url(#f-11-ci)" d="M64 96V37H130"/>
      <path class="d-flow-acc" marker-end="url(#f-11-cia)" d="M230 37H296V96"/>
      <path class="d-flow-acc" marker-end="url(#f-11-cia)" d="M296 146V206"/>
      <path class="d-flow-acc" marker-end="url(#f-11-cia)" d="M296 256V315H230"/>
      <path class="d-flow" marker-end="url(#f-11-ci)" d="M130 315H64V256"/>
      ${note(8, 26, "arteria pulmonar", 120, "d-s")}
      ${note(236, 26, "venas pulmonares", 124, "d-s")}
      ${note(8, 350, "venas cavas", 112, "d-s")}
      ${note(240, 350, "aorta", 112, "d-s")}
      ${note(180, 106, "Circulación menor", 100, "d-a", "middle")}
      ${note(180, 232, "Circulación mayor", 100, "d-a", "middle")}
      ${note(180, 178, "Corazón", 90, "d-t", "middle")}
      <rect class="d-acc" x="8" y="372" width="14" height="14" rx="3"/>${note(30, 384, "Sangre con O₂", 120, "d-s")}
      <rect class="d-box" x="190" y="372" width="14" height="14" rx="3"/>${note(212, 384, "Sangre con poco O₂", 140, "d-s")}`, W),
  },

  "11-pulso": {
    caption: "El pulso de una estudiante antes, durante y después de hacer ejercicio. Sube con el esfuerzo y vuelve a su valor de reposo.",
    svg: pulso(),
  },

  "11-excretor": {
    caption: "Los riñones filtran la sangre; lo que sobra baja por los uréteres a la vejiga y sale por la uretra.",
    svg: fig("f-11-ex", "Esquema del sistema urinario: dos riñones, dos uréteres, la vejiga y la uretra", 330, `
      ${note(180, 18, "Riñones: filtran la sangre y forman la orina", 340, "d-t", "middle")}
      <ellipse class="d-acc" cx="110" cy="72" rx="24" ry="36"/>
      <ellipse class="d-acc" cx="250" cy="72" rx="24" ry="36"/>
      <path class="d-flow" d="M118 108Q128 150 170 196M242 108Q232 150 190 196"/>
      <ellipse class="d-box" cx="180" cy="228" rx="38" ry="32"/>
      <path class="d-flow" marker-end="url(#f-11-ex)" d="M180 260V316"/>
      ${note(8, 152, "Uréteres", 80, "d-s")}
      ${note(226, 224, "Vejiga: guarda la orina", 130, "d-s")}
      ${note(196, 296, "Uretra: la orina sale", 150, "d-s")}`, W),
  },

  "11-nefrona": {
    caption: "Una nefrona, en sencillo: filtra mucho y devuelve a la sangre lo que el cuerpo todavía necesita.",
    svg: fig("f-11-ne", "Esquema de una nefrona: la sangre pasa por un filtro, el túbulo devuelve agua, glucosa y sales a la sangre, y lo que sobra sale como orina", 330, `
      ${box(8, 8, 160, 72, "1. Filtro", "pasa agua, sales, glucosa y urea")}
      <path class="d-flow" marker-end="url(#f-11-ne)" d="M88 80V110"/>
      ${box(8, 114, 160, 56, "2. Túbulo", "devuelve lo útil", "d-acc")}
      <path class="d-flow" marker-end="url(#f-11-ne)" d="M88 170V200"/>
      ${box(8, 204, 160, 56, "3. Orina", "agua, urea y sales")}
      <path class="d-flow-acc" marker-end="url(#f-11-nea)" d="M168 142H196"/>
      ${box(200, 100, 152, 84, "Vuelven a la sangre", "agua, glucosa y sales", "d-acc")}
      ${note(182, 24, "Las células de la sangre y las proteínas grandes no pasan.", 170, "d-s")}
      ${note(180, 292, "La orina sale de cada riñón hacia la vejiga.", 330, "d-s", "middle")}`, W),
  },

  "11-neurona": {
    caption: "Una neurona recibe señales por las dendritas, las envía por el axón y las pasa a la siguiente por sus terminales.",
    svg: fig("f-11-nu", "Esquema de una neurona: dendritas a la izquierda, cuerpo celular con núcleo, un axón largo con vainas de mielina y terminales a la derecha", 236, `
      <path class="d-line" d="M8 40L42 70M8 100L42 78M12 70L42 74M10 128L40 86"/>
      <circle class="d-box" cx="62" cy="76" r="24"/>
      <circle class="d-fill-acc" cx="62" cy="76" r="8"/>
      <path class="d-line" d="M86 76H320"/>
      ${[110, 170, 230].map((x) => `<rect class="d-acc" x="${x}" y="68" width="42" height="16" rx="8"/>`).join("")}
      <path class="d-line" d="M320 76L346 52M320 76L348 76M320 76L346 100"/>
      <path class="d-flow-acc" marker-end="url(#f-11-nua)" d="M110 152H260"/>
      ${note(184, 174, "La señal viaja en este sentido", 220, "d-a", "middle")}
      ${note(8, 20, "Dendritas", 100, "d-s")}
      ${note(86, 136, "Cuerpo celular", 100, "d-s", "middle")}
      ${note(186, 52, "Axón con mielina", 140, "d-s", "middle")}
      ${note(300, 124, "Terminales", 100, "d-s", "middle")}
      ${note(180, 204, "Se comunican entre sí sin tocarse, por mensajeros químicos.", 340, "d-s", "middle")}`, W),
  },

  "11-arco-reflejo": {
    caption: "Arco reflejo: la médula decide por sí sola y el músculo responde antes de que el cerebro se entere.",
    svg: fig("f-11-ar", "Esquema del arco reflejo: el receptor de la piel envía la señal por la neurona sensitiva a la médula espinal, la neurona motora la lleva al músculo, y el cerebro se entera después", 350, `
      ${box(8, 10, 140, 56, "Receptor", "piel: siente el calor")}
      ${box(212, 10, 140, 56, "Efector", "músculo: se retira")}
      ${box(70, 150, 220, 56, "Médula espinal", "decide la respuesta", "d-acc")}
      <path class="d-flow-acc" marker-end="url(#f-11-ara)" d="M96 66V150"/>
      <path class="d-flow-acc" marker-end="url(#f-11-ara)" d="M264 150V66"/>
      ${note(4, 104, "Neurona sensitiva", 88, "d-s")}
      ${note(272, 104, "Neurona motora", 88, "d-s")}
      <path class="d-dash" marker-end="url(#f-11-ar)" d="M180 206V262"/>
      ${box(70, 266, 220, 56, "Cerebro", "se entera después: duele", "d-box-line")}`, W),
  },

  "11-insulina": {
    caption: "La insulina mantiene la glucosa de la sangre en su nivel normal.",
    svg: (() => {
      const c = chain("f-11-in", [
        ["Comes y sube la glucosa en la sangre", ""],
        ["El páncreas libera insulina", "una hormona", "d-acc"],
        ["Las células toman glucosa de la sangre", ""],
        ["La glucosa baja a su nivel normal", ""],
      ], { per: 1, ch: 52, gap: 26, W, y0: 8, m: 20 });
      return fig("f-11-in", "Esquema: al comer sube la glucosa, el páncreas libera insulina, las células toman la glucosa y la glucosa baja a su nivel normal", c.h + 56, `${c.svg}
        ${note(180, c.h + 6, "En la diabetes falta insulina o no funciona bien: la glucosa se queda alta en la sangre.", 320, "d-a", "middle")}`, W);
    })(),
  },
};
