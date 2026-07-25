# ADR-008 — Custom Access Table Instead of Clerk Organizations

| Field | Value |
|---|---|
| Status | Accepted (documents an existing deviation, not a new proposal) |
| Date | 2026-07-25 |
| Decision owner | Ronald Alejandro Barrios Duarte |
| Deciders | Owner (retroactive documentation — see Context) |

## Context

FS-005 (Identity, Roles & Access) states: "Each legal entity and the
personal profile is modeled as a Clerk Organization. Role and entity
assignment are enforced at the Private Office API layer, not trusted solely
from client-side claims."

The actual implementation, already in place before this ADR was written,
does **not** use Clerk Organizations. Instead, it uses a custom `UserAccess`
table (`clerkUserId`, `role`, `entityId`, `cascadesToSubsidiaries`) resolved
server-side in `lib/access.ts`, with a single flat Clerk user identity (no
Clerk Organization membership involved at all). This ADR documents that
deviation per ADR-001's rule that code must not silently diverge from the
governing documents — a contradiction between spec and implementation was
found on 2026-07-25 while reviewing FS-005 against the codebase, and is
recorded here rather than silently left unresolved.

## Decision

**Keep the custom `UserAccess` table as the access model going forward.**
Do not retrofit Clerk Organizations. FS-005 should be revised in a future
documentation pass to describe the `UserAccess` model instead of Clerk
Organizations.

Rationale for keeping the custom table rather than migrating to Clerk
Organizations at this point:

1. **Already working and tested.** The current model supports per-entity
   roles, multiple concurrent Contador-type users with different entity
   sets, and — since ADR-007 — cascading holding access, all of which are
   FS-005's actual functional requirements. Clerk Organizations would need
   to reproduce this same logic on top of Clerk's own membership model,
   for no clear functional gain at the current scale (single owner, small
   number of entities).
2. **Migration risk.** Clerk Organizations carry their own membership,
   invitation, and role primitives that would need to be reconciled with
   the existing `UserAccess`/`AccessChangeLog`/cascading-access logic.
   Doing this without a concrete driver (e.g. an actual need Clerk Orgs
   solve that the current model can't) would be risk for its own sake.
3. **SEC-001's authorization formula is already satisfied** ("role + group
   membership + entity scope + object classification + action + contextual
   policy") by the current server-side resolution in `lib/access.ts` —
   Clerk Organizations were a proposed *mechanism*, not a requirement in
   themselves.

## Consequences

- FS-005 needs a documentation update (out of scope for this ADR itself) to
  describe the `UserAccess` table model instead of Clerk Organizations, so
  the spec matches reality. Until that edit happens, this ADR is the
  authoritative note that the deviation is deliberate, not an oversight.
- Any future feature that assumes Clerk Organization membership (e.g. an
  out-of-the-box Clerk "org switcher" UI component) is not directly usable
  without adaptation.
- If the group's structure grows enough that Clerk Organizations' built-in
  invitation/membership UX becomes genuinely valuable (e.g. many concurrent
  external users self-managing their own org membership), this decision
  should be revisited with a fresh ADR at that time — not before.

## Open item

**MFA enforcement** (FS-005: "MFA is mandatory for Owner and Contador") is a
Clerk Dashboard configuration, not something set in this codebase. Not
verified as part of this ADR — the owner should confirm it's actually
configured in the Clerk Dashboard for the relevant roles.

## References

FS-005, ADR-004 (identity provider selection), ADR-007 (cascading holding
access, built on top of the custom `UserAccess` table this ADR keeps),
SEC-001.
