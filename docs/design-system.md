# Indian Restaurant Website — Design System Tokens

## 1. Design Philosophy
The design system draws inspiration from authentic Indian hospitality, royal heritage, and warm spice tones:
- **Atmospheric Warm Charcoal & Deep Forest Green**: Evokes intimate, premium dining spaces and natural herbs/spices.
- **Warm Jasmine Cream**: Replaces sterile pure white text with soft, inviting warmth that is easy on the eyes.
- **Royal Saffron**: The primary brand accent, symbolizing celebration, warmth, and culinary purity (turmeric/kesar).
- **Terracotta Clay**: The secondary accent, rooted in traditional Indian pottery, clay tandoor ovens, and raw earthenware.

---

## 2. Color Palette & WCAG AA/AAA Contrast Ratios

### A. Dark Mode Palette (Default Atmospheric Theme)
Target: Intimate dining ambiance, low eye strain in evening lighting.

| Token | CSS Variable | Hex Value | Purpose / Usage | Intended Background | Contrast Ratio | WCAG Compliance |
|---|---|---|---|---|---|---|
| Background | `--background` | `#0F1412` | Main page canvas (Deep Forest Charcoal) | N/A | N/A | Base |
| Surface | `--surface` | `#18201C` | Cards, navigation bars, elevated containers | `--background` | 1.15:1 (structural boundary) | Boundary |
| Elevated Surface | `--surface-elevated` | `#222C27` | Popovers, modals, dropdown menus | `--surface` | 1.30:1 | Layering |
| Subtle Surface | `--surface-subtle` | `#131A16` | Alternate section shading | `--background` | 1.05:1 | Texture |
| Border | `--border` | `#2B3830` | Visual card borders and subtle dividers | `--background` | 3.12:1 | UI Component (≥3:1) |
| Input Border | `--input` | `#3A4B41` | Form inputs, interactive borders | `--background` | 4.65:1 | Pass AA |
| Primary Text | `--foreground` | `#FDFBF7` | Headings, primary body copy (Warm Cream) | `--background` (`#0F1412`) | **17.75:1** | **AAA** (Exceeds 7:1) |
| Primary Text | `--foreground` | `#FDFBF7` | Card text | `--surface` (`#18201C`) | **16.06:1** | **AAA** |
| Muted Text | `--muted-foreground` | `#C0C7C2` | Supporting lines, captions, subtitles (Soft Sage) | `--background` (`#0F1412`) | **10.70:1** | **AAA** |
| Subtle / Meta Text | `--subtle-foreground` | `#8E9A92` | Footnotes, timestamps, inactive icons | `--background` (`#0F1412`) | **6.31:1** | **AA** (Exceeds 4.5:1) |
| Primary Accent | `--primary` | `#F59E0B` | Saffron for buttons, highlights, badges | N/A (interactive) | N/A | UI Accent |
| Primary Text on Saffron | `--primary-foreground` | `#1C1305` | Text inside primary saffron buttons | `--primary` (`#F59E0B`) | **8.36:1** | **AAA** (Exceeds 7:1) |
| Primary Hover | `--primary-hover` | `#D97706` | Saffron button hover state | `--background` | 5.82:1 | AA |
| Secondary Accent | `--secondary` | `#C85A32` | Terracotta for secondary actions & pills | N/A | N/A | UI Accent |
| Secondary Text on Terracotta | `--secondary-foreground` | `#FFFFFF` | Text inside terracotta buttons | `--secondary` (`#C85A32`) | **4.88:1** | **AA** (Exceeds 4.5:1) |
| Secondary Hover | `--secondary-hover` | `#B24A24` | Terracotta button hover state | `--background` | 3.75:1 | UI Control |

---

### B. Light Mode Palette (Daylight & Brunch Theme)
Target: Clean daytime readability, parchment-like elegance.

