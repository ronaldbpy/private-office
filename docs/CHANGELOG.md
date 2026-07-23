# Changelog

All notable changes to the Private Office Documentation Pack are recorded here.

## [1.1.0] - 2026-07-23

### Added

- FS-004 — Parties & Relationships (expanded from Planned to Draft).
- FS-005 — Identity, Roles & Access (expanded from Planned to Draft).
- FS-017 — Calendar, Tasks & Alerts (expanded from Planned to Draft), including real tax obligation data for Axentia EAS, Casa Amelia EAS, and the owner's personal RUC.
- ADR-003 — Hosting and Infrastructure Topology (Accepted).
- ADR-004 — Identity Provider Selection (Accepted).
- ADR-005 — Accounting Engine Deferral (Accepted, references ADR-002).
- UI-003 — Design Tokens (Draft), freezing the color and typography specification MD-400 left open.
- 12_PROMPTS/PROMPT-000 — Master Context, the first AI context pack for the project.
- Local project scaffold started at `~/Documents/private-office` on the owner's machine, ahead of deployment to Render.

### Notes

- These changes resolve the identity/access, external-party, hosting, accounting-engine, and design-token gaps identified as blockers to Phase 0/1 delivery.
- ADR-002 remains Proposed as originally written; ADR-005 formally accepts its principle while deferring the accounting engine selection itself.

## [1.0.0] - 2026-07-22

### Added

- Repository governance, conventions, templates and system index.
- Master Documents MD-000 through MD-900.
- The initial catalog and first core functional specifications.
- Initial canonical data, API, UI/UX, AI, security, infrastructure, testing, deployment and ADR libraries.

### Notes

- This is the first editable baseline. It deliberately separates stable principles from product decisions that require validation with the owner, accountant, legal counsel, and hosting provider.

## Versioning policy

- Patch: clarification without a change in scope or contract.
- Minor: additive, compatible documentation or requirements.
- Major: a changed governing principle, domain model, or external contract.
