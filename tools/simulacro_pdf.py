import sys, os
from collections import Counter

OUT = sys.argv[1]
L = "ABCD"

# ---------- SVG figures ----------

def svg_palitos():
    s = 46; g = 8; parts = []
    def palito(x1, y1, x2, y2):
        parts.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#7a7a7a" stroke-width="4.5" stroke-linecap="round"/>'
                     f'<circle cx="{x2}" cy="{y2}" r="3.6" fill="#111"/>')
    def fig(n, x0, y0=12):
        for i in range(n):
            x = x0 + i * s
            palito(x + g, y0, x + s - g, y0)
            palito(x + g, y0 + s, x + s - g, y0 + s)
        for i in range(n + 1):
            x = x0 + i * s
            palito(x, y0 + s - g, x, y0 + g)
        return x0 + n * s / 2
    c1 = fig(1, 20); c2 = fig(2, 120); c3 = fig(3, 266)
    lab = "".join(f'<text x="{c}" y="88" font-size="12" text-anchor="middle" fill="#222">Figura {k}</text>' for k, c in ((1, c1), (2, c2), (3, c3)))
    return f'<svg viewBox="0 0 420 96" width="420" class="fig">{"".join(parts)}{lab}</svg>'

def svg_barras():
    vals = [("Lun", 12), ("Mar", 18), ("Mié", 15), ("Jue", 9), ("Vie", 21)]
    W, H, x0, y0 = 360, 200, 40, 170; sc = 6
    g = []
    for t in range(0, 25, 3):
        y = y0 - t * sc
        g.append(f'<line x1="{x0}" y1="{y}" x2="{W-10}" y2="{y}" stroke="#e2e2e2"/><text x="{x0-6}" y="{y+4}" class="ax" text-anchor="end">{t}</text>')
    for i, (d, v) in enumerate(vals):
        x = x0 + 18 + i * 62
        g.append(f'<rect x="{x}" y="{y0-v*sc}" width="34" height="{v*sc}" rx="3" fill="#9a9a9a"/><text x="{x+17}" y="{y0-v*sc-5}" class="vl">{v}</text><text x="{x+17}" y="{y0+15}" class="ax" text-anchor="middle">{d}</text>')
    g.append(f'<line x1="{x0}" y1="{y0}" x2="{W-10}" y2="{y0}" stroke="#333"/>')
    g.append(f'<text x="12" y="95" class="ax" transform="rotate(-90 12 95)" text-anchor="middle">Queques vendidos</text>')
    return f'<svg viewBox="0 0 {W} {H}" width="{W}" class="fig"><style>.ax{{font-size:11px;fill:#444}}.vl{{font-size:11px;fill:#222;font-weight:600;text-anchor:middle}}</style>{"".join(g)}</svg>'

def svg_figura_compuesta():
    k = 24; ox, oy = 30, 20
    P = [(0,0),(3,0),(5,3),(7,0),(10,0),(10,6),(0,6)]
    pts = " ".join(f"{ox+x*k},{oy+y*k}" for x, y in P)
    return f'''<svg viewBox="0 0 320 200" width="300" class="fig"><style>.t{{font-size:12px;fill:#222}}</style>
<polygon points="{pts}" fill="#efefef" stroke="#111" stroke-width="2"/>
<line x1="{ox+3*k}" y1="{oy}" x2="{ox+7*k}" y2="{oy}" stroke="#111" stroke-dasharray="4 3"/>
<line x1="{ox+5*k}" y1="{oy}" x2="{ox+5*k}" y2="{oy+3*k}" stroke="#111" stroke-dasharray="3 3"/>
<text x="{ox+5*k+4}" y="{oy+1.0*k}" style="font-size:10.5px">3 cm</text>
<text x="{ox+5*k}" y="{oy-6}" class="t" text-anchor="middle">4 cm</text>
<text x="{ox+5*k}" y="{oy+6*k+18}" class="t" text-anchor="middle">10 cm</text>
<text x="{ox+10*k+6}" y="{oy+3*k+4}" class="t">6 cm</text></svg>'''

def svg_escalera():
    u = 13; gy = 200; wx = 170
    bx = wx - 5 * u; ty = gy - 12 * u
    return f"""<svg viewBox="0 0 260 230" width="230" class="fig">
<defs><marker id="fl" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" fill="#111"/></marker></defs>
<rect x="{wx}" y="18" width="20" height="{gy-18}" fill="#dedede" stroke="#444"/>
<line x1="40" y1="{gy}" x2="235" y2="{gy}" stroke="#444" stroke-width="2"/>
<line x1="{bx}" y1="{gy}" x2="{wx}" y2="{ty}" stroke="#555" stroke-width="5" stroke-linecap="round"/>
<path d="M{wx-10},{gy} v-10 h10" fill="none" stroke="#444"/>
<text x="{(bx+wx)/2-14}" y="{(gy+ty)/2}" font-size="13" text-anchor="end" fill="#111">13 m</text>
<line x1="{bx}" y1="{gy+14}" x2="{wx}" y2="{gy+14}" stroke="#111" marker-start="url(#fl)" marker-end="url(#fl)"/>
<text x="{(bx+wx)/2}" y="{gy+28}" font-size="13" text-anchor="middle" fill="#111">5 m</text>
<line x1="{wx}" y1="{ty}" x2="{wx+40}" y2="{ty}" stroke="#111" stroke-dasharray="3 3"/>
<line x1="{wx+34}" y1="{ty}" x2="{wx+34}" y2="{gy}" stroke="#111" marker-start="url(#fl)" marker-end="url(#fl)"/>
<text x="{wx+40}" y="{(gy+ty)/2+5}" font-size="14" font-style="italic" fill="#111">h</text>
</svg>"""

def svg_tanque():
    return '''<svg viewBox="0 0 260 170" width="240" class="fig"><style>.t{font-size:12px;fill:#222}</style>
<polygon points="30,60 170,60 220,25 80,25" fill="#f2f2f2" stroke="#111" stroke-width="1.5"/>
<polygon points="170,60 220,25 220,105 170,140" fill="#d9d9d9" stroke="#111" stroke-width="1.5"/>
<rect x="30" y="60" width="140" height="80" fill="#efefef" stroke="#111" stroke-width="1.5"/>
<text x="100" y="158" class="t" text-anchor="middle">2 m</text>
<text x="205" y="138" class="t">1,5 m</text>
<text x="8" y="104" class="t">1 m</text></svg>'''

