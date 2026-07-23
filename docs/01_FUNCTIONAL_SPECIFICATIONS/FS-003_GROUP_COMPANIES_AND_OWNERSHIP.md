# FS-003 — Group, Companies & Ownership

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Phase | 1 |
| Depends on | MD-200, MD-250, MD-300, SEC-001 |

## Purpose

Maintain the legal-entity directory and the dated ownership/control graph for the Group, including personal RUC, Casa Amelia EAS, Axentia EAS, and future legal entities.

## Scope

- Create and manage group members: people and legal entities.
- Record legal identity, jurisdiction, tax registration, governing documents, lifecycle, purpose, authorized representatives, and base currency.
- Record dated ownership interests, economic rights, voting/control rights, and supporting evidence.
- Visualize direct and indirect ownership without assuming statutory consolidation.

## Exclusions

This feature does not register a company with public authorities, determine legal validity, or replace shareholder registers and counsel. It records controlled copies and structured facts after verification.

## Critical rules

- An ownership record has owner, subject entity, interest type, percentage/units, effective dates, source document, verification state, and approval actor.
- Percentages may be unknown or non-applicable. The system must not force ownership to total 100% when external shareholders or incomplete evidence exists.
- Past ownership cannot be edited in place after verification; it is superseded with an effective-dated correction.
- Company suspension, closure, merger, or rename preserves historical identity and references.

## Acceptance criteria

- The system can show direct and indirect ownership as-of a selected date, including assumptions and gaps.
- A user cannot create a self-owning cycle without an explicit reviewed exception; invalid circular relationships are blocked.
- Every ownership visualization links to the underlying recorded interest and evidence for authorized viewers.
