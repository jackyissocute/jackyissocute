import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import gifenc from "gifenc";
import {
  FRAME_SIZE,
  OUTPUT_SCALE,
  SECTION_PETS,
  SOURCE_DIR,
} from "./source-config.mjs";

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

const BG_THRESHOLD = 28;

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

function stripBlackBackground(canvas) {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= BG_THRESHOLD && g <= BG_THRESHOLD && b <= BG_THRESHOLD) {
      data[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function flipHorizontal(frameCanvas) {
  const flipped = createCanvas(FRAME_SIZE, FRAME_SIZE);
  const ctx = flipped.getContext("2d");
  ctx.clearRect(0, 0, FRAME_SIZE, FRAME_SIZE);
  ctx.translate(FRAME_SIZE, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(frameCanvas, 0, 0);
  return flipped;
}

function extractFrame(stripImage, frameIndex, flip = false) {
  const canvas = createCanvas(FRAME_SIZE, FRAME_SIZE);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, FRAME_SIZE, FRAME_SIZE);
  ctx.drawImage(
    stripImage,
    frameIndex * FRAME_SIZE,
    0,
    FRAME_SIZE,
    FRAME_SIZE,
    0,
    0,
    FRAME_SIZE,
    FRAME_SIZE,
  );
  const cleaned = stripBlackBackground(canvas);
  return flip ? flipHorizontal(cleaned) : cleaned;
}

function upscaleFrame(frameCanvas) {
  const outW = FRAME_SIZE * OUTPUT_SCALE;
  const outH = FRAME_SIZE * OUTPUT_SCALE;
  const upscale = createCanvas(outW, outH);
  const ctx = upscale.getContext("2d");
  ctx.clearRect(0, 0, outW, outH);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frameCanvas, 0, 0, outW, outH);
  return upscale;
}

async function buildPetGif(pet) {
  const sourcePath = join(SOURCE_DIR, pet.source);
  const strip = await loadImage(sourcePath);
  const fps = pet.fps ?? 10;
  const frameMs = Math.round(1000 / fps);

  const gif = GIFEncoder();

  for (let i = 0; i < pet.frameCount; i++) {
    const frame = extractFrame(strip, i, pet.flip ?? false);
    const canvas = upscaleFrame(frame);
    const { data, width, height } = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    const palette = quantize(data, 64, QUANT_OPTS);
    const index = applyPalette(data, palette, "rgba4444");
    const transparentIndex = findTransparentIndex(palette);

    gif.writeFrame(index, width, height, {
      palette,
      delay: frameMs,
      repeat: i === 0 ? 0 : undefined,
      dispose: 2,
      transparent: true,
      transparentIndex,
    });
  }

  gif.finish();
  return gif.bytes();
}

export async function buildAllPets() {
  const results = [];

  for (const pet of SECTION_PETS) {
    const bytes = await buildPetGif(pet);
    const outPath = join(OUT_DIR, pet.file);
    writeFileSync(outPath, Buffer.from(bytes));
    const sizeKb = (bytes.length / 1024).toFixed(1);
    const dims = `${FRAME_SIZE * OUTPUT_SCALE}x${FRAME_SIZE * OUTPUT_SCALE}`;
    results.push({ ...pet, outPath, sizeKb, dims });
    console.log(`  ${pet.file} (${sizeKb} KB, ${dims}, ${pet.frameCount} frames @ ${pet.fps ?? 10} fps${pet.flip ? ", flipped" : ""})`);
  }

  return results;
}
