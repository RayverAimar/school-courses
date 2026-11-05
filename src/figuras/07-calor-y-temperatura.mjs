// Figures of "Calor y temperatura". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../platform/build/figkit.mjs";

const W = 360;

// Particles with a short tail that shows how fast each one moves (the same length = the same temperature).
const dots = (list) =>
  list.map(([x, y, dx, dy]) => `<line class="d-flow-acc" x1="${x}" y1="${y}" x2="${x + dx}" y2="${y + dy}"/><circle class="d-fill-acc" cx="${x}" cy="${y}" r="4.5"/>`).join("");

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
  const curve = (sign) => {
    let d = "";
    for (let t = 0; t <= 20; t += 0.5) d += `${t ? "L" : "M"}${px(t).toFixed(1)} ${py(50 + sign * 30 * Math.exp(-t / 6)).toFixed(1)}`;
    return d;
  };
  return fig("f-07-eq", "Gráfica de temperatura contra tiempo: el agua caliente baja de 80 a casi 50 grados y el agua fría sube de 20 a casi 50 grados; las dos curvas se juntan", 280, `
    ${s}
    <path class="d-dash" d="M${X0} ${py(50)}H${px(20)}"/>
    <path class="d-flow-acc" d="${curve(1)}"/>
    <path class="d-flow" d="${curve(-1)}"/>
    ${note(X0 + 6, py(50) - 6, "Equilibrio", 80, "d-a")}
    ${note(X0 + 6, py(50) + 16, "50 °C", 60, "d-a")}
    ${note(px(9), py(74), "Agua caliente", 100, "d-a")}
    ${note(px(9), py(28), "Agua fría", 100, "d-s")}`, W);
}

// c of four materials, 200 px = 1 cal/g·°C.
function especifico() {
  const rows = [["Agua", 1, "1,00", "d-fill-1"], ["Aluminio", 0.22, "0,22", "d-obj"], ["Hierro", 0.11, "0,11", "d-obj"], ["Cobre", 0.09, "0,09", "d-fill-2"]];
  const bars = rows.map(([n, v, txt, cls], i) => {
    const y = 40 + i * 44;
    return `${note(8, y + 20, n, 80, "d-s")}<rect class="${cls}" x="90" y="${y}" width="${Math.round(v * 200)}" height="28" rx="4"/>${note(90 + Math.round(v * 200) + 8, y + 20, txt, 60, "d-n")}`;
  }).join("");
  return fig("f-07-ce", "Barras con el calor específico de cuatro materiales: el agua con 1,00 y los metales con mucho menos, entre 0,09 y 0,22", 224, `
    ${note(8, 20, "Calor específico c (cal/g·°C)", 340, "d-t")}
    <path class="d-line" d="M90 30V212"/>
    ${bars}`, W);
}

