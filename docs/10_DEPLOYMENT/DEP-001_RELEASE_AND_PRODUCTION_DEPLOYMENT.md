# DEP-001 — Release & Production Deployment

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | INF-001, TEST-001, SEC-002 |

## Release process

1. Link the change to MD/FS/API/data/security documents and ADRs as applicable.
2. Run automated validation and record results.
3. Review migrations, integration effects, permission changes, and rollback.
4. Deploy to staging and validate critical user journeys.
5. Obtain accountable approval; schedule production deployment and monitoring.
6. Deploy, verify health/metrics/audit, and publish release notes.

## Production safeguards

Database migrations are backward-compatible or use a documented maintenance window. Every production release has a tested backup, restoration path, rollback decision point, and named incident owner. Production finance integrations are enabled only after accountant and owner validation.
