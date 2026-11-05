// Figures of "La Tierra, el clima y el universo". Drawn 360 wide so their text reads on a phone.
import { box, note, fig } from "../../platform/build/figkit.mjs";

const W = 360;

// Carbon dioxide in the air (ppm, Mauna Loa, rounded).
const CO2 = [[1960, 317], [1980, 339], [2000, 369], [2020, 414]];
function co2() {
  const X0 = 50, Y0 = 20, PW = 280, PH = 200;
  const px = (y) => X0 + ((y - 1960) / 60) * PW;
  const py = (v) => Y0 + PH - ((v - 280) / 140) * PH;
  let s = `<path class="d-line" d="M${X0} ${Y0}V${Y0 + PH}H${X0 + PW + 6}"/>`;
  for (let v = 280; v <= 420; v += 20) s += `<text class="d-n" x="${X0 - 6}" y="${py(v) + 4}" text-anchor="end">${v}</text><path class="d-line" d="M${X0 - 3} ${py(v)}H${X0}"/>`;
  for (let y = 1960; y <= 2020; y += 20) s += `<text class="d-n" x="${px(y)}" y="${Y0 + PH + 18}" text-anchor="middle">${y}</text><path class="d-line" d="M${px(y)} ${Y0 + PH}V${Y0 + PH + 3}"/>`;
  s += `<text class="d-s" x="${X0 + PW / 2}" y="${Y0 + PH + 38}" text-anchor="middle">Año</text>`;
  s += `<text class="d-s" transform="rotate(-90 12 ${Y0 + PH / 2})" x="12" y="${Y0 + PH / 2}" text-anchor="middle">CO₂ en el aire (ppm)</text>`;
  const pts = CO2.map(([y, v]) => [px(y), py(v)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
  const dots = pts.map((p) => `<circle class="d-fill-acc" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4"/>`).join("");
  const labels = CO2.map(([, v], i) => `<text class="d-a" x="${(pts[i][0] + (i === 3 ? -10 : 10)).toFixed(1)}" y="${(pts[i][1] + (i === 3 ? -6 : 20)).toFixed(1)}" text-anchor="${i === 3 ? "end" : "start"}">${v}</text>`).join("");
  return fig("f-15-co2", "Gráfica del dióxido de carbono en el aire: sube de 317 ppm en 1960 a 339 en 1980, 369 en el 2000 y 414 en el 2020", 270, `${s}<path class="d-flow-acc" d="${line}"/>${dots}${labels}`, W);
}

// Two panels: the Sun's light comes in; the heat leaves, or part of it is sent back by the gases.
// layer: 0 no gases, 1 a few, 2 many.
function invernadero(id, label, panels) {
  const panel = (x, [title, layer, temp]) => {
    const gh = layer === 2 ? 44 : 24;
    const ga = (px) => `<path class="d-flow" marker-end="url(#${id})" d="M${x + px} ${84 + gh + 2}V200"/>`;
    return `
    ${note(x + 80, 18, title, 150, "d-t", "middle")}
    ${layer ? `<rect class="d-acc" x="${x}" y="84" width="160" height="${gh}" rx="4"/>${note(x + 154, 101, layer === 2 ? "más gases" : "gases", 70, "d-s", "end")}` : ""}
    <rect class="d-box" x="${x}" y="208" width="160" height="34" rx="4"/>
    <path class="d-flow-acc" marker-end="url(#${id}a)" d="M${x + 20} 40V204"/>
    ${layer ? `<path class="d-flow" marker-end="url(#${id})" d="M${x + 50} 204V50"/>${ga(70)}${ga(90)}${layer === 2 ? ga(110) : ""}` : `<path class="d-flow" marker-end="url(#${id})" d="M${x + 60} 204V30"/><path class="d-flow" marker-end="url(#${id})" d="M${x + 110} 204V30"/>`}
    ${note(x + 80, 230, temp, 150, "d-a", "middle")}`;
  };
  return fig(id, label, 262, panel(10, panels[0]) + panel(190, panels[1]), W);
}

// Seasons: the Earth four times on its orbit, the axis always tilted the same way.
function estaciones() {
  const cx = 180, cy = 132, r = 82;
  const earth = (x, y) => `<circle class="d-fill-1" cx="${x}" cy="${y}" r="14"/><path class="d-flow-acc" d="M${x - 9} ${y + 20}L${x + 9} ${y - 20}"/>`;
  return fig("f-15-es", "La Tierra en cuatro puntos de su órbita alrededor del Sol, con su eje siempre inclinado hacia el mismo lado: junio, septiembre, diciembre y marzo", 290, `
    <circle class="d-dash" cx="${cx}" cy="${cy}" r="${r}"/>
    <circle class="d-fill-6" cx="${cx}" cy="${cy}" r="14"/>
    ${note(cx, cy + 32, "Sol", 40, "d-s", "middle")}
    ${earth(cx - r, cy)}${earth(cx, cy + r)}${earth(cx + r, cy)}${earth(cx, cy - r)}
    ${note(6, cy + 42, "Junio", 100, "d-t")}
    ${note(6, cy + 58, "Invierno en el sur", 112)}
    ${note(354, cy + 42, "Diciembre", 100, "d-t", "end")}
    ${note(354, cy + 58, "Verano en el sur", 112, "d-s", "end")}
    ${note(cx, 280, "Septiembre: equinoccio", 200, "d-t", "middle")}
    ${note(cx + 26, 24, "Marzo: equinoccio", 150, "d-t")}`, W);
}

// Geocentric vs heliocentric model.
function modelos() {
  const panel = (x, geo) => {
    const c = x + 85, cy = 100;
    const centre = geo ? `<circle class="d-fill-1" cx="${c}" cy="${cy}" r="9"/>` : `<circle class="d-fill-6" cx="${c}" cy="${cy}" r="12"/>`;
    const o1 = `<circle class="d-dash" cx="${c}" cy="${cy}" r="34"/>`;
    const o2 = `<circle class="d-dash" cx="${c}" cy="${cy}" r="62"/>`;
    const a = geo ? `<circle class="d-fill-6" cx="${c + 34}" cy="${cy}" r="8"/><circle class="d-obj" cx="${c - 44}" cy="${cy - 44}" r="5"/>` : `<circle class="d-fill-1" cx="${c + 34}" cy="${cy}" r="8"/><circle class="d-obj" cx="${c - 44}" cy="${cy - 44}" r="5"/>`;
    const lab = geo
      ? `${note(c + 34, cy - 14, "Sol", 40, "d-s", "middle")}${note(c, cy + 26, "Tierra", 50, "d-s", "middle")}`
      : `${note(c, cy + 28, "Sol", 40, "d-s", "middle")}${note(c + 34, cy + 24, "Tierra", 50, "d-s", "middle")}`;
    const halo = lab.replace(/<text /g, '<text style="paint-order:stroke;stroke:var(--paper);stroke-width:5px;stroke-linejoin:round" ');
    return `${o2}${o1}${centre}${a}${halo}`.replace(/<circle class="d-dash" cx="(\d+)" cy="100" r="(\d+)"/g, '<circle class="d-dash" cx="$1" cy="100" r="$2"');
  };
  return fig("f-15-mo", "Dos modelos del cielo: en el geocentrismo la Tierra está quieta en el centro y el Sol gira a su alrededor; en el heliocentrismo el Sol está en el centro y la Tierra gira a su alrededor", 220, `
    ${note(95, 18, "Geocentrismo", 160, "d-t", "middle")}
    ${note(275, 18, "Heliocentrismo", 160, "d-t", "middle")}
    ${panel(10, true)}${panel(190, false)}
    ${note(95, 198, "Todo gira alrededor de la Tierra", 170, "d-s", "middle")}
    ${note(275, 198, "La Tierra gira alrededor del Sol", 170, "d-s", "middle")}`, W);
}

// Grams of CO2 per kWh of electricity, whole life cycle (IPCC medians).
function emisiones() {
  const rows = [["Eólica", 11, "d-fill-3"], ["Hidroeléctrica", 24, "d-fill-3"], ["Solar", 48, "d-fill-3"], ["Gas natural", 490, "d-fill-2"], ["Carbón", 820, "d-fill-5"]];
  const X0 = 112, MAXW = 190;
  let s = "";
  rows.forEach(([n, v, c], i) => {
    const y = 14 + i * 40, w = Math.max(3, (v / 820) * MAXW);
    s += note(X0 - 8, y + 19, n, 100, "d-s", "end");
    s += `<rect class="${c}" x="${X0}" y="${y}" width="${w.toFixed(1)}" height="26" rx="3"/>`;
    s += `<text class="d-a" x="${(X0 + w + 6).toFixed(1)}" y="${y + 19}">${v}</text>`;
  });
  s += `<path class="d-line" d="M${X0} 8V210"/>`;
  s += note(180, 238, "Gramos de CO₂ por cada kWh de electricidad", 340, "d-s", "middle");
  return fig("f-15-em", "Gráfico de barras de los gramos de CO2 por kWh: eólica 11, hidroeléctrica 24, solar 48, gas natural 490 y carbón 820", 252, s, W);
}

// Cross-section of Peru: sea, coast, Andes, jungle.
function corte() {
  return fig("f-15-cp", "Corte del Perú de oeste a este: mar frío con nubes bajas, costa desértica, los Andes y la selva donde llega el aire húmedo de la Amazonía", 318, `
    <rect class="d-water" x="6" y="164" width="84" height="66"/>
    <path class="d-obj" d="M90 164H118L212 56L286 164H354V230H90Z"/>
    <rect class="d-fill-6" x="90" y="164" width="28" height="66"/>
    <rect class="d-fill-3" x="286" y="164" width="68" height="66"/>
    <rect class="d-fill-1" x="8" y="130" width="104" height="20" rx="10"/>
    <path class="d-flow-acc" marker-end="url(#f-15-cpa)" d="M48 226V188"/>
    <path class="d-flow-acc" marker-end="url(#f-15-cpa)" d="M340 120C310 114 282 96 254 74"/>
    ${note(8, 122, "Nubes bajas: garúa", 160, "d-a")}
    ${note(196, 34, "Andes: frío y heladas", 120, "d-t", "end")}
    ${note(354, 28, "Aire húmedo de la Amazonía", 130, "d-s", "end")}
    ${note(6, 248, "Mar frío", 80, "d-t")}
    ${note(6, 264, "Humboldt", 80, "d-s")}
    ${note(104, 248, "Costa", 60, "d-t", "middle")}
    ${note(104, 264, "desierto", 60, "d-s", "middle")}
    ${note(216, 248, "Sierra", 70, "d-t", "middle")}
    ${note(216, 264, "lluvias en verano", 140, "d-s", "middle")}
    ${note(320, 248, "Selva", 60, "d-t", "middle")}
    ${note(320, 264, "cálida y lluviosa", 70, "d-s", "middle")}
    ${note(180, 306, "Dibujo esquemático, sin escala", 300, "d-s", "middle")}`, W);
}

// Composition of today's air.
function aire() {
  const X = 10, Wb = 340;
  const n = (78 / 100) * Wb, o = (21 / 100) * Wb;
  return fig("f-15-ai", "Barra del aire de hoy: 78 % nitrógeno, 21 % oxígeno y 1 % otros gases; arriba, hace 4 000 millones de años casi no había oxígeno libre", 190, `
    ${note(180, 18, "Hoy", 100, "d-t", "middle")}
    <rect class="d-fill-1" x="${X}" y="30" width="${n.toFixed(1)}" height="36"/>
    <rect class="d-fill-3" x="${(X + n).toFixed(1)}" y="30" width="${o.toFixed(1)}" height="36"/>
    <rect class="d-fill-6" x="${(X + n + o).toFixed(1)}" y="30" width="3.4" height="36"/>
    ${note(X + n / 2, 54, "Nitrógeno 78 %", 200, "d-t", "middle")}
    ${note(X + n + o / 2, 54, "O₂", 60, "d-t", "middle")}
    ${note(X + n + o / 2, 86, "Oxígeno 21 %", 100, "d-a", "middle")}
    ${note(350, 108, "Otros gases 1 %", 120, "d-s", "end")}
    ${note(180, 136, "Hace 4 000 millones de años", 300, "d-t", "middle")}
    ${box(10, 144, 340, 34, "", "casi sin oxígeno libre", "d-box-line")}`, W);
}

// Timeline, a row per event.
function tiempo() {
  const rows = [
    ["Nace el universo", "hace 13 800 millones de años", "d-box"],
    ["Se forman el Sol y la Tierra", "hace unos 4 500 millones de años", "d-box"],
    ["La Tierra se enfría: llueve y hay océanos", "hace más de 4 000 millones de años", "d-box"],
    ["Aparecen los primeros seres vivos", "hace unos 3 500 millones de años", "d-box"],
    ["La fotosíntesis llena el aire de oxígeno", "desde hace unos 2 400 millones de años", "d-acc"],
    ["Las plantas llegan a la tierra firme", "hace unos 450 millones de años", "d-box"],
  ];
  let s = "";
  rows.forEach(([a, b, c], i) => {
    const y = 6 + i * 58;
    s += box(6, y, 348, 48, a, b, c);
    if (i < rows.length - 1) s += `<path class="d-flow" marker-end="url(#f-15-ti)" d="M180 ${y + 49}V${y + 57}"/>`;
  });
  return fig("f-15-ti", "Línea de tiempo: universo hace 13 800 millones de años, Sol y Tierra hace 4 500, océanos hace más de 4 000, primeros seres vivos hace 3 500, oxígeno desde hace 2 400 y plantas en tierra firme hace 450 millones de años", 350, s, W);
}

export default {
  "15-linea-tiempo": {
    caption: "Del universo a las plantas: lo que pasó, en orden. Cada paso preparó el siguiente.",
    svg: tiempo(),
  },
  "15-aire": {
    caption: "El aire de hoy casi no se parece al de la Tierra recién formada: el oxígeno lo pusieron los seres vivos.",
    svg: aire(),
  },
  "15-invernadero-natural": {
    caption: "Con los gases naturales del aire, parte del calor vuelve hacia el suelo: la Tierra se mantiene templada. Sin ellos, estaría congelada.",
    svg: invernadero("f-15-in", "Dos esquemas: sin gases de efecto invernadero el calor se escapa y hay unos −18 °C; con los gases naturales, parte del calor vuelve y hay unos 15 °C", [["Sin gases", 0, "unos −18 °C"], ["Con gases naturales", 1, "unos 15 °C"]]),
  },
  "15-corte-peru": {
    caption: "El mar frío, los Andes y la selva hacen que en un mismo país haya desierto, nieve y bosque lluvioso.",
    svg: corte(),
  },
  "15-co2": {
    caption: "El dióxido de carbono (CO₂) del aire ha subido en cada periodo. El eje vertical empieza en 280 ppm para que se vea el cambio.",
    svg: co2(),
  },
  "15-invernadero": {
    caption: "A la izquierda, el efecto invernadero natural mantiene la Tierra templada. A la derecha, con más gases por la actividad humana, se atrapa más calor.",
    svg: invernadero("f-15-iv", "Dos esquemas de la atmósfera: con pocos gases, parte del calor vuelve a la Tierra; con muchos gases, vuelve más calor y el planeta se calienta", [["Natural", 1, "poco calor vuelve"], ["Aumentado", 2, "mucho calor vuelve"]]),
  },
  "15-emisiones": {
    caption: "La electricidad de viento, agua y sol emite muchísimo menos CO₂ que la del gas o el carbón (valores medios, toda la vida de la central).",
    svg: emisiones(),
  },
  "15-modelos": {
    caption: "Dos formas de ordenar el cielo. La primera es la que se ve a simple vista; la segunda es la que explican las observaciones con telescopio.",
    svg: modelos(),
  },
  "15-estaciones": {
    caption: "Las estaciones no vienen de qué tan cerca está la Tierra del Sol, sino de la inclinación de su eje. Cuando un hemisferio se inclina hacia el Sol, ahí es verano.",
    svg: estaciones(),
  },
};
