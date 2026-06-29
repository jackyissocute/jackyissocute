export const W = 112;
export const H = 112;
export const SCALE = 4;
export const PIXEL = 3;

export const PALETTE = {
  ".": null,
  C: "#F5E6C8",
  O: "#E8954A",
  D: "#C46B28",
  N: "#FF9999",
  M: "#FF7777",
  E: "#222222",
  W: "#FFFFFF",
  P: "#FFB4B4",
  I: "#FFE8D0",
};

export function drawSprite(ctx, rows, x, y, bob = 0, pixelSize = PIXEL) {
  const yOff = Math.round(bob) * pixelSize;
  for (let row = 0; row < rows.length; row++) {
    const line = rows[row];
    for (let col = 0; col < line.length; col++) {
      const color = PALETTE[line[col]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(
        x + col * pixelSize,
        y + row * pixelSize + yOff,
        pixelSize,
        pixelSize,
      );
    }
  }
}

export function clearFrame(ctx) {
  ctx.clearRect(0, 0, W, H);
}

export function spriteSize(rows, pixelSize = PIXEL) {
  const h = rows.length * pixelSize;
  const w = Math.max(...rows.map((r) => r.length)) * pixelSize;
  return { w, h };
}

export function centerOrigin(rows, pixelSize = PIXEL) {
  const { w, h } = spriteSize(rows, pixelSize);
  return {
    x: Math.round((W - w) / 2),
    y: Math.round((H - h) / 2),
  };
}
