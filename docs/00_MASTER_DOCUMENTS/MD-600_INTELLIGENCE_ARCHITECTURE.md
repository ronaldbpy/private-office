# MD-600 — Intelligence Architecture

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Depends on | MD-000, MD-300, MD-800 |

## Purpose

Private Office Intelligence (POI) is a decision-support capability, not a generic chatbot. It transforms authorized facts into explainable briefs, searches, classifications, forecasts, and scenarios.

## Operating principles

- POI uses only data the requesting user is authorized to access.
- Every material answer identifies its period, entity scope, data freshness, assumptions, and source links.
- POI distinguishes fact, calculation, inference, and recommendation.
- POI cannot create accounting entries, change legal ownership, execute payments, sign, transmit official filings, or delete records without a separately approved workflow and accountable human approval.
- No provider dependency is allowed at the domain layer; model providers are adapters.

## Capability maturity

1. Retrieval and explanation of authorized records.
2. Document extraction and proposed classification.
3. Monitoring, alerts, variance detection and scheduled executive summaries.
4. Forecasting and scenario analysis with stated assumptions.
5. Guided multi-step work under explicit approval gates.

## Memory

POI may retain user-approved preferences, approved terminology, saved analytical context, and decisions. It must not treat unverified chat content as financial fact. Memory is scope-bound, inspectable, editable, and deletable subject to audit obligations.
