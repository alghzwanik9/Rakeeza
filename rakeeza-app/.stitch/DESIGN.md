---
name: "Rakeeza Premium Dashboard"
colors:
  canvas: "#09090B"
  surface: "#18181B"
  text_primary: "#FFFFFF"
  text_secondary: "#A1A1AA"
  accent: "#8B5CF6"
---

# Design System: Rakeeza Premium Dashboard

## 1. Visual Theme & Atmosphere

A restrained, "Cockpit Dense" dashboard interface with confident, structured asymmetric layouts and fluid spring-physics motion. The atmosphere is clinical yet warm—evoking a high-end command center. Deep charcoal surfaces create depth without relying on pure black or heavy shadows, giving the application a tactile, premium feel.

## 2. Color Palette & Roles

- **Canvas Charcoal** (#09090B) — Primary background surface (Zinc-950).
- **Pure Surface** (#18181B) — Card and container fill.
- **Titanium White** (#FFFFFF) — Primary text and active icons.
- **Muted Steel** (#A1A1AA) — Secondary text, descriptions, and metadata.
- **Whisper Border** (rgba(255,255,255,0.08)) — Card borders, 1px structural lines.
- **Violet Energy** (#8B5CF6) — Single accent for CTAs, active states, and focus rings.
*(No neon glows. Saturation is controlled. No pure #000000 black used anywhere).*

## 3. Typography Rules

- **Display:** `Geist`, `Inter` is banned in favor of Geist. Track-tight, controlled scale, weight-driven hierarchy.
- **Body:** `Geist` — Relaxed leading, neutral secondary color.
- **Mono:** `Geist Mono` — For code, metadata, timestamps, and high-density numbers.
- **Banned:** Generic system fonts for premium contexts. No Times New Roman or generic serifs.

## 4. Component Stylings

- **Buttons:** Flat, no outer glow. Tactile scale down on active. Accent fill for primary, ghost/outline with whisper borders for secondary.
- **Cards:** Subtly rounded corners (1.5rem). Diffused whisper border instead of heavy shadows. High-density structures rely on negative space and border-top dividers.
- **Inputs:** Label above, error below. Focus ring in accent color. No floating labels.
- **Navigation:** Active states use the Violet Energy color as a text gradient or subtle background, with spring motion on indicator sliding.
- **Loaders:** Skeletal shimmer matching exact layout dimensions. No circular spinners.

## 5. Layout Principles

Grid-first responsive architecture. Generous internal padding (1.5rem to 2rem).
No overlapping elements—every element occupies its own clear spatial zone.
Strict single-column collapse below 768px. Max-width containment (max-w-screen-2xl).
No flexbox percentage math for structural grids.

## 6. Motion & Interaction

Framer Motion Spring physics for all interactive elements (`stiffness: 100, damping: 20`).
Staggered cascade reveals for lists. Perpetual micro-loops on active dashboard components.
Hardware-accelerated transforms only (no animating width/height/top/left).

## 7. Anti-Patterns (Banned)

- No emojis anywhere.
- No generic serif fonts.
- No pure black (`#000000`).
- No neon glows or heavy drop shadows.
- No 3-column equal grids in high variance contexts.
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash").
- No fake round numbers (`99.99%`).
- No overlapping elements — clean spatial separation always.
