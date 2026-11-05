import { box, note, fig } from "../../../platform/build/figkit.mjs";

const W = 360;

// A moon disc lit on one side. lit: -1 = left, +1 = right; k: lit fraction of the width (0 new, 1 full, 0.5 half).
function moon(cx, cy, r, lit, frac) {
  const base = `<circle class="d-fill-hair" cx="${cx}" cy="${cy}" r="${r}"/>`;
  if (frac >= 0.999) return `<circle class="d-fill-acc" cx="${cx}" cy="${cy}" r="${r}"/>`;
  if (frac <= 0.001) return base;
  const top = `${cx} ${cy - r}`, bot = `${cx} ${cy + r}`;
  const k = Math.abs(1 - 2 * frac) * r;
  const crescent = frac < 0.5;
  let d;
  if (lit < 0) d = `M${top}A${r} ${r} 0 0 0 ${bot}A${k} ${r} 0 0 ${crescent ? 1 : 0} ${top}Z`;
  else d = `M${top}A${r} ${r} 0 0 1 ${bot}A${k} ${r} 0 0 ${crescent ? 0 : 1} ${top}Z`;
  return `${base}<path class="d-fill-acc" d="${d}"/>`;
}

// Co2 concentration (ppm) at Mauna Loa, rounded.
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
  return fig("f-14-co2", "Gráfica del dióxido de carbono en el aire: sube de 317 ppm en 1960 a 339 en 1980, 369 en el 2000 y 414 en el 2020", 270, `${s}<path class="d-flow-acc" d="${line}"/>${dots}${labels}`, W);
}

// Seasons: the Earth four times on its orbit, the axis always tilted the same way.
function estaciones() {
  const cx = 180, cy = 132, r = 82;
  const earth = (x, y) => `<circle class="d-acc" cx="${x}" cy="${y}" r="14"/><circle class="d-box-line" cx="${x}" cy="${y}" r="14"/><path class="d-flow-acc" d="M${x - 9} ${y + 20}L${x + 9} ${y - 20}"/>`;
  return fig("f-14-es", "La Tierra en cuatro puntos de su órbita alrededor del Sol, con su eje siempre inclinado hacia el mismo lado: junio, septiembre, diciembre y marzo", 290, `
    <circle class="d-dash" cx="${cx}" cy="${cy}" r="${r}"/>
    <circle class="d-fill-acc" cx="${cx}" cy="${cy}" r="14"/>
    ${note(cx, cy + 32, "Sol", 40, "d-s", "middle")}
    ${earth(cx - r, cy)}${earth(cx, cy + r)}${earth(cx + r, cy)}${earth(cx, cy - r)}
    ${note(6, cy + 42, "Junio", 100, "d-t")}
    ${note(6, cy + 58, "Más sol al hemisferio norte", 112)}
    ${note(354, cy + 42, "Diciembre", 100, "d-t", "end")}
    ${note(354, cy + 58, "Más sol al hemisferio sur", 112, "d-s", "end")}
    ${note(cx, 280, "Septiembre: equinoccio", 200, "d-t", "middle")}
    ${note(cx + 26, 24, "Marzo: equinoccio", 150, "d-t")}`, W);
}

function fasesOrbita() {
  const cx = 195, cy = 126, r = 68;
  const at = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)];
  // positions measured so that new moon is on the sun side (left); the Moon moves counterclockwise
  const ms = [180, 225, 270, 315, 0, 45, 90, 135].map((d) => at(d));
  const moons = ms.map(([x, y]) => `<circle class="d-fill-hair" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/><path class="d-fill-acc" d="M${x.toFixed(1)} ${(y - 9).toFixed(1)}A9 9 0 0 0 ${x.toFixed(1)} ${(y + 9).toFixed(1)}Z"/>`).join("");
  return fig("f-14-fo", "La Luna en ocho posiciones alrededor de la Tierra, siempre con la mitad que mira al Sol iluminada; desde la Tierra se ve más o menos esa mitad según la posición", 260, `
    ${note(6, 22, "Luz del Sol", 100, "d-t")}
    <path class="d-flow-acc" marker-end="url(#f-14-foa)" d="M6 62H62"/>
    <path class="d-flow-acc" marker-end="url(#f-14-foa)" d="M6 126H62"/>
    <path class="d-flow-acc" marker-end="url(#f-14-foa)" d="M6 190H62"/>
    <circle class="d-dash" cx="${cx}" cy="${cy}" r="${r}"/>
    <circle class="d-acc" cx="${cx}" cy="${cy}" r="16"/><circle class="d-box-line" cx="${cx}" cy="${cy}" r="16"/>
    ${note(cx, cy + 5, "Tierra", 60, "d-s", "middle")}
    ${moons}
    ${note(cx - r, cy + 26, "Luna nueva", 80, "d-t", "middle")}
    ${note(cx + r + 16, cy + 5, "Luna llena", 80, "d-t")}
    ${note(cx, 30, "Cuarto menguante", 150, "d-t", "middle")}
    ${note(cx, cy + r + 30, "Cuarto creciente", 150, "d-t", "middle")}`, W);
}

