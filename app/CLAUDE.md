## Contexto para agentes de código (Claude Code, Cursor, etc.)

Antes de tocar código en este proyecto, leé `docs/12_PROMPTS/PROMPT-000_MASTER_CONTEXT.md` y `docs/AI_DEVELOPMENT_CONTEXT.md`.

## ⚠️ No corras dos sesiones de agente en paralelo sobre esta carpeta

El 2026-07-25 quedó un archivo (`app/lib/entityColors.ts`) escrito por una
sesión de Claude Code que se quedó sin tokens a mitad de tarea, mientras otra
sesión (vía chat, con herramientas de filesystem/terminal) trabajaba al mismo
tiempo sobre el mismo repo y resolvía el mismo problema de otra forma. El
archivo quedó huérfano (sin usar, sin commitear) hasta que apareció por
casualidad en un `git add -A`. No causó daño esta vez, pero es una fuente
real de conflictos silenciosos. Si vas a usar Claude Code en esta carpeta,
confirmá primero que no haya otra sesión de IA activa sobre el mismo
directorio, y revisá `git status`/`git log` al empezar.

## Decisiones técnicas fijadas — NO cambiar sin confirmar con el owner

- **Prisma: fijado en versión 6.x (`prisma@6`, `@prisma/client@6`).** Prisma 7
  (lanzado nov. 2025) todavía tiene documentación y tutoriales inmaduros a la
  fecha de este proyecto (julio 2026). El Prisma CLI va a sugerir actualizar
  a la 7 en cada `generate`/`migrate` — **ignorar esa sugerencia** hasta que
  el ecosistema madure y se tome una decisión explícita (requeriría su propio
  ADR). Esto sigue vigente.

- **Configuración vía `prisma.config.ts` (desde 2026-07-25), NO
  `package.json#prisma`.** Esto es distinto de subir a Prisma 7 — es un
  formato que Prisma 6.x ya soporta y va a exigir en la v7; migrarlo ahora
  solo elimina el warning de deprecación, no cambia versiones ni comportamiento.
  **Importante:** el formato nuevo NO carga `.env` automáticamente como hacía
  el viejo — por eso `prisma.config.ts` empieza con `import "dotenv/config"`.
  Si ese import se borra, `prisma db push`/`migrate` fallan con
  `Environment variable not found: DATABASE_URL` (el seed corrido vía `tsx`
  no se ve afectado porque `tsx` carga `.env` por su cuenta).

- **Cambios de esquema: usar `npx prisma db push`, NO `npx prisma migrate dev`.**
  La base de Render no otorga permisos de superusuario al usuario de la app,
  y `migrate dev` necesita terminar procesos para crear su "shadow database"
  de comparación — falla con `permission denied to terminate process`.
  Mientras el proyecto esté en desarrollo (sin producción real todavía),
  `db push` sincroniza el esquema directo, sin ese paso. Antes de la primera
  release a producción (ver DEP-001), se debe retomar un proceso formal de
  migraciones versionadas — requiere su propia decisión/ADR en ese momento.

- **Después de cualquier cambio a `prisma/schema.prisma`, reiniciar el
  servidor de desarrollo** (`Ctrl+C` y de nuevo `npm run dev`), y si hace
  falta correr `npx prisma generate` a mano. El servidor mantiene en memoria
  la versión vieja del cliente Prisma; sin reinicio, tira
  `Cannot read properties of undefined` al usar un modelo nuevo. Si el
  reinicio normal no alcanza (Turbopack a veces queda con caché corrupta),
  `rm -rf .next` antes de `npm run dev` suele resolverlo. Si el puerto 3000
  queda "trabado" después de un `Ctrl+C`, buscar procesos huérfanos con
  `lsof -i :3000` / `ps -ef | grep next-server` y matarlos a mano — puede
  quedar un `next-server` corriendo sin que el `npm run dev` padre lo sepa.

## ⚠️ `npm install` instala paquetes de menos (silenciosamente) — CAUSA RAÍZ ENCONTRADA

Este equipo tiene **`NODE_ENV=production` seteado a nivel de sistema/shell**
(no en ningún dotfile del proyecto — revisar con `echo $NODE_ENV`; Next.js ya
avisa esto como "non-standard NODE_ENV" en cada arranque). Con eso seteado,
`npm install` aplica su default `--omit=dev` **silenciosamente**: no avisa,
no tira error, simplemente no instala ninguna devDependency ni nada que
solo se necesite transitivamente desde una devDependency.

Esto rompió dos cosas reales el 2026-07-25:
- `@types/node`, `@types/react`, `@types/react-dom` (devDependencies
  directas) — `tsc` tiraba cientos de "Cannot find module".
- `lightningcss` (solo necesario vía `@tailwindcss/postcss`, que es
  devDependency) — la app crasheaba al renderizar `globals.css` con
  `Cannot find module '../lightningcss.darwin-arm64.node'`.

**Solución: siempre instalar con `npm install --include=dev`** (no alcanza
con un `npm install` normal mientras esa variable de entorno siga seteada).
No se tocó la variable de entorno del sistema — puede estar ahí por otra
razón ajena a este proyecto; el flag es la forma segura de evitar el
problema sin tocar nada fuera de este repo.

## Arquitectura vigente que conviene conocer antes de tocar código

- **Acceso en cascada por holding (ADR-007, `lib/access.ts`).** Un
  `UserAccess` con `cascadesToSubsidiaries: true` sobre una entidad extiende
  el acceso automáticamente a toda entidad donde esa entidad figura como
  `owner` en `OwnershipInterest` (un solo nivel, no recursivo). No asumir que
  el acceso de un usuario es solo lo que tiene como `UserAccess` directo —
  siempre pasar por `getUserAccess()`, nunca consultar `user_access` a mano.
- **`OwnershipInterest.owner` puede ser una `Entity` O un `Party`**
  (`ownerId` / `ownerPartyId`, exactamente uno poblado). Ver ADR-007.
- **Vault (`FS-016`) usa disco local (`.vault-storage/`, gitignored) como
  storage v1**, deliberadamente, hasta decidir un object storage real por
  ADR (ver nota en `prisma/schema.prisma` sobre el modelo `Document`). No
  asumir que hay S3/R2 configurado.
- Estructura del grupo constructor (6 empresas, `pending_incorporation`,
  RUC placeholder) documentada en ADR-006.
