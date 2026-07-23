# ADR-001 — Documentation as the Source of Truth

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-22 |
| Decision owner | Ronald Alejandro Barrios Duarte |

## Context

Private Office will be developed over time by different people and AI tools. Conversation history and code alone cannot retain the full business rationale.

## Decision

The versioned Documentation Pack is the source of truth for intended product behavior and architectural decisions. Markdown is canonical; PDF/TXT exports are derived. Code must reference document IDs in pull requests and change descriptions.

## Consequences

Documentation work becomes part of delivery. Conflicts are resolved by updating a controlling MD or ADR before implementation, not by silently diverging code.
