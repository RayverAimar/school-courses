// Figures of "Fuerza y movimiento". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../../platform/build/figkit.mjs";

const W = 360;
const arrow = (id, x1, y1, x2, y2, acc = false) =>
  `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x1} ${y1}L${x2} ${y2}"/>`;
const dot = (x, y, cls = "d-fill-acc", r = 6) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
const text = (x, y, s, cls = "d-s", anchor = "middle") => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;

// ── Graph helper: origin at (ox, oy), px per unit on each axis ──
function axes({ ox = 50, oy = 220, tMax, dMax, sx, sy, tStep, dStep, tTitle, dTitle, grid = true }) {
  let out = `<path class="d-line" d="M${ox} ${oy}H${ox + tMax * sx + 8}"/><path class="d-line" d="M${ox} ${oy}V${oy - dMax * sy - 8}"/>`;
  for (let t = 0; t <= tMax; t += tStep) {
    out += text(ox + t * sx, oy + 18, t, "d-n");
    if (t > 0 && grid) out += `<rect class="d-fill-hair" x="${ox + t * sx - 0.5}" y="${oy - dMax * sy}" width="1" height="${dMax * sy}"/>`;
  }
  for (let d = dStep; d <= dMax; d += dStep) {
    out += text(ox - 6, oy - d * sy + 4, d, "d-n", "end");
    if (grid) out += `<rect class="d-fill-hair" x="${ox}" y="${oy - d * sy - 0.5}" width="${tMax * sx}" height="1"/>`;
  }
  out += text(ox + tMax * sx + 8, oy + 34, tTitle, "d-s", "end");
  out += text(ox - 40, 14, dTitle, "d-s", "start");
  return out;
}
const P = (g, t, d) => `${g.ox + t * g.sx} ${g.oy - d * g.sy}`;

// ── 1. Reference ──
const referencia = {
  caption: "Un pasajero está en **reposo respecto al bus** y a la vez **en movimiento respecto a la calle**.",
  svg: fig("f-07-ref", "Pasajero dentro de un bus que avanza: reposo respecto al bus, movimiento respecto a la calle", 210, `
    <rect class="d-box-line" x="30" y="36" width="230" height="64" rx="${R.box}"/>
    ${dot(145, 68, "d-fill-acc", 9)}
    ${text(145, 28, "Bus a 40 km/h", "d-t")}
    ${arrow("f-07-ref", 268, 68, 335, 68, true)}
    <circle class="d-fill-hair" cx="80" cy="112" r="9"/><circle class="d-fill-hair" cx="210" cy="112" r="9"/>
    <path class="d-line" d="M10 124H350"/>
    ${box(6, 144, 170, 54, "Respecto al bus", ["pasajero en reposo"])}
    ${box(184, 144, 170, 54, "Respecto a la calle", ["pasajero se mueve"], "d-acc")}`, W),
};

// ── 2. Distance vs displacement (3-4-5: 300 m east, 400 m north) ──
const distancia = {
  caption: "Caminas 300 m hacia el este y 400 m hacia el norte: **distancia 700 m**, **desplazamiento 500 m**.",
  svg: fig("f-07-dis", "Trayectoria de 300 m al este y 400 m al norte; el desplazamiento en línea recta mide 500 m", 270, `
    <path class="d-flow" marker-end="url(#f-07-dis)" d="M50 240H190V50"/>
    <path class="d-flow-acc" marker-end="url(#f-07-disa)" d="M50 240L188 54"/>
    ${dot(50, 240, "d-fill-hair", 7)}${dot(190, 40, "d-fill-acc", 7)}
    ${text(50, 262, "Casa", "d-t")}
    ${text(198, 30, "Mercado", "d-t", "start")}
    ${text(120, 262, "300 m", "d-n")}
    ${text(184, 150, "400 m", "d-n", "end")}
    ${text(100, 126, "500 m", "d-a", "end")}
    ${note(222, 96, "Trayectoria (el camino): 300 + 400 = 700 m", 128, "d-s")}
    ${note(222, 180, "Desplazamiento: línea recta de la casa al mercado", 128, "d-a")}`, W),
};

