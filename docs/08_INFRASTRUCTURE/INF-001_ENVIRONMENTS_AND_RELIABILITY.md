# INF-001 — Environments & Reliability

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-500, MD-800 |

## Environments

Development, staging, and production are isolated. Production data is never copied to development without documented minimization, sanitization, authorization, and expiration. Secrets and integrations are unique per environment.

## Reliability baseline

- Containerized, reproducible application deployment.
- Monitored health checks, logs, metrics, error tracking, and alert routing.
- Automated encrypted backups with restoration tests.
- Recovery objectives (RPO/RTO) agreed before production finance use.
- Capacity, patching, dependency, and certificate ownership assigned to named operators.

## Hosting decision

> **Resolved 2026-07-23** — see [ADR-003](../06_ADR/ADR-003_HOSTING_AND_INFRASTRUCTURE_TOPOLOGY.md). Bluehost Shared Hosting (the owner's current plan) does not support Docker or root access; it remains in place only for the existing institutional website. Private Office (application + database) is deployed on Render, whose managed platform satisfies the reliability baseline above (managed backups, monitored health, reproducible Docker deployment) without requiring the owner to self-manage a VPS.

~~Bluehost capabilities must be verified against the chosen architecture: root access, Docker support, persistent storage, backups, network controls, monitoring, database support, and support boundaries. A VPS or managed cloud environment may be required; no hosting assumption is approved yet.~~ *(superseded by ADR-003)*
