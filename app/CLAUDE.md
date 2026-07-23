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
