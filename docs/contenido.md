# Cómo se escribe un módulo de Compass

Compass es una app de cursos del colegio para un estudiante de **2.° de secundaria (13–14 años) en el Perú**
que se prepara para el examen **COAR 2027** (Fase I: 50 preguntas de Matemática, Comunicación y Ciencia y
Tecnología) y para las evaluaciones de Minedu (ECE/ENLA). El curso de Ciencia y Tecnología sigue el
Currículo Nacional (CNEB), ciclo VI (1.° y 2.° de secundaria), con sus tres competencias: **indaga**
mediante métodos científicos, **explica** el mundo físico y **diseña** soluciones tecnológicas.

Todo en español del Perú, tuteando ("tú", nunca "vos"). Nada de "como IA", ni menciones a la app o a
quien la escribió.

## Lo que pidió el dueño del curso (no negociable)

- **Que se entienda.** Una idea a la vez, palabras sencillas, cada término nuevo explicado la primera vez
  que aparece, ejemplos de la vida diaria en el Perú (la cocina, el mercado, la chacra, la sierra, la
  selva, el mar, Lima, Arequipa, el Cusco…).
- **Temas conectados.** Dentro del módulo, cada lección se apoya en la anterior y lo dice; entre módulos,
  se nombra lo que se vio antes y lo que viene ("esto lo usarás en Energía"). Cada lección abre con un
  bloque `conecta`.
- **Poco texto seguido.** Ningún tramo de más de ~120 palabras (dos párrafos cortos) sin algo visual:
  una foto o GIF real, una figura nuestra, una tabla, un paso a paso (`steps`) o una lista corta.
- **Imágenes reales** (fotos y GIFs) donde ayudan a entender, buscadas en internet. Los derechos de autor no
  son un problema: es material de estudio personal, no comercial. Aun así se pone el crédito que la
  página indique.
- **Gráficos hechos por nosotros** cuando una foto no explica (partículas, procesos, ciclos, esquemas,
  gráficas de datos).
- **Videos de YouTube recomendados**, solo después de verlos por dentro (transcripción y escenas): que
  expliquen bien, en español, con datos correctos. Se indica qué tramo mirar y en qué fijarse.
- **Todos los temas que pueden entrar**, en orden.

## Archivos

| Qué | Dónde |
|---|---|
| El módulo | `content/secundaria/ciencia-tecnologia/NN-slug.md` (el nombre exacto está en `curso.json`) |
| Sus figuras | `src/figuras/NN-slug.mjs` |
| Fotos y GIFs | `content/img/cyt/…` vía `platform/build/photo.ts` (escribe `content/img/photos.json`) |
| Miniaturas de video | `content/img/videos/<id>.jpg` vía `scripts/video-thumb.mjs` |
| Notas de los videos | `content/videos/NN-slug.md` (qué videos viste, cuál elegiste y por qué, los descartados) |

No toques otros módulos, `platform/`, `src/*.js`, `src/course.css` ni `curso.json`. No hagas commits.

## Estructura de un módulo

```md
# Título del módulo
> Una línea que dice de qué trata.

## Primera lección
<!-- min: 12 -->
…
## Segunda lección
…
## Prueba del módulo
<!-- min: 15 -->
<!-- tipo: prueba -->
Una o dos líneas de introducción, luego 8 a 10 preguntas.
```

- **3 a 5 lecciones** de 10 a 15 minutos cada una, más la **Prueba del módulo**.
- Cada `## ` es una lección; su título es su identificador: no lo cambies una vez escrito.
- Dentro de una lección, los subtítulos son `### `.

## Una lección, en este orden

1. ` ```conecta ` — dos líneas: `antes: …` (lo que ya sabe y de dónde viene, nombrando la lección o el
   módulo) y `despues: …` (para qué le va a servir, nombrando lo que viene). En la primera lección del
   curso, `antes` habla de lo que sabe de la vida diaria.
2. ` ```goals ` — 2 o 3 objetivos que empiezan con un verbo ("Explicar…", "Distinguir…", "Calcular…").
3. **Una situación de entrada** del Perú (2–4 líneas) con su **foto real**.
4. **Las ideas, de a una**, cada una con su `### ` y separadas por algo visual. Fórmulas con ejemplo
   resuelto paso a paso (con números) cuando haya cálculo. Unidades siempre.
5. ` ```idea ` — la idea clave en una o dos frases.
6. ` ```video ` — el video recomendado (si hay uno bueno para esa lección; al menos **2 por módulo**).
7. `### Lo que suele confundirse` — 2 o 3 errores típicos de estudiantes, en negrita entre comillas, y
   por qué están mal. Estos errores son los que luego aparecen como alternativas.
