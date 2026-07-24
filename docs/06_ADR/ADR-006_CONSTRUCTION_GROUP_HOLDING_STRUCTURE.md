# ADR-006 — Construction Group Holding Structure

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-24 |
| Decision owner | Ronald Alejandro Barrios Duarte |
| Deciders | Owner |

## Context

The owner is creating six new legal entities (EAS, Paraguay) that together form a vertically-integrated construction operation:

- +adkb. Arquitectura & Compañía (architecture studio)
- Espace Constructora (general contractor)
- 3:1. Albañilería & Hormigón (heavy works / concrete)
- Luz & Agua Instalaciones (electrical & hydraulic installations)
- Moopa Clean (cleaning, maintenance & finishing)
- arte&pantone (interior design, painting & decoration)

Alexis de Kermenguy is the operating co-founder of all six, at 50%. The owner is the investor side of each, also at 50%. None of the six are incorporated yet — no RUC, no legal address, no contact data exist. The open question was whether the owner's 50% should be held personally (as with Casa Amelia EAS, per DM-001/FS-003) or through Axentia EAS.

These six companies will subcontract each other constantly on the same projects (architecture → build → structural/concrete → installations → finishing → interior design), which is exactly the intercompany relationship pattern described in MD-200.

## Decision

**Axentia EAS holds the owner's 50% in all six new entities.** The owner does not hold these six participations personally.

Rationale:

1. **Liability containment.** Heavy works, structural concrete, and electrical/hydraulic installations carry the group's highest third-party claim and defect risk. Routing ownership through Axentia keeps that exposure inside the holding rather than reaching the owner's personal estate directly.
2. **Intercompany simplicity.** The six entities will invoice, subcontract, and lend to each other constantly on shared projects. A common holding parent simplifies the ownership graph, intercompany elimination, and consolidated reporting required by MD-200.
3. **Succession/governance simplicity.** One holding with six participations is a simpler estate-planning object than six direct personal participations.
4. **Consistency with MD-200/FS-003.** A holding is explicitly modeled as "a legal entity whose primary economic role is ownership and investment" — this is that case.

All six entities are registered now in `pending_incorporation` status with placeholder tax ID, address, and contact data (no RUC exists yet). The 50/50 split (Axentia EAS / Alexis de Kermenguy) is recorded as an `OwnershipInterest` per entity with `verificationState = "unverified"` — the split decision itself is confirmed by the owner, but the underlying legal/documentary fact (constitution, RUC) does not exist yet, so it cannot be marked `verified` per MD-000 principle #3 (evidence and lineage are mandatory).

## Consequences

- The `OwnershipInterest` model required a schema change: `owner` can now be either an `Entity` (e.g., Axentia EAS) or a `Party` (e.g., Alexis de Kermenguy, who has no system login). This aligns the implementation with DM-001, which already stated a Party may play an "owner" role — the original schema only allowed an `Entity` as owner.
- The `Entity` model required a schema change: added `address`, `phone`, `email`, since Private Office previously only tracked contact data for `Party`, not for the group's own legal entities.
- Once each entity is formally incorporated (RUC issued, constitutive act signed), its `Entity.status` moves from `pending_incorporation` to `active`, real `taxId`/`address`/`phone`/`email` replace the placeholders, and both `OwnershipInterest` records move from `unverified` to `verified` with `sourceDocument` pointing to the constitutive act in Vault (FS-016).
- **Open item requiring professional validation before incorporation (per MD-800):** tax treatment in Paraguay of Axentia EAS receiving dividends from six operating EAS it partially owns, versus the owner receiving those dividends personally — must be confirmed with the accountant/counsel before signing the constitutive documents.

## Alternatives considered

- **Owner holds 50% personally in each of the six**, as with Casa Amelia EAS: rejected as the default for this group specifically, because of the liability and intercompany-complexity reasons above. (Note: this remains the correct pattern for one-off, lower-risk participations — it is not being deprecated as a general approach.)

## References

MD-200, MD-000 (#1, #3), FS-003, DM-001, ADR-005 (holding concept precedent via Axentia).
