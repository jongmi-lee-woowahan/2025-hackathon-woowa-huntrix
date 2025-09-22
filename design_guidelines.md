# Design Guidelines: Marketing Campaign Pipeline Interface

## Design Approach
**System-Based Approach**: Using a dark-first design system optimized for productivity and data visualization, drawing inspiration from modern analytics platforms like Linear and Notion's dark modes.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary**:
- Background: 15 8% 8% (deep charcoal)
- Surface: 15 8% 12% (elevated surfaces)
- Card backgrounds: 15 8% 15% (component containers)

**Brand Colors**:
- Primary: 172 92% 59% (#0CEFD3 - vibrant teal)
- Primary hover: 172 92% 65% (lighter teal)
- Success: 142 76% 50% (emerald green)
- Warning: 38 92% 50% (amber)
- Error: 0 84% 60% (red)

**Text & UI**:
- Primary text: 0 0% 95% (near white)
- Secondary text: 0 0% 70% (muted gray)
- Border/dividers: 15 8% 25% (subtle borders)

### B. Typography
**Font System**: Inter via Google Fonts
- Headings: Inter 600-700 (semibold to bold)
- Body text: Inter 400-500 (regular to medium)
- Labels/captions: Inter 500 (medium)
- Sizes: text-xs through text-3xl following Tailwind scale

### C. Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, m-2 (8px)
- Standard spacing: p-4, p-6 (16px, 24px)
- Section spacing: p-8, p-12 (32px, 48px)
- Large spacing: p-16 (64px)

### D. Component Library

**Step Progress Indicator**:
- Connected circular nodes with #0CEFD3 active states
- Animated progress lines between steps
- Status indicators: pending (gray), active (teal), completed (green)

**Metric Cards**:
- Dark surface backgrounds with subtle borders
- Prominent metric values in large typography
- Trend indicators with green/red color coding
- Minimal drop shadows for depth

**Input Fields**:
- Dark backgrounds with #0CEFD3 focus states
- Rounded corners (rounded-lg)
- Clear visual hierarchy with labels

**AI Processing Indicators**:
- Pulsing dot animations in #0CEFD3
- Loading spinners with teal accent
- Status badges with appropriate color coding

**Navigation & Controls**:
- Primary buttons: #0CEFD3 background, dark text
- Secondary buttons: transparent with teal borders
- Minimal button styles with subtle hover states

### E. Visual Hierarchy & Layout

**3-Step Pipeline Layout**:
- Vertical flow with clear step demarcation
- Connected visual flow lines in #0CEFD3
- Progressive disclosure of content
- Sticky progress indicator

**Dashboard Sections**:
- Grid-based metric cards (responsive 1-3 columns)
- Clear section headers with consistent spacing
- Generous whitespace between components

**Channel Distribution Interface**:
- Visual mapping with teal accent highlights
- Interactive elements with hover feedback
- Clean data visualization using charts

### F. Animations (Minimal Implementation)
- Smooth scroll-triggered reveals (opacity + transform)
- Step progression animations (0.3s ease-out)
- Hover states with subtle scale transforms
- Loading states with gentle pulsing

## Key Design Principles
1. **Dark-First**: All components optimized for dark mode viewing
2. **Data-Focused**: Clear hierarchy emphasizing metrics and progress
3. **Minimal Distraction**: Clean, purpose-driven interface elements
4. **Progressive Disclosure**: Information revealed as users advance through steps
5. **Accessibility**: High contrast ratios, clear focus states, semantic structure

## Special Considerations
- Ensure all text maintains WCAG AA contrast ratios against dark backgrounds
- Use #0CEFD3 sparingly as accent color for maximum impact
- Implement smooth transitions between pipeline steps
- Maintain consistent spacing and alignment across all three steps
- Design for both desktop and mobile responsive layouts