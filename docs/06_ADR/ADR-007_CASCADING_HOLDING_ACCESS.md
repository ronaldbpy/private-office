# ADR-007 — Cascading Holding Access

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-24 |
| Decision owner | Ronald Alejandro Barrios Duarte |
| Deciders | Owner |

## Context

The group is expanding beyond a handful of manually-registered entities into a holding structure (Axentia EAS + 6 construction-group subsidiaries, per ADR-006) that is expected to keep growing. The owner explicitly asked for the access model to be "totalmente escalable" — new staff, external partners, and a future holding administrator must not require touching every subsidiary's access list by hand.

The original `UserAccess` model (FS-005) grants access strictly per `(clerkUserId, entityId)` pair. This is correct and sufficient for a person tied to one specific company (a manager, an accountant, an assistant). It does not scale for a person who is meant to oversee an entire holding: every time a new subsidiary is added, someone would have to remember to also grant that person access to it.

## Decision

Add a `cascadesToSubsidiaries` boolean to `UserAccess`. When true, the grant is resolved by `lib/access.ts` not just for the entity it was assigned to, but for every entity where that entity appears as `owner` in `OwnershipInterest` — one level deep (holding → direct subsidiaries), not recursive, since the current structure has no multi-level holdings.

This keeps the SEC-001 principle intact ("roles grant no implicit access to every entity") because access is still fully explicit and auditable: there is exactly one `UserAccess` row, its `cascadesToSubsidiaries` flag is visible, and `lib/access.ts` tags every resolved entry with `cascadedFrom` so the UI can always show *why* a person can see a given company — nothing is silently implicit.

Two new roles were added to reflect real relationships rather than reusing generic ones:
- `SOCIO_OPERATIVO` — an operating partner with equity in the business (e.g. Alexis de Kermenguy), distinct from a hired `GERENTE`.
- `ADMINISTRADOR_HOLDING` — the intended role for a future person who administers a holding and, by cascade, its subsidiaries.

`Party.clerkUserId` (nullable, unique) was also added, so that a contact who later gets system access (e.g. Alexis) can be linked to their Clerk identity without duplicating them as a second, disconnected identity. This lets the system eventually resolve "my own ownership" for a logged-in Party-turned-user via their existing `OwnershipInterest` records.

## Consequences

- Ronald's access to the construction-group subsidiaries is now a single cascading grant on Axentia EAS instead of 6 explicit rows. A 7th subsidiary added under Axentia in the future requires zero changes to anyone's access.
- Alexis de Kermenguy does not yet have system access — per FS-005 there is no self-registration; the owner must create his account manually via the Clerk Dashboard and provide the resulting `clerkUserId`. His access, once granted, is **not** cascading (he is not an owner of Axentia — he owns each of the 6 subsidiaries directly), so it remains 6 explicit `SOCIO_OPERATIVO` grants. The seed file (`prisma/seed.ts`, section 8) has the ready-to-uncomment code for this.
- A future holding administrator, once named, needs only one `ADMINISTRADOR_HOLDING` grant on Axentia with `cascadesToSubsidiaries: true` — also scaffolded in the seed file, not executed (no real person named yet — MD-000 principle #1).
- Adding staff ("otros funcionarios") to an individual company remains unchanged and already scalable: a direct `UserAccess` row scoped to that one company, using `GERENTE`, `CONTADOR`, or `ASISTENTE` as appropriate.
- Cascading is one level only. If the group later adds a holding-of-holdings structure, this ADR's mechanism needs revisiting (recursive resolution) — noted here rather than built preemptively.

## Alternatives considered

- **Keep explicit per-entity grants, add them via a script whenever a new subsidiary appears:** rejected — this is exactly the manual-maintenance burden the owner asked to avoid, and it's easy to forget for a company created outside a seed script (i.e. through a future admin UI).
- **Fully derived permissions from the ownership graph (anyone with equity automatically gets access):** rejected — conflates legal ownership with system access; an owner may deliberately not want operational visibility, and an operator may need access without equity. Access must stay a deliberate grant, only its *scope* is what cascades.

## References

FS-005, SEC-001, ADR-006, DM-002 (audit model).
