# Bulletproof Tracker Architecture — Comprehensive Design

**Date:** 2026-08-10  
**Objective:** Make Tracker v6 infalible: zero data loss, no user errors, graceful failures, race-condition proof  
**Scope:** Layered architecture redesign across 5 layers + concurrency safeguards

---

## Overview

Current tracker is functional but lacks robustness. This design adds comprehensive guarantees:

1. **Data Layer:** Persistent, syncs eventually, handles offline
2. **Validation Layer:** All input validated, prevents bad data
3. **Error Layer:** All errors caught, logged, user-recoverable
4. **UI Layer:** Real-time status feedback, offline transparency
5. **Concurrency:** Mutation locking, version control, optimistic UI

---

## Layer 1: Data Layer (Persistence + Sync)

**Purpose:** Guarantee zero data loss. All state changes persist immediately.

**Components:**
- `DataStore` class: Single source of truth (replaces current `state`)
- `PersistenceEngine`: Dual-backup (localStorage + IndexedDB)
- `SyncQueue`: Queue pending server syncs (offline-first)
- `ConflictResolver`: Merge stale client + server edits

**Data Flow:**
1. User saves → DataStore validates schema → PersistenceEngine writes both stores
2. Network available? → SyncQueue flushes to server
3. Network offline? → SyncQueue holds, auto-retries on reconnect
4. Server responds with conflict? → ConflictResolver merges (last-write-wins)

**Key Features:**
- Dual storage: localStorage (instant) + IndexedDB (reliable, larger quota)
- Auto-retry: Exponential backoff on network failure (5s, 10s, 30s, ...)
- Offline queue: Up to 1000 pending operations
- Conflict resolution: Client version + server version compared, latest wins
- Recovery: On crash, incomplete transactions replay on reload

**Success Criteria:**
- No data lost on network failure, power loss, or browser crash
- Data syncs within 30s of network restoration
- Offline edits merge without user intervention

---

## Layer 2: Validation Layer (Input Guard)

**Purpose:** Prevent invalid data from entering system. All user input validated before save.

**Components:**
- `InputValidator`: Type checking (weight=number, date=valid)
- `BusinessRuleValidator`: Domain logic enforcement
- `SchemaValidator`: Required fields, correct shape

**Validation Rules:**

| Field | Rule | Message |
|-------|------|---------|
| Weight | 30 ≤ kg ≤ 200 | "Weight must be 30-200 kg" |
| Date | date ≤ today() | "Can't log future dates" |
| Dose | 0 < mg ≤ 500 | "Dose must be 1-500 mg" |
| Macros | ±50 kcal of target | "Macros off by {diff} kcal" |
| Medication | name + time required | "Select medication and time" |
| Time | HH:MM format | "Invalid time format" |

**Error Handling:**
- On fail: Show field-level error, prevent save, highlight input
- UI shows red border + tooltip message
- Save button disabled until fixed
- User can edit + retry immediately

**Success Criteria:**
- 100% of invalid inputs rejected with clear message
- No invalid data reaches database
- User never sees cryptic errors

---

## Layer 3: Error Layer (Recovery + Fallbacks)

**Purpose:** App never crashes. All errors caught, logged, user-informed with recovery path.

**Components:**
- `ErrorBoundary`: Global try/catch wrapper
- `ErrorLogger`: Records to localStorage + server (for debugging)
- `ErrorRecovery`: Strategies per error type
- `Notifications`: User-facing messages

**Error Strategies:**

| Error | Strategy | User Sees |
|-------|----------|-----------|
| Network timeout | Queue sync, retry on reconnect | "Saving offline" banner |
| Validation fail | Reject input, show field error | Red input + message |
| Storage full | Clean old records, retry | "Storage cleaned, try again" |
| Concurrent edit | Show conflict dialog | "Someone edited this, reload?" |
| Unknown error | Log, show generic message | "Oops. Try again or contact support" |

**Recovery on Crash:**
1. On reload, check localStorage for incomplete transactions
2. Replay pending saves
3. Show notification: "Your data was recovered"

**Logging:**
- All errors stored in `errors` IndexedDB table
- Sent to server daily (separate from main data sync)
- Includes: error message, stack, user action, timestamp

**Success Criteria:**
- Zero unhandled exceptions visible to user
- 100% of errors logged + retrievable
- Users never stuck after error (always path to recovery)

---

## Layer 4: UI Layer (Status + Offline Handling)

**Purpose:** User always knows app state. Clear feedback on all outcomes.

**Components:**
- `StatusBar`: Connection status + sync progress
- `FieldErrors`: Inline validation messages
- `Toast Notifications`: Quick feedback (saved/error/retrying)
- `OfflineIndicator`: Prominent offline banner
- `UndoStack`: Reversible actions (undo/redo buttons)

**User-Visible States:**

