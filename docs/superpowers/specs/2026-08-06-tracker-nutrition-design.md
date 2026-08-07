# Elite Athlete Nutrition Tracker — Design Spec

**Date:** 2026-08-06  
**Status:** Approved  
**Scope:** Structured Nutrition Tracker (Opción 2)  
**Timeline:** 2-3 weeks  
**Risk:** Low (incremental, localStorage tested)

---

## 1. Overview

Transform RB Tracker from basic daily checklist into a **mobile-first, nutrition-centric training log** for fitness/wellness athletes. Focus: real-time meal + workout logging, recovery tracking, daily macro adherence dashboard, 7-day trends.

**Core Use Case:**  
Athlete opens app at gym/kitchen, logs meal (protein/carbs/fat) or workout (exercise/sets/reps/RPE), checks daily macro % and recovery status. Runs offline, syncs to backend when available.

---

## 2. Data Model

### localStorage Structure (v5)

```json
{
  "version": 5,
  "records": {
    "2026-08-06": {
      "date": "2026-08-06",
      "meals": [
        {
          "id": "m1",
          "type": "breakfast|lunch|dinner|snack",
          "name": "Chicken & Rice",
          "protein": 50,
          "carbs": 80,
          "fat": 15,
          "calories": 665,
          "notes": "grilled, no oil"
        }
      ],
      "workouts": [
        {
          "id": "w1",
          "exercise": "Squat",
          "sets": 5,
          "reps": 5,
          "weight": 315,
          "rpe": 8,
          "notes": "form solid, felt strong"
        }
      ],
      "supplements": {
        "taken": ["multivit", "omega3", "creatina", "whey"],
        "notes": "post-workout whey at 19:00"
      },
      "hydration": {
        "liters": 4.5,
        "notes": "added electrolytes 2x"
      },
      "sleep": {
        "hours": 8.5,
        "quality": 4,
        "notes": "slept well, minimal interruptions"
      },
      "recovery": {
        "soreness": 3,
        "hrv": 52,
        "notes": "quads sore from yesterday's squats"
      },
      "checks": {}
    }
  },
  "macroTargets": {
    "protein": 200,
    "carbs": 300,
    "fat": 80
  },
  "syncedAt": 1722976800000
}
```

**Backward Compatibility:**  
- Existing `records[date].checks` preserved (legacy tasks)
- New fields (meals, workouts, recovery) coexist
- Migration on first load: convert v4 → v5 safely

---

## 3. UI/UX Architecture

### Mobile-First Layout

**Persistent Header:**
- Date picker (← YYYY-MM-DD →, tap for calendar modal)
- Macro progress bar (Protein | Carbs | Fat, color-coded: red=under, green=on-track, yellow=over)
- Readiness indicator (Red 😩 | Yellow 😐 | Green 💪 traffic light badge)
- Dark mode toggle (moon icon, persistent in localStorage)

**Tab Navigation (5 tabs, bottom or swipeable):**
1. **Meals** — Today's meals list, + Add Meal button
2. **Workouts** — Today's workouts, + Add Workout button
3. **Recovery** — Soreness slider, HRV input, sleep buttons
4. **Hydration** — Quick buttons (+250ml, +500ml, +1L), progress bar
5. **Historial** — 7-day trends (charts + tables)

**Touch Targets:**
- Min 44px height for buttons
- Modals for data entry (no page navigation)
- Swipe left/right to change date
- Large form inputs (font 16px+, no zoom-on-focus)

### Modals & Forms

**Add Meal Modal:**
- Type selector: Breakfast / Lunch / Dinner / Snack (buttons, selects defaults)
- Pre-populated macros (e.g., Breakfast → 40g protein, 50g carbs, 20g fat)
- Ingredient quick-select buttons (Chicken, Rice, Banana, Egg, etc) → taps add to totals
- Manual entry fields (Name, Protein, Carbs, Fat)
- Notes textarea (optional, max 300 chars)
- Cancel / Save buttons
- Auto-calculate calories (protein×4 + carbs×4 + fat×9)

