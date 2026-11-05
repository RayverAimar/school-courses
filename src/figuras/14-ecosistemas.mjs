// Figures of "Ecosistemas". Drawn 360 wide so their text reads on a phone.
import { box, note, fig, chain } from "../../platform/build/figkit.mjs";

const W = 360;

const dots = (list, cls = "d-fill-acc") => list.map(([x, y]) => `<circle class="${cls}" cx="${x}" cy="${y}" r="5"/>`).join("");

// A straight arrow from (x1, y1) to (x2, y2); the marker belongs to figure `id`.
const arrow = (id, d, acc = false) => `<path class="${acc ? "d-flow-acc" : "d-flow"}" marker-end="url(#${id}${acc ? "a" : ""})" d="${d}"/>`;

const nested = () => {
  const id = "f-14-niv";
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
  const id = "f-14-mar";
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
  const id = "f-14-puna";
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
  const c = chain("f-14-cp", [
    ["Ichu", "productor"],
    ["Vicuña", "consumidor 1.°", "d-acc"],
    ["Puma", "consumidor 2.°"],
    ["Hongos y bacterias", "descomponedores"],
  ], { per: 2, ch: 66, gap: 30, m: 8, W });
  return fig("f-14-cp", "Cadena alimenticia de la puna: el ichu es comido por la vicuña, la vicuña por el puma, y al morir todos son descompuestos por hongos y bacterias", c.h, c.svg, W);
};

const piramide = () => {
  const id = "f-14-pir";
  const tier = (w, y, t, s, cls) => box(180 - w / 2, y, w, 52, t, s, cls);
  return fig(id, "Pirámide de energía: el fitoplancton tiene 10 000 kilocalorías, el zooplancton 1 000, la anchoveta 100 y el lobo marino 10; cada nivel recibe un décimo del anterior", 262, `
    ${tier(120, 6, "Lobo marino", "10 kcal", "d-box")}
    ${tier(180, 62, "Anchoveta", "100 kcal", "d-box")}
    ${tier(240, 118, "Zooplancton", "1 000 kcal", "d-box")}
    ${tier(304, 174, "Fitoplancton", "10 000 kcal", "d-acc")}
    ${note(180, 252, "Cada nivel recibe solo el 10 % del de abajo", 340, "d-s", "middle")}`, W);
};

const agua = () => {
  const c = chain("f-14-ag", [
    ["Evaporación", "el Sol calienta el mar y los ríos; las plantas transpiran"],
    ["Condensación", "el vapor sube, se enfría y forma nubes"],
    ["Precipitación", "lluvia, granizo o nieve"],
    ["Escorrentía", "el agua baja por ríos y suelo hacia el mar"],
  ], { per: 2, ch: 98, gap: 34, m: 6, W, closing: true });
  return fig("f-14-ag", "Ciclo del agua en cuatro pasos: evaporación, condensación, precipitación y escorrentía, que vuelve al mar", c.h, c.svg, W);
};

const carbono = () => {
  const c = chain("f-14-ca", [
    ["CO₂ del aire", "gas que sale al respirar y al quemar"],
    ["Plantas y algas", "fotosíntesis: toman CO₂ y hacen azúcar", "d-acc"],
    ["Animales", "comen plantas y pasan el carbono"],
    ["Respiración y descomposición", "devuelven CO₂ al aire"],
  ], { per: 2, ch: 98, gap: 34, m: 6, W, closing: true });
  return fig("f-14-ca", "Ciclo del carbono: el dióxido de carbono del aire lo toman las plantas en la fotosíntesis, pasa a los animales al comer, y la respiración y la descomposición lo devuelven al aire", c.h, c.svg, W);
};

const nitrogeno = () => {
  const c = chain("f-14-ni", [
    ["N₂ del aire", "78 % del aire; las plantas no lo pueden usar"],
    ["Bacterias fijadoras", "en raíces de frejol o tarwi lo convierten en amonio y nitratos"],
    ["Plantas y animales", "con nitrato hacen proteínas; los animales comen plantas"],
    ["Descomponedores", "devuelven amonio al suelo; otras bacterias liberan N₂"],
  ], { per: 2, ch: 112, gap: 34, m: 6, W, closing: true });
  return fig("f-14-ni", "Ciclo del nitrógeno: el nitrógeno del aire lo convierten bacterias en nitratos, las plantas hacen proteínas, los animales las comen y los descomponedores devuelven nitrógeno al suelo y al aire", c.h, c.svg, W);
};






