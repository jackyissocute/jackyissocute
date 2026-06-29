export const W = 320;
export const H = 48;
export const SCALE = 4;

const PALETTE = {
  ".": null,
  C: "#F5E6C8",
  O: "#E8954A",
  D: "#C46B28",
  N: "#FF9999",
  E: "#222222",
  W: "#FFFFFF",
  P: "#FFB4B4",
};

// Walk cycle — 4 frames, ~18×14 px each
const WALK_FRAMES = [
  [
    "....OOO.........",
    "...OCCCO........",
    "..OCCCECO.......",
    "..OCCEECO.......",
    "..OCCNCO........",
    "..OOCCCO........",
    "...OP.PO........",
    "...O...O........",
  ],
  [
    "....OOO.........",
    "...OCCCO........",
    "..OCCCECO.......",
    "..OCCEECO.......",
    "..OCCNCO........",
    "..OOCCCO........",
    "..OP...PO.......",
    "..O.....O.......",
  ],
  [
    "....OOO.........",
    "...OCCCO........",
    "..OCCCECO.......",
    "..OCCEECO.......",
    "..OCCNCO........",
    "..OOCCCO........",
    "...OPPO.........",
    "...O..O.........",
  ],
  [
    "....OOO.........",
    "..OCCCO.........",
    ".OCCCECO........",
    ".OCCEECO........",
    ".OCCNCO.........",
    ".OOCCCO.........",
    "OP...PO.........",
    "O.....O.........",
  ],
];

// Settle — standing → sitting
const SETTLE_FRAMES = [
  [
    "....OOO.........",
    "...OCCCO........",
    "..OCCCECO.......",
    "..OCCEECO.......",
    "..OCCNCO........",
    "..OOCCCO........",
    "...OPPO.........",
    "...O..O.........",
  ],
  [
    "....OOO.........",
    "...OCCCO........",
    "..OCCCECO.......",
    "..OCCEECO.......",
    "..OCCNCO........",
    "..OOCCCO........",
    "..OPPO..........",
    "..O............",
  ],
];

// Rest — lying down with idle variants
const REST_FRAMES = [
  [
    "................",
    "................",
    "....OOOO........",
    "...OCCCECO......",
    "..OCCCEECO......",
    "..OCCCNCCO......",
    "..OOCCCCCO......",
    "...OOCCCOO......",
    ".....OPPO.......",
  ],
  [
    "................",
    "................",
    "....OOOO........",
    "...OCCCDCO......",
    "..OCCCDDCO......",
    "..OCCCNCCO......",
    "..OOCCCCCO......",
    "...OOCCCOO......",
    ".....OPPO.......",
  ],
  [
    "................",
    "................",
    "....OOOO........",
    "...OCCCECO......",
    "..OCCCEECO......",
    "..OCCCNCCO......",
    "..OOCCCCCOO.....",
    "...OOCCCOO......",
    ".....OPPO.......",
  ],
];

function drawSprite(ctx, rows, x, y, bob = 0) {
  const yOff = Math.round(bob);
  for (let row = 0; row < rows.length; row++) {
    const line = rows[row];
    for (let col = 0; col < line.length; col++) {
      const key = line[col];
      const color = PALETTE[key];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + col, y + row + yOff, 1, 1);
    }
  }
}

export function createPetState() {
  return {
    catX: 8,
    catY: 18,
    pose: "walk",
    frameIndex: 0,
    bob: 0,
  };
}

export function drawPetFrame(ctx, state) {
  ctx.clearRect(0, 0, W, H);

  const { catX, catY, pose, frameIndex, bob } = state;

  if (pose === "walk") {
    const frame = WALK_FRAMES[frameIndex % WALK_FRAMES.length];
    drawSprite(ctx, frame, Math.round(catX), catY, bob);
    return;
  }

  if (pose === "settle") {
    const frame = SETTLE_FRAMES[Math.min(frameIndex, SETTLE_FRAMES.length - 1)];
    drawSprite(ctx, frame, Math.round(catX), catY + 2, bob);
    return;
  }

  const frame = REST_FRAMES[frameIndex % REST_FRAMES.length];
  drawSprite(ctx, frame, Math.round(catX), catY + 6, bob);
}

export const TIMING = {
  fps: 12,
  walkDuration: 2.5,
  settleDuration: 0.4,
  restDuration: 1.6,
};

TIMING.totalDuration = TIMING.walkDuration + TIMING.settleDuration + TIMING.restDuration;
TIMING.frameCount = Math.round(TIMING.fps * TIMING.totalDuration);

export function computeStateAtTime(t) {
  const loop = TIMING.totalDuration;
  t = ((t % loop) + loop) % loop;

  const walkEnd = TIMING.walkDuration;
  const settleEnd = walkEnd + TIMING.settleDuration;

  if (t < walkEnd) {
    const p = t / walkEnd;
    return {
      catX: 8 + p * 232,
      catY: 18,
      pose: "walk",
      frameIndex: Math.floor(t * 8) % 4,
      bob: Math.sin(t * 10) * 0.8,
    };
  }

  if (t < settleEnd) {
    const p = (t - walkEnd) / TIMING.settleDuration;
    return {
      catX: 240,
      catY: 18,
      pose: "settle",
      frameIndex: Math.min(1, Math.floor(p * 2)),
      bob: 0,
    };
  }

  const restT = t - settleEnd;
  return {
    catX: 240,
    catY: 18,
    pose: "rest",
    frameIndex: Math.floor(restT * 3) % 3,
    bob: Math.sin(restT * 2.5) * 0.5,
  };
}
