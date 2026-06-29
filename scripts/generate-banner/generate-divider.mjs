import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../../assets/wave-divider.png");

const W = 1400;
const H = 64;

const PRIMARY = [
  [0, 32], [120, 32], [145, 24], [280, 24], [305, 40], [480, 40],
  [505, 26], [680, 26], [705, 42], [880, 42], [905, 28], [1080, 28],
  [1105, 36], [1280, 36], [1400, 32],
];

const SECONDARY = [
  [0, 46], [95, 46], [130, 36], [310, 36], [340, 52], [520, 52],
  [550, 38], [730, 38], [760, 54], [940, 54], [970, 40], [1150, 40],
  [1180, 48], [1400, 46],
];

function strokePolyline(ctx, points, { color, width, alpha = 1, dash = [] }) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";
  ctx.globalAlpha = alpha;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();
  ctx.restore();
}

function fillBlock(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, W, H);

strokePolyline(ctx, PRIMARY, { color: "#00F0FF", width: 4, alpha: 1 });
strokePolyline(ctx, SECONDARY, { color: "#FF2A6D", width: 3, alpha: 0.75 });
strokePolyline(ctx, [[620, 32], [680, 32]], { color: "#FCEE0A", width: 3, alpha: 0.7, dash: [8, 6] });

fillBlock(ctx, 116, 28, 10, "#00F0FF");
fillBlock(ctx, 1272, 30, 10, "#FF2A6D");
fillBlock(ctx, 612, 30, 6, "#FCEE0A");
fillBlock(ctx, 688, 30, 6, "#FCEE0A");

writeFileSync(OUT, canvas.toBuffer("image/png"));
console.log(`Wrote ${OUT} (${W}x${H})`);
