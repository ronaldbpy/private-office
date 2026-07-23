# Private Office System Index

**Version:** 1.1.0 · **Status:** Draft

## Mandatory reading order

1. [MD-000 Constitution](00_MASTER_DOCUMENTS/MD-000_CONSTITUTION.md)
2. [MD-100 Vision & Enterprise Philosophy](00_MASTER_DOCUMENTS/MD-100_VISION_AND_ENTERPRISE_PHILOSOPHY.md)
3. [MD-250 Ubiquitous Language](00_MASTER_DOCUMENTS/MD-250_UBIQUITOUS_LANGUAGE.md)
4. [MD-200 Enterprise Architecture](00_MASTER_DOCUMENTS/MD-200_ENTERPRISE_ARCHITECTURE.md)
5. [MD-300 Canonical Data Model](00_MASTER_DOCUMENTS/MD-300_CANONICAL_DATA_MODEL.md)
6. [MD-500 Software Architecture](00_MASTER_DOCUMENTS/MD-500_SOFTWARE_ARCHITECTURE.md)
7. The relevant FS, data, API, UI/UX, AI, security and test documents.

## Subject-to-source map

| Subject | Governing sources |
|---|---|
| Product purpose and non-negotiables | MD-000, MD-100 |
| Shared business terms | MD-250 |
| Group, ownership and intercompany rules | MD-200, DM-001, FS-003 |
| Canonical entities and history | MD-300, DM-001, DM-002 |
| Product experience and visual behavior | MD-400, UI-001, UI-002, UI-003 |
| Software boundaries and integrations | MD-500, MD-700, API-001 |
| AI behavior and safety | MD-600, AI-001, AI-002 |
| Security and governance | MD-800, SEC-001, SEC-002 |
| Delivery priority | MD-900 |
| Identity, roles and access | FS-005, ADR-004, SEC-001 |
| External contacts (non-users) | FS-004 |
| Calendar, obligations and alerts | FS-017, AI-001 |
| Hosting and infrastructure topology | ADR-003, INF-001 |
| Accounting engine status | ADR-002, ADR-005 |

## Dependency rule

`MD → FS → Data/API/UI/AI/Security → Tests → Deployment`

No downstream document may contradict an upstream document. If a contradiction is necessary, create an ADR, update the controlling document, and revise affected links in the same versioned change.
