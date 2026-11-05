// Figures of "Energía, trabajo y máquinas simples". Drawn 360 wide so their text reads on a phone.
import { box, note, fig } from "../../platform/build/figkit.mjs";

const W = 360;
const arrow = (id, x1, y1, x2, y2, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x1} ${y1}L${x2} ${y2}"/>`;

// A column of boxes joined by arrows; each arrow can carry a short label on its right.
const column = (id, label, items, labels, bh = 52, gap = 36) => {
  const x = 60, w = 240;
  let out = "";
  items.forEach((it, i) => {
    const y = 8 + i * (bh + gap);
    out += box(x, y, w, bh, it[0], it[1], it[2]);
    if (i < items.length - 1) {
      out += arrow(id, 180, y + bh, 180, y + bh + gap - 2, items[i + 1][2] === "d-acc");
      if (labels[i]) out += `<text class="d-s" x="194" y="${y + bh + gap / 2 + 5}">${labels[i]}</text>`;
    }
  });
  return fig(id, label, 8 + items.length * (bh + gap) - gap + 8, out, W);
};

const formas = (() => {
  const cells = [
    ["Cinética", "carro en marcha"], ["Potencial", "agua en lo alto"], ["Térmica", "olla caliente"],
    ["Química", "comida, gas"], ["Eléctrica", "enchufe, rayo"], ["Luminosa", "luz del Sol"],
    ["Sonora", "un parlante"], ["Nuclear", "el uranio"], ["Mecánica", "cinética + potencial"],
  ];
  const out = cells.map((c, i) => box(6 + (i % 3) * 120, 6 + Math.floor(i / 3) * 76, 108, 66, c[0], c[1], i === 8 ? "d-acc" : "d-box")).join("");
  return {
    caption: "Nueve formas de energía y un ejemplo de cada una. La **mecánica** es la suma de la cinética y la potencial.",
    svg: fig("f-06-formas", "Nueve formas de energía con un ejemplo cada una", 240, out, W),
  };
})();

const cadenaSol = {
  caption: "Casi toda la energía de los seres vivos empieza en el **Sol**. En cada paso, una parte se escapa como calor.",
  svg: column("f-06-sol", "Cadena de energía: el Sol, la planta, el cuy y nosotros", [
    ["El Sol", "energía luminosa"],
    ["La planta (papa, alfalfa)", "energía química"],
    ["El cuy", "energía química"],
    ["Tú", "movimiento y calor", "d-acc"],
  ], ["fotosíntesis", "se la come", "lo comes"]),
};

const hidro = {
  caption: "En una **hidroeléctrica** la energía potencial del agua termina como energía eléctrica.",
  svg: column("f-06-hid", "Cadena de energía en una central hidroeléctrica", [
    ["Agua en el embalse", "energía potencial"],
    ["Agua que baja por la tubería", "energía cinética"],
    ["Turbina que gira", "energía cinética de giro"],
    ["Generador", "energía eléctrica", "d-acc"],
  ], ["cae", "empuja las aspas", "mueve el generador"]),
};

const cadenaLinterna = {
  caption: "Una **linterna** y una **cocina a gas**: en las dos, la energía química se transforma y siempre sale algo de calor.",
  svg: fig("f-06-lin", "Cadenas de energía de una linterna y de una cocina a gas", 214, `
    <text class="d-t" x="180" y="16" text-anchor="middle">Linterna</text>
    ${box(4, 26, 98, 50, "Pilas", "química")}
    ${arrow("f-06-lin", 102, 51, 126, 51)}
    ${box(126, 26, 98, 50, "Circuito", "eléctrica")}
    ${arrow("f-06-lin", 224, 51, 248, 51, true)}
    ${box(248, 26, 108, 50, "Luz y calor", "al ambiente", "d-acc")}
    <text class="d-t" x="180" y="120" text-anchor="middle">Cocina a gas</text>
    ${box(4, 130, 98, 50, "Gas", "química")}
    ${arrow("f-06-lin", 102, 155, 126, 155)}
    ${box(126, 130, 98, 50, "Llama", "luz y calor")}
    ${arrow("f-06-lin", 224, 155, 248, 155, true)}
    ${box(248, 130, 108, 50, "Olla", "térmica", "d-acc")}
    ${note(180, 204, "Cada flecha es una transformación", 300, "d-s", "middle")}`, W),
};

