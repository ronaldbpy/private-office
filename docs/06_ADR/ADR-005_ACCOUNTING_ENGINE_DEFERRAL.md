# ADR-005 — Accounting Engine Deferral

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-23 |
| Decision owner | Ronald Alejandro Barrios Duarte |
| Deciders | Owner |

## Context

ADR-002 (Proposed) established the principle of API-first decoupling from any accounting engine, listing ERPNext as an evaluated candidate. The owner currently has no formal accounting software in place; bookkeeping is handled informally, externally, by an accountant.

Research into ERPNext's self-hosting requirements found it disproportionate to current needs: a minimum of roughly 13 containers, its own dedicated MariaDB database, and at least 2 CPU cores, 4GB RAM, and 20GB storage dedicated solely to that stack. It is also incompatible with the Render hosting decision in ADR-003 without standing up a separate, dedicated server just for it.

## Decision

- Formally **accept** ADR-002's underlying principle: API-first, accounting-engine-decoupled architecture.
- **Defer** selection and integration of any formal accounting engine (ERPNext or otherwise) to a future ADR.
- Private Office launches with its **own lightweight Treasury module** (FS-006): movement registration, accounts, payments, and basic reports — not formal double-entry bookkeeping.
- Formal accounting engine evaluation is revisited only when transaction volume and administrative staffing justify it — for example, once the group's growing set of companies (construction, architecture, project completion, etc.) has dedicated administrative personnel loading invoices and payments regularly. If revisited, any such engine runs on **separate, dedicated infrastructure**, never forced onto the Render environment hosting the core application.

## Consequences

- Faster initial delivery; no accounting engine integration work in the near-term roadmap (Phase 2 of MD-900).
- Formal, accountant-ready statutory reporting (Phase 3 of MD-900) is delayed until a future ADR selects and validates an engine.
- The owner's external informal accountant continues operating outside Private Office until this decision is revisited.

## Alternatives considered

- **Deploy ERPNext now:** rejected — infrastructure weight and complexity disproportionate to the current single-informal-accountant reality.
- **Build full double-entry accounting from scratch:** rejected — out of scope per MD-000's constitutional principle that "the experience is not an ERP," and unnecessary at current scale.

## References

ADR-002, MD-500, MD-900 (Phase 3), FS-006.
