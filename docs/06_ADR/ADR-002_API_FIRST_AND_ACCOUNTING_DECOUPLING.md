# ADR-002 — API-first and Accounting Decoupling

| Field | Value |
|---|---|
| Status | Proposed |
| Date | 2026-07-22 |
| Decision owner | Private Office |

## Context

The group needs formal accounting and financial reports, but its owner experience, estate model, Vault, and future integrations must not be constrained by one ERP product.

## Decision

Private Office will communicate with accounting engines only through governed adapters and APIs. It owns canonical identifiers, relationships, audit context, and user experience. ERPNext is a candidate, pending accountant fit, licensing, deployment, and support validation.

> **Note (2026-07-23):** the underlying principle in this ADR was formally accepted, and the accounting-engine selection itself was deferred, in [ADR-005 — Accounting Engine Deferral](ADR-005_ACCOUNTING_ENGINE_DEFERRAL.md). This document is kept unmodified per MD-000's rule that past decisions are superseded, not silently edited.

## Consequences

Additional integration work is required, but accounting engines can be replaced or supplemented without redesigning user-facing concepts.

## Alternatives considered

- Use an ERP database and interface as the entire system: rejected because it couples the product to one vendor model and UX.
- Build statutory accounting from scratch: rejected for the initial scope because it increases regulatory and operational risk.
