---
name: Loft Language Learning
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#51443f'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#84746e'
  outline-variant: '#d6c2bb'
  surface-tint: '#82533e'
  primary: '#623725'
  on-primary: '#ffffff'
  primary-container: '#7d4e3a'
  on-primary-container: '#ffc4ad'
  inverse-primary: '#f7b89f'
  secondary: '#a03f2e'
  on-secondary: '#ffffff'
  secondary-container: '#fe8770'
  on-secondary-container: '#741f11'
  tertiary: '#424242'
  on-tertiary: '#ffffff'
  tertiary-container: '#5a5959'
  on-tertiary-container: '#d2d0d0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcd'
  primary-fixed-dim: '#f7b89f'
  on-primary-fixed: '#331204'
  on-primary-fixed-variant: '#673c29'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a5'
  on-secondary-fixed: '#3f0400'
  on-secondary-fixed-variant: '#802919'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
This design system centers on a "Loft" aesthetic—a blend of organic warmth and modern minimalist structure. The personality is grounded, approachable, and studious without being academic. It aims to evoke the feeling of a quiet afternoon in a sunlit library or a comfortable home office. 

The design style is **Tactile Minimalism**. It utilizes heavy whitespace and a restricted organic palette to maintain clarity, while incorporating subtle "paper" and "canvas" textures to provide a sense of physical permanence. The "Tarvuz" mascot should be rendered with a slight "hand-drawn" imperfection—using variable line weights and a 2D matte finish—to ensure it feels like a friendly companion rather than a rigid corporate asset.

## Colors
The palette is inspired by natural materials. 
- **Primary (Wood):** A warm, deep oak used for navigation headers, primary branding, and structural anchors.
- **Secondary (Terracotta):** An earthy clay red used for interactive elements, progress indicators, and "Tarvuz" accents.
- **Tertiary (Charcoal):** A soft black used exclusively for high-contrast typography and icon outlines.
- **Neutral (Cream/Off-white):** The foundation of the UI. Backgrounds should never be pure white; they use a soft cream to reduce eye strain during long study sessions.

A subtle noise or grain overlay (the "canvas" texture) should be applied to the `background_paper` color to enhance the tactile feel.

## Typography
This design system utilizes **Plus Jakarta Sans** for its exceptional readability and friendly, open counters. 
- **Headlines:** Use Bold or Semi-Bold weights with slightly tighter letter spacing for a modern, "loft" feel.
- **Body Text:** Use Regular weight with generous line height (1.5x minimum) to ensure long-form reading is comfortable.
- **Interactive Labels:** Use all-caps for small labels and buttons to provide a clear distinction from reading content.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop and a **Fluid Margin** model on mobile. 
- **Whitespace:** Elements are given significant breathing room to prevent cognitive overload. 
- **Rhythm:** An 8px linear scale governs all spacing.
- **Margins:** High-level containers should use a minimum of 24px internal padding to maintain the "open loft" atmosphere.
- **Alignment:** Content is centered in the viewport with a max-width of 1200px to ensure the eye doesn't have to travel too far across the screen.

## Elevation & Depth
Depth is created through **Ambient Shadows** and **Tonal Layering** rather than harsh borders.
- **Shadows:** Use large blur radii (16px+) with very low opacity (5-8%). Shadows should be tinted with the Primary Wood color (`#7D4E3A`) instead of pure black to maintain the warm aesthetic.
- **Layers:** "Cards" or interactive modules should sit on a slightly elevated plane.
- **Active State:** When a user interacts with a card, it should "depress" (reduce shadow) to mimic a physical button being pressed into a soft surface.

## Shapes
The shape language is consistently **Rounded**. 
- **Standard Radius:** 0.5rem (8px) for small components like inputs and buttons.
- **Large Radius:** 1rem (16px) for cards and main containers.
- **Extra Large:** 1.5rem (24px) for decorative elements or call-out sections.
Avoid sharp 0px corners entirely to maintain the welcoming, organic atmosphere of the brand.

## Components
- **Buttons:** Primary buttons use the Terracotta fill with white text. Secondary buttons use a Wood-toned outline with a cream background. All buttons have a 2px offset shadow to give them a "lifted" paper look.
- **Cards:** White or very light cream backgrounds with a 1px border in a slightly darker cream hue (`#E8E3D5`). Use the ambient wood-tinted shadow for elevation.
- **Input Fields:** Soft cream backgrounds with Wood-toned labels. On focus, the border transitions to Terracotta.
- **Progress Bars:** Use a thick, rounded track in light cream and a fill in Terracotta. 
- **Mascot (Tarvuz):** Position the mascot in the margins or at the end of lessons. The mascot should never overlap text; it acts as a silent observer and guide.
- **Learning Chips:** Small, rounded tags used for categories or word types. These should use the Tertiary Charcoal for text and a very light Wood-tone for the background.