def svg_cartesiano():
    k = 26; ox, oy = 30, 170
    g = []
    for i in range(0, 8):
        g.append(f'<line x1="{ox+i*k}" y1="{oy}" x2="{ox+i*k}" y2="{oy-6*k}" stroke="#e2e2e2"/>')
        g.append(f'<text x="{ox+i*k}" y="{oy+14}" class="a" text-anchor="middle">{i}</text>')
    for j in range(0, 7):
        g.append(f'<line x1="{ox}" y1="{oy-j*k}" x2="{ox+7*k}" y2="{oy-j*k}" stroke="#e2e2e2"/>')
        if j: g.append(f'<text x="{ox-8}" y="{oy-j*k+4}" class="a" text-anchor="end">{j}</text>')
    g.append(f'<line x1="{ox}" y1="{oy}" x2="{ox+7*k+8}" y2="{oy}" stroke="#333"/><line x1="{ox}" y1="{oy}" x2="{ox}" y2="{oy-6*k-8}" stroke="#333"/>')
    A, B, C = (1,1), (5,1), (5,4)
    pts = " ".join(f"{ox+x*k},{oy-y*k}" for x, y in (A, B, C))
    g.append(f'<polygon points="{pts}" fill="rgba(0,0,0,.07)" stroke="#111" stroke-width="2"/>')
    for n, (x, y), dx, dy in [("A", A, -14, 14), ("B", B, 6, 14), ("C", C, 6, -4)]:
        g.append(f'<circle cx="{ox+x*k}" cy="{oy-y*k}" r="3.5" fill="#111"/><text x="{ox+x*k+dx}" y="{oy-y*k+dy}" class="p">{n}</text>')
    g.append(f'<text x="{ox+7*k+12}" y="{oy+4}" class="a">x</text><text x="{ox-4}" y="{oy-6*k-12}" class="a">y</text>')
    return f'<svg viewBox="0 0 250 195" width="240" class="fig"><style>.a{{font-size:10px;fill:#555}}.p{{font-size:13px;font-weight:700;fill:#111}}</style>{"".join(g)}</svg>'

def svg_redes():
    nets = {
        "A": [(1,0),(0,1),(1,1),(2,1),(3,1),(1,2)],
        "B": [(0,0),(0,1),(1,1),(2,1),(3,1),(3,2)],
        "C": [(0,0),(1,0),(2,0),(0,1),(1,1),(2,1)],
        "D": [(0,0),(1,0),(1,1),(2,1),(2,2),(3,2)],
    }
    s = 20; out = []
    for i, (lab, cells) in enumerate(nets.items()):
        x0 = 10 + i * 112
        for (c, r) in cells:
            out.append(f'<rect x="{x0+c*s}" y="{12+r*s}" width="{s}" height="{s}" fill="#efefef" stroke="#111" stroke-width="1.5"/>')
        out.append(f'<text x="{x0+40}" y="92" class="l">{lab}</text>')
    return f'<svg viewBox="0 0 450 100" width="440" class="fig"><style>.l{{font-size:13px;font-weight:700;fill:#111;text-anchor:middle}}</style>{"".join(out)}</svg>'

def balanza(x0, izq, der):
    return f"""<g transform="translate({x0},0)">
<path d="M12,66 h72 l-6,8 h-60 z" fill="#d0d0d0" stroke="#444"/><path d="M116,66 h72 l-6,8 h-60 z" fill="#d0d0d0" stroke="#444"/>
<line x1="48" y1="74" x2="48" y2="84" stroke="#444" stroke-width="2"/><line x1="152" y1="74" x2="152" y2="84" stroke="#444" stroke-width="2"/>
<line x1="40" y1="84" x2="160" y2="84" stroke="#444" stroke-width="4"/>
<polygon points="100,84 88,124 112,124" fill="#888"/><rect x="66" y="124" width="68" height="6" fill="#666"/>
{izq}{der}</g>"""

def manzana(x, y=56):
    return f'<circle cx="{x}" cy="{y}" r="10" fill="#6a6a6a"/><text x="{x}" y="{y+4}" font-size="11" fill="#fff" text-anchor="middle" font-weight="700">M</text>'

def pera(x, y=51):
    return f'<ellipse cx="{x}" cy="{y}" rx="10" ry="15" fill="#bdbdbd" stroke="#555"/><text x="{x}" y="{y+4}" font-size="11" fill="#111" text-anchor="middle" font-weight="700">P</text>'

def svg_balanzas():
    b1 = balanza(0, manzana(24) + manzana(48) + manzana(72), pera(138) + pera(164))
    pesa = '<rect x="132" y="38" width="40" height="28" rx="3" fill="#444"/><text x="152" y="56" font-size="11" fill="#fff" text-anchor="middle" font-weight="700">250 g</text>'
    b2 = balanza(230, pera(34) + manzana(60), pesa)
    lab = '<text x="100" y="150" font-size="12" fill="#222" text-anchor="middle">Balanza 1</text><text x="330" y="150" font-size="12" fill="#222" text-anchor="middle">Balanza 2</text>'
    return f'<svg viewBox="0 0 430 158" width="430" class="fig">{b1}{b2}{lab}</svg>'

def svg_disolucion():
    data = [(10, 62), (25, 38), (40, 24), (60, 15)]
    ox, oy, sx, sy = 40, 160, 4.2, 2
    g = []
    for t in range(0, 71, 10):
        g.append(f'<line x1="{ox}" y1="{oy-t*sy}" x2="{ox+65*sx}" y2="{oy-t*sy}" stroke="#e2e2e2"/><text x="{ox-6}" y="{oy-t*sy+4}" class="a" text-anchor="end">{t}</text>')
    for t in range(0, 61, 10):
        g.append(f'<text x="{ox+t*sx}" y="{oy+14}" class="a" text-anchor="middle">{t}</text>')
    g.append(f'<line x1="{ox}" y1="{oy}" x2="{ox+65*sx}" y2="{oy}" stroke="#333"/><line x1="{ox}" y1="{oy}" x2="{ox}" y2="{oy-72*sy}" stroke="#333"/>')
    pts = " ".join(f"{ox+t*sx},{oy-v*sy}" for t, v in data)
    g.append(f'<polyline points="{pts}" fill="none" stroke="#9a9a9a" stroke-width="2.5"/>')
    for t, v in data:
        g.append(f'<circle cx="{ox+t*sx}" cy="{oy-v*sy}" r="4" fill="#111"/>')
    g.append(f'<text x="{ox+32*sx}" y="{oy+30}" class="a" text-anchor="middle">Temperatura del agua (°C)</text>')
    g.append(f'<text x="12" y="{oy-35*sy}" class="a" transform="rotate(-90 12 {oy-35*sy})" text-anchor="middle">Tiempo (s)</text>')
    return f'<svg viewBox="0 0 330 200" width="300" class="fig"><style>.a{{font-size:10.5px;fill:#444}}</style>{"".join(g)}</svg>'

def svg_cadena():
    items = ["Fitoplancton", "Zooplancton", "Pez pequeño", "Ave pescadora"]
    g = []
    for i, t in enumerate(items):
        x = 8 + i * 118
        g.append(f'<rect x="{x}" y="14" width="96" height="36" rx="8" fill="#fff" stroke="#111"/><text x="{x+48}" y="37" font-size="12" text-anchor="middle" fill="#111">{t}</text>')
        if i < 3:
            g.append(f'<line x1="{x+98}" y1="32" x2="{x+114}" y2="32" stroke="#333" stroke-width="2" marker-end="url(#ar)"/>')
    return f'<svg viewBox="0 0 480 60" width="470" class="fig"><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#333"/></marker></defs>{"".join(g)}</svg>'

