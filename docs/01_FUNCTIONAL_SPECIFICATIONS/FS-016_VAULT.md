# FS-016 — Vault

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Phase | 1 |
| Depends on | MD-300, MD-800, SEC-001, API-004 |

## Purpose

Operate a secure, searchable documentary knowledge layer for invoices, contracts, corporate records, property documents, identity documents, insurance, receipts, and other protected artifacts.

## Required capabilities

- Upload and ingest originals; calculate a content hash and preserve source/provenance.
- Create immutable versions rather than overwriting documents.
- Relate documents to multiple authorized entities (party, company, project, asset, transaction, contract, etc.).
- Record classification, sensitivity, retention/hold state, issuer, document date, expiry, and extracted facts.
- Search permitted document text and metadata; share only through scoped, expiring, auditable grants.

## Rules

- OCR and AI extraction are suggestions until a user or configured verified process validates them.
- Sensitive document classes have restrictive defaults; public links are prohibited for identity, legal, financial, or ownership documents.
- A document's evidence hash and original binary are never modified. Redaction creates a derivative with a relationship to the original.

> **Note (2026-07-23):** per [ADR-003](../06_ADR/ADR-003_HOSTING_AND_INFRASTRUCTURE_TOPOLOGY.md), Vault files are physically stored in Google Drive. Private Office maintains its own metadata/audit layer over Drive-stored files to preserve every rule above; public Drive links remain prohibited for Restricted/Confidential documents, and all access is mediated through Private Office.

## Acceptance criteria

- Every Vault item has at least one accountable scope or is held in a controlled unclassified intake queue.
- Download, preview, export, share, and classification changes are audited.
- Search results never reveal restricted titles, snippets, metadata, or existence to unauthorized users.
