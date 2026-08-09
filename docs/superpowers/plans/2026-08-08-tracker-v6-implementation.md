# Tracker v6.0 Implementation Plan — Elite Protocol Mobile-First

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Tracker v6.0 with phase-driven nutrition tracking, meal builder, peptide logging, weight trends, and mobile-optimized UI for iPhone.

**Architecture:** Hybrid data model separating protocol definitions (Anabolismo/Retatrutida/Purga) from daily records. Full-screen modals for data entry. Dynamic dashboard hero + cards that adapt to selected phase. Vanilla JS with inline SVG charts. PWA support retained.

**Tech Stack:** HTML5, Vanilla JavaScript, CSS Grid/Flexbox, localStorage JSON, SVG inline charts, Service Worker v3.

## Global Constraints

- Mobile-first: 375px viewport base, all UI responsive to 768px+
- Single HTML file (tracker-v6.html, ~65KB max)
- Vanilla JS only — no React, no external CDN dependencies (local fonts, inline SVG, data)
- Data persistence: localStorage key `rb_tracker_v6` with backward-compatible export/import from v5
- 34 food database (alimentos_crudo_cocido_macros.json embedded)
- 12 meal templates (D1-3, P1-5, Po1-4) + 4 desserts with exact macros
- 3 phase protocols: Anabolismo (P:230g C:250g G:80g), Retatrutida (P:200g C:150g G:70g), Purga (P:200g C:80g G:70g)
- Peptides: PT-141, CJC, MOTS-C, GHK + 17 optional
- Historical data: 111 Zepp measurements (weight 99.7kg → 88.15kg tracked)
- Export format: JSON compatible with v5.4 Import
- PWA: manifest.json + tracker-sw.js cache v3 (no changes needed)

---

## Task List

- [ ] Task 1: Data Schema & Embedded Databases
- [ ] Task 2: CSS & Layout Structure
- [ ] Task 3: Util Functions & Helpers
- [ ] Task 4: Meal Builder Modal
- [ ] Task 5: Modals for Peptides & Check-in
- [ ] Task 6: Dashboard Hero & Quick Actions
- [ ] Task 7: Analytics View with Charts
- [ ] Task 8: Main Render Loop & Event Handlers
- [ ] Task 9: Phase Selector & Settings View
- [ ] Task 10: Migration & Testing
- [ ] Task 11: PWA & Deployment

---

## Task 1: Data Schema & Embedded Databases

**Files:**
- Create: `app/public/tracker-v6.html` (skeleton + data layer only)
- Test: Browser DevTools console: verify `window.FOOD_DB`, `window.PROTOCOLS`, `window.MEAL_TEMPLATES`

**Interfaces:**
- Produces: 
  - `window.FOOD_DB` — array of 34 foods with `{id, nombre, categoria, factor_cocido_sobre_crudo, crudo_100g{kcal,prot,carb,grasa}, cocido_100g{...}}`
  - `window.PROTOCOLS` — object with keys `'Anabolismo'`, `'Retatrutida'`, `'Purga'` containing `{targets: {protein, carbs, fat, calories}, description}`
  - `window.MEAL_TEMPLATES` — array of 12 meals (D1-3, P1-5, Po1-4) with `{id, name, items:[{foodId, gramos_crudo}], totals{prot, carb, fat, kcal}}`
  - `window.PEPTIDES_DB` — array of 21 peptides with `{id, nombre, default_dose, default_frequency, notes}`
  - `state` object: `{version: 6, protocols, records: {}, selectedPhase: 'Anabolismo', macroTargets: {...}}`

- [ ] **Step 1: Open current tracker.html, copy entire content**

- [ ] **Step 2: Create tracker-v6.html skeleton with doctype, head, body**

- [ ] **Step 3: Embed FOOD_DB from alimentos_crudo_cocido_macros.json (34 foods)**

- [ ] **Step 4: Define PROTOCOLS (Anabolismo, Retatrutida, Purga)**

