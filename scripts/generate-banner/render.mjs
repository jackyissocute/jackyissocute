import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";
import gifenc from "gifenc";

const { GIFEncoder, quantize, applyPalette } = gifenc;
import gsap from "gsap";
import {
  W,
  H,
  SCALE,
  createInitialState,
  drawFrame,
} from "./scene.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "../../assets/banner.gif");

const FPS = 12;
const DURATION = 3.5;
const FRAME_COUNT = Math.round(FPS * DURATION);
const FRAME_MS = Math.round(1000 / FPS);

const state = createInitialState();

const animState = {
  rainOffset: 0,
  scanY: 0,
  scanIntensity: 0.06,
  glitchX: 0,
  glitchActive: 0,
  gridPulse: 0,
  time: 0,
};

function syncAnimToState() {
  state.rainOffset = animState.rainOffset;
  state.scanY = animState.scanY;
  state.scanIntensity = animState.scanIntensity;
  state.glitchX = animState.glitchX;
  state.glitchActive = animState.glitchActive > 0.5;
  state.gridPulse = animState.gridPulse;
  state.time = animState.time;
}

function buildTimeline() {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0, paused: true });

  tl.to(animState, {
    time: DURATION,
    rainOffset: 24,
    duration: DURATION,
    ease: "none",
  }, 0);

  tl.to(animState, {
    scanY: H,
    duration: DURATION * 0.85,
    ease: "none",
  }, 0);

  tl.to(animState, {
    scanIntensity: 0.14,
    duration: 0.4,
    yoyo: true,
    repeat: 3,
    ease: "sine.inOut",
  }, 0.2);

  tl.to(animState, {
    gridPulse: 1,
    duration: 1.2,
    yoyo: true,
    repeat: 1,
    ease: "sine.inOut",
  }, 0);

  [0.8, 1.6, 2.4, 3.1].forEach((t) => {
    tl.to(animState, {
      glitchActive: 1,
      glitchX: 3,
      duration: 0.04,
      yoyo: true,
      repeat: 5,
      ease: "steps(1)",
    }, t);
    tl.to(animState, { glitchActive: 0, glitchX: 0, duration: 0.01 }, t + 0.35);
  });

  return tl;
}

function renderFrame(tl, frameIndex) {
  tl.progress(frameIndex / FRAME_COUNT);
  syncAnimToState();

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  drawFrame(ctx, state);

  const upscale = createCanvas(W * SCALE, H * SCALE);
  const uctx = upscale.getContext("2d");
  uctx.imageSmoothingEnabled = false;
  uctx.drawImage(canvas, 0, 0, W * SCALE, H * SCALE);

  return upscale;
}

async function main() {
  console.log(`Rendering ${FRAME_COUNT} frames at ${FPS} fps...`);

  const tl = buildTimeline();
  const gif = GIFEncoder();

  for (let i = 0; i < FRAME_COUNT; i++) {
    const canvas = renderFrame(tl, i);
    const { data, width, height } = canvas.getContext("2d").getImageData(0, 0, W * SCALE, H * SCALE);
    const palette = quantize(data, 64);
    const index = applyPalette(data, palette);

    gif.writeFrame(index, width, height, {
      palette,
      delay: FRAME_MS,
      repeat: i === 0 ? 0 : undefined,
      dispose: 2,
    });

    if ((i + 1) % 6 === 0) {
      process.stdout.write(`  frame ${i + 1}/${FRAME_COUNT}\r`);
    }
  }

  console.log("\nEncoding GIF...");
  gif.finish();
  const bytes = gif.bytes();
  writeFileSync(OUT_PATH, Buffer.from(bytes));

  const sizeKb = (bytes.length / 1024).toFixed(1);
  console.log(`Wrote ${OUT_PATH} (${sizeKb} KB, ${W * SCALE}x${H * SCALE})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
