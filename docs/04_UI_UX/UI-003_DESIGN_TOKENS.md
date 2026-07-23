# UI-003 — Design Tokens

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Owner | Private Office |
| Last updated | 2026-07-23 |
| Depends on | MD-400, UI-001 |

## Purpose

Freeze the v1 semantic color and typography token specification that MD-400 intentionally left open ("this MD intentionally does not freeze a brand palette") and that UI-001 requires ("use a semantic token system... not component-specific hard-coded colors").

## Scope

Light and dark mode color tokens, and the typography stack, sourced from the owner's existing brand identity at ronaldbarrios.com, adapted for a data-dense working application rather than an editorial marketing site.

## Requirements / Decisions

### Source identity (ronaldbarrios.com, verified July 2026)

| Token | Value | Original use |
|---|---|---|
| Background (dark) | `#1C1A17` | Page background |
| Text (on dark) | `#EFE7D6` | Body text |
| Accent — Olive | `#2F3324` | Secondary surfaces |
| Accent — Travertine | `#2A2620` | Card surfaces |
| Accent — Espresso | `#B0A090` | Secondary text, rules |
| Heading typeface | Cormorant Garamond (weight 300) | Editorial headings |
| Body typeface | Inter | Body text |

### Private Office semantic tokens (v1)

| Semantic token | Light mode | Dark mode |
|---|---|---|
| `surface` | `#F7F4EE` | `#1C1A17` |
| `text` (primary) | `#221F1B` | `#EFE7D6` |
| `text-secondary` | `#8A7B6C` | `#B0A090` |
| `border` | `#EAE4D8` | `#2A2620` |
| `action` (accent) | `#3E4530` | `#7C8566` |
| `success` | standard semantic green (unchanged) | standard semantic green (unchanged) |
| `warning` | standard semantic amber (unchanged) | standard semantic amber (unchanged) |
| `danger` | standard semantic red (unchanged) | standard semantic red (unchanged) |
| `information` | standard semantic blue (unchanged) | standard semantic blue (unchanged) |

### Typography

- **Inter** — used for all interface text: navigation, body copy, tables, monetary figures, dates. Supports tabular numerals as required by UI-001.
- **Cormorant Garamond** — reserved for large section headings only (e.g., "Hoy", "Patrimonio"). Never used for data-dense content, form labels, or table content.

## Rules and constraints

- Status/severity is never communicated by color alone (UI-001); `success`/`warning`/`danger`/`information` tokens are always paired with an icon or label.
- Light and dark modes must preserve equivalent contrast and hierarchy, per UI-001.
- No component may hardcode a hex value; all styling references these semantic tokens.

## Acceptance criteria / Validation

- All interface components (per UI-002's required component list) are styled exclusively through these tokens.
- Automated or manual contrast checks pass WCAG-equivalent thresholds in both light and dark mode.

## Open questions

- None outstanding. Token set may be extended (e.g., additional accent shades) as new screens surface real needs.

## Change history

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-23 | Initial token freeze, sourced from ronaldbarrios.com identity. |
