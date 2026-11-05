// Figures of "Cambios físicos y químicos". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, R } from "../../platform/build/figkit.mjs";

const W = 360;
const arrow = (id, x1, y1, x2, y2, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x1} ${y1}L${x2} ${y2}"/>`;
const circ = (x, y, r, cls) => `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
const atom = (x, y, sym, r = 11) => `${circ(x, y, r, sym === "O" ? "d-fill-5" : "d-obj")}<text class="d-t" x="${x}" y="${y + 5}" text-anchor="middle">${sym}</text>`;

const cambios = {
  caption: "La pregunta clave: ¿al final hay una **sustancia nueva**?",
  svg: fig("f-05-cam", "Cambio físico y cambio químico", 252, `
    <text class="d-t" x="90" y="20" text-anchor="middle">Cambio físico</text>
    <text class="d-a" x="270" y="20" text-anchor="middle">Cambio químico</text>
    <path class="d-dash" d="M180 8V242"/>
    ${box(16, 34, 148, 56, "Hielo", ["agua sólida"])}
    ${arrow("f-05-cam", 90, 90, 90, 122)}
    ${box(16, 126, 148, 56, "Agua líquida", ["la misma sustancia"])}
    ${box(196, 34, 148, 56, "Hierro", ["clavo nuevo"])}
    ${arrow("f-05-cam", 270, 90, 270, 122, true)}
    ${box(196, 126, 148, 56, "Óxido", ["sustancia nueva"], "d-acc")}
    ${note(90, 206, "Se puede revertir: si lo enfrías, vuelve a ser hielo", 160, "d-s", "middle")}
    ${note(270, 206, "No vuelve a ser hierro: cambió su composición", 160, "d-s", "middle")}`, W),
};

// Sugar in tea: it spreads out, and evaporating the water brings it back.
const azucar = (() => {
  const panel = (x, title, sub, inner) =>
    `<rect class="d-box-line" x="${x}" y="10" width="108" height="108" rx="${R.box}"/>${inner}<text class="d-t" x="${x + 54}" y="140" text-anchor="middle">${title}</text>${note(x + 54, 158, sub, 104, "d-s", "middle")}`;
  const dot = (x, y) => circ(x, y, 4.5, "d-fill-6");
  const water = (x) => `<rect class="d-water" x="${x + 10}" y="40" width="88" height="68" rx="6"/>`;
  const a = water(6) + [0, 1, 2, 3].flatMap((i) => [0, 1].map((j) => dot(6 + 40 + i * 9, 98 - j * 9))).join("");
  const b = water(126) + [[148, 56], [170, 62], [196, 54], [160, 78], [184, 82], [208, 74], [150, 96], [176, 98], [204, 96]].map(([x, y]) => dot(x, y)).join("");
  const c = `<rect class="d-obj" x="${246 + 14}" y="98" width="80" height="10" rx="3"/>` + [0, 1, 2, 3, 4, 5].map((i) => dot(246 + 24 + i * 12, 92)).join("");
  return {
    caption: "Disolver es un cambio **físico**: el azúcar se reparte entre el agua, pero sigue siendo azúcar y se puede recuperar.",
    svg: fig("f-05-azu", "El azúcar se disuelve en el agua y reaparece al evaporarla", 190,
      panel(6, "Se agrega", "azúcar en agua", a) + panel(126, "Se disuelve", "sigue siendo azúcar", b) + panel(246, "Se evapora", "el azúcar reaparece", c) +
      arrow("f-05-azu", 116, 64, 124, 64, true) + arrow("f-05-azu", 236, 64, 244, 64, true), W),
  };
})();

// Energy: a reaction releases energy (products below reactants) or absorbs it.
const energia = (() => {
  const panel = (x, title, up, nota) => {
    const hi = 40, lo = 90, base = 140;
    const [yr, yp] = up ? [lo, hi] : [hi, lo];
    return `<text class="${up ? "d-t" : "d-a"}" x="${x + 84}" y="20" text-anchor="middle">${title}</text>
      <rect class="d-fill-2" x="${x + 10}" y="${yr}" width="52" height="${base - yr}" rx="3"/>
      <rect class="d-fill-3" x="${x + 106}" y="${yp}" width="52" height="${base - yp}" rx="3"/>
      <path class="d-dash" d="M${x + 62} ${yr}H${x + 84}M${x + 84} ${yp}H${x + 106}"/>
      ${arrow("f-05-ene", x + 84, yr, x + 84, yp, !up)}
      <path class="d-line" d="M${x + 4} ${base}H${x + 164}"/>
      <text class="d-s" x="${x + 36}" y="158" text-anchor="middle">Reactivos</text><text class="d-s" x="${x + 132}" y="158" text-anchor="middle">Productos</text>
      ${note(x + 84, 186, nota, 160, "d-s", "middle")}`;
  };
  return {
    caption: "Si los productos quedan con **menos** energía, la reacción la libera; si quedan con **más**, la absorbe.",
    svg: fig("f-05-ene", "La reacción libera energía cuando los productos tienen menos, y la absorbe cuando tienen más", 232,
      panel(6, "Libera energía", false, "Combustión: el gas arde y da calor y luz") + `<path class="d-dash" d="M180 8V222"/>` + panel(186, "Absorbe energía", true, "Compresa fría: toma calor y se enfría"), W),
  };
})();

const ecuacion = (() => {
  const cy = 60;
  const h2 = (x) => atom(x, cy, "H", 9) + atom(x + 18, cy, "H", 9);
  const water = (x) => atom(x, cy - 6, "O") + atom(x - 16, cy + 10, "H", 9) + atom(x + 16, cy + 10, "H", 9);
  return {
    caption: "Reactivos y productos tienen los **mismos átomos**, solo reacomodados: la ecuación está balanceada.",
    svg: fig("f-05-ecu", "Ecuación balanceada: dos moléculas de hidrógeno y una de oxígeno forman dos de agua", 160, `
      <text class="d-t" x="86" y="22" text-anchor="middle">Reactivos</text><text class="d-t" x="270" y="22" text-anchor="middle">Productos</text>
      ${h2(22)}${h2(66)}<text class="d-t" x="101" y="${cy + 5}" text-anchor="middle">+</text>${atom(124, cy, "O")}${atom(146, cy, "O")}
      ${arrow("f-05-ecu", 172, cy, 206, cy, true)}
      ${water(240)}${water(304)}
      <text class="d-t" x="180" y="112" text-anchor="middle">2 H₂ + O₂ → 2 H₂O</text>
      <text class="d-s" x="86" y="138" text-anchor="middle">4 H y 2 O</text><text class="d-a" x="180" y="138" text-anchor="middle">=</text><text class="d-s" x="270" y="138" text-anchor="middle">4 H y 2 O</text>`, W),
  };
})();

const conservacion = (() => {
  const panel = (x, title, after, extra, nota, acc) => `<text class="d-t" x="${x + 84}" y="20" text-anchor="middle">${title}</text>
    ${box(x + 10, 32, 148, 50, "Antes", ["100 g"])}${arrow("f-05-con", x + 84, 82, x + 84, 106, acc)}
    ${box(x + 10, 108, 148, 50, "Después", [after], acc ? "d-acc" : "d-box")}
    ${extra ? box(x + 10, 164, 148, 36, "", [extra], "d-box-line") : ""}
    ${note(x + 84, 226, nota, 150, "d-s", "middle")}`;
  return {
    caption: "Si nada entra ni sale, la masa total no cambia. Si un gas escapa, la balanza baja, pero el gas se llevó esos 4 g.",
    svg: fig("f-05-con", "Masa antes y después de una reacción en un sistema cerrado y en uno abierto", 262,
      panel(6, "Sistema cerrado", "100 g", "", "El gas se queda dentro del globo", true) + `<path class="d-dash" d="M180 8V260"/>` + panel(186, "Sistema abierto", "96 g", "+ 4 g de CO₂ afuera", "96 g + 4 g = 100 g: la masa se conservó", false), W),
  };
})();

// The three everyday reactions, side by side.
const tres = {
  caption: "Combustión, oxidación y fermentación: las tres son reacciones químicas, pero cambian el **ritmo** y el **oxígeno** que usan.",
  svg: fig("f-05-tre", "Combustión, oxidación y fermentación comparadas", 214, `
    ${box(6, 8, 108, 40, "Combustión", "", "d-acc")}${box(126, 8, 108, 40, "Oxidación", "")}${box(246, 8, 108, 40, "Fermentación", "")}
    ${note(60, 76, "Combustible + oxígeno", 104, "d-s", "middle")}${note(180, 76, "Hierro + oxígeno + humedad", 104, "d-s", "middle")}${note(300, 76, "Azúcar + levaduras", 104, "d-s", "middle")}
    ${arrow("f-05-tre", 60, 108, 60, 128, true)}${arrow("f-05-tre", 180, 108, 180, 128)}${arrow("f-05-tre", 300, 108, 300, 128)}
    ${note(60, 150, "CO₂ + agua", 104, "d-t", "middle")}${note(180, 150, "Óxido", 104, "d-t", "middle")}${note(300, 150, "Alcohol + CO₂", 104, "d-t", "middle")}
    ${note(60, 182, "Rápida: calor y luz", 104, "d-s", "middle")}${note(180, 182, "Muy lenta: sin llama", 104, "d-s", "middle")}${note(300, 182, "Lenta: burbujas", 104, "d-s", "middle")}`, W),
};

export default { "05-cambios": cambios, "05-azucar-te": azucar, "05-energia": energia, "05-ecuacion": ecuacion, "05-conservacion": conservacion, "05-tres-reacciones": tres };
