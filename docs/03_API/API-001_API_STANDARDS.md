# API-001 — API Standards

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-500, MD-700, MD-800 |

## Contract rules

- REST endpoints are versioned under `/api/v1` and described in OpenAPI.
- All requests carry authenticated principal and resolved group scope; client-supplied scopes never override authorization.
- Mutating operations accept an idempotency key; server responses return a correlation ID.
- Errors use a stable problem-details schema with a safe human message and a machine code.
- Lists use cursor pagination, explicit sort, filtering, and bounded page sizes.
- Timestamps are RFC 3339 UTC; user-local rendering occurs in clients.
- APIs return canonical UUIDs and source references, not vendor-dependent keys as primary identifiers.

## Example resource shape

```json
{
  "id": "uuid",
  "status": "active",
  "createdAt": "2026-07-22T00:00:00Z",
  "updatedAt": "2026-07-22T00:00:00Z",
  "links": [{"type": "document", "id": "uuid"}],
  "sourceRefs": [{"system": "erp", "externalId": "..."}]
}
```

## Security

Authorization is enforced server-side per action and record. Exports, shares, and privileged reads are audited. Integration credentials are scoped, rotated, and never exposed in API responses.
