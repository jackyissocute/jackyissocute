export const W = 350;
export const H = 20;
export const SCALE = 4;

export const COLORS = {
  cyan: "#00F0FF",
  magenta: "#FF2A6D",
  yellow: "#FCEE0A",
  dimCyan: "#0A6670",
  dimMagenta: "#661133",
};

export const PRIMARY = [
  [0, 9], [30, 9], [36, 7], [70, 7], [76, 11], [120, 11],
  [126, 8], [170, 8], [176, 12], [220, 12], [226, 8], [270, 8],
  [276, 10], [320, 10], [350, 9],
];

export const SECONDARY = [
  [0, 13], [24, 13], [33, 11], [78, 11], [85, 15], [130, 15],
  [138, 11], [183, 11], [190, 15], [235, 15], [243, 12], [288, 12],
  [295, 14], [350, 13],
];

export const GLITCH_SEGMENT = [[155, 9], [170, 9]];

export const BLOCKS = [
  { x: 29, y: 8, size: 3, color: COLORS.cyan, phase: 0 },
  { x: 318, y: 9, size: 3, color: COLORS.magenta, phase: 1.2 },
  { x: 153, y: 8, size: 2, color: COLORS.yellow, phase: 0.5 },
  { x: 172, y: 8, size: 2, color: COLORS.yellow, phase: 0.8 },
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

function drawScanline(ctx, scanX, intensity) {
  ctx.save();
  ctx.fillStyle = COLORS.cyan;
  ctx.globalAlpha = intensity;
  ctx.fillRect(scanX, 0, 2, H);
  ctx.globalAlpha = intensity * 0.25;
  for (let y = 0; y < H; y += 2) {
    ctx.fillRect(0, y, W, 1);
  }
  ctx.restore();
}

function drawDataPixels(ctx, offset, time) {
  for (let i = 0; i < 18; i++) {
    const x = ((i * 23 + offset * 2) % (W + 8)) - 4;
    const y = 2 + (i % 5) * 3;
    const flicker = Math.sin(time * 8 + i) > 0.3;
    if (!flicker) continue;
    ctx.fillStyle = i % 3 === 0 ? COLORS.magenta : COLORS.cyan;
    ctx.globalAlpha = 0.45;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;
}

export function drawDividerFrame(ctx, state) {
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = false;

  const pulseAlpha = 0.65 + state.pulse * 0.35;
  const gx = state.glitchActive ? state.glitchX : 0;

  drawDataPixels(ctx, state.dataOffset, state.time);

  if (state.glitchActive) {
    strokePolyline(ctx, PRIMARY, { color: COLORS.dimMagenta, width: 1, alpha: 0.6, offsetX: gx - 1 });
    strokePolyline(ctx, PRIMARY, { color: COLORS.dimCyan, width: 1, alpha: 0.6, offsetX: gx + 1 });
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
    alpha: 0.55 + state.pulse * 0.25,
    offsetX: -gx * 0.5,
  });

  strokePolyline(ctx, GLITCH_SEGMENT, {
    color: COLORS.yellow,
    width: 1,
    alpha: 0.55 + state.pulse * 0.35,
    dash: [3, 2],
  });

  for (const block of BLOCKS) {
    const flicker = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(state.time * 6 + block.phase));
    fillBlock(ctx, block.x + gx, block.y, block.size, block.color, flicker);
  }

  if (state.scanX >= 0) {
    drawScanline(ctx, state.scanX, state.scanIntensity);
  }
}

export function createDividerState() {
  return {
    time: 0,
    glitchX: 0,
    glitchActive: false,
    pulse: 0,
    scanX: -5,
    scanIntensity: 0.12,
    dataOffset: 0,
  };
}
