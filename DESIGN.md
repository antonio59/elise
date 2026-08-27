---
version: alpha
name: Elise Reads
description: A teen Studio / fashion-Pinterest editorial design system for a personal book tracking, art gallery, and writing site. Cool berry rose, ink slate, and soft charcoal-rose neutrals with Outfit display and Figtree body typography.
colors:
  primary: "{colors.primary-500}"
  primary-50: "#faf5f6"
  primary-100: "#f3e8eb"
  primary-200: "#e6cfd5"
  primary-300: "#d4a8b3"
  primary-400: "#b87384"
  primary-500: "#9a4d5c"
  primary-600: "#823f4d"
  primary-700: "#6a3340"
  primary-800: "#552a34"
  primary-900: "#3f1f27"
  accent-50: "#f4f6f8"
  accent-100: "#e4e9ee"
  accent-200: "#c8d2dc"
  accent-300: "#a3b3c2"
  accent-400: "#7a90a4"
  accent-500: "#5c758c"
  accent-600: "#4a5f73"
  accent-700: "#3d4e5f"
  accent-800: "#344250"
  accent-900: "#2d3843"
  violet-50: "#f7f4f5"
  violet-100: "#ebe4e7"
  violet-200: "#d6c8ce"
  violet-300: "#b89aa5"
  violet-400: "#8f6876"
  violet-500: "#73505d"
  violet-600: "#5f4250"
  violet-700: "#4e3742"
  star: "#c4a35a"
  star-light: "#f3ebda"
  slate-50: "#f7f7f6"
  slate-100: "#efefed"
  slate-200: "#e0e0dc"
  slate-300: "#c8c8c2"
  slate-400: "#9a9a93"
  slate-500: "#6f6f69"
  slate-600: "#52524d"
  slate-700: "#3d3d39"
  slate-800: "#2a2a27"
  slate-900: "#171715"
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
  bg-muted: "#f7f4f5"
typography:
  display:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.25
  h1:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.25
  h2:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: 1.875rem
    fontWeight: 700
    lineHeight: 1.25
  h3:
    fontFamily: "Outfit, system-ui, sans-serif"
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "Figtree, system-ui, sans-serif"
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

Elise Reads is a personal book tracking, art gallery, and writing site with a teen Studio / fashion-Pinterest editorial aesthetic. The design philosophy centers on **calm curation** - everything should feel like browsing a carefully edited mood board or a personal library shelf, not a kids app or anime sticker pack.

The default "Studio" theme (token key `editorial`) uses cool berry rose, ink slate, and soft charcoal-rose neutrals on cool paper backgrounds. Six additional theme personalities let the owner re-skin the experience - from Sakura pink to Midnight dark academia - without changing component structure.

## Colors

The palette is organized around four semantic color roles that remain consistent across all 7 themes, even as their exact hues shift:

