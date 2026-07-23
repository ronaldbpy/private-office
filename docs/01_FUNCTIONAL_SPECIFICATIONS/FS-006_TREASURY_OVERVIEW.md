# FS-006 — Treasury Overview

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Phase | 2 |
| Depends on | MD-300, FS-003, API-003, SEC-001 |

## Purpose

Provide a trustworthy view of liquidity and financial accounts across authorized entities, without mixing it with unverified estimated estate values.

## Scope

Financial accounts include bank accounts, cashboxes, wallets, broker accounts, exchanges, and funds. The overview presents balances, currency, account owner, availability, statement freshness, restricted/committed amounts, upcoming cash events, and reconciliation state.

## Rules

- Imported balance is distinct from calculated balance, and both expose their as-of time and source.
- Account movement imports are immutable source records. Classifications and reconciliations are overlays.
- Transfers require two legs or an explicitly documented pending state; they may not disappear from cash flow.
- Currency conversion uses a documented rate source, as-of date/time, and valuation policy.
- A "liquidity total" must disclose included accounts, restricted funds, pending amounts, currency conversion method, and freshness.

## Acceptance criteria

- Users can view an account's owner, provider, currency, last successful import, reconciliation status, and source movements.
- A pending import or failed reconciliation visibly limits confidence in totals.
- A user cannot see accounts outside their entity and document scopes.
