# Private Office — app

Implementación en código del [Private Office Documentation Pack](../docs/README.md)
(el conjunto de documentos MD/FS/ADR/etc. es la fuente de verdad del producto
— ver [ADR-001](../docs/06_ADR/ADR-001_DOCUMENTATION_AS_SOURCE_OF_TRUTH.md)).
No se debe implementar nada acá que contradiga esos documentos sin antes
actualizarlos.

**Antes de tocar código con un agente de IA (Claude Code, Cursor, etc.), leé
[`CLAUDE.md`](./CLAUDE.md)** — tiene decisiones técnicas fijadas y errores
comunes ya resueltos que ahorran tiempo real.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- Prisma 6.x + PostgreSQL (Render)
- Clerk (autenticación — ver [ADR-004](../docs/06_ADR/ADR-004_IDENTITY_PROVIDER_SELECTION.md))

## Primeros pasos

```bash
npm install
cp .env.example .env.local   # completar con las credenciales reales (Clerk + DATABASE_URL)
npx prisma db push           # sincroniza el schema con la base (NO usar `migrate dev` — ver CLAUDE.md)
npx prisma db seed           # carga los datos base del Grupo (entidades, ownership, accesos)
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

**Gotcha frecuente:** después de cualquier cambio a `prisma/schema.prisma`
hay que reiniciar `npm run dev` (`Ctrl+C` y de nuevo) — el servidor mantiene
el cliente de Prisma viejo en memoria. Detalle completo en `CLAUDE.md`.

## Qué hay implementado hoy

**Core Features (UI + API):**
- **FS-001** Entities directory & details (list empresas, info, quick nav)
- **FS-002** Timeline auditoría (event sourcing, UI component, 12+ eventos por entity)
- **FS-003** Holdings/Ownership (estructura propiedad, participaciones, verificación)
- **FS-004** Parties/Contactos (directorio, CRUD, tipos relación, banking details)
- **FS-005** Identity, roles & access (`lib/access.ts`, cascada de acceso)
- **FS-006** Treasury (saldos bancarios, movimientos, balance tracking)
- **FS-007** API Endpoints (15+ read/write endpoints, access control)
- **FS-013** Projects & Tasks (list/detail, CRUD, status/priority, comments)
- **FS-016** Vault (upload/download documentos, storage local v1)
- **FS-017** Obligaciones tributarias (lista, due rules, confirmation state)
- **FS-019** Intelligence (reportes Claude AI, treasury/risk/obligation analysis)

**Navigation:**
- Navbar: Home → Entidades → Proyectos → Contactos → Documentos → IA → Propiedad
- 6 full-featured pages + home dashboard + detail views

## Estructura

```
app/            rutas (App Router) — page.tsx, api/, sign-in/
components/     componentes de cliente reutilizables
lib/            acceso, Prisma client, utilidades de fecha, Vault storage
prisma/         schema.prisma, seed.ts, prisma.config.ts
```