function fasesVista() {
  const names = [
    ["Luna nueva", -1, 0], ["Creciente", -1, 0.2], ["Cuarto creciente", -1, 0.5], ["Gibosa creciente", -1, 0.8],
    ["Luna llena", 1, 1], ["Gibosa menguante", 1, 0.8], ["Cuarto menguante", 1, 0.5], ["Menguante", 1, 0.2],
  ];
  let inner = "";
  names.forEach(([n, lit, f], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 45 + col * 90, y = 26 + row * 92;
    inner += moon(x, y, 20, lit, f) + `<circle class="d-box-line" cx="${x}" cy="${y}" r="20"/>` + note(x, y + 40, n, 84, "d-s", "middle");
  });
  return fig("f-14-fv", "Las ocho fases de la Luna como se ven desde el hemisferio sur: nueva, creciente, cuarto creciente, gibosa creciente, llena, gibosa menguante, cuarto menguante y menguante", 190, inner, W);
}

function eclipses() {
  const sun = (y) => `<circle class="d-fill-acc" cx="30" cy="${y}" r="22"/>${note(30, y + 40, "Sol", 40, "d-s", "middle")}`;
  const earth = (x, y) => `<circle class="d-acc" cx="${x}" cy="${y}" r="15"/><circle class="d-box-line" cx="${x}" cy="${y}" r="15"/>`;
  const lun = (x, y) => `<circle class="d-fill-hair" cx="${x}" cy="${y}" r="7"/>`;
  return fig("f-14-ec", "Dos esquemas: en el eclipse solar la Luna está entre el Sol y la Tierra; en el eclipse lunar la Tierra está entre el Sol y la Luna", 330, `
    ${note(6, 16, "Eclipse solar: la Luna tapa al Sol", 340, "d-t")}
    ${sun(66)}
    <path class="d-dash" d="M52 62L200 54M52 70L200 80M200 54L338 66M200 80L338 66"/>
    ${lun(200, 67)}${earth(300, 67)}
    ${note(200, 104, "Luna", 50, "d-s", "middle")}
    ${note(300, 104, "Tierra", 50, "d-s", "middle")}
    ${note(180, 132, "Pasa en luna nueva", 220, "d-s", "middle")}
    <path class="d-line" d="M6 150H354"/>
    ${note(6, 176, "Eclipse lunar: la Tierra tapa la luz", 340, "d-t")}
    ${sun(226)}
    <path class="d-dash" d="M52 218L200 202M52 234L200 252M200 202L345 218M200 252L345 236"/>
    ${earth(200, 227)}${lun(310, 227)}
    ${note(200, 264, "Tierra", 50, "d-s", "middle")}
    ${note(310, 264, "Luna", 50, "d-s", "middle")}
    ${note(180, 292, "Pasa en luna llena", 220, "d-s", "middle")}`, W);
}

