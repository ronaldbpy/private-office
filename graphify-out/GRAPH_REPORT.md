# Graph Report - private-office  (2026-08-09)

## Corpus Check
- 136 files · ~79,714 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 694 nodes · 1026 edges · 66 communities (35 shown, 31 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c69ff828`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- accessibleEntityIds
- app/page.tsx
- dependencies
- compilerOptions
- devDependencies
- layout.tsx
- Elite Athlete Nutrition Tracker — Design Spec
- upload/route.ts
- holdings/page.tsx
- entities/[id]/page.tsx
- entities/page.tsx
- parties/[id]/page.tsx
- parties/page.tsx
- openapi.json/route.ts
- documents/page.tsx
- seed.ts
- proxy.ts
- eslint.config.mjs
- Elite Athlete Peptides Module — Design Spec
- 🚀 Private Office — Go-Live Guide
- postcss.config.mjs
- PHASE 2: Core Features
- 2026-08-06-peptides-implementation.md
- Deployment — Private Office a Bluehost
- Tracker v6.0 Implementation Plan — Elite Protocol Mobile-First
- [1.3.0] — 2026-08-06
- Tracker v5.2 — Deployment Instructions
- _meal_tables.md
- Implementation Status
- CLAUDE.md
- Production Readiness Checklist
- FS-007 — API Endpoints
- Pasos
- InventoryForm.tsx
- InvoiceForm.tsx
- ProductForm.tsx
- SupplierForm.tsx
- Prompt para Claude Chrome Extension — Verificación Bluehost
- Fix Applied
- customers/page.tsx
- events/page.tsx
- inventory/page.tsx
- invoices/page.tsx
- products/page.tsx
- quotes/page.tsx
- suppliers/page.tsx
- vercel.json
- AGENTS.md
- next.config.js
- next.config.ts
- tracker-sw.js
- BLUEHOST_DEPLOY.sh
- deploy-bluehost.sh
- deploy-ftp.sh
- README.md
- deploy.sh

## God Nodes (most connected - your core abstractions)
1. `accessibleEntityIds()` - 93 edges
2. `getUserAccess()` - 92 edges
3. `getAuthUserId()` - 92 edges
4. `compilerOptions` - 16 edges
5. `Tracker v6.0 Implementation Plan — Elite Protocol Mobile-First` - 16 edges
6. `Elite Athlete Nutrition Tracker — Design Spec` - 14 edges
7. `formatDatePY()` - 13 edges
8. `🚀 Private Office — Go-Live Guide` - 13 edges
9. `Elite Athlete Peptides Module — Design Spec` - 12 edges
10. `Tracker v5.2 — Deployment Instructions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getAuthUserId()`  [EXTRACTED]
  app/app/api/v1/parties/[id]/route.ts → app/lib/api-auth.ts
- `PATCH()` --calls--> `getAuthUserId()`  [EXTRACTED]
  app/app/api/v1/parties/[id]/route.ts → app/lib/api-auth.ts
- `GET()` --calls--> `getAuthUserId()`  [EXTRACTED]
  app/app/api/v1/parties/route.ts → app/lib/api-auth.ts
- `POST()` --calls--> `getAuthUserId()`  [EXTRACTED]
  app/app/api/v1/parties/route.ts → app/lib/api-auth.ts
- `GET()` --calls--> `accessibleEntityIds()`  [EXTRACTED]
  app/app/api/vault/[documentId]/route.ts → app/lib/access.ts

## Import Cycles
- None detected.

## Communities (66 total, 31 thin omitted)

### Community 0 - "accessibleEntityIds"
Cohesion: 0.08
Nodes (66): GET(), POST(), GET(), GET(), DELETE(), GET(), PUT(), GET() (+58 more)

### Community 1 - "app/page.tsx"
Cohesion: 0.06
Nodes (32): Report, ReportDetailPage(), reportTypeLabels, Entity, IntelligencePage(), Report, reportTypeLabels, Home() (+24 more)

### Community 2 - "dependencies"
Cohesion: 0.05
Nodes (35): @anthropic-ai/sdk, dependencies, @anthropic-ai/sdk, @clerk/nextjs, lightningcss, next, prisma, @prisma/client (+27 more)

### Community 3 - "compilerOptions"
Cohesion: 0.07
Nodes (29): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+21 more)

### Community 4 - "devDependencies"
Cohesion: 0.06
Nodes (31): devDependencies, eslint, eslint-config-next, jsdom, tailwindcss, @tailwindcss/postcss, @testing-library/jest-dom, @testing-library/react (+23 more)

### Community 5 - "layout.tsx"
Cohesion: 0.13
Nodes (10): fraunces, geistMono, geistSans, metadata, ErrorBoundary, Props, State, MobileNav() (+2 more)

### Community 6 - "Elite Athlete Nutrition Tracker — Design Spec"
Cohesion: 0.07
Nodes (29): 10. Future Enhancements (Post-Phase 1), 11. Risks & Mitigation, 12. Testing Strategy, 1. Overview, 2. Data Model, 3. UI/UX Architecture, 4.1 Meal Logging, 4.2 Workout Logging (+21 more)

### Community 7 - "upload/route.ts"
Cohesion: 0.32
Nodes (9): GET(), POST(), VALID_CLASSIFICATIONS, ensureStorageDir(), hashBuffer(), readFile(), safeFilename(), saveFile() (+1 more)

### Community 8 - "holdings/page.tsx"
Cohesion: 0.40
Nodes (3): Holding, interestTypeLabels, verificationLabels

### Community 25 - "Elite Athlete Peptides Module — Design Spec"
Cohesion: 0.07
Nodes (28): 10. Risks & Mitigation, 11 Active Core Peptides, 1. Overview, 2. Data Model, 3. UI Architecture, 4.1 Editable Dosage, 4.2 Three-State Checkbox, 4.3 Protocol Validations & Alerts (+20 more)

### Community 26 - "🚀 Private Office — Go-Live Guide"
Cohesion: 0.08
Nodes (25): 1. **Gestión de Clientes** (`/customers`), 2. **Catálogo de Productos/Servicios** (`/products`), 3. **Cotizaciones** (`/quotes`), 4. **Facturas Compra/Venta** (`/invoices`), 5. **Eventos y Calendario** (`/events`), 6. **Reportes Contables** (`/accounting-reports`), 📊 Acceso en Cascada, App carga pero muestra 404 (+17 more)

### Community 29 - "PHASE 2: Core Features"
Cohesion: 0.09
Nodes (22): Elite Athlete Nutrition Tracker Implementation Plan, Execution Handoff, File Structure, Global Constraints, Modified Files, New Files, No backend changes needed, PHASE 1: Data Model & UI Scaffolding (+14 more)

### Community 30 - "2026-08-06-peptides-implementation.md"
Cohesion: 0.10
Nodes (20): Execution Handoff, File Structure, Global Constraints, Peptides Module Implementation Plan, PHASE 1: Data Model & Tab Navigation (Week 1), PHASE 2: Core Features (Week 2), PHASE 3: Testing & Validation (Week 3), PHASE 3: Testing & Validation (Week 3) (+12 more)

### Community 31 - "Deployment — Private Office a Bluehost"
Cohesion: 0.10
Nodes (19): 1. Build local, 2. Ejecutar script de deployment, 3. Upload a Bluehost via SCP, 4. Instalar dependencias en Bluehost, 5. Configurar variables de entorno, 6. Iniciar aplicación, 7. Verificar deployment, Actualizar después del deployment (+11 more)

### Community 32 - "Tracker v6.0 Implementation Plan — Elite Protocol Mobile-First"
Cohesion: 0.12
Nodes (16): Execution Ready, Global Constraints, Progress Ledger, Task 10: Migration & Testing, Task 11: PWA & Deployment, Task 1: Data Schema & Embedded Databases, Task 2: CSS & Layout Structure, Task 3: Util Functions & Helpers (+8 more)

### Community 33 - "[1.3.0] — 2026-08-06"
Cohesion: 0.14
Nodes (13): [1.2.0] — 2026-07-25, [1.3.0] — 2026-08-06, Added, Changed, Changelog — Private Office, Dependencies (No Changes), Documentation, Features (+5 more)

### Community 34 - "Tracker v5.2 — Deployment Instructions"
Cohesion: 0.14
Nodes (13): Data Persistence, Files Ready to Upload, Git Status, Method 1: Command Line (lftp), Method 2: GUI FTP Client (Cyberduck, FileZilla), Method 3: cPanel File Manager, Next: Backend Sync (Optional Future), Tracker v5.2 — Deployment Instructions (+5 more)

### Community 35 - "_meal_tables.md"
Cohesion: 0.15
Nodes (12): D1 · Huevos + jamón + aguacate, D2 · Yogur griego + colágeno + frutos rojos + nueces, D3 · Batido post-ayuno (Whey + avena + banana), P1 · Pollo + arroz integral + ensalada (Anabolismo), P2 · Salmón + quinoa + brócoli (Anabolismo), P3 · Carne magra + batata + brócoli, P4 · Atún + arroz + verduras (Retatrutida bajo-carb), P5 · Bowl legumbres (lentejas) + pollo + palta (+4 more)

### Community 36 - "Implementation Status"
Cohesion: 0.15
Nodes (12): 🏗️ Architecture Decisions Needing ADR, 🛑 Blockers (None Currently), ✅ Complete (11 FS), High Priority, Implementation Status, Lower Priority (Design/Polish), Medium Priority, 📊 Metrics (+4 more)

### Community 37 - "CLAUDE.md"
Cohesion: 0.17
Nodes (10): Arquitectura vigente que conviene conocer antes de tocar código, Contexto para agentes de código (Claude Code, Cursor, etc.), Decisiones técnicas fijadas — NO cambiar sin confirmar con el owner, ⚠️ No corras dos sesiones de agente en paralelo sobre esta carpeta, ⚠️ `npm install` instala paquetes de menos (silenciosamente) — CAUSA RAÍZ ENCONTRADA, Estructura, Primeros pasos, Private Office — app (+2 more)

### Community 38 - "Production Readiness Checklist"
Cohesion: 0.17
Nodes (11): Comandos útiles, ✅ Completado, Decisiones técnicas (NO cambiar sin ADR), 🔄 En progreso, Fase 1: Stabilize & Monitor (2-3 semanas en staging), Fase 2: Polish Before Live, Fase 3: Before Go-Live, Production Readiness Checklist (+3 more)

### Community 39 - "FS-007 — API Endpoints"
Cohesion: 0.18
Nodes (10): Base, Endpoints, Entities, Error Handling, FS-007 — API Endpoints, Obligations (FS-017), Overview, Security Rules (SEC-001, SEC-002) (+2 more)

### Community 40 - "Pasos"
Cohesion: 0.18
Nodes (10): 1. Conectar Render a GitHub, 2. Configurar Web Service, 3. Environment Variables, 4. Deploy, 5. Configurar Clerk, 6. Test, Deploy a Render, Pasos (+2 more)

### Community 45 - "Prompt para Claude Chrome Extension — Verificación Bluehost"
Cohesion: 0.29
Nodes (6): ACCIONES SI FALLA, ALTERNATIVA RÁPIDA (versión corta), ESTADO ESPERADO CUANDO TODO FUNCIONA, NOTAS, PROMPT COMPLETO (Copiar y pegar en Claude Chrome), Prompt para Claude Chrome Extension — Verificación Bluehost

### Community 46 - "Fix Applied"
Cohesion: 0.29
Nodes (6): Changes Made, Files Modified, Fix Applied, Status, Task 8 — Dark Mode Support for HistorialTab, Testing Checklist

## Knowledge Gaps
- **340 isolated node(s):** `BLUEHOST_DEPLOY.sh script`, `openapi`, `client`, `Customer`, `Document` (+335 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `accessibleEntityIds()` connect `accessibleEntityIds` to `app/page.tsx`, `upload/route.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `getUserAccess()` connect `accessibleEntityIds` to `app/page.tsx`, `upload/route.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `BLUEHOST_DEPLOY.sh script`, `openapi`, `client` to the rest of the system?**
  _340 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `accessibleEntityIds` be split into smaller, more focused modules?**
  _Cohesion score 0.07875457875457875 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05878084179970972 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._