# FS-005 — Identity, Roles & Access

| Field | Value |
|---|---|
| Version | 1.1.0 |
| Status | Draft |
| Owner | Private Office |
| Last updated | 2026-07-25 |
| Depends on | MD-200, MD-250, MD-300, MD-800, SEC-001, FS-003, ADR-004 |

## Purpose

Define how users authenticate into Private Office and how access to group entities is scoped, so that FS-001, FS-003, FS-006, FS-016 and all future functional specifications can enforce permission-filtered data as required by MD-100 and MD-800.

## Scope

Covers roles, manual user provisioning, entity-scoped access assignment, MFA policy, and audit of access changes. Excludes external parties who never receive system access (see FS-004).

## Requirements / Decisions

- **Roles:** Owner, Contador, Asistente, Gerente, and (since ADR-007)
  Socio Operativo and Administrador Holding. Gerente is currently defined
  only for Casa Amelia EAS; it is a full-access role scoped to that single
  entity. Socio Operativo is for an equity-holding operating partner
  without holding-wide administrative scope; Administrador Holding is for
  a person who administers a holding and, by cascade, its subsidiaries.
- **Access model:** every user has exactly one role plus an explicit list of assigned entities (legal entities and/or the owner's personal profile). A user sees only data belonging to assigned entities.
- **Multiple Contador users:** the system supports several concurrent Contador users, each with a distinct set of assigned entities, as the group grows and different companies may use different accountants.
- **Provisioning:** manual only. No self-registration. Only the Owner can create a user, set their role, and assign their entities, through system administration.
- **Identity provider:** Clerk (see ADR-004). Access is scoped through a
  custom `UserAccess` table (`clerkUserId`, `role`, `entityId`) resolved
  server-side, **not** through Clerk Organizations — see ADR-008 for why
  this deviates from the originally-drafted approach. Role and entity
  assignment are enforced at the Private Office API layer, not trusted
  solely from client-side claims.
- **Cascading access (see ADR-007):** a user's access grant on a holding
  entity can automatically extend to every entity that holding owns
  (`OwnershipInterest`), one level deep. This is additive to the base model
  above, not a replacement for explicit per-entity grants.

## Rules and constraints

- MFA is mandatory for Owner and Contador. Optional for Asistente and Gerente at this stage; may be promoted to mandatory later via a version change to this document.
- A user with no assigned entities sees an empty state, never an error and never another user's data.
- Every change to a user's role or entity assignment is recorded in the audit log with actor, timestamp, and before/after state (per DM-002).
- Revoking a user's access does not erase the audit trail of actions taken while that access was active.
- Effective permission for any read or write follows the SEC-001 formula: role + group membership + entity scope + object classification + action + contextual policy.
- Privileged access (Owner, Contador) is reviewed at least quarterly, and immediately after any role or representative change, per SEC-001.

## Acceptance criteria / Validation

- A Contador assigned only to Axentia EAS cannot see any Casa Amelia EAS data in any dashboard, report, search result, alert, or export.
- Only the Owner can create users, assign roles, and assign entities.
- Every access change (role or entity scope) is audited with actor, timestamp, and change detail.
- A user without MFA cannot access privileged actions if their role requires it.

## Open questions

- Should future entities (constructora, arquitectura, terminación de obras) get their own Gerente-type full-access role, or a narrower variant? To be decided when those entities are created.
- MFA method preference (authenticator app vs. passkey) not yet chosen; defaults to Clerk's supported methods pending owner preference.

## Change history

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-23 | Initial draft from working session with the owner. |
| 1.1.0 | 2026-07-25 | Reconciled with actual implementation: access model is a custom `UserAccess` table, not Clerk Organizations (ADR-008); added Socio Operativo and Administrador Holding roles and cascading access (ADR-007). |
