---
title: El calor se mide
minutes: 14
summary: Calcular cuánto calor necesita un cuerpo para cambiar de temperatura con la fórmula Q = m · c · ΔT.
---

## La pregunta

<!-- photo: cyt-agua-hirviendo -->
En el Cusco, doña Rosa pone a hervir 1 litro de agua que está a 15 °C. Allá el agua hierve a unos **89 °C**. A su lado deja 1 kg de hierro, que también quiere calentar hasta 89 °C con la misma cocina.

Los dos tienen la misma masa y suben los mismos grados. Apuesta:

```pregunta
¿Cuál necesita **más calor** para llegar a 89 °C?
- [x] El agua, porque cada gramo pide más calor.
- [ ] El hierro, porque es más pesado y duro que el agua.
- [ ] Los dos necesitan lo mismo, porque suben los mismos grados.
- [ ] Ninguno, porque el calor depende solo de la llama.
> Con la misma masa y los mismos grados, el **agua** necesita bastante más calor: cada material pide una cantidad distinta. Eso lo mide una propiedad que verás hoy, el calor específico.
```

<!-- después -->

En la lección anterior viste que el calor es energía que pasa de un cuerpo a otro. Hoy aprenderás a **calcular cuánta** energía pasa.

## Qué cambia el calor que necesitas

Para calentar algo, la cantidad de calor depende de tres cosas.

### ¿Y si hay más masa?

Calentar 2 litros de agua necesita el **doble** de calor que calentar 1 litro: hay el doble de partículas a las que dar energía.

### ¿Y si quiero subirla más grados?

Subir 40 °C necesita el **doble** que subir 20 °C: cada partícula debe moverse más rápido.

### ¿Y si cambia el material?

Aquí está la sorpresa del Cusco: la cantidad de calor que necesita **1 g** para subir 1 °C depende del material. A esa cantidad se le llama **calor específico** (**c**).

## El calor específico

El **calor específico** es el calor que necesita **1 g** de una sustancia para subir su temperatura **1 °C**. Se escribe $c$ y se mide en cal/g·°C.

<!-- figura: 07-calor-especifico -->

El agua necesita **1 cal** para subir 1 g un grado. Los metales necesitan mucho menos: por eso una olla de metal se calienta enseguida, y el agua tarda.

### ¿Y por qué importa en la costa?

Como el agua necesita tanto calor para cambiar de temperatura, el mar se calienta y se enfría **más despacio** que la tierra o la arena. Por eso el mar mantiene un clima más suave que el desierto.

## La fórmula del calor

Juntando las tres cosas (masa, material y cambio de temperatura) sale la fórmula:

```formula
Q = m · c · ΔT
---
ΔT = T_f - T_i
Q: calor (cal)
m: masa (g)
c: calor específico (cal/g·°C)
ΔT: cambio de temperatura (°C)
T_f: temperatura final (°C)
T_i: temperatura inicial (°C)
```

Para el agua, $c = 1$ cal/g·°C. En joules, 1 cal equivale a unos 4,18 J, pero en este módulo trabajaremos con calorías.

> **Ojo:** $ΔT$ es la temperatura **final menos la inicial**, no la temperatura final. Y la masa va en **gramos**: 1 litro de agua pesa 1 000 g.

```video
id: y1QlZbcH4qM
titulo: Cómo se calcula el calor necesario para calentar cierta cantidad de agua
canal: Física con Juan
duracion: 4:04
desde: 0:00
hasta: 3:50
- Un problema como el del Ejemplo 1: medio litro de agua que sube de 15 °C a 65 °C.
- Cómo pasa los 0,5 litros a 500 gramos antes de usar la fórmula.
- Cómo se tachan las unidades hasta que queda solo cal, y la respuesta en kilocalorías.
```

## Ejemplos resueltos

Ahora úsala con números.

### Ejemplo 1: calentar agua

<!-- figura: 07-q-agua -->