function planetas() {
  const rocky = [["Mercurio", 4879], ["Venus", 12104], ["Tierra", 12742], ["Marte", 6779]];
  const giants = [["Júpiter", 139820], ["Saturno", 116460], ["Urano", 50724], ["Neptuno", 49244]];
  let inner = note(6, 18, "Planetas rocosos (misma escala entre ellos)", 340, "d-t");
  rocky.forEach(([n, d], i) => {
    const x = 52 + i * 86, r = (d / 12742) * 16;
    inner += `<circle class="${n === "Tierra" ? "d-fill-acc" : "d-fill-hair"}" cx="${x}" cy="62" r="${r.toFixed(1)}"/>` + note(x, 100, `${i + 1}. ${n}`, 86, "d-s", "middle");
  });
  inner += `<path class="d-line" d="M6 118H354"/>` + note(6, 142, "Planetas gigantes (otra escala, más chica)", 340, "d-t");
  giants.forEach(([n, d], i) => {
    const x = 52 + i * 86, r = (d / 139820) * 40;
    inner += `<circle class="d-fill-hair" cx="${x}" cy="200" r="${r.toFixed(1)}"/>` + note(x, 250, `${i + 5}. ${n}`, 86, "d-s", "middle");
  });
  return fig("f-14-pl", "Los ocho planetas en orden desde el Sol: Mercurio, Venus, Tierra y Marte son rocosos y chicos; Júpiter, Saturno, Urano y Neptuno son gigantes", 268, inner, W);
}

