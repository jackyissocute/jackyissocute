# Profile Assets

This folder contains the local visual assets used by the GitHub profile README.

## Files

- `banner.gif` - Primary animated cyberpunk pixel banner (1400×428). Generated locally with GSAP + Node canvas. Displays neon skyline, rain, scanlines, and **JACKY LIN // NIGHT CITY // DEV MODE** text with glitch effects.
- `banner-classic.svg` - Original static SVG artwork (soft cinematic research theme). Kept as a fallback reference.
- `neon-divider.gif` - Animated transparent cyberpunk divider (cyan + magenta intersecting lines with crossing flicker).
- `neon-divider.png` - Static poster frame from the divider animation.
- `pets/` - Section pixel cats (448×448 transparent GIFs, one per README heading). See below.
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

## Section Pixel Cats

The profile README embeds one animated cat beside each major section heading. All cats share the same orange tabby design but use different loops:

| File | Section | Animation |
| --- | --- | --- |
| `pets/cat-about.gif` | About Me | Sitting idle with breathing and blink |
| `pets/cat-compass.gif` | Research Compass | Curious head turn left/right |
| `pets/cat-toolkit.gif` | Toolkit | Playful paw bat |
| `pets/cat-featured.gif` | Featured Work | Walk-in-place gait |
| `pets/cat-focus.gif` | Current Focus | Tail chase |
| `pets/cat-snapshot.gif` | GitHub Snapshot | Lazy lie-down with ear flick |

Built from source in `scripts/generate-pet/`:

```bash
npm install
npm run generate:pet
```

This writes all six GIFs to `assets/pets/`. Each cat is rendered on a 112×112 logical canvas (448×448 output) with 3× pixel scaling for a detailed face, body, and tail beside section titles. Display at ~96px width in the README.

## External Dynamic Services

The main `README.md` also uses a small number of common README services:

- Shields.io badges: <https://shields.io>
- Readme Typing SVG by DenverCoder1: <https://github.com/DenverCoder1/readme-typing-svg>
- GitHub Readme Stats by anuraghazra: <https://github.com/anuraghazra/github-readme-stats>

Dynamic services are used for badges and typing widgets. The banner GIF is self-hosted in this repository.
