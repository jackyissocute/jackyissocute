export const W = 350;
export const H = 10;
export const SCALE = 4;

export const COLORS = {
  cyan: "#00F0FF",
  magenta: "#FF2A6D",
  yellow: "#FCEE0A",
  dimCyan: "#0A6670",
  dimMagenta: "#661133",
};

// Cyan line — upper zigzag
export const PRIMARY = [
  [0, 5], [30, 5], [36, 4], [70, 4], [76, 6], [120, 6],
  [126, 5], [170, 5], [176, 6], [220, 6], [226, 5], [270, 6],
  [276, 5], [320, 5], [350, 5],
];

// Magenta line — lower zigzag, crosses cyan at shared vertices
export const SECONDARY = [
  [0, 7], [50, 7], [76, 6], [100, 8], [140, 7], [176, 6],
  [200, 8], [240, 7], [270, 6], [300, 7], [350, 7],
];

export const CROSSINGS = [
  [76, 6],
  [176, 6],
  [270, 6],
];

export const GLITCH_SEGMENT = [[155, 5], [170, 5]];

export const BLOCKS = [
  { x: 29, y: 4, size: 2, color: COLORS.cyan, phase: 0 },
  { x: 318, y: 4, size: 2, color: COLORS.magenta, phase: 1.2 },
];

function strokePolyline(ctx, points, { color, width, alpha = 1, dash = [], offsetX = 0, offsetY = 0 }) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";
  ctx.globalAlpha = alpha;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(points[0][0] + offsetX, points[0][1] + offsetY);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0] + offsetX, points[i][1] + offsetY);
  }
  ctx.stroke();
  ctx.restore();
}

function fillBlock(ctx, x, y, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.restore();
}

function drawScanBeam(ctx, scanX, intensity) {
  if (intensity <= 0) return;
  ctx.save();
  ctx.fillStyle = COLORS.cyan;
  ctx.globalAlpha = intensity;
  ctx.fillRect(scanX, 0, 1, H);
  ctx.restore();
}

function drawIntersections(ctx, state, gx) {
  const phase = (Math.sin(state.time * 18) + 1) / 2;
  const burst = state.intersectBurst;

  for (const [x, y] of CROSSINGS) {
    const px = x + gx;
    if (burst > 0.5 || phase > 0.72) {
      fillBlock(ctx, px - 1, y - 1, 2, COLORS.yellow, 0.85 + burst * 0.15);
      fillBlock(ctx, px, y, 1, COLORS.cyan, 0.9);
    } else if (phase > 0.38) {
      fillBlock(ctx, px - 1, y - 1, 2, COLORS.magenta, 0.9);
    } else {
      fillBlock(ctx, px - 1, y - 1, 1, COLORS.cyan, 0.85);
      fillBlock(ctx, px, y - 1, 1, COLORS.magenta, 0.85);
    }
  }
}

export function drawDividerFrame(ctx, state) {
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = false;

  const pulseAlpha = 0.7 + state.pulse * 0.25;
  const gx = state.glitchActive ? state.glitchX : 0;

  if (state.glitchActive) {
    strokePolyline(ctx, PRIMARY, { color: COLORS.dimMagenta, width: 1, alpha: 0.45, offsetX: gx - 1 });
    strokePolyline(ctx, PRIMARY, { color: COLORS.dimCyan, width: 1, alpha: 0.45, offsetX: gx + 1 });
    strokePolyline(ctx, SECONDARY, { color: COLORS.magenta, width: 1, alpha: 0.35, offsetX: gx + 1 });
  }

  strokePolyline(ctx, PRIMARY, {
    color: COLORS.cyan,
    width: 1,
    alpha: pulseAlpha,
    offsetX: gx,
  });

  strokePolyline(ctx, SECONDARY, {
    color: COLORS.magenta,
    width: 1,
    alpha: 0.65 + state.pulse * 0.3,
    offsetX: -gx * 0.5,
  });

  strokePolyline(ctx, GLITCH_SEGMENT, {
    color: COLORS.yellow,
    width: 1,
    alpha: 0.5 + state.pulse * 0.25,
    dash: [3, 2],
  });

  drawIntersections(ctx, state, gx);

  for (const block of BLOCKS) {
    const flicker = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(state.time * 6 + block.phase));
    fillBlock(ctx, block.x + gx, block.y, block.size, block.color, flicker);
  }

  if (state.scanX >= 0) {
    drawScanBeam(ctx, state.scanX, state.scanIntensity);
  }
}

export function createDividerState() {
  return {
    time: 0,
    glitchX: 0,
    glitchActive: false,
    pulse: 0,
    scanX: -5,
    scanIntensity: 0,
    dataOffset: 0,
    intersectBurst: 0,
  };
}
