# Private Office Documentation Pack

**Version:** 1.1.0
**Status:** Draft
**Classification:** Confidential
**Owner:** Ronald Alejandro Barrios Duarte

Private Office is the operating system for the Ronald Barrios group: its companies, personal estate, investments, obligations, documents, and decisions. It is not an ERP interface. It is a private experience layered over financial and accounting capabilities.

## How to use this repository

1. Read the Master Documents in `00_MASTER_DOCUMENTS/` before proposing a product, architecture, or data change.
2. Use `SYSTEM_INDEX.md` to identify the controlling documents for a subject.
3. Implement a feature only after its Functional Specification (FS), API, data, security, and test requirements are known.
4. Record consequential technical choices in `06_ADR/`.
5. Update this documentation in the same change set as the implementation.
6. Before starting any AI-assisted session, paste `12_PROMPTS/PROMPT-000_MASTER_CONTEXT.md` first.

## Documentation status

This repository is an editable v1.1 baseline. Files marked **Draft** define the intended direction and require owner review before becoming binding. Files marked **Approved** may only be changed through an ADR and a version update.

## Library map

| Directory | Purpose |
|---|---|
| `00_MASTER_DOCUMENTS` | Constitution, domain, architecture and roadmap |
| `01_FUNCTIONAL_SPECIFICATIONS` | User-facing functional requirements |
| `02_DATA_MODEL` | Canonical business data and persistence guidance |
| `03_API` | API contracts and integration patterns |
| `04_UI_UX` | Design principles, components and interaction standards |
| `05_AI` | Private Office Intelligence (POI) requirements |
| `06_ADR` | Architecture Decision Records |
| `07_SECURITY` | Security, privacy and governance controls |
| `08_INFRASTRUCTURE` | Environments, reliability and operations |
| `09_TESTING` | Quality strategy and acceptance evidence |
| `10_DEPLOYMENT` | Release and production deployment guidance |
| `11_TEMPLATES` | Standard formats for new documents |
| `12_PROMPTS` | Context packs for AI-assisted work |

## Working conventions

- Markdown is the canonical editable format; exports (PDF/TXT) are derived artifacts.
- Document IDs never change or get reused.
- Dates use ISO 8601 (`YYYY-MM-DD`). Monetary amounts always carry a currency.
- "Must" is mandatory; "should" is a preferred default; "may" is optional.
- A document may link to supporting files, but must retain a concise standalone purpose and scope.

See [SYSTEM_INDEX.md](SYSTEM_INDEX.md) for the reading order and [CHANGELOG.md](CHANGELOG.md) for release history.
