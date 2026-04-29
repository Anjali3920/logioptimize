# Design Brief

## Purpose & Context
Premium logistics optimization dashboard for algorithmic delivery route planning, package prioritization, and real-time vehicle allocation—designed for ops teams managing thousands of daily deliveries.

## Tone & Differentiation
Futuristic tech-corporate, reminiscent of Amazon Logistics ops centers but elevated with vivid neon accents. Emphasizes data clarity and precision. Academic-corporate blend through typography hierarchy.

## Color Palette

| Token | OKLCH Value | Hex (approx) | Role |
|-------|-------------|--------------|------|
| Primary | 0.62 0.32 262 | #00D9FF | Neon cyan—active states, highlights, primary CTAs |
| Secondary | 0.55 0.28 255 | #0088FF | Electric blue—secondary data series, subheadings |
| Accent | 0.65 0.26 60 | #FF9500 | Amber-orange—urgency, warnings, delivery priority |
| Background | 0.12 0 0 | #1A1A1A | Deep navy-black, primary surface |
| Card | 0.16 0 0 | #242424 | Elevated card surfaces above background |
| Foreground | 0.92 0 0 | #EBEBEB | Light grey text for readability |
| Muted | 0.28 0.04 0 | #3A3A3A | Disabled/secondary text |
| Border | 0.24 0.04 0 | #323232 | Card and section borders, minimal contrast |

## Typography
- **Display**: General Sans (geometric, bold, 700 weight for module titles)
- **Body**: DM Sans (clean sans-serif, 400–500 weights)
- **Mono**: JetBrains Mono (data tables, algorithm code snippets)

## Shape Language
- **Border Radius**: 8px (cards, inputs, buttons) — sharp modern aesthetic
- **Spacing**: 6/8/12/16/24/32px rhythm (compact for data density)
- **Shadows**: Subtle elevated shadows (0 8px 32px with dark alpha), no glow except on neon accents

## Structural Zones

| Zone | Background | Border | Shadow | Purpose |
|------|-----------|--------|--------|---------|
| Header | `bg-card` | `border-b border-border/30` | None | Navigation, logo, search |
| Sidebar | `bg-sidebar` | `border-r border-sidebar-border/50` | None | Module navigation, section controls |
| Main Content | `bg-background` | None | None | Full-height viewport with grid layout |
| Card/Panel | `bg-card` | `border border-border/30` | `shadow-elevated` | Data containers, metrics, visualizations |
| KPI Row | `bg-card` | `neon-cyan-border` (optional) | `shadow-neon-cyan-sm` | Priority metrics with subtle neon accent |

## Elevation & Depth
- **L0**: Background (`0.12 0 0`) — base canvas
- **L1**: Cards/panels (`0.16 0 0`) — primary interactive layer
- **L2**: Popovers/modals (`0.2 0 0`) — floating above cards
- Depth achieved through layered darkness and border distinctions, not blur or heavy shadows

## Component Patterns
- **Buttons**: Neon cyan on dark background, high contrast, 8px radius
- **Data Table**: Monospace font, zebra striping with `bg-muted/20`, cyan column headers
- **Chart**: Neon cyan primary line, amber/orange secondary bars, dark canvas background
- **Status Badges**: Amber for urgent, cyan for active, muted for neutral

## Motion & Interaction
- **Transition Default**: 0.3s cubic-bezier(0.4, 0, 0.2, 1) on all interactive elements
- **Neon Pulse**: 3s infinite pulse on priority/active elements (subtle opacity shift)
- **Hover State**: 10% opacity increase on primary, border glow becomes visible

## Constraints
- No full-page gradients (solid colors only)
- Neon accents limited to CTAs, active states, and urgency indicators (never decorative)
- Foreground text must maintain >4.5:1 contrast on all backgrounds
- Dark mode only (no light mode variant)

## Signature Detail
Subtle neon glow borders on KPI cards showing critical metrics—combines tech dashboard precision with cyberpunk futurism without sacrificing professionalism.