// ── 3. Lap around a track ──
const pista = {
  caption: "Una vuelta completa a la pista: **distancia 400 m**, pero **desplazamiento 0 m**, porque terminas donde empezaste.",
  svg: fig("f-07-pis", "Pista ovalada de 400 metros: salida y llegada en el mismo punto", 190, `
    <path class="d-flow-acc" marker-end="url(#f-07-pisa)" d="M110 50H250A45 45 0 0 1 250 140H110A45 45 0 0 1 110 50Z"/>
    ${dot(110, 50, "d-fill-acc", 7)}
    ${text(110, 32, "Salida y llegada", "d-t", "middle")}
    ${text(180, 100, "400 m", "d-n")}
    ${text(180, 172, "Distancia: 400 m · Desplazamiento: 0 m", "d-s")}`, W),
};

// ── 4. The average-speed trap ──
const trampa = {
  caption: "La rapidez media es **distancia total ÷ tiempo total**, no el promedio de las dos rapideces.",
  svg: fig("f-07-tra", "Ida a 30 km/h y vuelta a 60 km/h: la rapidez media es 40 km/h", 300, `
    ${box(6, 8, 168, 78, "Ida", ["60 km a 30 km/h", "tarda 2 h"])}
    ${box(186, 8, 168, 78, "Vuelta", ["60 km a 60 km/h", "tarda 1 h"])}
    ${arrow("f-07-tra", 90, 86, 150, 126)}${arrow("f-07-tra", 270, 86, 210, 126)}
    ${box(60, 130, 240, 62, "Total", ["120 km en 3 h"], "d-box-line")}
    ${arrow("f-07-tra", 180, 192, 180, 220, true)}
    ${box(60, 224, 240, 60, "120 km ÷ 3 h = 40 km/h", "", "d-acc")}`, W),
};

// ── 5. d–t graph, two mobiles: A 10 m/s from 0; B 5 m/s from 20 m; they meet at t = 4 s, d = 40 m ──
const gDos = { ox: 50, oy: 220, sx: 29, sy: 1.8, tMax: 10, dMax: 100 };
const dosMoviles = {
  caption: "Cuanto **más empinada** es la recta, **mayor** es la rapidez. En el punto donde se cruzan, los dos están en el mismo lugar.",
  svg: fig("f-07-dos", "Gráfica distancia-tiempo de dos móviles: A a 10 m/s desde 0 m y B a 5 m/s desde 20 m, que se cruzan a los 4 s", 262, `
    ${axes({ ...gDos, tStep: 2, dStep: 20, tTitle: "tiempo (s)", dTitle: "distancia (m)" })}
    <path class="d-flow-acc" d="M${P(gDos, 0, 0)}L${P(gDos, 10, 100)}"/>
    <path class="d-flow" d="M${P(gDos, 0, 20)}L${P(gDos, 10, 70)}"/>
    ${dot(...P(gDos, 4, 40).split(" ").map(Number), "d-fill-acc", 5)}
    ${text(236, 52, "A: 10 m/s", "d-a", "end")}
    ${text(334, 150, "B: 5 m/s", "d-s", "end")}
    ${text(120, 196, "se cruzan: 4 s, 40 m", "d-s", "start")}`, W),
};

