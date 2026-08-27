---
name: Clinical Excellence
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#62fae3'
  on-secondary-container: '#007165'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001e2f'
  on-tertiary-container: '#008cc7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-gap-desktop: 120px
  section-gap-mobile: 64px
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 20px
---

## Brand & Style

The design system is anchored in a **Modern Corporate** aesthetic tailored specifically for high-end healthcare. It balances clinical precision with a welcoming, human-centric feel. The visual language evokes feelings of trust, innovation, and tranquility. 

The style utilizes **Minimalism** with a focus on airy compositions and high-quality whitespace to reduce cognitive load for patients. It incorporates **Soft Elevation** to create a clear sense of hierarchy, using depth to distinguish interactive elements from static content. This approach ensures the interface feels premium and professional, moving away from "sterile" medical looks toward a more "wellness-boutique" experience.

## Colors

The palette is designed to be sophisticated and soothing. 

*   **Primary (Deep Blue):** Used for navigation backgrounds, primary headings, and high-importance UI elements. It provides an authoritative and stable foundation.
*   **Secondary (Soft Mint):** Reserved for accents, highlights, and health-positive indicators. It adds a fresh, modern energy to the design.
*   **Tertiary (Calm Cyan):** Utilized for secondary actions and information callouts.
*   **Neutral (Ice White/Cool Gray):** The primary surface color. We use a cool-toned white to keep the interface feeling clean and crisp without the harshness of pure #FFFFFF.
*   **Status Colors:** Use standard semantic colors (Red for errors, Amber for warnings) but desaturated slightly to match the professional tone.

## Typography

This design system uses **Inter** exclusively to maintain a clean, systematic, and highly legible appearance. 

The hierarchy is strictly enforced through weight and scale. **Display** and **Headline** styles use semi-bold or bold weights with tighter letter spacing to create a modern, editorial feel. **Body** text uses a generous line height (1.6) to ensure maximum readability for patients of all ages. **Labels** use a medium weight and slight tracking to differentiate them from body copy in functional areas like forms and metadata.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a maximum width constraint for large screens to maintain readability.

*   **Desktop:** 12-column grid with 24px gutters. Sections are separated by a minimum of 120px to provide the "breathing room" required by the brand personality.
*   **Tablet:** 8-column grid with 24px gutters.
*   **Mobile:** 4-column grid with 20px margins. Padding within cards and containers should scale down slightly to prioritize content density on small screens.

Consistent use of an 8px spacing system ensures all margins and paddings are multiples of the base unit, creating visual rhythm across all components.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and tonal layering. Surfaces are treated with a "Soft Layering" approach:

1.  **Level 0 (Base):** The `neutral` color (#F8FAFC) serves as the background.
2.  **Level 1 (Cards):** White (#FFFFFF) surfaces with a deep, diffused shadow. Shadows should use a primary-tinted hex (e.g., #0F172A at 4-6% opacity) with a large blur radius (32px to 48px) and a subtle vertical offset.
3.  **Level 2 (Interactive):** Elements like active buttons or open dropdowns receive a more pronounced shadow or a subtle 1px border in a lightened version of the primary color.

Avoid harsh black shadows; keep the depth soft and natural to maintain the "health and wellness" atmosphere.

## Shapes

The design system adopts a **Rounded** shape language to appear approachable and modern. 

*   **Standard Cards/Containers:** Use a 16px border radius (rounded-lg).
*   **Buttons & Inputs:** Use a 12px radius for a balanced, contemporary look.
*   **Chips/Badges:** Use a full pill-shape (999px) to distinguish them from interactive buttons.
*   **Images:** Apply the 16px radius to all featured imagery to maintain consistency with the card language.

## Components

### Buttons & CTAs
*   **Primary Button:** Solid `primary_color` with white text. On hover, the background shifts to a slightly lighter tint.
*   **Secondary Button:** Ghost style with a `primary_color` border or a light `secondary_color` fill.
*   **Interactions:** Use a subtle scale-down (0.98) on click and a smooth 200ms transition on hover.

### Inputs & Forms
*   **Field Style:** 12px rounded corners, 1px light gray border, and a subtle light blue focus ring.
*   **Validation:** Use clear icons (Check/Cross) rather than just color to ensure accessibility.
*   **Floating Labels:** Use for a cleaner, high-end look that saves vertical space.

### Cards (Testimonials & FAQ)
*   **Testimonial Cards:** 16px radius, deep shadow, and a quote icon in the `secondary_color`. Profile images should be circular.
*   **FAQ (Accordions):** Minimalist rows with a simple chevron. When expanded, the background of the active item should shift to a very light tint of the `primary_color`.

### Navigation
*   **Header:** Fixed position with a backdrop blur (glassmorphism) or solid white background once scrolled. Include a clear, high-contrast "Book Appointment" CTA button.

### Icons
*   **Style:** Linear, 2px stroke width, minimal detail. Use the `secondary_color` for icons to draw the eye to key features.