# ---------- Lecturas ----------

TEXTO1 = '''<div class="lectura"><div class="ltag">Texto 1:</div><h3>Sembrar agua en las alturas</h3>
<p>A 4000 metros de altura, en la comunidad de Huayllapampa, el mes de agosto llega con un paisaje seco: los pastos amarillean y los manantiales apenas dejan correr un hilo de agua. Durante años, las familias vieron cómo sus animales enflaquecían en esta época y cómo los jóvenes migraban a la ciudad en busca de trabajo.</p>
<p>Todo comenzó a cambiar cuando doña Basilia Huamán, una de las mujeres mayores de la comunidad, recordó una práctica que su abuelo le había enseñado: construir <i>qochas</i>. Las qochas son pequeñas lagunas que se forman en hondonadas naturales del terreno; para aprovecharlas, los comuneros levantan un dique de tierra y piedra que retiene el agua de lluvia entre diciembre y marzo. «No es que el agua se guarde ahí para sacarla con baldes —explica doña Basilia—; el agua se va metiendo despacito en la tierra y, meses después, sale por los manantiales de abajo». Por eso, en la comunidad no dicen que construyen represas: dicen que «siembran agua».</p>
<p>En 2019, las familias se organizaron en faenas comunales y construyeron las primeras doce qochas. Al tercer año, los manantiales que antes se secaban en julio seguían brotando hasta octubre, y los pastos alrededor de las lagunas se mantuvieron verdes durante más tiempo. Con más alimento para el ganado, la producción de leche aumentó y algunas familias empezaron a elaborar quesos para venderlos en la feria del distrito.</p>
<p>Sin embargo, no todo ha sido sencillo. Las qochas necesitan mantenimiento: si el dique se agrieta, el agua se escapa en pocos días. Además, cuando las lluvias son escasas, como ocurrió en 2023, las lagunas no llegan a llenarse. «La qocha no hace milagros —advierte Eliseo Quispe, presidente de la comunidad—; solo nos ayuda a aprovechar mejor la lluvia que cae».</p>
<p>Hoy, estudiantes de una universidad de la región visitan Huayllapampa para medir cuánta agua se infiltra en el suelo. Sus primeros resultados confirman lo que los comuneros ya sabían por experiencia: las alturas pueden funcionar como una gran esponja si se les da la oportunidad. Para doña Basilia, la lección es otra: «Los abuelos no tenían estudios, pero sabían escuchar a la tierra. Nosotros casi lo olvidamos».</p></div>'''

TEXTO2 = '''<div class="lectura"><div class="ltag" style="float:none;margin-bottom:6px">Texto 2:</div>
<div class="info">
 <div class="info-h"><div class="info-t">¿Duermes lo suficiente?</div><div class="info-s">Lo que dicen los especialistas y lo que respondieron 200 estudiantes de 2.° de secundaria de un colegio</div></div>
 <div class="info-g">
  <div class="card reco"><div class="big">8 a 10 h</div><div>de sueño cada noche es lo que recomiendan los especialistas en medicina del sueño para adolescentes de 13 a 18 años.</div></div>
  <div class="card"><div class="ct">¿Cuántas horas duermen en noches de semana?</div>
   <div class="hb"><span>Menos de 6 h</span><div class="bar"><i style="width:15%"></i></div><b>30 est. (15 %)</b></div>
   <div class="hb"><span>De 6 a menos de 7 h</span><div class="bar"><i style="width:30%"></i></div><b>60 est. (30 %)</b></div>
   <div class="hb"><span>De 7 a menos de 8 h</span><div class="bar"><i style="width:25%"></i></div><b>50 est. (25 %)</b></div>
   <div class="hb ok"><span>8 h o más</span><div class="bar"><i style="width:30%"></i></div><b>60 est. (30 %)</b></div>
  </div>
  <div class="card"><div class="ct">¿Qué te quita horas de sueño?*</div>
   <ol class="rk"><li><b>62 %</b> Usar el celular en la cama</li><li><b>41 %</b> Hacer tareas hasta tarde</li><li><b>23 %</b> Ver series o videos</li><li><b>15 %</b> Ruido en casa o en la calle</li></ol>
   <div class="nota">* Respuesta múltiple.</div></div>
  <div class="card"><div class="ct">Mientras duermes…</div><ul class="tips"><li>tu cerebro ordena y fija lo que aprendiste durante el día;</li><li>tu cuerpo libera la hormona del crecimiento;</li><li>se recuperan tus músculos y tu sistema de defensas.</li></ul></div>
  <div class="card wide"><div class="ct">Consejos para dormir mejor</div><ul class="tips two"><li>Apaga las pantallas una hora antes de acostarte.</li><li>Acuéstate y levántate a la misma hora, incluso los fines de semana.</li><li>Evita el café y las gaseosas con cafeína por la tarde.</li><li>Mantén tu habitación oscura, silenciosa y fresca.</li></ul></div>
 </div>
 
</div></div>'''

TEXTO3 = '''<div class="lectura"><div class="ltag">Texto 3:</div><h3>¿Celulares en el aula?</h3>
<div class="dos">
<div><h4>Opinión 1: Mariela Torres, docente de Comunicación</h4>
<p>Cada mañana veo lo mismo: estudiantes que miran la pizarra mientras una parte de su mente espera la próxima notificación. Las alertas de los juegos y de las redes sociales acaparan la atención de los chicos, y una clase de cuarenta y cinco minutos se convierte en muchos fragmentos de cinco.</p>
<p>Por eso creo que los celulares deben quedarse guardados durante toda la jornada escolar. Algunos estudios han encontrado que tener el celular a la vista, aunque esté en silencio, dificulta concentrarse. Además, muchos casos de ciberacoso empiezan con una foto tomada en el salón. Y hay algo más: desde que en mi colegio se guardan los celulares, los recreos volvieron a llenarse de conversaciones y de partidos de vóley.</p></div>
<div><h4>Opinión 2: Joaquín Ramos, estudiante de 4.° de secundaria</h4>
<p>Es cierto que el celular puede distraer cuando se usa sin reglas; yo mismo lo he vivido. Pero prohibirlo no enseña nada: solo traslada el problema a la casa, donde nadie nos orienta.</p>
<p>En mi colegio, el celular es diccionario, calculadora y biblioteca. Además, para muchos compañeros que vienen de zonas rurales, es el único acceso a internet que tienen para investigar. Lo que necesitamos son normas claras: usarlo solo cuando el docente lo indique y guardarlo el resto del tiempo. Así aprenderíamos a usar la tecnología con responsabilidad, que es lo que nos tocará hacer cuando terminemos el colegio.</p></div>
</div></div>'''

# ---------- Preguntas ----------
# (n, enunciado, [A,B,C,D], clave, explicación)

