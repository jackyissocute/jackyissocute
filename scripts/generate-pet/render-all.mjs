import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";
import gifenc from "gifenc";
import { W, H, SCALE } from "./palette.mjs";
import { ANIMATIONS, FPS, frameCountFor } from "./animations.mjs";

const { GIFEncoder, quantize, applyPalette } = gifenc;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../../assets/pets");

const QUANT_OPTS = {
  format: "rgba4444",
  oneBitAlpha: true,
  clearAlpha: true,
  clearAlphaThreshold: 127,
  clearAlphaColor: 0x00,
};

const FRAME_MS = Math.round(1000 / FPS);

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

function renderAnimation(anim) {
  const frameCount = frameCountFor(anim);
  const logical = createCanvas(W, H);
  const ctx = logical.getContext("2d");
  anim.ctx = ctx;

  const gif = GIFEncoder();

  for (let i = 0; i < frameCount; i++) {
    const t = (i / frameCount) * anim.duration;
    anim.draw(t);

    const upscale = createCanvas(W * SCALE, H * SCALE);
    const uctx = upscale.getContext("2d");
    uctx.clearRect(0, 0, W * SCALE, H * SCALE);
    uctx.imageSmoothingEnabled = false;
    uctx.drawImage(logical, 0, 0, W * SCALE, H * SCALE);

    const { data, width, height } = uctx.getImageData(0, 0, W * SCALE, H * SCALE);
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
  }

  gif.finish();
  return gif.bytes();
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Rendering ${ANIMATIONS.length} section pets at ${FPS} fps...`);

  for (const anim of ANIMATIONS) {
    const bytes = renderAnimation(anim);
    const outPath = join(OUT_DIR, anim.file);
    writeFileSync(outPath, Buffer.from(bytes));
    const sizeKb = (bytes.length / 1024).toFixed(1);
    console.log(`  ${anim.file} (${sizeKb} KB, ${W * SCALE}x${H * SCALE})`);
  }

  console.log(`Done — wrote ${ANIMATIONS.length} GIFs to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
