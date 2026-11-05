import { box, note, fig } from "../../../platform/build/figkit.mjs";

const W = 360;

// Particles with a short tail that shows how fast each one moves (the same length = the same temperature).
const dots = (list) =>
  list.map(([x, y, dx, dy]) => `<line class="d-flow-acc" x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + dy}"/><circle class="d-fill-acc" cx="${x}" cy="${y}" r="4.5"/>`).join("");

// Experiment: water cooling in four wrapped glasses (the same numbers as the lesson's table).
const MIN = [0, 10, 20, 30, 40];
const SERIES = [
  { name: "Tecnopor", t: [80, 73, 67, 62, 57], acc: true },
  { name: "Lana", t: [80, 69, 61, 54, 48] },
  { name: "Papel periódico", t: [80, 64, 53, 45, 39] },
  { name: "Sin envolver", t: [80, 59, 45, 37, 31] },
];

const X0 = 44, Y0 = 20, PH = 200;
function axes(id, xmax, xstep, ymax, ystep, pw, xlabel, ylabel) {
  const px = (t) => X0 + (t / xmax) * pw;
  const py = (v) => Y0 + PH - (v / ymax) * PH;
  let s = `<path class="d-line" d="M${X0} ${Y0}V${Y0 + PH}H${X0 + pw}"/>`;
  for (let v = 0; v <= ymax; v += ystep) s += `<text class="d-n" x="${X0 - 6}" y="${py(v) + 4}" text-anchor="end">${v}</text><path class="d-line" d="M${X0 - 3} ${py(v)}H${X0}"/>`;
  for (let t = 0; t <= xmax; t += xstep) s += `<text class="d-n" x="${px(t)}" y="${Y0 + PH + 18}" text-anchor="middle">${t}</text><path class="d-line" d="M${px(t)} ${Y0 + PH}V${Y0 + PH + 3}"/>`;
  s += `<text class="d-s" x="${X0 + pw / 2}" y="${Y0 + PH + 38}" text-anchor="middle">${xlabel}</text>`;
  s += `<text class="d-s" transform="rotate(-90 12 ${Y0 + PH / 2})" x="12" y="${Y0 + PH / 2}" text-anchor="middle">${ylabel}</text>`;
  return { s, px, py };
}

function equilibrio() {
  const { s, px, py } = axes("e", 20, 5, 90, 20, 286, "Tiempo (minutos)", "Temperatura (°C)");
  // the axis stops at 80 on purpose: 90 only makes room above
  const curve = (sign) => {
    let d = "";
    for (let t = 0; t <= 20; t += 0.5) d += `${t ? "L" : "M"}${px(t).toFixed(1)} ${py(50 + sign * 30 * Math.exp(-t / 6)).toFixed(1)}`;
    return d;
  };
  return fig("f-06-eq", "Gráfica de temperatura contra tiempo: el agua caliente baja de 80 a casi 50 grados y el agua fría sube de 20 a casi 50 grados; las dos curvas se juntan", 280, `
    ${s}
    <path class="d-dash" d="M${X0} ${py(50)}H${px(20)}"/>
    <path class="d-flow-acc" d="${curve(1)}"/>
    <path class="d-flow" d="${curve(-1)}"/>
    ${note(X0 + 8, py(50) - 5, "Equilibrio: 50 °C", 110, "d-a")}
    ${note(px(9), py(74), "Agua caliente", 100, "d-a")}
    ${note(px(9), py(28), "Agua fría", 100, "d-s")}`, W);
}

function experimento() {
  const { s, px, py } = axes("x", 40, 10, 80, 20, 206, "Tiempo (minutos)", "Temperatura del agua (°C)");
  const lines = SERIES.map((sr) => {
    const pts = sr.t.map((v, i) => [px(MIN[i]), py(v)]);
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
    const dots2 = pts.map((p) => `<circle class="${sr.acc ? "d-fill-acc" : "d-fill-hair"}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3"/>`).join("");
    const last = pts[pts.length - 1];
    return `<path class="${sr.acc ? "d-flow-acc" : "d-flow"}" d="${d}"/>${dots2}<text class="${sr.acc ? "d-a" : "d-s"}" x="${last[0] + 10}" y="${last[1] + 4}">${sr.name}</text>`;
  }).join("");
  return fig("f-06-ex", "Gráfica de cuatro vasos con agua caliente: todos empiezan en 80 grados y el vaso con tecnopor baja menos que los demás", 280, `${s}${lines}`, W);
}

