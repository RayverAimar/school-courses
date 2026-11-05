// End-to-end check of the desktop app with Playwright's Electron driver: launch, open a lesson,
// mark it read, answer a quiz question, quit, launch again and find the progress still there.
//   node scripts/smoke-app.mjs                 the app from this folder (needs `pnpm build` first)
//   node scripts/smoke-app.mjs <path to app>   a packaged app (…/Compass.app, the .exe, the AppImage)
import { _electron as electron } from "playwright";
import { mkdtempSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2];
const shots = process.env.SMOKE_SHOTS || join(ROOT, ".cache", "smoke");
mkdirSync(shots, { recursive: true });
const userData = mkdtempSync(join(tmpdir(), "compass-smoke-"));
const LESSON = "#/c/economics/session-01-what-is-an-economy/1";
const QUIZ = "#/c/economics/session-01-what-is-an-economy/2";

function launchOptions() {
  const env = { ...process.env, APP_USER_DATA: userData };
  if (!target) return { args: [ROOT], env };
  let exe = target;
  if (target.endsWith(".app")) exe = join(target, "Contents", "MacOS", target.split("/").pop().replace(/\.app$/, ""));
  if (!existsSync(exe)) throw new Error(`No app at ${exe}`);
  return { executablePath: exe, env };
}

const step = (msg) => console.log(`· ${msg}`);
async function open() {
  const app = await electron.launch(launchOptions());
  const page = await app.firstWindow();
  await page.waitForSelector(".course-card, .resume", { timeout: 30000 });
  return { app, page };
}
const go = (page, hash) => page.evaluate((h) => (location.hash = h), hash);
// A fresh install opens with the welcome: three steps, here with a name and the default goal.
async function welcome(page) {
  await page.waitForSelector(".sheet-welcome", { timeout: 10000 });
  await page.click(".w-next");
  await page.fill("[name=name]", "Smoke");
  await page.click(".w-next");
  await page.click(".w-next");
  await page.waitForSelector(".sheet-welcome", { state: "detached" });
  return page.textContent(".hello h1");
}

let failed = false;
try {
  let { app, page } = await open();
  step(`launched: ${await page.title()} (${await page.evaluate(() => location.href)})`);
  if (!(await page.evaluate(() => document.body.classList.contains("app")))) throw new Error("the page doesn't know it runs in the app");
  await page.screenshot({ path: join(shots, "0-welcome.png") });
  step(`welcome done: "${await welcome(page)}"`);
  await page.screenshot({ path: join(shots, "1-home.png") });

  await go(page, LESSON);
  await page.waitForSelector(".lmain h1");
  await page.waitForSelector(".lab");
  step(`lesson open: ${await page.textContent(".lmain h1")} (lab mounted)`);
  await page.click(".mark");
  await page.screenshot({ path: join(shots, "2-lesson.png") });

  await go(page, QUIZ);
  await page.waitForSelector(".quiz .selfcheck");
  await page.click(".quiz .selfcheck .sc-show");
  await page.click(".quiz .selfcheck .sc-yes");
  const quizId = await page.evaluate(() => document.querySelector(".quiz .selfcheck").id);
  step(`quiz answered: ${quizId}`);
  await page.screenshot({ path: join(shots, "3-quiz.png") });

  await app.close();
  step("quit");

  ({ app, page } = await open());
  await page.waitForTimeout(800);
  if (await page.$(".sheet-welcome")) throw new Error("the welcome came back after a relaunch");
  const greeting = await page.textContent(".hello h1");
  if (!greeting.includes("Smoke")) throw new Error(`the profile did not survive the restart: "${greeting}"`);
  const resume = await page.textContent(".resume h2");
  await go(page, QUIZ);
  await page.waitForSelector(".quiz .selfcheck");
  const kept = await page.evaluate((id) => document.getElementById(id).classList.contains("is-right"), quizId);
  await go(page, "#/c/economics");
  await page.waitForSelector(".mine");
  const read = await page.evaluate(() => document.querySelector(".lrow .st").className);
  await page.screenshot({ path: join(shots, "4-relaunch.png") });
  await app.close();
  step(`relaunched: continue card "${resume}", quiz answer kept: ${kept}, first lesson: ${read}`);
  if (!kept || !read.includes("st-done")) throw new Error("progress did not survive the restart");
  console.log(`✓ smoke test passed · screenshots in ${shots}`);
} catch (e) {
  failed = true;
  console.error(`✗ ${e.message}`);
} finally {
  rmSync(userData, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
