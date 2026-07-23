# ADR-004 — Identity Provider Selection

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-23 |
| Decision owner | Ronald Alejandro Barrios Duarte |
| Deciders | Owner |

## Context

FS-005 requires manual user provisioning, role plus entity-scoped access, mandatory MFA for privileged roles, and audit of access changes. MD-500 specifies a Next.js/TypeScript frontend. The system is built solo by the owner with AI assistance, and expects a small number of users (single digits to low tens) for the foreseeable future.

## Decision

Adopt **Clerk** as the identity and access management provider for Private Office authentication, session management, MFA, and organization-scoped access.

Each legal entity (and the owner's personal profile) is modeled as a Clerk Organization. Role and entity assignment for each user are configured through Clerk Organization membership plus a custom role attribute, enforced server-side at the Private Office API layer — no frontend or AI component trusts client-side claims for authorization, per MD-700.

## Consequences

- Authentication and MFA implementation effort is minimized; Clerk provides prebuilt components compatible with Next.js.
- The free tier (up to 50,000 monthly retained users) comfortably covers current and foreseeable scale at no cost.
- A vendor dependency on Clerk is introduced; Clerk has no self-hosted option. This is acceptable under MD-000's "technology is replaceable" principle, because Clerk is treated strictly as an authentication adapter — canonical user, role, and entity records remain owned by Private Office's own data model (DM-001), not by Clerk.
- Domain-level authorization (SEC-001's role + entity scope + classification + action formula) is enforced server-side in the Private Office API, never trusted solely from Clerk session claims.

## Alternatives considered

- **Auth0:** rejected — heavier configuration model and pricing tuned for larger organizations; unnecessary complexity and cost for current scale.
- **Self-hosted (Better Auth / Auth.js):** rejected — for a solo owner-maintained project protecting sensitive financial data, the added security and maintenance burden of self-hosting auth, with no built-in organization/role management, outweighs the benefit of avoiding vendor dependency.

## References

MD-500, MD-700, MD-800, FS-005, SEC-001.
