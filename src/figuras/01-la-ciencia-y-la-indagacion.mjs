// Figures of "La ciencia y la indagación". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, chain } from "../../platform/build/figkit.mjs";

const W = 360;

// Plot area shared by the data charts: left 58, right 346 (or less for line charts with labels), top 22, bottom 190.
const X0 = 58, YT = 22, YB = 190;
const yAxis = (ymax, step, title, x1) => {
  const py = (v) => YB - ((YB - YT) * v) / ymax;
  let out = `<path class="d-line" d="M${X0} ${YT}V${YB}H${x1}"/>`;
  for (let v = 0; v <= ymax; v += step) out += `<path class="d-line" d="M${X0 - 4} ${py(v)}H${X0}"/><text class="d-n" x="${X0 - 8}" y="${py(v) + 4}" text-anchor="end">${v}</text>`;
  const cy = (YT + YB) / 2;
  out += `<text class="d-s" transform="rotate(-90 14 ${cy})" x="14" y="${cy}" text-anchor="middle">${title}</text>`;
  return { out, py };
};

const barChart = ({ id, label, ymax, step, yTitle, xTitle, cats }) => {
  const x1 = 346;
  const { out, py } = yAxis(ymax, step, yTitle, x1);
  const slot = (x1 - X0) / cats.length, bw = Math.min(46, slot * 0.55);
  let bars = "";
  cats.forEach(([name, v], i) => {
    const cx = X0 + slot * (i + 0.5);
    bars += `<rect class="d-fill-acc" x="${cx - bw / 2}" y="${py(v)}" width="${bw}" height="${YB - py(v)}" rx="2"/>`;
    bars += `<text class="d-a" x="${cx}" y="${py(v) - 5}" text-anchor="middle">${v}</text>`;
    bars += `<text class="d-n" x="${cx}" y="${YB + 18}" text-anchor="middle">${name}</text>`;
  });
  bars += `<text class="d-s" x="${(X0 + x1) / 2}" y="${YB + 42}" text-anchor="middle">${xTitle}</text>`;
  return fig(id, label, YB + 52, out + bars, W);
};

const lineChart = ({ id, label, ymax, step, yTitle, xTitle, xs, series }) => {
  const x1 = 262;
  const { out, py } = yAxis(ymax, step, yTitle, x1);
  const px = (x) => X0 + ((x1 - 6 - X0) * (x - xs[0])) / (xs[xs.length - 1] - xs[0]);
  let o = out;
  xs.forEach((x) => { o += `<path class="d-line" d="M${px(x)} ${YB}v4"/><text class="d-n" x="${px(x)}" y="${YB + 18}" text-anchor="middle">${x}</text>`; });
  o += `<text class="d-s" x="${(X0 + x1) / 2}" y="${YB + 42}" text-anchor="middle">${xTitle}</text>`;
  for (const s of series) {
    o += `<path class="${s.cls}" d="M${s.vals.map((v, i) => `${px(xs[i])} ${py(v)}`).join("L")}"/>`;
    s.vals.forEach((v, i) => { o += `<circle class="${s.dot}" cx="${px(xs[i])}" cy="${py(v)}" r="3.5"/>`; });
    const last = s.vals[s.vals.length - 1];
    o += `<text class="d-s" x="${px(xs[xs.length - 1]) + 10}" y="${py(last) + 4}">${s.name}</text>`;
  }
  return fig(id, label, YB + 52, o, W);
};

const metodo = (() => {
  const c = chain("f-01-metodo", [
    ["Observar", "mira y mide"],
    ["Preguntar", "problema"],
    ["Hipótesis", "una respuesta"],
    ["Probar", "experimento"],
    ["Datos", "tablas y gráficos", "d-acc"],
    ["Concluir", "¿se apoya?"],
  ], { per: 3, ch: 64, gap: 22, m: 6, W, closing: true });
  return {
    caption: "El camino de una indagación. Si los datos no apoyan la hipótesis, se vuelve a **preguntar** y se plantea otra.",
    svg: fig("f-01-metodo", "Seis pasos de la indagación: observar, preguntar, hipótesis, probar, datos y concluir, en dos filas, con una flecha que vuelve de concluir a observar", c.h, c.svg, W),
  };
})();

