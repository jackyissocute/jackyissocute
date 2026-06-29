import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../../assets/wave-divider.png");

const W = 1400;
const H = 90;

function strokePath(ctx, d, style) {
  Object.assign(ctx, style);
  const parts = d.trim().split(/\s+/);
  ctx.beginPath();
  let i = 0;
  while (i < parts.length) {
    const cmd = parts[i++];
    if (cmd === "M" || cmd === "L") {
      const x = Number(parts[i++]);
      const y = Number(parts[i++]);
      if (cmd === "M") ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function fillRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, W, H);

strokePath(ctx, "M0 45 L120 45 L145 38 L280 38 L305 52 L480 52 L505 40 L680 40 L705 55 L880 55 L905 42 L1080 42 L1105 50 L1280 50 L1400 45", {
  strokeStyle: "#00F0FF",
  lineWidth: 2.5,
  lineCap: "square",
  lineJoin: "miter",
  globalAlpha: 1,
});

strokePath(ctx, "M0 58 L95 58 L130 48 L310 48 L340 62 L520 62 L550 50 L730 50 L760 65 L940 65 L970 52 L1150 52 L1180 60 L1400 58", {
  strokeStyle: "#FF2A6D",
  lineWidth: 1.5,
  lineCap: "square",
  globalAlpha: 0.55,
});

ctx.setLineDash([6, 4]);
strokePath(ctx, "M620 45 L680 45", {
  strokeStyle: "#FCEE0A",
  lineWidth: 2,
  lineCap: "square",
  globalAlpha: 0.45,
});
ctx.setLineDash([]);

fillRect(ctx, 116, 41, 8, 8, "#00F0FF");
fillRect(ctx, 1272, 46, 8, 8, "#FF2A6D");
fillRect(ctx, 612, 41, 4, 4, "#FCEE0A");
fillRect(ctx, 688, 41, 4, 4, "#FCEE0A");

writeFileSync(OUT, canvas.toBuffer("image/png"));
console.log(`Wrote ${OUT}`);
