# Elite Athlete Peptides Module — Design Spec

**Date:** 2026-08-06  
**Status:** Approved  
**Scope:** Integrated Peptides Tab for RB Tracker v5  
**Timeline:** 2-3 weeks (parallel with nutrition tracker)  
**Risk:** Low (reuses v5 patterns)

---

## 1. Overview

Add dedicated **Peptides tab** to RB Tracker v5 for tracking medical peptide protocol. Includes 11 active compounds + 9 optional (low-evidence) items, with editable dosing, protocol validations, and 7-day history. Fully integrated into v5 data model and UI patterns.

**Core Use Case:**  
Athlete opens Peptides tab, sees today's scheduled peptides organized by frequency (Daily | 3x/Week | Specific Days | Optional). Adjusts syringe line if needed (e.g., BPC L50 → L45 if underdosing today). Marks done/pending/skipped. System validates protocol rules (PT-141 not with CJC, MOTS-C requires fasting, etc). Saves to localStorage, syncs to backend when online.

---

## 2. Data Model

### localStorage v5 Extension

Add `peptides` array to each day's record:

```json
{
  "version": 5,
  "records": {
    "2026-08-06": {
      "date": "2026-08-06",
      "meals": [...],
      "workouts": [...],
      "recovery": {...},
      "hydration": {...},
      "peptides": [
        {
          "id": "bpc157_am",
          "label": "BPC-157 (mañana)",
          "mechanism": "Angiogénesis, curación tendones/ligamentos, repara mucosa GI",
          "dosage_protocol": 50,
          "dosage_applied": 50,
          "status": "done",
          "timestamp": 1722976800000,
          "notes": "aplicado en cadera izquierda"
        },
        {
          "id": "cjc_ipa",
          "label": "CJC/Ipamorelin",
          "mechanism": "GH secretagogos sinérgicos, pulso de GH fisiológico",
          "dosage_protocol": 30,
          "dosage_applied": 30,
          "status": "pending",
          "timestamp": null,
          "notes": ""
        }
      ],
      "checks": {} // legacy medicamentos/suplementos
    }
  },
  "macroTargets": {...},
  "peptideProtocol": {
    // Base configuration for each peptide (frequency, mechanism, default dosage)
    "retatrutida": { "label": "Retatrutida", "dosage": "L(variable)", "frequency": "weekly", "weekday": 2 },
    "bpc157_am": { "label": "BPC-157 (mañana)", "dosage": 50, "frequency": "daily" },
    // ... rest of 11 activos
  },
  "syncedAt": 1722976800000
}
```

**Schema Fields:**
- `id`: Unique identifier (snake_case)
- `label`: Display name
- `mechanism`: Mechanism of action (1-2 sentences)
- `dosage_protocol`: Default syringe line from protocol
- `dosage_applied`: Editable — what was actually applied today
- `status`: "done" | "pending" | "skipped"
- `timestamp`: When applied (ISO string or null)
- `notes`: Optional user notes (max 200 chars)

**Backward Compatibility:**  
- Existing `records[date].checks` (legacy medicamentos) preserved
- New `peptides` array coexists
- v4 data migrates cleanly (no peptides entry = empty array)

---

## 3. UI Architecture

### Tab Navigation (Updated)

Add "Péptidos" tab to main navigation:
```
Dashboard | Meals | Workouts | Recovery | Hydration | Péptidos | Historial | Mis datos
```

### Peptides Tab Layout

**Header (shared with other tabs):**
- Date picker (← YYYY-MM-DD →, tap for calendar modal)
- Readiness indicator (from recovery metrics)
- Dark mode toggle

**Content Sections (4 Total):**

#### Section A: Diarios (Daily Peptides)
- BPC-157 (mañana)
- BPC-157 (noche)
- CJC/Ipamorelin
- Visible every day

Display format per peptide:
```
BPC-157 (mañana)
🧬 Angiogénesis, curación tendones/ligamentos, repara mucosa GI
┌─────────────────────────────────┐
│ L50 [input editable]  ☑ Done  ✕ │
└─────────────────────────────────┘
```