const energiaMateria = () => {
  const id = "f-14-em";
  return fig(id, "La energía hace un camino de una sola vía, del Sol a los seres vivos y de ahí al calor; la materia da vueltas entre el aire, el agua y el suelo y los seres vivos", 262, `
    ${note(6, 22, "Energía: un camino de una sola vía", 340, "d-a")}
    ${box(6, 36, 96, 56, "Sol", "luz", "d-acc")}
    ${box(124, 36, 112, 56, "Seres vivos", "", "d-box")}
    ${box(258, 36, 96, 56, "Calor", "se pierde", "d-box")}
    ${arrow(id, "M102 64H124", true)}
    ${arrow(id, "M236 64H258")}
    ${note(6, 132, "Materia: da vueltas", 340, "d-a")}
    ${box(6, 146, 130, 56, "Aire, agua y suelo", "", "d-box")}
    ${box(224, 146, 130, 56, "Seres vivos", "", "d-box")}
    ${arrow(id, "M136 164H224")}
    ${arrow(id, "M224 186H136")}
    ${note(180, 232, "Los descomponedores devuelven la materia", 340, "d-s", "middle")}`, W);
};

const bosqueCarbono = () =>
  fig("f-14-bc", "Comparación entre un bosque en pie, que absorbe y guarda carbono, y un bosque talado y quemado, que libera dióxido de carbono al aire", 250, `
    <rect class="d-box" x="6" y="8" width="168" height="232" rx="10"/>
    <text class="d-t" x="90" y="32" text-anchor="middle">Bosque en pie</text>
    ${note(90, 70, "Los árboles toman CO₂ del aire con la fotosíntesis", 144, "d-s", "middle")}
    ${note(90, 128, "Guardan el carbono en la madera y las hojas", 144, "d-s", "middle")}
    ${note(90, 190, "El carbono queda guardado", 144, "d-a", "middle")}
    <rect class="d-acc" x="186" y="8" width="168" height="232" rx="10"/>
    <text class="d-a" x="270" y="32" text-anchor="middle">Talado y quemado</text>
    ${note(270, 70, "La madera quemada o podrida libera CO₂", 144, "d-s", "middle")}
    ${note(270, 128, "Hay menos árboles para absorber CO₂", 144, "d-s", "middle")}
    ${note(270, 190, "Más CO₂ en el aire: más calentamiento", 144, "d-a", "middle")}`, W);

const servicios = () =>
  fig("f-14-sv", "Cinco servicios que un área natural protegida da a la sociedad: agua, oxígeno, alimento, turismo y regulación del clima", 226, `
    ${box(6, 8, 168, 64, "Agua", "ríos y lagunas de los nevados", "d-box")}
    ${box(186, 8, 168, 64, "Oxígeno", "las plantas lo liberan al hacer fotosíntesis", "d-box")}
    ${box(6, 82, 168, 64, "Alimento", "peces, frutos y castañas", "d-box")}
    ${box(186, 82, 168, 64, "Turismo", "trabajo para las comunidades", "d-box")}
    ${box(66, 156, 228, 64, "Regulación del clima", "los bosques guardan carbono y enfrían el aire", "d-acc")}`, W);

export default {
  "14-niveles": {
    caption: "De lo pequeño a lo grande: **individuo → población → comunidad → ecosistema**. Cada nivel contiene al anterior.",
    svg: nested(),
  },
  "14-red-mar": {
    caption: "Red alimenticia del mar peruano. Una **red** es varias cadenas unidas: la anchoveta, por ejemplo, alimenta al lobo marino y al piquero.",
    svg: redMar(),
  },
  "14-red-puna": {
    caption: "Red alimenticia de la puna: el ichu sostiene a todos los demás.",
    svg: redPuna(),
  },
  "14-cadena-puna": {
    caption: "Una cadena alimenticia de la puna, con su descomponedor.",
    svg: cadenaPuna(),
  },
  "14-piramide": {
    caption: "Pirámide de energía del mar peruano (cifras de ejemplo). De un nivel al siguiente pasa solo la décima parte.",
    svg: piramide(),
  },
  "14-ciclo-agua": {
    caption: "El agua da vueltas: nunca se acaba, pero cambia de lugar y de estado.",
    svg: agua(),
  },
  "14-ciclo-carbono": {
    caption: "El carbono pasa del aire a los seres vivos con la fotosíntesis y vuelve al aire con la respiración.",
    svg: carbono(),
  },
  "14-ciclo-nitrogeno": {
    caption: "El nitrógeno del aire solo entra a los seres vivos con ayuda de bacterias.",
    svg: nitrogeno(),
  },
  "14-energia-materia": {
    caption: "La **energía** entra del Sol y se va como calor: es un camino de una sola vía. La **materia** se recicla.",
    svg: energiaMateria(),
  },
  "14-bosque-carbono": {
    caption: "Un bosque en pie guarda carbono. Si se tala y se quema, ese carbono vuelve al aire como CO₂.",
    svg: bosqueCarbono(),
  },
  "14-servicios": {
    caption: "Los servicios ecosistémicos: lo que un ecosistema bien conservado le da gratis a la sociedad.",
    svg: servicios(),
  },
};
