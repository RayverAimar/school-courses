---
title: Distancia, tiempo y rapidez
minutes: 14
summary: Calcular la rapidez, la distancia o el tiempo de un movimiento, convertir km/h a m/s, y evitar la trampa de la rapidez media.
---

## La pregunta

<!-- photo: cyt-ciclistas-lima -->
Un domingo, en el centro de Lima, cierran la avenida para que la gente pedalee. Mateo avanza **2 m cada segundo** y mantiene siempre ese ritmo.

Con ese dato puedes saber **dónde estará** dentro de un rato, sin verlo. Antes de aprender cómo, apuesta:

```pregunta
Si Mateo mantiene ese ritmo, ¿cuántos metros recorre en 10 segundos?
- [ ] 12 m
- [ ] 5 m
- [x] 20 m
- [ ] 0,2 m
> Avanza 2 m en **cada** segundo, así que en 10 segundos recorre $2 · 10 = 20$ m. Sumar (12) o dividir (5 y 0,2) no sigue lo que dice el dato.
```

<!-- después -->

Ese «metros por cada segundo» se llama **rapidez**. En este módulo la vas a usar para describir cualquier movimiento: el del Metro, el de una combi, el de una gráfica.

## Distancia, tiempo y rapidez

<!-- photo: cyt-estroboscopica-pelota -->
Esta foto se hizo con una luz que destella cada cierto tiempo, y en cada destello queda marcada la pelota. Donde las pelotas están **más separadas**, recorrió más **distancia** en el mismo **tiempo**: iba más rápido.

La **rapidez** dice cuánta distancia recorre un cuerpo en cada unidad de tiempo.

### ¿Cómo se calcula?

Se divide la distancia entre el tiempo. Y si conoces dos de los tres datos, puedes despejar el tercero:

```formula
v = d / t
---
d = v · t
---
t = d / v
v: rapidez (m/s o km/h)
d: distancia recorrida (m o km)
t: tiempo (s o h)
```

```steps
# Un bus recorre 150 km en 3 h
## Escribe los datos
$d = 150$ km y $t = 3$ h. Pide la rapidez.
## Usa la fórmula
$v = d / t = 150 km / 3 h$
## Resultado con unidad
$v = 50 km/h$: en promedio, avanza 50 km cada hora.
```

### ¿Y si me piden la distancia o el tiempo?

Usas el despeje que corresponde. Un Metro que va a $20 m/s$ durante $30 s$ recorre $d = v · t = 20 · 30 = 600$ m. Un auto que debe recorrer 180 km a $60 km/h$ tarda $t = d / v = 180 / 60 = 3$ h.

```video
id: XpfCaJw-0hc
titulo: Velocidad, rapidez y aceleración | Diferencias y ejemplos
canal: LearnFree en Español
duracion: 5:37
desde: 0:34
hasta: 2:25
- La rapidez como la relación entre la distancia que recorre un objeto y el tiempo que tarda (km/h en la carretera).
- Que la velocidad suma la dirección: "850 km/h" es rapidez; "850 km/h hacia el sur" es velocidad.
```

> **Para llevarte:** rapidez = distancia ÷ tiempo. La unidad te lo recuerda: **m/s** es metros (distancia) sobre segundos (tiempo).

## Unidades: convierte antes de calcular

Para calcular, las unidades de la distancia y del tiempo deben **coincidir** con las de la rapidez. Si no, primero conviertes.

| Longitud | Tiempo |
|---|---|
| 1 km = 1 000 m | 1 h = 60 min |
| 1 m = 100 cm | 1 min = 60 s |
| 1 km = 100 000 cm | 1 h = 3 600 s |

### ¿Y cómo paso de km/h a m/s?

<!-- figura: 08-conversion -->

Porque 1 km son 1 000 m y 1 h son 3 600 s, la regla es siempre la misma: **km/h ÷ 3,6 = m/s**. Para volver, multiplicas: **m/s × 3,6 = km/h**.

| km/h | 36 | 54 | 72 | 90 | 108 |
|---|---|---|---|---|---|
| m/s | 10 | 15 | 20 | 25 | 30 |

> **Ojo:** al pasar de km/h a m/s el número **baja** (se divide). Un bus a $72 km/h$ va a $20 m/s$, no a $259 m/s$.

### ¿Y si el tiempo está en minutos?

