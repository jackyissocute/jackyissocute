import { clearFrame } from "./palette.mjs";
import {
  drawSitIdle,
  drawLookAround,
  drawWalkInPlace,
  drawPawBat,
  drawTailChase,
  drawLieSide,
} from "./sprites.mjs";

export const FPS = 12;

export const ANIMATIONS = [
  {
    id: "about",
    file: "cat-about.gif",
    duration: 2.8,
    draw(t) {
      clearFrame(this.ctx);
      const blink = t > 1.2 && t < 1.45;
      const bob = Math.sin(t * 2.5) * 0.4;
      drawSitIdle(this.ctx, blink, bob);
    },
  },
  {
    id: "compass",
    file: "cat-compass.gif",
    duration: 2.6,
    draw(t) {
      clearFrame(this.ctx);
      let headTurn = 0;
      if (t < 0.8) headTurn = -1;
      else if (t < 1.6) headTurn = 1;
      else headTurn = 0;
      const bob = Math.sin(t * 3) * 0.3;
      drawLookAround(this.ctx, headTurn, bob);
    },
  },
  {
    id: "toolkit",
    file: "cat-toolkit.gif",
    duration: 2.4,
    draw(t) {
      clearFrame(this.ctx);
      const frame = Math.floor(t * 6) % 4;
      const bob = frame === 2 ? -0.3 : Math.sin(t * 4) * 0.2;
      drawPawBat(this.ctx, frame, bob);
    },
  },
  {
    id: "featured",
    file: "cat-featured.gif",
    duration: 2.0,
    draw(t) {
      clearFrame(this.ctx);
      const frame = Math.floor(t * 8) % 4;
      const bob = Math.sin(t * 12) * 0.5;
      drawWalkInPlace(this.ctx, frame, bob);
    },
  },
  {
    id: "focus",
    file: "cat-focus.gif",
    duration: 2.8,
    draw(t) {
      clearFrame(this.ctx);
      const frame = Math.floor(t * 5) % 4;
      const bob = Math.sin(t * 6) * 0.35;
      drawTailChase(this.ctx, frame, bob);
    },
  },
  {
    id: "snapshot",
    file: "cat-snapshot.gif",
    duration: 3.0,
    draw(t) {
      clearFrame(this.ctx);
      const frame = Math.floor(t * 3) % 4;
      const bob = Math.sin(t * 1.8) * 0.25;
      drawLieSide(this.ctx, frame, bob);
    },
  },
];

export function frameCountFor(anim) {
  return Math.round(FPS * anim.duration);
}
