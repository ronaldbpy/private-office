# DM-002 — Relationship & Audit Model

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-200, MD-300, MD-800 |

## Relationships

Relationships are first-class records: `from_entity`, `to_entity`, `relationship_type`, `effective_from`, `effective_to`, `status`, `source_document`, `confidence/verification`, and audit fields. Typed relationships include owns, controls, finances, owes, manages, serves, relates_to, secures, and is_counterparty_to.

## Audit model

Audit entries are append-only and record actor/service, action, target, before/after summaries where permitted, request/correlation ID, timestamp, IP/device context for user actions, and authorization result. Audit logging is not optional for a sensitive read, export, share, import, approval, or mutation.

## Correction rule

Authoritative facts are not destructively edited after approval. Create a successor, reversal, or correction relationship that preserves the prior record and reason.