Conviertes antes: un ciclista a $60 km/h$ durante $30 min$ **no** recorre $60 · 30$. Primero $30 min = 0,5 h$, y luego $d = 60 · 0,5 = 30$ km.

```pregunta
Una corredora avanza a 18 km/h. ¿A cuántos m/s equivale?
- [ ] 64,8 m/s
- [x] 5 m/s
- [ ] 0,3 m/s
- [ ] 18 m/s
> Se divide entre 3,6: $18 / 3,6 = 5$ m/s. Multiplicar (64,8) es el error típico, 0,3 sale de dividir entre 60 y 18 m/s no cambió la unidad.
```

## La rapidez media y su trampa

La rapidez media de un viaje es **toda la distancia entre todo el tiempo**, con paradas y cambios de ritmo incluidos. No es el promedio de las rapideces.

Una combi va a un pueblo a 60 km de distancia a **30 km/h** y regresa por el mismo camino a **60 km/h**. Mucha gente responde 45 km/h, el promedio de 30 y 60. **Es incorrecto.**

<!-- figura: 08-trampa -->

### ¿Por qué da 40 y no 45?

Porque la combi pasa **más tiempo** yendo despacio (2 h) que rápido (1 h), y el promedio se inclina hacia la rapidez menor. Por eso primero hallas cada tiempo con $t = d / v$ y luego divides los totales.

> **Ojo:** si en el problema hay ida y vuelta con rapideces distintas, **no promedies las rapideces**. Suma las distancias, suma los tiempos y divide.

```pregunta
Un bus recorre 90 km de ida a 30 km/h y regresa por el mismo camino a 90 km/h. ¿Cuál es su rapidez media en todo el viaje?
- [ ] 60 km/h
- [ ] 30 km/h
- [ ] 90 km/h
- [x] 45 km/h
> Ida: $90 / 30 = 3$ h. Vuelta: $90 / 90 = 1$ h. Total: 180 km en 4 h, es decir $180 / 4 = 45$ km/h. El 60 km/h sale de promediar 30 y 90.
```

## Compruébalo

```pregunta
Un tren del Metro de Lima recorre 600 m en 30 s con rapidez constante. ¿Cuál es su rapidez?
- [x] 20 m/s
- [ ] 18 000 m/s
- [ ] 630 m/s
- [ ] 0,05 m/s
> $v = d / t = 600 / 30 = 20$ m/s. Multiplicar (18 000) o sumar (630) no es la fórmula, y 0,05 sale de dividir el tiempo entre la distancia.
```

```pregunta
Una combi viaja a 60 km/h por una carretera recta. ¿Cuánto tarda en recorrer 180 km?
- [ ] 0,33 h
- [ ] 120 h
- [x] 3 h
- [ ] 240 h
> $t = d / v = 180 / 60 = 3$ h. Dividir al revés da 0,33; restar da 120 y sumar da 240.
```

```pregunta
Un auto recorre 2 km en 100 s. ¿Cuál es su rapidez en m/s?
- [x] 20 m/s
- [ ] 50 m/s
- [ ] 0,02 m/s
- [ ] 200 m/s
> Primero pasa 2 km a 2 000 m. Luego $v = 2 000 / 100 = 20$ m/s. Sin convertir sale 0,02, y 50 resulta de dividir 100 entre 2.
```

```pregunta
Un ciclista va a 60 km/h durante 30 minutos. ¿Qué distancia recorre?
- [ ] 1 800 km
- [ ] 60 km
- [ ] 90 km
- [x] 30 km
> Primero 30 min = 0,5 h. Luego $d = v · t = 60 · 0,5 = 30$ km. Multiplicar 60 por 30 (1 800) mezcla horas con minutos.
```

## Resumen

<!-- figura: 08-trampa -->

- Rapidez = distancia ÷ tiempo; con los despejes calculas también la distancia y el tiempo.
- Antes de calcular, las unidades deben coincidir: 1 km = 1 000 m; 1 h = 3 600 s; km/h ÷ 3,6 = m/s.
- Rapidez media = distancia total ÷ tiempo total; con ida y vuelta, no se promedian las rapideces.

> **Para llevarte:** en la próxima lección dibujarás este movimiento en una gráfica, y verás que la rapidez se lee en la **inclinación** de la recta.
