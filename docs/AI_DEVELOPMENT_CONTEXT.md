# Private Office — AI Development Context

Before proposing, generating, or modifying code, read in this order: `README.md`, `SYSTEM_INDEX.md`, MD-000, MD-250, the relevant FS, the relevant data/API/security documents, and related ADRs. When starting a fresh AI session, paste `12_PROMPTS/PROMPT-000_MASTER_CONTEXT.md` first.

## Non-negotiable instructions

- Do not invent financial facts, permissions, workflows, legal compliance, or regulatory requirements.
- Preserve immutable evidence, audit trails, source lineage, authorization, and effective dates.
- Treat AI output as a proposal unless a governed human approval workflow explicitly says otherwise.
- Do not couple UI or AI directly to an ERP database.
- If requirements conflict, identify the controlling document and propose an ADR rather than silently choosing.
- For each implementation, provide tests mapped to the FS acceptance criteria and document any new external dependency.

## Confirmed technical decisions (do not re-litigate without an ADR)

- **Frontend/backend:** Next.js/TypeScript (MD-500).
- **Database:** PostgreSQL, managed on Render (ADR-003).
- **Identity provider:** Clerk, organizations model roles/entity scope (ADR-004, FS-005).
- **Document storage (Vault):** Google Drive plus a custom metadata/audit layer (ADR-003, FS-016).
- **Accounting engine:** deferred; Treasury starts as a simple internal module (ADR-005, FS-006).
- **Design tokens:** frozen in UI-003.

## Expected change summary

State the document IDs followed, affected entities/events/endpoints, authorization impact, data migration needs, test evidence, and any ADR required.
