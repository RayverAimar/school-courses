---
title: Velocidad y gráficas del MRU
minutes: 15
summary: Distinguir rapidez y velocidad, y leer una gráfica distancia–tiempo: la inclinación es la rapidez y un tramo plano es un móvil detenido.
---

## La pregunta

Una ciclista sale de su casa en Arequipa hacia un pueblo vecino. Su recorrido quedó dibujado en esta gráfica: en el eje horizontal va el **tiempo** y en el vertical, **dónde está** (la distancia desde su casa).

<!-- figura: 08-q-ciclista -->

Sin leer nada más, apuesta:

```pregunta
¿Qué hace la ciclista entre la hora 1 y la hora 2, donde la línea es horizontal?
- [ ] Va más rápido que en la primera hora.
- [x] Está detenida: su distancia no cambia.
- [ ] Regresa hacia su casa.
- [ ] Va más despacio que antes, pero avanza.
> Una línea horizontal significa que pasa el tiempo y la distancia sigue siendo la misma (20 km): está **detenida**. Si fuera más rápido, la línea subiría más; si regresara, bajaría.
```

<!-- después -->

Las gráficas se leen como un mapa del movimiento. En esta lección aprenderás a leerlas, y antes verás un detalle importante sobre la rapidez: la **dirección**.

## Rapidez y velocidad

Hay dos formas de medir «cuánto te moviste»:

- **Distancia recorrida**: todo el camino que hiciste.
- **Desplazamiento**: la línea recta de donde empezaste a donde terminaste.

<!-- figura: 08-pista -->

### ¿Y cuál se usa para la velocidad?

La **rapidez** solo dice qué tan rápido: «80 km/h». La **velocidad** dice además **hacia dónde**: «80 km/h hacia el norte», y se calcula con el **desplazamiento**.

| | Rapidez media | Velocidad media |
|---|---|---|
| Se calcula con | distancia ÷ tiempo | desplazamiento ÷ tiempo |
| ¿Tiene dirección? | No | Sí |
| Una vuelta completa a la pista | mayor que 0 | **0** |

> **Ojo:** terminar donde empezaste no es «no haberse movido». Hubo distancia y rapidez; el desplazamiento y la velocidad media son 0.

```pregunta
Un corredor da 2 vueltas completas a una pista de 400 m en 160 s. ¿Qué es correcto?
- [ ] Su rapidez media es 0 y su velocidad media es 5 m/s.
- [ ] Su rapidez y su velocidad media son de 5 m/s.
- [x] Su rapidez media es 5 m/s y su velocidad media es 0.
- [ ] Su rapidez y su velocidad media son 0.
> Distancia: $2 · 400 = 800$ m, así que la rapidez media es $800 / 160 = 5$ m/s. Terminó donde empezó: su desplazamiento es 0 y su velocidad media también.
```

## El movimiento rectilíneo uniforme

<!-- photo: cyt-mru-animado -->
El **MRU** (movimiento rectilíneo uniforme) es el más simple: el móvil va por una **línea recta** y con **rapidez constante**. Recorre **distancias iguales en tiempos iguales**, como un tren que viaja parejo por un tramo recto.

Mira la animación: el móvil avanza 10 m en cada segundo, y a la derecha se va dibujando su gráfica.

### ¿Cómo se ve en una tabla?

Mateo, el ciclista de la lección anterior, va a $2 m/s$:

| Tiempo (s) | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Distancia (m) | 0 | 2 | 4 | 6 | 8 |

En cada segundo suma 2 m. Por eso la distancia es $d = v · t$, y la relación $d / t$ siempre da lo mismo: $2 m/s$.

## La gráfica distancia–tiempo

Si marcas cada punto de la tabla en una gráfica, quedan **sobre una recta**. Cuanto **más rápido** va el móvil, **más empinada** es su recta.

<!-- figura: 08-dos-moviles -->

El móvil A recorre 10 m cada segundo y el B, 5 m cada segundo (pero B parte 20 m más adelante). Donde las rectas se cruzan, los dos están en **el mismo lugar al mismo tiempo**: a los 4 s, en los 40 m.

### ¿Cómo saco la rapidez de la gráfica?

La rapidez es la **pendiente** de la recta: cuánto sube (Δd) por cada tiempo que pasa (Δt).

```formula
v = Δd / Δt
Δd: cambio de la distancia (m)
Δt: tiempo transcurrido (s)
v: rapidez (m/s)
```

<!-- figura: 08-pendiente -->

```steps
# Leer la rapidez en una gráfica
## Elige dos puntos de la recta
Por ejemplo, $(2 s, 20 m)$ y $(6 s, 60 m)$.
## Resta
$Δd = 60 - 20 = 40$ m y $Δt = 6 - 2 = 4$ s.
## Divide
$v = 40 m / 4 s = 10 m/s$. Esa es la rapidez del móvil.
```