const variables = {
  caption: "Cambias **una** cosa, mides lo que **responde** y mantienes **igual** todo lo demás.",
  svg: fig("f-01-var", "Variable independiente, variable dependiente y variables controladas", 214, `
    ${box(6, 8, 148, 96, "Independiente", ["lo que tú cambias", "Ej.: la luz"], "d-acc")}
    <path class="d-flow-acc" marker-end="url(#f-01-vara)" d="M154 56H206"/>
    ${box(206, 8, 148, 96, "Dependiente", ["lo que mides", "Ej.: altura (cm)"])}
    ${box(6, 128, 348, 80, "Controladas", ["lo que mantienes igual", "Ej.: semilla, tierra, agua, maceta"], "d-box-line")}`, W),
};

const control = {
  caption: "El **grupo control** no recibe el cambio: es la referencia con la que se compara.",
  svg: fig("f-01-ctl", "Grupo control y grupo experimental de frejoles", 236, `
    ${box(6, 8, 168, 96, "Grupo control", ["10 frejoles", "sin abono"])}
    ${box(186, 8, 168, 96, "Experimental", ["10 frejoles", "con abono"], "d-acc")}
    ${box(6, 128, 348, 60, "", ["Igual en los dos: tierra, maceta,", "agua, luz y días de siembra"], "d-box-line")}
    ${note(180, 216, "Se comparan los resultados de los dos grupos", 340, "d-a", "middle")}`, W),
};

const barrasEfervescencia = {
  caption: "Tiempo que tardó en disolverse una tableta efervescente según la temperatura del agua.",
  svg: barChart({
    id: "f-01-bef", label: "Gráfico de barras: tiempo de disolución de 95, 60, 35 y 20 segundos a 5, 20, 40 y 60 grados Celsius",
    ymax: 100, step: 20, yTitle: "Tiempo (s)", xTitle: "Temperatura del agua (°C)",
    cats: [["5", 95], ["20", 60], ["40", 35], ["60", 20]],
  }),
};

const lineasPlantas = {
  caption: "Altura de plantas de frejol durante 12 días con tres cantidades de luz.",
  svg: lineChart({
    id: "f-01-lpl", label: "Gráfico de líneas: altura de plantas de frejol en 12 días con sol directo, sombra parcial y poca luz",
    ymax: 20, step: 5, yTitle: "Altura (cm)", xTitle: "Tiempo (días)", xs: [0, 3, 6, 9, 12],
    series: [
      { name: "Sol", vals: [0, 4, 9, 13, 16], cls: "d-stroke-2", dot: "d-fill-2" },
      { name: "Sombra", vals: [0, 3, 6, 8, 9], cls: "d-stroke-3", dot: "d-fill-3" },
      { name: "Poca luz", vals: [0, 2, 4, 5, 6], cls: "d-stroke-1", dot: "d-fill-1" },
    ],
  }),
};

const barrasRiego = {
  caption: "Semillas de maíz germinadas (de 20 sembradas en cada maceta) según los riegos por semana.",
  svg: barChart({
    id: "f-01-bri", label: "Gráfico de barras: semillas germinadas de 20 con 0, 1, 3 y 7 riegos por semana: 2, 15, 18 y 8",
    ymax: 20, step: 5, yTitle: "Semillas germinadas", xTitle: "Riegos por semana",
    cats: [["0", 2], ["1", 15], ["3", 18], ["7", 8]],
  }),
};

