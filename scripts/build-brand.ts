import { mkdir } from "node:fs/promises";
import { parse } from "opentype.js";
import sharp from "sharp";

const root = "assets/brand";
const tokens = await Bun.file(`${root}/tokens/brand-tokens.json`).json();
const c = tokens.colors;
const sans = parse(await Bun.file(`${root}/fonts/SpaceGrotesk-Semibold.ttf`).arrayBuffer());
const bodyFont = parse(await Bun.file(`${root}/fonts/SpaceGrotesk-Regular.ttf`).arrayBuffer());
const mono = parse(await Bun.file(`${root}/fonts/JetBrainsMono-Regular.ttf`).arrayBuffer());

function text(value: string, x: number, y: number, size: number, fill = c.ink, technical = false) {
  const font = technical ? mono : size <= 28 ? bodyFont : sans;
  const path = font.getPath(value, x, y, size);
  const data = path.toPathData(2);
  if (/NaN|Infinity/.test(data)) throw new Error(`Invalid text outline: ${value}`);
  return `<path fill="${fill}" d="${data}"/>`;
}

function symbol(x = 0, y = 0, size = 128, color?: string) {
  // The counter stays transparent; gold and ember meet along the rising flame.
  const flame = "M20 68V56L48 28V8L80 40V68L60 88H40Z M36 64V68L46 78H54L64 68V64L50 50Z";
  const right = "M48 8L80 40V68L60 88H50V78H54L64 68V64L50 50L48 52V28Z";
  return `<g transform="translate(${x} ${y}) scale(${size / 128})"><g transform="translate(14 16)"><path fill="${color ?? c.gold}" fill-rule="evenodd" d="${flame}"/>${color ? "" : `<path fill="${c.ember}" d="${right}"/>`}</g></g>`;
}

function lockup(x = 0, y = 0, scale = 1, reversed = false, color?: string) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${symbol(0, 0, 128, color)}${text("stoke", 124, 95, 96, color ?? (reversed ? c.paper : c.ink))}</g>`;
}

function svg(width: number, height: number, title: string, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${title}</title>${body}</svg>\n`;
}

function rect(x: number, y: number, width: number, height: number, fill: string, radius = 0) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}"/>`;
}

async function artwork(name: string, width: number, height: number, title: string, body: string) {
  const source = svg(width, height, title, body);
  const isLogo = name.startsWith("logos/");
  const svgPath = `${root}/${isLogo ? name.replace("logos/", "logos/svg/") : name}.svg`;
  const pngPath = `${root}/${isLogo ? name.replace("logos/", "logos/png/") : name}.png`;
  await Bun.write(svgPath, source);
  await sharp(Buffer.from(source)).png().toFile(pngPath);
}

