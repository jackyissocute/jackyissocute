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

export const PRIMARY = [
  [0, 5], [30, 5], [36, 4], [70, 4], [76, 6], [120, 6],
  [126, 5], [170, 5], [176, 6], [220, 6], [226, 5], [270, 5],
  [276, 5], [320, 5], [350, 5],
];

export const GLITCH_SEGMENT = [[155, 5], [170, 5]];

export const BLOCKS = [
  { x: 29, y: 4, size: 2, color: COLORS.cyan, phase: 0 },
  { x: 318, y: 4, size: 2, color: COLORS.magenta, phase: 1.2 },
  { x: 153, y: 4, size: 1, color: COLORS.yellow, phase: 0.5 },
  { x: 172, y: 4, size: 1, color: COLORS.yellow, phase: 0.8 },
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

function drawDataPixels(ctx, offset, time) {
  for (let i = 0; i < 8; i++) {
    const x = ((i * 47 + offset * 2) % (W + 8)) - 4;
    const y = 4 + (i % 2);
    const flicker = Math.sin(time * 8 + i) > 0.45;
    if (!flicker) continue;
    ctx.fillStyle = i % 3 === 0 ? COLORS.magenta : COLORS.cyan;
    ctx.globalAlpha = 0.28;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.globalAlpha = 1;
}

export function drawDividerFrame(ctx, state) {
  ctx.clearRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = false;

  const pulseAlpha = 0.7 + state.pulse * 0.25;
  const gx = state.glitchActive ? state.glitchX : 0;

  drawDataPixels(ctx, state.dataOffset, state.time);

  if (state.glitchActive) {
    strokePolyline(ctx, PRIMARY, { color: COLORS.dimMagenta, width: 1, alpha: 0.45, offsetX: gx - 1 });
    strokePolyline(ctx, PRIMARY, { color: COLORS.dimCyan, width: 1, alpha: 0.45, offsetX: gx + 1 });
  }

  strokePolyline(ctx, PRIMARY, {
    color: COLORS.cyan,
    width: 1,
    alpha: pulseAlpha,
    offsetX: gx,
  });

  strokePolyline(ctx, GLITCH_SEGMENT, {
    color: COLORS.yellow,
    width: 1,
    alpha: 0.5 + state.pulse * 0.25,
    dash: [3, 2],
  });

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
  };
}
