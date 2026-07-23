# MD-200 — Enterprise Architecture

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-000, MD-100, MD-250 |

## Purpose

Define how the group exists economically and legally. This is a domain architecture, not a technology design.

## Core structure

```text
Economic owner(s)
  └─ Group
      ├─ Legal entities / holdings
      │   ├─ financial accounts, assets, liabilities, contracts
      │   └─ accounting and tax obligations
      ├─ Projects (may span one or more entities)
      ├─ Personal estate
      └─ Investments and ownership interests
```

## Entity rules

- A **Group** is the private administrative boundary and can contain people, entities, projects, assets, and relationships.
- A **legal entity** has legal identity, jurisdiction, tax registration, governance, accounts, obligations, documents, and lifecycle state.
- A **holding** is a legal entity whose primary economic role is ownership and investment; it remains an entity, not a separate primitive.
- A **project** is an economic initiative that may involve many entities, people, documents, investments, and cost/profit centers.
- **Ownership interests** are dated relationships, never a static percentage field on a company. They support direct and indirect ownership analysis.
- **Intercompany relationships** include loans, invoices, capital contributions, dividends, guarantees, and transfers. Each must retain the counterparties, agreement, terms, evidence, and accounting treatment.

## Accounting and consolidation

Private Office maintains the economic relationship graph. The accounting engine records formal ledgers per legal entity. Consolidated views must disclose their scope, period, currency policy, ownership method, and intercompany elimination status; they cannot be presented as statutory statements unless validated by the accountant.

## Growth rules

New entities, partners, countries, currencies, and structures are additive. Historical ownership, control, and financing periods are immutable records; corrections create successor records.