await Promise.all(["logos/svg", "logos/png", "applications"].map((dir) => mkdir(`${root}/${dir}`, { recursive: true })));
await artwork("logos/stoke-primary", 400, 128, "Stoke primary logo", lockup());
await artwork("logos/stoke-reversed", 400, 128, "Stoke reversed logo", lockup(0, 0, 1, true));
for (const [name, color] of [["ink", c.ink], ["paper", c.paper]] as const) {
  await artwork(`logos/stoke-${name}`, 400, 128, `Stoke ${name} logo`, lockup(0, 0, 1, false, color));
  await artwork(`logos/symbol-${name}`, 128, 128, `Stoke ${name} symbol`, symbol(0, 0, 128, color));
  await artwork(`logos/wordmark-${name}`, 280, 128, `Stoke ${name} wordmark`, text("stoke", 10, 95, 96, color));
}
for (const [name, background, reversed] of [["paper", c.paper, false], ["ink", c.ink, true], ["gold", c.gold, false]] as const) {
  await artwork(`logos/stoke-on-${name}`, 400, 128, `Stoke on ${name}`, rect(0, 0, 400, 128, background) + lockup(0, 0, 1, reversed, name === "gold" ? c.ink : undefined));
}
await artwork("logos/symbol", 128, 128, "Stoke gold and ember flame", symbol());
await artwork("logos/stoke-stacked", 320, 300, "Stoke stacked logo", symbol(64, 0, 192) + text("stoke", 30, 264, 96));
const tile = svg(512, 512, "Stoke app icon", rect(0, 0, 512, 512, c.ink, 96) + symbol(0, 0, 512));
await Bun.write(`${root}/logos/svg/app-icon.svg`, tile);
await Bun.write(`${root}/logos/svg/favicon.svg`, svg(64, 64, "Stoke favicon", rect(0, 0, 64, 64, c.ink, 12) + symbol(0, 0, 64)));
await sharp(Buffer.from(tile)).png().toFile(`${root}/logos/png/app-icon.png`);
const iconBuffers = new Map<number, Buffer>();
for (const size of [16, 32, 48, 64, 180, 192, 256, 512]) {
  const data = await sharp(Buffer.from(tile)).resize(size, size).png().toBuffer();
  iconBuffers.set(size, data);
  await Bun.write(`${root}/logos/png/icon-${size}.png`, data);
}
// ICO entries can contain PNG data. Keep the three conventional browser sizes.
const entries = [16, 32, 48].map((size) => ({ size, data: iconBuffers.get(size)! }));
const header = Buffer.alloc(6 + entries.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(entries.length, 4);
let offset = header.length;
for (const [i, { size, data }] of entries.entries()) {
  const cursor = 6 + i * 16;
  header[cursor] = size;
  header[cursor + 1] = size;
  header.writeUInt16LE(1, cursor + 4);
  header.writeUInt16LE(32, cursor + 6);
  header.writeUInt32LE(data.length, cursor + 8);
  header.writeUInt32LE(offset, cursor + 12);
  offset += data.length;
}
await Bun.write(`${root}/logos/png/favicon.ico`, Buffer.concat([header, ...entries.map(({ data }) => data)]));

await artwork("applications/readme-banner", 1600, 480, "Stoke — Good work starts close to home.",
  rect(0, 0, 1600, 480, c.paper) + lockup(52, 24, 0.7) +
  text("Good work starts", 68, 244, 68) + text("close to home.", 68, 326, 68) +
  text("Kiln + Bellows. A shared home for local CI.", 72, 404, 26, c.steel) +
  symbol(1212, 144, 300));

await artwork("applications/social-preview", 1280, 640, "Stoke — Kiln and Bellows, together.",
  rect(0, 0, 1280, 640, c.ink) + lockup(50, 32, 0.65, true) +
  text("SMELTERY / LOCAL CI", 850, 86, 16, c["text-on-dark"], true) +
  text("Good work starts", 64, 282, 64, c.paper) + text("close to home.", 64, 362, 64, c.paper) +
  text("A shared home for local CI.", 68, 432, 26, c["text-on-dark"]) + symbol(928, 190, 260) +
  rect(64, 520, 1152, 1, c["surface-dark"]) +
  text("STOKE", 68, 578, 20, c.paper, true) + text("BELLOWS / ORCHESTRATION", 340, 578, 16, c.ember, true) +
  text("KILN / ENVIRONMENT", 900, 578, 16, c.gold, true));

const member = async (name: string, x: number, y: number, size: number) => {
  const source = await Bun.file(`${root}/logos/svg/${name}`).text();
  return `<g transform="translate(${x} ${y}) scale(${size / 128})">${source.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}</g>`;
};
const family = symbol(68, 690, 100) + text("stoke", 180, 754, 32) +
  await member("symbol-ember.svg", 590, 690, 100) + text("bellows", 702, 754, 32) +
  await member("symbol-gold.svg", 1110, 690, 100) + text("kiln", 1222, 754, 32);
await artwork("applications/docs-header", 1600, 900, "Stoke — A shared home for local CI.",
  rect(0, 0, 1600, 900, c.paper) + lockup(52, 28, 0.65) +
  text("LOCAL WORKFLOWS / SHARED PURPOSE", 72, 205, 16, c["burnt-ember"], true) +
  text("A little heat.", 68, 320, 80) + text("A shared purpose.", 68, 416, 80) +
  text("Bellows runs the workflows. Kiln supplies the runner.", 72, 492, 28, c.steel) +
  rect(72, 604, 1456, 1, c.border) + family +
  text("Assemble the workspace", 180, 790, 18, c.steel) + text("Plan and run the workflow", 702, 790, 18, c.steel) + text("Supply the environment", 1222, 790, 18, c.steel));

let board = rect(0, 0, 1600, 1200, c.paper) + rect(0, 0, 1600, 480, c.ink) +
  lockup(52, 28, 0.8, true) + text("SMELTERY / STOKE 01", 1210, 90, 15, c["text-on-dark"], true) +
  text("Good work starts", 64, 264, 72, c.paper) + text("close to home.", 64, 350, 72, c.paper) +
  text("A shared home for local CI.", 68, 422, 28, c["text-on-dark"]) + symbol(1210, 140, 300) +
  text("01 / IDENTITY", 68, 546, 14, c.steel, true) + lockup(52, 580, 0.8) +
  text("02 / TYPOGRAPHY", 590, 546, 14, c.steel, true) + text("Space Grotesk", 590, 636, 38) +
  text("Useful, with a little character.", 590, 678, 22, c.steel) +
  text("JetBrains Mono", 590, 744, 24, c.ink, true) + text("$ bash scripts/fleet.sh setup", 590, 786, 16, c.steel, true) +
  text("03 / THE PALETTE", 1110, 546, 14, c.steel, true);
for (const [i, name] of ["ink", "paper", "gold", "ember"].entries()) {
  const x = 1110 + i * 112;
  board += rect(x, 592, 96, 96, c[name], 8) + text(name, x, 724, 18) + text(c[name], x, 754, 12, c.steel, true);
}
board += rect(68, 858, 1464, 1, c.border) + text("04 / THE FAMILY", 68, 914, 14, c.steel, true) +
  symbol(68, 960, 100) + text("stoke", 180, 1020, 32) + text("Assemble the workspace", 180, 1058, 18, c.steel) +
  await member("symbol-ember.svg", 590, 960, 100) + text("bellows", 702, 1020, 32) + text("Keep the feedback close.", 702, 1058, 18, c.steel) +
  await member("symbol-gold.svg", 1110, 960, 100) + text("kiln", 1222, 1020, 32) + text("Built for the work.", 1222, 1058, 18, c.steel) +
  text("STOKE / OCTOBER 2026", 68, 1152, 14, c.steel, true);
await artwork("brand-board", 1600, 1200, "Stoke brand board", board);

const css = `/* Generated by scripts/build-brand.ts. Edit brand-tokens.json. */\n` +
  `@font-face{font-family:"Space Grotesk";src:url("../fonts/SpaceGrotesk.ttf") format("truetype");font-weight:300 700;font-display:swap}\n` +
  `@font-face{font-family:"JetBrains Mono";src:url("../fonts/JetBrainsMono.ttf") format("truetype");font-weight:100 800;font-display:swap}\n` +
  `:root{\n${Object.entries(c).map(([key, value]) => `  --stoke-${key}: ${value};`).join("\n")}\n` +
  `  --stoke-font-sans: "Space Grotesk", system-ui, sans-serif;\n  --stoke-font-mono: "JetBrains Mono", ui-monospace, monospace;\n  --stoke-radius: 8px;\n  --stoke-unit: 4px;\n}\n`;
await Bun.write(`${root}/tokens/brand.css`, css);
await Bun.write(`${root}/tokens/stoke.gpl`, `GIMP Palette\nName: Stoke\nColumns: 6\n#\n` + Object.entries(c).map(([name, color]) => `${[1, 3, 5].map((n) => parseInt(String(color).slice(n, n + 2), 16)).join(" ")}\t${name}`).join("\n") + "\n");
console.log("Built Stoke vector masters, PNGs, icons, applications, board and tokens.");
