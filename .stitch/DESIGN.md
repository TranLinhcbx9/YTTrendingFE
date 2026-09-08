---
name: Shorts Trend Monitor — Signal Desk
projectId: '5794602541391723591'
colors:
  surface: '#edfdf9'
  surface-dim: '#ceddda'
  surface-bright: '#edfdf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e7f7f3'
  surface-container: '#e1f1ed'
  surface-container-high: '#dcece8'
  surface-container-highest: '#d6e6e2'
  on-surface: '#101e1c'
  on-surface-variant: '#3e4947'
  inverse-surface: '#253331'
  inverse-on-surface: '#e4f4f0'
  outline: '#6e7977'
  outline-variant: '#bec9c6'
  surface-tint: '#006a60'
  primary: '#006a60'
  on-primary: '#ffffff'
  primary-container: '#61f9e6'
  on-primary-container: '#003731'
  secondary: '#346760'
  on-secondary: '#ffffff'
  secondary-container: '#b8ede3'
  on-secondary-container: '#194f48'
  tertiary: '#645498'
  on-tertiary: '#ffffff'
  tertiary-container: '#e8deff'
  on-tertiary-container: '#352466'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  background: '#edfdf9'
  on-background: '#101e1c'
  surface-variant: '#d6e6e2'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
  metric-md:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
  metric-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 0.625rem
  md: 0.75rem
  lg: 1.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 40px
  gutter-mobile: 16px
  gutter-desktop: 24px
---

# Design System: Shorts Trend Monitor — Signal Desk

## 1. Visual Theme & Atmosphere

Signal Desk is a light-first intelligence workspace for discovering promising YouTube Shorts without imitating a consumer video feed. It is calm, compact, and deliberate: a cool mineral canvas, quiet tonal surfaces, and a restrained teal signal color make unusually strong video performance feel immediately visible without turning every metric into a warning.

The product should feel like one analytical instrument from navigation through a channel-management table to a video investigation. Information density is purposeful, not cramped. Surface steps, fine borders, and aligned numeric columns establish hierarchy; shadows are only used for overlays. The existing Material 3 teal palette, Be Vietnam Pro headings, Inter UI text, JetBrains Mono metrics, Material Symbols, and 4px base rhythm remain the implementation foundation. The existing dark mode is an alternate rendition of the same hierarchy, not a second visual language.

## 2. Color Palette & Roles

### Primary Foundation

| Role | Token / value | Use |
| --- | --- | --- |
| Canvas | `background` / `#EDFDF9` | App frame and scrollable page background. |
| Lowest surface | `surface-container-lowest` / `#FFFFFF` | Cards that need maximum contrast. |
| Standard surface | `surface-container-low` / `#E7F7F3` | Filter trays, tables, empty states. |
| Raised surface | `surface-container` / `#E1F1ED` | Hovered rows, metric cells, selected but non-primary controls. |
| Active/overlay surface | `surface-container-high` / `#DCECE8` | Menus, bottom sheets, sticky controls. |
| Structural line | `outline-variant` / `#BEC9C6` | 1px card/table/rail dividers. |
| Emphasized line | `outline` / `#6E7977` | Focus ring, active grouping, dialog outline. |

### Accent & Interactive

`primary` / `#006A60` is the single action and active-navigation signal. Use it for filled primary buttons, active tab indicators, selected filter treatment, focused field outlines, live trend visualization, and key interaction icons; never use it as broad surface fill. `primary-container` supports selected nav pills and gentle emphasis. `tertiary` / soft violet is reserved for non-semantic analytical annotation, never a second CTA.

### Typography & Text Hierarchy

Use `on-surface` / `#101E1C` for titles and data; `on-surface-variant` / `#3E4947` for supporting prose; `outline` / `#6E7977` for metadata, placeholders, labels, and inactive icons. Keep contrast high; do not mute content by lowering opacity below 70%.

### Functional States

Tracking is forest/mint, New is clear blue, Archived is neutral gray, heat is amber-to-orange, and destructive/error is the dedicated Material error family. Semantic status always combines icon/dot plus text; color never carries the meaning alone. Pending uses a muted neutral treatment and em dash, never a fabricated zero.

