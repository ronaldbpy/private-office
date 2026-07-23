# FS-019 — Private Office Intelligence

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Phase | 6 |
| Depends on | MD-600, MD-800, AI-001, AI-002 |

## Purpose

Enable evidence-bound natural-language assistance, recurring executive briefs, classification proposals, anomaly detection, and scenarios for authorized users.

## Output contract

Every material answer must identify: user scope; reporting period; entities/accounts included; data freshness; source links; calculation or assumptions; confidence; and whether the statement is fact, interpretation, forecast, or recommendation.

## Prohibited autonomous actions

POI cannot execute payments, create/approve accounting records, modify ownership, sign contracts, transmit tax filings, grant access, or change source documents. It may prepare a reviewed draft or a proposal with explicit human approval steps.

## Acceptance criteria

- A restricted user cannot infer protected data through the question, answer, sources, or aggregate result.
- An answer with insufficient source data says so plainly rather than filling gaps.
- Recommendations identify key risks and alternatives rather than presenting a single action as fact.
