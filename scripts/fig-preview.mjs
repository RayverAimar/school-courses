// Renders a module's figures to PNG so you can look at them, in both themes:
//   node scripts/fig-preview.mjs <src/figuras/file.mjs>
// Writes .cache/figs/<id>-light.png and <id>-dark.png (and <id>-narrow-… for a narrow drawing), 2x, on
// the figure card's background. The colours are the app's: the d-* rules of
// platform/web/styles/charts.css and src/course.css, with the theme tokens resolved.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = resolve(process.argv[2]);
const figs = (await import(pathToFileURL(file).href)).default;
const out = join(ROOT, ".cache", "figs");
mkdirSync(out, { recursive: true });

const css = (p) => readFileSync(join(ROOT, p), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const SHEETS = [css("platform/web/styles/tokens.css"), css("platform/web/styles/charts.css"), css("src/course.css")];

// Custom properties of the top-level blocks whose selector is exactly `sel`.
const vars = (sel) => {
  const v = {};
  for (const text of SHEETS) {
    let depth = 0, start = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "{") { if (depth === 0) start = i; depth++; }
      else if (text[i] === "}" && --depth === 0) {
        const head = text.slice(text.lastIndexOf("}", start) + 1, start).trim();
        if (head === sel) for (const m of text.slice(start + 1, i).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) v[m[1]] = m[2].trim();
      }
    }
  }
  return v;
};
const LIGHT = vars(":root");
const THEMES = { light: LIGHT, dark: { ...LIGHT, ...vars(':root[data-theme="dark"]') } };

// Top-level rules made only of figure classes (".d-box", ".d-t, .d-s").
const RULES = SHEETS.flatMap((text) => [...text.matchAll(/(?<=^|\})\s*((?:\.d-[\w-]+\s*,?\s*)+)\{([^{}]*)\}/g)].map((m) => [m[1].trim(), m[2].trim()]));
const resolveVars = (val, v, n = 0) => (n > 8 ? val : val.replace(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g, (_m, k, fb) => resolveVars(v[k] ?? fb ?? "", v, n + 1)));
const sheet = (v) => `<style>text{font-family:'Bricolage Grotesque',sans-serif}${RULES.map(([sel, body]) => `${sel}{${resolveVars(body, v)}}`).join("")}</style>`;

for (const [id, f] of Object.entries(figs)) {
  for (const [k, svg] of [["", f.svg], ["-narrow", f.narrow]]) {
    if (!svg) continue;
    for (const [theme, v] of Object.entries(THEMES)) {
      // A d-stroke-N line without a fill class draws no fill (the app's [class*=…] rule).
      const body = svg.replace(/<(path|line|polyline|circle|ellipse|rect)\b([^>]*class="([^"]*)")/g, (m, tag, rest, cls) =>
        /\bd-stroke-\d/.test(cls) && !/\bd-(fill-|obj\b|water\b)/.test(cls) ? `<${tag} fill="none"${rest}` : m);
      const doc = body.replace(/<svg([^>]*)>/, `<svg xmlns="http://www.w3.org/2000/svg"$1>${sheet(v)}<rect width="100%" height="100%" fill="${resolveVars("var(--raise)", v)}"/>`);
      const png = new Resvg(doc, { fitTo: { mode: "zoom", value: 2 }, font: { loadSystemFonts: true, fontFiles: [] } }).render().asPng();
      const to = join(out, `${id}${k}-${theme}.png`);
      writeFileSync(to, png);
      console.log(to);
    }
  }
}
