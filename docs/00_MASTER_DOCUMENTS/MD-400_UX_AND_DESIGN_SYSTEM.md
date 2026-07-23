# MD-400 — UX & Design System

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-000, MD-100 |

## Experience principles

1. **Context before controls.** Start with what matters; place operational detail one level deeper.
2. **Calm is functional.** Avoid visual noise, dense default tables, decorative icons, and attention-grabbing motion.
3. **Evidence is one action away.** Any material number should reveal its date, scope, source, and supporting items.
4. **Progressive disclosure.** Advanced accounting and configuration are available without dominating owner workflows.
5. **Responsive is one product.** The browser experience must remain usable on desktop, tablet, and phone.
6. **No dark-pattern automation.** AI suggestions clearly state confidence, evidence, and required approval.

## Navigation model

Primary destinations: Today, Group, Treasury, Estate, Projects, Relationships, Vault, Calendar, Intelligence, Reports, and Settings. Accounting is role-gated and normally accessed through contextual links or a designated accountant workspace.

## Visual direction

Quiet private-office character: warm neutrals, graphite, restrained petrol-blue accents, semantic green/amber/red, generous spacing, legible data typography, and a first-class dark mode. A formal token specification will live in UI documents; this MD intentionally does not freeze a brand palette.

> **Note (2026-07-23):** the formal token specification referenced above has been frozen in [UI-003](../04_UI_UX/UI-003_DESIGN_TOKENS.md), based on the owner's existing brand identity.

## Interaction rules

- Primary actions are explicit, reversible where possible, and show the affected owner/entity.
- Destructive actions use confirmation and explain whether a record is archived, reversed, or anonymized.
- Tables provide saved views, filters, search, and detail panels; dashboards never depend exclusively on tables.
