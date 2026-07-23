# FS-013 — Projects

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Phase | 4 |
| Depends on | MD-200, MD-300, FS-003, FS-016 |

## Purpose

Represent economic initiatives such as real-estate developments, events, investments, or ventures that can precede, span, or outlive legal entities.

## Required capabilities

- Project identity, purpose, lifecycle, manager, participants, dates, goals, risks, and confidentiality.
- Links to companies, people, contracts, documents, assets, accounts, transactions, investments, and cost/profit centers.
- Budget and forecast versions with actuals sourced from approved transactions.
- Milestones, tasks, decisions, and a project-specific timeline.

## Rules

- A project is not a legal entity and cannot itself hold a bank account or sign a contract; its relationships identify the legal party that does.
- Amounts allocated to a project retain the original financial owner and source transaction.
- Budget changes are versioned with rationale and approval; historical reports remain reproducible.

## Acceptance criteria

- A project dashboard clearly distinguishes committed, paid, forecast, and budgeted amounts.
- An authorized user can traverse from a project cost to its transaction and evidence.
- A project can be associated with multiple entities without duplicating its identity.