COM = [
 (1, "Según el texto, ¿cómo llega el agua de las qochas a los manantiales?",
  ["Los comuneros la llevan en baldes durante la época seca.",
   "Se infiltra en el suelo y brota meses después más abajo.",
   "Baja por canales de piedra que construyeron los comuneros.",
   "Se evapora de las lagunas y cae como lluvia en los manantiales."], "B",
  "Doña Basilia lo dice: «el agua se va metiendo despacito en la tierra y, meses después, sale por los manantiales de abajo». La A es justo lo que ella niega («No es que el agua se guarde ahí para sacarla con baldes»)."),
 (2, "¿Por qué los comuneros dicen que «siembran agua»?",
  ["Porque el agua de las qochas se usa para regar las siembras.",
   "Porque las qochas se llenan en la temporada en que se siembra.",
   "Porque el agua que dejan en la tierra «brota» tiempo después.",
   "Porque hacen las qochas con la técnica de preparar la chacra."], "C",
  "Es una comparación: como una semilla, el agua que se deja en la tierra «sale» meses después en los manantiales. La B es una trampa: las qochas sí se llenan entre diciembre y marzo, pero esa no es la razón de la expresión. El texto nunca dice que se use el agua para regar (A)."),
 (3, "En el texto, la expresión «faenas comunales» se refiere a:",
  ["trabajos que la comunidad realiza en conjunto.",
   "celebraciones que organiza la comunidad cada año.",
   "asambleas en las que la comunidad toma acuerdos.",
   "ferias en las que la comunidad vende sus productos."], "A",
  "El contexto lo aclara: «se organizaron en faenas comunales y construyeron las primeras doce qochas». Si en las faenas se construye, es trabajo colectivo. La C atrae porque «se organizaron» suena a asamblea, pero en una asamblea no se construye."),
 (4, "Según el texto, ¿qué consecuencia tuvo que los pastos se mantuvieran verdes más tiempo?",
  ["Los jóvenes que habían migrado volvieron a la comunidad.",
   "La universidad empezó a medir el agua en Huayllapampa.",
   "Los manantiales siguieron brotando hasta octubre.",
   "Aumentó la leche y algunas familias venden quesos."], "D",
  "El tercer párrafo encadena: más pastos → más alimento para el ganado → más leche → quesos para la feria. La C ocurre al mismo tiempo, pero no es consecuencia de los pastos. El regreso de los jóvenes (A) no se menciona."),
 (5, "¿Cuál es la función del cuarto párrafo, el que empieza con «Sin embargo»?",
  ["Señalar los límites y cuidados que requieren las qochas.",
   "Explicar cómo se construye el dique de una qocha.",
   "Advertir que las qochas solo sirven en años lluviosos.",
   "Mostrar que los comuneros descuidaron sus qochas en 2023."], "A",
  "«Sin embargo» introduce un contraste con los logros: los diques necesitan mantenimiento y, si llueve poco, las qochas no se llenan. La C exagera («solo sirven») y la D inventa una causa: en 2023 el problema fue la poca lluvia, no el descuido."),
 (6, "¿Cuál es el propósito principal del texto?",
  ["Convencer a otras comunidades de construir qochas.",
   "Informar sobre una práctica ancestral de manejo del agua.",
   "Contar la historia de vida de doña Basilia Huamán.",
   "Explicar los resultados del estudio universitario del suelo."], "B",
  "El texto informa: presenta la práctica, sus resultados y sus límites. No pide a nadie que construya qochas (A). Doña Basilia es una voz del texto, no su tema (C). El estudio universitario ocupa solo una línea (D)."),
 (7, "Según la infografía, ¿qué porcentaje de los estudiantes encuestados duerme lo que recomiendan los especialistas en noches de semana?",
  ["15 %", "25 %", "30 %", "55 %"], "C",
  "La recomendación es de 8 a 10 horas, y la barra «8 h o más» es el 30 %. El 55 % sale de sumar también el grupo de 7 a 8 horas, que todavía no llega a lo recomendado."),
 (8, "¿Cuántos de los estudiantes encuestados duermen menos de 7 horas en noches de semana?",
  ["30", "60", "140", "90"], "D",
  "Se suman los dos primeros grupos: «menos de 6 h» (30) y «de 6 a menos de 7 h» (60), lo que da 90. El 140 son los que duermen menos de 8 horas."),
 (9, "¿Por qué los porcentajes de la sección «¿Qué te quita horas de sueño?» suman más de 100 %?",
  ["Porque un mismo estudiante podía marcar varias razones.",
   "Porque cada porcentaje se calculó sobre un grupo distinto.",
   "Porque algunos estudiantes no respondieron esa pregunta.",
   "Porque también se encuestó a estudiantes de otros grados."], "A",
  "La nota dice «Respuesta múltiple»: cada estudiante podía elegir más de una razón, así que cuenta en varias filas. Si algunos no hubieran respondido (C), la suma bajaría en vez de subir."),
 (10, "¿Cuál de los consejos de la infografía responde directamente a la causa más frecuente de pérdida de sueño?",
  ["Acostarse y levantarse siempre a la misma hora.",
   "Apagar las pantallas una hora antes de dormir.",
   "Evitar el café y las gaseosas por la tarde.",
   "Dormir en una habitación oscura y silenciosa."], "B",
  "La causa más frecuente es «usar el celular en la cama» (62 %), y la ataca directamente apagar las pantallas. La A puede parecer útil para «hacer tareas hasta tarde», pero esa es la segunda causa, no la primera."),
 (11, "¿Cuál es el propósito principal de la infografía?",
  ["Comparar los hábitos de sueño de adolescentes y adultos.",
   "Advertir a los padres sobre el uso del celular en casa.",
   "Explicar qué ocurre en el cerebro durante el sueño.",
   "Informar sobre el sueño adolescente y cómo mejorarlo."], "D",
  "La infografía combina datos (la recomendación, la encuesta, las causas) con consejos. La C es solo una de sus secciones, y la B toma un detalle como si fuera el todo. No habla de adultos (A)."),
 (12, "¿En qué idea coinciden Mariela y Joaquín?",
  ["El celular debe guardarse durante toda la jornada.",
   "El celular es necesario para investigar en clase.",
   "El celular puede distraer si se usa sin reglas.",
   "El celular facilita el ciberacoso entre estudiantes."], "C",
  "Mariela habla de las notificaciones que distraen, y Joaquín concede: «Es cierto que el celular puede distraer cuando se usa sin reglas». La A es solo de Mariela, la B solo de Joaquín y la D solo de Mariela."),
 (13, "¿Cuál de los siguientes es un argumento de Joaquín?",
  ["Muchos compañeros rurales solo tienen internet en el celular.",
   "Sin celulares, los recreos tienen más conversación y deporte.",
   "Tener el celular cerca, aunque esté en silencio, distrae.",
   "En casa, el celular sirve como diccionario y calculadora."], "A",
  "B y C son argumentos de Mariela. La D cambia un detalle: Joaquín dice que el celular es diccionario y calculadora «en mi colegio», no en casa. Fíjate en esos cambios pequeños, porque son una trampa frecuente."),
 (14, "En la opinión de Joaquín, ¿qué función cumple la expresión «Es cierto que el celular puede distraer…»?",
  ["Presentar la conclusión de su opinión.",
   "Conceder una idea antes de rebatirla.",
   "Contar una experiencia que lo convenció.",
   "Mostrar que está de acuerdo con Mariela."], "B",
  "Es una concesión: Joaquín acepta una parte de la postura contraria y enseguida la rebate («Pero prohibirlo no enseña nada»). No está de acuerdo con Mariela en lo principal (D), y «yo mismo lo he vivido» es un detalle, no la función de la frase (C)."),
 (15, "¿Cuál de los siguientes datos, de ser verdadero, fortalecería la opinión de Mariela?",
  ["La mayoría usa el celular en clase para buscar palabras.",
   "Quienes aprenden normas de uso lo usan con más responsabilidad.",
   "En zonas rurales, el internet llega sobre todo por celular.",
   "Donde se guardaron los celulares, bajó el ciberacoso escolar."], "D",
  "Mariela propone guardar los celulares y menciona el ciberacoso. Un dato que muestre menos ciberacoso al guardarlos respalda su postura. A, B y C apoyan a Joaquín."),
 (16, "¿Cuál es la tesis de Joaquín?",
  ["El celular debe prohibirse solo durante los exámenes.",
   "Los docentes deben usar el celular en todas sus clases.",
   "El celular no debe prohibirse, sino regularse con normas.",
   "Los colegios deben dar un celular a cada estudiante rural."], "C",
  "La tesis es la idea que defiende todo el texto: «Lo que necesitamos son normas claras». No propone prohibirlo a veces (A) ni usarlo siempre (B)."),
 (17, "En el texto de Mariela, ¿con qué palabra se puede reemplazar «acaparan» sin cambiar el sentido de la oración?",
  ["Absorben", "Dispersan", "Reducen", "Comparten"], "A",
  "«Acaparar» es tomar algo casi por completo para uno mismo: las notificaciones «absorben» la atención. «Dispersan» atrae porque el texto habla de distracción, pero cambia el sentido de la oración."),
]

