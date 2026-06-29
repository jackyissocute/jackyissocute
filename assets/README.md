# Profile Assets

This folder contains the local visual assets used by the GitHub profile README.

## Files

- `banner.gif` - Primary animated cyberpunk pixel banner (1400×428). Generated locally with GSAP + Node canvas. Displays neon skyline, rain, scanlines, and **JACKY LIN // NIGHT CITY // DEV MODE** text with glitch effects.
- `banner-classic.svg` - Original static SVG artwork (soft cinematic research theme). Kept as a fallback reference.
- `neon-divider.gif` - Animated transparent cyberpunk divider (cyan + magenta intersecting lines with crossing flicker).
- `neon-divider.png` - Static poster frame from the divider animation.
- `pixel-cat.gif` - Animated transparent pixel cat (320×48 logical, 1280×192 output). Walks left-to-right, settles, rests with idle breathing/blink/tail flick, then loops. Generated locally with Node canvas + gifenc.
- `section-divider.gif` - Deprecated previous divider asset.
- `wave-divider.svg` - Source SVG for the divider.
- `wave-divider.png` - Deprecated; kept for reference.

## Regenerating the Banner

The animated banner is built from source in `scripts/generate-banner/`:

```bash
npm install
npm run generate:banner
```

This writes `assets/banner.gif`. GSAP runs at build time only — GitHub serves the static GIF in the README.

## Regenerating the Pixel Cat

The animated pet is built from source in `scripts/generate-pet/`:

```bash
npm install
npm run generate:pet
```

This writes `assets/pixel-cat.gif`. The cat walks across the strip, settles into a lying pose, idles with subtle breathing and blinks, then loops.

## External Dynamic Services

The main `README.md` also uses a small number of common README services:

- Shields.io badges: <https://shields.io>
- Readme Typing SVG by DenverCoder1: <https://github.com/DenverCoder1/readme-typing-svg>
- GitHub Readme Stats by anuraghazra: <https://github.com/anuraghazra/github-readme-stats>

Dynamic services are used for badges and typing widgets. The banner GIF is self-hosted in this repository.
