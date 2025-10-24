# Design Guidelines: Spotify Song Popularity Analysis Dashboard

## Design Approach

**Selected Framework:** Material Design 3 with Analytics Dashboard Specialization

**Rationale:** This data-heavy analytics application requires clarity, strong visual hierarchy, and familiar dashboard patterns. Material Design provides excellent data visualization principles while maintaining accessibility and responsiveness.

**Key Design Principles:**
1. Data First: Visualizations are the hero, UI chrome is minimal
2. Scannable Hierarchy: Clear content zones with consistent structure
3. Progressive Disclosure: Information revealed in logical sections
4. Actionable Interface: Every element serves data exploration

---

## Typography System

**Primary Font:** Inter (Google Fonts) - excellent readability for data-heavy interfaces
**Accent Font:** JetBrains Mono (for data tables and numeric displays)

**Hierarchy:**
- Page Titles: text-4xl font-bold (Dashboard, Analysis)
- Section Headers: text-2xl font-semibold (Dataset Overview, Popularity Distribution)
- Card Titles: text-lg font-semibold
- Body Text: text-base font-normal
- Data Labels: text-sm font-medium
- Captions/Metadata: text-xs font-normal
- Numeric Data: text-base font-mono (JetBrains Mono)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 for consistency
- Component padding: p-6
- Section spacing: space-y-8
- Card gaps: gap-6
- Tight spacing (labels): gap-2
- Button padding: px-6 py-3

**Container Structure:**
- Max width: max-w-7xl mx-auto
- Page padding: px-4 md:px-8
- Section vertical rhythm: py-8

**Grid System:**
- Upload area: Full-width centered
- Dashboard: 12-column responsive grid
- Chart cards: grid-cols-1 lg:grid-cols-2 for dual chart layouts
- Overview metrics: grid-cols-2 md:grid-cols-4 for stat cards
- Table layouts: Full-width with horizontal scroll on mobile

---

## Component Library

### Upload Interface

**File Upload Zone:**
- Large dropzone area (min-h-64) with dashed border (border-dashed border-2)
- Icon: Upload cloud icon from Material Icons (size 48px)
- Primary text: "Drag and drop your CSV file here"
- Secondary text: "or click to browse • Maximum 10MB • .csv format"
- Button: "Select File" (solid, prominent)
- Uploaded file preview card with filename, size, remove option

### Navigation & Header

**Top Navigation Bar:**
- Fixed header with backdrop blur (backdrop-blur-md)
- Logo/brand on left: "Spotify Analytics" with music note icon
- Navigation links: Dashboard, Upload, Export (text-sm font-medium)
- Right side: Upload button (always accessible)
- Height: h-16 with shadow-sm

### Dashboard Cards

**Chart Container Pattern:**
- Elevated cards with rounded corners (rounded-lg)
- Card header with title and action menu (export, fullscreen)
- Padding: p-6
- Shadow: shadow-md with hover:shadow-lg transition
- Chart area: Minimum height min-h-80 for readability

**Stat Cards (Dataset Overview):**
- Compact cards (p-4) displaying single metrics
- Large numeric value (text-3xl font-bold font-mono)
- Label below (text-sm)
- Icon in corner (subtle, decorative)

### Data Visualization Specifications

**Chart Styling (Recharts):**
- Clean, minimal gridlines (strokeDasharray="3 3")
- Responsive containers (ResponsiveContainer width="100%" height={400})
- Tooltips with backdrop (rounded-md, shadow-lg)
- Legend positioned at bottom
- Axis labels: text-xs, rotated -45° for dates if needed

**Specific Chart Types:**

1. **Popularity Distribution Histogram:**
   - Bar chart with narrow bars (barSize={40})
   - X-axis: Popularity ranges (0-20, 20-40, etc.)
   - Y-axis: Song count
   - Hover shows exact count

2. **Top 10 Songs Bar Chart:**
   - Horizontal bars for better song name readability
   - Bars sorted descending
   - Song names on Y-axis (truncate with ellipsis if needed)
   - Popularity score on X-axis

