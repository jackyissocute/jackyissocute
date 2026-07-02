import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import gifenc from "gifenc";
import { FRAME_SIZE, SOURCE_DIR } from "./source-config.mjs";

const { GIFEncoder, quantize, applyPalette } = gifenc;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../../assets/pets");

export const TRAVERSE_WIDTH = 640;
export const TRAVERSE_HEIGHT = 72;
export const TRAVERSE_SCALE = 2;
export const TRAVERSE_CAT_SCALE = 1;
export const TRAVERSE_CAT_PX = FRAME_SIZE * TRAVERSE_CAT_SCALE;

const QUANT_OPTS = {
  format: "rgba4444",
  oneBitAlpha: true,
  clearAlpha: true,
  clearAlphaThreshold: 127,
  clearAlphaColor: 0x00,
};

const BG_THRESHOLD = 28;

/** @type {Array<{ id: string, file: string, source: string, frameCount: number, fps: number, stepPx: number, turnPause: number }>} */
export const TRAVERSE_PETS = [
  {
    id: "compass",
    file: "cat-compass.gif",
    source: "walk.png",
    frameCount: 7,
    fps: 16,
    stepPx: 9,
    turnPause: 2,
  },
];

function findTransparentIndex(palette) {
  for (let i = 0; i < palette.length; i++) {
    const c = palette[i];
    if (c.length === 4 && c[3] === 0) return i;
  }
  return 0;
}

function stripBlackBackground(canvas) {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] <= BG_THRESHOLD && data[i + 1] <= BG_THRESHOLD && data[i + 2] <= BG_THRESHOLD) {
      data[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function getWalkFrame(strip, frameIndex, flip) {
  const canvas = createCanvas(FRAME_SIZE, FRAME_SIZE);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    strip,
    frameIndex * FRAME_SIZE,
    0,
    FRAME_SIZE,
    FRAME_SIZE,
    0,
    0,
    FRAME_SIZE,
    FRAME_SIZE,
  );
  stripBlackBackground(canvas);
  if (flip) {
    const flipped = createCanvas(FRAME_SIZE, FRAME_SIZE);
    const fctx = flipped.getContext("2d");
    fctx.translate(FRAME_SIZE, 0);
    fctx.scale(-1, 1);
    fctx.drawImage(canvas, 0, 0);
    return flipped;
  }
  return canvas;
}

function buildTraverseSequence(pet) {
  const maxX = TRAVERSE_WIDTH - TRAVERSE_CAT_PX;
  const positions = [];
  for (let x = maxX; x >= 0; x -= pet.stepPx) positions.push({ x, flip: true });
  for (let p = 0; p < pet.turnPause; p++) positions.push({ x: 0, flip: true });
  for (let x = 0; x <= maxX; x += pet.stepPx) positions.push({ x, flip: false });
  for (let p = 0; p < pet.turnPause; p++) positions.push({ x: maxX, flip: false });
  return positions;
}

function renderTraverseFrame(strip, pet, pos, walkIndex) {
  const canvas = createCanvas(TRAVERSE_WIDTH, TRAVERSE_HEIGHT);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, TRAVERSE_WIDTH, TRAVERSE_HEIGHT);

  const frame = getWalkFrame(strip, walkIndex % pet.frameCount, pos.flip);
  const catY = Math.round((TRAVERSE_HEIGHT - TRAVERSE_CAT_PX) / 2);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frame, pos.x, catY, TRAVERSE_CAT_PX, TRAVERSE_CAT_PX);
  return canvas;
}

export async function buildTraverseGif(pet) {
  const sourcePath = join(SOURCE_DIR, pet.source);
  const strip = await loadImage(sourcePath);
  const positions = buildTraverseSequence(pet);
  const frameMs = Math.round(1000 / pet.fps);
  const gif = GIFEncoder();

  for (let i = 0; i < positions.length; i++) {
    const logical = renderTraverseFrame(strip, pet, positions[i], i);
    const outW = TRAVERSE_WIDTH * TRAVERSE_SCALE;
    const outH = TRAVERSE_HEIGHT * TRAVERSE_SCALE;
    const upscale = createCanvas(outW, outH);
    const uctx = upscale.getContext("2d");
    uctx.clearRect(0, 0, outW, outH);
    uctx.imageSmoothingEnabled = false;
    uctx.drawImage(logical, 0, 0, outW, outH);

    const { data, width, height } = uctx.getImageData(0, 0, outW, outH);
    const palette = quantize(data, 64, QUANT_OPTS);
    const encoded = applyPalette(data, palette, "rgba4444");

    gif.writeFrame(encoded, width, height, {
      palette,
      delay: frameMs,
      repeat: i === 0 ? 0 : undefined,
      dispose: 2,
      transparent: true,
      transparentIndex: findTransparentIndex(palette),
    });
  }

  gif.finish();
  return { bytes: gif.bytes(), frameTotal: positions.length };
}

export async function buildAllTraversePets() {
  const results = [];
  for (const pet of TRAVERSE_PETS) {
    const { bytes, frameTotal } = await buildTraverseGif(pet);
    const outPath = join(OUT_DIR, pet.file);
    writeFileSync(outPath, Buffer.from(bytes));
    const sizeKb = (bytes.length / 1024).toFixed(1);
    const dims = `${TRAVERSE_WIDTH * TRAVERSE_SCALE}x${TRAVERSE_HEIGHT * TRAVERSE_SCALE}`;
    console.log(`  ${pet.file} (${sizeKb} KB, ${dims}, ${frameTotal} frames traverse @ ${pet.fps} fps)`);
    results.push({ ...pet, sizeKb, dims, frameTotal });
  }
  return results;
}
