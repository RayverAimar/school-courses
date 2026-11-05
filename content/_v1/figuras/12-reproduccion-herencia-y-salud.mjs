import { box, note, fig } from "../../../platform/build/figkit.mjs";

const W = 360;

// A filled shape with its outline.
const ell = (cx, cy, rx, ry, cls = "d-box") => `<ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/><ellipse class="d-line" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
const shp = (d, cls = "d-box") => `<path class="${cls}" d="${d}"/><path class="d-line" d="${d}"/>`;
const arrow = (id, x, y1, y2, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="M${x} ${y1}V${y2}"/>`;

// A column of boxes joined by arrows.
function column(id, label, items, { bw = 300, bh = 56, gap = 30, x = (W - bw) / 2 } = {}) {
  let s = "";
  items.forEach((it, i) => {
    const y = 10 + i * (bh + gap);
    s += box(x, y, bw, bh, it[0], it[1], it[2]);
    if (i < items.length - 1) s += arrow(id, W / 2, y + bh, y + bh + gap, items[i + 1][2] === "d-acc");
  });
  return fig(id, label, 10 + items.length * (bh + gap) - gap + 10, s, W);
}

// Cuadro de Punnett: gametes of one parent on top, of the other on the left.
function punnett(id, label, top, left, hl) {
  const x0 = 150, y0 = 62, cs = 82;
  let s = `${note(W / 2, 20, "Gametos de un progenitor", 300, "d-s", "middle")}`;
  top.forEach((g, i) => (s += `<text class="d-a" x="${x0 + cs * i + cs / 2}" y="${y0 - 14}" text-anchor="middle">${g}</text>`));
  s += `<text class="d-s" transform="rotate(-90 ${x0 - 58} ${y0 + cs})" x="${x0 - 58}" y="${y0 + cs}" text-anchor="middle">Gametos del otro</text>`;
  left.forEach((g, j) => (s += `<text class="d-a" x="${x0 - 18}" y="${y0 + cs * j + cs / 2 + 5}" text-anchor="middle">${g}</text>`));
  top.forEach((a, i) => left.forEach((b, j) => {
    const g = [a, b].sort((p, q) => (p === q ? 0 : p < q ? -1 : 1)).join("");
    s += `${box(x0 + cs * i + 3, y0 + cs * j + 3, cs - 6, cs - 6, g, "", hl(g) ? "d-acc" : "d-box")}`;
  }));
  return fig(id, label, y0 + cs * 2 + 14, s, W);
}

// Moves everything in a piece of SVG up by dy (absolute coordinates only).
function lift(inner, dy) {
  const sh = (n) => +(n - dy).toFixed(1);
  const path = (d) => d.replace(/([MLCQV])([^MLCQVHZ]*)/g, (m, c, rest) => {
    const nums = rest.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (c === "V") return "V" + nums.map(sh).join(" ");
    return c + nums.map((n, i) => (i % 2 ? sh(n) : n)).join(" ");
  });
  return inner
    .replace(/ d="([^"]+)"/g, (m, d) => ` d="${path(d)}"`)
    .replace(/\b(y|cy|y1|y2)="(-?[\d.]+)"/g, (m, a, v) => `${a}="${sh(+v)}"`);
}

const isRec = (g) => g === g.toLowerCase();

