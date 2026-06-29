export const W = 350;
export const H = 107;
export const SCALE = 4;

export const COLORS = {
  void: "#0D0221",
  voidMid: "#1A0533",
  purple: "#7B2CBF",
  cyan: "#00F0FF",
  magenta: "#FF2A6D",
  yellow: "#FCEE0A",
  white: "#F8FAFC",
  dimCyan: "#0A6670",
  dimMagenta: "#661133",
};

// 5x7 pixel font (1 = on). Rows top-to-bottom.
const GLYPHS = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10001", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  "/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

function drawGlyph(ctx, char, x, y, scale, color) {
  const glyph = GLYPHS[char];
  if (!glyph) return 6 * scale;
  ctx.fillStyle = color;
  for (let row = 0; row < glyph.length; row++) {
    for (let col = 0; col < glyph[row].length; col++) {
      if (glyph[row][col] === "1") {
        ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
      }
    }
  }
  return 6 * scale;
}

export function drawPixelText(ctx, text, x, y, scale, color, glitchX = 0) {
  let cursor = x + glitchX;
  for (const char of text) {
    cursor += drawGlyph(ctx, char, cursor, y, scale, color) + scale;
  }
}

export function measurePixelText(text, scale) {
  let width = 0;
  for (const char of text) {
    width += (GLYPHS[char] ? 6 : 3) * scale + scale;
  }
  return width - scale;
}

// Building definitions: [x, height, color, windowCols]
const BUILDINGS = [
  [0, 38, COLORS.voidMid, 3],
  [18, 52, "#12082A", 2],
  [32, 44, COLORS.voidMid, 2],
  [48, 60, "#0F0628", 3],
  [68, 48, COLORS.voidMid, 2],
  [84, 55, "#140730", 3],
  [104, 42, COLORS.voidMid, 2],
  [118, 58, "#0B0520", 3],
  [138, 50, COLORS.voidMid, 2],
  [154, 62, "#160838", 3],
  [174, 45, COLORS.voidMid, 2],
  [188, 56, "#100628", 3],
  [208, 48, COLORS.voidMid, 2],
  [224, 64, "#0D0422", 4],
  [248, 52, COLORS.voidMid, 3],
  [268, 46, "#130730", 2],
  [284, 58, COLORS.voidMid, 3],
  [304, 50, "#0E0525", 2],
  [320, 55, COLORS.voidMid, 3],
  [338, 40, "#110628", 2],
];

export function createWindows() {
  const windows = [];
  let id = 0;
  for (const [bx, bh] of BUILDINGS) {
    const bw = 14;
    const cols = Math.max(2, Math.floor(bw / 5));
    const rows = Math.max(2, Math.floor(bh / 10));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.35) {
          windows.push({
            id: id++,
            x: bx + 2 + c * 4,
            y: H - 28 - bh + 4 + r * 5,
            color: Math.random() > 0.5 ? COLORS.cyan : COLORS.magenta,
            phase: Math.random() * Math.PI * 2,
            on: Math.random() > 0.2,
          });
        }
      }
    }
  }
  return windows;
}

export function createRain(count = 90) {
  const drops = [];
  for (let i = 0; i < count; i++) {
    drops.push({
      x: Math.floor(Math.random() * W),
      y: Math.floor(Math.random() * H),
      speed: 1 + Math.floor(Math.random() * 3),
      len: 2 + Math.floor(Math.random() * 3),
      color: Math.random() > 0.6 ? COLORS.cyan : COLORS.magenta,
    });
  }
  return drops;
}

export function drawSky(ctx) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, COLORS.void);
  grad.addColorStop(0.55, COLORS.voidMid);
  grad.addColorStop(1, "#2A0A4A");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Purple haze band
  ctx.fillStyle = COLORS.purple;
  ctx.globalAlpha = 0.12;
  ctx.fillRect(0, H * 0.35, W, H * 0.25);
  ctx.globalAlpha = 1;
}

export function drawSkyline(ctx, windows, time = 0) {
  const groundY = H - 28;

  for (let i = 0; i < BUILDINGS.length; i++) {
    const [bx, bh, color] = BUILDINGS[i];
    const bw = i < BUILDINGS.length - 1 ? BUILDINGS[i + 1][0] - bx : W - bx;
    ctx.fillStyle = color;
    ctx.fillRect(bx, groundY - bh, bw - 1, bh);

    if (i % 3 === 0) {
      ctx.fillStyle = i % 2 === 0 ? COLORS.cyan : COLORS.magenta;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(bx, groundY - bh, bw - 1, 1);
      ctx.globalAlpha = 1;
    }
  }

  for (const win of windows) {
    if (!win.on) continue;
    const flicker = Math.sin(time * 5 + win.phase) * Math.sin(time * 2.3 + win.id * 0.7);
    const brightness = flicker > -0.1 ? 1 : 0.2;
    ctx.globalAlpha = 0.3 + brightness * 0.7;
    ctx.fillStyle = win.color;
    ctx.fillRect(win.x, win.y, 2, 2);
  }
  ctx.globalAlpha = 1;
}

