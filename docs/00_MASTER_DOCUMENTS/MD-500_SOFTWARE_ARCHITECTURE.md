# MD-500 — Software Architecture

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-300, MD-700, MD-800 |

## Architectural intent

Private Office is an API-first modular application. The private user experience is decoupled from accounting and external services through a domain API, adapters, events, and canonical identifiers.

```text
Web/PWA experience
        ↓
Private Office API and domain services
        ↓                 ↘
Canonical store/events    Integration adapters (ERP, bank, OCR, notifications, AI)
        ↓
Accounting and external systems
```

## Bounded domains

- **Core:** group, parties, access, preferences, audit.
- **Finance:** treasury, receivables/payables, financial transactions and forecasts.
- **Estate:** assets, liabilities, valuations, ownership and insurance.
- **Operations:** projects, contracts, relationships, tasks and Vault.
- **Intelligence:** search, analytics, AI, insights, alerts and reports.
- **Platform:** integrations, security, reliability and observability.

## Technology direction

The initial implementation may use Next.js/TypeScript for web, a TypeScript backend such as NestJS, PostgreSQL for Private Office's canonical operational data, object storage for Vault, and Docker on a managed VPS or cloud environment. ERPNext is an evaluated accounting engine/integration candidate; no implementation may assume its database is Private Office's source of truth. Technology selection must be confirmed through ADRs and hosting validation.

> **Note (2026-07-23):** hosting and infrastructure decisions have been confirmed in [ADR-003](../06_ADR/ADR-003_HOSTING_AND_INFRASTRUCTURE_TOPOLOGY.md) (Render + Google Drive), the accounting engine has been formally deferred in [ADR-005](../06_ADR/ADR-005_ACCOUNTING_ENGINE_DEFERRAL.md), and the identity provider has been confirmed in [ADR-004](../06_ADR/ADR-004_IDENTITY_PROVIDER_SELECTION.md) (Clerk).

## Integration rule

No frontend or AI component accesses an ERP or database directly. Domain APIs provide authorization, scope, audit, validation, and stable contracts. Integrations publish immutable events and retain idempotency keys.
