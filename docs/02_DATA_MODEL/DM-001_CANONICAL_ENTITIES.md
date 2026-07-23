# DM-001 — Canonical Entities

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-250, MD-300 |

## Entity families

| Family | Core entities | Notes |
|---|---|---|
| Identity | Group, Party, Person, LegalEntity, User, Role | A party may play customer, supplier, employee, owner, or counterparty roles. |
| Structure | OwnershipInterest, GovernanceRole, IntercompanyRelationship | Effective-dated and evidence-linked. |
| Economy | Project, Asset, Liability, Investment, Loan, Contract | Each has owner/counterparties and lifecycle. |
| Treasury | FinancialAccount, Statement, Movement, Reconciliation, Transaction | Source import and enriched classification are separate. |
| Knowledge | Document, DocumentVersion, Extraction, Tag, Relationship | Vault stores originals and links. |
| Control | Task, CalendarItem, Alert, Insight, Decision, Event, AuditEntry | Supports work and explanation. |

## Required identity fields

`id` (UUID), `group_id`, `status`, `created_at`, `created_by`, `updated_at`, `updated_by`, and `source_refs` are baseline fields. Domain records additionally store legal/effective dates where relevant. IDs must not encode business meaning.

## Monetary value object

Money is `{ amount, currency }` with decimal precision appropriate for the currency. Derived valuations include `{ valuation_date, rate_source, base_currency, method }`. Never store a bare number as money.