## 3. Typography Rules

### Hierarchy & Weights

- **Page title:** Be Vietnam Pro 22/28, 700. Each route gets a concise title and a small contextual subtitle only where helpful.
- **Section/card title:** Be Vietnam Pro 15–18px, 600–700.
- **UI/body:** Inter 14/20; compact metadata 12/16. Labels are Inter 11/16, 600, slightly tracked, sentence case.
- **Data:** JetBrains Mono with `tabular-nums`; use it for counts, duration, score, date/time, and velocity. Do not use mono for paragraph copy.
- Title case is used for page and section headings; controls and helper text use sentence case. Avoid all-caps except the short semantic status labels already present.

### Spacing Principles

Use a strict 4px scale: 4, 8, 12, 16, 24, 32, 40. Default component gap is 12 or 16px; page sections use 24px. Desktop page gutters are 24px inside the content canvas, mobile gutters are 16px. Align labels, control baselines, metric values, and table columns to this cadence.

## 4. Component Stylings

### Navigation & Page Header

- Desktop retains the existing slim 80px vertical rail: mark icon at top, icon-plus-label items, and a filled active icon pill. Use a single 1px divider, not a card-like sidebar.
- Mobile retains the existing toolbar + hamburger-triggered Material drawer. Drawer uses the same icon-label item, active mint-container pill, and 48px touch targets.
- The top bar is a quiet persistent context bar: page title left, sync context right. It has a bottom divider and no floating shadow. Each page begins with the same content-start alignment below it.

### Buttons & Icon Buttons

- Prefer Angular Material `filled`, `tonal`, `outlined`, and `text` variants. A primary filled button is reserved for one dominant action in each context (Add channel, Open video); tonal is for secondary commitments (Save idea); outlined is for filter triggers; text and icon buttons are tertiary actions.
- Controls use 40px compact desktop height and a minimum 44px mobile touch target. Button groups use 8px gaps. Destructive confirmation uses the Material error role only.
- Icon buttons live in a consistent 40px square hit target; table-row actions visually sit in a shared compact action cell rather than appearing as unrelated glyphs.

### Inputs, Selects & Filters

- Standard forms use outlined Material fields with a persistent label, 40px density, 8px corner, low surface fill, and explicit helper/error text below.
- Focus uses a 2px primary outline and no glow. Disabled controls retain readable labels with a clear disabled affordance.
- The dashboard filter area is one reusable **filter tray**: field label above control, 12–16px internal rhythm, compact selected chips, time-range segmented control, and a clear grouping boundary. At under 600px it becomes the existing single-trigger bottom sheet with a scrim; controls stack without duplicating markup.
- Chips are full pills. Filter chips have neutral/selected states; status chips keep their semantic dot and label. Score badges use compact mono text over the thumbnail scrim.

### Cards & Video Units

- A standard card is `surface-container-lowest`, 1px `outline-variant`, 10px radius, and 12–16px padding. Cards do not use drop shadows; hover changes the surface by one level and reveals a subtle focus outline.
- The video card remains a vertical thumbnail-led unit on desktop and a horizontal scan row on mobile. It keeps the duration, score, external-open, save, title, channel identity, data row, status, optional trend/velocity, and pending treatment already available in the product.
- Metric cards use the raised surface, small label, prominent mono value, and a consistent 10px radius. A four-up desktop metric grid collapses cleanly to two columns on mobile.

### Tables, Pagination & Lists

- Tables share the standard card shell. Header rows are slightly raised, labels are compact and muted, body rows have 1px dividers, and row hover uses a single surface step. Numeric/date columns use tabular mono figures. Preserve horizontal scrolling on narrow screens rather than removing columns or actions.
- `mat-paginator` is attached to the table/grid shell with a top divider and compact quiet styling. Page controls must look identical in Channels and Dashboard.

### Dialogs, Feedback & States

