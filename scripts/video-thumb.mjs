// Saves a YouTube video's thumbnail for its card: node scripts/video-thumb.mjs <id> [<id>…]
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "content", "img", "videos");
mkdirSync(dir, { recursive: true });
for (const id of process.argv.slice(2)) {
  let res;
  for (const name of ["maxresdefault", "hqdefault"]) {
    res = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`);
    if (res.ok) break;
  }
  if (!res.ok) { console.error(`${id}: no thumbnail (${res.status})`); process.exitCode = 1; continue; }
  writeFileSync(join(dir, `${id}.jpg`), Buffer.from(await res.arrayBuffer()));
  console.log(`${id}: ok`);
}