MAT = [
 (18, "En una tienda, una chompa cuesta S/ 80. Por el día de la madre se le aplica un descuento del 25 % y, sobre el precio rebajado, un descuento adicional del 10 %. ¿Cuánto se paga por la chompa?",
  ["S/ 52", "S/ 54", "S/ 56", "S/ 60"], "B",
  "Primer descuento: 80 × 0,75 = 60. Segundo descuento, sobre 60: 60 × 0,90 = 54. Error común: sumar los descuentos (35 %), lo que da 52."),
 (19, "En un aula de 30 estudiantes, 12 obtuvieron un promedio de 15 en un examen y los otros 18 obtuvieron un promedio de 12. ¿Cuál es el promedio de toda el aula?",
  ["13,5", "13", "13,2", "14"], "C",
  "Suma de notas: 12 × 15 + 18 × 12 = 180 + 216 = 396. Promedio: 396 ÷ 30 = 13,2. No se puede promediar 15 y 12 directamente (13,5), porque los grupos tienen distinto tamaño."),
 (20, "Seis obreros, trabajando 8 horas diarias, construyen un muro en 10 días. ¿En cuántos días construirán un muro igual 5 obreros que trabajan 6 horas diarias?",
  ["12", "14", "18", "16"], "D",
  "El trabajo total se mantiene: 6 × 8 × 10 = 480 horas-obrero. Con 5 obreros a 6 h diarias se hacen 30 horas-obrero por día: 480 ÷ 30 = 16 días."),
 (21, f"Con palitos de fósforo se forman las siguientes figuras:<div class='fc'>{svg_palitos()}</div>Si se continúa con la misma regla de formación, ¿cuántos palitos se necesitan para formar la figura 20?",
  ["61", "60", "80", "63"], "A",
  "Se usan 4, 7 y 10 palitos, así que la cantidad aumenta de 3 en 3. La regla es 3n + 1, y para n = 20 da 3 × 20 + 1 = 61. El 80 (4 × 20) es un error: los cuadrados vecinos comparten un palito."),
 (22, "La edad de Ana es el triple de la edad de su hermano. Dentro de 5 años, la suma de sus edades será 34 años. ¿Cuál es la edad actual de Ana?",
  ["15 años", "21 años", "18 años", "24 años"], "C",
  "Hermano: x, Ana: 3x. Dentro de 5 años: (x + 5) + (3x + 5) = 34, entonces 4x + 10 = 34 y x = 6. Ana tiene 3 × 6 = 18 años. Cuidado: 6 es la edad del hermano."),
 (23, """Un taxi cobra según la distancia recorrida, como se muestra en la tabla:
<table class="dt"><tr><th>Distancia (km)</th><td>2</td><td>4</td><td>6</td></tr><tr><th>Costo (S/)</th><td>7</td><td>10</td><td>13</td></tr></table>
Si <i>x</i> representa la distancia en kilómetros, ¿qué expresión permite calcular el costo del viaje?""",
  ["3,5<i>x</i>", "2<i>x</i> + 3", "<i>x</i> + 5", "1,5<i>x</i> + 4"], "D",
  "Por cada 2 km el costo sube S/ 3, o sea S/ 1,50 por km. Hay un monto fijo: 7 − 1,5 × 2 = 4. Comprobación: 1,5 × 6 + 4 = 13 ✓. Las otras opciones cumplen con 2 km pero fallan con 4 km. Por eso hay que probar más de un dato."),
 (24, f"El gráfico muestra la cantidad de queques que vendió una panadería escolar durante una semana.<div class='fc'>{svg_barras()}</div>¿Qué porcentaje del total de la semana se vendió el viernes?",
  ["28 %", "21 %", "25 %", "30 %"], "A",
  "Total: 12 + 18 + 15 + 9 + 21 = 75 queques. Viernes: 21 ÷ 75 = 0,28 = 28 %. El 21 % sale de confundir la cantidad con el porcentaje."),
 (25, "En una bolsa hay 5 canicas rojas, 3 azules y 4 verdes, todas del mismo tamaño. Si se saca una canica sin mirar, ¿cuál es la probabilidad de que NO sea roja?",
  ["5/12", "7/12", "1/3", "1/4"], "B",
  "Hay 12 canicas en total, y 7 no son rojas (3 azules + 4 verdes). La probabilidad es 7/12. El 5/12 es la probabilidad de que SÍ sea roja."),
 (26, f"Una placa rectangular de 10 cm por 6 cm tiene un corte triangular en uno de sus lados, como muestra la figura.<div class='fc'>{svg_figura_compuesta()}</div>¿Cuál es el área de la placa?",
  ["48 cm²", "57 cm²", "54 cm²", "52 cm²"], "C",
  "Rectángulo: 10 × 6 = 60 cm². Triángulo recortado: (4 × 3) ÷ 2 = 6 cm². Área: 60 − 6 = 54 cm². Si se olvida dividir entre 2, sale 48."),
 (27, f"Una escalera de 13 m está apoyada en una pared vertical. El pie de la escalera está a 5 m de la pared.<div class='fc'>{svg_escalera()}</div>¿A qué altura de la pared llega la escalera?",
  ["8 m", "12 m", "10 m", "14 m"], "B",
  "Por el teorema de Pitágoras: h² + 5² = 13², h² = 169 − 25 = 144, h = 12 m. El 8 (13 − 5) es un error común."),
 (28, f"Un tanque vacío con forma de prisma rectangular tiene las medidas que se indican. Se llena con una manguera que vierte 50 litros por minuto. (Recuerda: 1 m³ = 1000 litros).<div class='fc'>{svg_tanque()}</div>¿Cuánto tiempo tarda en llenarse?",
  ["30 minutos", "45 minutos", "1 hora y 30 minutos", "1 hora"], "D",
  "Volumen: 2 × 1,5 × 1 = 3 m³ = 3000 litros. Tiempo: 3000 ÷ 50 = 60 minutos = 1 hora."),
 (29, "En un mapa hecho a escala 1 : 50 000, la distancia entre dos pueblos es de 6 cm. ¿Cuál es la distancia real entre ellos?",
  ["3 km", "300 m", "30 km", "6 km"], "A",
  "6 cm × 50 000 = 300 000 cm. Como 1 km = 100 000 cm, la distancia es 300 000 ÷ 100 000 = 3 km."),
 (30, f"En el plano cartesiano se muestra el triángulo ABC.<div class='fc'>{svg_cartesiano()}</div>¿Cuál es el perímetro del triángulo ABC?",
  ["10 unidades", "14 unidades", "12 unidades", "6 unidades"], "C",
  "AB = 5 − 1 = 4 y BC = 4 − 1 = 3. Por Pitágoras, AC = √(4² + 3²) = 5. Perímetro: 4 + 3 + 5 = 12. El 6 es el área, no el perímetro."),
 (31, "¿Cuál es el valor de la expresión (2³)² · 2⁻⁴?",
  ["2", "8", "16", "4"], "D",
  "Potencia de potencia: (2³)² = 2⁶. Producto de igual base: 2⁶ · 2⁻⁴ = 2². Resultado: 4."),
 (32, "Rosa gastó 1/3 de su dinero en libros y 1/4 de lo que le quedaba en pasajes. Si todavía tiene S/ 60, ¿cuánto dinero tenía al inicio?",
  ["S/ 90", "S/ 120", "S/ 100", "S/ 144"], "B",
  "Después de los libros le quedan 2/3. Gasta 1/4 de eso en pasajes, así que le quedan 3/4 de 2/3, o sea la mitad del dinero inicial. Si la mitad es S/ 60, tenía S/ 120. Si se toma el 1/4 sobre el total (y no sobre lo que quedaba), sale 144."),
 (33, f"¿Cuál de los siguientes desarrollos NO permite armar un cubo al doblarlo por sus líneas?<div class='fc'>{svg_redes()}</div>",
  ["A", "B", "C", "D"], "C",
  "La figura C es un rectángulo de 2 × 3 cuadrados. Al doblarla, dos caras se superponen y quedan dos lados del cubo sin cubrir. A (cruz), B y D (escalera) sí forman un cubo."),
 (34, f"Las dos balanzas están en equilibrio. Todas las manzanas (M) pesan lo mismo y todas las peras (P) pesan lo mismo.<div class='fc'>{svg_balanzas()}</div>¿Cuánto pesa una pera?",
  ["100 g", "120 g", "200 g", "150 g"], "D",
  "Por la balanza 1, 3M = 2P, así que M = 2P/3. En la balanza 2, P + 2P/3 = 250, o sea 5P/3 = 250 y P = 150 g. Comprobación: M = 100 y 3 × 100 = 2 × 150 ✓. El 100 es el peso de la manzana."),
]

