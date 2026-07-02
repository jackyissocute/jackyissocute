#!/usr/bin/env python3
"""One-off import: strip black background from calico GIF frames."""

from pathlib import Path

from PIL import Image

BG_THRESHOLD = 28
INPUT = Path("/Users/jackylin/Downloads/Transparent Calico Gif.gif")
OUTPUT = Path(__file__).resolve().parent.parent / "assets/pets/cat-calico.gif"


def strip_black(frame: Image.Image) -> Image.Image:
    rgba = frame.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r <= BG_THRESHOLD and g <= BG_THRESHOLD and b <= BG_THRESHOLD:
                pixels[x, y] = (0, 0, 0, 0)
    return rgba


def main() -> None:
    source = Image.open(INPUT)
    frames: list[Image.Image] = []
    durations: list[int] = []

    index = 0
    while True:
        try:
            source.seek(index)
        except EOFError:
            break
        frames.append(strip_black(source.copy()))
        durations.append(source.info.get("duration", 100))
        index += 1

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        OUTPUT,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        disposal=2,
        optimize=False,
    )
    print(f"Wrote {OUTPUT} ({len(frames)} frames)")


if __name__ == "__main__":
    main()
