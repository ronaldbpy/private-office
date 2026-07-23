# SEC-001 — Access Control & Data Classification

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-800 |

## Classification

| Level | Examples | Default handling |
|---|---|---|
| Restricted | identity documents, bank statements, ownership, tax, credentials | least-privilege, no public sharing, audited reads |
| Confidential | contracts, invoices, internal reports, project data | entity/role-scoped, audited export/share |
| Internal | operating procedures and approved templates | authenticated group access |
| Public | explicitly approved external materials | controlled publication only |

## Authorization

Effective permission = user role + group membership + entity scope + object classification + action + contextual policy. Roles grant no implicit access to every entity. Privileged operations require MFA and audit logs.

## Reviews

Review privileged access at least quarterly and immediately after a role, employment, representative, or ownership change.
