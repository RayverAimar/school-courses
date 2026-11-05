// Figures of "Ecosistemas y biodiversidad". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, chain } from "../../../platform/build/figkit.mjs";

const W = 360;

const dots = (list, cls = "d-fill-acc") => list.map(([x, y]) => `<circle class="${cls}" cx="${x}" cy="${y}" r="5"/>`).join("");

// A straight arrow from (x1, y1) to (x2, y2); the marker belongs to figure `id`.
const arrow = (id, d, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="${d}"/>`;

const nested = () => {
  const id = "f-13-niv";
  return fig(id, "Cuatro niveles dentro de un ecosistema del mar: los individuos forman poblaciones, las poblaciones forman la comunidad, y la comunidad más los factores no vivos forman el ecosistema", 298, `
    <rect class="d-box-line" x="6" y="6" width="348" height="284" rx="12"/>
    <text class="d-a" x="18" y="28">Ecosistema: el mar peruano</text>
    <rect class="d-box" x="16" y="40" width="328" height="196" rx="10"/>
    <text class="d-t" x="28" y="62">Comunidad: todas las poblaciones</text>
    <rect class="d-acc" x="26" y="74" width="150" height="104" rx="8"/>
    <text class="d-t" x="36" y="96">Población</text>
    <text class="d-s" x="36" y="112">de anchovetas</text>
    ${dots([[48, 138], [78, 150], [108, 136], [138, 152], [60, 164], [96, 166], [150, 130]])}
    <rect class="d-acc" x="186" y="74" width="148" height="104" rx="8"/>
    <text class="d-t" x="196" y="96">Población</text>
    <text class="d-s" x="196" y="112">de lobos marinos</text>
    ${dots([[214, 144], [250, 156], [286, 140], [226, 166]])}
    ${note(180, 206, "Cada punto es un individuo", 300, "d-s", "middle")}
    ${note(18, 262, "Más los factores no vivos: agua, sal, luz y temperatura", 322, "d-s")}`, W);
};

const redMar = () => {
  const id = "f-13-mar";
  return fig(id, "Red alimenticia del mar peruano: el fitoplancton alimenta al zooplancton y a la anchoveta; la anchoveta alimenta al lobo marino y al piquero; el lobo marino alimenta a la orca", 408, `
    ${box(20, 6, 150, 48, "Orca", "consumidor 4.°", "d-box")}
    ${box(20, 92, 150, 48, "Lobo marino", "consumidor 3.°", "d-box")}
    ${box(190, 92, 150, 48, "Piquero peruano", "consumidor 3.°", "d-box")}
    ${box(20, 178, 160, 48, "Anchoveta", "consumidor 2.°", "d-box")}
    ${box(200, 264, 140, 48, "Zooplancton", "consumidor 1.°", "d-box")}
    ${box(60, 350, 200, 48, "Fitoplancton", "productor", "d-acc")}
    ${arrow(id, "M95 92V58")}
    ${arrow(id, "M60 178V144")}
    ${arrow(id, "M150 178L232 144")}
    ${arrow(id, "M255 264L170 230")}
    ${arrow(id, "M80 350V230", true)}
    ${arrow(id, "M230 350L260 316", true)}
    ${note(190, 22, "Las flechas van de lo que es comido hacia quien se lo come.", 160, "d-s")}`, W);
};

const redPuna = () => {
  const id = "f-13-puna";
  return fig(id, "Red alimenticia de la puna: el ichu alimenta a la vicuña y a la vizcacha; la vicuña y la vizcacha alimentan al puma; la vizcacha también alimenta al zorro andino", 276, `
    ${box(20, 8, 150, 52, "Puma", "carnívoro", "d-box")}
    ${box(190, 8, 150, 52, "Zorro andino", "carnívoro", "d-box")}
    ${box(20, 106, 150, 52, "Vicuña", "herbívoro", "d-box")}
    ${box(190, 106, 150, 52, "Vizcacha", "herbívoro", "d-box")}
    ${box(100, 204, 160, 52, "Ichu", "productor", "d-acc")}
    ${arrow(id, "M95 106V64")}
    ${arrow(id, "M215 106L150 64")}
    ${arrow(id, "M265 106V64")}
    ${arrow(id, "M130 204L95 162", true)}
    ${arrow(id, "M230 204L265 162", true)}`, W);
};

const cadenaPuna = () => {
  const c = chain("f-13-cp", [
    ["Ichu", "productor"],
    ["Vicuña", "consumidor 1.°", "d-acc"],
    ["Puma", "consumidor 2.°"],
    ["Hongos y bacterias", "descomponedores"],
  ], { per: 2, ch: 66, gap: 30, m: 8, W });
  return fig("f-13-cp", "Cadena alimenticia de la puna: el ichu es comido por la vicuña, la vicuña por el puma, y al morir todos son descompuestos por hongos y bacterias", c.h, c.svg, W);
};

const piramide = () => {
  const id = "f-13-pir";
  const tier = (w, y, t, s, cls) => box(180 - w / 2, y, w, 52, t, s, cls);
  return fig(id, "Pirámide de energía: el fitoplancton tiene 10 000 kilocalorías, el zooplancton 1 000, la anchoveta 100 y el lobo marino 10; cada nivel recibe un décimo del anterior", 262, `
    ${tier(120, 6, "Lobo marino", "10 kcal", "d-box")}
    ${tier(180, 62, "Anchoveta", "100 kcal", "d-box")}
    ${tier(240, 118, "Zooplancton", "1 000 kcal", "d-box")}
    ${tier(304, 174, "Fitoplancton", "10 000 kcal", "d-acc")}
    ${note(180, 252, "Cada nivel recibe solo el 10 % del de abajo", 340, "d-s", "middle")}`, W);
};

const agua = () => {
  const c = chain("f-13-ag", [
    ["Evaporación", "el Sol calienta el mar y los ríos; las plantas transpiran"],
    ["Condensación", "el vapor sube, se enfría y forma nubes"],
    ["Precipitación", "lluvia, granizo o nieve"],
    ["Escorrentía", "el agua baja por ríos y suelo hacia el mar"],
  ], { per: 2, ch: 98, gap: 34, m: 6, W, closing: true });
  return fig("f-13-ag", "Ciclo del agua en cuatro pasos: evaporación, condensación, precipitación y escorrentía, que vuelve al mar", c.h, c.svg, W);
};

const carbono = () => {
  const c = chain("f-13-ca", [
    ["CO₂ del aire", "gas que sale al respirar y al quemar"],
    ["Plantas y algas", "fotosíntesis: toman CO₂ y hacen azúcar", "d-acc"],
    ["Animales", "comen plantas y pasan el carbono"],
    ["Respiración y descomposición", "devuelven CO₂ al aire"],
  ], { per: 2, ch: 98, gap: 34, m: 6, W, closing: true });
  return fig("f-13-ca", "Ciclo del carbono: el dióxido de carbono del aire lo toman las plantas en la fotosíntesis, pasa a los animales al comer, y la respiración y la descomposición lo devuelven al aire", c.h, c.svg, W);
};

const nitrogeno = () => {
  const c = chain("f-13-ni", [
    ["N₂ del aire", "78 % del aire; las plantas no lo pueden usar"],
    ["Bacterias fijadoras", "en raíces de frejol o tarwi lo vuelven nitratos"],
    ["Plantas y animales", "con nitrato hacen proteínas; los animales comen plantas"],
    ["Descomponedores", "devuelven amonio al suelo; otras bacterias liberan N₂"],
  ], { per: 2, ch: 112, gap: 34, m: 6, W, closing: true });
  return fig("f-13-ni", "Ciclo del nitrógeno: el nitrógeno del aire lo convierten bacterias en nitratos, las plantas hacen proteínas, los animales las comen y los descomponedores devuelven nitrógeno al suelo y al aire", c.h, c.svg, W);
};

const afloramiento = () => {
  const id = "f-13-af";
  return fig(id, "Corte del mar peruano: el viento empuja el agua de la superficie lejos de la costa y sube agua fría rica en nutrientes", 252, `
    <rect class="d-box" x="6" y="64" width="270" height="130" rx="6"/>
    <path class="d-fill-hair" d="M276 64H352V194H276Z"/>
    ${note(314, 134, "Costa", 60, "d-s", "middle")}
    ${arrow(id, "M262 30H150", true)}
    ${note(140, 34, "Viento", 120, "d-a", "end")}
    ${arrow(id, "M262 84H150")}
    ${note(140, 88, "Agua de la superficie", 130, "d-s", "end")}
    ${arrow(id, "M250 188V100", true)}
    ${note(16, 132, "Agua profunda: fría y rica en nutrientes", 190, "d-s")}
    ${note(180, 222, "Con luz y nutrientes crece el fitoplancton, la base de la red del mar", 340, "d-s", "middle")}`, W);
};

const perfil = () =>
  fig("f-13-pf", "Perfil del Perú de oeste a este: el mar, la costa desértica, los Andes con el Huascarán de 6 768 metros, la selva alta y la selva baja", 276, `
    <rect class="d-box" x="4" y="150" width="70" height="80" rx="4"/>
    <text class="d-s" x="39" y="196" text-anchor="middle">Mar</text>
    <path class="d-acc" d="M74 190L88 184L104 168L132 122L158 84L185 66L214 96L246 150L270 186L286 194H352V230H74Z"/>
    <text class="d-t" x="185" y="52" text-anchor="middle">Huascarán 6 768 m</text>
    <text class="d-s" x="104" y="254" text-anchor="middle">Costa</text>
    <text class="d-s" x="170" y="254" text-anchor="middle">Sierra y puna</text>
    <text class="d-s" x="248" y="254" text-anchor="middle">Selva alta</text>
    <text class="d-s" x="314" y="270" text-anchor="middle">Selva baja</text>`, W);

const nino = () =>
  fig("f-13-nn", "Comparación entre un año normal y un año de El Niño en el mar peruano", 250, `
    <rect class="d-box" x="6" y="8" width="168" height="232" rx="10"/>
    <text class="d-t" x="90" y="32" text-anchor="middle">Año normal</text>
    ${note(90, 70, "Viento fuerte empuja el agua de la superficie", 144, "d-s", "middle")}
    ${note(90, 128, "Mucho afloramiento: agua fría y con nutrientes", 144, "d-s", "middle")}
    ${note(90, 190, "Mucho fitoplancton y mucha anchoveta", 144, "d-a", "middle")}
    <rect class="d-acc" x="186" y="8" width="168" height="232" rx="10"/>
    <text class="d-a" x="270" y="32" text-anchor="middle">Año de El Niño</text>
    ${note(270, 70, "El viento se debilita y llega agua cálida a la costa", 144, "d-s", "middle")}
    ${note(270, 128, "Poco afloramiento: el agua trae pocos nutrientes", 144, "d-s", "middle")}
    ${note(270, 190, "Poco fitoplancton; la anchoveta se aleja o muere", 144, "d-a", "middle")}`, W);

const mercurio = () => {
  const c = chain("f-13-hg", [
    ["Minería ilegal", "usa mercurio para juntar el oro", "d-acc"],
    ["Río", "el mercurio cae al agua y al fondo"],
    ["Peces", "lo acumulan; los grandes, más"],
    ["Personas", "comen pescado con mercurio"],
  ], { per: 2, ch: 80, gap: 34, m: 6, W });
  return fig("f-13-hg", "Camino del mercurio: la minería ilegal lo echa al río, los peces lo acumulan y llega a las personas que comen pescado", c.h, c.svg, W);
};

const erre = () => {
  const c = chain("f-13-3r", [
    ["Reducir", "compra solo lo que necesitas", "d-acc"],
    ["Reutilizar", "dale otro uso antes de botarlo"],
    ["Reciclar", "con lo usado se hace algo nuevo"],
  ], { per: 1, ch: 60, gap: 24, m: 8, W });
  return fig("f-13-3r", "Las tres erres en orden: reducir, reutilizar y reciclar", c.h, c.svg, W);
};

export default {
  "13-niveles": {
    caption: "De lo pequeño a lo grande: **individuo → población → comunidad → ecosistema**. Cada nivel contiene al anterior.",
    svg: nested(),
  },
  "13-red-mar": {
    caption: "Red alimenticia del mar peruano. Una **red** es varias cadenas unidas: la anchoveta, por ejemplo, alimenta al lobo marino y al piquero.",
    svg: redMar(),
  },
  "13-red-puna": {
    caption: "Red alimenticia de la puna: el ichu sostiene a todos los demás.",
    svg: redPuna(),
  },
  "13-cadena-puna": {
    caption: "Una cadena alimenticia de la puna, con su descomponedor.",
    svg: cadenaPuna(),
  },
  "13-piramide": {
    caption: "Pirámide de energía del mar peruano (cifras de ejemplo). De un nivel al siguiente pasa solo la décima parte.",
    svg: piramide(),
  },
  "13-ciclo-agua": {
    caption: "El agua da vueltas: nunca se acaba, pero cambia de lugar y de estado.",
    svg: agua(),
  },
  "13-ciclo-carbono": {
    caption: "El carbono pasa del aire a los seres vivos con la fotosíntesis y vuelve al aire con la respiración.",
    svg: carbono(),
  },
  "13-ciclo-nitrogeno": {
    caption: "El nitrógeno del aire solo entra a los seres vivos con ayuda de bacterias.",
    svg: nitrogeno(),
  },
  "13-afloramiento": {
    caption: "El afloramiento de la corriente de Humboldt: por eso el mar peruano está lleno de vida.",
    svg: afloramiento(),
  },
  "13-perfil-peru": {
    caption: "Perfil del Perú de oeste a este: en pocos cientos de kilómetros cambian el clima y la vida.",
    svg: perfil(),
  },
  "13-el-nino": {
    caption: "Cómo cambia el mar peruano cuando llega El Niño.",
    svg: nino(),
  },
  "13-mercurio": {
    caption: "El mercurio sigue la cadena alimenticia hasta las personas.",
    svg: mercurio(),
  },
  "13-tres-erres": {
    caption: "Las 3R, en orden de lo mejor a lo menos malo para el ambiente: primero produce menos basura.",
    svg: erre(),
  },
};
