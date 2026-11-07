// Real-time QA capture for the improvement loop — zero dependencies.
// Saves lightweight JPEG viewport slices (<200 KB each) to prevent huge payloads.
// Usage: node tools/shoot.mjs [url] [outDir]
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const url = process.argv[2] || "http://127.0.0.1:5173/";
const out = process.argv[3] || path.resolve("tools/shots");
fs.mkdirSync(out, { recursive: true });
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const PORT = 9333;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "atv-qa-"));
const edge = spawn(EDGE, ["--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });

let target;
for (let i = 0; i < 40 && !target; i++) {
  await sleep(250);
  try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find(t => t.type === "page"); } catch {}
}
if (!target) { edge.kill(); throw new Error("Edge DevTools endpoint not reachable"); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map(); const errors = [];
ws.addEventListener("message", ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") errors.push(m.params.args.map(a => a.value ?? a.description).join(" "));
});
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async expr => (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.result?.value;
const shot = async file => {
  const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 80 });
  fs.writeFileSync(file, Buffer.from(r.result.data, "base64"));
};

await send("Page.enable"); await send("Runtime.enable");
const report = [];
for (const vp of [
  { name: "desk", width: 1440, height: 920, mobile: false },
  { name: "mob", width: 390, height: 844, mobile: true }
]) {
  errors.length = 0;
  await send("Emulation.setDeviceMetricsOverride", { width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: vp.mobile });
  await send("Page.navigate", { url });
  await sleep(3400);
  await shot(`${out}/${vp.name}_0.jpg`);

  const h = await evaluate("document.documentElement.scrollHeight");
  let idx = 1;
  for (let y = vp.height; y < h; y += vp.height) {
    await evaluate(`scrollTo(0, ${y})`);
    await sleep(650);
    await shot(`${out}/${vp.name}_${idx++}.jpg`);
  }
  report.push({ viewport: vp.name, slices: idx, errors: [...errors], horizontalOverflowPx: await evaluate("document.documentElement.scrollWidth - innerWidth") });
}
ws.close(); edge.kill();
console.log(JSON.stringify(report, null, 2));