**Add Workout Modal:**
- Exercise input (text, with autocomplete: Squat, Deadlift, Bench, etc)
- Sets / Reps / Weight inputs (numbers)
- RPE slider 1-10 with labels (Easy | Moderate | Hard | Max Effort)
- Notes textarea (form, feeling, issues)
- Cancel / Save buttons

**Recovery Input:**
- Soreness slider 0-10, emoji feedback (😌 to 😩)
- HRV input field (optional, for wearable users)
- Sleep hours input (number, 0-14)
- Sleep quality buttons (😫 | 😕 | 😐 | 🙂 | 😄)
- Notes textarea
- Auto-calculate readiness score: `(10 - soreness + sleep_quality) / 2` → rounded to 1-10

---

## 4. Core Features

### 4.1 Meal Logging

**Workflow:**
1. User taps "+ Add Meal"
2. Modal opens, type auto-focuses
3. User selects type (Breakfast) → default macros populate
4. User adjusts protein/carbs/fat or uses quick-select ingredients
5. Taps Save → meal added to day's list, macro totals update instantly
6. Saved to localStorage immediately

**Data Validation:**
- Protein/Carbs/Fat: 0-500g range (validate, warn if >300g single meal)
- Meal type required
- Name optional but encouraged
- Calories auto-calculated, read-only display

**Display:**
- List of meals for day: `[icon] Breakfast: 50g P | 80g C | 15g F | 665 cal`
- Edit/delete buttons on each meal (swipe to delete, or X button)
- Daily totals below list: `Totals: 150/200g P | 200/300g C | 60/80g F | 1950/2300 cal`

### 4.2 Workout Logging

**Workflow:**
1. User taps "+ Add Workout"
2. Modal opens, exercise input auto-focuses
3. User enters exercise name (autocomplete list of common exercises)
4. Inputs sets, reps, weight, RPE
5. Taps Save → workout added, volume totals update

**Auto-Complete Exercise List:**
Squat, Deadlift, Bench Press, Overhead Press, Row, Pull-ups, Dips, Leg Press, Leg Curl, Leg Extension, Hamstring Curl, Calf Raise, Tricep Extension, Bicep Curl, Lateral Raise, Chest Fly, Back Fly, Plank, Pushup, Situp, Run, Cycle, Swim, Walk, Hike

**Data Validation:**
- Exercise required (text or autocomplete)
- Sets/Reps/Weight: 0-999 range
- RPE 1-10, required
- Auto-calc volume: sets × reps × weight (for tracking progressive overload)

**Display:**
- List: `Squat: 5×5@315lb, RPE 8` (sets×reps@weight, rpm)
- Workout metrics for day: `Workouts: 3 | Total Volume: 12,500 lb | Avg RPE: 7.5`

### 4.3 Recovery Tracking

**Soreness Slider:**
- 0-10 scale with emoji gradient (😌 at 0, 😩 at 10)
- Realtime label below: "No soreness" / "Mild" / "Moderate" / "Significant" / "Immobile"
- Cleared daily (optional: keep last value as default)

**HRV Input:**
- Optional number field (0-200)
- Label: "Heart Rate Variability (if tracking)"
- Context: "Higher = better recovery"

**Sleep Tracking:**
- Hours input (0.5 increments, 0-14 range)
- Quality buttons: 😫 😕 😐 🙂 😄 (maps to 1-5)
- Label "Last night's sleep"

**Readiness Score (Auto-Calculated):**
```
score = (10 - soreness + sleep_quality) / 2
= ranges 0.5 to 10

Displays as:
- Red (0-3): 😩 "Recovering" — rest or light activity
- Yellow (4-7): 😐 "Ready" — normal training
- Green (8-10): 💪 "Primed" — push hard
```

**Notes:** Textarea for recovery observations (max 300 chars)