export default {
  "07-calor-temp": {
    caption: "Misma temperatura, distinta energía térmica: la olla tiene más partículas moviéndose, así que guarda más energía térmica en total.",
    svg: fig("f-07-ct", "Dos recipientes con agua a 60 grados: un vaso con pocas partículas y una olla con muchas, todas moviéndose igual de rápido", 236, `
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

  "07-q-agua": {
    caption: "Calentar 200 g de agua de 20 °C a 70 °C: la temperatura sube 50 °C y el agua recibe **10 000 cal**.",
    svg: fig("f-07-qa", "Un vaso con 200 gramos de agua a 20 grados, una flecha de calor, y el mismo vaso a 70 grados", 214, `
      <rect class="d-water" x="30" y="50" width="80" height="80"/>
      <path class="d-stroke-1" d="M30 30V130H110V30"/>
      ${note(70, 22, "200 g de agua", 120, "d-t", "middle")}
      ${note(70, 90, "20 °C", 70, "d-a", "middle")}
      <path class="d-flow-acc" marker-end="url(#f-07-qaa)" d="M130 90H230"/>
      ${note(180, 78, "Q = 10 000 cal", 110, "d-a", "middle")}
      <rect class="d-water" x="250" y="50" width="80" height="80"/>
      <path class="d-stroke-1" d="M250 30V130H330V30"/>
      ${note(290, 22, "200 g de agua", 120, "d-t", "middle")}
      ${note(290, 90, "70 °C", 70, "d-a", "middle")}
      ${box(80, 154, 200, 44, "ΔT = 70 − 20 = 50 °C", "", "d-acc")}`, W),
  },

  "07-calor-especifico": {
    caption: "El agua necesita **mucho más calor** que un metal para subir 1 °C cada gramo: por eso se calienta y se enfría despacio.",
    svg: especifico(),
  },

  "07-equilibrio": {
    caption: "Dos cantidades iguales de agua, una a 80 °C y otra a 20 °C: la caliente se enfría y la fría se calienta hasta que las dos llegan a unos 50 °C.",
    svg: equilibrio(),
  },

  "07-transmision": {
    caption: "Las tres formas de transmitir calor: por contacto, por corrientes y por ondas.",
    svg: fig("f-07-tr", "Tres dibujos: una barra que se calienta de un extremo a otro, una olla con corrientes de agua que suben y bajan, y el Sol enviando calor a un objeto", 330, `
      ${note(10, 20, "Conducción", 160, "d-t")}
      <rect class="d-fill-5" x="10" y="36" width="44" height="18" rx="3"/>
      <rect class="d-obj" x="54" y="36" width="130" height="18" rx="3"/>
      <path class="d-flow-acc" marker-end="url(#f-07-tra)" d="M24 72H170"/>
      ${note(200, 48, "Por contacto, de partícula a partícula. Pasa en los sólidos: la cuchara en la sopa.", 150)}
      <path class="d-dash" d="M10 108H350"/>
      ${note(10, 128, "Convección", 160, "d-t")}
      <rect class="d-water" x="30" y="140" width="130" height="62" rx="8"/>
      <path class="d-flow-acc" marker-end="url(#f-07-tra)" d="M95 196V158"/>
      <path class="d-flow" marker-end="url(#f-07-tr)" d="M95 158Q95 148 120 148Q148 148 148 164V190"/>
      <path class="d-flow" marker-end="url(#f-07-tr)" d="M95 158Q95 148 70 148Q42 148 42 164V190"/>
      ${note(200, 156, "Por corrientes: el líquido o el aire caliente sube y el frío baja.", 150)}
      <path class="d-dash" d="M10 218H350"/>
      ${note(10, 238, "Radiación", 160, "d-t")}
      <circle class="d-fill-6" cx="34" cy="282" r="16"/>
      <path class="d-flow-acc" marker-end="url(#f-07-tra)" d="M58 268H128"/>
      <path class="d-flow-acc" marker-end="url(#f-07-tra)" d="M62 282H128"/>
      <path class="d-flow-acc" marker-end="url(#f-07-tra)" d="M58 296H128"/>
      <rect class="d-obj" x="134" y="258" width="26" height="48" rx="4"/>
      ${note(200, 266, "Por ondas, sin necesitar materia: el calor del Sol cruza el vacío.", 150)}`, W),
  },

  "07-dilatacion": {
    caption: "Una barra se alarga cuando se calienta (aquí exagerado): por eso se deja un espacio entre tramos de riel o de puente.",
    svg: fig("f-07-di", "Dos barras iguales fijas a una pared: la que está a 80 grados es un poco más larga que la que está a 20 grados", 210, `
      ${note(34, 20, "Frío: 20 °C", 150, "d-t")}
      <rect class="d-obj" x="10" y="28" width="14" height="44" rx="2"/>
      <rect class="d-fill-1" x="24" y="38" width="200" height="22" rx="3"/>
      ${note(34, 106, "Caliente: 80 °C", 150, "d-t")}
      <rect class="d-obj" x="10" y="114" width="14" height="44" rx="2"/>
      <rect class="d-fill-5" x="24" y="124" width="222" height="22" rx="3"/>
      <path class="d-dash" d="M224 66V170"/>
      <path class="d-flow-acc" marker-end="url(#f-07-dia)" d="M224 170H246"/>
      ${note(235, 196, "se alargó", 120, "d-a", "middle")}`, W),
  },

  "07-termometro": {
    caption: "Al calentarse, el líquido del bulbo se dilata y **sube** por el tubo; al enfriarse, baja.",
    svg: fig("f-07-te", "Dos termómetros: a 20 grados el líquido llega a media altura del tubo y a 40 grados llega mucho más arriba", 250, `
      ${[[70, 20, 128, "Frío"], [250, 40, 60, "Caliente"]].map(([x, t, top, n]) => `
      <rect class="d-obj" x="${x - 7}" y="30" width="14" height="150" rx="7"/>
      <rect class="d-fill-5" x="${x - 4}" y="${top}" width="8" height="${190 - top}" rx="3"/>
      <circle class="d-fill-5" cx="${x}" cy="192" r="15"/>
      ${note(x + 24, top + 4, t + " °C", 70, "d-a")}
      ${note(x, 232, n, 100, "d-t", "middle")}`).join("")}
      <path class="d-flow-acc" marker-end="url(#f-07-tea)" d="M150 120H190"/>
      ${note(170, 106, "más calor", 80, "d-s", "middle")}`, W),
  },
};
