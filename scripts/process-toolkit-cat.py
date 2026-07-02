#!/usr/bin/env python3
"""Crop and optimize the toolkit headphones cat GIF from Downloads."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

INPUT = Path(
    "/Users/jackylin/Downloads/Silly Cat Bumping Head On Train Bus Ride Headphones GIF - "
    "Silly cat bumping head on train bus ride Cat Headphones - Discover & Share GIFs.gif"
)
OUTPUT = Path(__file__).resolve().parent.parent / "assets/pets/cat-headphones.gif"

# Remove the left blur window; keep cat, headphones, and seat at source resolution.
FIXED_CROP = (148, 36, 448, 472)
README_WIDTH = 120


def load_cropped_frames(source: Image.Image) -> tuple[list[Image.Image], list[int]]:
    frames: list[Image.Image] = []
    durations: list[int] = []
    index = 0
    while True:
        try:
            source.seek(index)
        except EOFError:
            break
        frame = source.convert("RGBA").crop(FIXED_CROP)
        frames.append(frame)
        durations.append(source.info.get("duration", 100))
        index += 1
    return frames, durations


def save_gif(frames: list[Image.Image], durations: list[int], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        output,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=True,
        disposal=2,
    )


def main() -> None:
    source = Image.open(INPUT)
    frames, durations = load_cropped_frames(source)
    save_gif(frames, durations, OUTPUT)

    width, height = frames[0].size
    display_height = round(height * README_WIDTH / width)
    size_kb = OUTPUT.stat().st_size / 1024
    print(f"Wrote {OUTPUT}")
    print(f"  crop box: {FIXED_CROP}")
    print(f"  output size: {width}x{height}")
    print(f"  frames: {len(frames)}")
    print(f"  file size: {size_kb:.1f} KB")
    print(f"  readme display: width={README_WIDTH} (~{display_height}px tall)")


if __name__ == "__main__":
    main()