### 4.4 Hydration Tracking

**Quick Input Buttons:**
- + 250ml (water bottle)
- + 500ml (large bottle)
- + 1L (jug)
- Manual input field (number, ml)

**Progress:**
- Bar showing liters today vs target (4L default, configurable)
- Label: `2.5 / 4.0 L (62%)`
- Color coded: red <50%, yellow 50-90%, green ≥90%

**Notes:** Optional textarea for hydration strategy (electrolytes, timing, etc)

### 4.5 Daily Dashboard

**Main View (after Header):**

```
┌─────────────────────────────────┐
│ MACROS                          │
│ ████████░ Protein 150/200g      │
│ ██████░░░ Carbs 200/300g        │
│ ███████░░ Fat 60/80g            │
│ Daily Total: 1950 / 2300 cal    │
├─────────────────────────────────┤
│ TRAINING                        │
│ 3 Workouts Logged               │
│ Total Volume: 12,500 lb         │
│ Avg RPE: 7.5                    │
├─────────────────────────────────┤
│ RECOVERY                        │
│ Soreness: 3/10 (Mild)           │
│ Sleep: 8.5h, Quality: 4/5       │
│ Readiness: 💪 Green (8.5/10)    │
├─────────────────────────────────┤
│ HYDRATION                       │
│ ██████░░░░ 2.5 / 4.0 L (62%)   │
└─────────────────────────────────┘
```

**Summary Cards:**
- Click to expand and edit each section
- Badges show completeness (all meals logged? ✓, workouts pending? ⚠)

### 4.6 Weekly Trends (Historial Tab)

**7-Day View:**

1. **Macro Adherence Chart (Line)**
   - X-axis: Last 7 days (dates)
   - Y-axis: % adherence (0-100%)
   - 3 lines: Protein %, Carbs %, Fat %
   - Tap point to see that day's macros

2. **Workouts Logged (Bar Chart)**
   - X-axis: Days
   - Y-axis: # workouts or total volume
   - Tap bar to see workout details

3. **Sleep & Soreness (Heat Map or Mini Table)**
   - Date | Sleep Hrs | Sleep Quality | Soreness | Readiness
   - Color coding for each column

4. **Statistics Summary:**
   ```
   Macro Adherence (7-day avg): 84%
   Workouts Logged: 18/21 (86%)
   Avg Sleep: 8.2h / night
   Avg Soreness: 4.2 / 10
   Avg Readiness: 6.8 / 10
   ```

---

## 5. Cache & Performance Fix

### Problem
Deployed v5 but browser/Service Worker caching old version.

### Solution

**1. HTTP Headers (PHP Backend)**
```php
header('Cache-Control: no-cache, must-revalidate, max-age=0');
header('ETag: ' . md5_file(__FILE__));
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime(__FILE__)) . ' GMT');
header('Pragma: no-cache');
```
→ Browser revalidates on every request, never uses stale cache

**2. Service Worker Strategy**
- Version increment: v4 → v5 in SW registration
- On install: `skipWaiting()` for immediate activation
- On activate: Delete old caches (`caches.delete('tracker-v4')`)
- Cache strategy: **Network-first** (fetch → if success cache, else fallback to cache)

**3. Cache-Busting in HTML**
```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js?v=20260806" crossorigin></script>
<!-- Query param forces fresh download -->
```

**4. User-Facing Refresh**
- Auto-detect new SW version, show toast: "New version available!"
- Button "Refresh now" → `location.reload(true)` forces hard reload
- Or manual refresh button in header (↻ icon, always visible)

**Result:** User always gets latest, no stale cache.

---

## 6. API Integration Prep (Stubs)

**Not implemented yet, structure ready:**

**Strava Integration (Stub):**
```
Button: "Connect Strava" → placeholder
Modal: "Sync workouts from Strava? (Coming soon)"
Future: OAuth redirect → access token stored
Then: GET /api/strava/workouts → auto-import
```

