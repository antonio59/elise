---
version: alpha
name: Elise Reads
description: A warm editorial design system for a personal book tracking, art gallery, and writing site. Built around a dusty-rose-and-cream palette with anime/kawaii accents, multiple themeable personalities, and tactile 3D book interactions.
colors:
  primary: "{colors.primary-500}"
  primary-50: "#fdf8f6"
  primary-100: "#f5ebe6"
  primary-200: "#edd5cd"
  primary-300: "#e0b8a8"
  primary-400: "#c4856c"
  primary-500: "#b06b50"
  primary-600: "#9a5640"
  primary-700: "#7d4232"
  primary-800: "#633427"
  primary-900: "#4a271d"
  accent-50: "#f0f4f8"
  accent-100: "#d9e2ec"
  accent-200: "#bcccdc"
  accent-300: "#9fb3c8"
  accent-400: "#22d3ee"
  accent-500: "#06b6d4"
  accent-600: "#0891b2"
  accent-700: "#334e68"
  accent-800: "#243b53"
  accent-900: "#102a43"
  violet-50: "#f7f5f9"
  violet-100: "#ebe5f0"
  violet-200: "#d5c7e0"
  violet-300: "#b9a0cc"
  violet-400: "#4361ee"
  violet-500: "#3a56d4"
  violet-600: "#2f46b8"
  violet-700: "#523469"
  star: "#d4a853"
  star-light: "#f5e6c8"
  slate-50: "#faf8f5"
  slate-100: "#f0ece5"
  slate-200: "#e0d9cf"
  slate-300: "#c7bfb2"
  slate-400: "#a89f90"
  slate-500: "#8a7f6f"
  slate-600: "#6b6254"
  slate-700: "#504838"
  slate-800: "#3a342a"
  slate-900: "#252119"
  success-50: "#f0fdf4"
  success-100: "#dcfce7"
  success-500: "#22c55e"
  success-600: "#16a34a"
  error-50: "#fef2f2"
  error-100: "#fee2e2"
  error-500: "#ef4444"
  error-600: "#dc2626"
  bg-page: "{colors.slate-50}"
  bg-surface: "#ffffff"
  bg-elevated: "#ffffff"
  bg-muted: "#f5f3ff"
typography:
  display:
    fontFamily: "Fredoka, Nunito, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.25
  h1:
    fontFamily: "Fredoka, Nunito, system-ui, sans-serif"
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.25
  h2:
    fontFamily: "Fredoka, Nunito, system-ui, sans-serif"
    fontSize: 1.875rem
    fontWeight: 700
    lineHeight: 1.25
  h3:
    fontFamily: "Fredoka, Nunito, system-ui, sans-serif"
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: 0.75rem
    fontWeight: 500
    letterSpacing: 0.05em
    textTransform: uppercase
rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  2xl: 1.5rem
  full: 9999px
spacing:
  1: 0.25rem
  2: 0.5rem
  3: 0.75rem
  4: 1rem
  6: 1.5rem
  8: 2rem
  12: 3rem
  16: 4rem
components:
  button-primary:
    backgroundColor: "{colors.primary-500}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-600}"
  button-secondary:
    backgroundColor: "#ffffff"
    textColor: "{colors.slate-700}"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "10px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary-600}"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "10px 20px"
  button-accent:
    backgroundColor: "{colors.accent-600}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    typography: "{typography.label}"
    padding: "10px 20px"
  card-default:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.xl}"
    padding: "24px"
  card-elevated:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.xl}"
    padding: "24px"
  card-interactive:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.xl}"
    padding: "24px"
  card-gradient:
    backgroundColor: "linear-gradient(135deg, {colors.primary-50}, {colors.accent-50})"
    rounded: "{rounded.xl}"
    padding: "24px"
  badge-primary:
    backgroundColor: "{colors.primary-100}"
    textColor: "{colors.primary-700}"
    rounded: "{rounded.full}"
    typography: "{typography.caption}"
    padding: "2px 10px"
  badge-accent:
    backgroundColor: "{colors.accent-100}"
    textColor: "{colors.accent-700}"
    rounded: "{rounded.full}"
    typography: "{typography.caption}"
    padding: "2px 10px"
  badge-slate:
    backgroundColor: "{colors.slate-100}"
    textColor: "{colors.slate-700}"
    rounded: "{rounded.full}"
    typography: "{typography.caption}"
    padding: "2px 10px"
  badge-violet:
    backgroundColor: "{colors.violet-100}"
    textColor: "{colors.violet-700}"
    rounded: "{rounded.full}"
    typography: "{typography.caption}"
    padding: "2px 10px"
  input:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.slate-800}"
    rounded: "{rounded.xl}"
    typography: "{typography.body-sm}"
    padding: "10px 16px"
