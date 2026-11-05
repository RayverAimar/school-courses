import { box, note, fig, chain } from "../../platform/build/figkit.mjs";

const W = 360;

// A filled shape with its outline.
const solid = (cls) => /^d-(fill-[1-6]|obj|water)$/.test(cls);
const ell = (cx, cy, rx, ry, cls = "d-box") => `<ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>${solid(cls) ? "" : `<ellipse class="d-line" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`}`;
const shp = (d, cls = "d-box") => `<path class="${cls}" d="${d}"/>${solid(cls) ? "" : `<path class="d-line" d="${d}"/>`}`;
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


export default {
  "12-biparticion": {
    caption: "**Bipartición:** una bacteria crece, copia su ADN y se parte en dos células iguales.",
    svg: fig("f-12-bip", "Una bacteria alargada se divide en dos bacterias iguales: una célula, luego una célula alargada con dos copias de ADN y al final dos células", 150, `
      ${ell(60, 60, 30, 18, "d-fill-3")}${`<path class="d-stroke-4" d="M52 56c6-6 12-4 16 2s-8 10-14 6"/>`}
      ${note(60, 100, "1. Una célula", 100, "d-s", "middle")}
      <path class="d-flow" marker-end="url(#f-12-bip)" d="M96 60H124"/>
      ${ell(180, 60, 44, 18, "d-fill-3")}<path class="d-stroke-4" d="M160 56c6-6 12-4 16 2s-8 10-14 6"/><path class="d-stroke-4" d="M188 56c6-6 12-4 16 2s-8 10-14 6"/>
      ${note(180, 100, "2. Copia su ADN y crece", 110, "d-s", "middle")}
      <path class="d-flow" marker-end="url(#f-12-bip)" d="M232 60H258"/>
      ${ell(290, 40, 24, 15, "d-fill-3")}${ell(290, 82, 24, 15, "d-fill-3")}
      <path class="d-stroke-4" d="M282 38c4-5 9-3 12 2s-6 7-10 4"/><path class="d-stroke-4" d="M282 80c4-5 9-3 12 2s-6 7-10 4"/>
      ${note(310, 120, "3. Dos células iguales", 100, "d-s", "end")}`, W),
  },
  "12-flor": {
    caption: "Partes de una flor: los **estambres** (antera con polen) son la parte masculina y el **pistilo** (estigma, estilo y ovario) es la parte femenina.",
    svg: fig("f-12-flor", "Dibujo de una flor cortada: pétalos a los lados, estambres con antera, pistilo con estigma, estilo y ovario con óvulos, y sépalos en la base", 232, lift(`
      ${shp("M168 246C108 238 78 160 100 90C140 112 166 168 170 236Z", "d-fill-5")}
      ${shp("M192 246C252 238 282 160 260 90C220 112 194 168 190 236Z", "d-fill-5")}
      <path class="d-line" d="M180 290V250"/>
      ${shp("M170 266C140 266 128 254 130 244C150 248 164 254 170 266Z", "d-fill-3")}
      ${shp("M190 266C220 266 232 254 230 244C210 248 196 254 190 266Z", "d-fill-3")}
      <path class="d-flow" d="M164 236L142 160"/>${ell(139, 150, 7, 12, "d-fill-6")}
      <path class="d-flow" d="M196 236L218 160"/>${ell(221, 150, 7, 12, "d-fill-6")}
      <path class="d-flow" d="M180 214V128"/>${ell(180, 120, 12, 8, "d-fill-4")}
      ${ell(180, 232, 22, 24, "d-fill-3")}
      <circle class="d-fill-6" cx="173" cy="236" r="4"/><circle class="d-fill-6" cx="187" cy="236" r="4"/><circle class="d-fill-6" cx="180" cy="224" r="4"/>
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
    caption: "Del óvulo y el espermatozoide al bebé: la **fecundación** une los dos gametos en una primera célula, el **cigoto**.",
    svg: column("f-12-fec", "Un óvulo y un espermatozoide forman un cigoto, que se convierte en embrión, feto y bebé", [
      ["Óvulo + espermatozoide", "los dos gametos"],
      ["Cigoto (fecundación)", "primera célula del nuevo ser", "d-acc"],
      ["Embrión", "Se divide y se fija al útero"],
      ["Feto", "Crece y forma sus órganos"],
      ["Nacimiento", "Tras unas 40 semanas de embarazo"],
    ], { bh: 52, gap: 22 }),
  },
  "12-aparato-femenino": {
    caption: "Aparato reproductor femenino (esquema): el **ovario** produce los óvulos; la fecundación ocurre en la **trompa**; el bebé crece en el **útero**.",
    svg: fig("f-12-fem", "Esquema del aparato reproductor femenino visto de frente: dos ovarios, dos trompas de Falopio, el útero y la vagina", 290, `
      ${shp("M150 110C150 76 210 76 210 110C210 150 196 170 190 190H170C164 170 150 150 150 110Z", "d-fill-5")}
      <path class="d-flow" d="M156 100C130 80 110 84 96 96"/><path class="d-flow" d="M204 100C230 80 250 84 264 96"/>
      ${ell(86, 112, 18, 24, "d-fill-2")}${ell(274, 112, 18, 24, "d-fill-2")}
      ${shp("M172 190H188V250H172Z", "d-fill-5")}
      <path class="d-line" d="M68 90L40 70"/>${note(8, 58, "Ovario", 80, "d-a")}
      <path class="d-line" d="M120 84L70 40"/>${note(24, 34, "Trompa de Falopio", 130, "d-s")}
      <path class="d-line" d="M214 136L290 170"/>${note(246, 190, "Útero", 80, "d-a")}
      <path class="d-line" d="M190 230L240 240"/>${note(244, 244, "Vagina", 80, "d-s")}`, W),
  },
  "12-aparato-masculino": {
    caption: "Aparato reproductor masculino (esquema): los **testículos** producen los espermatozoides, que salen por los conductos y la **uretra**.",
    svg: fig("f-12-mas", "Esquema del aparato reproductor masculino visto de frente: vejiga, próstata, conductos deferentes, testículos y uretra dentro del pene", 290, `
      ${ell(180, 54, 26, 24, "d-fill-6")}
      ${shp("M168 100C168 90 192 90 192 100V112C192 122 168 122 168 112Z", "d-fill-4")}
      <path class="d-flow" d="M180 78V100"/>
      ${shp("M172 122H188V240H172Z", "d-fill-5")}
      <path class="d-flow" d="M180 122V236"/>
      <path class="d-flow" d="M168 106C130 100 128 150 132 176"/><path class="d-flow" d="M192 106C230 100 232 150 228 176"/>
      ${ell(132, 204, 20, 30, "d-fill-2")}${ell(228, 204, 20, 30, "d-fill-2")}
      <path class="d-line" d="M154 54H84"/>${note(80, 58, "Vejiga", 60, "d-s", "end")}
      <path class="d-line" d="M168 108L92 100"/>${note(88, 104, "Próstata", 70, "d-s", "end")}
      <path class="d-line" d="M130 150H70"/>${note(66, 152, "Conducto", 60, "d-s", "end")}
      ${note(66, 168, "deferente", 60, "d-s", "end")}
      <path class="d-line" d="M248 204H288"/>${note(292, 200, "Testículo", 66, "d-a")}
      <path class="d-line" d="M190 236H288"/>${note(292, 240, "Uretra", 66, "d-s")}`, W),
  },
  "12-neurona": {
    caption: "Una neurona recibe señales por las dendritas, las envía por el axón y las pasa a la siguiente por sus terminales.",
    svg: fig("f-12-nu", "Esquema de una neurona: dendritas a la izquierda, cuerpo celular con núcleo, un axón largo con vainas de mielina y terminales a la derecha", 236, `
      <path class="d-flow" d="M8 40L42 70M8 100L42 78M12 70L42 74M10 128L40 86"/>
      <circle class="d-fill-4" cx="62" cy="76" r="24"/>
      <circle class="d-obj" cx="62" cy="76" r="8"/>
      <path class="d-flow" d="M86 76H320"/>
      ${[110, 170, 230].map((x) => `<rect class="d-fill-6" x="${x}" y="68" width="42" height="16" rx="8"/>`).join("")}
      <path class="d-flow" d="M320 76L346 52M320 76L348 76M320 76L346 100"/>
      <path class="d-flow-acc" marker-end="url(#f-12-nua)" d="M110 152H260"/>
      ${note(184, 174, "La señal viaja en este sentido", 220, "d-a", "middle")}
      ${note(8, 20, "Dendritas", 100, "d-s")}
      ${note(86, 136, "Cuerpo celular", 100, "d-s", "middle")}
      ${note(186, 52, "Axón con mielina", 140, "d-s", "middle")}
      ${note(300, 124, "Terminales", 100, "d-s", "middle")}
      ${note(180, 204, "Se comunican entre sí sin tocarse, por mensajeros químicos.", 340, "d-s", "middle")}`, W),
  },
  "12-arco-reflejo": {
    caption: "Arco reflejo: la médula decide por sí sola y el músculo responde antes de que el cerebro se entere.",
    svg: fig("f-12-ar", "Esquema del arco reflejo: el receptor de la piel envía la señal por la neurona sensitiva a la médula espinal, la neurona motora la lleva al músculo, y el cerebro se entera después", 350, `
      ${box(8, 10, 140, 56, "Receptor", "piel: siente el calor")}
      ${box(212, 10, 140, 56, "Efector", "músculo: se retira")}
      ${box(70, 150, 220, 56, "Médula espinal", "decide la respuesta", "d-acc")}
      <path class="d-flow-acc" marker-end="url(#f-12-ara)" d="M96 66V150"/>
      <path class="d-flow-acc" marker-end="url(#f-12-ara)" d="M264 150V66"/>
      ${note(4, 104, "Neurona sensitiva", 88, "d-s")}
      ${note(272, 104, "Neurona motora", 88, "d-s")}
      <path class="d-dash" marker-end="url(#f-12-ar)" d="M180 206V262"/>
      ${box(70, 266, 220, 56, "Cerebro", "se entera después: duele", "d-box-line")}`, W),
  },
  "12-estimulo-respuesta": {
    caption: "Todo ser vivo coordina igual: un **estímulo** es detectado, algo **decide** y un **efector** produce la respuesta.",
    svg: column("f-12-est", "Cinco pasos: estímulo, receptor, centro de coordinación, efector y respuesta", [
      ["Estímulo", "un cambio del ambiente"],
      ["Receptor", "lo detecta (piel, ojo, membrana)"],
      ["Coordinación", "procesa y decide", "d-acc"],
      ["Efector", "músculo, glándula, pestañas"],
      ["Respuesta", "retirarse, crecer, acercarse"],
    ], { bh: 46, gap: 22 }),
  },

  "12-tropismos": {
    caption: "Los **tropismos**: el tallo se curva hacia la **luz** y, con la **gravedad**, el tallo sube y la raíz baja.",
    svg: fig("f-12-tro", "Dos esquemas: una planta cuyo tallo se curva hacia el sol, y una semilla cuyo tallo crece hacia arriba y su raíz hacia abajo", 262, `
      <circle class="d-fill-6" cx="136" cy="34" r="16"/>
      <path class="d-flow-acc" marker-end="url(#f-12-troa)" d="M120 52L92 84"/>
      <rect class="d-fill-2" x="10" y="176" width="150" height="28" rx="4"/>
      <path class="d-stroke-3" stroke-width="5" stroke-linecap="round" d="M70 176C70 150 74 120 100 96"/>
      <ellipse class="d-fill-3" cx="90" cy="130" rx="14" ry="7" transform="rotate(-40 90 130)"/>
      <ellipse class="d-fill-3" cx="104" cy="100" rx="14" ry="7" transform="rotate(-50 104 100)"/>
      ${note(85, 228, "Fototropismo", 150, "d-a", "middle")}
      ${note(85, 246, "el tallo va hacia la luz", 160, "d-s", "middle")}
      <rect class="d-fill-2" x="196" y="104" width="150" height="30" rx="4"/>
      <path class="d-stroke-3" stroke-width="5" stroke-linecap="round" d="M271 104V44"/>
      <ellipse class="d-fill-3" cx="256" cy="62" rx="14" ry="7" transform="rotate(30 256 62)"/>
      <ellipse class="d-fill-3" cx="286" cy="54" rx="14" ry="7" transform="rotate(-30 286 54)"/>
      <path class="d-stroke-2" stroke-width="4" stroke-linecap="round" d="M271 134V190M271 150L246 172M271 160L298 182"/>
      <path class="d-flow" marker-end="url(#f-12-tro)" d="M206 146V184"/>
      ${note(178, 204, "gravedad", 70, "d-s")}
      ${note(271, 228, "Geotropismo", 150, "d-a", "middle")}
      ${note(271, 246, "raíz abajo, tallo arriba", 160, "d-s", "middle")}`, W),
  },

  "12-insulina": {
    caption: "La insulina mantiene la glucosa de la sangre en su nivel normal.",
    svg: (() => {
      const c = chain("f-12-in", [
        ["Comes y sube la glucosa en la sangre", ""],
        ["El páncreas libera insulina", "una hormona", "d-acc"],
        ["Las células toman glucosa de la sangre", ""],
        ["La glucosa baja a su nivel normal", ""],
      ], { per: 1, ch: 52, gap: 26, W, y0: 8, m: 20 });
      return fig("f-12-in", "Esquema: al comer sube la glucosa, el páncreas libera insulina, las células toman la glucosa y la glucosa baja a su nivel normal", c.h + 56, `${c.svg}
        ${note(180, c.h + 6, "En la diabetes falta insulina o no funciona bien: la glucosa se queda alta en la sangre.", 320, "d-a", "middle")}`, W);
    })(),
  },
};