- Dialogs use the standard surface, 28px Material dialog corner, a stronger outline, 24px body padding, and a calm scrim. Field errors stay inline; destructive actions must explicitly state consequence before the error-filled action.
- Loading uses the existing thin primary progress bar for page/list loading and the existing row/button spinner for mutations. Avoid replacing loaded information with full-page spinners.
- Empty states use one reusable centered compact panel: outlined icon, title, concise explanation, and optional next action. Error states use the same composition with error text and a text Retry action. Pending data uses an em dash plus precise explanation; no synthetic values.

## 5. Layout Principles

### Grid & Structure

The application is a single shell: rail/drawer + top context bar + fluid content canvas. Desktop content uses a fluid 12-column mindset and no arbitrary page-specific max-width. Video results use an auto-fill grid that remains readable; channel data uses a horizontally scrollable table; detail uses a focused media-and-metrics hero followed by stacked analytical sections.

### Responsive Behavior & Touch

At 600px, switch rail to drawer and dashboard filters to the established bottom sheet. Under 600px, video cards become horizontal rows, video metrics become two-up, action sets wrap, and page gutters become 16px. At 900px, preserve full filter rows and multi-column detail layouts. At 1280px, allow the video grid to gain columns fluidly. No route may introduce a new breakpoint convention.

### Interaction & Accessibility

Use 150–180ms surface/color transitions only. Visible keyboard focus uses the primary role at ≥2px; hover never provides the only affordance. Use filled Material Symbol icons for active/selected navigation and outline icons elsewhere. Respect reduced motion by disabling pulse/transition effects. Maintain meaningful labels, tooltip text for disabled/pending controls, and 44px touch targets on mobile.

## 6. Route Blueprints & Reusable Patterns

| Route / state | Layout blueprint | Shared patterns |
| --- | --- | --- |
| `/dashboard` — Recent Shorts | Filter tray → four tabs → thin loading/error/empty state or fluid video-card grid → paginator. | Shell, page header, filter tray, tab bar, video card, status/score badges, empty/error/loading, paginator. |
| `/dashboard` — Trending, Fast Growing, Saved tabs | Same structure and selected tab treatment; retain current pending explanations until their APIs exist. | Filter tray, tab bar, empty state. |
| `/channels` | Add-channel form section → table card or empty state → paginator; actions stay in the final table column. | Shell, form field, primary button, table shell, avatar, row actions, dialog. |
| Channel edit dialog | Form fields + tracking toggle + Cancel/Save actions. | Dialog shell, input, toggle, button feedback. |
| Delete-channel dialog | Consequence copy + Cancel + destructive Confirm with mutation spinner. | Dialog shell, error action. |
| `/videos/:id` | Back link → media/detail hero with title, channel/status/actions and four metric cells → growth timeline state → idea note state → archived explainer when relevant. | Shell, hero card, metric card, status chip, empty state, buttons. |

## 7. Design System Notes for Stitch Generation

### Language to Use

Describe screens as a **light-first, high-density analytical workspace** with a persistent slim navigation rail, quiet top context bar, crisp fine-line surface hierarchy, coherent Material 3 controls, thumbnail-led media data, and deliberate empty/pending states. Keep desktop and mobile variations as the same product system.

### Generation Rules

- Every route screen includes the identical rail, top header, page gutter, typography, table/card language, and icon family.
- Preserve every current control and data point. Do not add fake analytics, unsupported filters, SavedIdeas actions, user profiles, or unrelated charts.
- Show representative realistic Shorts/channel data only to demonstrate layout; label unsupported areas exactly as pending/unavailable rather than pretending the data exists.
- Generate desktop routes first, then mobile route counterparts only where the existing responsive layout changes materially. Generation prompts should contain structure and content, never repeat this document's colors, fonts, or radius values.

### Consistency Review Checklist

- One rail/drawer pattern; no per-screen navigation variations.
- One top header alignment and one desktop/mobile gutter system.
- One filter-tray, table-shell, card-shell, empty-state, error-state, and dialog language.
- Primary actions use filled Material treatment; destructive actions use the error role; pending actions are visibly disabled.
- All numeric data is aligned and uses mono/tabular figures; status always uses text plus semantic dot.