const barras = (() => {
  const panel = (x, title, ep, ec) => {
    const base = 150, k = 0.9;
    return `<rect class="d-box-line" x="${x}" y="6" width="108" height="196" rx="10"/>
      <text class="d-t" x="${x + 54}" y="30" text-anchor="middle">${title}</text>
      <rect class="d-fill-1" x="${x + 16}" y="${base - ep * k}" width="30" height="${ep * k}"/>
      <rect class="d-fill-2" x="${x + 62}" y="${base - ec * k}" width="30" height="${ec * k}"/>
      <path class="d-line" d="M${x + 10} ${base}H${x + 98}"/>
      <text class="d-s" x="${x + 31}" y="${base + 16}" text-anchor="middle">Ep</text>
      <text class="d-s" x="${x + 77}" y="${base + 16}" text-anchor="middle">Ec</text>
      <text class="d-n" x="${x + 54}" y="${base + 40}" text-anchor="middle">${ep} + ${ec} = 100 J</text>`;
  };
  return {
    caption: "Una pelota que cae: la **Ep** baja y la **Ec** sube, pero la suma siempre es **100 J**.",
    svg: fig("f-06-bar", "Barras de energía potencial y cinética de una pelota que cae", 212,
      panel(6, "Arriba", 100, 0) + panel(126, "A la mitad", 50, 50) + panel(246, "Abajo", 0, 100), W),
  };
})();

const graficaEp = (() => {
  const ox = 56, oy = 186, sx = 54, sy = 1.7;
  const px = (h) => ox + h * sx, py = (e) => oy - e * sy;
  let ticks = "";
  for (let h = 0; h <= 5; h++) ticks += `<path class="d-line" d="M${px(h)} ${oy}v5"/><text class="d-n" x="${px(h)}" y="${oy + 20}" text-anchor="middle">${h}</text>`;
  for (let e = 0; e <= 100; e += 20) ticks += `<path class="d-line" d="M${ox - 5} ${py(e)}h5"/><text class="d-n" x="${ox - 9}" y="${py(e) + 4}" text-anchor="end">${e}</text>`;
  const pts = [1, 2, 3, 4, 5].map((h) => `<circle class="d-fill-acc" cx="${px(h)}" cy="${py(20 * h)}" r="4"/>`).join("");
  return {
    caption: "Una caja de **2 kg**: su Ep crece **en línea recta** con la altura (Ep = 2 · 10 · h = 20 · h).",
    svg: fig("f-06-gra", "Gráfica de la energía potencial de una caja de 2 kilogramos según la altura", 232, `
      <path class="d-line" d="M${ox} ${oy}H${px(5) + 8}M${ox} ${oy}V${py(100) - 10}"/>
      ${ticks}
      <path class="d-flow-acc" d="M${px(0)} ${py(0)}L${px(5)} ${py(100)}"/>
      ${pts}
      <text class="d-s" x="${ox + 12}" y="14">Ep (J)</text>
      <text class="d-s" x="${px(5)}" y="${oy + 40}" text-anchor="end">Altura h (m)</text>`, W),
  };
})();


const text = (x, y, s, cls = "d-s", anchor = "middle") => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;

const palanca = {
  caption: "En equilibrio: **F · brazo de la fuerza = R · brazo de la resistencia**. Aquí F = 600 × 0,2 ÷ 1,2 = 100 N.",
  svg: fig("f-06-pal", "Palanca con apoyo, una carga de 600 newtons a 0,2 metros y una fuerza de 100 newtons a 1,2 metros", 250, `
    <path class="d-flow-acc" d="M30 134L330 134" style="stroke-width:6"/>
    <path class="d-obj" d="M80 142L66 178H94Z"/>
    ${text(80, 198, "apoyo", "d-s")}
    ${arrow("f-06-pal", 40, 70, 40, 126)}
    ${arrow("f-06-pal", 320, 70, 320, 126, true)}
    ${text(40, 52, "R = 600 N", "d-t", "start")}
    ${text(320, 52, "F = ?", "d-a", "end")}
    <path class="d-line" d="M40 214H320M40 208V220M80 208V220M320 208V220"/>
    ${text(60, 234, "0,2 m", "d-n")}${text(200, 234, "1,2 m", "d-n")}`, W),
};

const plano = {
  caption: "Una rampa más **larga** exige **menos fuerza**, pero hay que recorrer **más camino**.",
  svg: fig("f-06-pla", "Rampa de 3 metros que sube 1 metro: subir 600 newtons de peso requiere 200 newtons sin rozamiento", 210, `
    <path class="d-line" d="M30 170H330"/><path class="d-line" d="M330 170V90"/>
    <path class="d-flow-acc" d="M30 170L330 90"/>
    <rect class="d-fill-2" x="130" y="112" width="30" height="24" rx="3" transform="rotate(-15 145 124)"/>
    ${text(322, 134, "1 m", "d-n", "end")}
    ${text(150, 190, "base", "d-s", "end")}
    ${text(110, 118, "rampa: 3 m", "d-n", "end")}
    ${note(180, 30, "Subir 600 N a 1 m de altura", 300, "d-t", "middle")}
    ${note(180, 54, "Sin rampa: 600 N. Con rampa de 3 m: 200 N.", 330, "d-a", "middle")}`, W),
};

