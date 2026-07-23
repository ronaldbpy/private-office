# FS-002 — Timeline & Activity

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Phase | 1 |
| Depends on | MD-250, MD-300, MD-800 |

## Purpose

Provide a filterable, permission-aware chronology of meaningful group events without becoming an audit-log replacement.

## Event model

Events include entity creation, imported statement availability, document versioning, contract milestones, transaction status changes, ownership changes, project milestones, alerts, approvals, and reversals. An event has a type, occurred-at time, recorded-at time, actor/system source, related entities, visibility scope, correlation ID, and human summary.

## Rules

- Events are immutable. Corrections create a correcting event linked to the original.
- The timeline stores a concise projection; authoritative details remain in their owning aggregate and audit log.
- Users can filter by group/entity, project, type, time interval, actor, and linked document.
- Sensitive event summaries are redacted when the viewer lacks access to the source record.

## Acceptance criteria

- A user can trace a displayed financial event to its transaction, movement, document, or accounting reference when authorized.
- Import retries do not create duplicate timeline entries.
- The UI distinguishes occurrence time from the time Private Office learned of the event.