- [ ] **Step 5: Define MEAL_TEMPLATES (12 meals with exact macros)**

- [ ] **Step 6: Define PEPTIDES_DB (21 peptides)**

- [ ] **Step 7: Initialize state & migration from v5**

- [ ] **Step 8: Commit**

---

## Task 2: CSS & Layout Structure

**Files:**
- Modify: `app/public/tracker-v6.html` (add full CSS in `<style>` tag)

**Interfaces:**
- Consumes: (none; CSS-only)
- Produces: CSS classes for all UI components (hero, modals, cards, charts, tabs)

- [ ] **Step 1: Add comprehensive CSS (mobile-first, responsive)**

- [ ] **Step 2: Commit**

---

## Task 3: Util Functions & Helpers

**Files:**
- Modify: `app/public/tracker-v6.html` (add JS helpers after state initialization)

**Interfaces:**
- Produces:
  - `today()` → ISO date string
  - `blank(date)` → fresh day record
  - `rec(date)` → get/create record for date
  - `save()` → persist state to localStorage
  - `totals(meals)` → `{prot, carb, fat, kcal}`
  - `getMacrosByWeight(foodId, grams, isCocido)` → `{prot, carb, fat, kcal}`

- [ ] **Step 1: Add utility functions (today, rec, save, totals, getMacrosByWeight, esc, n)**

- [ ] **Step 2: Test getMacrosByWeight in browser console**

- [ ] **Step 3: Commit**

---

## Task 4: Meal Builder Modal

**Files:**
- Modify: `app/public/tracker-v6.html` (add mealBuilderModal() function + HTML rendering)

**Interfaces:**
- Consumes: `FOOD_DB`, `getMacrosByWeight()`
- Produces: 
  - `mealBuilderModal()` → HTML string with search, food selection, weight toggle, macros preview
  - `addMeal(name, items, macros)` → persists to rec().meals

- [ ] **Step 1: Write failing test (in browser console)**

- [ ] **Step 2: Implement mealBuilderModal() with food search, crudo/cocido toggle**

- [ ] **Step 3: Implement updateMacrosPreview() for live calculation**

- [ ] **Step 4: Test in browser (select pollo, enter 220g, check macros)**

- [ ] **Step 5: Commit**

---

## Task 5: Modals for Peptides & Check-in

**Files:**
- Modify: `app/public/tracker-v6.html` (add peptideModal(), checkinModal() functions)

**Interfaces:**
- Consumes: `PEPTIDES_DB`, `PROTOCOLS`
- Produces:
  - `peptideModal()` → HTML for peptide logging (name, dose, time, protocol hint)
  - `checkinModal()` → HTML for hydration, sleep, weight, notes

- [ ] **Step 1: Implement peptideModal() with peptide select, dose, time, protocol hint**

- [ ] **Step 2: Attach peptide select change listener for hint display**

- [ ] **Step 3: Implement checkinModal() with water, sleep, quality, weight, notes**

- [ ] **Step 4: Test modals render in browser**

- [ ] **Step 5: Commit**

---

## Task 6: Dashboard Hero & Quick Actions

**Files:**
- Modify: `app/public/tracker-v6.html` (add dashboard() function)

**Interfaces:**
- Consumes: `rec()`, `totals()`, `PROTOCOLS`
- Produces: `dashboard()` → HTML with phase-aware hero, quick actions, daily stats

- [ ] **Step 1: Implement dashboard() with phase-aware hero (Anabolismo: kcal%, Retatrutida: weight trend, Purga: ayuno timer)**

- [ ] **Step 2: Implement quick actions (3 buttons: Comida, Inyección, Check-in)**

- [ ] **Step 3: Implement daily stats cards (P/C/G/kcal vs targets)**

- [ ] **Step 4: Implement meal list for today**

- [ ] **Step 5: Test dashboard renders with correct phase-aware content**

- [ ] **Step 6: Commit**

---

## Task 7: Analytics View with Charts

