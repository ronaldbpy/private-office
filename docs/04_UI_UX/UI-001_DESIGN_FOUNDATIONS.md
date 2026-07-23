# UI-001 — Design Foundations

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-400 |

## Foundations

- Use a semantic token system: surface, text, border, action, success, warning, danger, and information—not component-specific hard-coded colors.
- Support light and dark schemes with equivalent hierarchy and contrast.
- Data uses tabular numerals and explicit currency/date formatting; never communicate critical status by color alone.
- Prefer short labels, natural-language section headings, high-quality empty states, and progressive disclosure.
- Respect `prefers-reduced-motion`, keyboard navigation, screen-reader semantics, and browser zoom.

> **Note (2026-07-23):** the concrete semantic token values are specified in [UI-003 — Design Tokens](UI-003_DESIGN_TOKENS.md).

## Information hierarchy

Page title → scope/date/freshness → decision-relevant summary → actionable exceptions → supporting detail. A number without scope, period, currency, or freshness is an incomplete component.
