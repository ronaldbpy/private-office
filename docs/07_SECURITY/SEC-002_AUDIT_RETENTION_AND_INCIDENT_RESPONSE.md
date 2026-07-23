# SEC-002 — Audit, Retention & Incident Response

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-800, DM-002 |

## Audit requirements

Log successful and denied privileged operations; sensitive reads; document downloads/shares/exports; authentication events; mutations; imports; approvals; configuration; and integration calls. Logs are protected from ordinary modification and searchable by correlation ID.

## Retention

Retention schedules must be approved with Paraguayan tax, accounting, legal, and privacy advisers before production. The system supports legal holds, preventing destruction of selected records. Backup retention is documented separately from business record retention.

## Incident response

Detect → contain → preserve evidence → assess scope → notify accountable owner and required parties → remediate → verify → document post-incident lessons. Credentials or access suspected in compromise are revoked/rotated promptly.
