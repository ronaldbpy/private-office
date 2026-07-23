# MD-800 — Security, Privacy & Governance

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-000, MD-500 |

## Security posture

Private Office handles highly sensitive personal, financial, legal, and corporate records. Security is a product property, beginning with least privilege, strong identity, protected data, immutable evidence, resilient backups, and verifiable operations.

## Mandatory controls

- Role- and attribute-based access scoped by group, entity, relationship, document classification, and action.
- MFA for privileged roles; passkeys preferred when available.
- Encryption in transit and at rest; secrets managed outside source control.
- Append-only audit trail for sensitive reads, changes, exports, sharing, approvals, imports, and privileged actions.
- Versioned documents; controlled retention, archival and legal holds.
- Encrypted, tested backups stored separately from production.
- Security event monitoring, incident response, vulnerability remediation, and access review.

## Governance

Every material architecture or policy decision receives an ADR. Every release carries test evidence and an accountable owner. Local tax, accounting, labor, privacy, and e-invoicing requirements must be validated with qualified Paraguay-based professionals before production reliance.

See [SEC-001](../07_SECURITY/SEC-001_ACCESS_CONTROL_AND_DATA_CLASSIFICATION.md) and [SEC-002](../07_SECURITY/SEC-002_AUDIT_RETENTION_AND_INCIDENT_RESPONSE.md).
