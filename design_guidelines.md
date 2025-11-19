# Design Guidelines: Totem Touch - EtMday BCI

## Design Approach
**Responsive Component-Layered System**: This application uses pre-designed background graphics with interactive components overlaid. The implementation uses responsive viewport-based sizing to adapt to both kiosk (1080x1920) and tablet resolutions while maintaining design fidelity.

## Core Design Principles

### 1. Viewport & Layout
- **Base Resolution**: 1080x1920 (vertical/portrait orientation for kiosk)
- **Tablet Support**: ~834×1194 (portrait), ~1194×834 (landscape)
- **Responsive Strategy**: Viewport units (vw, vh) with clamp() for fluid sizing
- **Full-Screen Images**: Background graphics fill screen with `object-fit: cover`
- **No Scrolling**: Each screen is a single, full-height viewport
- **Touch-First**: All interactive elements optimized for finger touch (minimum 48px touch targets)

### 2. Color System - BCI Brand Colors
```css
--bci-red: hsl(0, 84%, 60%)        /* #E63946 - Form input "Nombre" */
--bci-green: hsl(84, 70%, 46%)     /* #84C318 - Form input "RUT" */
--bci-orange: hsl(43, 95%, 56%)    /* #F7B32B - Form input "RUT Empresa" */
--bci-blue: hsl(211, 100%, 40%)    /* #0066CC - Form input "Teléfono", buttons */
--bci-black: hsl(0, 0%, 0%)        /* #000000 - Form input "Mail" */
```

### 3. Layer Architecture

Each page uses a 3-layer system:

**Layer 1: Background** 
- Clean background image with gradients and structural elements
- Mascots/characters included in background
- Positioned with `absolute` and `object-cover`

**Layer 2: Interactive UI**
- Functional components (inputs, checkboxes, buttons)
- Created as React components with proper styling
- Positioned responsively using flexbox/grid or viewport-relative units
- Adapts to screen size changes

**Layer 3: Overlays (when needed)**
- Loading states, error messages
- Modals or temporary feedback

### 4. Typography
**Form Inputs** (matching background design):
- Font Family: Open Sans, sans-serif
- Input Text: clamp(1rem, 2vw, 1.25rem) for responsive sizing
- Labels: Colored backgrounds with white text (matching BCI colors)
- Validation Messages: 1rem, red for errors, positioned below inputs

### 5. Spacing System
**Responsive Spacing**:
- Base unit: `clamp(0.75rem, 1.5vw, 1.5rem)`
- Input vertical spacing: Proportional gaps using flexbox
- Button padding: Responsive with vh/vw units
- Touch targets: Always minimum 48px across all resolutions

### 6. Interactive Components

**Form Inputs** (Page 3 - Registro):
- 5 colored input bars matching BCI brand:
  - Red: "Nombre"
  - Green: "Rut" 
  - Orange: "Rut Empresa" (optional with toggle)
  - Blue: "Teléfono"
  - Black: "Mail"
- Height: clamp(3rem, 5vh, 4rem)
- Rounded corners: rounded-lg
- White text with appropriate contrast
- Positioned within mascot's "pancarta" using flexbox

**Checkboxes**:
- Page 3: 4 white checkboxes for "Nivel de Ventas" aligned with green arrows
- Page 4: White checkboxes inside colored service cards (Mentorías/Jugar Activación)
- Size: 48x48px minimum for touch
- Visual feedback: Scale transform on selection

**Radio Buttons** (Page 5 - Categorías):
- Positioned to right of each colored category card
- Size: 48x48px minimum
- Single selection behavior
- Cards: Servicios Financieros (red), Marketing y Ventas (green), Gestión y Productividad (blue), Innovación y Talento (orange)

