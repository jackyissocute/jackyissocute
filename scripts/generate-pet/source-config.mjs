import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const SOURCE_DIR = join(__dirname, "../../assets/pets/source/skristi-gray-cat/64x64");

export const FRAME_SIZE = 64;
export const OUTPUT_SCALE = 2;

/** @type {Array<{ id: string, file: string, source: string, frameCount: number, fps?: number, animation?: "loop" | "pingpong", flip?: boolean, turnPause?: number }>} */
export const SECTION_PETS = [
  {
    id: "about",
    file: "cat-about.gif",
    source: "idle.png",
    frameCount: 7,
    fps: 8,
    animation: "loop",
  },
  {
    id: "compass",
    file: "cat-compass.gif",
    source: "walk.png",
    frameCount: 7,
    fps: 10,
    animation: "traverse",
  },
  {
    id: "toolkit",
    file: "cat-toolkit.gif",
    source: "attack.png",
    frameCount: 3,
    fps: 10,
    animation: "loop",
  },
  {
    id: "focus",
    file: "cat-focus.gif",
    source: "run.png",
    frameCount: 7,
    fps: 14,
    animation: "pingpong",
    turnPause: 2,
  },
  {
    id: "snapshot",
    file: "cat-snapshot.gif",
    source: "idle.png",
    frameCount: 7,
    fps: 6,
    animation: "loop",
    flip: true,
  },
];
