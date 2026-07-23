# AI-002 — POI Retrieval & Memory

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-300, MD-600, AI-001 |

## Retrieval

POI uses governed retrieval services, not direct database access. Retrieval applies group, entity, document-classification, role, and record-level authorization before content is sent to any model provider. Material answers retain source IDs and data freshness.

## Memory

Allowed: user preferences, preferred reporting scope, saved explanations, approved naming, and explicitly saved decisions. Prohibited as fact: unverified chat statements, model-generated assumptions, and any content outside the permitted scope.

Memory records are inspectable, editable, scope-bound, and have retention rules. Deleting memory does not remove mandatory audit evidence.