export default {
  "12-biparticion": {
    caption: "**Bipartición:** una bacteria crece, copia su ADN y se parte en dos células iguales.",
    svg: fig("f-12-bip", "Una bacteria alargada se divide en dos bacterias iguales: una célula, luego una célula alargada con dos copias de ADN y al final dos células", 150, `
      ${ell(60, 60, 30, 18)}${`<path class="d-flow-acc" d="M52 56c6-6 12-4 16 2s-8 10-14 6"/>`}
      ${note(60, 100, "1. Una célula", 100, "d-s", "middle")}
      <path class="d-flow" marker-end="url(#f-12-bip)" d="M96 60H124"/>
      ${ell(180, 60, 44, 18)}<path class="d-flow-acc" d="M160 56c6-6 12-4 16 2s-8 10-14 6"/><path class="d-flow-acc" d="M188 56c6-6 12-4 16 2s-8 10-14 6"/>
      ${note(180, 100, "2. Copia su ADN y crece", 110, "d-s", "middle")}
      <path class="d-flow" marker-end="url(#f-12-bip)" d="M232 60H258"/>
      ${ell(290, 40, 24, 15)}${ell(290, 82, 24, 15)}
      <path class="d-flow-acc" d="M282 38c4-5 9-3 12 2s-6 7-10 4"/><path class="d-flow-acc" d="M282 80c4-5 9-3 12 2s-6 7-10 4"/>
      ${note(310, 120, "3. Dos células iguales", 100, "d-s", "end")}`, W),
  },

  "12-flor": {
    caption: "Partes de una flor: los **estambres** (antera con polen) son la parte masculina y el **pistilo** (estigma, estilo y ovario) es la parte femenina.",
    svg: fig("f-12-flor", "Dibujo de una flor cortada: pétalos a los lados, estambres con antera, pistilo con estigma, estilo y ovario con óvulos, y sépalos en la base", 232, lift(`
      ${shp("M168 246C108 238 78 160 100 90C140 112 166 168 170 236Z")}
      ${shp("M192 246C252 238 282 160 260 90C220 112 194 168 190 236Z")}
      <path class="d-line" d="M180 290V250"/>
      ${shp("M170 266C140 266 128 254 130 244C150 248 164 254 170 266Z", "d-fill-hair")}
      ${shp("M190 266C220 266 232 254 230 244C210 248 196 254 190 266Z", "d-fill-hair")}
      <path class="d-flow" d="M164 236L142 160"/>${ell(139, 150, 7, 12, "d-fill-hair")}
      <path class="d-flow" d="M196 236L218 160"/>${ell(221, 150, 7, 12, "d-fill-hair")}
      <path class="d-flow" d="M180 214V128"/>${ell(180, 120, 12, 8, "d-fill-acc")}
      ${ell(180, 232, 22, 24)}
      <circle class="d-fill-acc" cx="173" cy="236" r="4"/><circle class="d-fill-acc" cx="187" cy="236" r="4"/><circle class="d-fill-acc" cx="180" cy="224" r="4"/>
      <path class="d-line" d="M66 106L92 112"/>${note(58, 100, "Pétalo", 54, "d-s", "end")}
      <path class="d-line" d="M136 262L100 270"/>${note(94, 276, "Sépalo", 54, "d-s", "end")}
      <path class="d-line" d="M192 120H280"/>${note(284, 124, "Estigma", 72, "d-a")}
      <path class="d-line" d="M228 150H280"/>${note(284, 154, "Antera", 72, "d-s")}
      ${note(284, 170, "(con polen)", 72, "d-s")}
      <path class="d-line" d="M184 190H280"/>${note(284, 194, "Estilo", 72, "d-s")}
      <path class="d-line" d="M202 236H280"/>${note(284, 240, "Ovario", 72, "d-a")}
      ${note(284, 256, "(con óvulos)", 72, "d-s")}`, 66), W),
  },

  "12-polinizacion": {
    caption: "De la polinización al fruto: el **polen** llega al estigma y, si fecunda al óvulo, la flor da **semillas** dentro de un **fruto**.",
    svg: column("f-12-pol", "Cuatro pasos: el polen llega al estigma, forma un tubito, fecunda al óvulo, y el ovario se convierte en fruto con semillas", [
      ["1. Polinización", "El polen pasa de la antera al estigma"],
      ["2. Tubo polínico", "El polen forma un tubito que baja por el estilo"],
      ["3. Fecundación", "Una célula del polen se une al óvulo", "d-acc"],
      ["4. Fruto y semilla", "El ovario forma el fruto; cada óvulo, una semilla"],
    ], { bh: 66, gap: 24 }),
  },

  "12-fecundacion-embarazo": {
    caption: "Del óvulo y el espermatozoide al bebé: la fecundación junta **23 + 23 = 46 cromosomas** en la primera célula, el cigoto.",
    svg: column("f-12-fec", "Un óvulo con 23 cromosomas y un espermatozoide con 23 forman un cigoto con 46, que se convierte en embrión, feto y bebé", [
      ["Óvulo + espermatozoide", "23 cromosomas cada uno"],
      ["Cigoto (fecundación)", "Primera célula: 46 cromosomas", "d-acc"],
      ["Embrión", "Se divide y se fija al útero"],
      ["Feto", "Crece y forma sus órganos"],
      ["Nacimiento", "Tras unas 40 semanas de embarazo"],
    ], { bh: 52, gap: 22 }),
  },

  "12-aparato-femenino": {
    caption: "Aparato reproductor femenino (esquema): el **ovario** produce los óvulos; la fecundación ocurre en la **trompa**; el bebé crece en el **útero**.",
    svg: fig("f-12-fem", "Esquema del aparato reproductor femenino visto de frente: dos ovarios, dos trompas de Falopio, el útero y la vagina", 290, `
      ${shp("M150 110C150 76 210 76 210 110C210 150 196 170 190 190H170C164 170 150 150 150 110Z")}
      <path class="d-flow" d="M156 100C130 80 110 84 96 96"/><path class="d-flow" d="M204 100C230 80 250 84 264 96"/>
      ${ell(86, 112, 18, 24, "d-acc")}${ell(274, 112, 18, 24, "d-acc")}
      ${shp("M172 190H188V250H172Z")}
      <path class="d-line" d="M68 90L40 70"/>${note(8, 58, "Ovario", 80, "d-a")}
      <path class="d-line" d="M120 84L70 40"/>${note(24, 34, "Trompa de Falopio", 130, "d-s")}
      <path class="d-line" d="M214 136L290 170"/>${note(246, 190, "Útero", 80, "d-a")}
      <path class="d-line" d="M190 230L240 240"/>${note(244, 244, "Vagina", 80, "d-s")}`, W),
  },

  "12-aparato-masculino": {
    caption: "Aparato reproductor masculino (esquema): los **testículos** producen los espermatozoides, que salen por los conductos y la **uretra**.",
    svg: fig("f-12-mas", "Esquema del aparato reproductor masculino visto de frente: vejiga, próstata, conductos deferentes, testículos y uretra dentro del pene", 290, `
      ${ell(180, 54, 26, 24)}
      ${shp("M168 100C168 90 192 90 192 100V112C192 122 168 122 168 112Z", "d-acc")}
      <path class="d-flow" d="M180 78V100"/>
      ${shp("M172 122H188V240H172Z")}
      <path class="d-flow" d="M180 122V236"/>
      <path class="d-flow" d="M168 106C130 100 128 150 132 176"/><path class="d-flow" d="M192 106C230 100 232 150 228 176"/>
      ${ell(132, 204, 20, 30, "d-acc")}${ell(228, 204, 20, 30, "d-acc")}
      <path class="d-line" d="M154 54H84"/>${note(80, 58, "Vejiga", 60, "d-s", "end")}
      <path class="d-line" d="M168 108L92 100"/>${note(88, 104, "Próstata", 70, "d-s", "end")}
      <path class="d-line" d="M130 150H70"/>${note(66, 152, "Conducto", 60, "d-s", "end")}
      ${note(66, 168, "deferente", 60, "d-s", "end")}
      <path class="d-line" d="M248 204H288"/>${note(292, 200, "Testículo", 66, "d-a")}
      <path class="d-line" d="M190 236H288"/>${note(292, 240, "Uretra", 66, "d-s")}`, W),
  },

  "12-adn-cromosomas": {
    caption: "De la célula al gen: cada célula tiene un núcleo; el núcleo guarda los cromosomas; cada cromosoma es ADN enrollado; y el ADN se lee por tramos llamados genes.",
    svg: column("f-12-adn", "Esquema que va de la célula al núcleo, a los 46 cromosomas, al ADN y al gen", [
      ["Célula", "La unidad básica de todo ser vivo"],
      ["Núcleo", "Guarda el material genético"],
      ["46 cromosomas", "23 pares en las células del cuerpo humano"],
      ["ADN", "Molécula con forma de doble hélice"],
      ["Gen", "Tramo de ADN con una instrucción", "d-acc"],
    ], { bh: 50, gap: 20 }),
  },

  "12-mitosis-meiosis": {
    caption: "**Mitosis:** 1 célula de 46 cromosomas da 2 iguales de 46. **Meiosis:** 1 célula de 46 da 4 gametos de 23.",
    svg: fig("f-12-mm", "Dos esquemas: la mitosis convierte una célula de 46 cromosomas en dos células de 46; la meiosis convierte una célula de 46 en cuatro gametos de 23", 350, `
      ${note(90, 20, "Mitosis", 150, "d-a", "middle")}${note(270, 20, "Meiosis", 150, "d-a", "middle")}
      <path class="d-dash" d="M180 8V330"/>
      ${ell(90, 62, 26, 26, "d-acc")}<text class="d-t" x="90" y="67" text-anchor="middle">46</text>
      ${ell(270, 62, 26, 26, "d-acc")}<text class="d-t" x="270" y="67" text-anchor="middle">46</text>
      ${arrow("f-12-mm", 90, 92, 130)}${note(100, 116, "1 división", 90, "d-s")}
      ${arrow("f-12-mm", 270, 92, 130)}${note(260, 116, "2 divisiones", 90, "d-s", "end")}
      ${ell(62, 160, 24, 24)}<text class="d-t" x="62" y="165" text-anchor="middle">46</text>
      ${ell(118, 160, 24, 24)}<text class="d-t" x="118" y="165" text-anchor="middle">46</text>
      ${ell(204, 160, 17, 17)}<text class="d-t" x="204" y="165" text-anchor="middle">23</text>
      ${ell(248, 160, 17, 17)}<text class="d-t" x="248" y="165" text-anchor="middle">23</text>
      ${ell(292, 160, 17, 17)}<text class="d-t" x="292" y="165" text-anchor="middle">23</text>
      ${ell(336, 160, 17, 17)}<text class="d-t" x="336" y="165" text-anchor="middle">23</text>
      ${note(90, 214, "2 células iguales a la original", 150, "d-s", "middle")}
      ${note(270, 214, "4 células distintas, con la mitad de cromosomas", 150, "d-s", "middle")}
      ${note(90, 280, "Sirve para crecer y reparar tejidos", 150, "d-a", "middle")}
      ${note(270, 280, "Sirve para formar gametos (óvulos y espermatozoides)", 150, "d-a", "middle")}`, W),
  },

  "12-cruce-mendel": {
    caption: "El cruce de Mendel: dos plantas puras (alta TT y baja tt) dan una F1 toda alta (Tt); al cruzar la F1 entre sí aparece 1 baja por cada 3 altas.",
    svg: fig("f-12-cru", "Cruce de arvejas: padres puros alto TT y bajo tt, hijos de la primera generación todos Tt y altos, y en la segunda generación tres altos por uno bajo", 330, `
      ${note(W / 2, 18, "Padres (puros)", 200, "d-a", "middle")}
      ${box(40, 28, 120, 46, "Alta: TT", "")}${box(200, 28, 120, 46, "Baja: tt", "", "d-acc")}
      <text class="d-t" x="180" y="57" text-anchor="middle">×</text>
      ${arrow("f-12-cru", 180, 80, 112)}
      ${note(W / 2, 132, "Primera generación (F1)", 200, "d-a", "middle")}
      ${box(90, 142, 180, 46, "Todas Tt: altas", "")}
      ${arrow("f-12-cru", 180, 194, 226)}
      ${note(190, 214, "Se cruzan entre sí", 150, "d-s")}
      ${note(W / 2, 246, "Segunda generación (F2)", 200, "d-a", "middle")}
      ${box(10, 256, 78, 48, "TT", "alta")}${box(96, 256, 78, 48, "Tt", "alta")}${box(182, 256, 78, 48, "Tt", "alta")}${box(268, 256, 82, 48, "tt", "baja", "d-acc")}
      ${note(W / 2, 324, "3 altas : 1 baja", 200, "d-a", "middle")}`, W),
  },

  "12-punnett": {
    caption: "Cuadro de Punnett de Tt × Tt: de 4 casillas, 3 tienen al menos una T (planta alta) y 1 es tt (planta baja).",
    svg: punnett("f-12-pun", "Cuadro de Punnett del cruce Tt por Tt: casillas TT, Tt, Tt y tt", ["T", "t"], ["T", "t"], isRec),
  },

  "12-punnett-prueba": {
    caption: "Cuadro de Punnett de Tt × tt: la mitad de los descendientes son Tt y la otra mitad, tt.",
    svg: punnett("f-12-prb", "Cuadro de Punnett del cruce Tt por tt: dos casillas Tt y dos casillas tt", ["T", "t"], ["t", "t"], isRec),
  },

  "12-vacuna": {
    caption: "Cómo protege una vacuna: entrena al sistema inmune **sin** causar la enfermedad.",
    svg: column("f-12-vac", "Tres pasos: la vacuna muestra una parte o una versión inofensiva del microbio, el cuerpo fabrica anticuerpos y células de memoria, y si llega el microbio real responde rápido", [
      ["1. Se aplica la vacuna", "Microbio debilitado o muerto, o solo un trozo"],
      ["2. El cuerpo reacciona", "Fabrica anticuerpos y células de memoria", "d-acc"],
      ["3. Llega el microbio real", "Las defensas lo reconocen y responden rápido"],
    ], { bh: 70, gap: 28 }),
  },

  "12-aedes-ciclo": {
    caption: "El zancudo *Aedes aegypti* se cría en agua limpia y quieta: baldes, llantas, floreros, cilindros sin tapa.",
    svg: fig("f-12-aed", "Ciclo del zancudo Aedes aegypti: huevo, larva, pupa y zancudo adulto, que pone huevos de nuevo en agua almacenada", 262, `
      ${box(10, 14, 150, 70, "Huevo", "pegado a la pared del balde")}
      ${box(200, 14, 150, 70, "Larva", "vive en el agua")}
      ${box(200, 144, 150, 70, "Pupa", "sigue en el agua")}
      ${box(10, 144, 150, 70, "Zancudo adulto", "la hembra pica y pone huevos", "d-acc")}
      <path class="d-flow" marker-end="url(#f-12-aed)" d="M160 49H200"/>
      <path class="d-flow" marker-end="url(#f-12-aed)" d="M275 84V144"/>
      <path class="d-flow" marker-end="url(#f-12-aed)" d="M200 179H160"/>
      <path class="d-flow-acc" marker-end="url(#f-12-aeda)" d="M85 144V84"/>
      ${note(W / 2, 244, "Dura entre 7 y 10 días", 300, "d-s", "middle")}`, W),
  },
};
