---
title: Evaluar y mejorar con datos
minutes: 15
summary: Probar un prototipo con una prueba justa, compararlo con los requerimientos usando datos, proponer mejoras y determinar su impacto ambiental.
---

## La pregunta

<!-- photo: cyt-feria-ciencias-maestro -->
Un grupo hizo dos termas solares caseras con botellas: una pintada de negro y otra transparente. Pusieron la misma cantidad de agua, en el mismo lugar y a la misma hora, y midieron la temperatura cada 30 minutos.

Ya construiste y verificaste tu prototipo. Ahora hay que **probarlo con datos**. Mira la gráfica y apuesta:

<!-- figura: 16-grafica-terma -->

```pregunta
Según la gráfica de ejemplo, ¿qué pasó a los 120 minutos?
- [x] La botella negra llegó a 50 °C y la clara a 32 °C.
- [ ] La botella clara llegó a 50 °C y la negra a 32 °C.
- [ ] Las dos botellas llegaron a la misma temperatura.
- [ ] La botella negra llegó a 32 °C y la clara a 18 °C.
> La curva de la botella negra termina en 50 °C y la de la clara en 32 °C. Partieron de 18 °C. Como lo demás era igual, la diferencia se debe al color.
```

<!-- después -->

Leer bien los datos es la mitad de evaluar. La otra mitad es compararlos con lo que la solución **debía** lograr.

## Una prueba justa contra los requerimientos

Para probar un prototipo se repite lo que ya sabes de indagación: **cambias una sola cosa** (variable independiente), **mides el resultado** (dependiente) y **mantienes iguales** las demás.

En la terma: se cambia el **color**; se mide la **temperatura del agua**; se mantienen iguales el volumen, el lugar y la hora.

### ¿Cómo sé si "funciona"?

Comparas el dato con el **requerimiento** que fijaste. Supón que la terma debía **subir el agua a por lo menos 40 °C en 2 horas**.

| Prototipo | Temperatura a los 120 min | ¿Cumple (≥ 40 °C)? |
|---|---|---|
| A: botella negra | 50 °C | Sí |
| B: botella clara | 32 °C | No |

El prototipo A cumple; el B no. Así se decide **con datos**, no por cómo se ve.

> **Ojo:** si en una prueba cambian el color **y** el lugar, no sabes cuál causó la diferencia. Es el mismo error de cualquier experimento injusto.

## Leer los datos y proponer mejoras

Otro grupo colgó tres mallas de atrapanieblas la misma noche, en el mismo cerro. Lo único distinto era el tamaño de los **huecos**.

<!-- figura: 16-grafica-malla -->

### ¿Qué dicen los datos?

La malla B (huecos de 1 mm) juntó **410 mL**, más que la muy abierta (120 mL) y que la muy cerrada (150 mL). Hay un tamaño **intermedio** que funciona mejor.

### ¿Y qué mejora propones?

Una buena mejora **sale de los datos**: probar huecos cercanos a 1 mm (por ejemplo 0,5 y 2 mm), con la misma noche, el mismo cerro y la misma cantidad de malla. No se cambia todo a la vez.

```pregunta
Con los datos de ejemplo de las tres mallas, ¿cuál es una conclusión **válida**?
- [ ] Mientras más cerrada la malla, más agua junta.
- [ ] El tamaño de los huecos no influye en el agua.
- [x] Un tamaño intermedio de huecos juntó más agua.
- [ ] La malla A es la mejor porque deja pasar el viento.
> B (410 mL) juntó más que A (120 mL) y que C (150 mL). Más cerrada no es mejor (C juntó menos que B) y el tamaño sí influye.
```

## Impacto ambiental

Al evaluar una solución también se **determina su impacto ambiental**: qué efecto tiene en el ambiente **al fabricarla, al usarla y cuando termina su vida útil**.

<!-- photo: cyt-casa-caliente-pucp -->
### ¿Qué impacto tiene una casa caliente?