#### Section B: 3x/Semana (3x Per Week)
- MOTS-C (Mon/Wed/Fri)
- NAD+ (Mon/Wed/Fri)
- TA-1 (Wed/Fri)
- GHK-Cu Independent (Mon-Fri)

Collapsible by frequency. Expand only if today or next 2 days.

#### Section C: Según Día (Specific Days)
- Retatrutida (Tuesday only)
- KLOW (Wed/Fri)
- Semax+Selank (Mon/Thu)
- PT-141 (On-demand)
- SS-31 (Daily)

Expand only if relevant to today's day of week.

#### Section D: Opcionales — Evidencia Débil (Collapsed)
- 9 optional items (ARA-290, Cartalax, Pinealon, DSIP, SLU-PP-332, AOD9604, Oxytocin, Humanin, FOXO4-DRI)
- Each prefixed with ⚪ emoji
- Collapsed by default
- Same format as active peptides

**Touch Targets:**
- Min 44px height for buttons
- Modals for editing dosage
- Large font (16px+) for inputs
- Dark mode aware

---

## 4. Core Features

### 4.1 Editable Dosage

**Field:** Syringe line (numeric input, 1-100)

**Default:** Protocol dosage (e.g., BPC L50, NAD+ L100, MOTS-C L100)

**User Can Adjust:** If applying different dose that day (e.g., BPC L45 if conservative dose)

**Saved As:** `dosage_applied` (vs. protocol `dosage_protocol`)

**Display:** `L[number]` format (e.g., "L50", "L100")

### 4.2 Three-State Checkbox

- **☐ Pending** (default): Not applied yet
- **☑ Done** (green): Applied successfully
- **⊘ Skipped** (gray): Not applied (stock shortage, medical change, etc)

Click cycles: Pending → Done → Skipped → Pending

### 4.3 Protocol Validations & Alerts

**Validation Rule 1: PT-141 + CJC Same Day**
- If both marked "done" same day: Show 🔴 Red alert "PT-141 no el mismo día que CJC/Ipa noche"
- Alert text: "Conflict detected: PT-141 and CJC/Ipamorelin on same day violates protocol"

**Validation Rule 2: MOTS-C Requires Fasting**
- If Meals tab shows breakfast logged before MOTS-C time: ⚠️ Yellow alert "MOTS-C debería ser en ayunas"
- Auto-check: Does records[date].meals have any entries with timestamp < MOTS-C time?

**Validation Rule 3: GHK-Cu Mon-Fri Only**
- On Sat/Sun: 🔴 Checkbox disabled/grayed out for GHK-Cu entries
- Alert: "GHK-Cu no se aplica sábado/domingo"

**Validation Rule 4: Retatrutida Titration Week**
- Show expected dosage vs. actual: "Semana 1-2: L2.5 · Aplicado: L50"
- ⚠️ If applied dosage doesn't match titration schedule: Yellow alert "Dosis no coincide con titulación de semana X"

**Validation Rule 5: CJC/Ipa ≥2h Fasting**
- If CJC/Ipa marked done but dinner logged within 2h before: ⚠️ Yellow alert "CJC/Ipa requiere ≥2h de ayuno"

**Display Style:**
- Alerts appear above/below the conflicting peptide
- Color-coded: 🔴 Red = blocking, ⚠️ Yellow = warning (allow but flag)
- Disappear when conflict resolves

### 4.4 Historial (7-Day History)

**Location:** Shared "Historial" tab (alongside meals/workouts history)

**Display Format:**
```
Peptidos — Últimos 7 días
Date       | Peptide          | Dosage | Status   | Time
2026-08-06 | BPC-157 (mañana) | L50    | Done     | 08:30
2026-08-06 | CJC/Ipa          | L30    | Pending  | —
2026-08-05 | BPC-157 (mañana) | L50    | Done     | 08:15
...
```

**Features:**
- Click row to expand notes
- Filter by peptide (dropdown)
- Color-code status (✓ green, ⊘ gray, ? yellow)

