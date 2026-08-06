# Changelog — Private Office

## [1.3.0] — 2026-08-06

**Session:** Complete UI implementation for 6 FS. Total: 11 FS functional end-to-end.

### Added

#### Features (FS Complete)
- **FS-013** Projects & Tasks management UI
  - `/projects` — list projects by entity with progress tracking
  - `/projects/[id]` — project detail with tasks grouped by status
  - Task creation, status update (open → in_progress → completed → closed)
  - Priority badges (baja/media/alta/urgente), due dates, descriptions
  - API: GET/POST /projects, GET/POST /tasks, PATCH /tasks/[id]

- **FS-004** Parties (Contacts) directory
  - `/parties` — list contacts grouped by relationship type
  - `/parties/[id]` — contact detail, edit name/email/phone
  - Support for banking details, entity links
  - API: GET/POST /parties, GET/PATCH /parties/[id]

- **FS-016** Vault (Documents) UI
  - `/documents` — document listing with file size, dates, entity links
  - File upload, download functionality
  - API: GET /documents (with pagination support)

- **FS-019** Intelligence (AI Reports) Dashboard
  - `/intelligence` — generate reports (treasury/risk/obligation types)
  - `/intelligence/[id]` — report detail with full analysis
  - Claude Opus 4.1 integration for AI-generated insights
  - API: GET/POST /intelligence, GET /intelligence/[id]

- **FS-003** Holdings (Ownership) Structure
  - `/holdings` — visualize ownership participations by owner
  - Active vs historical participations, verification state
  - Interest types: equity, economic rights, voting control
  - API: GET /holdings with entity + party ownership

- **FS-001** Entities Directory
  - `/entities` — list all companies/profiles with status
  - `/entities/[id]` — entity detail, quick nav to holdings/projects/intelligence
  - Color tokens for visual identification
  - API: GET /entities (already existed)

#### Navigation
- Navbar: Home → Entidades → Proyectos → Contactos → Documentos → IA → Propiedad
- All main pages accessible from top navigation

#### Documentation
- **README.md** — updated with 11 complete FS
- **STATUS.md** — pending features, architecture decisions, next steps
- **CHANGELOG.md** — this file

### Changed
- App structure: Added 6 new pages + 6 new API endpoints
- Navbar component: Now includes 7 navigation links (was 2)

### Fixed
- Next.js 16 `params` is Promise — fixed in API routes with `await params`
- Token usage optimization for caveman mode documentation

### Technical Details

**Added 6 Full Pages:**
- `app/app/entities/page.tsx` + `[id]/page.tsx`
- `app/app/projects/page.tsx` + `[id]/page.tsx`
- `app/app/parties/page.tsx` + `[id]/page.tsx`
- `app/app/documents/page.tsx`
- `app/app/intelligence/page.tsx` + `[id]/page.tsx`
- `app/app/holdings/page.tsx`

**Added API Endpoints:**
- `GET/POST /api/v1/projects` — project CRUD
- `GET /api/v1/projects/[id]` — project detail
- `GET/POST /api/v1/tasks` — task list + create
- `GET/PATCH /api/v1/tasks/[id]` — task detail + update status/priority
- `GET/POST /api/v1/parties` — contacts CRUD
- `GET/PATCH /api/v1/parties/[id]` — contact detail
- `GET /api/v1/intelligence/[id]` — report detail
- `GET /api/v1/holdings` — ownership structure

**Commits (6 total):**
1. `1382c12` — FS-013 Projects UI
2. `acd42e3` — FS-004 Parties UI
3. `97b3b46` — FS-016 Vault UI
4. `4fece13` — FS-019 Intelligence UI
5. `e363979` — FS-003 Holdings UI
6. `01f5c42` — FS-001 Entities UI

### Dependencies (No Changes)
- Next.js 16, Prisma 6.x, Clerk, Anthropic SDK already in place

## [1.2.0] — 2026-07-25

**Previous Session:** FS-002, FS-006, FS-007, FS-013 API + Task schema

### Features
- FS-002: Timeline events (event-sourcing)
- FS-006: Treasury UI component
- FS-007: API endpoints (15+)
- FS-013: Task schema + API (schema.prisma, seed.ts)

### Fixes
- NODE_ENV=production npm install issue (documented in CLAUDE.md)
- DEV_BYPASS mode for local testing without Clerk
- Prisma 6.x configured (prisma.config.ts migration)

---

**Version Scheme:** MAJOR.MINOR.PATCH following semver-ish conventions
- MAJOR: New FS complete (FS-xxx finished)
- MINOR: Infrastructure/API updates
- PATCH: Bug fixes, documentation

**Commits tracked:** Full git log available via `git log --oneline`
