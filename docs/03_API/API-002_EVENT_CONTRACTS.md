# API-002 — Event Contracts

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-500, MD-700, DM-002 |

## Event envelope

Every event contains `event_id`, `event_type`, `schema_version`, `occurred_at`, `recorded_at`, `group_id`, `actor`, `correlation_id`, `causation_id`, `subject`, and a minimal authorized payload. Event consumers must be idempotent.

## Initial event names

- `group.entity.created`
- `ownership.interest.recorded`
- `vault.document.ingested`
- `treasury.statement.imported`
- `treasury.movement.reconciled`
- `transaction.status.changed`
- `contract.expiring`
- `alert.created`
- `insight.generated`

Events are notifications of facts, not a permission bypass. Consumers re-authorize before retrieving expanded records.
