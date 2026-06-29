import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";
import gifenc from "gifenc";
import {
  W,
  H,
  SCALE,
  TIMING,
  computeStateAtTime,
  drawPetFrame,
} from "./cat-scene.mjs";

const { GIFEncoder, quantize, applyPalette } = gifenc;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_GIF = join(__dirname, "../../assets/pixel-cat.gif");

const QUANT_OPTS = {
  format: "rgba4444",
  oneBitAlpha: true,
  clearAlpha: true,
  clearAlphaThreshold: 127,
  clearAlphaColor: 0x00,
};

const { fps, frameCount, totalDuration } = TIMING;
const FRAME_MS = Math.round(1000 / fps);

function findTransparentIndex(palette) {
  for (let i = 0; i < palette.length; i++) {
    const c = palette[i];
    if (c.length === 4 && c[3] === 0) return i;
  }
  for (let i = 0; i < palette.length; i++) {
    const c = palette[i];
    if (c[0] === 0 && c[1] === 0 && c[2] === 0) return i;
  }
  return 0;
}

function renderFrame(frameIndex) {
  const t = (frameIndex / frameCount) * totalDuration;
  const state = computeStateAtTime(t);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  drawPetFrame(ctx, state);

  const upscale = createCanvas(W * SCALE, H * SCALE);
  const uctx = upscale.getContext("2d");
  uctx.clearRect(0, 0, W * SCALE, H * SCALE);
  uctx.imageSmoothingEnabled = false;
  uctx.drawImage(canvas, 0, 0, W * SCALE, H * SCALE);

  return upscale;
}

async function main() {
  console.log(`Rendering ${frameCount} pet frames at ${fps} fps (${totalDuration}s loop)...`);

  const gif = GIFEncoder();

  for (let i = 0; i < frameCount; i++) {
    const canvas = renderFrame(i);
    const { data, width, height } = canvas
      .getContext("2d")
      .getImageData(0, 0, W * SCALE, H * SCALE);
    const palette = quantize(data, 32, QUANT_OPTS);
    const index = applyPalette(data, palette, "rgba4444");
    const transparentIndex = findTransparentIndex(palette);

    gif.writeFrame(index, width, height, {
      palette,
      delay: FRAME_MS,
      repeat: i === 0 ? 0 : undefined,
      dispose: 2,
      transparent: true,
      transparentIndex,
    });

    if ((i + 1) % 6 === 0) {
      process.stdout.write(`  frame ${i + 1}/${frameCount}\r`);
    }
  }

  console.log("\nEncoding GIF...");
  gif.finish();
  const bytes = gif.bytes();
  writeFileSync(OUT_GIF, Buffer.from(bytes));

  const sizeKb = (bytes.length / 1024).toFixed(1);
  console.log(`Wrote ${OUT_GIF} (${sizeKb} KB, ${W * SCALE}x${H * SCALE}, transparent)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
