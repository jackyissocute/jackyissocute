# Profile Assets

This folder contains the local visual assets used by the GitHub profile README.

## Files

- `banner.gif` - Primary animated cyberpunk pixel banner (1400×428). Generated locally with GSAP + Node canvas. Displays neon skyline, rain, scanlines, and **JACKY LIN // NIGHT CITY // DEV MODE** text with glitch effects.
- `banner-classic.svg` - Original static SVG artwork (soft cinematic research theme). Kept as a fallback reference.
- `neon-divider.gif` - Animated transparent cyberpunk divider (cyan + magenta intersecting lines with crossing flicker).
- `neon-divider.png` - Static poster frame from the divider animation.
- `pets/` - Section pixel cats (128×128 transparent GIFs, one per README section). See below.
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

The profile README embeds animated gray tabby cats per section. About Me and Current Focus use a two-column table (cat left, text right). Research Compass uses a full-width traverse GIF. Toolkit pairs left-aligned badges with the attack cat on the right in one row. Connect footer places the resting cat beside the Feynman quote and sprite credit, aligned right.

| File | Section | Source animation |
| --- | --- | --- |
| `pets/cat-about.gif` | About Me | idle (sit, blink) |
| `pets/cat-compass.gif` | Research Compass | walk (full-width traverse) |
| `pets/cat-toolkit.gif` | Toolkit | attack / paw swipe |
| `pets/cat-focus.gif` | Current Focus | run |
| `pets/cat-snapshot.gif` | Connect footer | idle (slow rest loop) |

### Source art & license

Sprite strips from **[Gray cat asset pack](https://opengameart.org/content/gray-cat-asset-pack)** by Krystsina Staselovich (skristi), CC-BY. Source PNGs live in `pets/source/skristi-gray-cat/64x64/`. See `pets/source/ATTRIBUTION.md`.

### Regenerating

Built from source in `scripts/generate-pet/`:

```bash
npm install
npm run generate:pet
```

This slices the 64×64 source strips, removes black backgrounds, and writes transparent GIFs to `assets/pets/` (128×128 output, 2× scale). Display at ~88px width in the README.

## External Dynamic Services

The main `README.md` also uses a small number of common README services:

- Shields.io badges: <https://shields.io>
- Readme Typing SVG by DenverCoder1: <https://github.com/DenverCoder1/readme-typing-svg>
- GitHub Readme Stats by anuraghazra: <https://github.com/anuraghazra/github-readme-stats>

Dynamic services are used for badges and typing widgets. The banner GIF is self-hosted in this repository.
