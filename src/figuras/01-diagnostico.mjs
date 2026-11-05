// Figures of the placement test (content/…/01-la-ciencia-y-la-indagacion/_diagnostico.md): new data,
// so the test never shows a graph of the lessons. Same plot style as 01-la-ciencia-y-la-indagacion.mjs.
import { fig } from "../../platform/build/figkit.mjs";

const W = 360;
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

// One series, with a light grid so every value sits on a line.
const lineChart = ({ id, label, ymax, step, yTitle, xTitle, xs, vals }) => {
  const x1 = 340;
  const { out, py } = yAxis(ymax, step, yTitle, x1);
  const px = (x) => X0 + ((x1 - 14 - X0) * (x - xs[0])) / (xs[xs.length - 1] - xs[0]);
  let o = out;
  for (let v = step; v <= ymax; v += step) o += `<path class="d-dash" d="M${X0} ${py(v)}H${x1}"/>`;
  xs.forEach((x) => { o += `<path class="d-line" d="M${px(x)} ${YB}v4"/><text class="d-n" x="${px(x)}" y="${YB + 18}" text-anchor="middle">${x}</text>`; });
  o += `<text class="d-s" x="${(X0 + x1) / 2}" y="${YB + 42}" text-anchor="middle">${xTitle}</text>`;
  o += `<path class="d-stroke-2" d="M${vals.map((v, i) => `${px(xs[i])} ${py(v)}`).join("L")}"/>`;
  vals.forEach((v, i) => { o += `<circle class="d-fill-2" cx="${px(xs[i])}" cy="${py(v)}" r="3.5"/>`; });
  return fig(id, label, YB + 52, o, W);
};

export default {
  "01-dg-terma": {
    caption: "Temperatura del agua de una terma solar en Arequipa durante un día de sol (datos de ejemplo).",
    svg: lineChart({
      id: "f-01-dg-terma", label: "Gráfico de líneas: temperatura del agua de una terma solar a las 6, 8, 10, 12 y 14 horas: 10, 20, 30, 50 y 60 grados Celsius",
      ymax: 70, step: 10, yTitle: "Temperatura (°C)", xTitle: "Hora del día", xs: [6, 8, 10, 12, 14], vals: [10, 20, 30, 50, 60],
    }),
  },
  "01-dg-secado": {
    caption: "Minutos que tardó en secarse al sol un pedazo de cada tela, todos del mismo tamaño y igual de mojados (datos de ejemplo).",
    svg: barChart({
      id: "f-01-dg-sec", label: "Gráfico de barras: tiempo de secado de algodón 90, lana 120, poliéster 45 y jean 150 minutos",
      ymax: 150, step: 30, yTitle: "Tiempo de secado (min)", xTitle: "Tipo de tela",
      cats: [["Algodón", 90], ["Lana", 120], ["Poliéster", 45], ["Jean", 150]],
    }),
  },
};
