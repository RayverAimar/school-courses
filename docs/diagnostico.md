# Diagnóstico: saltar lo que ya sabes

Una prueba de entrada, opcional, que decide **de forma determinista** qué lecciones lleva el estudiante,
cuáles se salta y desde qué paso empieza las demás. Ante la duda, siempre muestra la lección: ocultar algo
que no sabe es grave; mostrar algo que ya sabe solo cuesta unos minutos.

## El flujo

1. **Dónde se ofrece.** Una tarjeta en la página del curso ("¿Ya sabes algo de esto? Haz el diagnóstico y
   salta lo que ya dominas") y un botón "Prueba de entrada" en la cabecera de cada módulo. Rutas:
   `#/diagnostico/<curso>` (todo el curso, módulo por módulo, se puede pausar y seguir) y
   `#/diagnostico/<curso>/<modulo>` (un módulo).
2. **Autoevaluación por lección**, antes de las preguntas del módulo: una pantalla con cada lección (número,
   título y su `summary`) y 3 opciones: *No la he visto* · *Me suena* · *La sé bien*. Hay que marcar todas.
   Sola **nunca oculta nada**. "No la he visto" se salta las preguntas de esa lección y la deja completa
   (ahorra tiempo sin riesgo).
3. **Por lección, adaptativo**, en el orden del curso:
   - 2 preguntas **básicas**. Si acierta las 2 → 2 **medias**. Si acierta las 2 → 2 **avanzadas**.
   - Cada pregunta tiene además la opción **"No sé"** (cuenta como error; la pone la app, no el contenido).
   - Al primer nivel con un error se corta esa lección y pasa a la siguiente.
   - Las respuestas no se corrigen en el momento (no hay "¡Correcto!"), para no cansar ni dar pistas: se ven
     al final, en el resultado.
4. **Resultado por lección** (las pruebas del módulo nunca se ocultan):

   | Aciertos | Resultado | Qué pasa |
   |---|---|---|
   | básicas, medias y avanzadas (6/6) | **Ya lo sabes** | Se oculta: en el temario aparece plegada con "Ya lo sabes", se puede abrir igual. Cuenta como hecha. |
   | básicas y medias, falla avanzada | **Empieza en el paso avanzado** | Abre en el paso marcado `avanzado` (si no hay, en el `medio`). |
   | básicas, falla media | **Empieza en el paso medio** | Abre en el paso marcado `medio`. |
   | falla una básica o "No sé" | **Lección completa** | Normal. |

   Al empezar más adelante, los pasos anteriores quedan con su número marcado como "saltado" y se pueden
   abrir. Solo la primera vez: luego manda la posición guardada.
5. **Pantalla de resultado**: por módulo, cada lección con su resultado; el tiempo que se ahorra (minutos de
   las lecciones ocultas + la parte de las que empiezan más adelante); la **calibración** (lo que dijo en la
   autoevaluación frente a lo que mostró, en una frase: "Marcaste *La sé bien* en 3 y dominas 2");
   y las preguntas con su respuesta y su explicación.
6. **Red de seguridad.**
   - Las preguntas del `## Compruébalo` de cada lección oculta entran al **repaso espaciado** (la primera
     vez a los 3 días).
   - Si falla una de ellas (en el repaso o en la prueba del módulo, que sigue visible), la lección
     **vuelve** como lección completa, con un aviso en el inicio ("Volvió a tu lista: …, fallaste …").
7. **Volver a darlo**: por módulo, reemplaza el resultado anterior de ese módulo. Y "Borrar el diagnóstico"
   en la página del curso.
8. **Almacenamiento**: todo en las preferencias de la app (SQLite en IndexedDB), con la clave
   `placement.<curso>`. Las preguntas del diagnóstico **no** van al banco de repaso ni a los intentos de las
   lecciones (si falla, ya va a llevar la lección).

## El contenido: `_diagnostico.md` por módulo

Un archivo por módulo: `content/secundaria/ciencia-tecnologia/NN-slug/_diagnostico.md`. Un `## ` por
lección (el **nombre del archivo de la lección sin número ni `.md`**, p. ej. `evidencia-y-preguntas`), en el
orden del módulo, sin la prueba del módulo. Dentro:

````md
## variables-y-experimento-justo
<!-- medio: El grupo control -->
<!-- avanzado: Un experimento justo -->

### Básico

```pregunta
…
```

```pregunta
…
```

### Medio
(2 preguntas)

### Avanzado
(2 preguntas)
````

- `<!-- prueba: 2, 7 -->` (opcional, recomendado): los números de las preguntas de la prueba del módulo
  que miden esta lección. Si la lección quedó oculta y el estudiante falla una de ellas, vuelve a su lista.
  Sin esta línea, solo la devuelven los fallos en sus propias preguntas (repaso o lección).
- `medio:` (obligatorio) y `avanzado:` (opcional) son el **título exacto de un `## ` paso** de la lección:
  dónde empieza la parte media o avanzada. Elige el paso a partir del cual está lo que miden las preguntas
  de ese nivel; nunca `La pregunta`, `Compruébalo` ni `Resumen`. `avanzado` va después de `medio`.
- Los bloques ` ```pregunta ` usan la sintaxis de siempre (`docs/contenido.md`): `- [x]`, `> por qué`,
  `<!-- photo: id -->` y `<!-- figura: id -->` en el enunciado si hace falta.
- **Qué mide cada nivel**:
  - *Básico*: reconocer la idea central de la lección (qué es, cuál es el ejemplo correcto).
  - *Medio*: aplicarla en una situación nueva (un caso, un cálculo de un paso, una tabla sencilla).
  - *Avanzado*: nivel COAR difícil (datos, gráfica, dos pasos, el error típico como distractor).
- Las 2 preguntas de un nivel miden **ideas distintas** de la lección: entre las 6 cubren lo esencial.
- **Nuevas**: no copies ni parafrasees las preguntas de la lección, de su prueba ni de los simulacros.
- Reglas de siempre: situaciones del Perú, distractores con los errores típicos, la correcta **no** la más
  larga, claves repartidas (A–D parejas en cada módulo, nunca 3 iguales seguidas), "(datos de ejemplo)"
  cuando los datos son inventados, explicación que nombra el error de cada distractor. Enunciados cortos:
  el diagnóstico debe tomar ~1 minuto por pregunta.

`node scripts/build.mjs --check --module NN-slug` valida: cada lección del módulo (menos la prueba) tiene
su sección, con 2 + 2 + 2 preguntas, `medio` existe y es un paso de la lección, `avanzado` (si está) existe
y va después; ninguna sección sobra; `prueba` (si está) solo nombra preguntas que existen. Además avisa (sin
fallar) si las claves están desparejas, si hay tres iguales seguidas o si la correcta es claramente la más larga.
El modelo es `01-la-ciencia-y-la-indagacion/_diagnostico.md`.