---

## Overview

Elise Reads is a personal book tracking, art gallery, and writing site with a warm editorial aesthetic that blends cozy bookstore vibes with anime/kawaii playfulness. The design philosophy centers on **tactile warmth** — everything should feel like flipping through a well-loved journal or browsing a curated indie bookshelf.

The default "Editorial" theme evokes a dusty-rose café at golden hour: warm creams, terracotta accents, and soft navy ink. Six additional theme personalities let the owner re-skin the entire experience — from Sakura pink kawaii mode to Midnight dark academia.

## Colors

The palette is organized around four semantic color roles that remain consistent across all 7 themes, even as their exact hues shift:

- **Primary (#c4856c):** Dusty rose / terracotta. The emotional heart of the design. Used for primary actions, active states, ratings emphasis, and warm highlights. In Editorial it's a muted clay; in Sakura it becomes hot pink; in Botanical it shifts to sage green.
- **Accent (#22d3ee):** Electric teal. Used sparingly for badges, secondary highlights, and energetic moments. Provides playful contrast against the warm primary.
- **Violet (#4361ee):** Ink blue / anime purple. Used for decorative flourishes, nav active indicators, star-burst accents, and gradient pairing. The "special" color.
- **Slate (#3a342a):** Warm neutral scale. Backgrounds, text, borders, and structural elements. Notably warmer than a standard gray — it carries a brown undertone in Editorial to match the paper-like aesthetic.
- **Star (#d4a853):** Warm gold reserved exclusively for ratings, achievements, and celebratory moments.

### Theme System

The entire palette swaps via a `data-theme` attribute on `<html>`. The seven available personalities are:

1. **Editorial** (default) — warm beige, dusty rose, navy ink
2. **Sakura** — kawaii pink, electric teal, soft neutrals
3. **Lavender** — soft purple, mint green, dreamy neutrals
4. **Midnight** — dark navy, gold accents, inverted slate scale for true dark mode
5. **Sunset** — warm coral, cream, golden tones
6. **Botanical** — sage green, earth tones, amber accents
7. **Berry** — raspberry, plum, rich pink-purple

All components reference CSS custom properties that re-map under each theme, ensuring complete palette coherence without per-theme component overrides.

## Typography

Three font families create a friendly, approachable hierarchy:

- **Fredoka** (display): Rounded, playful, and highly legible. Used for all headings, stat values, and anywhere personality matters. Falls back to Nunito then system sans.
- **Nunito** (display fallback): Slightly more structured rounded sans. Loaded as a fallback and used in contexts where Fredoka might feel too informal.
- **Inter** (body): Neutral, highly readable. Used for body text, labels, inputs, and all functional UI. Keeps the interface grounded.

Headings are always bold (700), tight-leading (1.25), and colored in the deepest slate (`slate-900`). Body text uses a warmer dark tone (`slate-800`) to reduce harsh contrast against cream backgrounds.

## Layout

The layout follows a cozy, content-dense approach:

- **Page background:** Soft cream (`slate-50`) with a subtle geometric SVG pattern at 6% opacity — barely visible but adds paper-like texture.
- **Surface cards:** White with soft shadows (`shadow-soft`) and 1px warm borders (`slate-200`). Cards lift on hover with increased shadow and a 2px translateY.
- **Spacing scale:** Compact but breathable. Cards use `24px` padding internally. Grid gaps are typically `16px`. The shelf-scroll pattern (horizontal book carousels) uses `16px` gaps with snap scrolling.
- **Book cards:** A signature 3D perspective tilt on hover (`rotateY(-5deg) rotateX(2deg) translateY(-8px) scale(1.03)`) that makes covers feel physical. A subtle spine gradient runs down the left edge.
- **Responsive behavior:** Mobile flips from card grids to vertical stacks. The book flip-card interaction (tap to reveal review) becomes a simple static stack on small screens.

## Elevation & Depth

Elevation is expressed through shadow warmth rather than darkness:

- **shadow-soft:** The default — barely-there warmth for cards and surfaces.
- **shadow-primary / shadow-accent:** Colored glows (e.g., `0 4px 14px rgba(176, 107, 80, 0.15)`) that emanate from primary/accent buttons, making CTAs feel luminous.
- **Hover elevation:** Cards gain larger shadows and physical lift. Buttons scale slightly and translate up 1px.

No hard drop shadows — everything diffuses softly, matching the paper-and-ink metaphor.

## Shapes

- **Primary radius:** `12px` (`rounded-xl`) for cards, modals, and major containers.
- **Secondary radius:** `8px` (`rounded-lg`) for buttons and smaller controls.
- **Pills:** `9999px` (`rounded-full`) for badges, mood tags, and genre tags.
- **Input radius:** `16px` (`rounded-2xl`) — slightly more rounded than buttons to feel inviting.

Corners are consistently rounded; there are no sharp rectangles except for full-bleed images and the writing editor textarea.

## Components

### Buttons

Five variants with consistent padding and rounded corners:
- **Primary:** Filled dusty rose, white text, colored shadow. The main CTA.
- **Secondary:** White fill, warm gray border, dark text. For secondary actions.
- **Ghost:** Transparent with primary text. For low-emphasis actions.
- **Accent:** Filled teal. For energetic or alternative primary moments.
- **Success / Danger:** Filled green/red. For completion and destructive actions.

All buttons use Framer Motion `whileHover` (scale 1.01, translateY -1) and `whileTap` (scale 0.98).

### Cards

- **Default:** White, soft shadow, `12px` radius.
- **Elevated:** White, medium shadow — for featured content.
- **Interactive:** Adds hover lift and shadow expansion — for clickable grids.
- **Outlined:** White, border only, no shadow — for subtle grouping.
- **Gradient:** Soft primary-to-accent gradient background — for calls-to-attention.

Stat cards feature a decorative corner gradient overlay for subtle visual interest.

### Badges

Pill-shaped with transparent borders. Variants include primary, accent, slate, success, warning (amber), error, outline, and violet. Mood tags use a special `mood-tag` style: extra-small, outlined, with reduced opacity until hovered.

### Inputs

Rounded, inviting, and heavily focused. All inputs have:
- White background
- Warm gray border (`slate-200`)
- Focus ring in primary at 30% opacity
- Optional left/right icons
- Error states swap border and ring to error red

### Book-Specific Patterns

- **Flip card:** Two-sided card with 3D rotation. Front = cover; back = review. Desktop uses hover/click flip; mobile shows both sides stacked.
- **Progress ring:** SVG circular progress indicator for "currently reading" books, with animated stroke-dashoffset.
- **Genre tag:** Small uppercase pill with primary tint background.
- **Rating label:** Textual rating system ("not it" → "all-time fav") rendered as small uppercase primary-colored labels.

## Do's and Don'ts

**Do:**
- Use the theme system — never hardcode colors when a CSS custom property exists.
- Reserve gold (`star`) exclusively for ratings and achievements.
- Use Framer Motion for entrances and micro-interactions; keep durations short (150–300ms).
- Maintain the warm cream page background across all themes (Midnight inverts this intentionally).
- Use the 3D book card tilt for any book cover grid.

**Don't:**
- Use pure black or pure white — the darkest text is `slate-900` (#252119) and surfaces are cream or white.
- Mix sharp corners with the rounded aesthetic; keep radii consistent within a component type.
- Overuse gradients — the gradient card variant is for special emphasis only.
- Ignore `prefers-reduced-motion` — all animations respect this media query.
- Use the accent teal for primary CTAs unless the context specifically calls for energetic contrast.