export default {
  "06-calor-temp": {
    caption: "Misma temperatura, distinta cantidad de calor: la olla tiene más partículas moviéndose, así que guarda más energía térmica en total.",
    svg: fig("f-06-ct", "Dos recipientes con agua a 60 grados: un vaso con pocas partículas y una olla con muchas, todas moviéndose igual de rápido", 236, `
      ${note(70, 18, "Un vaso", 120, "d-t", "middle")}
      ${note(255, 18, "Una olla", 150, "d-t", "middle")}
      <rect class="d-box-line" x="20" y="30" width="100" height="90" rx="8"/>
      <rect class="d-box-line" x="140" y="30" width="210" height="90" rx="8"/>
      ${dots([[45, 60, 11, 4], [90, 52, -10, 6], [60, 98, 9, -7], [98, 100, -11, -3]])}
      ${dots([[160, 52, 11, 4], [200, 48, -10, 6], [245, 55, 9, -7], [300, 50, -11, -3], [330, 62, 10, 6], [172, 84, -9, -7], [215, 90, 11, 3], [262, 88, -11, 5], [310, 96, 8, -8], [345, 100, -9, -4], [185, 110, 10, -5], [235, 108, -8, -8], [286, 110, 9, 5]].filter((p) => p[0] < 342))}
      ${note(70, 146, "60 °C", 100, "d-a", "middle")}
      ${note(245, 146, "60 °C", 100, "d-a", "middle")}
      ${note(70, 176, "Poca agua: poca energía térmica en total", 118, "d-s", "middle")}
      ${note(245, 176, "Mucha agua: mucha energía térmica en total", 190, "d-s", "middle")}`, W),
  },

  "06-escalas": {
    caption: "Para pasar de Celsius a Kelvin se suma 273. Para volver, se resta.",
    svg: fig("f-06-es", "Cinco temperaturas en grados Celsius y en kelvin: 100 a 373, 37 a 310, 20 a 293, 0 a 273 y menos 273 a 0", 316, `
      ${note(85, 18, "Celsius", 120, "d-t", "middle")}
      ${note(280, 18, "Kelvin", 120, "d-t", "middle")}
      ${[["100 °C", "el agua hierve", "373 K"], ["37 °C", "cuerpo humano", "310 K"], ["20 °C", "un día templado", "293 K"], ["0 °C", "el agua se congela", "273 K"], ["−273 °C", "cero absoluto", "0 K"]]
        .map((r, i) => {
          const y = 30 + i * 56;
          return `${box(10, y, 150, 46, r[0], r[1])}
            <path class="d-flow-acc" marker-end="url(#f-06-esa)" d="M166 ${y + 23}H204"/>
            ${note(185, y + 15, "+ 273", 60, "d-n", "middle")}
            ${box(210, y, 140, 46, r[2], "", "d-acc")}`;
        }).join("")}`, W),
  },

  "06-equilibrio": {
    caption: "Dos cantidades iguales de agua, una a 80 °C y otra a 20 °C: la caliente se enfría y la fría se calienta hasta que las dos llegan a unos 50 °C.",
    svg: equilibrio(),
  },

  "06-transmision": {
    caption: "Las tres formas de transmitir calor: por contacto, por corrientes y por ondas.",
    svg: fig("f-06-tr", "Tres dibujos: una barra que se calienta de un extremo a otro, una olla con corrientes de agua que suben y bajan, y el Sol enviando calor a un objeto", 330, `
      ${note(10, 20, "Conducción", 160, "d-t")}
      <rect class="d-acc" x="10" y="36" width="44" height="18" rx="3"/>
      <rect class="d-box" x="54" y="36" width="130" height="18" rx="3"/>
      <path class="d-flow-acc" marker-end="url(#f-06-tra)" d="M24 72H170"/>
      ${note(200, 48, "Por contacto, de partícula a partícula. Pasa en los sólidos: la cuchara en la sopa.", 150)}
      <path class="d-dash" d="M10 108H350"/>
      ${note(10, 128, "Convección", 160, "d-t")}
      <rect class="d-box-line" x="30" y="140" width="130" height="62" rx="8"/>
      <path class="d-flow-acc" marker-end="url(#f-06-tra)" d="M95 196V158"/>
      <path class="d-flow" marker-end="url(#f-06-tr)" d="M95 158Q95 148 120 148Q148 148 148 164V190"/>
      <path class="d-flow" marker-end="url(#f-06-tr)" d="M95 158Q95 148 70 148Q42 148 42 164V190"/>
      ${note(200, 156, "Por corrientes: el líquido o el aire caliente sube y el frío baja.", 150)}
      <path class="d-dash" d="M10 218H350"/>
      ${note(10, 238, "Radiación", 160, "d-t")}
      <circle class="d-fill-acc" cx="34" cy="282" r="16"/>
      <path class="d-flow-acc" marker-end="url(#f-06-tra)" d="M58 268H128"/>
      <path class="d-flow-acc" marker-end="url(#f-06-tra)" d="M62 282H128"/>
      <path class="d-flow-acc" marker-end="url(#f-06-tra)" d="M58 296H128"/>
      <rect class="d-box" x="134" y="258" width="26" height="48" rx="4"/>
      ${note(200, 266, "Por ondas, sin necesitar materia: el calor del Sol cruza el vacío.", 150)}`, W),
  },

  "06-dilatacion": {
    caption: "Un riel o una barra se alarga cuando se calienta (aquí exagerado). Por eso se deja un espacio entre tramos.",
    svg: fig("f-06-di", "Dos barras iguales fijas a una pared: la que está a 80 grados es un poco más larga que la que está a 20 grados", 210, `
      ${note(34, 20, "Frío: 20 °C", 150, "d-t")}
      <rect class="d-fill-hair" x="14" y="28" width="10" height="44" rx="2"/>
      <rect class="d-box" x="24" y="38" width="200" height="22" rx="3"/>
      ${note(34, 106, "Caliente: 80 °C", 150, "d-t")}
      <rect class="d-fill-hair" x="14" y="114" width="10" height="44" rx="2"/>
      <rect class="d-acc" x="24" y="124" width="222" height="22" rx="3"/>
      <path class="d-dash" d="M224 66V170"/>
      <path class="d-flow-acc" marker-end="url(#f-06-dia)" d="M224 170H246"/>
      ${note(235, 196, "se alargó", 120, "d-a", "middle")}`, W),
  },

  "06-experimento": {
    caption: "Temperatura del agua en cuatro vasos iguales, cada uno con un material distinto. Mientras más lenta la bajada, mejor aísla el material.",
    svg: experimento(),
  },
};