8. ` ```recap ` — 3 a 5 puntos para recordar.
9. **3 o 4 preguntas** (` ```pregunta `) para comprobar.

### Bloques

````md
```conecta
antes: En **Sustancias y mezclas** viste que en una mezcla cada sustancia sigue siendo la misma.
despues: En **La energía** verás que toda reacción química libera o absorbe energía.
```

```goals
- Distinguir un cambio físico de uno químico.
```

```idea
La pregunta clave: ¿al final hay una sustancia nueva?
```

```recap
- Físico: misma sustancia; químico: sustancia nueva.
```

```pregunta
Enunciado en Markdown (puede tener una tabla o datos).
- [ ] Alternativa
- [x] La correcta
- [ ] Alternativa
- [ ] Alternativa
> Por qué la correcta lo es y por qué las otras no (nombra el error de cada una).
```

```video
id: dQw4w9WgXcQ
titulo: Título del video tal como está en YouTube
canal: Nombre del canal
duracion: 6:12
desde: 1:05
hasta: 4:30
- En qué fijarse (lo que el video muestra bien y conecta con la lección)
- Otra cosa en qué fijarse
```

```steps
# Título del paso a paso
## Primer paso
Texto corto del paso.
## Segundo paso
…
```

```formula
d = m / V
---
m = d · V
---
V = m / d
d: densidad (g/cm³)
m: masa (g)
V: volumen (cm³)
```
````

