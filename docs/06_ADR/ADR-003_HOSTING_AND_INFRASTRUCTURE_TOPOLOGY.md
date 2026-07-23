# ADR-003 — Hosting and Infrastructure Topology

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-23 |
| Decision owner | Ronald Alejandro Barrios Duarte |
| Deciders | Owner |

## Context

MD-500 requires Docker-based deployment for Private Office. INF-001 left the hosting decision explicitly unresolved, pending verification of Bluehost's capabilities. The owner's current Bluehost plan is Shared Hosting, which was confirmed (provider documentation, July 2026) to have no root access and no Docker support — Docker is only available on Bluehost's VPS tier, and even there Bluehost's own support explicitly excludes Docker installation and troubleshooting.

Separately, FS-016 (Vault) requires a document storage location. The owner does not require enterprise-grade infrastructure for this and prefers a familiar, low-friction tool over new object storage infrastructure.

## Decision

1. The existing institutional website (ronaldbarrios.com) **remains on the current Bluehost Shared Hosting plan, unmodified**.
2. **Private Office (application + PostgreSQL database)** is deployed on **Render**, a managed platform supporting Docker deployment, managed PostgreSQL with automated backups, and predictable flat-rate pricing.
3. **Vault documents (FS-016)** are stored in **Google Drive**. Private Office maintains its own lightweight metadata/audit layer over Drive-stored files — uploader, timestamp, entity/party/contract links, content hash, classification — to preserve FS-016 and MD-800 requirements. Public Drive links remain prohibited for Restricted/Confidential documents; all access is mediated through Private Office, never a raw shared link.

## Consequences

- No infrastructure change is required for the existing public website.
- Backups, restoration, and monitoring for the application and database are managed by Render per its service terms. INF-001's reliability baseline should reference Render's managed guarantees rather than a self-managed VPS.
- Vault versioning and access control depend on the custom layer built by Private Office on top of Drive's native capabilities — Drive alone does not satisfy FS-016 without this layer.
- This decision should be revisited if document volume, compliance requirements, or future client-facing Vault needs exceed what Drive plus the custom layer can reasonably support.

## Alternatives considered

- **Bluehost VPS:** rejected — Docker requires self-management with no vendor support for the container layer itself; disproportionate operational burden for a solo-built project.
- **Dedicated object storage (Cloudflare R2 / DigitalOcean Spaces) for Vault:** rejected for now — owner does not require this level of infrastructure given current document sensitivity and volume; may be revisited later without redesigning the canonical Vault data model.

## References

MD-500, INF-001, FS-016, MD-800.
