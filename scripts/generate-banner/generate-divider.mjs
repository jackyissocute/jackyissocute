import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas } from "@napi-rs/canvas";
import gifenc from "gifenc";
import gsap from "gsap";
import {
  W,
  H,
  SCALE,
  createDividerState,
  drawDividerFrame,
} from "./divider-scene.mjs";

const { GIFEncoder, quantize, applyPalette } = gifenc;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_GIF = join(__dirname, "../../assets/section-divider.gif");
const OUT_PNG = join(__dirname, "../../assets/section-divider.png");

const FPS = 12;
const DURATION = 2.8;
const FRAME_COUNT = Math.round(FPS * DURATION);
const FRAME_MS = Math.round(1000 / FPS);

const state = createDividerState();
const anim = {
  time: 0,
  glitchX: 0,
  glitchActive: 0,
  pulse: 0,
  scanX: -5,
  scanIntensity: 0.12,
  dataOffset: 0,
};

function sync() {
  state.time = anim.time;
  state.glitchX = anim.glitchX;
  state.glitchActive = anim.glitchActive > 0.5;
  state.pulse = anim.pulse;
  state.scanX = anim.scanX;
  state.scanIntensity = anim.scanIntensity;
  state.dataOffset = anim.dataOffset;
}

function buildTimeline() {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0, paused: true });

  tl.to(anim, { time: DURATION, duration: DURATION, ease: "none" }, 0);
  tl.to(anim, { dataOffset: 40, duration: DURATION, ease: "none" }, 0);
  tl.to(anim, { scanX: W + 5, duration: DURATION * 0.9, ease: "none" }, 0);

  tl.to(anim, {
    pulse: 1,
    duration: 0.6,
    yoyo: true,
    repeat: 3,
    ease: "sine.inOut",
  }, 0);

  tl.to(anim, {
    scanIntensity: 0.28,
    duration: 0.25,
    yoyo: true,
    repeat: 5,
    ease: "sine.inOut",
  }, 0.1);

  [0.5, 1.3, 2.0, 2.5].forEach((t) => {
    tl.to(anim, {
      glitchActive: 1,
      glitchX: 2,
      duration: 0.04,
      yoyo: true,
      repeat: 4,
      ease: "steps(1)",
    }, t);
    tl.to(anim, { glitchActive: 0, glitchX: 0, duration: 0.01 }, t + 0.28);
  });

  return tl;
}

function renderFrame(tl, frameIndex) {
  tl.progress(frameIndex / FRAME_COUNT);
  sync();

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  drawDividerFrame(ctx, state);

  const upscale = createCanvas(W * SCALE, H * SCALE);
  const uctx = upscale.getContext("2d");
  uctx.imageSmoothingEnabled = false;
  uctx.drawImage(canvas, 0, 0, W * SCALE, H * SCALE);

  return upscale;
}

async function main() {
  console.log(`Rendering ${FRAME_COUNT} divider frames at ${FPS} fps...`);

  const tl = buildTimeline();
  const gif = GIFEncoder();
  let lastCanvas = null;

  for (let i = 0; i < FRAME_COUNT; i++) {
    const canvas = renderFrame(tl, i);
    lastCanvas = canvas;
    const { data, width, height } = canvas.getContext("2d").getImageData(0, 0, W * SCALE, H * SCALE);
    const palette = quantize(data, 48);
    const index = applyPalette(data, palette);

    gif.writeFrame(index, width, height, {
      palette,
      delay: FRAME_MS,
      repeat: i === 0 ? 0 : undefined,
      dispose: 2,
    });
  }

  gif.finish();
  const bytes = gif.bytes();
  writeFileSync(OUT_GIF, Buffer.from(bytes));

  if (lastCanvas) {
    writeFileSync(OUT_PNG, lastCanvas.toBuffer("image/png"));
  }

  const sizeKb = (bytes.length / 1024).toFixed(1);
  console.log(`Wrote ${OUT_GIF} (${sizeKb} KB, ${W * SCALE}x${H * SCALE})`);
  console.log(`Wrote ${OUT_PNG} (static poster frame)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