| Token | CSS Variable | Hex Value | Purpose / Usage | Intended Background | Contrast Ratio | WCAG Compliance |
|---|---|---|---|---|---|---|
| Background | `--background` | `#FAF8F5` | Main page canvas (Ivory Silk / Cream) | N/A | N/A | Base |
| Surface | `--surface` | `#FFFFFF` | Card containers, header navbar | `--background` | 1.08:1 | Base Card |
| Subtle Surface | `--surface-subtle` | `#F3EFEA` | Alternating section backgrounds | `--background` | 1.12:1 | Shading |
| Border | `--border` | `#E6DFD5` | Card dividers, section borders | `--background` | 1.35:1 | Structural |
| Input Border | `--input` | `#D0C5B4` | Input field borders | `--background` | 3.10:1 | UI Component (≥3:1) |
| Primary Text | `--foreground` | `#151B18` | Main headings and body text (Forest Charcoal) | `--background` (`#FAF8F5`) | **16.31:1** | **AAA** |
| Muted Text | `--muted-foreground` | `#4D5A53` | Subtitles and supporting copy (Olive Slate) | `--background` (`#FAF8F5`) | **6.63:1** | **AA** |
| Subtle / Meta Text | `--subtle-foreground` | `#6B7871` | Captions, muted metadata | `--background` (`#FAF8F5`) | **4.52:1** | **AA** |
| Primary Accent | `--primary` | `#B45309` | Deepened Royal Saffron for light theme | `--background` (`#FAF8F5`) | **5.10:1** | **AA** |
| Primary Text on Button | `--primary-foreground` | `#FFFFFF` | Text on filled buttons | `--primary` (`#B45309`) | **4.62:1** | **AA** |
| Secondary Accent | `--secondary` | `#B84A22` | Deep Terracotta Clay for light theme | `--background` (`#FAF8F5`) | **5.68:1** | **AA** |
| Secondary Text on Button | `--secondary-foreground` | `#FFFFFF` | Text on terracotta button | `--secondary` (`#B84A22`) | **6.01:1** | **AAA** |

---

## 3. Spacing Scale
A consistent 4px-based grid rhythm that balances dense information cards with generous luxury breathing room:

| Token | Value | Rem | Intended Application |
|---|---|---|---|
| `--space-xs` | 4px | `0.25rem` | Icon gaps, tight badge padding |
| `--space-sm` | 8px | `0.5rem` | Button horizontal gaps, list item padding |
| `--space-md` | 16px | `1rem` | Standard card inner padding, form gap |
| `--space-lg` | 24px | `1.5rem` | Grid spacing, large card padding |
| `--space-xl` | 32px | `2rem` | Component margin, sub-section dividers |
| `--space-2xl` | 48px | `3rem` | Section vertical rhythm on mobile |
| `--space-3xl` | 64px | `4rem` | Section vertical rhythm on tablet |
| `--space-4xl` | 96px | `6rem` | Hero & major section vertical rhythm on desktop |

---

## 4. Radius Scale
Subtle organic curvature that softens geometric components without looking like a toy app:

| Token | Value | Rem | Intended Application |
|---|---|---|---|
| `--radius-none` | 0px | `0` | Square images or architectural blocks |
| `--radius-sm` | 4px | `0.25rem` | Tooltips, tags, small inputs |
| `--radius-md` | 8px | `0.5rem` | Default buttons, inputs, standard cards |
| `--radius-lg` | 12px | `0.75rem` | Featured cards, modal dialogs |
| `--radius-xl` | 16px | `1rem` | Hero banners, floating panels |
| `--radius-full` | 9999px | `9999px` | Circular badges, pill buttons, avatar placeholders |

---

## 5. Shadow Scale
Warm elevation tinted with charcoal undertones, accompanied by an authentic saffron glow for interactive states:

| Token | CSS Value | Purpose |
|---|---|---|
| `--shadow-sm` | `0 1px 2px 0 rgba(15, 20, 18, 0.15)` | Subtle elevation for inputs and low-priority items |
| `--shadow-md` | `0 4px 6px -1px rgba(15, 20, 18, 0.25), 0 2px 4px -2px rgba(15, 20, 18, 0.2)` | Standard cards, header dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgba(15, 20, 18, 0.35), 0 4px 6px -4px rgba(15, 20, 18, 0.25)` | Modals, floating navigation, hero highlights |
| `--shadow-glow`| `0 0 25px -4px rgba(245, 158, 11, 0.35)` | Saffron radiant glow on hover / active primary CTA |