export function drawGrid(ctx, pulse = 0) {
  const horizonY = H - 28;
  const vanishX = W / 2;
  const lines = 8;

  ctx.strokeStyle = COLORS.cyan;
  ctx.globalAlpha = 0.15 + pulse * 0.1;
  ctx.lineWidth = 1;

  for (let i = 0; i <= lines; i++) {
    const t = i / lines;
    const y = horizonY + (H - horizonY) * t * t;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  const cols = 14;
  for (let i = -cols; i <= cols; i++) {
    const bottomX = vanishX + i * 28;
    ctx.beginPath();
    ctx.moveTo(vanishX, horizonY);
    ctx.lineTo(bottomX, H);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function drawRain(ctx, drops, offset) {
  for (const drop of drops) {
    const y = (drop.y + offset * drop.speed) % (H + drop.len);
    ctx.fillStyle = drop.color;
    ctx.globalAlpha = 0.55;
    for (let j = 0; j < drop.len; j++) {
      ctx.fillRect(drop.x, (y + j) % H, 1, 1);
    }
  }
  ctx.globalAlpha = 1;
}

export function drawScanline(ctx, scanY, intensity = 0.08) {
  ctx.fillStyle = COLORS.cyan;
  ctx.globalAlpha = intensity;
  ctx.fillRect(0, scanY, W, 2);
  ctx.globalAlpha = intensity * 0.4;
  for (let y = 0; y < H; y += 3) {
    ctx.fillRect(0, y, W, 1);
  }
  ctx.globalAlpha = 1;
}

export function drawHudCorners(ctx, pulse = 0) {
  const len = 12;
  const pad = 6;
  const colors = [COLORS.cyan, COLORS.magenta, COLORS.yellow, COLORS.cyan];
  const corners = [
    [pad, pad],
    [W - pad, pad],
    [pad, H - pad],
    [W - pad, H - pad],
  ];

  ctx.lineWidth = 1;
  corners.forEach(([cx, cy], i) => {
    ctx.strokeStyle = colors[i];
    ctx.globalAlpha = 0.6 + pulse * 0.3;
    ctx.beginPath();
    if (cx < W / 2 && cy < H / 2) {
      ctx.moveTo(cx, cy + len);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + len, cy);
    } else if (cx > W / 2 && cy < H / 2) {
      ctx.moveTo(cx - len, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + len);
    } else if (cx < W / 2 && cy > H / 2) {
      ctx.moveTo(cx, cy - len);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + len, cy);
    } else {
      ctx.moveTo(cx - len, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy - len);
    }
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
}

export function drawTitle(ctx, state) {
  const mainText = "JACKY LIN // NIGHT CITY // DEV MODE";
  const scale = 1;
  const textWidth = measurePixelText(mainText, scale);
  const x = Math.floor((W - textWidth) / 2);
  const y = H - 12;

  drawPixelText(ctx, mainText, x + 1, y + 1, scale, COLORS.dimMagenta, 0);
  drawPixelText(ctx, mainText, x - 1, y, scale, COLORS.dimCyan, state.glitchX);

  if (state.glitchActive) {
    drawPixelText(ctx, mainText, x + state.glitchX + 1, y, scale, COLORS.magenta, 0);
    drawPixelText(ctx, mainText, x + state.glitchX - 1, y, scale, COLORS.cyan, 0);
  }

  drawPixelText(ctx, mainText, x + state.glitchX, y, scale, COLORS.yellow, 0);

  ctx.fillStyle = COLORS.cyan;
  ctx.globalAlpha = 0.35;
  ctx.fillRect(x - 3, y - 2, textWidth + 6, 1);
  ctx.fillStyle = COLORS.magenta;
  ctx.fillRect(x - 3, y + 8, textWidth + 6, 1);
  ctx.globalAlpha = 1;
}

export function drawFrame(ctx, state) {
  ctx.imageSmoothingEnabled = false;
  drawSky(ctx);
  drawSkyline(ctx, state.windows, state.time ?? 0);
  drawGrid(ctx, state.gridPulse);
  drawRain(ctx, state.rain, state.rainOffset);
  drawScanline(ctx, state.scanY, state.scanIntensity);
  drawHudCorners(ctx, state.gridPulse);
  drawTitle(ctx, state);
}

export function createInitialState() {
  return {
    windows: createWindows(),
    rain: createRain(),
    rainOffset: 0,
    scanY: 0,
    scanIntensity: 0.06,
    glitchX: 0,
    glitchActive: false,
    gridPulse: 0,
    time: 0,
  };
}