// ── 6. Slope = speed (triangle between t = 2 and 6 on the 10 m/s line) ──
const gPen = { ox: 50, oy: 220, sx: 29, sy: 1.8, tMax: 10, dMax: 100 };
const pendiente = {
  caption: "La **pendiente** (Δd ÷ Δt) de la recta es la **rapidez**: 40 m ÷ 4 s = 10 m/s.",
  svg: fig("f-07-pen", "La pendiente de la recta distancia-tiempo es la rapidez: 40 metros entre 4 segundos son 10 metros por segundo", 262, `
    ${axes({ ...gPen, tStep: 2, dStep: 20, tTitle: "tiempo (s)", dTitle: "distancia (m)" })}
    <path class="d-flow-acc" d="M${P(gPen, 0, 0)}L${P(gPen, 10, 100)}"/>
    <path class="d-flow" d="M${P(gPen, 2, 20)}H${P(gPen, 6, 20).split(" ")[0]}V${P(gPen, 6, 60).split(" ")[1]}"/>
    ${dot(...P(gPen, 2, 20).split(" ").map(Number), "d-fill-acc", 4)}${dot(...P(gPen, 6, 60).split(" ").map(Number), "d-fill-acc", 4)}
    ${text(174, 208, "Δt = 4 s", "d-s", "middle")}
    ${text(234, 148, "Δd = 40 m", "d-s", "start")}
    ${text(58, 62, "v = 40 m ÷ 4 s = 10 m/s", "d-a", "start")}`, W),
};

// ── 7. Cyclist: climbs 2 h at 15 km/h (30 km), stops 1 h, rides 2 h at 20 km/h (to 70 km) ──
const gCic = { ox: 50, oy: 220, sx: 52, sy: 2.4, tMax: 5, dMax: 70 };
const ciclista = {
  caption: "Un tramo **horizontal** significa que la distancia no cambia: el ciclista está **detenido**.",
  svg: fig("f-07-cic", "Gráfica distancia-tiempo de un ciclista: sube 2 horas, descansa 1 hora y sigue 2 horas", 262, `
    ${axes({ ...gCic, tStep: 1, dStep: 10, tTitle: "tiempo (h)", dTitle: "distancia (km)" })}
    <path class="d-flow-acc" d="M${P(gCic, 0, 0)}L${P(gCic, 2, 30)}L${P(gCic, 3, 30)}L${P(gCic, 5, 70)}"/>
    ${text(104, 164, "15 km/h", "d-s", "end")}
    ${text(180, 136, "descanso", "d-s", "middle")}
    ${text(250, 76, "20 km/h", "d-s", "end")}`, W),
};

// ── 8. Weight and mass: Earth vs Moon ──
const pesoMasa = {
  caption: "La **masa** es la misma en todas partes; el **peso** cambia con la gravedad del lugar.",
  svg: fig("f-07-pes", "Una persona de 50 kg pesa 500 N en la Tierra y unos 80 N en la Luna", 250, `
    ${text(90, 20, "En la Tierra", "d-t")}
    ${text(270, 20, "En la Luna", "d-t")}
    <path class="d-dash" d="M180 8V212"/>
    ${box(16, 34, 148, 46, "Masa: 50 kg")}
    ${box(196, 34, 148, 46, "Masa: 50 kg")}
    ${arrow("f-07-pes", 90, 86, 90, 140, true)}
    ${arrow("f-07-pes", 270, 86, 270, 112, true)}
    ${text(100, 118, "g = 10 N/kg", "d-n", "start")}
    ${text(280, 104, "g ≈ 1,6 N/kg", "d-n", "start")}
    ${box(16, 150, 148, 56, "Peso: 500 N", "", "d-acc")}
    ${box(196, 126, 148, 56, "Peso: ≈ 80 N", "", "d-acc")}
    ${note(180, 232, "P = m · g", 160, "d-a", "middle")}`, W),
};

// ── 9. Action and reaction: two different bodies ──
const accionReaccion = {
  caption: "La acción y la reacción actúan sobre **cuerpos distintos**; por eso no se anulan.",
  svg: fig("f-07-acc", "Una persona empuja una pared: la persona empuja la pared y la pared empuja a la persona", 190, `
    ${box(10, 30, 130, 70, "Persona")}
    ${box(220, 30, 130, 70, "Pared")}
    ${arrow("f-07-acc", 140, 52, 218, 52, true)}
    ${arrow("f-07-acc", 220, 80, 142, 80)}
    ${note(180, 124, "Acción: la persona empuja a la pared", 330, "d-a", "middle")}
    ${note(180, 146, "Reacción: la pared empuja a la persona", 330, "d-s", "middle")}
    ${note(180, 172, "Misma fuerza, sentidos opuestos", 330, "d-s", "middle")}`, W),
};