En la puna las noches son de helada. Una **casa caliente** tiene paredes gruesas, techo de ichu y una ventana inclinada hacia el Sol. **Capta** el calor del Sol de día y **aísla** para que no se escape de noche. No quema leña ni gas, así que casi no contamina el aire de la casa.

Datos de ejemplo de una noche de helada (afuera: −5 °C):

| Casa | Temperatura adentro (°C) |
|---|---|
| Sin aislante y con rendijas | 3 |
| Con techo de ichu y rendijas selladas | 10 |

El aislante no **produce** calor: solo frena su salida. Por eso adentro hace más calor que afuera, pero sigue siendo fresca.

### ¿Y los materiales?

Se pregunta si son **locales** (se transportan poco), si se pueden **reutilizar** o si crean **residuos** difíciles de eliminar. El ichu es local y se renueva; un plástico que se tira a la calle tarda siglos en degradarse.

> **Para llevarte:** evaluar es comparar datos con los requerimientos, proponer mejoras que salgan de esos datos y determinar el impacto ambiental. Si falla, se vuelve a un paso anterior: es un **ciclo**.

<!-- figura: 16-ciclo-diseno -->

## Compruébalo

```pregunta
Un grupo prueba tres filtros con la misma agua de río (datos de ejemplo) y mide la turbidez (0 = transparente, 100 = muy turbia).

| Filtro | Capas | Turbidez |
|---|---|---|
| Sin filtrar | — | 80 |
| A | Solo arena | 25 |
| B | Arena y carbón | 12 |
| C | Grava, arena y carbón | 4 |

¿Qué conclusión es válida?
- [ ] El filtro A quita los gérmenes del agua porque es el más simple.
- [x] El C dejó el agua menos turbia, pero igual hay que hervirla.
- [ ] El carbón no sirvió, porque no cambió nada en el agua.
- [ ] Los tres filtros dejaron el agua igual de clara.
> Con más capas la turbidez bajó de 80 a 4. La turbidez no mide los gérmenes ni las sales disueltas, así que el agua aún debe hervirse o clorarse. El carbón sí ayudó (de 25 a 12).
```

```pregunta
Rosa quiere saber si el color de una botella cambia cuánto se calienta el agua. ¿Qué debe ser **igual** en las dos botellas para que la prueba sea justa?
- [x] El volumen de agua y el lugar.
- [ ] El color de la botella.
- [ ] La temperatura final del agua.
- [ ] El tiempo en que cada una se calienta.
> El color es lo que se prueba y la temperatura final es lo que se mide: no pueden ser iguales. El volumen y el lugar se mantienen iguales (variables controladas).
```

```pregunta
Se quiere que un atrapanieblas junte más agua. Una de las mallas de 1 mm juntó 410 mL (datos de ejemplo) y el requerimiento era 500 mL. ¿Qué mejora se desprende de los datos?
- [ ] Cambiar a una malla de 5 mm, que dejó pasar más aire.
- [ ] Cambiar a una malla de 0,2 mm, porque es más cerrada.
- [ ] No hacer nada, porque 410 mL es suficiente.
- [x] Probar huecos cercanos a 1 mm, sin cambiar lo demás.
> 5 mm y 0,2 mm juntaron menos que 1 mm. Lo que pide el dato es afinar alrededor de 1 mm y cambiar una sola cosa. 410 mL no cumple el requerimiento de 500 mL.
```

## Resumen

<!-- figura: 16-ciclo-diseno -->

- **Prueba justa**: cambias una cosa, mides el resultado y mantienes iguales las demás.
- **Evaluar** es comparar los datos con los **requerimientos**.
- Las **mejoras** salen de los datos, de una en una.
- **Impacto ambiental**: al fabricar, usar y desechar. Si falla, se vuelve atrás.

> **Para llevarte:** en la próxima lección, la pregunta ya no es si una tecnología **funciona**, sino si conviene y a quién beneficia.