### 4.5 Mechanism Summary

Each peptide shows **1-2 sentence mechanism** (from protocol document):
- BPC-157: "Angiogénesis, curación tendones/ligamentos, repara mucosa GI"
- MOTS-C: "Regulador metabólico, activa AMPK, mejora sensibilidad a insulina"
- Retatrutida: "Triple agonista GLP-1/GIP/Glucagón, reduce apetito y peso"

Source: `PROTOCOLO_PEPTIDOS_COMPLETO_CLAUDE_CODE.md`

---

## 5. Data Seeding

### 11 Active Core Peptides

```json
[
  {"id":"retatrutida","label":"Retatrutida","mechanism":"Triple agonista GLP-1/GIP/Glucagón, titulación conservadora","dosage":null,"frequency":"weekly","weekday":2},
  {"id":"bpc157_am","label":"BPC-157 (mañana)","mechanism":"Angiogénesis, curación tendones/ligamentos, repara mucosa GI","dosage":50,"frequency":"daily"},
  {"id":"bpc157_pm","label":"BPC-157 (noche)","mechanism":"Angiogénesis, curación tendones/ligamentos, repara mucosa GI","dosage":50,"frequency":"daily"},
  {"id":"cjc_ipa","label":"CJC/Ipamorelin","mechanism":"GH secretagogos sinérgicos, pulso GH fisiológico","dosage":30,"frequency":"daily"},
  {"id":"ghk_cu","label":"GHK-Cu (independiente)","mechanism":"Síntesis colágeno tipo I/III, elastina, glicosaminoglicanos","dosage":10,"frequency":"weekdays_only"},
  {"id":"mots_c","label":"MOTS-C","mechanism":"Regulador metabólico, activa AMPK, mejora sensibilidad insulina","dosage":100,"frequency":"3x_week","weekdays":[1,3,5]},
  {"id":"nad","label":"NAD+","mechanism":"Coenzima metabólico mitocondrial, reparación ADN, activación sirtuinas","dosage":100,"frequency":"3x_week","weekdays":[1,3,5]},
  {"id":"ta1","label":"Thymosin Alpha-1","mechanism":"Inmunomodulador, mejora función células T, aprobado clínico (Zadaxin)","dosage":75,"frequency":"2x_week","weekdays":[3,5]},
  {"id":"ss31","label":"SS-31 (Elamipretide)","mechanism":"Protección mitocondrial, estabiliza cadena de electrones, reduce estrés oxidativo","dosage":null,"frequency":"daily","note":"10-15mg/día (calcular L según reconstitución)"},
  {"id":"klow","label":"KLOW (sin GHK-Cu)","mechanism":"Blend: BPC-157/TB-500/KPV, reparación + antiinflamatorio vía NF-κB","dosage":40,"frequency":"2x_week","weekdays":[3,5]},
  {"id":"pt141","label":"PT-141 (Bremelanotide)","mechanism":"Agonista melanocortina (MC3R/MC4R) central, deseo sexual","dosage":10,"frequency":"on_demand"}
]
```

### 9 Optional (Low Evidence)