const lineasAbono = {
  caption: "Altura de plántulas de maíz en 20 días, con abono y sin abono.",
  svg: lineChart({
    id: "f-01-lab", label: "Gráfico de líneas: altura de plántulas de maíz en 20 días, con abono llega a 34 centímetros y sin abono a 20",
    ymax: 40, step: 10, yTitle: "Altura (cm)", xTitle: "Tiempo (días)", xs: [0, 5, 10, 15, 20],
    series: [
      { name: "Con abono", vals: [0, 6, 14, 24, 34], cls: "d-stroke-2", dot: "d-fill-2" },
      { name: "Sin abono", vals: [0, 5, 10, 15, 20], cls: "d-stroke-1", dot: "d-fill-1" },
    ],
  }),
};

const lineasEnfriamiento = {
  caption: "Temperatura del agua de dos vasos que se enfrían durante 20 minutos.",
  svg: lineChart({
    id: "f-01-len", label: "Gráfico de líneas: temperatura de dos vasos de agua en 20 minutos; sin tapa baja de 80 a 37 grados Celsius y con tapa de 80 a 50",
    ymax: 100, step: 20, yTitle: "Temperatura (°C)", xTitle: "Tiempo (min)", xs: [0, 5, 10, 15, 20],
    series: [
      { name: "Con tapa", vals: [80, 70, 62, 55, 50], cls: "d-stroke-2", dot: "d-fill-2" },
      { name: "Sin tapa", vals: [80, 62, 50, 42, 37], cls: "d-stroke-1", dot: "d-fill-1" },
    ],
  }),
};

const barrasSuelo = {
  caption: "Altura media de plantas de frejol a los 15 días según el tipo de suelo (5 plantas por suelo).",
  svg: barChart({
    id: "f-01-bsu", label: "Gráfico de barras: altura media de frejoles a los 15 días: arena 8, arcilla 12, tierra negra 18 y grava 5 centímetros",
    ymax: 20, step: 5, yTitle: "Altura media (cm)", xTitle: "Tipo de suelo",
    cats: [["Arena", 8], ["Arcilla", 12], ["T. negra", 18], ["Grava", 5]],
  }),
};

const barrasOxido = {
  caption: "Óxido en un clavo de hierro después de 7 días en cuatro frascos (0 = nada, 3 = mucho).",
  svg: barChart({
    id: "f-01-box", label: "Gráfico de barras: óxido del clavo en agua del caño 2, agua con sal 3, aceite 0 y aire seco 0",
    ymax: 3, step: 1, yTitle: "Óxido (0 a 3)", xTitle: "Lo que rodea al clavo",
    cats: [["Caño", 2], ["Con sal", 3], ["Aceite", 0], ["Seco", 0]],
  }),
};

const lineaLiga = {
  caption: "Estiramiento de una liga según la masa que cuelga de ella. Los puntos están sobre una recta que sale del 0.",
  svg: lineChart({
    id: "f-01-lli", label: "Gráfico de líneas: una liga se estira 0, 2, 4, 6 y 8 centímetros con masas de 0, 50, 100, 150 y 200 gramos",
    ymax: 10, step: 2, yTitle: "Estiramiento (cm)", xTitle: "Masa colgada (g)", xs: [0, 50, 100, 150, 200],
    series: [{ name: "Liga", vals: [0, 2, 4, 6, 8], cls: "d-stroke-4", dot: "d-fill-4" }],
  }),
};

