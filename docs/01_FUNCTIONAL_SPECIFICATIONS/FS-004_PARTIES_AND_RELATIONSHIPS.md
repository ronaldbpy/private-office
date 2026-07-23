# FS-004 — Parties & Relationships

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Owner | Private Office |
| Last updated | 2026-07-23 |
| Depends on | MD-200, MD-250, MD-300, DM-001, SEC-001, FS-003 |

## Purpose

Maintain a registry of external persons and entities (suppliers, clients, external partners, professionals, family members) that relate to the group's companies and personal estate, without granting them any system access, so that documents, payments, invoices, and contracts can be attributed to an identified counterpart per MD-300 and DM-001.

## Scope

Create and manage Party records (non-user), record relationship type and banking data, and link a Party to one or more group entities.

**Excluded:**
- System users with login access — see FS-005.
- Relationships between two external parties (third-party to third-party) — explicitly out of scope by owner decision; the group's operation does not require modeling this.

## Requirements / Decisions

- Parties never authenticate and never receive a role. A Party record exists purely to identify a counterpart in documents, transactions, and contracts.
- **Relationship type** field (extensible list): supplier, client, external partner, attorney/counsel, bank, family member, other.
- A single Party record can be linked to **multiple group entities simultaneously**. Example: one supplier serving both Axentia EAS and Casa Amelia EAS is one record with two links, never two duplicate records.
- **Core data fields:** legal/full name, national ID or RUC, phone, email, address, relationship type, banking details (account number, bank, account type).

## Rules and constraints

- Banking data is classified **Restricted** per SEC-001. A user does not see it automatically just because they have entity access — visibility requires explicit classification handling.
- A Party cannot be deleted if linked to any invoice, payment, or contract; it is archived instead, per the constitutional rule on immutable evidence (MD-000).
- Relationships between two Parties (supplier-to-supplier, etc.) are not modeled in this version.

## Acceptance criteria / Validation

- A Party can be linked to two or more entities without duplicating its record.
- Archiving a Party preserves its historical links to transactions and documents.
- Banking data is not visible to a user by default entity access alone; it must pass the Restricted classification check.

## Open questions

- None outstanding from this session. Revisit if the group later needs to track third-party-to-third-party relationships (e.g., a subcontractor network for the construction/architecture entities).

## Change history

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-23 | Initial draft from working session with the owner. |