- **Primary (#9a4d5c):** Berry rose. The emotional heart of the design. Used for primary actions, active states, ratings emphasis, and warm highlights. In Studio it's a cool berry; in Sakura it becomes hot pink; in Botanical it shifts to sage green.
- **Accent (#5c758c):** Cool ink slate. Used sparingly for badges, secondary highlights, and structural contrast. Quiet against the berry primary.
- **Violet (#73505d):** Soft charcoal-rose (token remapped from legacy "violet"). Used for decorative flourishes, secondary nav active indicators, and soft gradient pairing. Not pastel purple.
- **Slate (#2a2a27):** Cool neutral scale. Backgrounds, text, borders, and structural elements. Cooler and greyer than warm cream paper systems.
- **Star (#c4a35a):** Soft champagne gold reserved exclusively for ratings, achievements, and celebratory moments.

### Theme System

The entire palette swaps via a `data-theme` attribute on `<html>`. The seven available personalities are:

1. **Studio** (default, token `editorial`) - berry rose, cool ink slate, cool neutrals
2. **Sakura** - soft pink, teal, light neutrals
3. **Lavender** - soft purple, mint green, dreamy neutrals
4. **Midnight** - dark navy, gold accents, inverted slate scale for true dark mode
5. **Sunset** - warm coral, cream, golden tones
6. **Botanical** - sage green, earth tones, amber accents
7. **Berry** - raspberry, plum, rich pink-purple

All components reference CSS custom properties that re-map under each theme, ensuring complete palette coherence without per-theme component overrides.

## Typography

Two font families create a fashion-editorial hierarchy:

- **Outfit** (display): Geometric, confident, Pinterest-adjacent. Used for all headings, brand wordmarks, and anywhere personality matters.
- **Figtree** (body): Clean and highly readable. Used for body text, labels, inputs, and all functional UI.

Headings are always bold (700), tight-leading (1.25), and colored in the deepest slate (`slate-900`). Body text uses `slate-800` for comfortable contrast on cool paper backgrounds.

## Layout

The layout follows a calm, content-forward approach:

- **Page background:** Cool paper (`slate-50`) with a subtle geometric SVG pattern at low opacity.
- **Surface cards:** Soft surfaces with soft shadows (`shadow-soft`) and 1px borders (`slate-200`). Cards lift on hover with increased shadow and a 2px translateY.
- **Spacing scale:** Compact but breathable. Cards use `24px` padding internally. Grid gaps are typically `16px`. The shelf-scroll pattern (horizontal book carousels) uses `16px` gaps with snap scrolling.
- **Book cards:** A signature 3D perspective tilt on hover (`rotateY(-5deg) rotateX(2deg) translateY(-8px) scale(1.03)`) that makes covers feel physical. A subtle spine gradient runs down the left edge.
- **Responsive behavior:** Mobile flips from card grids to vertical stacks. The book flip-card interaction (tap to reveal review) becomes a simple static stack on small screens.

## Elevation & Depth

Elevation is expressed through soft diffusion rather than harsh darkness:

- **shadow-soft:** The default - barely-there depth for cards and surfaces.
- **shadow-primary / shadow-accent:** Colored glows (e.g., `0 4px 14px rgba(154, 77, 92, 0.18)`) that emanate from primary buttons.
- **Hover elevation:** Cards gain larger shadows and physical lift. Buttons translate up 1px.

No hard drop shadows - everything diffuses softly.

## Shapes

- **Primary radius:** `12px` (`rounded-xl`) for cards, modals, major containers, and active nav pills.
- **Secondary radius:** `8px` (`rounded-lg`) for buttons and smaller controls.
- **Pills:** `9999px` (`rounded-full`) for badges, mood tags, and genre tags.
- **Input radius:** `16px` (`rounded-2xl`) - slightly more rounded than buttons to feel inviting.

Corners are consistently rounded; there are no sharp rectangles except for full-bleed images and the writing editor textarea. Prefer solid `rounded-xl` active states over candy gradients for navigation chrome.

## Components

### Buttons

Five variants with consistent padding and rounded corners:
- **Primary:** Filled berry rose, white text, colored shadow. The main CTA.
- **Secondary:** Surface fill, slate border, dark text. For secondary actions.
- **Ghost:** Transparent with primary text. For low-emphasis actions.
- **Accent:** Filled ink slate. For alternative primary moments.
- **Success / Danger:** Filled green/red. For completion and destructive actions.

All buttons use Framer Motion `whileHover` (scale 1.01, translateY -1) and `whileTap` (scale 0.98).

### Cards

- **Default:** Soft surface, soft shadow, `12px` radius.
- **Elevated:** Medium shadow - for featured content.
- **Interactive:** Adds hover lift and shadow expansion - for clickable grids.
- **Outlined:** Border only, no shadow - for subtle grouping.
- **Gradient:** Soft primary-to-accent tint - for calls-to-attention, used sparingly.

### Badges

Pill-shaped with transparent borders. Variants include primary, accent, slate, success, warning (amber), error, outline, and violet (charcoal-rose). Mood tags use a special `mood-tag` style: extra-small, outlined, with reduced opacity until hovered.

### Inputs

Rounded, inviting, and heavily focused. All inputs have:
- Surface background
- Slate border (`slate-200`)
- Focus ring in primary at low opacity
- Optional left/right icons
- Error states swap border and ring to error red

### Book-Specific Patterns

- **Flip card:** Two-sided card with 3D rotation. Front = cover; back = review. Desktop uses hover/click flip; mobile shows both sides stacked.
- **Progress ring:** SVG circular progress indicator for "currently reading" books, with animated stroke-dashoffset.
- **Genre tag:** Small uppercase pill with muted slate or primary tint background (no rainbow chip rainbows).
- **Rating label:** Textual rating system ("not it" → "all-time fav") rendered as small uppercase primary-colored labels.

## Do's and Don'ts

**Do:**
- Use the theme system - never hardcode colors when a CSS custom property exists.
- Reserve gold (`star`) exclusively for ratings and achievements.
- Use Framer Motion for entrances and micro-interactions; keep durations short (150–300ms).
- Keep Studio default calm: berry/slate, Outfit/Figtree, editorial not kawaii.
- Use the 3D book card tilt for any book cover grid.
- Prefer BookOpen, Image, and Compass icons over Sparkles for chrome.

**Don't:**
- Treat Fredoka, Inter, dusty rose terracotta, or anime/kawaii as the default system.
- Use pure black or pure white - the darkest text is `slate-900` (#171715).
- Mix sharp corners with the rounded aesthetic; keep radii consistent within a component type.
- Overuse candy gradients for active nav - prefer `bg-primary-100 text-primary-800` with `rounded-xl`.
- Ignore `prefers-reduced-motion` - all animations respect this media query.
- Use em dashes in product UI copy.