```steps
# ¿Cuánto calor recibe 200 g de agua que sube de 20 °C a 70 °C?
## Escribe la fórmula
$Q = m · c · ΔT$
## Calcula el cambio de temperatura
$ΔT = 70 - 20 = 50 °C$
## Reemplaza los datos
$Q = 200 g · 1 cal/g·°C · 50 °C$
## Calcula
$Q = 10 000 cal$ (10 kcal)
```

### Ejemplo 2: calentar un metal

```steps
# ¿Cuánto calor necesitan 500 g de aluminio ($c = 0,22$ cal/g·°C) para subir de 20 °C a 80 °C?
## Cambio de temperatura
$ΔT = 80 - 20 = 60 °C$
## Reemplaza los datos
$Q = 500 g · 0,22 cal/g·°C · 60 °C$
## Calcula
$Q = 6 600 cal$
```

```pregunta
Una olla con 300 g de agua pasa de 20 °C a 60 °C. ¿Cuánto calor recibió? (c del agua = 1 cal/g·°C)
- [ ] 18 000 cal
- [ ] 6 000 cal
- [ ] 340 cal
- [x] 12 000 cal
> $ΔT = 60 - 20 = 40 °C$, y $Q = 300 · 1 · 40 = 12 000$ cal. Quien obtiene 18 000 multiplica por la temperatura final (60) y quien obtiene 6 000, por la inicial (20): hay que usar la **diferencia**.
```

## Compruébalo

```pregunta
En el Cusco, doña Rosa calienta 1 litro de agua (1 000 g) de 15 °C a 89 °C. ¿Cuánto calor necesita?
- [ ] 89 000 cal
- [ ] 15 000 cal
- [x] 74 000 cal
- [ ] 104 000 cal
> $ΔT = 89 - 15 = 74 °C$, así que $Q = 1 000 · 1 · 74 = 74 000$ cal. 89 000 usa la temperatura final, 15 000 la inicial y 104 000 las suma: ninguna es una diferencia.
```

```pregunta
Dos bloques de 100 g, uno de agua y otro de hierro ($c = 0,11$ cal/g·°C), reciben 1 000 cal cada uno. ¿Cuál sube más su temperatura?
- [ ] El agua, porque necesita más calor para cada grado.
- [x] El hierro, porque necesita menos calor para cada grado.
- [ ] Los dos igual, porque reciben el mismo calor y masa.
- [ ] No se puede saber sin conocer su temperatura inicial.
> El agua sube $1 000 / (100 · 1) = 10$ °C y el hierro unos 91 °C. Con la misma masa y el mismo calor, sube más el que tiene **menor** calor específico. La temperatura inicial no cambia cuánto sube.
```

```pregunta
Un estudiante da la misma cantidad de calor a 100 g de cuatro materiales y mide cuánto sube la temperatura de cada uno (datos de ejemplo).

| Material | Cambio de temperatura |
|---|---|
| A | 5 °C |
| B | 23 °C |
| C | 45 °C |
| D | 56 °C |

¿Cuál es el material con **mayor** calor específico?
- [x] A, porque es el que menos subió con ese calor.
- [ ] D, porque es el que más subió con ese calor.
- [ ] A, porque es el que más calor recibió de los cuatro.
- [ ] D, porque es el que menos calor necesita para calentarse.
> Si el calor y la masa son iguales, **menos subida** significa **más** calor específico: A necesita mucho calor por cada grado, como el agua. D sube mucho con poco calor, como un metal.
```

## Resumen

- El calor necesario depende de la **masa**, del **material** y del **cambio de temperatura**.
- **Calor específico** $c$: calor que necesita 1 g para subir 1 °C. Agua: 1 cal/g·°C.
- Fórmula: $Q = m · c · ΔT$, con $ΔT$ = temperatura final − temperatura inicial.
- El agua necesita mucho calor para cambiar de temperatura; los metales, poco.

> **Para llevarte:** ya sabes cuánto calor pasa. En la siguiente lección verás **hacia dónde** pasa y hasta cuándo.