**Buttons**:
- Primary button: BCI blue (#0066CC)
- Height: clamp(3.5rem, 6vh, 4.5rem)
- Border radius: rounded-xl
- Position: Bottom of screen with responsive margin
- Active state: active-elevate-2 for touch feedback
- Full-width or centered depending on design

### 7. Responsive Positioning Strategy

**Flexbox/Grid Layouts**:
- Container: flex flex-col or grid for structured layouts
- Gaps: Proportional spacing using gap-[x] with viewport units
- Alignment: items-center, justify-center for centering

**Absolute Positioning (when necessary)**:
- Used for precise overlay elements (radio buttons, checkboxes over cards)
- Values in percentages (%) for responsive scaling
- Example: `top: 35%`, `left: 50%`, `transform: translateX(-50%)`

**Responsive Containers**:
- Max-width constraints for tablet landscape
- Aspect-ratio utilities to maintain proportions
- Centered content: `mx-auto`

### 8. Breakpoint Strategy
```css
/* Base: Kiosk vertical */
@media (min-width: 1080px) and (min-height: 1920px) {
  /* Full kiosk optimizations */
}

/* Tablet portrait */
@media (min-width: 768px) and (max-width: 1080px) {
  /* Adjust spacing, font sizes */
}

/* Tablet landscape */
@media (min-height: 768px) and (max-height: 1200px) and (orientation: landscape) {
  /* Different layout considerations */
}
```

### 9. Page-Specific Implementation

**Página 01 - Inicio** (no changes needed)
- Full-screen clickable
- Original image maintained

**Página 02 - Bienvenida** (no changes needed)
- Full-screen clickable
- Original image maintained

**Página 03 - Registro**
- New clean image: `03-CASO-1_1763258527203.png`
- Mascot holding "pancarta" (gray tablet)
- Form inputs created as React components with BCI colors
- 4 checkboxes for "Nivel de Ventas" aligned with green arrows
- Responsive form positioned within pancarta boundaries

**Página 04 - Selección Servicio**
- Original image with text "Mentorías" and "Jugar Activación" maintained
- Add white checkboxes as React components inside each colored card
- Add "Siguiente" button (BCI blue) at bottom
- Responsive card hit areas

**Página 05 - Categorías**
- New clean image: `05-CASO-1_1763258738107.png`
- Category text remains in colored cards (part of image)
- Radio buttons created as React components to right of each card
- Responsive stack layout

**Página 06 - Confirmación**
- New clean image: `06-CASO-1_1763258746397.png`
- QR code generated dynamically
- Dynamic category text above QR
- Centered layout, responsive sizing

### 10. Validation & Feedback
- Real-time validation for required fields
- Error messages: Below inputs, red text, responsive size
- Success indicators: Checkmark or visual confirmation
- Touch feedback: Immediate visual response on all interactions

### 11. Navigation Flow
- Pages 1-2: Full-screen clickable area
- Page 3: Form submission on valid data
- Page 4: Conditional routing (Mentorías → Page 5, Jugar only → Confirmation)
- Page 5: Radio selection with "Siguiente" button → Page 6
- Page 6: Display confirmation + QR, auto-return to start (30s)

### 12. Animations
**Minimal, Purposeful**:
- Page transitions: Simple fade (200-300ms)
- Button press: Scale animation (150ms)
- Checkbox/radio selection: Scale + visual change (200ms)
- No complex animations for kiosk performance

### 13. Accessibility for Touch
- All interactive elements: Minimum 48x48px touch targets
- Clear visual separation between interactive zones
- High contrast for text over images
- No hover states (touch interface only)
- Immediate visual feedback on all interactions

### 14. QR Code Display (Page 6)
- Centered on screen
- Size: Responsive with min 300px, max 400px
- White background padding around QR
- Dynamic text above QR based on selected category
- Text: Responsive sizing, centered, readable

## Images
Background images used:
1. `01-CASO-1_1763175998395.png` - Landing/inicio (unchanged)
2. `02-CASO-1_1763175998396.png` - Bienvenida (unchanged)
3. `03-CASO-1_1763258527203.png` - Registration (NEW - clean, no drawn inputs)
4. `04-CASO-1_1763175998396.png` - Service selection (unchanged - has text)
5. `05-CASO-1_1763258738107.png` - Categories (NEW - clean, no drawn radios)
6. `06-CASO-1_1763258746397.png` - Confirmation (NEW - clean, no QR)

## Implementation Notes
- Use Tailwind clamp() for fluid typography
- Leverage CSS custom properties for responsive sizing
- Test on multiple viewport sizes during development
- Maintain touch target minimums across all breakpoints
- Keep performance optimized for kiosk hardware
