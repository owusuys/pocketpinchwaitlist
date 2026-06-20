# /public — static assets

Drop real brand assets here as they become available. Until then the site renders
fine with the CSS/SVG dial and the generated Open Graph image.

## What to add later

| File | Purpose | Notes |
|---|---|---|
| `app-store-1.png` … | App Store screenshots | Real score-screen captures. Reference them with `next/image` in a future "screenshots" section. |
| `logo.svg` / wordmark | Brand logo | Replace the text wordmark in `components/Hero.tsx` / `components/Footer.tsx`. |
| `favicon.ico` | Classic favicon | Optional — `app/icon.svg` already provides a modern SVG favicon. |

## Already generated (no action needed)
- **Favicon** → `app/icon.svg` (dark tile + green dial mark).
- **Open Graph / Twitter image** → generated on the fly by `app/opengraph-image.tsx` (1200×630).
  To use a hand-designed image instead, drop `opengraph-image.png` in `app/` and delete the `.tsx`.