SITUACION_CYT = f'''<div class="situacion"><div class="ltag">Lee la siguiente situación y responde las preguntas 35 a 38.</div>
<p>Lucía observó que las pastillas efervescentes parecían disolverse más rápido en agua tibia que en agua fría. Para comprobarlo, colocó 200 mL de agua en cuatro vasos iguales, cada uno a una temperatura distinta. En cada vaso echó una pastilla de la misma marca y tamaño, y midió con un cronómetro el tiempo que tardó en disolverse por completo.</p>
<div class="fila"><table class="dt"><tr><th>Temperatura del agua (°C)</th><th>Tiempo de disolución (s)</th></tr><tr><td>10</td><td>62</td></tr><tr><td>25</td><td>38</td></tr><tr><td>40</td><td>24</td></tr><tr><td>60</td><td>15</td></tr></table>{svg_disolucion()}</div></div>'''

CYT = [
 (35, "¿Cuál es la pregunta que Lucía quiso responder con su indagación?",
  ["¿Influye la temperatura del agua en el tiempo de disolución?",
   "¿Influye el tamaño de la pastilla en el tiempo de disolución?",
   "¿Influye la cantidad de agua en el número de burbujas?",
   "¿Qué marca de pastilla se disuelve más rápido en agua tibia?"], "A",
  "La pregunta relaciona lo que Lucía cambia (la temperatura) con lo que mide (el tiempo). La B tiene la misma forma, pero el tamaño de la pastilla fue igual en todos los vasos, así que no se estudió."),
 (36, "En la indagación de Lucía, ¿cuál es la variable independiente?",
  ["El tiempo que tarda en disolverse la pastilla.",
   "La temperatura del agua de cada vaso.",
   "La cantidad de agua de cada vaso.",
   "La marca y el tamaño de la pastilla."], "B",
  "La variable independiente es la que el investigador cambia a propósito: la temperatura. El tiempo es la dependiente (lo que se mide). La cantidad de agua y la pastilla son controladas: se mantienen iguales."),
 (37, "Para que la comparación entre los vasos sea justa, ¿qué condiciones debía mantener iguales Lucía?",
  ["La temperatura del agua y el tamaño de los vasos.",
   "El tiempo de disolución y la cantidad de agua.",
   "La temperatura del agua y el tiempo de disolución.",
   "La cantidad de agua y el tipo de pastilla."], "D",
  "Se mantiene igual todo lo que podría influir, salvo lo que se estudia. La temperatura no puede ser igual, porque es lo que se cambia, y el tiempo tampoco, porque es el resultado que se mide. Por eso A, B y C fallan."),
 (38, "¿Qué conclusión se puede obtener a partir de los resultados de Lucía?",
  ["La pastilla se disuelve igual a cualquier temperatura.",
   "A 80 °C la pastilla tardará 0 segundos en disolverse.",
   "A mayor temperatura, menor tiempo de disolución.",
   "El tiempo se reduce a la mitad cada 15 °C de aumento."], "C",
  "Los datos bajan de forma constante: 62, 38, 24 y 15 segundos. La B extrapola fuera de los datos, y la D es falsa: de 62 a 38 no es la mitad. Antes de aceptar una regla exacta, revisa los números."),
 (39, "Martín afirma: «Las plantas respiran solo de noche, porque durante el día hacen fotosíntesis». ¿Qué opinas de su afirmación?",
  ["Se equivoca: las plantas respiran tanto de día como de noche.",
   "Tiene razón: de día la fotosíntesis reemplaza a la respiración.",
   "Se equivoca: las plantas respiran solo de día, cuando hay luz.",
   "Tiene razón: de noche las plantas no realizan otro proceso."], "A",
  "La respiración celular ocurre siempre en todas las células vivas, porque les da energía. La fotosíntesis necesita luz. De día ocurren las dos a la vez. La B es una idea errónea muy común."),
 (40, f"En un lago altoandino se observa la siguiente cadena alimentaria. Las flechas indican «sirve de alimento a».<div class='fc'>{svg_cadena()}</div>Si una enfermedad reduce mucho la población de aves pescadoras, ¿qué ocurriría probablemente con el zooplancton?",
  ["Aumentaría, porque las aves comían zooplancton.",
   "Disminuiría, porque habría más peces que lo comen.",
   "No cambiaría, porque las aves no comen zooplancton.",
   "Aumentaría, porque los peces tendrían menos depredadores."], "B",
  "Hay que razonar en dos pasos. Con menos aves, sobreviven más peces pequeños, y esos peces comen más zooplancton, así que el zooplancton disminuye. La C olvida que los cambios se transmiten por la cadena. La D parte de una idea cierta (los peces tienen menos depredadores), pero saca la conclusión equivocada."),
 (41, "Las células del músculo del corazón se contraen sin descanso durante toda la vida. ¿Qué organelo esperarías encontrar en gran cantidad en ellas?",
  ["El núcleo.", "La mitocondria.", "El cloroplasto.", "El ribosoma."], "B",
  "Contraerse sin parar requiere mucha energía, y en la mitocondria ocurre la respiración celular que la libera. El ribosoma fabrica proteínas, pero no da energía. El cloroplasto solo está en las células vegetales."),
 (42, "¿En cuál de las siguientes situaciones ocurre un cambio químico?",
  ["Un trozo de chocolate se derrite al sol.",
   "Una cucharada de azúcar se disuelve en té.",
   "Una manzana cortada se oscurece al aire.",
   "El agua de una olla hierve y forma burbujas."], "C",
  "En un cambio químico se forman sustancias nuevas: la manzana se oscurece porque sus componentes reaccionan con el oxígeno (oxidación). Las burbujas del agua que hierve son vapor de agua, la misma sustancia, así que es un cambio físico. Derretir y disolver también son cambios físicos."),
 (43, "Pedro tiene una mezcla de agua, arena y sal. Primero la filtra y la arena queda retenida en el papel filtro. ¿Qué debe hacer después para obtener la sal?",
  ["Filtrar otra vez el líquido con un papel más fino.",
   "Dejar reposar el líquido hasta que la sal se asiente.",
   "Pasar el líquido por un colador de tela limpia.",
   "Calentar el líquido hasta que el agua se evapore."], "D",
  "La sal está disuelta: sus partículas están mezcladas con las del agua, así que atraviesa cualquier filtro (A, C) y no se asienta (B). Al evaporar el agua, la sal queda en el recipiente, como en las salineras."),
 (44, "Al servir una sopa caliente, una cuchara de metal se calienta rápidamente, pero una de madera casi no se calienta. ¿Por qué ocurre esto?",
  ["El metal conduce mejor el calor que la madera.",
   "El metal guarda más calor porque es más pesado.",
   "La madera es más gruesa y el calor no la atraviesa.",
   "El metal atrae el calor y la madera lo rechaza."], "A",
  "El calor pasa de la sopa a la cuchara por conducción, y los metales son buenos conductores. La madera es un aislante. B, C y D son ideas erróneas comunes: el peso y el grosor no explican la diferencia, y los materiales no «atraen» ni «rechazan» el calor."),
 (45, "Una ciclista recorre 18 km en 45 minutos. ¿Cuál fue su rapidez media en kilómetros por hora?",
  ["13,5 km/h", "24 km/h", "27 km/h", "40 km/h"], "B",
  "45 minutos son 0,75 horas, así que 18 ÷ 0,75 = 24 km/h. El 13,5 sale de multiplicar en vez de dividir (18 × 0,75). Otra forma de verlo: 18 km en 3/4 de hora son 6 km cada 15 minutos, y en una hora, 4 × 6 = 24 km."),
 (46, "Un bloque tiene una masa de 60 g y un volumen de 75 cm³. Si la densidad del agua es 1 g/cm³, ¿qué ocurrirá al colocar el bloque en agua?",
  ["Se hundirá, porque su densidad es de 1,25 g/cm³.",
   "Se hundirá, porque su masa es mayor que la del agua.",
   "Flotará, porque su densidad es de 0,8 g/cm³.",
   "Flotará, porque su densidad es de 1,25 g/cm³."], "C",
  "Densidad = masa ÷ volumen = 60 ÷ 75 = 0,8 g/cm³, que es menor que la del agua, así que el bloque flota. El 1,25 sale de dividir al revés. La B es un error común: lo que decide si algo flota es la densidad, no la masa."),
 (47, "Después del almuerzo, los nutrientes de los alimentos deben pasar a la sangre para llegar a todas las células. ¿En qué órgano se absorbe la mayor parte de esos nutrientes?",
  ["En el intestino delgado.", "En el estómago.", "En el intestino grueso.", "En el hígado."], "A",
  "El intestino delgado tiene vellosidades que aumentan su superficie, y ahí pasa la mayor parte de los nutrientes a la sangre. El estómago digiere, pero absorbe poco. El intestino grueso absorbe sobre todo agua. El hígado procesa los nutrientes después de que ya fueron absorbidos."),
 (48, "Carla tiene los ojos del mismo color que su madre, piernas musculosas porque entrena natación todos los días, una cicatriz en la rodilla y habla quechua. ¿Cuál de esas características es heredada?",
  ["Hablar quechua.", "Las piernas musculosas.", "La cicatriz en la rodilla.", "El color de los ojos."], "D",
  "Las características heredadas pasan por los genes de los padres, como el color de ojos. Las piernas musculosas atraen, pero se deben al entrenamiento: son adquiridas, como el idioma y la cicatriz."),
 (49, "¿Qué explica que en el Perú sea de día mientras en Japón es de noche?",
  ["La traslación de la Tierra alrededor del Sol.",
   "La rotación de la Tierra sobre su eje.",
   "La inclinación del eje de la Tierra.",
   "La distinta distancia de cada país al Sol."], "B",
  "La Tierra gira sobre su eje cada 24 horas: la mitad que mira al Sol tiene día y la otra, noche. La traslación y la inclinación del eje explican las estaciones, no el día y la noche."),
 (50, "Un anuncio en redes sociales afirma que un té «quema la grasa en 7 días». ¿Cuál de las siguientes fuentes sería la más confiable para saber si eso es cierto?",
  ["Una nutricionista famosa que recomienda el té en sus redes.",
   "La página de la empresa, que muestra fotos de antes y después.",
   "Un estudio que comparó grupos que tomaron y no tomaron el té.",
   "Un foro donde cientos de usuarios cuentan su experiencia."], "C",
  "Solo un estudio con grupo de comparación (control) puede mostrar si el efecto se debe al té. La A atrae porque es una especialista, pero una recomendación no es evidencia, y podría ser publicidad. Las fotos de la empresa y los testimonios no comparan con nada."),
]