**Apple Health Integration (Stub):**
```
Button: "Connect Apple Health" → placeholder
Modal: "Auto-sync sleep & HRV? (Coming soon)"
Future: requestAuthorization → read HRV, sleep
Then: Auto-fill recovery.hrv, sleep fields
```

**Data Contract Ready:**
- Workout import schema: `{date, exercise, distance, duration, calories, avg_pace}`
- Sleep import schema: `{date, hours, hrv_optional}`
- No changes needed to core schema when APIs enabled

---

## 7. Implementation Priorities

### Phase 1: Data Model & UI Scaffolding (Week 1)
- [ ] Migrate v4 → v5 localStorage safely
- [ ] Rebuild UI with tab navigation
- [ ] Meal modal + basic form

### Phase 2: Core Features (Week 2)
- [ ] Workout logging
- [ ] Recovery tracking (soreness, sleep, HRV)
- [ ] Hydration quick buttons
- [ ] Daily dashboard calculations

### Phase 3: Charts & Cache Fix (Week 2-3)
- [ ] 7-day trend charts (macro adherence, workouts, sleep)
- [ ] HTTP cache headers + ETag
- [ ] Service Worker v5 with network-first strategy
- [ ] Refresh toast + button

### Phase 4: Polish & Edge Cases (Week 3)
- [ ] Edit/delete meals and workouts
- [ ] Readiness score calculation & display
- [ ] Mobile responsiveness testing
- [ ] Offline testing (fetch fails, cache works)

---

## 8. Success Criteria

- ✅ Athlete logs meal + workout + recovery in <30 sec total (mobile)
- ✅ Daily macro % visible on dashboard
- ✅ 7-day trends show adherence patterns
- ✅ No cache issues — refresh loads latest v5 always
- ✅ Offline mode works (meals/workouts logged locally, syncs when online)
- ✅ Readiness score changes with sleep + soreness input
- ✅ Mobile layout tested on iPhone 13, Android Pixel

---

## 9. Backward Compatibility

- Existing records.date.checks (medicamentos, suplementos) preserved
- Legacy data migrated once on first load
- No data loss
- User can still see old medicamentos checklist if needed (optional legacy tab)

---

## 10. Future Enhancements (Post-Phase 1)

1. **Strava + Apple Health sync** (auto-import workouts + HRV/sleep)
2. **Macro auto-planning** (calculate daily targets based on training plan)
3. **Performance correlation** (nutrición → training volume → recovery → performance)
4. **Meal templates** (pre-saved meals for quick logging: "my post-workout meal")
5. **Macro ratios by meal type** (auto-adjust carbs higher post-workout, fats higher rest days)
6. **Export to PDF** (weekly/monthly nutrition report)

---

## 11. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| localStorage quota exceeded (50MB) | Data loss, sync fails | Archive old months, compress historical data |
| Complex calculations slow mobile | Poor UX, battery drain | Pre-calculate on save, not on render |
| Offline sync conflicts | Duplicate data | Last-write-wins strategy, timestamps |
| User forgets to log meals | Incomplete data | Toast reminders, optional auto-populate defaults |

---

## 12. Testing Strategy

**Manual Testing (Phase 3-4):**
- [ ] Meal logging: add, edit, delete, macros calculate correctly
- [ ] Workout logging: sets/reps/weight/RPE all persisted
- [ ] Recovery: soreness + sleep quality → readiness score correct
- [ ] Dashboard: macro % bars update in real-time
- [ ] Charts: 7-day trends render without errors
- [ ] Cache: reload page → v5 loaded (ETag validates)
- [ ] Offline: close WiFi, log meal, re-enable WiFi → syncs
- [ ] Mobile: test on actual iPhone/Android device (swipes, modals, forms)

**No automated tests initially** (localStorage + DOM heavy, vitest setup available if needed)

---

## End of Spec

**Spec Approved By:** User  
**Ready for Implementation Plan:** YES