const poleas = {
  caption: "La polea **fija** solo cambia la dirección de la fuerza; la **móvil** la reduce a la mitad.",
  svg: fig("f-06-pol", "Polea fija: se jala con 100 N para subir 100 N; polea móvil: se jala con 50 N para subir 100 N", 262, `
    <path class="d-line" d="M20 12H340"/>
    <path class="d-dash" d="M180 24V206"/>
    <path class="d-line" d="M70 12V62"/>
    <circle class="d-obj" cx="70" cy="80" r="18"/>
    <path class="d-flow" d="M52 80V170"/><path class="d-flow" marker-end="url(#f-06-pol)" d="M88 80V130"/>
    <rect class="d-fill-2" x="28" y="170" width="48" height="26" rx="4"/>
    ${text(52, 188, "100 N", "d-t")}
    ${text(96, 150, "F = 100 N", "d-a", "start")}
    <path class="d-flow" d="M244 12V120"/>
    <path class="d-flow" d="M280 120V40"/><path class="d-flow" marker-end="url(#f-06-pol)" d="M280 40V16"/>
    <circle class="d-obj" cx="262" cy="120" r="18"/>
    <path class="d-line" d="M262 138V170"/>
    <rect class="d-fill-2" x="236" y="170" width="52" height="26" rx="4"/>
    ${text(262, 188, "100 N", "d-t")}
    ${text(290, 96, "F = 50 N", "d-a", "start")}
    ${text(70, 226, "Polea fija", "d-t")}${text(262, 226, "Polea móvil", "d-t")}
    ${note(180, 252, "La móvil la soportan dos tramos de cuerda", 340, "d-s", "middle")}`, W),
};

const trabajo = {
  caption: "Hay **trabajo** cuando la fuerza empuja o jala **en la misma dirección** en que se mueve el objeto.",
  svg: fig("f-06-tra", "Arriba, una caja empujada 5 metros en la dirección de la fuerza: hay trabajo. Abajo, una persona camina con un costal: la fuerza hacia arriba es perpendicular al movimiento y no hay trabajo", 330, `
    <text class="d-t" x="180" y="18" text-anchor="middle">Hay trabajo</text>
    <path class="d-line" d="M20 116H340"/>
    <rect class="d-fill-2" x="50" y="76" width="44" height="40" rx="3"/>
    <path class="d-flow-acc" marker-end="url(#f-06-traa)" d="M96 96H190"/>
    ${text(143, 84, "F = 20 N", "d-a")}
    <path class="d-dash" d="M50 134V146M250 134V146"/>
    <path class="d-flow" marker-end="url(#f-06-tra)" d="M50 140H248"/>
    ${text(150, 162, "d = 5 m", "d-n")}
    ${text(180, 190, "W = 20 N · 5 m = 100 J", "d-t")}
    <path class="d-dash" d="M20 204H340"/>
    <text class="d-t" x="180" y="226" text-anchor="middle">No hay trabajo</text>
    <circle class="d-fill-1" cx="70" cy="248" r="9"/>
    <path class="d-stroke-1" style="stroke-width:3;fill:none" d="M70 257V284M70 284L60 304M70 284L80 304M70 264L84 276"/>
    <rect class="d-fill-2" x="80" y="268" width="24" height="16" rx="3"/>
    <path class="d-flow-acc" marker-end="url(#f-06-traa)" d="M118 276V240"/>
    ${text(132, 256, "F", "d-a", "start")}
    <path class="d-flow" marker-end="url(#f-06-tra)" d="M160 296H320"/>
    ${text(240, 314, "se mueve así", "d-n")}`, W),
};

const igual = {
  caption: "Subir el mismo costal 1 m: con la rampa usas **menos fuerza**, pero recorres **más distancia**. El trabajo es el **mismo**.",
  svg: fig("f-06-igu", "Levantar 600 newtons 1 metro es 600 joules; con una rampa de 3 metros se usan 200 newtons durante 3 metros, también 600 joules", 214, `
    ${box(6, 6, 168, 130, "Levantarlo directo", ["F = 600 N", "d = 1 m"])}
    ${box(186, 6, 168, 130, "Con rampa de 3 m", ["F = 200 N", "d = 3 m"])}
    ${box(6, 150, 348, 56, "W = 600 J en los dos casos", "", "d-acc")}`, W),
};

export default {
  "06-formas": formas, "06-cadena-sol": cadenaSol, "06-hidro": hidro, "06-cadena-linterna": cadenaLinterna,
  "06-barras": barras, "06-grafica-ep": graficaEp, "06-trabajo": trabajo, "06-igual": igual,
  "06-palanca": palanca, "06-plano": plano, "06-poleas": poleas,
};