ALLQ = COM + MAT + CYT
assert [q[0] for q in ALLQ] == list(range(1, 51))
assert len(COM) == 17 and len(MAT) == 17 and len(CYT) == 16
print("Distribución de claves:", Counter(q[3] for q in ALLQ))

def qhtml(q, b=False):
    n, st, ops, k, ex = q
    li = "".join(f'<li><span class="lt">{L[i]})</span> {o}</li>' for i, o in enumerate(ops))
    return f'<div class="q{" qb" if b else ""}"><div class="qn">{n}.</div><div class="qb"><div class="stem">{st}</div><ul class="ops">{li}</ul></div></div>'

CSS = open(os.path.join(os.path.dirname(__file__), "style.css")).read()

def area(titulo, sub, color):
    return f'<div class="area">COMPETENCIAS DE {titulo.upper()}</div>'

portada = '''<section class="portada"><div class="marco">
<div class="p-centro"><div class="p-sim">SIMULACRO</div><div class="p-tit">Proceso Único de<br>Admisión 2027</div>
<div class="p-sub">PRUEBA DE HABILIDADES<br>COGNITIVAS</div></div>
<div class="p-pie">Simulacro de práctica de la prueba de la Fase I</div>
</div></section>'''

instr = '''<section class="instr"><h2>Instrucciones</h2>
<p>Este cuadernillo es un <b>simulacro</b> de la prueba de habilidades cognitivas del Proceso Único de Admisión 2027. Resuélvelo en las mismas condiciones que el examen real.</p>
<p>Estimado/a postulante, sigue las siguientes indicaciones para la evaluación:</p>
<ul>
<li>La duración del desarrollo de la prueba es de <b>120</b> minutos.</li>
<li>No inicies la prueba hasta que se te autorice.</li>
<li>Está estrictamente prohibido portar cartucheras, lapiceros, calculadoras, apuntes, correctores líquidos y cualquier dispositivo electrónico.</li>
<li>Solo puedes usar lápiz y borrador.</li>
<li>No se puede realizar consultas durante el desarrollo de la prueba. Si consideras que alguna pregunta está mal formulada o errada, puedes corregirla y elegir la respuesta que consideres correcta.</li>
<li>Marca tus respuestas encerrando en un círculo la letra de la alternativa que elijas.</li>
<li>Finalmente, coloca tus datos completos en la prueba antes del inicio de la evaluación.</li>
</ul>
<table class="datos"><tr><td>Apellidos:</td></tr><tr><td class="v"></td></tr><tr><td>Nombres:</td></tr><tr><td class="v"></td></tr><tr><td>N.° de DNI:</td></tr></table>
</section>'''

