# FS-017 — Calendar, Tasks & Alerts

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Owner | Private Office |
| Last updated | 2026-07-23 |
| Depends on | MD-250, MD-300, MD-800, AI-001, FS-001, FS-005, FS-003 |

## Purpose

Provide a permission-aware calendar of obligations, tasks, and alerts — starting with tax obligations per legal entity/RUC — feeding the Attention Queue and Agenda sections of FS-001 (Today Dashboard).

## Scope

Obligation registry per entity (what obligation, code, entity, activation date), recurring due-date rules (validated, human-sourced only), and alert generation grouped by user access.

## Requirements / Decisions

### Obligation registry (owner-provided, source: SET / owner)

**Axentia EAS and Casa Amelia EAS** (each entity holds the same set, independently):

| Code | Obligation | Active since |
|---|---|---|
| 211 | IVA General | 22/07/2026 |
| 954 | DJI IDU | 22/07/2026 |
| 700 | IRE General | 22/07/2026 |
| 726 | RET IDU | 22/07/2026 |

**RUC Personal Físico:**

| Code | Obligation | Active since |
|---|---|---|
| 211 | IVA General | 11/07/2022 |
| 700 | IRE General | 01/01/2020 |
| 735 | Anticipo IRE | 01/01/2020 |
| 948 | Estados Financieros | 01/01/2014 |
| 954 | DJI IDU | 31/12/2019 |
| 955 | Régimen Mensual de Comprobantes | 11/07/2022 |

> The "active since" date is the obligation's registration date with the tax authority, not a due date. It is stored as a distinct fact from the recurring due-date rule below.

### Confirmed recurring due-date rules (source: owner / accountant)

| Obligation | Rule |
|---|---|
| IVA General (211) | Due day 8 of every month, applied uniformly across all entities regardless of RUC termination digit (owner's explicit simplification) |
| IRE General (700) | Due April 8, annually |

### Unconfirmed due dates — pending accountant validation

DJI IDU (954), RET IDU (726), Anticipo IRE (735), Estados Financieros (948), Régimen Mensual de Comprobantes (955). Until confirmed by the owner or accountant, these display as **"vencimiento sin confirmar"** and are never calculated or assumed by the system or by POI.

### Alert rule

- Trigger **5 days before** the due date, uniformly across all obligation types.
- Due date is recorded **per entity**: each RUC/entity is a distinct fact even when the calendar date coincides across entities.
- Alert display is **grouped according to the viewing user's entity access** (per FS-005):
  - Owner sees a single grouped alert spanning all entities (e.g., "3 obligaciones de IVA vencen en 5 días: Axentia, Amelia, Personal").
  - A Contador scoped to one entity sees only that entity's obligations, with no indication that others exist.
- An alert remains visible until marked resolved, expired, or dismissed with a reason, per the alert rule already defined in FS-001.

## Rules and constraints

- The obligation registry (what exists) is a separate concern from the due-date calendar (when it's due). The system must never infer a due date it has not received from a validated human source.
- No autonomous calculation of tax due dates by AI/POI, per AI-001's prohibition on claiming tax certainty beyond verified data.

## Acceptance criteria / Validation

- IVA and IRE alerts fire exactly 5 days before their confirmed due dates, for every entity that has them registered.
- Obligations without a confirmed due-date rule show "pending confirmation" rather than a fabricated date.
- A Contador scoped to Axentia EAS receives grouped alerts only for Axentia's obligations.

## Open questions

- Confirm periodicity/due dates for: DJI IDU, RET IDU, Anticipo IRE, Estados Financieros, Régimen Mensual de Comprobantes — pending accountant input.
- Should the IVA due date become termination-specific in the future (rather than the owner's current uniform simplification) if new entities have different RUC termination digits?

## Change history

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-23 | Initial draft with real obligation data provided by the owner. |