export default {
  "14-capas-tierra": {
    caption: "Por dentro la Tierra tiene capas: corteza, manto y núcleo. Nosotros vivimos sobre la corteza, que es muy delgada.",
    svg: fig("f-14-ct", "Corte de la Tierra con sus capas: corteza muy delgada, manto, núcleo externo líquido y núcleo interno sólido", 232, `
      <circle class="d-box-line" cx="100" cy="116" r="96"/>
      <circle class="d-box" cx="100" cy="116" r="90"/>
      <circle class="d-acc" cx="100" cy="116" r="52"/>
      <circle class="d-fill-acc" cx="100" cy="116" r="24"/>
      <path class="d-flow" d="M200 26L170 42"/>
      <path class="d-flow" d="M200 82L172 98"/>
      <path class="d-flow" d="M200 140L146 128"/>
      <path class="d-flow" d="M200 196L108 122"/>
      ${note(206, 28, "Corteza", 150, "d-t")}${note(206, 44, "5 a 70 km, roca sólida", 150)}
      ${note(206, 84, "Manto", 150, "d-t")}${note(206, 100, "roca caliente que fluye muy lento", 150)}
      ${note(206, 142, "Núcleo externo", 150, "d-t")}${note(206, 158, "hierro líquido", 150)}
      ${note(206, 198, "Núcleo interno", 150, "d-t")}${note(206, 214, "hierro sólido", 150)}`, W),
  },

  "14-esferas": {
    caption: "Cuatro \"esferas\" de la Tierra que se influyen entre sí: por ejemplo, la lluvia (atmósfera) moja el suelo (litósfera) y hace crecer a las plantas (biósfera).",
    svg: fig("f-14-es2", "Cuatro cajas: litósfera, hidrósfera, atmósfera y biósfera, con lo que contiene cada una", 150, `
      ${box(6, 6, 170, 62, "Litósfera", "rocas y suelo")}
      ${box(184, 6, 170, 62, "Hidrósfera", "ríos, lagos, mares y hielo", "d-acc")}
      ${box(6, 80, 170, 62, "Atmósfera", "el aire que nos rodea", "d-acc")}
      ${box(184, 80, 170, 62, "Biósfera", "todos los seres vivos")}`, W),
  },

  "14-nazca": {
    caption: "La placa de Nazca (del fondo del Pacífico) se hunde bajo la placa Sudamericana. Ese choque lento levantó los Andes y causa los sismos del Perú.",
    svg: fig("f-14-nz", "Corte de la costa del Perú: la placa de Nazca baja por debajo de la placa Sudamericana, que sostiene la cordillera de los Andes", 232, `
      <path class="d-box" d="M120 106L120 72L175 66L240 42L262 36L282 50L350 66L350 196L345 196Z"/>
      <path class="d-acc" d="M10 100L120 108L345 196L345 214L120 124L10 114Z"/>
      <path class="d-dash" d="M10 74H120"/>
      <path class="d-flow-acc" marker-end="url(#f-14-nza)" d="M162 140L214 164"/>
      <path class="d-flow" marker-end="url(#f-14-nz)" d="M100 176L116 132"/>
      ${note(10, 64, "Océano Pacífico", 110)}
      ${note(10, 146, "Placa de Nazca", 100, "d-a")}
      ${note(90, 196, "Fosa oceánica", 100)}
      ${note(186, 104, "Placa Sudamericana", 130, "d-t")}
      ${note(280, 24, "Cordillera de los Andes", 160, "d-t", "middle")}
      ${note(234, 208, "Se hunde: subducción", 120, "d-a")}`, W),
  },

  "14-hipocentro": {
    caption: "El sismo empieza en el hipocentro, dentro de la Tierra. El epicentro es el punto de la superficie que queda justo encima.",
    svg: fig("f-14-hp", "Corte del suelo: un punto en el interior (hipocentro) y el punto de la superficie justo encima (epicentro), con ondas que salen del hipocentro", 200, `
      <rect class="d-box" x="6" y="60" width="348" height="130" rx="4"/>
      <circle class="d-box-line" cx="120" cy="150" r="26"/>
      <circle class="d-box-line" cx="120" cy="150" r="48"/>
      <circle class="d-box-line" cx="120" cy="150" r="70"/>
      <path class="d-dash" d="M120 60V150"/>
      <circle class="d-fill-acc" cx="120" cy="150" r="6"/>
      <circle class="d-fill-acc" cx="120" cy="60" r="6"/>
      ${note(134, 44, "Epicentro: en la superficie", 220, "d-a")}
      ${note(210, 126, "Hipocentro (foco):", 140, "d-a")}
      ${note(210, 144, "donde se rompe la roca y nace el sismo", 140)}
      ${note(200, 84, "ondas sísmicas", 100)}`, W),
  },

  "14-atmosfera": {
    caption: "Las capas de la atmósfera (alturas aproximadas, el dibujo no está a escala). Casi todo el aire y el clima están en la troposfera.",
    svg: fig("f-14-at", "Cinco capas de la atmósfera, de arriba hacia abajo: exosfera, termosfera, mesosfera, estratosfera con la capa de ozono y troposfera donde ocurre el clima", 300, `
      ${box(6, 6, 130, 48, "Exosfera", "")}${note(146, 22, "Más de 500 km. Se pierde en el espacio.", 206)}
      ${box(6, 60, 130, 48, "Termosfera", "")}${note(146, 76, "80 a 500 km. Aquí giran satélites y la estación espacial.", 206)}
      ${box(6, 114, 130, 48, "Mesosfera", "")}${note(146, 130, "50 a 80 km. Aquí se queman los meteoros (estrellas fugaces).", 206)}
      ${box(6, 168, 130, 48, "Estratosfera", "", "d-acc")}${note(146, 184, "12 a 50 km. Aquí está la capa de ozono.", 206)}
      ${box(6, 222, 130, 72, "Troposfera", "", "d-acc")}${note(146, 238, "0 a 12 km. Aire que respiramos, nubes, lluvia y viento: el clima.", 206)}`, W),
  },

  "14-invernadero": {
    caption: "A la izquierda, el efecto invernadero natural mantiene la Tierra templada. A la derecha, con más gases por la actividad humana, se atrapa más calor.",
    svg: fig("f-14-iv", "Dos esquemas de la atmósfera: con pocos gases, parte del calor vuelve a la Tierra; con muchos gases, vuelve más calor y el planeta se calienta", 250, `
      ${note(88, 18, "Natural", 160, "d-t", "middle")}
      ${note(272, 18, "Aumentado", 160, "d-t", "middle")}
      <rect class="d-acc" x="10" y="80" width="156" height="16" rx="4"/>
      <rect class="d-acc" x="194" y="80" width="156" height="40" rx="4"/>
      <rect class="d-box" x="10" y="200" width="156" height="30" rx="4"/>
      <rect class="d-box" x="194" y="200" width="156" height="30" rx="4"/>
      <path class="d-flow-acc" marker-end="url(#f-14-iva)" d="M40 34V196"/>
      <path class="d-flow-acc" marker-end="url(#f-14-iva)" d="M224 34V196"/>
      <path class="d-flow" marker-end="url(#f-14-iv)" d="M80 196V54"/>
      <path class="d-flow" marker-end="url(#f-14-iv)" d="M264 196V54"/>
      <path class="d-flow" marker-end="url(#f-14-iv)" d="M110 98V196"/>
      <path class="d-flow" marker-end="url(#f-14-iv)" d="M296 124V196"/>
      <path class="d-flow" marker-end="url(#f-14-iv)" d="M326 124V196"/>
      <path class="d-flow" marker-end="url(#f-14-iv)" d="M148 98V196"/>
      ${note(90, 66, "gases", 60, "d-s")}
      ${note(272, 66, "más gases", 80, "d-s")}
      ${note(88, 246, "poco calor vuelve", 160, "d-s", "middle")}
      ${note(272, 246, "mucho calor vuelve", 160, "d-s", "middle")}`, W),
  },

  "14-co2": {
    caption: "El dióxido de carbono (CO₂) del aire ha subido cada década. El eje vertical empieza en 280 ppm para que se vea el cambio.",
    svg: co2(),
  },

  "14-garua": {
    caption: "La corriente fría de Humboldt enfría el aire sobre el mar: se forman nubes bajas que cubren Lima, pero casi no llueve.",
    svg: fig("f-14-ga", "Corte de la costa del Perú: mar frío con nubes bajas encima que llegan a la costa de Lima, y los Andes a la derecha", 200, `
      <rect class="d-box" x="6" y="124" width="150" height="66" rx="4"/>
      <path class="d-box" d="M156 124L160 130L230 104L290 54L320 40L354 60L354 186L136 186Z"/>
      <rect class="d-acc" x="14" y="82" width="190" height="20" rx="10"/>
      <path class="d-flow-acc" marker-end="url(#f-14-gaa)" d="M140 186L140 150"/>
      ${note(14, 20, "Nubes bajas: la garúa", 190, "d-t")}
      ${note(14, 142, "Mar frío", 100, "d-a")}
      ${note(166, 160, "Lima", 60, "d-s")}
      ${note(246, 28, "Andes", 80, "d-s")}
      ${note(14, 160, "corriente de Humboldt", 100, "d-s")}`, W),
  },

  "14-estaciones": {
    caption: "Las estaciones no vienen de qué tan cerca está la Tierra del Sol, sino de la inclinación de su eje. Cuando un hemisferio se inclina hacia el Sol, ahí es verano.",
    svg: estaciones(),
  },

  "14-fases-orbita": {
    caption: "La Luna siempre tiene iluminada la mitad que mira al Sol. Según dónde esté en su órbita, desde la Tierra vemos una parte distinta de esa mitad.",
    svg: fasesOrbita(),
  },

  "14-fases-vista": {
    caption: "Las ocho fases como se ven desde el Perú. Durante unos 29 días y medio pasan de nueva a creciente, llena y menguante.",
    svg: fasesVista(),
  },

  "14-eclipses": {
    caption: "Un eclipse es una sombra: en el solar la sombra de la Luna cae sobre la Tierra; en el lunar la sombra de la Tierra cae sobre la Luna. (El dibujo no está a escala.)",
    svg: eclipses(),
  },

  "14-planetas": {
    caption: "Los ocho planetas en orden desde el Sol. Júpiter es tan grande que, puesto de lado a lado, cabrían unas once Tierras.",
    svg: planetas(),
  },

  "14-escalas": {
    caption: "Cada nivel es muchísimo más grande que el anterior. Para medir distancias tan grandes, los astrónomos usan el año luz.",
    svg: fig("f-14-sc", "Cuatro cajas cada vez más grandes: la Tierra, el sistema solar, la Vía Láctea y el universo", 278, `
      ${box(90, 6, 180, 52, "La Tierra", "12 742 km de ancho")}
      ${box(60, 66, 240, 64, "El sistema solar", "la luz del Sol tarda unas 4 horas en llegar a Neptuno")}
      ${box(30, 138, 300, 66, "La Vía Láctea", "unos 100 000 años luz de ancho; tiene cientos de miles de millones de estrellas", "d-acc")}
      ${box(4, 212, 352, 62, "El universo", "cientos de miles de millones de galaxias, o más")}`, W),
  },
};
