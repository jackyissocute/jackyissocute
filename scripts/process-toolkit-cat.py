#!/usr/bin/env python3
"""Crop, pixelate, and compress the toolkit headphones cat GIF."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

INPUT = Path(
    "/Users/jackylin/Downloads/Silly Cat Bumping Head On Train Bus Ride Headphones GIF - "
    "Silly cat bumping head on train bus ride Cat Headphones - Discover & Share GIFs.gif"
)
OUTPUT = Path(__file__).resolve().parent.parent / "assets/pets/cat-headphones.gif"

GRID_COLS = 28
PIXEL_SIZE = 4  # 28 * 4 = 112px output width
MAX_COLORS = 56
MAX_FRAMES = 32
FIXED_CROP = (148, 36, 448, 472)


def load_frames(source: Image.Image) -> tuple[list[Image.Image], list[int]]:
    frames: list[Image.Image] = []
    durations: list[int] = []
    index = 0
    while True:
        try:
            source.seek(index)
        except EOFError:
            break
        frames.append(source.convert("RGB"))
        durations.append(source.info.get("duration", 100))
        index += 1
    return frames, durations


def crop_box(_frames: list[Image.Image]) -> tuple[int, int, int, int]:
    return FIXED_CROP


def crop_frame(frame: Image.Image, bbox: tuple[int, int, int, int]) -> Image.Image:
    return frame.crop(bbox)


def pixelate_frame(frame: Image.Image) -> Image.Image:
    width, height = frame.size
    grid_rows = max(1, round(height * GRID_COLS / width))

    # Nearest-only downscale/upscale keeps hard pixel edges.
    small = frame.resize((GRID_COLS, grid_rows), Image.Resampling.NEAREST)
    pixelated = small.resize(
        (GRID_COLS * PIXEL_SIZE, grid_rows * PIXEL_SIZE),
        Image.Resampling.NEAREST,
    )
    return pixelated


def decimate_frames(
    frames: list[Image.Image], durations: list[int], max_frames: int
) -> tuple[list[Image.Image], list[int]]:
    if len(frames) <= max_frames:
        return frames, durations

    step = len(frames) / max_frames
    picked_frames: list[Image.Image] = []
    picked_durations: list[int] = []
    for i in range(max_frames):
        index = min(len(frames) - 1, round(i * step))
        picked_frames.append(frames[index])
        picked_durations.append(durations[index])
    return picked_frames, picked_durations


def save_gif(frames: list[Image.Image], durations: list[int], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    palette_frames = [
        frame.quantize(colors=MAX_COLORS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
        for frame in frames
    ]
    palette_frames[0].save(
        output,
        save_all=True,
        append_images=palette_frames[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )


def main() -> None:
    source = Image.open(INPUT)
    frames, durations = load_frames(source)
    bbox = crop_box(frames)
    cropped = [crop_frame(frame, bbox) for frame in frames]
    pixelated = [pixelate_frame(frame) for frame in cropped]
    pixelated, durations = decimate_frames(pixelated, durations, MAX_FRAMES)

    save_gif(pixelated, durations, OUTPUT)

    size_kb = OUTPUT.stat().st_size / 1024
    print(f"Wrote {OUTPUT}")
    print(f"  crop box: {bbox}")
    print(f"  grid: {GRID_COLS} cols x {PIXEL_SIZE}px blocks")
    print(f"  output size: {pixelated[0].size[0]}x{pixelated[0].size[1]}")
    print(f"  frames: {len(pixelated)}")
    print(f"  file size: {size_kb:.1f} KB")


if __name__ == "__main__":
    main()