// ── 10. Pressure: same weight, two faces ──
const presion = {
  caption: "El mismo bloque de **100 N** ejerce más presión apoyado en su cara **pequeña**.",
  svg: fig("f-07-pre", "Un bloque de 100 newtons apoyado sobre una cara grande (500 pascales) y sobre una cara pequeña (2000 pascales)", 240, `
    <rect class="d-box" x="30" y="70" width="120" height="48" rx="${R.box}"/>
    <rect class="d-box" x="236" y="38" width="48" height="80" rx="${R.box}"/>
    <path class="d-line" d="M14 118H166"/><path class="d-line" d="M200 118H320"/>
    ${arrow("f-07-pre", 90, 30, 90, 66, true)}${arrow("f-07-pre", 260, 8, 260, 34, true)}
    ${text(90, 20, "100 N", "d-n")}${text(318, 24, "100 N", "d-n", "end")}
    ${text(90, 98, "10 kg", "d-t")}${text(260, 82, "10 kg", "d-t")}
    ${text(90, 140, "A = 0,2 m²", "d-s")}${text(260, 140, "A = 0,05 m²", "d-s")}
    ${box(16, 160, 150, 56, "P = 100 ÷ 0,2", ["= 500 Pa"])}
    ${box(194, 160, 150, 56, "P = 100 ÷ 0,05", ["= 2 000 Pa"], "d-acc")}`, W),
};

// ── 11. Lever: R 600 N at 0.2 m, F at 1.2 m ──
const palanca = {
  caption: "En equilibrio: **F · brazo de la fuerza = R · brazo de la resistencia**. Aquí F = 600 × 0,2 ÷ 1,2 = 100 N.",
  svg: fig("f-07-pal", "Palanca con apoyo, una carga de 600 newtons a 0,2 metros y una fuerza de 100 newtons a 1,2 metros", 250, `
    <path class="d-flow-acc" d="M30 134L330 134" style="stroke-width:6"/>
    <path class="d-fill-hair" d="M80 142L66 178H94Z"/>
    ${text(80, 198, "apoyo", "d-s")}
    ${arrow("f-07-pal", 40, 70, 40, 126)}
    ${arrow("f-07-pal", 320, 70, 320, 126, true)}
    ${text(40, 52, "R = 600 N", "d-t", "start")}
    ${text(320, 52, "F = ?", "d-a", "end")}
    <path class="d-line" d="M40 214H80"/><path class="d-line" d="M80 214H320"/>
    ${text(60, 234, "0,2 m", "d-n")}${text(200, 234, "1,2 m", "d-n")}`, W),
};

// ── 12. Inclined plane: 600 N up 1 m along a 3 m ramp needs 200 N ──
const plano = {
  caption: "Una rampa más **larga** exige **menos fuerza**, pero hay que recorrer **más camino**.",
  svg: fig("f-07-pla", "Rampa de 3 metros que sube 1 metro: subir 600 newtons de peso requiere 200 newtons sin rozamiento", 210, `
    <path class="d-line" d="M30 170H330"/><path class="d-line" d="M330 170V90"/>
    <path class="d-flow-acc" d="M30 170L330 90"/>
    <rect class="d-box" x="130" y="126" width="30" height="24" rx="3" transform="rotate(-15 145 138)"/>
    ${text(337, 134, "1 m", "d-n", "start")}
    ${text(150, 190, "base", "d-s", "end")}
    ${text(110, 118, "rampa: 3 m", "d-n", "end")}
    ${note(180, 30, "Subir 600 N a 1 m de altura", 300, "d-t", "middle")}
    ${note(180, 54, "Sin rampa: 600 N. Con rampa de 3 m: 200 N.", 330, "d-a", "middle")}`, W),
};