**Files:**
- Modify: `app/public/tracker-v6.html` (add analyticsView() with SVG charts)

**Interfaces:**
- Consumes: `state.records`, `totals()`
- Produces: `analyticsView()` → HTML with weight trend chart (90d), macros 7d comparison, meal history table

- [ ] **Step 1: Implement weightChart() SVG (90 days, min/max labels)**

- [ ] **Step 2: Implement macrosChart() (7-day avg vs target for P/C/G)**

- [ ] **Step 3: Implement analyticsView() with weight chart, macros chart, last 10 meals table**

- [ ] **Step 4: Test chart renders with historical data**

- [ ] **Step 5: Commit**

---

## Task 8: Main Render Loop & Event Handlers

**Files:**
- Modify: `app/public/tracker-v6.html` (add render(), tabs, event delegation)

**Interfaces:**
- Consumes: `dashboard()`, `analyticsView()`
- Produces: Complete UI render, all event handlers attached

- [ ] **Step 1: Implement render() function with main layout**

- [ ] **Step 2: Implement switchView() for tab navigation (home → dashboard, analytics → analyticsView, settings → showSettings)**

- [ ] **Step 3: Implement date navigation (shiftDate, dateInput listener)**

- [ ] **Step 4: Attach theme toggle listener**

- [ ] **Step 5: Initialize app on load (state = load(), render())**

- [ ] **Step 6: Test in browser (navigation, date changes, theme toggle)**

- [ ] **Step 7: Commit**

---

## Task 9: Phase Selector & Settings View

**Files:**
- Modify: `app/public/tracker-v6.html` (add phaseSelector(), showSettings())

**Interfaces:**
- Consumes: `PROTOCOLS`
- Produces: Phase selector modal, settings view with export/import, macro targets editor

- [ ] **Step 1: Implement phaseSelector() modal**

- [ ] **Step 2: Implement setPhase() to switch protocols and targets**

- [ ] **Step 3: Implement showSettings() with phase current, targets editor, export/import buttons, reset button**

- [ ] **Step 4: Attach event listeners (targetForm submit, export button, import file, reset confirm)**

- [ ] **Step 5: Test phase switching, export JSON download, import re-upload**

- [ ] **Step 6: Commit**

---

## Task 10: Migration & Testing

**Files:**
- Modify: `app/public/tracker-v6.html` (add v5→v6 migration logic)
- Test: Full app flow testing in browser

**Interfaces:**
- Consumes: v5 localStorage records (rb_tracker_v5, rb_tracker_v4, etc.)
- Produces: Migrated records in v6 schema

- [ ] **Step 1: Implement migrateFromV5() function (scan legacy keys, transform schema)**

- [ ] **Step 2: Call migration on first load if records empty**

- [ ] **Step 3: Test migration in browser (verify v5 records appear in v6)**

- [ ] **Step 4: Full UI flow test checklist (dashboard, modals, add meals/peptides/checkin, analytics, phase switch, export/import)**

- [ ] **Step 5: Commit**

---

## Task 11: PWA & Deployment

**Files:**
- Verify: `app/public/tracker-manifest.json`, `app/public/tracker-sw.js`, icons
- Deploy: tracker-v6.html to Bluehost

**Interfaces:**
- No code changes; just verification + upload

- [ ] **Step 1: Verify PWA assets exist (manifest, sw, icons)**

- [ ] **Step 2: Verify manifest references tracker-v6 paths**

- [ ] **Step 3: Update tracker-v6.html manifest link in head**

- [ ] **Step 4: Test locally (python3 http.server, open in browser, verify SW register)**

- [ ] **Step 5: Prepare upload files (tracker-v6.html → index.html, manifest, sw, icons)**

- [ ] **Step 6: Commit**

- [ ] **Step 7: Push to GitHub (git push origin main)**

---

## Progress Ledger

(Will be updated as tasks complete)

---

## Execution Ready

Plan saved. Ready for subagent-driven execution (Tasks 1-11).
