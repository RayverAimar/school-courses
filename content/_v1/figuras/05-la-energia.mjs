// Figures of "La energía". Drawn 360 wide so their text reads on a phone.
import { box, note, fig } from "../../../platform/build/figkit.mjs";

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
    svg: fig("f-05-formas", "Nueve formas de energía con un ejemplo cada una", 240, out, W),
  };
})();

const cadenaSol = {
  caption: "Casi toda la energía de los seres vivos empieza en el **Sol**. En cada paso, una parte se escapa como calor.",
  svg: column("f-05-sol", "Cadena de energía: el Sol, la planta, el cuy y nosotros", [
    ["El Sol", "energía luminosa"],
    ["La planta (papa, alfalfa)", "energía química"],
    ["El cuy", "energía química"],
    ["Tú", "movimiento y calor", "d-acc"],
  ], ["fotosíntesis", "se la come", "lo comes"]),
};

const hidro = {
  caption: "En una **hidroeléctrica** la energía potencial del agua termina como energía eléctrica.",
  svg: column("f-05-hid", "Cadena de energía en una central hidroeléctrica", [
    ["Agua en el embalse", "energía potencial"],
    ["Agua que baja por la tubería", "energía cinética"],
    ["Turbina que gira", "energía cinética de giro"],
    ["Generador", "energía eléctrica", "d-acc"],
  ], ["cae", "empuja las aspas", "mueve el generador"]),
};

const cadenaLinterna = {
  caption: "Una **linterna** y una **cocina a gas**: en las dos, la energía química se transforma y siempre sale algo de calor.",
  svg: fig("f-05-lin", "Cadenas de energía de una linterna y de una cocina a gas", 214, `
    <text class="d-t" x="180" y="16" text-anchor="middle">Linterna</text>
    ${box(4, 26, 98, 50, "Pilas", "química")}
    ${arrow("f-05-lin", 102, 51, 126, 51)}
    ${box(126, 26, 98, 50, "Circuito", "eléctrica")}
    ${arrow("f-05-lin", 224, 51, 248, 51, true)}
    ${box(248, 26, 108, 50, "Luz y calor", "al ambiente", "d-acc")}
    <text class="d-t" x="180" y="120" text-anchor="middle">Cocina a gas</text>
    ${box(4, 130, 98, 50, "Gas", "química")}
    ${arrow("f-05-lin", 102, 155, 126, 155)}
    ${box(126, 130, 98, 50, "Llama", "luz y calor")}
    ${arrow("f-05-lin", 224, 155, 248, 155, true)}
    ${box(248, 130, 108, 50, "Olla", "térmica", "d-acc")}
    ${note(180, 204, "Cada flecha es una transformación", 300, "d-s", "middle")}`, W),
};

const barras = (() => {
  const panel = (x, title, ep, ec) => {
    const base = 150, k = 0.9;
    return `<rect class="d-box-line" x="${x}" y="6" width="108" height="196" rx="10"/>
      <text class="d-t" x="${x + 54}" y="30" text-anchor="middle">${title}</text>
      <rect class="d-fill-hair" x="${x + 16}" y="${base - ep * k}" width="30" height="${ep * k}"/>
      <rect class="d-fill-acc" x="${x + 62}" y="${base - ec * k}" width="30" height="${ec * k}"/>
      <path class="d-line" d="M${x + 10} ${base}H${x + 98}"/>
      <text class="d-s" x="${x + 31}" y="${base + 16}" text-anchor="middle">Ep</text>
      <text class="d-s" x="${x + 77}" y="${base + 16}" text-anchor="middle">Ec</text>
      <text class="d-n" x="${x + 54}" y="${base + 40}" text-anchor="middle">${ep} + ${ec} = 100 J</text>`;
  };
  return {
    caption: "Una pelota que cae: la **Ep** baja y la **Ec** sube, pero la suma siempre es **100 J**.",
    svg: fig("f-05-bar", "Barras de energía potencial y cinética de una pelota que cae", 212,
      panel(6, "Arriba", 100, 0) + panel(126, "A la mitad", 50, 50) + panel(246, "Abajo", 0, 100), W),
  };
})();

const eficiencia = {
  caption: "De cada 100 J que recibe un foco, solo una parte se vuelve **luz**; el resto es **calor** (valores aproximados).",
  svg: fig("f-05-efi", "Dos focos: la parte de la energía que se vuelve luz y la que se vuelve calor", 220, `
    <text class="d-t" x="30" y="20">Foco incandescente (100 J)</text>
    <rect class="d-fill-acc" x="30" y="30" width="15" height="34"/>
    <rect class="d-fill-hair" x="45" y="30" width="285" height="34"/>
    ${note(30, 84, "5 J de luz", 100, "d-a")}
    ${note(330, 84, "95 J de calor", 140, "d-s", "end")}
    <text class="d-t" x="30" y="128">Foco LED (100 J)</text>
    <rect class="d-fill-acc" x="30" y="138" width="60" height="34"/>
    <rect class="d-fill-hair" x="90" y="138" width="240" height="34"/>
    ${note(30, 192, "20 J de luz", 100, "d-a")}
    ${note(330, 192, "80 J de calor", 140, "d-s", "end")}
    <path class="d-dash" d="M30 108H330"/>`, W),
};

const graficaEp = (() => {
  const ox = 56, oy = 186, sx = 54, sy = 1.7;
  const px = (h) => ox + h * sx, py = (e) => oy - e * sy;
  let ticks = "";
  for (let h = 0; h <= 5; h++) ticks += `<path class="d-line" d="M${px(h)} ${oy}v5"/><text class="d-n" x="${px(h)}" y="${oy + 20}" text-anchor="middle">${h}</text>`;
  for (let e = 0; e <= 100; e += 20) ticks += `<path class="d-line" d="M${ox - 5} ${py(e)}h5"/><text class="d-n" x="${ox - 9}" y="${py(e) + 4}" text-anchor="end">${e}</text>`;
  const pts = [1, 2, 3, 4, 5].map((h) => `<circle class="d-fill-acc" cx="${px(h)}" cy="${py(20 * h)}" r="4"/>`).join("");
  return {
    caption: "Una caja de **2 kg**: su Ep crece **en línea recta** con la altura (Ep = 2 · 10 · h = 20 · h).",
    svg: fig("f-05-gra", "Gráfica de la energía potencial de una caja de 2 kilogramos según la altura", 232, `
      <path class="d-line" d="M${ox} ${oy}H${px(5) + 8}M${ox} ${oy}V${py(100) - 10}"/>
      ${ticks}
      <path class="d-flow-acc" d="M${px(0)} ${py(0)}L${px(5)} ${py(100)}"/>
      ${pts}
      <text class="d-s" x="${ox + 4}" y="14">Ep (J)</text>
      <text class="d-s" x="${px(5)}" y="${oy + 40}" text-anchor="end">Altura h (m)</text>`, W),
  };
})();

export default { "05-formas": formas, "05-cadena-sol": cadenaSol, "05-hidro": hidro, "05-cadena-linterna": cadenaLinterna, "05-barras": barras, "05-eficiencia": eficiencia, "05-grafica-ep": graficaEp };
