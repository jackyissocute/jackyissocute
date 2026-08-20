#!/usr/bin/env python3
"""Trace dark image regions into font-independent SVG outlines."""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps
from skimage.measure import approximate_polygon, find_contours


def format_number(value: float) -> str:
    rounded = round(value, 2)
    if rounded == 0:
        return "0"
    return f"{rounded:.2f}".rstrip("0").rstrip(".")


def polygon_area(points: np.ndarray) -> float:
    x = points[:, 1]
    y = points[:, 0]
    return abs(float(np.dot(x, np.roll(y, 1)) - np.dot(y, np.roll(x, 1)))) / 2


def contour_to_path(contour: np.ndarray) -> str:
    coordinates = [
        f"{format_number(point[1] - 1)} {format_number(point[0] - 1)}"
        for point in contour
    ]
    return f"M{coordinates[0]}L{' '.join(coordinates[1:])}Z"


def trace_image(input_path: Path, output_path: Path, threshold: int) -> None:
    with Image.open(input_path) as source:
        grayscale = ImageOps.exif_transpose(source).convert("L")

    pixels = np.asarray(grayscale, dtype=np.float32)
    height, width = pixels.shape

    # The white padding closes contours that meet an edge of the source canvas.
    padded = np.pad(pixels, 1, mode="constant", constant_values=255)
    contours = find_contours(
        padded,
        level=threshold,
        fully_connected="high",
        positive_orientation="low",
    )

    paths: list[str] = []
    for contour in contours:
        simplified = approximate_polygon(contour, tolerance=0.12)
        if len(simplified) < 4 or polygon_area(simplified) < 0.04:
            continue
        paths.append(contour_to_path(simplified))

    path_data = "".join(paths)
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" preserveAspectRatio="xMinYMin meet">
  <title>Outlined ASCII art girl</title>
  <desc>Font-independent vector tracing of the supplied 450 by 512 JPEG at grayscale threshold {threshold}. The artwork contains no embedded raster image or text elements.</desc>
  <rect width="{width}" height="{height}" fill="#fff"/>
  <path d="{path_data}" fill="#111" fill-rule="evenodd" clip-rule="evenodd" shape-rendering="geometricPrecision"/>
</svg>
'''
    output_path.write_text(svg, encoding="utf-8")

    print(
        f"traced {len(paths)} closed outlines from {width}x{height} pixels "
        f"at threshold {threshold} -> {output_path}"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--threshold", type=int, default=176)
    args = parser.parse_args()
    trace_image(args.input, args.output, args.threshold)


if __name__ == "__main__":
    main()