| State | Visual | Example |
|-------|--------|---------|
| Saving | Spinner | "Syncing..." |
| Saved | Checkmark | "✓ Saved" (fade 2s) |
| Error | Red icon | "✗ Network error. Retry?" |
| Offline | Yellow banner | "📵 Offline. Changes save when back online" |
| Conflict | Dialog | "Server changed this. Keep yours or reload?" |
| Undo available | Button active | "↶ Undo (Ctrl+Z)" |

**Keyboard Shortcuts:**
- `Ctrl+Z` / `Cmd+Z`: Undo last action
- `Ctrl+Shift+Z` / `Cmd+Shift+Z`: Redo

**Success Criteria:**
- Users never confused about connection status
- Offline is transparent (changes sync when back)
- All errors have clear next-step button
- Undo/redo work reliably

---

## Layer 5: Integration + Concurrency

**Purpose:** Layers coordinate cleanly. No race conditions. Predictable under stress.

**Flow Diagram:**
```
User Input
   ↓
UI: Show spinner
   ↓
Validation: Check input
   ├─ Invalid? → Show error, stop
   └─ Valid? → Continue
   ↓
DataStore: Validate schema
   ├─ Reject? → Error layer, show message
   └─ Accept? → Continue
   ↓
PersistenceEngine: Write localStorage + IndexedDB
   ├─ Fail? → Error layer, retry
   └─ Success? → Continue
   ↓
SyncQueue: Enqueue for server
   ├─ Offline? → Hold, retry on reconnect
   └─ Online? → Send now
   ↓
UI: Show checkmark "Saved" (fade 2s)
```

**Concurrency Safeguards:**
- **Mutation lock:** Only one save at a time (queue rapid clicks)
- **Version control:** Each record has version number, detect stale edits
- **Optimistic UI:** Show change immediately, revert if server rejects
- **Sync deduplication:** If same record queued twice, merge into one request

**Race Condition Scenarios:**
- User clicks "Save" twice rapidly → Queued, not double-saved
- User edits while offline, server changes meanwhile → ConflictResolver merges
- User rapid-fires date changes → Last one wins, queued once
- Network drops mid-sync → Retries automatically

**Success Criteria:**
- Rapid clicking doesn't corrupt data
- Offline + online edits merge without loss
- No duplicate operations in sync queue
- Stale client edits don't overwrite server

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    UI LAYER                         │
│  Status bar, Error messages, Offline indicator      │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              VALIDATION LAYER                       │
│  Type check, Business rules, Schema validation      │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│               ERROR LAYER                           │
│  Try/catch, Error logging, Recovery strategies      │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              DATA LAYER                             │
│  DataStore → PersistenceEngine → SyncQueue          │
│  (localStorage + IndexedDB + Server)                │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    localStorage        IndexedDB (backup)
        │                     │
        └──────────┬──────────┘
                   │
              Server API
```

---

## File Structure

```
/tracker/
├── tracker-v6.html (UI + render)
├── tracker-layers/
│   ├── data-layer.js (DataStore, PersistenceEngine, SyncQueue)
│   ├── validation-layer.js (InputValidator, BusinessRuleValidator)
│   ├── error-layer.js (ErrorBoundary, ErrorLogger, ErrorRecovery)
│   ├── ui-layer.js (StatusBar, Toast, OfflineIndicator)
│   └── concurrency.js (Mutation lock, Version control, Dedup)
├── tests/
│   ├── data-layer.test.js
│   ├── validation-layer.test.js
│   ├── error-layer.test.js
│   └── concurrency.test.js
```

---

## Testing Strategy

| Layer | Tests | Success Criteria |
|-------|-------|------------------|
| Data | Offline saves, sync queue, conflict resolution | Data never lost |
| Validation | All rules + edge cases | 100% invalid inputs rejected |
| Error | Crash recovery, error logging, retry logic | All errors recoverable |
| UI | Status updates, offline transparency, undo/redo | User always knows state |
| Concurrency | Race conditions, rapid clicks, stale edits | No data corruption |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Data loss incidents | 0 per 1000 users |
| Sync latency (online) | < 5 seconds |
| Invalid data in DB | 0% |
| Unhandled errors | 0 |
| User recovery time | < 30 seconds |
| Offline transparency | 100% (user unaware) |

---

## Implementation Phases

**Phase 1:** Data Layer (persistence + sync)  
**Phase 2:** Validation Layer (input guard)  
**Phase 3:** Error Layer (recovery)  
**Phase 4:** UI Layer (status feedback)  
**Phase 5:** Concurrency (locks, versions, dedup)  
**Phase 6:** Testing (comprehensive suite)

---

## Notes

- No breaking changes to current tracker-v6.html
- Layers added incrementally, one at a time
- Each layer independently testable
- Backward compatible with existing data