const partes = (() => {
  const x0 = 58, x1 = 330, yb = 190, yt = 40;
  const px = (x) => x0 + ((x1 - 20 - x0) * x) / 12, py = (v) => yb - ((yb - yt) * v) / 20;
  const pts = [[0, 0], [3, 4], [6, 9], [9, 13], [12, 16]];
  const mk = (n, x, y) => `<circle class="d-fill-2" cx="${x}" cy="${y}" r="9"/><text class="d-t" x="${x}" y="${y + 4}" text-anchor="middle">${n}</text>`;
  let o = `<path class="d-line" d="M${x0} ${yt}V${yb}H${x1}"/>`;
  for (let v = 0; v <= 20; v += 5) o += `<path class="d-line" d="M${x0 - 4} ${py(v)}H${x0}"/><text class="d-n" x="${x0 - 8}" y="${py(v) + 4}" text-anchor="end">${v}</text>`;
  for (const x of [0, 3, 6, 9, 12]) o += `<path class="d-line" d="M${px(x)} ${yb}v4"/><text class="d-n" x="${px(x)}" y="${yb + 18}" text-anchor="middle">${x}</text>`;
  o += `<path class="d-stroke-3" d="M${pts.map(([x, v]) => `${px(x)} ${py(v)}`).join("L")}"/>`;
  pts.forEach(([x, v]) => { o += `<circle class="d-fill-3" cx="${px(x)}" cy="${py(v)}" r="3.5"/>`; });
  o += mk(1, 16, 14) + `<text class="d-t" x="32" y="18">Altura del frejol según los días</text>`;
  o += mk(2, 118, yb + 44) + `<text class="d-s" x="134" y="${yb + 48}">Tiempo (días)</text>`;
  o += mk(3, 14, 36) + `<text class="d-s" transform="rotate(-90 14 90)" x="14" y="90" text-anchor="middle">Altura (cm)</text>`;
  o += mk(4, px(9) - 18, py(13) - 14);
  o += mk(5, 341, yb + 14);
  return {
    caption: "Las partes de una gráfica: **1** título, **2** eje de la variable independiente, **3** eje de la dependiente, **4** los datos y **5** la escala.",
    svg: fig("f-01-par", "Gráfica de líneas con cinco partes numeradas: título, eje horizontal, eje vertical, línea de datos y escala", yb + 62, o, W),
  };
})();

const mediana = (() => {
  const vals = [1, 3, 3, 4, 6, 8, 10];
  const bw = 40, gap = 8, x0 = (W - (vals.length * bw + (vals.length - 1) * gap)) / 2;
  let o = "";
  vals.forEach((v, i) => {
    const x = x0 + i * (bw + gap);
    const cls = i === 3 ? "d-fill-2" : (v === 3 ? "d-fill-1" : "d-obj");
    o += `<rect class="${cls}" x="${x}" y="40" width="${bw}" height="44" rx="6"/><text class="d-t" x="${x + bw / 2}" y="68" text-anchor="middle">${v}</text>`;
  });
  o += `<text class="d-s" x="${W / 2}" y="22" text-anchor="middle">Datos ordenados de menor a mayor</text>`;
  o += `<path class="d-flow" marker-end="url(#f-01-med)" d="M${x0 + 3 * (bw + gap) + bw / 2} 128V90"/>`;
  o += `<text class="d-s" x="${x0 + 3 * (bw + gap) + bw / 2}" y="146" text-anchor="middle">Mediana = 4 (el del medio)</text>`;
  o += `<path class="d-stroke-1" d="M${x0 + bw + gap} 94v8h${bw * 2 + gap}v-8"/>`;
  o += `<text class="d-s" x="${x0 + bw + gap + bw + gap / 2}" y="120" text-anchor="middle">Moda = 3</text>`;
  return {
    caption: "Siete datos ordenados: el **3** se repite más (moda) y el **4** queda en el medio (mediana).",
    svg: fig("f-01-med", "Siete números ordenados 1, 3, 3, 4, 6, 8 y 10; el 3 repetido es la moda y el 4 del centro es la mediana", 160, o, W),
  };
})();

export default {
  "ci-metodo": metodo,
  "ci-variables": variables,
  "ci-control": control,
  "ci-barras-efervescencia": barrasEfervescencia,
  "ci-lineas-plantas": lineasPlantas,
  "ci-barras-riego": barrasRiego,
  "ci-lineas-abono": lineasAbono,
  "ci-lineas-enfriamiento": lineasEnfriamiento,
  "ci-barras-suelo": barrasSuelo,
  "ci-barras-oxido": barrasOxido,
  "ci-linea-liga": lineaLiga,
  "ci-partes-grafica": partes,
  "ci-mediana": mediana,
};
