# TEST-001 — Quality Strategy

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-900, SEC-001 |

## Test layers

Unit tests protect calculations and domain invariants. Integration tests protect database, event, and adapter behavior. Contract tests protect APIs and external adapters. End-to-end tests prove high-value workflows. Security and permission tests prove isolation. Recovery drills prove operational resilience.

## Financial-critical scenarios

At minimum, test idempotent import, duplicate detection, movement reconciliation, reversal/correction, currency conversion provenance, role/entity access isolation, document sharing expiry, audit records, backup restore, and AI source/permission boundaries.

## Release evidence

A release includes mapped acceptance criteria, automated results, manual validation where required, known limitations, migration/rollback plan, and accountable approval.
