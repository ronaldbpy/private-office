## Contexto para agentes de código (Claude Code, Cursor, etc.)

Antes de tocar código en este proyecto, leé `docs/12_PROMPTS/PROMPT-000_MASTER_CONTEXT.md` y `docs/AI_DEVELOPMENT_CONTEXT.md`.

## Decisión técnica fijada — NO actualizar sin confirmar con el owner

- **Prisma: fijado en versión 6.x (`prisma@6`, `@prisma/client@6`).**
  Prisma 7 (lanzado nov. 2025) rediseñó por completo la configuración de
  conexión (requiere `prisma.config.ts` + adaptadores de driver por base
  de datos) y todavía tiene documentación y tutoriales inmaduros a la
  fecha de este proyecto (julio 2026). Prisma CLI va a sugerir actualizar
  a la 7 en cada `generate`/`migrate` — **ignorar esa sugerencia** hasta
  que el ecosistema madure y se tome una decisión explícita (requeriría
  su propio ADR).

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
  `Cannot read properties of undefined` al usar un modelo nuevo.
