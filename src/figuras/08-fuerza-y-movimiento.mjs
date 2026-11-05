// Figures of "Fuerza y movimiento". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../platform/build/figkit.mjs";

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

// ── 2. Distance vs displacement (3-4-5: 300 m east, 400 m north) ──
const distancia = {
  caption: "Caminas 300 m hacia el este y 400 m hacia el norte: **distancia 700 m**, **desplazamiento 500 m**.",
  svg: fig("f-08-dis", "Trayectoria de 300 m al este y 400 m al norte; el desplazamiento en línea recta mide 500 m", 270, `
    <path class="d-flow" marker-end="url(#f-08-dis)" d="M50 240H190V50"/>
    <path class="d-flow-acc" marker-end="url(#f-08-disa)" d="M50 240L188 54"/>
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
  svg: fig("f-08-pis", "Pista ovalada de 400 metros: salida y llegada en el mismo punto", 190, `
    <path class="d-flow-acc" marker-end="url(#f-08-pisa)" d="M110 50H250A45 45 0 0 1 250 140H110A45 45 0 0 1 110 50Z"/>
    ${dot(110, 50, "d-fill-acc", 7)}
    ${text(110, 32, "Salida y llegada", "d-t", "middle")}
    ${text(180, 100, "400 m", "d-n")}
    ${text(180, 172, "Distancia: 400 m · Desplazamiento: 0 m", "d-s")}`, W),
};

// ── 4. The average-speed trap ──
const trampa = {
  caption: "La rapidez media es **distancia total ÷ tiempo total**, no el promedio de las dos rapideces.",
  svg: fig("f-08-tra", "Ida a 30 km/h y vuelta a 60 km/h: la rapidez media es 40 km/h", 300, `
    ${box(6, 8, 168, 78, "Ida", ["60 km a 30 km/h", "tarda 2 h"])}
    ${box(186, 8, 168, 78, "Vuelta", ["60 km a 60 km/h", "tarda 1 h"])}
    ${arrow("f-08-tra", 90, 86, 150, 126)}${arrow("f-08-tra", 270, 86, 210, 126)}
    ${box(60, 130, 240, 62, "Total", ["120 km en 3 h"], "d-box-line")}
    ${arrow("f-08-tra", 180, 192, 180, 220, true)}
    ${box(60, 224, 240, 60, "120 km ÷ 3 h = 40 km/h", "", "d-acc")}`, W),
};

// ── 5. d–t graph, two mobiles: A 10 m/s from 0; B 5 m/s from 20 m; they meet at t = 4 s, d = 40 m ──
const gDos = { ox: 50, oy: 220, sx: 29, sy: 1.8, tMax: 10, dMax: 100 };
const dosMoviles = {
  caption: "Cuanto **más empinada** es la recta, **mayor** es la rapidez. En el punto donde se cruzan, los dos están en el mismo lugar.",
  svg: fig("f-08-dos", "Gráfica distancia-tiempo de dos móviles: A a 10 m/s desde 0 m y B a 5 m/s desde 20 m, que se cruzan a los 4 s", 262, `
    ${axes({ ...gDos, tStep: 2, dStep: 20, tTitle: "tiempo (s)", dTitle: "distancia (m)" })}
    <path class="d-flow-acc" d="M${P(gDos, 0, 0)}L${P(gDos, 10, 100)}"/>
    <path class="d-flow" d="M${P(gDos, 0, 20)}L${P(gDos, 10, 70)}"/>
    ${dot(...P(gDos, 4, 40).split(" ").map(Number), "d-fill-acc", 5)}
    ${text(216, 104, "A: 10 m/s", "d-a", "end")}
    ${text(330, 134, "B: 5 m/s", "d-s", "end")}
    ${text(176, 172, "se cruzan: 4 s, 40 m", "d-s", "start")}`, W),
};

// ── 6. Slope = speed (triangle between t = 2 and 6 on the 10 m/s line) ──
const gPen = { ox: 50, oy: 220, sx: 29, sy: 1.8, tMax: 10, dMax: 100 };
const pendiente = {
  caption: "La **pendiente** (Δd ÷ Δt) de la recta es la **rapidez**: 40 m ÷ 4 s = 10 m/s.",
  svg: fig("f-08-pen", "La pendiente de la recta distancia-tiempo es la rapidez: 40 metros entre 4 segundos son 10 metros por segundo", 262, `
    ${axes({ ...gPen, tStep: 2, dStep: 20, tTitle: "tiempo (s)", dTitle: "distancia (m)" })}
    <path class="d-flow-acc" d="M${P(gPen, 0, 0)}L${P(gPen, 10, 100)}"/>
    <path class="d-flow" d="M${P(gPen, 2, 20)}H${P(gPen, 6, 20).split(" ")[0]}V${P(gPen, 6, 60).split(" ")[1]}"/>
    ${dot(...P(gPen, 2, 20).split(" ").map(Number), "d-fill-acc", 4)}${dot(...P(gPen, 6, 60).split(" ").map(Number), "d-fill-acc", 4)}
    ${text(195, 208, "Δt = 4 s", "d-s", "middle")}
    ${text(234, 166, "Δd = 40 m", "d-s", "start")}
    ${text(58, 62, "v = 40 m ÷ 4 s = 10 m/s", "d-a", "start")}`, W),
};

// ── 7. Cyclist: climbs 2 h at 15 km/h (30 km), stops 1 h, rides 2 h at 20 km/h (to 70 km) ──
const gCic = { ox: 50, oy: 220, sx: 52, sy: 2.4, tMax: 5, dMax: 70 };
const ciclista = {
  caption: "Un tramo **horizontal** significa que la distancia no cambia: el ciclista está **detenido**.",
  svg: fig("f-08-cic", "Gráfica distancia-tiempo de un ciclista: sube 2 horas, descansa 1 hora y sigue 2 horas", 262, `
    ${axes({ ...gCic, tStep: 1, dStep: 10, tTitle: "tiempo (h)", dTitle: "distancia (km)" })}
    <path class="d-flow-acc" d="M${P(gCic, 0, 0)}L${P(gCic, 2, 30)}L${P(gCic, 3, 30)}L${P(gCic, 5, 70)}"/>
    ${text(128, 190, "15 km/h", "d-s", "start")}
    ${text(180, 136, "descanso", "d-s", "middle")}
    ${text(250, 70, "20 km/h", "d-s", "end")}`, W),
};

// ── 8. Weight and mass: Earth vs Moon ──
const pesoMasa = {
  caption: "La **masa** es la misma en todas partes; el **peso** cambia con la gravedad del lugar.",
  svg: fig("f-08-pes", "Una persona de 50 kg pesa 500 N en la Tierra y unos 80 N en la Luna", 250, `
    ${text(90, 20, "En la Tierra", "d-t")}
    ${text(270, 20, "En la Luna", "d-t")}
    <path class="d-dash" d="M180 8V212"/>
    ${box(16, 34, 148, 46, "Masa: 50 kg")}
    ${box(196, 34, 148, 46, "Masa: 50 kg")}
    ${arrow("f-08-pes", 90, 86, 90, 140, true)}
    ${arrow("f-08-pes", 270, 86, 270, 112, true)}
    ${text(100, 118, "g = 10 N/kg", "d-n", "start")}
    ${text(280, 104, "g ≈ 1,6 N/kg", "d-n", "start")}
    ${box(16, 150, 148, 56, "Peso: 500 N", "", "d-acc")}
    ${box(196, 126, 148, 56, "Peso: ≈ 80 N", "", "d-acc")}
    ${note(180, 232, "P = m · g", 160, "d-a", "middle")}`, W),
};


// ── Unit conversion km/h <-> m/s ──
const conversion = {
  caption: "De **km/h** a **m/s** se **divide** entre 3,6; de **m/s** a **km/h** se **multiplica** por 3,6.",
  svg: fig("f-08-con", "Conversión entre kilómetros por hora y metros por segundo: dividir entre 3,6 o multiplicar por 3,6", 190, `
    ${box(10, 20, 120, 56, "km/h", ["72"])}
    ${box(230, 20, 120, 56, "m/s", ["20"], "d-acc")}
    ${arrow("f-08-con", 134, 38, 226, 38, true)}
    ${arrow("f-08-con", 226, 60, 134, 60)}
    ${text(180, 30, "÷ 3,6", "d-a")}
    ${text(180, 80, "× 3,6", "d-s")}
    ${note(180, 118, "1 km = 1 000 m y 1 h = 3 600 s", 330, "d-s", "middle")}
    ${note(180, 142, "1 000 m ÷ 3 600 s = 1 m ÷ 3,6 s", 330, "d-s", "middle")}
    ${note(180, 172, "72 km/h = 72 ÷ 3,6 = 20 m/s", 330, "d-a", "middle")}`, W),
};

// ── Forces on a cyclist at constant speed ──
const fuerzasCiclista = {
  caption: "Un ciclista a **rapidez constante**: el empuje del piso y el aire se **equilibran**. El peso actúa **a distancia**.",
  svg: fig("f-08-fue", "Ciclista visto de lado con tres fuerzas: el empuje del piso hacia adelante, el aire hacia atrás y el peso hacia abajo", 262, `
    <circle class="d-obj" cx="130" cy="146" r="26"/><circle class="d-obj" cx="230" cy="146" r="26"/>
    <path class="d-stroke-1" style="fill:none;stroke-width:4" d="M130 146L165 146L190 96L222 96M165 146L152 100L190 96M230 146L215 100"/>
    ${dot(168, 70, "d-fill-2", 11)}
    <path class="d-stroke-2" style="fill:none;stroke-width:5" d="M168 82L182 100"/>
    <path class="d-line" d="M20 172H340"/>
    ${arrow("f-08-fue", 254, 60, 336, 60, true)}
    ${arrow("f-08-fue", 106, 60, 24, 60)}
    ${arrow("f-08-fue", 180, 118, 180, 186)}
    ${text(296, 46, "Empuje del piso", "d-a")}
    ${text(64, 46, "Aire", "d-s")}
    ${text(192, 200, "Peso", "d-s", "start")}
    ${note(180, 232, "Contacto: el piso y el aire", 340, "d-s", "middle")}
    ${note(180, 252, "A distancia: el peso", 340, "d-s", "middle")}`, W),
};

// ── Figures for questions (neutral captions) ──
const gQc = { ox: 50, oy: 220, sx: 58, sy: 3, tMax: 4, dMax: 60 };
const qCiclista = {
  caption: "Gráfica distancia–tiempo de una ciclista.",
  svg: fig("f-08-qci", "Gráfica distancia-tiempo de una ciclista: sube de 0 a 20 km en 1 hora, se mantiene en 20 km hasta la hora 2 y sube hasta 60 km en la hora 4", 262, `
    ${axes({ ...gQc, tStep: 1, dStep: 20, tTitle: "tiempo (h)", dTitle: "distancia (km)" })}
    <path class="d-flow-acc" d="M${P(gQc, 0, 0)}L${P(gQc, 1, 20)}L${P(gQc, 2, 20)}L${P(gQc, 4, 60)}"/>`, W),
};
const gQm = { ox: 50, oy: 220, sx: 29, sy: 1.8, tMax: 10, dMax: 100 };
const qMoviles = {
  caption: "Gráfica distancia–tiempo de tres móviles: X, Y y Z.",
  svg: fig("f-08-qmo", "Gráfica distancia-tiempo de tres móviles: X llega a 100 m en 10 s, Y llega a 50 m en 10 s y Z se mantiene en 60 m", 262, `
    ${axes({ ...gQm, tStep: 2, dStep: 20, tTitle: "tiempo (s)", dTitle: "distancia (m)" })}
    <path class="d-flow-acc" d="M${P(gQm, 0, 0)}L${P(gQm, 10, 100)}"/>
    <path class="d-flow" d="M${P(gQm, 0, 0)}L${P(gQm, 10, 50)}"/>
    <path class="d-flow" d="M${P(gQm, 0, 60)}L${P(gQm, 10, 60)}"/>
    ${text(272, 66, "X", "d-a", "end")}
    ${text(300, 168, "Y", "d-t", "end")}
    ${text(300, 100, "Z", "d-t", "end")}`, W),
};


const gQt = { ox: 50, oy: 220, sx: 52, sy: 1.9, tMax: 5, dMax: 100 };
const qTramos = {
  caption: "Gráfica distancia–tiempo del viaje de un bus.",
  svg: fig("f-08-qtr", "Gráfica distancia-tiempo de un bus: llega a 40 km en 2 horas, se queda en 40 km hasta la hora 3 y llega a 100 km en la hora 5", 262, `
    ${axes({ ...gQt, tStep: 1, dStep: 20, tTitle: "tiempo (h)", dTitle: "distancia (km)" })}
    <path class="d-flow-acc" d="M${P(gQt, 0, 0)}L${P(gQt, 2, 40)}L${P(gQt, 3, 40)}L${P(gQt, 5, 100)}"/>`, W),
};

export default {
  "08-distancia": distancia,
  "08-pista": pista,
  "08-trampa": trampa,
  "08-conversion": conversion,
  "08-dos-moviles": dosMoviles,
  "08-pendiente": pendiente,
  "08-ciclista": ciclista,
  "08-fuerzas-ciclista": fuerzasCiclista,
  "08-peso-masa": pesoMasa,
  "08-q-ciclista": qCiclista,
  "08-q-moviles": qMoviles,
  "08-q-tramos": qTramos,
};