```json
[
  {"id":"opt_ara290","label":"⚪ ARA-290","mechanism":"Activador receptor reparación innata, dolor radicular","dosage":"4mg","evidence":"Sin ensayos clínicos en dolor lumbar"},
  {"id":"opt_cartalax","label":"⚪ Cartalax","mechanism":"Bioregulador ruso dirigido a cartílago discal","dosage":"10mg × 10 días","evidence":"Preclínico, sin ensayos humanos"},
  {"id":"opt_pinealon","label":"⚪ Pinealon","mechanism":"Bioregulador cerebral, protección neuronal","dosage":"10mg × 10 días","evidence":"Preclínico"},
  {"id":"opt_dsip","label":"⚪ DSIP","mechanism":"Delta Sleep-Inducing Peptide, sueño de ondas lentas","dosage":"100-300mcg","evidence":"Ensayos inconsistentes"},
  {"id":"opt_slu","label":"⚪ SLU-PP-332","mechanism":"Agonista receptores ERR, mimetiza ejercicio aeróbico","dosage":"Sin dosis humana","evidence":"Solo evidencia animal"},
  {"id":"opt_aod","label":"⚪ AOD9604","mechanism":"Fragmento HGH, lipólisis sin efecto en IGF-1","dosage":"300mcg","evidence":"Ensayo clínico: no superó placebo"},
  {"id":"opt_oxy","label":"⚪ Oxytocin (SC)","mechanism":"Modulación bienestar/vínculo social vía SNC","dosage":"Sin dosis validada","evidence":"Evidencia sólida es intranasal"},
  {"id":"opt_humanin","label":"⚪ Humanin","mechanism":"Péptido mitocondrial, mejora sensibilidad insulina","dosage":"~1mg 3x/sem","evidence":"Sin ensayos SC, mayoría cultivo/animal"},
  {"id":"opt_foxo4","label":"⚪ FOXO4-DRI","mechanism":"Senolítico, apoptosis células senescentes","dosage":"Sin dosis humana","evidence":"Un estudio (ratones 2017), cero humanos"}
]
```

---

## 6. Backend Integration

### Existing API

- **POST `/api/?resource=peptides`** — Already exists (from v4 structure)
- **Sync:** Include `peptides[]` array in v5 POST /sync.php
- **Database:** Table `rb_peptides` (already provisioned)

### No Backend Changes Needed

- Existing API handles peptide CRUD
- Just extend payload to include new fields (mechanism, dosage_applied, status, timestamp)

---

## 7. Testing Strategy

**Manual Testing (Week 3-4):**
- [ ] Add peptide to day, edit dosage, toggle states
- [ ] Verify all 4 validations (PT-141+CJC, MOTS-C fasting, GHK weekdays, CJC fasting)
- [ ] Check 7-day history displays correctly
- [ ] Dark mode: alerts visible in light/dark
- [ ] Offline: log peptide without connection, sync when online
- [ ] Mobile: 44px+ touch targets, swipe date navigation

**Edge Cases:**
- [ ] What if MOTS-C marked done but breakfast logged later that day? (Validation catches it)
- [ ] Edit dosage multiple times same day? (Last edit wins, stored)
- [ ] Skip then mark done same day? (Status cycles correctly)

---

## 8. Success Criteria

- ✅ Tab "Péptidos" visible in navigation alongside Meals/Workouts/Recovery
- ✅ All 11 actives prepopulated with mechanism, default dosage
- ✅ 9 opcionales listed but collapsed
- ✅ Dosis editable (L1-L100 input)
- ✅ 3-state checkbox (Pending/Done/Skipped)
- ✅ All 5 protocol validations working + alerts displaying
- ✅ 7-day history in Historial tab
- ✅ Dark mode compatible
- ✅ Offline support (localStorage + sync)
- ✅ Mobile: 44px+ buttons, responsive layout

---

## 9. Scope & Timeline

**Phase 1: Data Model & UI Scaffolding** (Week 1)
- Extend v5 localStorage with peptides field
- Create Peptides tab component

**Phase 2: Core Features** (Week 2)
- Editable dosage input
- 3-state checkbox
- Seed 11 actives + 9 opcionales
- Historial integration

**Phase 3: Validations & Polish** (Week 2-3)
- All 5 protocol validations + alert UI
- Dark mode styling
- Mobile responsiveness
- Offline testing

---

## 10. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Validation conflicts overlap (e.g., MOTS-C + CJC same day both fail) | Confusing alerts | Prioritize alerts: PT-141+CJC (critical) first, then others |
| Dosage calculation errors (e.g., reconstitution mismatch) | Medical safety issue | UI shows protocol dosage as reference; user adjusts manually; notes field for tracking |
| Too many validations slow UI | Performance | Defer non-critical validations to Historial tab; only show critical alerts on main Peptides tab |
| localStorage quota exceeded | Data loss | Archive old months; compress historical peptide data if > 50MB |

---

## End of Spec

**Spec Approved By:** User  
**Ready for Implementation Plan:** YES
