"""One-off: turns the PDF simulacro generator (build.py) into content/examenes/<id>.json."""
import importlib.util, json, re, sys, tempfile

src, out = sys.argv[1], sys.argv[2]
sys.argv = [src, tempfile.mkdtemp()]
spec = importlib.util.spec_from_file_location("sim", src)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

def clean(html):
    html = re.sub(r'<div class="ltag"[^>]*>.*?</div>', "", html, count=1, flags=re.S)
    return html.strip()

ctx = {"t1": clean(m.TEXTO1), "t2": clean(m.TEXTO2), "t3": clean(m.TEXTO3), "s1": clean(m.SITUACION_CYT)}
titles = {"t1": "Texto 1", "t2": "Texto 2", "t3": "Texto 3", "s1": "Situación"}
def ctx_of(n):
    if n <= 6: return "t1"
    if n <= 11: return "t2"
    if n <= 17: return "t3"
    if 35 <= n <= 38: return "s1"
    return None
def area_of(n): return "com" if n <= 17 else "mat" if n <= 34 else "cyt"

qs = [{"n": n, "area": area_of(n), "ctx": ctx_of(n), "stem": st, "opts": ops, "a": "ABCD".index(k), "why": ex}
      for (n, st, ops, k, ex) in m.ALLQ]
exam = {
  "id": "simulacro-coar-2027-1", "title": "Simulacro 1", "goal": "COAR 2027",
  "kicker": "Prueba de habilidades cognitivas · Fase I", "minutes": 120,
  "areas": [{"id": "com", "title": "Comunicación"}, {"id": "mat", "title": "Matemática"}, {"id": "cyt", "title": "Ciencia y Tecnología"}],
  "contexts": {k: {"title": titles[k], "html": v} for k, v in ctx.items()},
  "questions": qs,
}
json.dump(exam, open(out, "w"), ensure_ascii=False, indent=1)
print(len(qs), "questions")
