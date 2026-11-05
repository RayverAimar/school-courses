# La forma de una lección (versión 2: la de Bedrock)

Léelo junto con `docs/contenido.md` (bloques, fotos, videos, figuras, comprobación), `docs/temario-cyt.md`
(qué módulos y lecciones hay) y `docs/curriculo-cyt.md` (los desempeños). El **modelo** son las dos
lecciones ya hechas: `content/secundaria/ciencia-tecnologia/01-la-ciencia-y-la-indagacion/01-*.md` y
`02-*.md`. Imita su tono, su ritmo y su forma.

## Archivos

```
content/secundaria/ciencia-tecnologia/NN-slug/
  _modulo.md            # "# Título del módulo" y "> subtítulo"
  01-slug.md            # una lección por archivo, en orden
  02-slug.md
  …
  NN-prueba.md          # la prueba del módulo (tipo: prueba)
```

Cada lección empieza con front matter:

```md
---
title: Cambios físicos y cambios químicos
minutes: 14
summary: Una frase con lo que vas a poder hacer al terminar.
---
```

La prueba del módulo lleva además `tipo: prueba`. Cada `## ` es un **paso**: se ve **solo, en una
pantalla**, con Anterior / Siguiente abajo. **Todas** las lecciones van en pasos.

## Una lección, paso a paso

1. `## La pregunta` — una situación concreta del Perú (con su **foto o GIF real** al costado) y una
   **apuesta**: un ```` ```pregunta ```` que el estudiante responde antes de que le expliquen. Después,
   `<!-- después -->` y dos o tres líneas que conectan la respuesta con lo que viene (lo que sigue a ese
   marcador aparece recién cuando responde).
2. Un paso por idea (`## Nombre de la idea`), 4 a 6 pasos. Dentro, `### ` subtítulos que **preguntan**
   ("### ¿Y por qué se oxida más en la costa?") y párrafos cortos que responden. Ver antes de explicar:
   foto, GIF o figura primero, explicación después.
3. Preguntas **dentro** de los pasos, cuando ayudan a pensar (no todas al final).
4. Un recuadro `> **Para llevarte:** …` donde haya una idea que se debe recordar; `> **Ojo:** …` para
   el error típico (lo que antes iba en "Lo que suele confundirse": ahora va donde aparece la idea).
5. ` ```video ` en el paso donde mejor encaja (no al final por obligación).
6. `## Compruébalo` — 2 a 4 preguntas tipo examen sobre toda la lección.
7. `## Resumen` — la figura clave otra vez (si hay) y 3 a 5 viñetas.

La primera lección de cada módulo puede abrir su `## La pregunta` nombrando de qué módulo viene; la
última lección nombra lo que viene después (conexión entre módulos, en una línea, sin bloque `conecta`).

## Reglas (el feedback del dueño, para todo el curso)

- **Solo currículo y examen.** Cada paso responde a un desempeño de `docs/curriculo-cyt.md` o a algo que
  puede preguntarse en el COAR/ECE. Si no, se corta. Nada de curiosidades, biografías largas o temas de
  otros grados. El curso debe ser corto y enfocado.
- **Poco texto seguido**: no más de ~100 palabras sin algo que lo corte (subtítulo, foto, figura, tabla,
  fórmula, pregunta, recuadro). Párrafos de 2–3 líneas.
- **Fotos y GIFs al costado del texto**, no solos en el centro: el marcador `<!-- photo: id -->` va
  justo antes de los párrafos que ilustra (2 o más párrafos o una lista), nunca suelto antes de una
  figura o al final de un paso.
- **Imágenes de cualquier fuente** (Wikimedia, Google Imágenes, páginas de noticias, YouTube, bancos de
  imágenes): no importa el copyright, es material de estudio no comercial. Que sean nítidas, reales y
  muestren exactamente lo que dice el texto. Mira cada una antes de usarla.
- **GIFs donde el movimiento es la idea** (partículas, cambios de estado, la luz que se refracta, la
  Tierra girando, un circuito, la mitosis). Si no encuentras uno bueno, **créalo**: recorta unos segundos
  de un video con `yt-dlp` + `ffmpeg` (si YouTube no bloquea), o anímalo tú con Python (PIL/matplotlib)
  o con un SVG animado exportado a GIF, buscando que se vea real y limpio. `photo.ts add` acepta un `.gif`
  local (`--image ruta.gif`).
- **Preguntas con imagen de referencia** cuando ayude a conectar con el problema (no es obligatorio):
  una línea `<!-- photo: id -->` dentro del enunciado de la pregunta. No tiene que ser la escena exacta,
  sino algo que la evoque (unos clavos oxidados, un vaso con hielo, una chacra de maíz).
- **Fórmulas siempre con el bloque ` ```formula `** (y `$…$` en el texto): nunca "d = m / V" como texto
  plano o en negrita. Con leyenda de cada símbolo y su unidad. Ejemplos resueltos paso a paso con
  `$…$` en cada línea.
- **Figuras nuestras que se vean bien en los dos temas**: usa las clases `d-obj`, `d-fill-1…6`,
  `d-water` para objetos y líquidos (nunca `d-box` encima de `d-acc`: no se ve). Revisa los PNG de
  `node scripts/fig-preview.mjs src/figuras/NN-slug.mjs` en **claro y oscuro** antes de terminar: nada
  encimado, todo con buen contraste, que se entienda sin leer el texto. Si una figura de la versión 1 se
  ve mal, rehazla.
- **Tablas** solo cuando comparan; cortas (3–5 filas).
- Preguntas: las reglas de `docs/contenido.md` siguen (situaciones, distractores de errores típicos, la
  correcta no la más larga, claves repartidas). Prueba del módulo: 8–10 preguntas, al menos 3 de
  indagación o lectura de datos.
- Errores que el estudiante ya cometió y hay que reforzar: **disolver es un cambio físico** (el azúcar
  sigue siendo azúcar), **la sal disuelta no se filtra ni se asienta**, **el estómago digiere pero
  la absorción es en el intestino delgado**, **convertir unidades** (1 km = 100 000 cm).

## Ids de figuras y fotos

Figuras: `src/figuras/NN-slug.mjs` (el nombre de la carpeta del módulo), ids que empiezan con `NN-`.
Las figuras de la versión 1 están en `content/_v1/figuras/` (no se cargan): copia las que sirvan a tu
archivo nuevo, con ids que empiecen con tu número de módulo, y cambia la ruta del import a
`../../platform/build/figkit.mjs`. No edites `content/_v1/`. Fotos: reutiliza las de `content/img/photos.json` por su id; las nuevas con `photo.ts`.

## Comprobar

`node scripts/build.mjs --check --module NN-slug` (el nombre de la carpeta) debe terminar en `ok`.
Mira tu módulo en el navegador antes de terminar (Playwright, sin ventana, http://localhost:4500,
`#/c/cyt-secundaria/NN-slug/<slug-de-la-leccion>`; Escape cierra la bienvenida; fuerza las imágenes
con `img.loading='eager'`): al menos el primer paso de cada lección a 1280 y 393 px, claro y oscuro.
Cierra el navegador al terminar.
