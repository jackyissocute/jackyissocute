import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../../assets/section-divider.png");

const W = 1400;
const H = 80;

const PRIMARY = [
  [0, 36], [120, 36], [145, 28], [280, 28], [305, 44], [480, 44],
  [505, 30], [680, 30], [705, 46], [880, 46], [905, 32], [1080, 32],
  [1105, 40], [1280, 40], [1400, 36],
];

const SECONDARY = [
  [0, 52], [95, 52], [130, 42], [310, 42], [340, 58], [520, 58],
  [550, 44], [730, 44], [760, 60], [940, 60], [970, 46], [1150, 46],
  [1180, 54], [1400, 52],
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
strokePolyline(ctx, [[620, 36], [680, 36]], { color: "#FCEE0A", width: 3, alpha: 0.7, dash: [8, 6] });

fillBlock(ctx, 116, 32, 10, "#00F0FF");
fillBlock(ctx, 1272, 34, 10, "#FF2A6D");
fillBlock(ctx, 612, 34, 6, "#FCEE0A");
fillBlock(ctx, 688, 34, 6, "#FCEE0A");

writeFileSync(OUT, canvas.toBuffer("image/png"));
console.log(`Wrote ${OUT} (${W}x${H})`);