// ── 13. Pulleys: fixed (changes direction) and movable (halves the force) ──
const poleas = {
  caption: "La polea **fija** solo cambia la dirección de la fuerza; la **móvil** la reduce a la mitad.",
  svg: fig("f-07-pol", "Polea fija: se jala con 100 N para subir 100 N; polea móvil: se jala con 50 N para subir 100 N", 262, `
    <path class="d-line" d="M20 12H340"/>
    <path class="d-dash" d="M180 24V206"/>
    <path class="d-line" d="M70 12V62"/>
    <circle class="d-box-line" cx="70" cy="80" r="18"/>
    <path class="d-flow" d="M52 80V170"/><path class="d-flow" marker-end="url(#f-07-pol)" d="M88 80V130"/>
    <rect class="d-box" x="28" y="170" width="48" height="26" rx="4"/>
    ${text(52, 188, "100 N", "d-n")}
    ${text(96, 150, "F = 100 N", "d-a", "start")}
    <path class="d-flow" d="M244 12V120"/>
    <path class="d-flow" d="M280 120V40"/><path class="d-flow" marker-end="url(#f-07-pol)" d="M280 40V16"/>
    <circle class="d-box-line" cx="262" cy="120" r="18"/>
    <path class="d-line" d="M262 138V170"/>
    <rect class="d-box" x="236" y="170" width="52" height="26" rx="4"/>
    ${text(262, 188, "100 N", "d-n")}
    ${text(290, 96, "F = 50 N", "d-a", "start")}
    ${text(70, 226, "Polea fija", "d-t")}${text(262, 226, "Polea móvil", "d-t")}
    ${note(180, 252, "La móvil la soportan dos tramos de cuerda", 340, "d-s", "middle")}`, W),
};

// ── Figures for questions (neutral captions) ──
const gQc = { ox: 50, oy: 220, sx: 58, sy: 3, tMax: 4, dMax: 60 };
const qCiclista = {
  caption: "Gráfica distancia–tiempo de una ciclista.",
  svg: fig("f-07-qci", "Gráfica distancia-tiempo de una ciclista: sube de 0 a 20 km en 1 hora, se mantiene en 20 km hasta la hora 2 y sube hasta 60 km en la hora 4", 262, `
    ${axes({ ...gQc, tStep: 1, dStep: 20, tTitle: "tiempo (h)", dTitle: "distancia (km)" })}
    <path class="d-flow-acc" d="M${P(gQc, 0, 0)}L${P(gQc, 1, 20)}L${P(gQc, 2, 20)}L${P(gQc, 4, 60)}"/>`, W),
};
const gQm = { ox: 50, oy: 220, sx: 29, sy: 1.8, tMax: 10, dMax: 100 };
const qMoviles = {
  caption: "Gráfica distancia–tiempo de tres móviles: X, Y y Z.",
  svg: fig("f-07-qmo", "Gráfica distancia-tiempo de tres móviles: X llega a 100 m en 10 s, Y llega a 50 m en 10 s y Z se mantiene en 60 m", 262, `
    ${axes({ ...gQm, tStep: 2, dStep: 20, tTitle: "tiempo (s)", dTitle: "distancia (m)" })}
    <path class="d-flow-acc" d="M${P(gQm, 0, 0)}L${P(gQm, 10, 100)}"/>
    <path class="d-flow" d="M${P(gQm, 0, 0)}L${P(gQm, 10, 50)}"/>
    <path class="d-flow" d="M${P(gQm, 0, 60)}L${P(gQm, 10, 60)}"/>
    ${text(254, 52, "X", "d-a", "end")}
    ${text(300, 168, "Y", "d-t", "end")}
    ${text(300, 100, "Z", "d-t", "end")}`, W),
};

export default {
  "07-referencia": referencia,
  "07-distancia": distancia,
  "07-pista": pista,
  "07-trampa": trampa,
  "07-dos-moviles": dosMoviles,
  "07-pendiente": pendiente,
  "07-ciclista": ciclista,
  "07-peso-masa": pesoMasa,
  "07-accion-reaccion": accionReaccion,
  "07-presion": presion,
  "07-palanca": palanca,
  "07-plano": plano,
  "07-poleas": poleas,
  "07-q-ciclista": qCiclista,
  "07-q-moviles": qMoviles,
};
