# MD-700 — API & Integration Architecture

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-300, MD-500, MD-800 |

## Principles

- API-first; clients access governed domain contracts only.
- Versioned REST APIs are the initial external contract. GraphQL may be added as a read-layer only after an ADR.
- Commands are idempotent, authorized, validated, and auditable.
- Domain events are immutable and carry correlation, causation, tenant/group, actor, and schema-version metadata.
- External data is imported through adapters; originals are retained and transformations are traceable.

## Integration classes

| Class | Examples | Rule |
|---|---|---|
| Financial engines | ERP/accounting, banks, brokers, crypto providers | Adapter + reconciliation; no direct UI dependency. |
| Content | OCR, email, Drive/OneDrive/Dropbox | Preserve source and permission model. |
| Communication | email, WhatsApp, Telegram, calendar | Explicit opt-in and delivery audit. |
| Intelligence | LLMs, embeddings, models | Least-data access, provider adapter, evidence-bound outputs. |
| Government/legal | e-invoicing, tax, signature | Validate jurisdiction and accountant/legal approval before activation. |

See [API-001](../03_API/API-001_API_STANDARDS.md) and [API-002](../03_API/API-002_EVENT_CONTRACTS.md).