- **Fórmulas** (` ```formula `): la primera línea es la expresión; las líneas `símbolo: descripción` forman la
  leyenda debajo. Para mostrar varias expresiones (la fórmula y sus despejes) sepáralas con una línea `---`:
  salen lado a lado (una debajo de otra en el celular). Reglas de escritura, iguales dentro de `$…$`:
  - `a / b` **con espacios** es una fracción con raya horizontal; toma lo más cercano a cada lado: una letra,
    un número con su unidad (`54 g / 20 cm³`) o un grupo entre paréntesis, que se quitan
    (`(m · v^2) / 2`). Sin espacios (`g/cm³`, `km/h`) es una barra normal.
  - `^2`, `^{n-1}` exponente; `_0`, `_{c}` subíndice (`v_0`, `E_c`). `²` y `³` también valen.
  - Una sola letra es variable (en cursiva); palabras, números y unidades van rectos. `"texto"` entre
    comillas sale recto siempre.
  - Operadores: `=`, `+`, `-` (sale −), `·` (o `*`), `×`, `≈` (o `~=`), `≤` `≥` (o `<=` `>=`), `→` (o `->`), `Δ`
    (pegada a la letra: `ΔT`).
- **Fórmula dentro del texto**: entre signos de dólar, `$Q = m · c · ΔT$`. Funciona en párrafos, listas,
  tablas, enunciados y alternativas; las fracciones salen pequeñas, en línea.
- **Foto de referencia en una pregunta**: una línea `<!-- photo: id -->` dentro del enunciado de un
  ` ```pregunta ` muestra esa foto pequeña al lado del enunciado (encima en el celular), con su leyenda; el
  crédito queda en el globo al pasar el mouse. Úsala cuando la pregunta dice «lo que ves en la foto».

- Figura nuestra: una línea `<!-- figura: id -->` donde va (el id es una clave de `src/figuras/NN-slug.mjs`).
  También funciona **dentro de una pregunta** (en su enunciado, en su propia línea): úsalo para preguntas con
  gráficos o esquemas; nunca pegues el SVG a mano. La misma figura puede usarse varias veces.
- Foto o GIF: `<!-- photo: id -->` en la línea justo **antes del párrafo que ilustra**. Va **al lado del
  texto**, a la derecha (`<!-- photo: id left -->` la pone a la izquierda), como en un libro: el texto la
  rodea hasta un bloque ancho (figura, tabla, video, pregunta, otra foto), `<!-- /photo -->` o el fin del
  paso. Detrás de un `### ` subtítulo, el subtítulo queda arriba y la foto al lado de sus párrafos. Si no
  hay texto después de la marca (al final del paso, antes de una figura o tabla), se pone al lado de los
  párrafos de **antes**. Con poco texto (menos de ~70 palabras) sale más angosta. Solo en columnas angostas
  (el celular) va a todo el ancho, debajo del primer párrafo. No va dentro de `steps`.
- Tablas Markdown normales.

## Las preguntas

Son lo más importante para el examen. Estilo COAR / ECE de 2.° de secundaria:

- **Situaciones**, no definiciones sueltas: un estudiante que hace un experimento, una tabla de datos,
  algo que pasa en casa o en el campo. En cada módulo, al menos **2 preguntas de indagación** (pregunta
  de investigación, hipótesis, variable independiente/dependiente/controlada, leer una tabla o gráfico,
  conclusión válida) además de las de "explica".
- **4 alternativas**, una sola correcta, todas creíbles: los distractores salen de los errores típicos
  ("Lo que suele confundirse"), no de cosas absurdas.
- **La correcta no debe ser la más larga** ni la más completa: escribe alternativas de largo parecido.
  Reparte la clave entre A, B, C y D (en un módulo, ninguna letra más de 3 veces de cada 10).
- Evita "todas las anteriores", "ninguna", dobles negaciones.
- La explicación (`> `) dice por qué la correcta lo es y qué error hay en las otras.
- **Prueba del módulo**: 8 a 10 preguntas que mezclan todas las lecciones, más difíciles que las de la
  lección, con al menos 3 de indagación o lectura de datos. Que no repitan las preguntas de las lecciones.

## La prueba de entrada

Cada módulo lleva además un `_diagnostico.md`: 6 preguntas nuevas por lección (2 básicas, 2 medias,
2 avanzadas) y los pasos donde empieza la parte media y la avanzada. Con eso la app decide qué lecciones
salta el estudiante y desde qué paso empieza las demás. Formato, reglas y validación: `docs/diagnostico.md`
(el modelo es el del módulo 01). Sus preguntas no van al banco de repaso.

## Datos correctos

Todo dato (cifras, nombres, fechas, lugares del Perú) tiene que ser verdadero. Comprueba lo que no sepas
con certeza (WebSearch). Para que el nivel y el vocabulario coincidan con lo que pide Minedu, puedes
leer (con `pdftotext`) el texto escolar y las fichas en `~/Downloads/ece-enla-ciencia/`:
`Minedu_texto_CyT_2do_secundaria.pdf`, `Minedu_fichas_autoaprendizaje_CyT_2.pdf`,
`Minedu_fichas_indagacion_CyT_2.pdf`, y los informes ECE/ENLA (`ECE2018…`, `ECE2019…`, `ENLA2025…`) y el
cuadernillo modelo con claves para ver cómo preguntan. Lee solo las partes de tu tema.

## Fotos y GIFs

```bash
node platform/build/photo.ts search <palabras>         # Wikimedia Commons (preferido: buena resolución)
node platform/build/photo.ts search-web <palabras>     # Google/Bing Images: página y tamaño de cada resultado
node platform/build/photo.ts add cyt-<id> "File:Nombre.jpg"
node platform/build/photo.ts add cyt-<id> --image <URL de la imagen o GIF> --page <URL de la página> --author "…" --license "…" --source "…"
node platform/build/photo.ts set cyt-<id> /ruta/a/texto.json   # {"alt": {"es": "…", "en": "…"}, "caption": {"es": "…", "en": "…"}}
```

- Los ids empiezan con `cyt-` y dicen qué muestran (`cyt-salineras-maras`).
- **Mira cada imagen antes de usarla** (abre el original que queda en `.cache/photos/` con Read): que muestre
  de verdad lo que dice el texto, que se vea bien, sin marcas de agua grandes ni texto en otro idioma
  que confunda.
- `alt` describe la imagen; `caption` dice qué es, dónde y por qué importa para la lección (una línea).
  `en` es la traducción al inglés (lo pide el formato).
- GIFs: animaciones que muestran un proceso (difusión, cambios de estado, la Tierra girando, un circuito)
  valen mucho; búscalos en Wikimedia Commons ("animation", ".gif") o en la web.
- Unas **2 a 4 imágenes reales por lección**, donde ayuden; nunca de relleno.

## Videos

Usa los scripts del skill de sesiones (`K=~/.claude/skills/sesion-max-uhle/scripts`):

```bash
python3 -I $K/buscar_videos.py .cache/videos/NN/candidatos "<tema> para secundaria" "<tema> explicación" "<tema> experimento"
uv run --with pillow python -I $K/video.py --rapido "<URL>" .cache/videos/NN/<id>    # transcripción + una hoja de escenas
uv run --with pillow python -I $K/video.py "<URL>" .cache/videos/NN/<id>             # el elegido, completo
node scripts/video-thumb.mjs <id>
```

- Busca varios candidatos por tema, descarta por título lo que no sirve, revisa 3 a 6 con `--rapido`
  (lee la transcripción y mira la hoja de escenas) y quédate con el que **mejor explica para su edad**:
  español, buena imagen, sin errores de datos, sin minutos de relleno. Canales educativos conocidos
  (Minedu/Aprendo en casa, Khan Academy en español, Lifeder, Happy Learning, Educatina, Unicoos, Profe
  Sergio, CuriosaMente, Smile and Learn…) son buenos candidatos, pero manda lo que el video realmente dice.
- Del elegido, mira el video completo (sin `--rapido`) y usa lo que viste: `desde`/`hasta` del tramo útil
  y los puntos "en qué fijarse" con lo que de verdad se ve y se dice.
- Si YouTube bloquea `yt-dlp` ("confirma que no eres un bot"), espera unos minutos y reintenta una vez. Para
  la pasada completa del elegido, si el bloqueo sigue, usa el análisis de Gemini (ve imagen y audio del video
  público sin descargarlo):
  `python3 -I $K/gemini_video.py "<URL>" .cache/videos/NN/<id>/gemini.md "estudiantes de 2.° de secundaria (13 años) en una clase de Ciencia y Tecnología"`.
  Úsalo junto con la transcripción de `--rapido`: lo que Gemini diga y no esté en la transcripción ni en las escenas, no se usa.
- Si el video dice algo incorrecto o distinto de la lección, no lo recomiendes (o acota el tramo).
- Deja en `content/videos/NN-slug.md` una tabla con los candidatos revisados, el elegido de cada lección
  y el motivo de cada descarte.

## Figuras nuestras

`src/figuras/NN-slug.mjs` exporta un objeto `{ id: { caption, svg } }`. Se dibujan con el kit de
`platform/build/figkit.mjs` en un lienzo de **360 de ancho** (así su texto se lee en el celular):

```js
import { box, note, fig, R } from "../../platform/build/figkit.mjs";
const W = 360;
export default {
  "nn-separar": {
    caption: "Antes de elegir el método, pregúntate si el sólido está **disuelto**.",
    svg: fig("f-nn-sep", "Texto para lectores de pantalla", 250, `
      ${box(70, 8, 220, 50, "¿El sólido está disuelto?", "", "d-acc")}
      <path class="d-flow" marker-end="url(#f-nn-sep)" d="M130 58L80 104"/>
      ${box(6, 108, 160, 70, "Filtrar o decantar", ["arena, tierra"])}
      ${note(86, 206, "Los granos no pasan el filtro", 150, "d-s", "middle")}`, W),
  },
};
```

- Clases: cajas `d-box` (gris), `d-acc` (acento), `d-box-line` (borde); textos `d-t` (título), `d-s`
  (normal), `d-n` (números), `d-a` (acento); trazos `d-line`, `d-flow`, `d-flow-acc` (flechas con
  `marker-end="url(#<id del fig>)"` o `url(#<id>a)` para la de acento), `d-dash`; rellenos `d-fill-acc`,
  `d-fill-hair`. Sin colores fijos: así funcionan en tema claro y oscuro.
- **Objetos** (bloques, recipientes, piezas): rellenos sólidos con contorno, que se ven en los dos temas.
  `d-box` y `d-acc` son fondos suaves: no los uses para un objeto encima de otra zona (se pierde).
  - `d-obj`: gris medio con borde más oscuro (un metal, un objeto neutro).
  - `d-fill-1` … `d-fill-6`: colores para distinguir cosas (1 azul, 2 naranja, 3 verde, 4 violeta, 5 rojo,
    6 amarillo), cada uno con su borde más oscuro. `d-stroke-1` … `d-stroke-6` dan solo ese borde: para
    líneas o curvas del mismo color (`<path class="d-stroke-3" …>`), o con otro relleno.
  - `d-water`: agua u otro líquido, celeste con borde azul.
  - Ejemplo: `<rect class="d-water" …/>` y encima `<rect class="d-fill-2" …/>` (madera), `<rect class="d-obj" …/>` (hierro).
- Los ids de figura y de `fig(...)` empiezan con el número del módulo (`nn-…`, `f-nn-…`) para no chocar.
- Gráficas de datos (temperatura vs tiempo, distancia vs tiempo): ejes con `d-line`, valores con `d-n`,
  la curva con `d-flow-acc`. Que los números y las escalas sean exactos.
- **Míralas**: `node scripts/fig-preview.mjs src/figuras/NN-slug.mjs` y abre los PNG de `.cache/figs/`: cada
  figura sale dos veces, `<id>-light.png` y `<id>-dark.png`, con los colores reales de cada tema. Nada
  encimado, nada cortado, todo se distingue en los dos temas, y que se entienda sin leer el texto de la lección.

## Comprobar

```bash
node scripts/build.mjs --check --module NN-slug.md
```

Tiene que terminar en `ok`. Rechaza preguntas sin explicación o sin `[x]`, figuras o fotos desconocidas,
videos sin miniatura y textos de figura que no caben. Corre esto al final y cada vez que termines una
lección. No corras el build sin `--check` (otros están escribiendo a la vez).

## Al terminar

Responde con: las lecciones (título y minutos), cuántas preguntas, las fotos/GIFs usados (id y qué
muestran), los videos elegidos (título, canal, tramo) y cualquier duda o dato que no pudiste confirmar.