3. **Feature Correlation Heatmap:**
   - Grid layout with cells
   - Text overlay showing correlation coefficient
   - Darker intensity for stronger correlations
   - Features: popularity, danceability, energy, acousticness

4. **Popularity Over Years Line Chart:**
   - Smooth line curve
   - Data points marked with circles
   - Area fill beneath line (subtle gradient)
   - Year labels on X-axis

5. **Top 10 Genres Bar Chart:**
   - Vertical bars
   - Genre names angled or abbreviated if long
   - Average popularity value displayed on top of bars

### Data Table

**Preview Table (Dataset Overview):**
- Striped rows (alternate subtle background)
- Sticky header (position-sticky top-0)
- Compact cell padding (px-4 py-2)
- Monospace font for numeric columns
- Max 10 rows visible, scroll for more
- Column headers: font-semibold text-sm

### Buttons & Actions

**Primary Actions:**
- Upload button: Prominent, px-6 py-3, rounded-md
- Export chart buttons: Icon + text, sm size
- Download report: Secondary style with download icon

**Button States:**
- Default: Solid with shadow-sm
- Hover: Slight scale transform-scale-105
- Active: scale-95
- Disabled: opacity-50 cursor-not-allowed

### Export Menu

**Chart Actions (Top-right of each card):**
- Three-dot menu icon (vertical)
- Dropdown: "Export as PNG", "Export as CSV", "View Fullscreen"
- Menu styling: Elevated with shadow-lg, rounded-md

---

## Page Layouts

### Home/Upload Page

**Structure:**
1. Header navigation (full-width)
2. Hero section (py-20):
   - Centered content (max-w-4xl mx-auto)
   - Large heading: "Analyze Your Music Data"
   - Subtitle: "Upload any music CSV and get instant insights"
   - Upload dropzone component
   - Sample data link: "Try with sample Spotify dataset"

### Dashboard Page

**Layout Structure:**
1. Page header with breadcrumb: "Dashboard / Analysis Results"
2. Dataset Overview section:
   - Grid of 4 stat cards (rows, columns, upload time, file size)
   - Data preview table (collapsible)
3. Visualizations grid (space-y-8):
   - Popularity Distribution (full-width)
   - Two-column: Top 10 Songs | Correlation Heatmap
   - Popularity Over Years (full-width)
   - Top 10 Genres (full-width)
4. Footer with export actions

---

## Icons

**Icon Library:** Material Icons (CDN)

**Key Icons:**
- Upload: cloud_upload
- Chart: bar_chart, show_chart, grid_on
- Export: download, file_download
- Menu: more_vert
- Success: check_circle
- Error: error
- Info: info
- Close: close
- Fullscreen: fullscreen

---

## Responsive Behavior

**Breakpoints:**
- Mobile (base): Single column, stacked cards
- Tablet (md: 768px): 2-column grid for charts
- Desktop (lg: 1024px): Full 2-column dashboard
- Wide (xl: 1280px): Wider containers, more data visible

**Mobile Optimizations:**
- Hamburger menu for navigation
- Tables scroll horizontally
- Charts stack vertically
- Stat cards in 2x2 grid instead of 4 columns
- Upload zone reduced height (min-h-48)

---

## Animations & Transitions

**Minimal Animation Strategy:**
- Card hover: Subtle shadow elevation (transition-shadow duration-200)
- Chart loading: Simple fade-in (opacity 0 to 1)
- Page transitions: None (instant)
- Button interactions: Scale transforms only
- Data updates: Direct replacement, no animation

---

## Images

This application is data-focused and does not require hero images or decorative photography. Visual interest comes from:
- Data visualizations (charts are the imagery)
- Icon illustrations for empty states
- File upload illustrations (small, inline SVG)

**Empty State Illustration:** Simple line-art icon showing chart/graph when no data is loaded

---

## Accessibility

- All charts include ARIA labels and descriptions
- Color is never the only indicator (use patterns/textures in charts)
- Keyboard navigation for all interactive elements
- Focus indicators on all focusable elements (ring-2 ring-offset-2)
- Form inputs with visible labels
- Contrast ratios meet WCAG AA standards
- Screen reader announcements for data updates