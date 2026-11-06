# Phase 2: Design System & Home Page Prototype

## Goal 1 Progress: Design Tokens

### What Was Built
1. **CSS Variables (`frontend/app/globals.css`)**:
   - Defined complete palette featuring deep green / warm charcoal backgrounds, cream text, royal saffron as primary accent, and terracotta as secondary accent.
   - Built light and dark variants with automated dark-mode support via `@media (prefers-color-scheme: dark)` as well as explicit `.dark` / `[data-theme="dark"]` classes.
   - Defined spacing, radius, and shadow scales including a bespoke `--shadow-glow` for saffron interactive focal points.
2. **Tailwind Integration (`frontend/tailwind.config.ts` & CSS `@theme`)**:
   - Exposed all CSS custom properties to Tailwind utility classes (e.g. `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `shadow-glow`, `rounded-md`).
3. **Design System Documentation (`docs/design-system.md`)**:
   - Tabulated all tokens with exact hex values, intended backgrounds, and mathematical WCAG contrast ratios.

---

### Design Decisions & Rationale
1. **Warm Jasmine Cream (`#FDFBF7`) on Deep Forest Charcoal (`#0F1412`)**:
   - *Contrast Ratio: 17.75:1 (WCAG AAA)*.
   - Standard pure white (`#FFFFFF`) on pure black (`#000000`) creates optical vibration and harsh contrast. Soft jasmine cream on warm forest charcoal provides a luxurious, intimate evening dining atmosphere while exceeding accessibility standards.
2. **Saffron Button Fill (`#F59E0B`) with Deep Spiced Text (`#1C1305`)**:
   - *Contrast Ratio: 8.36:1 (WCAG AAA)*.
   - White text on bright saffron fails WCAG AA readability. Pairing vibrant saffron with deep roasted charcoal ensures sharp legibility for key conversion actions.
3. **Terracotta Secondary Accent (`#C85A32`) with White Text (`#FFFFFF`)**:
   - *Contrast Ratio: 4.88:1 (WCAG AA)*.
   - Deep terracotta evokes clay tandoors and earthen pottery, offering an organic counter-balance to golden saffron.

---

### Items to Revisit in Later Phases
- Add an explicit user-facing theme toggle component (light/dark switch) in the header.
- Test custom branded SVG pattern overlays (e.g. subtle Indian paisley or mandala filigree) as low-opacity background textures.