def blk(qs, b=False): return "".join(qhtml(q, b) for q in qs)

cuerpo = (
  area("Comunicación", "Preguntas 1 a 17", "#111")
  + TEXTO1 + f'<div class="hint">A partir del texto 1, responde las preguntas 1 a 6.</div>' + blk(COM[0:6], True)
  + '<div class="pb"></div>' + TEXTO2 + f'<div class="hint">A partir del texto 2, responde las preguntas 7 a 11.</div>' + blk(COM[6:11], True)
  + '<div class="pb"></div>' + TEXTO3 + f'<div class="hint">A partir del texto 3, responde las preguntas 12 a 17.</div>' + blk(COM[11:17], True)
  + '<div class="pb"></div>' + area("Matemática", "Preguntas 18 a 34", "#111") + blk(MAT)
  + '<div class="pb"></div>' + area("Ciencia y Tecnología", "Preguntas 35 a 50", "#111") + SITUACION_CYT + blk(CYT[0:4]) + blk(CYT[4:])
)

def hoja():
    cols = [range(1, 18), range(18, 35), range(35, 51)]
    names = ["Comunicación", "Matemática", "Ciencia y Tecnología"]
    colors = ["#111", "#111", "#111"]
    h = '<section class="hoja"><h2>HOJA DE RESPUESTAS</h2><div class="hdat"><span>Apellidos y nombres: ________________________________________</span><span>DNI: ______________</span></div><p class="sub">Rellena por completo el círculo de la alternativa que elijas.</p><div class="hcols">'
    for c, nm, co in zip(cols, names, colors):
        h += f'<div class="hcol"><div class="hh" style="background:{co}">{nm}</div>'
        for n in c:
            h += f'<div class="hr"><span class="hn">{n}</span>' + "".join(f'<span class="bb">{x}</span>' for x in L) + '</div>'
        h += '</div>'
    h += '</div><div class="hpts"><div>Comunicación: ____ / 17</div><div>Matemática: ____ / 17</div><div>Ciencia y Tecnología: ____ / 16</div><div class="tot">Total: ____ / 50</div></div></section>'
    return h

exam = f'<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Simulacro PUA 2027</title><style>{CSS}</style></head><body>{portada}{instr}<main>{cuerpo}</main></body></html>'
open(os.path.join(OUT, "simulacro.html"), "w").write(exam)

# ---------- Solucionario ----------
def sol_area(nombre, qs, color):
    rows = ""
    for n, st, ops, k, ex in qs:
        rows += f'<div class="sr"><div class="sk" style="background:{color}">{n}<b>{k}</b></div><div class="se"><div class="sa">{k}) {ops[L.index(k)]}</div><div>{ex}</div></div></div>'
    return f'<h2 class="sh" style="--c:{color}">{nombre}</h2>{rows}'

clave = '<table class="clave"><tr>' + "".join(f'<th>{q[0]}</th>' for q in ALLQ[:25]) + '</tr><tr>' + "".join(f'<td>{q[3]}</td>' for q in ALLQ[:25]) + '</tr><tr>' + "".join(f'<th>{q[0]}</th>' for q in ALLQ[25:]) + '</tr><tr>' + "".join(f'<td>{q[3]}</td>' for q in ALLQ[25:]) + '</tr></table>'

sol = f'''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Solucionario simulacro PUA 2027</title><style>{CSS}</style></head><body class="solb">
<section class="solhead"><div class="p-top">Solucionario</div><h1>Simulacro PUA 2027<br><span>Prueba de habilidades cognitivas</span></h1>
<h3>Clave de respuestas</h3>{clave}
<div class="tips-box"><b>Cómo usarlo</b><br>Primero califica con la clave. Luego lee la explicación de cada pregunta que fallaste <i>y</i> de las que acertaste dudando. Fíjate en la nota sobre el error común: la mayoría de las alternativas incorrectas salen de un error típico.</div></section>
{sol_area("Comunicación", COM, "#111")}{sol_area("Matemática", MAT, "#111")}{sol_area("Ciencia y Tecnología", CYT, "#111")}
</body></html>'''
open(os.path.join(OUT, "solucionario.html"), "w").write(sol)
print("listo")