```video
id: TcFFPXUKC-c
titulo: MRU gráficas
canal: Física en Acción
duracion: 8:26
desde: 3:31
hasta: 6:45
- Por qué la gráfica de posición contra tiempo del MRU es una diagonal: en tiempos iguales recorre distancias iguales (5 m, 10 m, 15 m...).
- Que el valor de la pendiente de esa recta es la velocidad.
```

```pregunta
En una gráfica distancia–tiempo, un móvil pasa por los puntos (2 s, 10 m) y (6 s, 30 m). ¿Cuál es su rapidez?
- [ ] 10 m/s
- [x] 5 m/s
- [ ] 15 m/s
- [ ] 20 m/s
> Entre esos puntos $Δd = 30 - 10 = 20$ m y $Δt = 6 - 2 = 4$ s, así que $v = 20 / 4 = 5$ m/s. El 20 es solo el cambio de distancia, y 15 sale de dividir 30 m entre 2 s, sin restar.
```

## Un tramo plano: detenido

Si la recta es **horizontal**, la distancia no cambia mientras pasa el tiempo: el móvil está **detenido**. Y si en un tramo la recta es más empinada, en ese tramo va más rápido.

<!-- figura: 08-ciclista -->

### ¿Y la rapidez media de todo el viaje?

El ciclista de la figura sube 30 km en 2 h ($15 km/h$), descansa 1 h y luego recorre 40 km en 2 h ($20 km/h$). En total hizo $70$ km en $5$ h:

$v_{media} = 70 km / 5 h = 14 km/h$

Es menor que sus dos rapideces, porque el **descanso también cuenta** en el tiempo.

> **Ojo:** una recta que **sube** en la gráfica distancia–tiempo no es un móvil que «acelera»: es rapidez **constante**. Y una recta **horizontal** no es «muy rápido», es **detenido**.

## Compruébalo

```pregunta
Observa la gráfica distancia–tiempo de tres móviles (datos de ejemplo). ¿Cuál es la rapidez del móvil Y?

<!-- figura: 08-q-moviles -->

- [ ] 50 m/s
- [ ] 10 m/s
- [ ] 0 m/s
- [x] 5 m/s
> Y llega a 50 m en 10 s: $v = 50 / 10 = 5$ m/s. Los 50 m son su distancia final, no su rapidez; 10 m/s es la de X y 0 m/s sería un móvil detenido, como Z.
```

```pregunta
Un grupo mide la distancia que recorre un carrito a pilas (datos de ejemplo) y anota los datos:

| Tiempo (s) | 0 | 2 | 4 | 6 |
|---|---|---|---|---|
| Distancia (m) | 0 | 6 | 12 | 18 |

Si sigue igual, ¿qué distancia habrá recorrido a los 10 s?
- [x] 30 m
- [ ] 24 m
- [ ] 20 m
- [ ] 60 m
> En cada segundo recorre 3 m ($6 / 2 = 12 / 4 = 18 / 6 = 3$): es un MRU de $3 m/s$. A los 10 s: $d = 3 · 10 = 30$ m. El 24 sale de seguir sumando 6 por cada dato nuevo, sin ver que el tiempo salta de 6 a 10.
```

```pregunta
La recta de la gráfica de un móvil pasa por (0 s, 0 m) y por (5 s, 100 m). ¿Cuál es su rapidez en km/h?
- [ ] 20 km/h
- [ ] 20 m/s
- [ ] 24 km/h
- [x] 72 km/h
> $v = 100 / 5 = 20$ m/s. Para pasar a km/h se **multiplica** por 3,6: $20 · 3,6 = 72$ km/h. Dejar 20 es olvidar la conversión, y 24 resulta de dividir entre 3,6 en vez de multiplicar.
```

```pregunta
En la gráfica distancia–tiempo de dos corredores, la recta de Ana es más empinada que la de Luis. ¿Qué se puede afirmar?
- [x] Ana va más rápido, porque recorre más distancia por segundo.
- [ ] Los dos van igual, porque las dos rectas suben.
- [ ] Ana está detenida, porque su recta es muy inclinada.
- [ ] Luis va más rápido, porque su recta es menos empinada.
> La pendiente es la rapidez: la recta más empinada indica más metros por cada segundo. Una recta **horizontal**, no una inclinada, indica un móvil detenido.
```

## Resumen

<!-- figura: 08-ciclista -->

- **Velocidad** = rapidez con dirección (usa el desplazamiento). En una vuelta completa, la velocidad media es 0.
- **MRU**: línea recta y rapidez constante; $d = v · t$.
- En la gráfica distancia–tiempo, la **pendiente** es la rapidez: $v = Δd / Δt$. Más empinada, más rápido.
- Tramo **horizontal** = detenido; las paradas cuentan en la rapidez media.

> **Para llevarte:** ya sabes **cómo** se mueve algo. En la próxima lección verás **qué** lo mueve: las fuerzas.
