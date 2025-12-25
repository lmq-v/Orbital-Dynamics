# N-Body Simulator Design Guidelines

## Design Approach: Material Design System

**Rationale**: Scientific and educational application requiring clarity, systematic controls, and data-dense information displays. Material Design provides established patterns for complex interfaces with clear hierarchy and responsive layouts.

**Core Principles**:
- Clarity and precision over decoration
- Information density without clutter
- Professional, academic aesthetic suitable for MIT application portfolio
- Focus on functionality and usability

---

## Typography

**Font Stack**: Google Fonts via CDN
- Primary: Inter (UI elements, controls, labels)
- Monospace: JetBrains Mono (data values, coordinates, scientific notation)

**Type Scale**:
- Display: text-4xl font-bold (main headings)
- Headers: text-2xl font-semibold (section titles)
- Body: text-base font-medium (controls, labels)
- Data: text-sm font-mono (numerical values, parameters)
- Captions: text-xs (helper text, units)

---

## Layout System

**Spacing Units**: Tailwind utilities of 2, 4, 6, and 8 (p-2, m-4, gap-6, space-y-8)

**Grid Structure**: 
- Desktop: 3-column layout (sidebar controls | simulation canvas | data panel)
- Tablet: 2-column (collapsible sidebar | canvas+data stacked)
- Mobile: Single column stack

**Container Strategy**:
- Full viewport height application (h-screen)
- Fixed sidebars with scrollable content areas
- Canvas takes remaining flexible space

---

## Component Library

### Navigation
- Top app bar: Logo, simulation title, presets dropdown, export buttons, settings icon
- Height: h-16 with shadow-md elevation

### Control Panel (Left Sidebar - w-80)
**Sections** (using accordion/collapsible pattern):
1. **Initial Conditions**: Number of bodies input, mass range sliders, velocity controls
2. **Physics Parameters**: Gravitational constant, time step, integration method dropdown
3. **Simulation Controls**: Play/pause/reset buttons, speed slider, step-forward button
4. **Presets**: Button grid for scenarios (Solar System, Binary Stars, Galaxy Collision, Figure-8, Custom)
5. **Visual Settings**: Trail toggle, body size scale, grid overlay, reference frame selector

**Control Components**:
- Sliders with numerical input fields
- Toggle switches for binary options
- Icon buttons (use Material Icons via CDN)
- Grouped button sets for related actions

### Simulation Canvas (Center - flex-1)
- Full-height canvas element with dark background
- Coordinate axes overlay
- Zoom controls (bottom-right corner)
- Center-of-mass indicator
- Performance FPS counter (top-right corner, text-xs opacity-70)

### Data Panel (Right Sidebar - w-72)
**Real-time Metrics Display**:
1. **System Properties**: Total energy (kinetic + potential), momentum components, angular momentum
2. **Individual Bodies Table**: Scrollable list showing position, velocity, mass for each body
3. **Energy Graph**: Line chart showing energy conservation over time
4. **Performance Stats**: Calculation time per frame, bodies count

**Table Format**:
- Dense rows with monospace values
- Alternating row backgrounds for readability
- Sticky header

### Modals/Overlays
- **Export Dialog**: Format selection (JSON, CSV, video), time range, resolution options
- **Help/Documentation**: Keyboard shortcuts, physics explanations, usage guide
- **Settings**: Advanced performance options, precision settings

---

## Key Application Sections

1. **Header Bar** (h-16): Title + quick actions + preset selector
2. **Main Workspace** (flex h-[calc(100vh-4rem)]): Three-panel layout as described
3. **Status Footer** (h-8): Current simulation time, iteration count, system status messages

---

## Images

**No hero image required**. This is a tool-focused application where the simulation canvas is the primary visual element.

**Icon Usage**: Material Icons CDN for all UI controls (play_arrow, pause, refresh, settings, download, help, etc.)

---

## Interaction Patterns

- Drag bodies on canvas to reposition
- Scroll to zoom on canvas
- Click body to select and highlight in data panel
- Double-click canvas to add new body
- Keyboard shortcuts for play/pause (spacebar), reset (R), step (S)

**No animations** except for the physics simulation itself and smooth state transitions (200ms duration).

---

## Accessibility

- All controls keyboard navigable
- ARIA labels on icon-only buttons
- High contrast text on data displays
- Focus indicators on interactive elements
- Screen reader friendly numerical data tables