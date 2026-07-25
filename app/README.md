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

- **FS-003** Estructura de propiedad (holdings, participaciones, cascada de
  acceso — ver [ADR-006](../docs/06_ADR/ADR-006_CONSTRUCTION_GROUP_HOLDING_STRUCTURE.md)
  y [ADR-007](../docs/06_ADR/ADR-007_CASCADING_HOLDING_ACCESS.md)).
- **FS-004** Contactos (parties externos, sin login).
- **FS-005** Identidad, roles y acceso (`lib/access.ts`).
- **FS-016** Vault — subida/descarga de documentos con control de acceso.
  Storage v1 es disco local (`.vault-storage/`, gitignored) — placeholder
  deliberado hasta decidir un object storage real por ADR.
- **FS-017** Obligaciones tributarias, agrupadas por código de vencimiento.
- **FS-001 / FS-002** (versiones livianas) Cola de atención y actividad
  reciente, ambas derivadas de datos ya existentes, sin tablas nuevas.

## Estructura

```
app/            rutas (App Router) — page.tsx, api/, sign-in/
components/     componentes de cliente reutilizables
lib/            acceso, Prisma client, utilidades de fecha, Vault storage
prisma/         schema.prisma, seed.ts, prisma.config.ts
```
