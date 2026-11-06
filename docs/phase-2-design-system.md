# Phase 2: Design System & Home Page Prototype

## Overview
Phase 2 establishes the visual language, typography, design tokens, core component library, and the responsive homepage prototype for the Indian restaurant website.

---

## 1. Design Tokens & Visual Hierarchy

### Palette
- **Canvas / Background**: Deep Forest Charcoal (`#0F1412` dark default / `#FAF8F5` light) providing an intimate, candlelit dining ambiance.
- **Surface**: Warm Green-Charcoal (`#18201C`) and Elevated Surface (`#222C27`) for card boundaries and layered elevation.
- **Foreground / Text**: Warm Jasmine Cream (`#FDFBF7` on dark / `#151B18` on light), avoiding the glare of pure white while achieving **17.75:1 contrast (WCAG AAA)**.
- **Primary Accent**: Royal Saffron (`#F59E0B` dark / `#B45309` light) paired with deep spiced charcoal text (`#1C1305`) on buttons for **8.36:1 contrast (WCAG AAA)**.
- **Secondary Accent**: Warm Terracotta (`#C85A32` dark / `#B84A22` light) honoring traditional clay tandoors and earthenware (**4.88:1 contrast, WCAG AA**).

### Scales
- **Spacing Scale**: 4px base rhythm (`0.25rem` to `6rem`).
- **Radius Scale**: `sm` (4px), `md` (8px), `lg` (12px), `xl` (16px), and `full` (9999px).
- **Shadow Scale**: Charcoal-tinted elevations (`shadow-sm`, `shadow-md`, `shadow-lg`) and interactive `--shadow-glow` for saffron focus states.

---

## 2. Typography
- **Headings (Cormorant Garamond)**: High-contrast, elegant serif loaded via `next/font/google` (`display: swap`), conveying the regal heritage of Awadhi dining without layout shift.
- **Body & Controls (Inter)**: Highly readable, neutral grotesque sans-serif ensuring crisp legibility on high-DPI screens and mobile devices.
- **Fluid Type Scale using `clamp()`**:
  - `display`: `clamp(2.5rem, 6vw, 4.25rem)` — Hero headline
  - `h1`: `clamp(2rem, 4.5vw, 3.25rem)` — Section titles
  - `h2`: `clamp(1.6rem, 3.2vw, 2.35rem)` — Card and block titles
  - `h3`: `clamp(1.25rem, 2.2vw, 1.75rem)` — Subsections and card headings
  - `body-lead`: `clamp(1.05rem, 1.4vw, 1.25rem)` — Hero subtitles
  - `body`: `clamp(0.95rem, 1vw, 1.05rem)` — Standard copy
  - `caption`: `clamp(0.8rem, 0.85vw, 0.875rem)` — Metadata and tags

---

## 3. Core Component Library (`components/ui/`)
- **`Button`**: Supports `primary`, `secondary`, and `ghost` variants across `sm`, `md`, `lg` sizes. Fully typed, supports `href` as Next.js link, with explicit `focus-visible:ring-2` and `disabled` states.
- **`Container`**: Restricts content width (`max-w-4xl`, `max-w-6xl`, `max-w-7xl`) with horizontal responsive gutters (`px-4 sm:px-6 lg:px-8`).
- **`Section`**: Controls section vertical rhythm (`py-12` to `py-32`) and surface shading (`default`, `subtle`, `surface`).
- **`SiteHeader`**: Sticky header with brand placeholder, desktop navigation, and a mobile drawer menu that:
  - Traps scroll when open
  - Listens to the `Escape` key to close and returns focus to the trigger
  - Exposes proper `aria-expanded`, `aria-controls`, and `aria-label` attributes
- **`SiteFooter`**: Semantic footer organizing hours, address, phone, email, and social link placeholders.

---

## 4. Homepage Prototype (`app/page.tsx`)
1. **Hero Section**: Large Cormorant Garamond headline, supporting heritage narrative, and two prominent CTAs ("View Menu" and "Reserve a Table") with ambient radial glow.
2. **Brand Story Section**: Two-column desktop grid (copy left, atmosphere visual placeholder right) transitioning to a single stacked column on mobile.
3. **Signature Dishes Section**: Three cards showcasing Awadhi Dum Biryani, Tandoori Chaap, and Dal Velvet, driven by typed data in `data/dishes.ts` ready for API replacement in Phase 3.
4. **Visit & Hours Section**: Grid layout displaying dining hours and address details alongside a reservation booking trigger.
5. **Accessibility & Animations**: Subtle scroll animations configured with full `@media (prefers-reduced-motion: reduce)` overrides to prevent vestibular discomfort.

---

## 5. Verification Checklist
- [x] TypeScript compilation (`tsc --noEmit`): 0 errors
- [x] ESLint analysis (`npm run lint`): 0 warnings / errors
- [x] Production build (`next build`): Validated
- [x] WCAG AA body contrast ratio verified (17.75:1 for body text, 8.36:1 for primary button)
- [x] Keyboard navigation verified through headers, mobile menu, and action buttons
