# FS-001 — Today Dashboard

| Field | Value |
|---|---|
| Version | 1.0.0 |
| Status | Draft |
| Phase | 1 — Private Office Core |
| Depends on | MD-100, MD-400, FS-002, FS-003, FS-006, FS-016, FS-017 |

## Purpose

Give an authorized user an accurate, calm briefing of what requires attention today. It is not a generic analytics dashboard or a substitute for accounting reports.

## Actors

Economic Owner, delegated Director, Administrator, Accountant, and Assistant. The content is permission-filtered; no aggregate may reveal restricted entity data.

## Required sections

1. **Briefing:** greeting, current date/timezone, next relevant task or event.
2. **Estate and liquidity:** authorized consolidated position, freshness timestamp, currency basis, and link to underlying scope.
3. **Attention queue:** due obligations, exceptions, approvals, missing evidence, and alerts sorted by severity and due date.
4. **Agenda:** today, next seven days, and financial/legal deadlines.
5. **Insights:** up to five evidence-linked POI insights, each labeled as observation, forecast, or recommendation.
6. **Recent activity:** timeline events the user may view.
7. **Quick actions:** upload document, record a task, begin financial import, create a project, and search; availability depends on permission.

## Business rules

- Every figure displays its period, scope, currency and freshness. "Consolidated" also displays whether intercompany eliminations were applied.
- When a section has insufficient trustworthy data, display the gap and a route to resolve it; never fabricate a zero balance.
- Alerts use severity (`critical`, `high`, `normal`, `informational`) and remain visible until resolved, expired, or dismissed with a reason.
- The dashboard is read-optimized. Material changes navigate to a controlled workflow.

## Acceptance criteria

- A user never receives a number, document title, or alert from a scope they cannot access.
- Selecting a material KPI reveals its source records or explicitly states why a drill-down is unavailable.
- The default view is usable on a 390px-wide viewport and a desktop viewport.
- All rendered data carries a successful or failed freshness state.
